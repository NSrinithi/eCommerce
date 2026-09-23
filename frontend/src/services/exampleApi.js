import { api } from '../lib/api.js';
export const exampleApi = {
  list: signal => api('/examples', { signal }),
  get: (id, signal) => api(`/examples/${id}`, { signal }),
  create: data => api('/examples', { method: 'POST', data }),
  update: (id, data) => api(`/examples/${id}`, { method: 'PATCH', data }),
  replace: (id, data) => api(`/examples/${id}`, { method: 'PUT', data }),
  remove: id => api(`/examples/${id}`, { method: 'DELETE' }),
};
