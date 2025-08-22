import { createContext, useContext, useReducer, useEffect } from 'react';
import AuthService from '../services/auth';

// Auth holati uchun initial state
const initialState = {
  isAuthenticated: false,
  isLoading: false,
  error: null,
  user: null
};

// Auth actions
const AUTH_ACTIONS = {
  LOGIN_START: 'LOGIN_START',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGIN_FAILURE: 'LOGIN_FAILURE',
  LOGOUT: 'LOGOUT',
  CHECK_AUTH: 'CHECK_AUTH',
  CLEAR_ERROR: 'CLEAR_ERROR'
};

// Auth reducer
const authReducer = (state, action) => {
  switch (action.type) {
    case AUTH_ACTIONS.LOGIN_START:
      return {
        ...state,
        isLoading: true,
        error: null
      };
    
    case AUTH_ACTIONS.LOGIN_SUCCESS:
      return {
        ...state,
        isAuthenticated: true,
        isLoading: false,
        error: null,
        user: action.payload
      };
    
    case AUTH_ACTIONS.LOGIN_FAILURE:
      return {
        ...state,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload,
        user: null
      };
    
    case AUTH_ACTIONS.LOGOUT:
      return {
        ...initialState
      };
    
    case AUTH_ACTIONS.CHECK_AUTH:
      return {
        ...state,
        isAuthenticated: action.payload
      };
    
    case AUTH_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null
      };
    
    default:
      return state;
  }
};

// Auth context
const AuthContext = createContext();

// Auth provider component
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Sahifa yuklanganda auth holatini tekshirish
  useEffect(() => {
    const isAuthenticated = AuthService.checkAuth();
    dispatch({ 
      type: AUTH_ACTIONS.CHECK_AUTH, 
      payload: isAuthenticated 
    });
  }, []);

  // Login funksiyasi
  const login = async (phone, password) => {
    dispatch({ type: AUTH_ACTIONS.LOGIN_START });
    
    try {
      const result = await AuthService.login(phone, password);
      
      if (result.success) {
        dispatch({ 
          type: AUTH_ACTIONS.LOGIN_SUCCESS, 
          payload: { phone } 
        });
        return { success: true };
      } else {
        dispatch({ 
          type: AUTH_ACTIONS.LOGIN_FAILURE, 
          payload: result.error 
        });
        return { success: false, error: result.error };
      }
    } catch (error) {
      const errorMessage = 'Kirish jarayonida xatolik yuz berdi';
      dispatch({ 
        type: AUTH_ACTIONS.LOGIN_FAILURE, 
        payload: errorMessage 
      });
      return { success: false, error: errorMessage };
    }
  };

  // Logout funksiyasi
  const logout = () => {
    AuthService.logout();
    dispatch({ type: AUTH_ACTIONS.LOGOUT });
  };

  // Xatolikni tozalash
  const clearError = () => {
    dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });
  };

  const value = {
    ...state,
    login,
    logout,
    clearError
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Auth hook
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth hook AuthProvider ichida ishlatilishi kerak');
  }
  return context;
};