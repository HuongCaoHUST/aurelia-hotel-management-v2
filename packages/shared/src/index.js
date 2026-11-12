export function createWebStorage() {
  return {
    getAccessToken: () => localStorage.getItem('accessToken'),
    setAccessToken: (token) => localStorage.setItem('accessToken', token),
    clear: () => localStorage.removeItem('accessToken'),
  };
}

export function createHttpClient({ baseUrl = '', getAccessToken } = {}) {
  const request = async (path, options = {}, responseType = 'json') => {
    const token = getAccessToken?.();
    const isFormData = typeof FormData !== 'undefined' && options.body instanceof FormData;
    const response = await fetch(`${baseUrl}${path}`, {
      ...options,
      headers: {
        ...(!isFormData ? { 'Content-Type': 'application/json' } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
      },
    });
    if (!response.ok) {
      let payload = null;
      try {
        payload = await response.json();
      } catch {
        // Some proxy and empty responses do not contain a JSON error body.
      }
      const fallbackMessages = {
        400: 'Dữ liệu không hợp lệ.',
        401: 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.',
        403: 'Bạn không có quyền thực hiện thao tác này.',
        404: 'Không tìm thấy dữ liệu yêu cầu.',
        409: 'Dữ liệu đã tồn tại hoặc đang bị xung đột.',
        413: 'Tệp tải lên vượt quá dung lượng cho phép.',
        415: 'Định dạng tệp không được hỗ trợ.',
        500: 'Máy chủ đang gặp lỗi. Vui lòng thử lại.',
        502: 'Máy chủ đang khởi động hoặc tạm thời không khả dụng.',
      };
      const error = new Error(payload?.message || payload?.detail || fallbackMessages[response.status] || 'Không thể hoàn tất yêu cầu.');
      error.status = response.status;
      throw error;
    }
    if (response.status === 204) return null;
    return responseType === 'blob' ? response.blob() : response.json();
  };

  return {
    get: (path) => request(path),
    getBlob: (path) => request(path, {}, 'blob'),
    post: (path, body) => request(path, {
      method: 'POST',
      body: typeof FormData !== 'undefined' && body instanceof FormData ? body : JSON.stringify(body),
    }),
    put: (path, body) => request(path, { method: 'PUT', body: JSON.stringify(body) }),
    delete: (path) => request(path, { method: 'DELETE' }),
  };
}

export function createAuthApi(http) {
  return {
    login: (data) => http.post('/auth/login', data),
    me: () => http.get('/auth/me'),
  };
}

export function createAuthService({ api, storage }) {
  return {
    login: async (data) => {
      const result = await api.login(data);
      const accessToken = result?.accessToken || result?.token;
      if (accessToken) storage.setAccessToken(accessToken);

      return {
        ...result,
        accessToken,
        user: result?.user || {
          fullName: result?.fullName,
          roles: result?.roles || [],
          permissions: result?.permissions || [],
        },
      };
    },
    currentUser: () => api.me(),
    hasSession: () => Boolean(storage.getAccessToken()),
    logout: () => storage.clear(),
  };
}
