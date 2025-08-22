import React, { useState, useEffect } from 'react';
import { useAuth } from '../store/authStore';
import { TEXTS } from '../utils/constants';
import { validatePhoneNumber } from '../utils/helpers';
import LoadingSpinner from '../components/layout/LoadingSpinner';

const Login = () => {
  const [formData, setFormData] = useState({
    phone: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  
  const { login, isLoading, error, clearError } = useAuth();

  useEffect(() => {
    // Clear error when component mounts
    clearError();
  }, [clearError]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear field error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
    
    // Clear global error
    if (error) {
      clearError();
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Telefon raqam kiritilishi shart';
    } else if (!validatePhoneNumber(formData.phone)) {
      newErrors.phone = 'Telefon raqam noto\'g\'ri formatda (+998XXXXXXXXX)';
    }
    
    if (!formData.password.trim()) {
      newErrors.password = 'Parol kiritilishi shart';
    } else if (formData.password.length < 4) {
      newErrors.password = 'Parol kamida 4 ta belgidan iborat bo\'lishi kerak';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    const result = await login(formData.phone, formData.password);
    
    if (!result.success) {
      // Error is handled by auth store
      console.error('Login failed:', result.error);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <div className="login-logo">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M2 20h20" />
                <path d="M5 20V4" />
                <path d="M12 20V10" />
                <path d="M19 20V14" />
              </svg>
            </div>
            <h1 className="login-title">
              {process.env.REACT_APP_NAME} Admin
            </h1>
            <p className="login-subtitle">
              Administrator paneliga kirish
            </p>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            {error && (
              <div className="alert alert-error">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="15" y1="9" x2="9" y2="15" />
                  <line x1="9" y1="9" x2="15" y2="15" />
                </svg>
                {error}
              </div>
            )}

            <div className="form-group">
              <label htmlFor="phone" className="form-label">
                {TEXTS.phone}
              </label>
              <div className="input-wrapper">
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="+998901234567"
                  className={`form-input ${errors.phone ? 'error' : ''}`}
                  disabled={isLoading}
                />
                <div className="input-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                </div>
              </div>
              {errors.phone && (
                <span className="form-error">{errors.phone}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="password" className="form-label">
                {TEXTS.password}
              </label>
              <div className="input-wrapper">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Parolingizni kiriting"
                  className={`form-input ${errors.password ? 'error' : ''}`}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className="input-action"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                >
                  {showPassword ? (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
              {errors.password && (
                <span className="form-error">{errors.password}</span>
              )}
            </div>

            <button 
              type="submit" 
              className="login-button"
              disabled={isLoading}
            >
              {isLoading ? (
                <LoadingSpinner size="small" text="" />
              ) : (
                TEXTS.login
              )}
            </button>
          </form>

          <div className="login-footer">
            <p className="login-help">
              Administrator sifatida kirish uchun telefon raqam va parolingizni kiriting
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;