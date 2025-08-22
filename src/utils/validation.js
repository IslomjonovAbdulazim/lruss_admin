// Validation utilities for forms and data

// Phone number validation
export const validatePhoneNumber = (phone) => {
  if (!phone) return { isValid: false, error: 'Telefon raqam kiritilishi shart' };
  
  const cleaned = phone.replace(/\s/g, '').replace(/[^\d+]/g, '');
  
  // Uzbekistan phone number validation
  if (!cleaned.startsWith('+998')) {
    return { isValid: false, error: 'Telefon raqam +998 bilan boshlanishi kerak' };
  }
  
  if (!/^\+998\d{9}$/.test(cleaned)) {
    return { isValid: false, error: 'Telefon raqam formati noto\'g\'ri (+998XXXXXXXXX)' };
  }
  
  return { isValid: true, cleaned };
};

// Email validation
export const validateEmail = (email) => {
  if (!email) return { isValid: false, error: 'Email manzil kiritilishi shart' };
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  if (!emailRegex.test(email)) {
    return { isValid: false, error: 'Email manzil formati noto\'g\'ri' };
  }
  
  return { isValid: true, cleaned: email.toLowerCase().trim() };
};

// Password validation
export const validatePassword = (password, minLength = 8) => {
  if (!password) return { isValid: false, error: 'Parol kiritilishi shart' };
  
  if (password.length < minLength) {
    return { 
      isValid: false, 
      error: `Parol kamida ${minLength} ta belgidan iborat bo'lishi kerak` 
    };
  }
  
  // Check for at least one letter
  if (!/[a-zA-Z]/.test(password)) {
    return { isValid: false, error: 'Parolda kamida bitta harf bo\'lishi kerak' };
  }
  
  // Check for at least one number
  if (!/\d/.test(password)) {
    return { isValid: false, error: 'Parolda kamida bitta raqam bo\'lishi kerak' };
  }
  
  return { isValid: true };
};

// Name validation
export const validateName = (name, fieldName = 'Ism') => {
  if (!name) return { isValid: false, error: `${fieldName} kiritilishi shart` };
  
  const cleaned = name.trim();
  
  if (cleaned.length < 2) {
    return { isValid: false, error: `${fieldName} kamida 2 ta belgidan iborat bo'lishi kerak` };
  }
  
  if (cleaned.length > 50) {
    return { isValid: false, error: `${fieldName} 50 ta belgidan ko'p bo'lmasligi kerak` };
  }
  
  // Allow only letters (Latin and Cyrillic) and spaces
  if (!/^[a-zA-Zа-яА-Я\s]+$/.test(cleaned)) {
    return { isValid: false, error: `${fieldName}da faqat harflar bo'lishi mumkin` };
  }
  
  return { isValid: true, cleaned };
};

// Required field validation
export const validateRequired = (value, fieldName) => {
  if (value === null || value === undefined || value === '') {
    return { isValid: false, error: `${fieldName} kiritilishi shart` };
  }
  
  if (typeof value === 'string' && value.trim() === '') {
    return { isValid: false, error: `${fieldName} kiritilishi shart` };
  }
  
  return { isValid: true };
};

// Number validation
export const validateNumber = (value, fieldName, options = {}) => {
  const { min, max, integer = false, positive = false } = options;
  
  if (value === null || value === undefined || value === '') {
    return { isValid: false, error: `${fieldName} kiritilishi shart` };
  }
  
  const num = parseFloat(value);
  
  if (isNaN(num)) {
    return { isValid: false, error: `${fieldName} raqam bo'lishi kerak` };
  }
  
  if (integer && !Number.isInteger(num)) {
    return { isValid: false, error: `${fieldName} butun son bo'lishi kerak` };
  }
  
  if (positive && num <= 0) {
    return { isValid: false, error: `${fieldName} musbat son bo'lishi kerak` };
  }
  
  if (min !== undefined && num < min) {
    return { isValid: false, error: `${fieldName} ${min}dan kichik bo'lmasligi kerak` };
  }
  
  if (max !== undefined && num > max) {
    return { isValid: false, error: `${fieldName} ${max}dan katta bo'lmasligi kerak` };
  }
  
  return { isValid: true, cleaned: num };
};

// Date validation
export const validateDate = (date, fieldName) => {
  if (!date) return { isValid: false, error: `${fieldName} kiritilishi shart` };
  
  const dateObj = new Date(date);
  
  if (isNaN(dateObj.getTime())) {
    return { isValid: false, error: `${fieldName} to'g'ri formatda kiritilishi kerak` };
  }
  
  return { isValid: true, cleaned: dateObj };
};

// Date range validation
export const validateDateRange = (startDate, endDate, startFieldName = 'Boshlanish sanasi', endFieldName = 'Tugash sanasi') => {
  const startValidation = validateDate(startDate, startFieldName);
  if (!startValidation.isValid) return startValidation;
  
  const endValidation = validateDate(endDate, endFieldName);
  if (!endValidation.isValid) return endValidation;
  
  if (startValidation.cleaned >= endValidation.cleaned) {
    return { 
      isValid: false, 
      error: `${endFieldName} ${startFieldName}dan keyin bo'lishi kerak` 
    };
  }
  
  return { isValid: true };
};

// URL validation
export const validateUrl = (url, fieldName = 'URL') => {
  if (!url) return { isValid: false, error: `${fieldName} kiritilishi shart` };
  
  try {
    new URL(url);
    return { isValid: true, cleaned: url.trim() };
  } catch {
    return { isValid: false, error: `${fieldName} to'g'ri formatda kiritilishi kerak` };
  }
};

// File validation
export const validateFile = (file, options = {}) => {
  const { 
    maxSize = 5 * 1024 * 1024, // 5MB default
    allowedTypes = [],
    required = true
  } = options;
  
  if (!file) {
    if (required) {
      return { isValid: false, error: 'Fayl tanlanishi shart' };
    }
    return { isValid: true };
  }
  
  if (file.size > maxSize) {
    const maxSizeMB = Math.round(maxSize / (1024 * 1024));
    return { 
      isValid: false, 
      error: `Fayl hajmi ${maxSizeMB}MB dan oshmasligi kerak` 
    };
  }
  
  if (allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
    return { 
      isValid: false, 
      error: `Faqat quyidagi formatlar qabul qilinadi: ${allowedTypes.join(', ')}` 
    };
  }
  
  return { isValid: true };
};

// Array validation
export const validateArray = (array, fieldName, options = {}) => {
  const { minLength = 0, maxLength, required = true } = options;
  
  if (!array || !Array.isArray(array)) {
    if (required) {
      return { isValid: false, error: `${fieldName} ro'yxati kiritilishi shart` };
    }
    return { isValid: true };
  }
  
  if (array.length < minLength) {
    return { 
      isValid: false, 
      error: `${fieldName} kamida ${minLength} ta element bo'lishi kerak` 
    };
  }
  
  if (maxLength && array.length > maxLength) {
    return { 
      isValid: false, 
      error: `${fieldName} ${maxLength} ta elementdan ko'p bo'lmasligi kerak` 
    };
  }
  
  return { isValid: true };
};

// Multiple choice validation
export const validateChoice = (value, choices, fieldName) => {
  if (!value) return { isValid: false, error: `${fieldName} tanlanishi shart` };
  
  if (!choices.includes(value)) {
    return { 
      isValid: false, 
      error: `${fieldName} uchun noto'g'ri qiymat tanlangan` 
    };
  }
  
  return { isValid: true };
};

// Complex form validation
export const validateForm = (data, rules) => {
  const errors = {};
  let isValid = true;
  
  for (const [field, fieldRules] of Object.entries(rules)) {
    const value = data[field];
    
    for (const rule of fieldRules) {
      const { validator, params = [], message } = rule;
      const result = validator(value, ...params);
      
      if (!result.isValid) {
        errors[field] = message || result.error;
        isValid = false;
        break; // Stop at first error for this field
      }
    }
  }
  
  return { isValid, errors };
};

// Login form validation
export const validateLoginForm = (formData) => {
  const rules = {
    phone_number: [
      { validator: validateRequired, params: ['Telefon raqam'] },
      { validator: validatePhoneNumber }
    ],
    password: [
      { validator: validateRequired, params: ['Parol'] },
      { validator: validatePassword, params: [4] }
    ]
  };
  
  return validateForm(formData, rules);
};

// User profile validation
export const validateUserProfile = (formData) => {
  const rules = {
    first_name: [
      { validator: validateRequired, params: ['Ism'] },
      { validator: validateName, params: ['Ism'] }
    ]
  };
  
  // Last name is optional but should be validated if provided
  if (formData.last_name) {
    rules.last_name = [
      { validator: validateName, params: ['Familiya'] }
    ];
  }
  
  return validateForm(formData, rules);
};

// Content validation
export const validateContentForm = (formData, type) => {
  const baseRules = {
    title: [
      { validator: validateRequired, params: ['Sarlavha'] },
      { validator: (value) => {
        if (value && value.length > 200) {
          return { isValid: false, error: 'Sarlavha 200 ta belgidan oshmasligi kerak' };
        }
        return { isValid: true };
      }}
    ]
  };
  
  if (type === 'pack') {
    baseRules.type = [
      { validator: validateRequired, params: ['Tur'] },
      { validator: validateChoice, params: [['word', 'grammar'], 'Paket turi'] }
    ];
    
    baseRules.lesson_id = [
      { validator: validateRequired, params: ['Dars'] },
      { validator: validateNumber, params: ['Dars ID', { integer: true, positive: true }] }
    ];
  }
  
  return validateForm(formData, baseRules);
};

// Subscription validation
export const validateSubscription = (formData) => {
  const rules = {
    user_id: [
      { validator: validateRequired, params: ['Foydalanuvchi'] },
      { validator: validateNumber, params: ['Foydalanuvchi ID', { integer: true, positive: true }] }
    ],
    start_date: [
      { validator: validateRequired, params: ['Boshlanish sanasi'] },
      { validator: validateDate, params: ['Boshlanish sanasi'] }
    ],
    end_date: [
      { validator: validateRequired, params: ['Tugash sanasi'] },
      { validator: validateDate, params: ['Tugash sanasi'] }
    ],
    amount: [
      { validator: validateRequired, params: ['Miqdor'] },
      { validator: validateNumber, params: ['Miqdor', { positive: true }] }
    ]
  };
  
  const baseValidation = validateForm(formData, rules);
  
  // Additional date range validation
  if (baseValidation.isValid && formData.start_date && formData.end_date) {
    const dateRangeValidation = validateDateRange(formData.start_date, formData.end_date);
    if (!dateRangeValidation.isValid) {
      baseValidation.isValid = false;
      baseValidation.errors.end_date = dateRangeValidation.error;
    }
  }
  
  return baseValidation;
};

// Grammar question validation
export const validateGrammarQuestion = (formData) => {
  const rules = {
    type: [
      { validator: validateRequired, params: ['Tur'] },
      { validator: validateChoice, params: [['fill', 'build'], 'Savol turi'] }
    ],
    pack_id: [
      { validator: validateRequired, params: ['Paket'] },
      { validator: validateNumber, params: ['Paket ID', { integer: true, positive: true }] }
    ]
  };
  
  if (formData.type === 'fill') {
    rules.question_text = [
      { validator: validateRequired, params: ['Savol matni'] }
    ];
    rules.options = [
      { validator: validateArray, params: ['Variantlar', { minLength: 4, maxLength: 4 }] }
    ];
    rules.correct_option = [
      { validator: validateRequired, params: ['To\'g\'ri variant'] },
      { validator: validateNumber, params: ['To\'g\'ri variant', { integer: true, min: 0, max: 3 }] }
    ];
  } else if (formData.type === 'build') {
    rules.sentence = [
      { validator: validateRequired, params: ['Jumla'] }
    ];
  }
  
  return validateForm(formData, rules);
};

// Real-time validation (debounced)
export const createDebouncedValidator = (validator, delay = 500) => {
  let timeoutId;
  
  return (value, callback) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      const result = validator(value);
      callback(result);
    }, delay);
  };
};

// Validation helpers for UI
export const getFieldError = (errors, fieldName) => {
  return errors[fieldName] || null;
};

export const hasFieldError = (errors, fieldName) => {
  return Boolean(errors[fieldName]);
};

export const isFormValid = (errors) => {
  return Object.keys(errors).length === 0;
};

export const getFirstError = (errors) => {
  const firstKey = Object.keys(errors)[0];
  return firstKey ? errors[firstKey] : null;
};