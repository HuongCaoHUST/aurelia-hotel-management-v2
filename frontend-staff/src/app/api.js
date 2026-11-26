import {
  createAuthApi,
  createAuthService,
  createHttpClient,
  createWebStorage,
} from '@aurelia/shared';
import { appConfig } from './config.js';

const storage = createWebStorage();
const http = createHttpClient({
  baseUrl: appConfig.apiBaseUrl,
  getAccessToken: () => storage.getAccessToken(),
});

export const authApi = createAuthApi(http);
export const authService = createAuthService({ api: authApi, storage });
export { http };
