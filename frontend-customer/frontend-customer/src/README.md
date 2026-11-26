# Customer frontend

The original Aurelia website runs with React + Vite. Its reservation form now calls `src/lib/api.js`, which sends bookings to the root Node.js API.

For setup and run commands for the website, Expo Go app, Expo web app, and SQLite database, see the root `README.md`.

The Expo app lives in `mobile/` and uses React Native components. The website and Expo app share the same booking API and server-side SQLite database.
