# Customer frontend

The current customer site is still the original static template in `index.html`.
When converting a page to React, put it under this structure:

```text
src/
  app/          # app setup and providers
  pages/        # page-level components
  components/   # reusable web-only UI
  app/api.js     # app-specific API wiring
```

Shared API, authentication and business logic belongs in `../../packages/shared`.
Do not put `window`, `document`, CSS DOM code or `localStorage` in that shared package.
