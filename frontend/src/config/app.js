// Browser-safe values only. Never put MongoDB credentials or JWT secrets in VITE_* variables.
const env = import.meta.env || {};
export const appConfig = {
  name: env.VITE_APP_NAME || 'MERN Base',
  apiBaseUrl: (env.VITE_API_BASE_URL || '/api').replace(/\/$/, ''),
};
