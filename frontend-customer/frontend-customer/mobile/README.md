# Aurelia customer app (Expo)

This Expo app uses React Native primitives and runs on Android/iOS with Expo Go and on web with React Native Web.

## Setup

```bash
npm install
npx expo install --fix
```

Configure `EXPO_PUBLIC_API_URL` in `.env`. For a physical phone, use the computer's LAN IPv4 address, e.g. `http://192.168.1.10:4000`; do not use `localhost` on a phone.

## Run

```bash
npx expo start       # Expo Go
npx expo start --web # browser
```

Start the root booking API (`npm run api`) before submitting reservations.
