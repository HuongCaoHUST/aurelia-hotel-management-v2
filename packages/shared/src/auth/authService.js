export function createAuthService({ api, storage }) {
  return {
    async login(credentials) {
      const result = await api.login(credentials);
      await storage.saveTokens(result);
      return result;
    },

    async refresh() {
      const refreshToken = await storage.getRefreshToken();
      if (!refreshToken) return null;

      const result = await api.refresh(refreshToken);
      const currentRefreshToken = await storage.getRefreshToken();
      await storage.saveTokens({
        accessToken: result.accessToken,
        refreshToken: currentRefreshToken,
      });
      return result;
    },

    logout: async () => {
      try { await api.logout(); } finally { await storage.clearTokens(); }
    },
  };
}
