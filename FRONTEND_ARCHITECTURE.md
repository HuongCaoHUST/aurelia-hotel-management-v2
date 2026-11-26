# Frontend architecture

The repository has separate React/Vite apps for customers and staff, plus a shared package for API and authentication logic:

```text
frontend-customer/       # React/Vite customer website; the original HTML template is in legacy/index.html
frontend-staff/          # staff React app
packages/shared/         # API client and authentication logic shared by future apps
```

## What belongs in `packages/shared`

- API requests and endpoint wrappers
- authentication and token storage contracts
- shared data models and validation later
- business rules that do not depend on the browser or React Native

## What stays inside an app

- pages, navigation and UI components
- CSS and responsive layout
- browser-specific APIs
- mobile-specific APIs such as secure storage, camera and push notifications

The shared package intentionally uses plain JavaScript and small factory functions. This keeps
the code easy to follow and lets a future React Native app provide its own token storage adapter.

## Adding a future app

Install or link `@aurelia/shared`, create a platform-specific storage adapter, then wire the app:

```js
const http = createHttpClient({
  baseUrl: API_BASE_URL,
  getAccessToken: () => storage.getAccessToken(),
});

const auth = createAuthService({
  api: createAuthApi(http),
  storage,
});
```

The app should not call `fetch` directly for authenticated API requests.


## Customer frontend migration status

The customer landing page is now composed from React components under `frontend-customer/src/components/customer/sections/`. The original CSS, fonts, images, and video remain under `frontend-customer/public/`; the source HTML is kept in `frontend-customer/legacy/index.html` for comparison. The original theme's jQuery plugins are loaded after React renders to preserve its slider and visual effects while the migration is incremental.

The reservation form currently provides browser validation and a clear frontend-preview message. It is not connected to a booking endpoint yet; wire it to the booking API before taking real reservations.
