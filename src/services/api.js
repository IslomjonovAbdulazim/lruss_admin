import axios from 'axios';
import CacheService from './cache';
import { API_ENDPOINTS, CACHE_KEYS } from '../utils/constants';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

class ApiService {
  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json'
      }
    });

    this.setupInterceptors();
  }

  setupInterceptors() {
    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('admin_token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('admin_token');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  async request(endpoint, options = {}) {
    try {
      const response = await this.client.request({
        url: endpoint,
        ...options
      });
      return { data: response.data, error: null };
    } catch (error) {
      return {
        data: null,
        error: error.response?.data?.detail || error.message || 'Xatolik yuz berdi'
      };
    }
  }

  // Cached GET request
  async getCached(endpoint, cacheKey, forceRefresh = false) {
    // Check cache first
    if (!forceRefresh) {
      const cached = CacheService.get(cacheKey);
      if (cached) {
        return { data: cached, error: null, fromCache: true };
      }
    }

    const result = await this.request(endpoint, { method: 'GET' });
    
    if (result.data && !result.error) {
      CacheService.set(cacheKey, result.data);
    }

    return { ...result, fromCache: false };
  }

  // Auth methods
  async adminLogin(phone, password) {
    return this.request(API_ENDPOINTS.adminLogin, {
      method: 'POST',
      data: { phone_number: phone, password }
    });
  }

  // Users methods
  async getUsers(forceRefresh = false) {
    return this.getCached(API_ENDPOINTS.users, CACHE_KEYS.users, forceRefresh);
  }

  async getStats(forceRefresh = false) {
    return this.getCached(API_ENDPOINTS.stats, CACHE_KEYS.stats, forceRefresh);
  }

  // Content methods
  async getLessons(forceRefresh = false) {
    return this.getCached(API_ENDPOINTS.lessons, CACHE_KEYS.lessons, forceRefresh);
  }

  async getQuiz(forceRefresh = false) {
    return this.getCached(API_ENDPOINTS.quiz, 'quiz', forceRefresh);
  }

  async getGrammarTopics(forceRefresh = false) {
    return this.getCached(API_ENDPOINTS.grammarTopics, 'grammar_topics', forceRefresh);
  }

  // Leaderboard
  async getLeaderboard(forceRefresh = false) {
    return this.getCached(API_ENDPOINTS.leaderboard, CACHE_KEYS.leaderboard, forceRefresh);
  }

  // Subscriptions
  async getSubscriptions(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = `${API_ENDPOINTS.subscriptions}?${queryString}`;
    return this.request(endpoint, { method: 'GET' });
  }

  async getFinancialStats() {
    return this.request(API_ENDPOINTS.financialStats, { method: 'GET' });
  }
}

export default new ApiService();