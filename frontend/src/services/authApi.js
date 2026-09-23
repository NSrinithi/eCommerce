import { api } from '../lib/api.js';
export const authApi = {
  me: signal => api('/auth/me', { signal }),
  register: data => api('/auth/register', { method: 'POST', data }),
  login: data => api('/auth/login', { method: 'POST', data }),
  logout: () => api('/auth/logout', { method: 'POST' }),
  updateProfile: data => api('/auth/me', { method: 'PATCH', data }),
};
