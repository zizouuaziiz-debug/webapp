// ============================================================
// API Configuration
// ============================================================
// Set the URL of your deployed backend (Express API server)
// In development: the API runs locally (Vite proxies /api → backend)
// In production:  set VITE_API_URL to your backend URL on Railway/Render/etc.

import { setBaseUrl } from './custom-fetch';

const apiUrl = import.meta.env.VITE_API_URL ?? '';
setBaseUrl(apiUrl || null);
