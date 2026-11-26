'use strict';

const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const { DatabaseSync } = require('node:sqlite');

// Load a local .env file without adding another runtime dependency.
const envPath = path.join(__dirname, '.env');
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, 'utf8').split(/\r?\n/)) {
    const match = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*?)\s*$/);
    if (match && process.env[match[1]] === undefined) {
      process.env[match[1]] = match[2].replace(/^(['"])(.*)\1$/, '$2');
    }
  }
}

const PORT = Number(process.env.API_PORT || 4000);
const HOST = process.env.API_HOST || '0.0.0.0';
const ADMIN_API_KEY = process.env.ADMIN_API_KEY || 'change-this-admin-key';
const DB_DIR = path.join(__dirname, 'data');
const DB_PATH = path.join(DB_DIR, 'aurelia.sqlite');
const MAX_BODY_BYTES = 64 * 1024;

fs.mkdirSync(DB_DIR, { recursive: true });
const db = new DatabaseSync(DB_PATH);
db.exec(`
  PRAGMA journal_mode = WAL;
  PRAGMA foreign_keys = ON;
  CREATE TABLE IF NOT EXISTS reservations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    customer_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    check_in TEXT NOT NULL,
    check_out TEXT NOT NULL,
    adults INTEGER NOT NULL,
    children INTEGER NOT NULL,
    room_count INTEGER NOT NULL,
    room_type TEXT NOT NULL,
    nightly_rate INTEGER NOT NULL,
    nights INTEGER NOT NULL,
    total_price INTEGER NOT NULL,
    message TEXT NOT NULL DEFAULT '',
    created_at TEXT NOT NULL
  );
  CREATE INDEX IF NOT EXISTS idx_reservations_created_at ON reservations(created_at DESC);
`);

const ROOM_PRICES = {
  'Standard Room': 119,
  'Deluxe Room': 129,
  'Premier Room': 139,
  'Family Suite': 149,
  'Luxury Suite': 179,
  'Presidential Suite': 199,
};

function sendJson(res, statusCode, payload) {
  const body = JSON.stringify(payload);
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Content-Length': Buffer.byteLength(body),
    'Cache-Control': 'no-store',
  });
  res.end(body);
}

function applyCors(req, res) {
  const configured = (process.env.ALLOWED_ORIGINS || '*').split(',').map((value) => value.trim()).filter(Boolean);
  const origin = req.headers.origin;
  if (configured.includes('*')) {
    res.setHeader('Access-Control-Allow-Origin', '*');
  } else if (origin && configured.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Vary', 'Origin');
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-admin-key');
}

function readJson(req) {
  return new Promise((resolve, reject) => {
    let size = 0;
    const chunks = [];
    req.on('data', (chunk) => {
      size += chunk.length;
      if (size > MAX_BODY_BYTES) {
        reject(new Error('Request body is too large.'));
        req.destroy();
        return;
      }
      chunks.push(chunk);
    });
    req.on('end', () => {
      try {
        resolve(JSON.parse(Buffer.concat(chunks).toString('utf8') || '{}'));
      } catch {
        reject(new Error('Request body must be valid JSON.'));
      }
    });
    req.on('error', reject);
  });
}

function isValidDate(value) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const parsed = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value;
}

function validateReservation(input) {
  const customerName = String(input.name || '').trim();
  const email = String(input.email || '').trim().toLowerCase();
  const phone = String(input.phone || '').trim();
  const checkIn = String(input.checkIn || '');
  const checkOut = String(input.checkOut || '');
  const roomType = String(input.roomType || '');
  const adults = Number(input.adults);
  const children = Number(input.children ?? 0);
  const roomCount = Number(input.roomCount ?? 1);
  const message = String(input.message || '').trim().slice(0, 2000);

  if (customerName.length < 2 || customerName.length > 120) return { error: 'Please enter a name between 2 and 120 characters.' };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 160) return { error: 'Please enter a valid email address.' };
  if (phone.length < 7 || phone.length > 30) return { error: 'Please enter a valid phone number.' };
  if (!isValidDate(checkIn) || !isValidDate(checkOut)) return { error: 'Please enter valid check-in and check-out dates (YYYY-MM-DD).' };
  const nights = (Date.parse(`${checkOut}T00:00:00Z`) - Date.parse(`${checkIn}T00:00:00Z`)) / 86400000;
  if (nights < 1 || nights > 365) return { error: 'Check-out must be at least one night after check-in and no more than 365 nights later.' };
  if (!Number.isInteger(adults) || adults < 1 || adults > 20) return { error: 'Adults must be a whole number from 1 to 20.' };
  if (!Number.isInteger(children) || children < 0 || children > 20) return { error: 'Children must be a whole number from 0 to 20.' };
  if (!Number.isInteger(roomCount) || roomCount < 1 || roomCount > 10) return { error: 'Rooms must be a whole number from 1 to 10.' };
  if (!Object.hasOwn(ROOM_PRICES, roomType)) return { error: 'Please choose a valid room type.' };

  const nightlyRate = ROOM_PRICES[roomType];
  return {
    value: {
      customerName, email, phone, checkIn, checkOut,
      adults, children, roomCount, roomType,
      nightlyRate, nights, totalPrice: nightlyRate * nights * roomCount, message,
    },
  };
}

const insertReservation = db.prepare(`
  INSERT INTO reservations (
    customer_name, email, phone, check_in, check_out,
    adults, children, room_count, room_type, nightly_rate,
    nights, total_price, message, created_at
  ) VALUES (
    @customerName, @email, @phone, @checkIn, @checkOut,
    @adults, @children, @roomCount, @roomType, @nightlyRate,
    @nights, @totalPrice, @message, @createdAt
  )
`);

function publicReservation(row) {
  return {
    id: Number(row.id),
    bookingCode: `AUR-${new Date(row.created_at).getUTCFullYear()}-${String(row.id).padStart(6, '0')}`,
    name: row.customer_name,
    email: row.email,
    phone: row.phone,
    checkIn: row.check_in,
    checkOut: row.check_out,
    adults: Number(row.adults),
    children: Number(row.children),
    roomCount: Number(row.room_count),
    roomType: row.room_type,
    nightlyRate: Number(row.nightly_rate),
    nights: Number(row.nights),
    totalPrice: Number(row.total_price),
    currency: 'USD',
    message: row.message,
    createdAt: row.created_at,
  };
}

const server = http.createServer(async (req, res) => {
  applyCors(req, res);
  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  if (req.method === 'GET' && url.pathname === '/api/health') {
    sendJson(res, 200, { ok: true, service: 'aurelia-booking-api' });
    return;
  }

  if (req.method === 'POST' && url.pathname === '/api/reservations') {
    try {
      const input = await readJson(req);
      const validation = validateReservation(input);
      if (validation.error) {
        sendJson(res, 400, { error: validation.error });
        return;
      }
      const createdAt = new Date().toISOString();
      const result = insertReservation.run({ ...validation.value, createdAt });
      const row = db.prepare('SELECT * FROM reservations WHERE id = ?').get(Number(result.lastInsertRowid));
      sendJson(res, 201, {
        message: 'Your reservation has been saved successfully.',
        reservation: publicReservation(row),
      });
    } catch (error) {
      sendJson(res, 400, { error: error.message || 'Could not save reservation.' });
    }
    return;
  }

  if (req.method === 'GET' && url.pathname === '/api/admin/reservations') {
    if (!ADMIN_API_KEY || req.headers['x-admin-key'] !== ADMIN_API_KEY) {
      sendJson(res, 401, { error: 'Unauthorized. A valid x-admin-key is required.' });
      return;
    }
    const limit = Math.min(200, Math.max(1, Number(url.searchParams.get('limit')) || 100));
    const rows = db.prepare('SELECT * FROM reservations ORDER BY created_at DESC LIMIT ?').all(limit);
    sendJson(res, 200, { reservations: rows.map(publicReservation) });
    return;
  }

  sendJson(res, 404, { error: 'Route not found.' });
});

server.listen(PORT, HOST, () => {
  console.log(`Aurelia Booking API listening on http://${HOST}:${PORT}`);
  console.log(`SQLite database: ${DB_PATH}`);
  if (ADMIN_API_KEY === 'change-this-admin-key') {
    console.warn('WARNING: Set ADMIN_API_KEY in server/.env before exposing this API outside your local network.');
  }
});

function shutdown() {
  server.close(() => {
    db.close();
    process.exit(0);
  });
}
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
