export function createAuthApi(http) {
  return {
    login: (credentials) => http.post('/auth/login', credentials),
    register: (data) => http.post('/auth/register', data),
    profile: () => http.get('/auth/profile'),
    refresh: (refreshToken) => http.post('/auth/refresh', undefined, {
      authToken: refreshToken,
    }),
    logout: () => http.post('/auth/logout'),
  };
}
