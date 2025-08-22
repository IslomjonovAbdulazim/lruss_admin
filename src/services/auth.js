import ApiService from './api';
import CacheService from './cache';

class AuthService {
  constructor() {
    this.token = localStorage.getItem('admin_token');
    this.isAuthenticated = !!this.token;
  }

  async login(phone, password) {
    try {
      const result = await ApiService.adminLogin(phone, password);
      
      if (result.data && !result.error) {
        this.token = result.data.access_token;
        this.isAuthenticated = true;
        
        localStorage.setItem('admin_token', this.token);
        localStorage.setItem('admin_refresh_token', result.data.refresh_token);
        
        return { success: true, error: null };
      }
      
      return { success: false, error: result.error };
    } catch (error) {
      return { success: false, error: 'Kirish jarayonida xatolik' };
    }
  }

  logout() {
    this.token = null;
    this.isAuthenticated = false;
    
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_refresh_token');
    CacheService.clear();
    
    window.location.href = '/login';
  }

  getToken() {
    return this.token;
  }

  isLoggedIn() {
    return this.isAuthenticated && !!this.token;
  }

  checkAuth() {
    const token = localStorage.getItem('admin_token');
    this.token = token;
    this.isAuthenticated = !!token;
    return this.isAuthenticated;
  }
}

export default new AuthService();