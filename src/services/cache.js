const CACHE_TTL = parseInt(process.env.REACT_APP_CACHE_TTL) || 300000; // 5 minutes
const CACHE_ENABLED = process.env.REACT_APP_CACHE_ENABLED === 'true';

class CacheService {
  constructor() {
    this.cache = new Map();
  }

  set(key, data) {
    if (!CACHE_ENABLED) return;
    
    const cacheItem = {
      data,
      timestamp: Date.now(),
      ttl: CACHE_TTL
    };
    
    this.cache.set(key, cacheItem);
    
    // Also store in localStorage for persistence
    try {
      localStorage.setItem(`cache_${key}`, JSON.stringify(cacheItem));
    } catch (e) {
      console.warn('LocalStorage cache failed:', e);
    }
  }

  get(key) {
    if (!CACHE_ENABLED) return null;

    let cacheItem = this.cache.get(key);
    
    // If not in memory, try localStorage
    if (!cacheItem) {
      try {
        const stored = localStorage.getItem(`cache_${key}`);
        if (stored) {
          cacheItem = JSON.parse(stored);
          this.cache.set(key, cacheItem);
        }
      } catch (e) {
        console.warn('LocalStorage read failed:', e);
      }
    }

    if (!cacheItem) return null;

    // Check if expired
    const isExpired = Date.now() - cacheItem.timestamp > cacheItem.ttl;
    if (isExpired) {
      this.delete(key);
      return null;
    }

    return cacheItem.data;
  }

  delete(key) {
    this.cache.delete(key);
    try {
      localStorage.removeItem(`cache_${key}`);
    } catch (e) {
      console.warn('LocalStorage delete failed:', e);
    }
  }

  clear() {
    this.cache.clear();
    // Clear all cache items from localStorage
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('cache_')) {
        localStorage.removeItem(key);
      }
    });
  }

  isExpired(key) {
    const cacheItem = this.cache.get(key);
    if (!cacheItem) return true;
    return Date.now() - cacheItem.timestamp > cacheItem.ttl;
  }
}

export default new CacheService();