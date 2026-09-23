import { api } from '../lib/api.js';
export const systemApi = {
  health: signal => api('/health', { signal }),
  ready: signal => api('/ready', { signal }),
};
