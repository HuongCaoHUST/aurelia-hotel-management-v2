export function createMemoryStorage() {
  let tokens = null;

  return {
    async getAccessToken() { return tokens?.accessToken ?? null; },
    async getRefreshToken() { return tokens?.refreshToken ?? null; },
    async saveTokens(value) { tokens = value; },
    async clearTokens() { tokens = null; },
  };
}

export function createWebStorage(storage = globalThis.localStorage) {
  return {
    async getAccessToken() { return storage.getItem('aurelia.accessToken'); },
    async getRefreshToken() { return storage.getItem('aurelia.refreshToken'); },
    async saveTokens(value) {
      storage.setItem('aurelia.accessToken', value.accessToken);
      storage.setItem('aurelia.refreshToken', value.refreshToken);
    },
    async clearTokens() {
      storage.removeItem('aurelia.accessToken');
      storage.removeItem('aurelia.refreshToken');
    },
  };
}
