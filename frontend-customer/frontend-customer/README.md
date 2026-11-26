# Aurelia Hotel — Customer Web + Expo + Booking API

This project keeps the existing Aurelia React/Vite website and adds an Expo app that runs on Android/iOS (Expo Go) and in a browser. Both customer interfaces send bookings to the same Node.js API, which stores reservations in a SQLite database file on the server.

## Requirements

- Node.js **22.13 or later**. Expo SDK 58 uses Node 22.13+; this project also uses Node's built-in `node:sqlite` module.
- npm.
- Expo Go installed on an Android phone for mobile testing.

## 1. Install dependencies

Install the existing website dependencies:

```bash
npm install
```

Install the Expo app dependencies:

```bash
cd mobile
npm install
npx expo install --fix
cd ..
```

`npx expo install --fix` checks and aligns Expo dependencies with the installed Expo SDK.

## 2. Start the booking API (required for saving reservations)

In terminal 1, from the project root:

```bash
npm run api
```

The API listens on `http://localhost:4000`. Its SQLite database is created automatically at `server/data/aurelia.sqlite`.

Test the API in a browser:

```text
http://localhost:4000/api/health
```

The expected response is `{"ok":true,"service":"aurelia-booking-api"}`.

For admin access to the saved reservations endpoint, copy `server/.env.example` to `server/.env`, then change `ADMIN_API_KEY` to a long private value. The endpoint is `GET /api/admin/reservations` and requires that value in the `x-admin-key` request header. Do not put this key in the frontend or commit it to Git. To inspect saved bookings in PowerShell:

```powershell
$headers = @{ "x-admin-key" = "your-private-admin-key" }
Invoke-RestMethod -Uri "http://localhost:4000/api/admin/reservations" -Headers $headers
```

## 3. Start the existing Aurelia website

In terminal 2, from the project root:

```bash
npm run dev
```

Open the Vite URL printed in the terminal (normally `http://localhost:5173`). The web reservation form now sends the booking to the API and shows a booking code only after the server saves it.

## 4. Start the Expo app on a phone

First, find your computer's local IPv4 address:

```powershell
ipconfig
```

Look for the IPv4 address of the Wi-Fi/Ethernet adapter, for example `192.168.1.10`. Copy `mobile/.env.example` to `mobile/.env` and set:

```env
EXPO_PUBLIC_API_URL=http://192.168.1.10:4000
```

The phone and computer must be on the same Wi-Fi network. Allow Node.js through Windows Firewall on a private network if prompted. Make sure port 4000 is reachable from the phone.

In terminal 3:

```bash
cd mobile
npx expo start
```

Scan the QR code with Expo Go. The phone uses the computer's LAN IPv4 address to reach the booking API; `localhost` on a physical phone points to the phone itself, not your computer.

## 5. Run the Expo app in a browser

From the `mobile` folder:

```bash
npx expo start --web
```

This is the Expo version of the app rendered for the web. It uses the same reservation API as the native app.

You can run the Vite website, Expo app, and API at the same time in three terminals. Vite and Expo web are two browser frontends; use the Vite site to retain the original Aurelia landing page and Expo web to test the cross-platform app UI.

## How reservation persistence works

1. A customer submits the form from the website or Expo app.
2. The frontend sends `POST /api/reservations` to the API.
3. The API validates dates, contact details, room type, guest counts, calculates the total, and inserts the record into SQLite.
4. The API returns a booking code. The frontend displays the confirmation only after a successful database insert.
5. Reservation rows remain in `server/data/aurelia.sqlite` when the website, Expo client, or API process is restarted. Back up this database file regularly.

This SQLite database is a **server-side development/MVP database**, not the browser's localStorage and not a separate database per phone. Both frontends use the same server database. For a production hotel system with multiple server instances, use a managed PostgreSQL database, authentication, HTTPS, access controls, and a payment/availability workflow before accepting real bookings.

## API endpoints

| Method | Path | Purpose |
|---|---|---|
| GET | `/api/health` | Check that the API is online |
| POST | `/api/reservations` | Validate and save a new reservation |
| GET | `/api/admin/reservations` | List saved reservations; requires `x-admin-key` |

The API calculates the total price on the server using the room rates configured in `server/index.js`; it does not trust a total supplied by the frontend.

## Notes

- The original site template, styles, fonts, images, and Vite components are retained.
- The Expo app is implemented with React Native components so it can run in Expo Go and on web; the existing HTML/CSS components are not loaded into the native runtime.
- Expo SDK versions must match the Expo Go app installed on the phone. Keep Expo Go updated; on an iPhone, the App Store build may support a different SDK range than Android Expo Go, so check the compatibility message if scanning the QR code reports a version mismatch.
- The API binds to `0.0.0.0` in development so a phone on the same local network can reach it. Do not expose the development server directly to the public internet.
