export function createHttpClient({ baseUrl, getAccessToken, onUnauthorized } = {}) {
  async function request(path, options = {}) {
    const { authToken, ...fetchOptions } = options;
    const headers = new Headers(fetchOptions.headers);
    headers.set('Accept', 'application/json');

    if (fetchOptions.body && !(fetchOptions.body instanceof FormData)) {
      headers.set('Content-Type', 'application/json');
    }

    const token = authToken === undefined ? await getAccessToken?.() : authToken;
    if (token) headers.set('Authorization', `Bearer ${token}`);

    const response = await fetch(`${baseUrl}${path}`, { ...fetchOptions, headers });

    if (response.status === 401) {
      await onUnauthorized?.();
    }

    if (!response.ok) {
      const message = await response.text();
      throw new Error(message || `Request failed with status ${response.status}`);
    }

    if (response.status === 204) return null;
    return response.json();
  }

  return {
    get: (path, options) => request(path, { ...options, method: 'GET' }),
    post: (path, body, options) => request(path, {
      ...options,
      method: 'POST',
      body: body === undefined ? undefined : JSON.stringify(body),
    }),
    put: (path, body, options) => request(path, {
      ...options,
      method: 'PUT',
      body: body === undefined ? undefined : JSON.stringify(body),
    }),
    delete: (path, options) => request(path, { ...options, method: 'DELETE' }),
  };
}
