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
  create: (data) => http.post('/auth/staff', data),
  update: (id, data) => http.put(`/auth/staff/${id}`, data),
  avatar: (id) => http.getBlob(`/auth/staff/${id}/avatar`),
};
export const roomTypeApi = {
  list: () => http.get('/room-types'),
  create: (data) => http.post('/room-types', data),
  update: (id, data) => http.put(`/room-types/${id}`, data),
};
export const roomApi = {
  list: () => http.get('/rooms'),
  create: (data) => http.post('/rooms', data),
  image: (roomId, photoId) => http.getBlob(`/rooms/${roomId}/images/${photoId}`),
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
