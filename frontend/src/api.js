
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

// Attach the logged-in user's token to protected API requests.
client.interceptors.request.use((config) => {
  const token = sessionStorage.getItem(TOKEN_KEY);

  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Convert API errors into readable messages.
client.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    const detail = error?.response?.data?.detail;

    let message;

    if (typeof detail === 'string') {
      message = detail;
    } else if (Array.isArray(detail)) {
      message = detail
        .map((item) => item.msg || JSON.stringify(item))
        .join(', ');
    } else if (detail) {
      message = JSON.stringify(detail);
    } else if (status === 401) {
      message = 'Your session has expired or you are not logged in. Please sign in again.';
    } else if (status === 403) {
      message = 'You do not have permission to perform this action.';
    } else if (status === 404) {
      message = 'The requested API route or record was not found. Check the request URL.';
    } else if (status === 409) {
      message = 'This action conflicts with the current offer or voucher status.';
    } else if (status === 422) {
      message = 'Some request fields are invalid. Please check your inputs.';
    } else if (error?.code === 'ECONNABORTED') {
      message = 'The API request timed out. Please try again.';
    } else if (!error?.response) {
      message = 'Could not connect to the API. Check your internet connection and server.';
    } else {
      message = error?.message || 'Network request failed.';
    }

    const normalized = new Error(message);
    normalized.status = status;
    normalized.data = error?.response?.data;
    normalized.originalError = error;

    return Promise.reject(normalized);
  },
);

// Return response data directly to the React components.
async function unwrap(promise) {
  const response = await promise;
  return response.status === 204 ? null : response.data;
}

export const api = {
  get: (path, config) => unwrap(client.get(path, config)),
  post: (path, body, config) =>
    unwrap(client.post(path, body, config)),
  put: (path, body, config) =>
    unwrap(client.put(path, body, config)),
  patch: (path, body, config) =>
    unwrap(client.patch(path, body, config)),
  delete: (path, config) =>
    unwrap(client.delete(path, config)),
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
  api.delete(
    `/admin/merchants/${encodeURIComponent(merchantId)}`,
  );

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
    if (!('geolocation' in navigator)) {
      reject(
        new Error(
          'Geolocation is not supported by this browser. Enter coordinates manually.',
        ),
      );
      return;
    }

    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        resolve({
          latitude: coords.latitude,
          longitude: coords.longitude,
          lat: coords.latitude,
          lng: coords.longitude,
          accuracy: coords.accuracy,
        });
      },
      (error) => {
        let message;

        switch (error.code) {
          case 1:
            message =
              'Location permission was denied. Allow location access for this site in your browser settings, then try again.';
            break;
          case 2:
            message =
              'Your current location could not be determined. Check device location services or enter coordinates manually.';
            break;
          case 3:
            message =
              'Location lookup timed out. Try again or enter coordinates manually.';
            break;
          default:
            message = error.message || 'Could not determine your location.';
        }

        reject(new Error(message));
      },
      {
        enableHighAccuracy: true,
        timeout: 20000,
        maximumAge: 0,
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
