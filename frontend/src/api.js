import axios from 'axios';

export const API_BASE = (
  import.meta.env.VITE_API_BASE_URL ||
  'https://o2o-campaigner.onrender.com/api/v1'
).replace(/\/+$/, '');

export const TOKEN_KEY = 'o2o_access_token';

const client = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

client.interceptors.request.use((config) => {
  const token = sessionStorage.getItem(TOKEN_KEY);

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

client.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    const detail = error?.response?.data?.detail;

    const message =
      typeof detail === 'string'
        ? detail
        : Array.isArray(detail)
          ? detail
              .map((item) => item.msg || JSON.stringify(item))
              .join(', ')
          : detail
            ? JSON.stringify(detail)
            : error?.code === 'ECONNABORTED'
              ? 'The API request timed out. Please try again.'
              : error?.message || 'Network request failed.';

    const normalized = new Error(message);
    normalized.status = status;
    normalized.data = error?.response?.data;
    normalized.originalError = error;

    return Promise.reject(normalized);
  },
);

async function unwrap(promise) {
  const response = await promise;
  return response.status === 204 ? null : response.data;
}

export const api = {
  get: (path, config) => unwrap(client.get(path, config)),
  post: (path, body, config) => unwrap(client.post(path, body, config)),
  put: (path, body, config) => unwrap(client.put(path, body, config)),
  patch: (path, body, config) => unwrap(client.patch(path, body, config)),
  delete: (path, config) => unwrap(client.delete(path, config)),
};
export const adminLogin = (email, password) =>
  api.post('/auth/login', { email, password });

export const getCurrentUser = () =>
  api.get('/auth/me');

export const getAdminDashboard = (params = {}) =>
  api.get('/admin/dashboard', { params });

export const getAdminMerchants = (params = {}) =>
  api.get('/admin/merchants', { params });

export const deactivateAdminMerchant = (merchantId) =>
  api.delete(`/admin/merchants/${encodeURIComponent(merchantId)}`);

export const restoreAdminMerchant = (merchantId) =>
  api.post(
    `/admin/merchants/${encodeURIComponent(merchantId)}/restore`,
    {},
  );

export const getAdminPendingStores = (params = {}) =>
  api.get('/admin/stores/pending', { params });

export const reviewAdminStore = (storeId, decision, reason) => {
  if (!['approve', 'reject'].includes(decision)) {
    return Promise.reject(
      new Error('Decision must be "approve" or "reject".'),
    );
  }

  if (decision === 'reject' && !String(reason || '').trim()) {
    return Promise.reject(
      new Error('A reason is required when rejecting a store.'),
    );
  }

  return api.patch(
    `/admin/stores/${encodeURIComponent(storeId)}/verification`,
    {
      decision,
      ...(decision === 'reject'
        ? { reason: String(reason).trim() }
        : {}),
    },
  );
};

export const deleteAdminStore = (storeId) =>
  api.delete(`/admin/stores/${encodeURIComponent(storeId)}`);

export const getDeletedAdminStores = (params = {}) =>
  api.get('/admin/stores/deleted', { params });

export const restoreAdminStore = (storeId) =>
  api.post(
    `/admin/stores/${encodeURIComponent(storeId)}/restore`,
    {},
  );

export const getStoreCategories = () =>
  api.get('/merchant/stores/categories');

export const getBrowserLocation = () =>
  new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(
        new Error('Geolocation is not supported by this browser.'),
      );
      return;
    }

    navigator.geolocation.getCurrentPosition(
      ({ coords }) =>
        resolve({
          latitude: coords.latitude,
          longitude: coords.longitude,
          lat: coords.latitude,
          lng: coords.longitude,
          accuracy: coords.accuracy,
        }),
      (error) =>
        reject(
          new Error(
            error.code === error.PERMISSION_DENIED
              ? 'Location permission was denied. Allow location access in your browser settings.'
              : error.message || 'Could not determine your location.',
          ),
        ),
      {
        enableHighAccuracy: true,
        timeout: 12000,
        maximumAge: 60000,
      },
    );
  });

export const formatMoneyPaise = (value) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
  }).format((Number(value) || 0) / 100);

export const formatMoneyRupees = (value) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
  }).format(Number(value) || 0);

export default api;
