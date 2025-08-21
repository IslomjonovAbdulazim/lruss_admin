import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { STORAGE_KEYS } from '../utils/constants';
import { apiService } from '../services/api';

// Auth context
const AuthContext = createContext();

// Auth action types
const AUTH_ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGIN_FAILURE: 'LOGIN_FAILURE',
  LOGOUT: 'LOGOUT',
  REFRESH_TOKEN: 'REFRESH_TOKEN',
  SET_USER: 'SET_USER'
};

// Initial state
const initialState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: true,
  error: null
};

// Auth reducer
const authReducer = (state, action) => {
  switch (action.type) {
    case AUTH_ACTIONS.SET_LOADING:
      return {
        ...state,
        isLoading: action.payload,
        error: null
      };

    case AUTH_ACTIONS.LOGIN_SUCCESS:
      return {
        ...state,
        user: action.payload.user,
        accessToken: action.payload.accessToken,
        refreshToken: action.payload.refreshToken,
        isAuthenticated: true,
        isLoading: false,
        error: null
      };

    case AUTH_ACTIONS.LOGIN_FAILURE:
      return {
        ...state,
        user: null,
        accessToken: null,
        refreshToken: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload
      };

    case AUTH_ACTIONS.LOGOUT:
      return {
        ...initialState,
        isLoading: false
      };

    case AUTH_ACTIONS.REFRESH_TOKEN:
      return {
        ...state,
        accessToken: action.payload.accessToken,
        refreshToken: action.payload.refreshToken,
        error: null
      };

    case AUTH_ACTIONS.SET_USER:
      return {
        ...state,
        user: action.payload,
        isLoading: false
      };

    default:
      return state;
  }
};

// Auth provider component
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Check for existing auth on mount
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const accessToken = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
        const refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
        const userData = localStorage.getItem(STORAGE_KEYS.USER_DATA);

        if (accessToken && refreshToken) {
          // Verify token is still valid by making a test request
          try {
            const response = await apiService.get('/api/admin/stats', {}, { 
              useCache: false 
            });
            
            if (response.data) {
              dispatch({
                type: AUTH_ACTIONS.LOGIN_SUCCESS,
                payload: {
                  accessToken,
                  refreshToken,
                  user: userData ? JSON.parse(userData) : null
                }
              });
            }
          } catch (error) {
            // Token invalid, clear storage
            clearAuthStorage();
            dispatch({ type: AUTH_ACTIONS.LOGOUT });
          }
        } else {
          dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
      }
    };

    initializeAuth();
  }, []);

  // Clear auth storage
  const clearAuthStorage = () => {
    localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER_DATA);
  };

  // Login function
  const login = async (phoneNumber, password) => {
    dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });

    try {
      const response = await apiService.post('/api/admin/login', {
        phone_number: phoneNumber,
        password: password
      });

      const { access_token, refresh_token } = response;

      // Store tokens
      localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, access_token);
      localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refresh_token);

      // Get user data from stats endpoint (contains admin info)
      try {
        const userResponse = await apiService.get('/api/admin/stats', {}, { 
          useCache: false 
        });
        
        const userData = {
          phone_number: phoneNumber,
          isAdmin: true,
          lastLogin: new Date().toISOString()
        };

        localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(userData));

        dispatch({
          type: AUTH_ACTIONS.LOGIN_SUCCESS,
          payload: {
            accessToken: access_token,
            refreshToken: refresh_token,
            user: userData
          }
        });

        return { success: true };
      } catch (userError) {
        console.error('Failed to get user data:', userError);
        // Still consider login successful if token works
        const userData = {
          phone_number: phoneNumber,
          isAdmin: true,
          lastLogin: new Date().toISOString()
        };

        localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(userData));

        dispatch({
          type: AUTH_ACTIONS.LOGIN_SUCCESS,
          payload: {
            accessToken: access_token,
            refreshToken: refresh_token,
            user: userData
          }
        });

        return { success: true };
      }
    } catch (error) {
      dispatch({
        type: AUTH_ACTIONS.LOGIN_FAILURE,
        payload: error.message || 'Kirish jarayonida xatolik yuz berdi'
      });
      return { 
        success: false, 
        error: error.message || 'Noto\'g\'ri telefon raqam yoki parol' 
      };
    }
  };

  // Logout function
  const logout = () => {
    clearAuthStorage();
    apiService.clearCache(); // Clear all cached data
    dispatch({ type: AUTH_ACTIONS.LOGOUT });
  };

  // Refresh token function
  const refreshAuthToken = async () => {
    try {
      const refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
      if (!refreshToken) {
        throw new Error('Refresh token mavjud emas');
      }

      const response = await apiService.post('/api/auth/refresh', {
        refresh_token: refreshToken
      });

      const { access_token, refresh_token: newRefreshToken } = response;

      localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, access_token);
      localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, newRefreshToken);

      dispatch({
        type: AUTH_ACTIONS.REFRESH_TOKEN,
        payload: {
          accessToken: access_token,
          refreshToken: newRefreshToken
        }
      });

      return true;
    } catch (error) {
      console.error('Token yangilash xatosi:', error);
      logout();
      return false;
    }
  };

  // Update user data
  const updateUser = (userData) => {
    const updatedUser = { ...state.user, ...userData };
    localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(updatedUser));
    dispatch({
      type: AUTH_ACTIONS.SET_USER,
      payload: updatedUser
    });
  };

  // Check if user is authenticated
  const isAuthenticated = () => {
    return state.isAuthenticated && state.accessToken;
  };

  // Get auth header for manual API calls
  const getAuthHeader = () => {
    if (state.accessToken) {
      return { Authorization: `Bearer ${state.accessToken}` };
    }
    return {};
  };

  // Context value
  const value = {
    // State
    user: state.user,
    isAuthenticated: state.isAuthenticated,
    isLoading: state.isLoading,
    error: state.error,
    accessToken: state.accessToken,
    
    // Methods
    login,
    logout,
    refreshAuthToken,
    updateUser,
    isAuthenticated: isAuthenticated,
    getAuthHeader,
    clearError: () => dispatch({ type: AUTH_ACTIONS.LOGIN_FAILURE, payload: null })
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth hook faqat AuthProvider ichida ishlatilishi kerak');
  }
  return context;
};

export default AuthContext;