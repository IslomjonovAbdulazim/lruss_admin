import { format, parseISO, isValid, formatDistanceToNow } from 'date-fns';
import { uz } from 'date-fns/locale';

// Number formatting utilities
export const formatNumber = (number, options = {}) => {
  if (typeof number !== 'number' || isNaN(number)) return '0';
  
  const defaultOptions = {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
    ...options
  };
  
  return new Intl.NumberFormat('uz-UZ', defaultOptions).format(number);
};

export const formatDecimal = (number, decimals = 2) => {
  return formatNumber(number, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  });
};

export const formatPercentage = (value, total) => {
  if (!total || total === 0) return '0%';
  const percentage = (value / total) * 100;
  return `${formatDecimal(percentage, 1)}%`;
};

// Currency formatting utilities
export const formatCurrency = (amount, currency = 'USD', options = {}) => {
  if (typeof amount !== 'number' || isNaN(amount)) return '0';
  
  const defaultOptions = {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
    ...options
  };
  
  const formattedAmount = new Intl.NumberFormat('uz-UZ', defaultOptions).format(amount);
  
  const currencySymbols = {
    USD: '$',
    UZS: 'so\'m',
    EUR: '€',
    RUB: '₽'
  };
  
  const symbol = currencySymbols[currency] || currency;
  return `${formattedAmount} ${symbol}`;
};

export const formatCompactCurrency = (amount, currency = 'USD') => {
  if (typeof amount !== 'number' || isNaN(amount)) return '0';
  
  if (amount >= 1000000) {
    return formatCurrency(amount / 1000000, currency, { maximumFractionDigits: 1 }) + 'M';
  } else if (amount >= 1000) {
    return formatCurrency(amount / 1000, currency, { maximumFractionDigits: 1 }) + 'K';
  }
  
  return formatCurrency(amount, currency);
};

// Date and time formatting utilities
export const formatDate = (dateString, formatStr = 'dd.MM.yyyy') => {
  if (!dateString) return '';
  
  try {
    const date = typeof dateString === 'string' ? parseISO(dateString) : dateString;
    if (!isValid(date)) return '';
    
    return format(date, formatStr, { locale: uz });
  } catch (error) {
    console.warn('Date formatting error:', error);
    return '';
  }
};

export const formatDateTime = (dateString, formatStr = 'dd.MM.yyyy HH:mm') => {
  return formatDate(dateString, formatStr);
};

export const formatTime = (dateString, formatStr = 'HH:mm') => {
  return formatDate(dateString, formatStr);
};

export const formatRelativeTime = (dateString) => {
  if (!dateString) return '';
  
  try {
    const date = typeof dateString === 'string' ? parseISO(dateString) : dateString;
    if (!isValid(date)) return '';
    
    return formatDistanceToNow(date, { 
      addSuffix: true, 
      locale: uz 
    });
  } catch (error) {
    console.warn('Relative time formatting error:', error);
    return '';
  }
};

export const calculateTimeAgo = (dateString) => {
  if (!dateString) return '';
  
  try {
    const date = typeof dateString === 'string' ? parseISO(dateString) : dateString;
    if (!isValid(date)) return '';
    
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    const diffWeeks = Math.floor(diffDays / 7);
    const diffMonths = Math.floor(diffDays / 30);
    
    if (diffMins < 1) return 'Hozir';
    if (diffMins < 60) return `${diffMins} daqiqa oldin`;
    if (diffHours < 24) return `${diffHours} soat oldin`;
    if (diffDays < 7) return `${diffDays} kun oldin`;
    if (diffWeeks < 4) return `${diffWeeks} hafta oldin`;
    if (diffMonths < 12) return `${diffMonths} oy oldin`;
    
    return formatDate(date);
  } catch (error) {
    console.warn('Time ago calculation error:', error);
    return '';
  }
};

// Text formatting utilities
export const truncateText = (text, maxLength = 100, suffix = '...') => {
  if (!text || text.length <= maxLength) return text || '';
  return text.substring(0, maxLength) + suffix;
};

export const capitalizeFirst = (text) => {
  if (!text) return '';
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};

export const capitalizeWords = (text) => {
  if (!text) return '';
  return text.split(' ').map(word => capitalizeFirst(word)).join(' ');
};

export const slugify = (text) => {
  if (!text) return '';
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
};

// Phone number formatting
export const formatPhoneNumber = (phone) => {
  if (!phone) return '';
  
  // Remove all non-digit characters except +
  const cleaned = phone.replace(/[^\d+]/g, '');
  
  // Uzbekistan phone number format: +998 XX XXX XX XX
  if (cleaned.startsWith('+998') && cleaned.length === 13) {
    const match = cleaned.match(/^(\+998)(\d{2})(\d{3})(\d{2})(\d{2})$/);
    if (match) {
      return `${match[1]} ${match[2]} ${match[3]} ${match[4]} ${match[5]}`;
    }
  }
  
  // International format fallback
  if (cleaned.startsWith('+') && cleaned.length > 7) {
    return cleaned;
  }
  
  return phone;
};

export const maskPhoneNumber = (phone) => {
  const formatted = formatPhoneNumber(phone);
  if (!formatted) return '';
  
  // Mask middle digits: +998 XX XXX ** **
  return formatted.replace(/(\+998 \d{2} \d{3}) \d{2} \d{2}/, '$1 ** **');
};

// File size formatting
export const formatFileSize = (bytes, decimals = 2) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

// Score and grade formatting
export const formatScore = (score, maxScore = 100) => {
  if (typeof score !== 'number') return '0%';
  
  const percentage = maxScore > 0 ? (score / maxScore) * 100 : 0;
  return `${Math.round(percentage)}%`;
};

export const getScoreGrade = (score, maxScore = 100) => {
  const percentage = maxScore > 0 ? (score / maxScore) * 100 : 0;
  
  if (percentage >= 90) return { grade: 'A', label: 'A\'lo', color: '#10b981' };
  if (percentage >= 80) return { grade: 'B', label: 'Yaxshi', color: '#3b82f6' };
  if (percentage >= 70) return { grade: 'C', label: 'Qoniqarli', color: '#f59e0b' };
  if (percentage >= 60) return { grade: 'D', label: 'Qoniqarsiz', color: '#f97316' };
  return { grade: 'F', label: 'Yomon', color: '#ef4444' };
};

// Array and list formatting
export const formatList = (items, conjunction = 'va') => {
  if (!Array.isArray(items) || items.length === 0) return '';
  if (items.length === 1) return items[0];
  if (items.length === 2) return `${items[0]} ${conjunction} ${items[1]}`;
  
  const lastItem = items[items.length - 1];
  const otherItems = items.slice(0, -1);
  return `${otherItems.join(', ')} ${conjunction} ${lastItem}`;
};

export const formatCount = (count, singular, plural) => {
  if (count === 1) return `${count} ${singular}`;
  return `${formatNumber(count)} ${plural}`;
};

// Status and state formatting
export const formatStatus = (status, statusMap = {}) => {
  const defaultStatusMap = {
    active: 'Faol',
    inactive: 'Faol emas',
    pending: 'Kutilmoqda',
    completed: 'Tugallangan',
    cancelled: 'Bekor qilingan',
    expired: 'Muddati tugagan',
    draft: 'Qoralama',
    published: 'Nashr qilingan'
  };
  
  const combinedMap = { ...defaultStatusMap, ...statusMap };
  return combinedMap[status] || status;
};

// Progress formatting
export const formatProgress = (current, total) => {
  if (!total || total === 0) return '0%';
  const percentage = Math.min((current / total) * 100, 100);
  return `${Math.round(percentage)}%`;
};

export const formatProgressWithCount = (current, total) => {
  return `${formatNumber(current)}/${formatNumber(total)} (${formatProgress(current, total)})`;
};

// Error formatting
export const formatError = (error) => {
  if (typeof error === 'string') return error;
  if (error?.message) return error.message;
  if (error?.detail) return error.detail;
  return 'Noma\'lum xatolik yuz berdi';
};

// API response formatting
export const formatApiError = (error) => {
  if (error?.response?.data?.detail) return error.response.data.detail;
  if (error?.response?.data?.message) return error.response.data.message;
  if (error?.message) return error.message;
  return 'Server bilan bog\'lanishda xatolik';
};

// Validation result formatting
export const formatValidationErrors = (errors) => {
  if (!errors || typeof errors !== 'object') return [];
  
  return Object.entries(errors).map(([field, messages]) => {
    const messageList = Array.isArray(messages) ? messages : [messages];
    return {
      field,
      messages: messageList,
      formatted: `${capitalizeFirst(field)}: ${messageList.join(', ')}`
    };
  });
};