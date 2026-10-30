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
export const staffApi = {
  list: () => http.get('/auth/staff'),
  invite: (data) => http.post('/auth/staff/invite', data),
  update: (id, data) => http.put(`/auth/staff/${id}`, data),
};
export const amenityApi = {
  groups: () => http.get('/amenities/groups'),
  createGroup: (data) => http.post('/amenities/groups', data),
  updateGroup: (id, data) => http.put(`/amenities/groups/${id}`, data),
  deleteGroup: (id) => http.delete(`/amenities/groups/${id}`),
  list: () => http.get('/amenities'),
  create: (data) => http.post('/amenities', data),
  update: (id, data) => http.put(`/amenities/${id}`, data),
  delete: (id) => http.delete(`/amenities/${id}`),
};
export { http };
