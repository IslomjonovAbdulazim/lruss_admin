// Yordamchi funksiyalar
import { format, parseISO, isValid } from 'date-fns';

export const formatDate = (dateString) => {
  if (!dateString) return '';
  
  try {
    const date = typeof dateString === 'string' ? parseISO(dateString) : dateString;
    if (!isValid(date)) return '';
    
    return format(date, 'dd.MM.yyyy');
  } catch (error) {
    console.warn('Date formatting error:', error);
    return '';
  }
};

export const formatDateTime = (dateString) => {
  if (!dateString) return '';
  
  try {
    const date = typeof dateString === 'string' ? parseISO(dateString) : dateString;
    if (!isValid(date)) return '';
    
    return format(date, 'dd.MM.yyyy HH:mm');
  } catch (error) {
    console.warn('DateTime formatting error:', error);
    return '';
  }
};

export const formatNumber = (number) => {
  if (typeof number !== 'number') return '0';
  return new Intl.NumberFormat('uz-UZ').format(number);
};

export const formatCurrency = (amount, currency = 'USD') => {
  if (typeof amount !== 'number') return '0';
  
  const formattedAmount = new Intl.NumberFormat('uz-UZ').format(amount);
  return `${formattedAmount} ${currency}`;
};

export const generateTelegramLink = (telegramId) => {
  if (!telegramId) return '#';
  return `https://t.me/user?id=${telegramId}`;
};

export const truncateText = (text, maxLength = 100) => {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

export const getInitials = (firstName, lastName) => {
  const first = firstName ? firstName.charAt(0).toUpperCase() : '';
  const last = lastName ? lastName.charAt(0).toUpperCase() : '';
  return first + last || 'A';
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
    
    if (diffMins < 1) return 'Hozir';
    if (diffMins < 60) return `${diffMins} daqiqa oldin`;
    if (diffHours < 24) return `${diffHours} soat oldin`;
    if (diffDays < 7) return `${diffDays} kun oldin`;
    
    return formatDate(date);
  } catch (error) {
    console.warn('Time ago calculation error:', error);
    return '';
  }
};

export const parsePhoneNumber = (phone) => {
  if (!phone) return '';
  return phone.replace(/\s/g, '').replace(/[^\d+]/g, '');
};

export const validatePhoneNumber = (phone) => {
  const cleaned = parsePhoneNumber(phone);
  return /^\+998\d{9}$/.test(cleaned);
};

export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

export const throttle = (func, limit) => {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

export const downloadCSV = (data, filename = 'export.csv') => {
  if (!data || !data.length) return;
  
  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(','),
    ...data.map(row => headers.map(header => 
      JSON.stringify(row[header] || '')
    ).join(','))
  ].join('\n');
  
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};