import axios from 'axios';
import { API_BASE_URL, STORAGE_KEYS, CACHE_CONFIG } from '../utils/constants';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// In-memory cache for API responses
const cache = new Map();

// Cache utilities
const getCacheKey = (url, params = {}) => {
  const paramString = Object.keys(params).length > 0 ? JSON.stringify(params) : '';
  return `${url}${paramString}`;
};

const isValidCache = (cacheEntry) => {
  if (!cacheEntry) return false;
  return Date.now() - cacheEntry.timestamp < cacheEntry.ttl;
};

const setCache = (key, data, ttl = CACHE_CONFIG.DEFAULT_TTL) => {
  cache.set(key, {
    data,
    timestamp: Date.now(),
    ttl
  });
};

const getCache = (key) => {
  const cacheEntry = cache.get(key);
  if (isValidCache(cacheEntry)) {
    return cacheEntry.data;
  }
  // Remove expired cache
  if (cacheEntry) {
    cache.delete(key);
  }
  return null;
};

// Clear cache by pattern
const clearCachePattern = (pattern) => {
  for (const key of cache.keys()) {
    if (key.includes(pattern)) {
      cache.delete(key);
    }
  }
};

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
        if (refreshToken) {
          const response = await axios.post(`${API_BASE_URL}/api/auth/refresh`, {
            refresh_token: refreshToken
          });

          const { access_token, refresh_token } = response.data;
          localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, access_token);
          localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refresh_token);

          originalRequest.headers.Authorization = `Bearer ${access_token}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed, redirect to login
        localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
        localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
        localStorage.removeItem(STORAGE_KEYS.USER_DATA);
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

// API methods with caching
export const apiService = {
  // Generic GET with caching
  async get(url, params = {}, options = {}) {
    const { 
      useCache = true, 
      cacheTTL = CACHE_CONFIG.DEFAULT_TTL,
      forceRefresh = false 
    } = options;

    const cacheKey = getCacheKey(url, params);
    
    // Return cached data if available and not forcing refresh
    if (useCache && !forceRefresh) {
      const cachedData = getCache(cacheKey);
      if (cachedData) {
        return { data: cachedData, fromCache: true };
      }
    }

    try {
      const response = await api.get(url, { params });
      
      // Cache successful responses
      if (useCache && response.status === 200) {
        setCache(cacheKey, response.data, cacheTTL);
      }
      
      return { data: response.data, fromCache: false };
    } catch (error) {
      throw this.handleError(error);
    }
  },

  // Generic POST
  async post(url, data = {}, options = {}) {
    try {
      const response = await api.post(url, data);
      
      // Clear related cache after successful POST
      if (response.status === 200 || response.status === 201) {
        this.clearRelatedCache(url);
      }
      
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  },

  // Generic PUT
  async put(url, data = {}, options = {}) {
    try {
      const response = await api.put(url, data);
      
      // Clear related cache after successful PUT
      if (response.status === 200) {
        this.clearRelatedCache(url);
      }
      
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  },

  // Generic DELETE
  async delete(url, options = {}) {
    try {
      const response = await api.delete(url);
      
      // Clear related cache after successful DELETE
      if (response.status === 200) {
        this.clearRelatedCache(url);
      }
      
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  },

  // Clear cache related to specific endpoints
  clearRelatedCache(url) {
    if (url.includes('/education/')) {
      clearCachePattern('/api/education/lessons');
      clearCachePattern('/api/admin/stats');
    }
    if (url.includes('/quiz/')) {
      clearCachePattern('/api/quiz/quiz');
      clearCachePattern('/api/admin/stats');
    }
    if (url.includes('/grammar/')) {
      clearCachePattern('/api/grammar/topics');
    }
    if (url.includes('/subscription/')) {
      clearCachePattern('/api/subscription/admin');
    }
    if (url.includes('/admin/users')) {
      clearCachePattern('/api/admin/users');
    }
  },

  // Manual cache management
  clearCache(pattern = null) {
    if (pattern) {
      clearCachePattern(pattern);
    } else {
      cache.clear();
    }
  },

  // Get cache status
  getCacheStatus() {
    return {
      size: cache.size,
      keys: Array.from(cache.keys()),
    };
  },

  // Error handler
  handleError(error) {
    console.error('API Error:', error);
    
    if (error.response) {
      // Server responded with error status
      return {
        message: error.response.data?.detail || error.response.data?.message || 'Server xatosi',
        status: error.response.status,
        data: error.response.data
      };
    } else if (error.request) {
      // Network error
      return {
        message: 'Tarmoq xatosi. Internetga ulanishni tekshiring.',
        status: 0,
        data: null
      };
    } else {
      // Other error
      return {
        message: error.message || 'Noma\'lum xato',
        status: -1,
        data: null
      };
    }
  },

  // Health check
  async healthCheck() {
    try {
      const response = await api.get('/');
      return response.status === 200;
    } catch (error) {
      return false;
    }
  }
};

// Export axios instance for direct use if needed
export { api };

export default apiService;