// API Configuration
export const API_BASE_URL = 'https://lrussrubackend-production.up.railway.app';

// API Endpoints
export const API_ENDPOINTS = {
  // Auth
  AUTH_LOGIN: '/api/admin/login',
  AUTH_REFRESH: '/api/auth/refresh',
  
  // Admin & Users
  ADMIN_STATS: '/api/admin/stats',
  ADMIN_USERS: '/api/admin/users',
  
  // Education
  EDUCATION_LESSONS: '/api/education/lessons',
  EDUCATION_MODULES: '/api/education/modules',
  EDUCATION_LESSONS_CREATE: '/api/education/lessons',
  EDUCATION_PACKS: '/api/education/packs',
  
  // Content
  QUIZ_DATA: '/api/quiz/quiz',
  WORDS: '/api/quiz/words',
  GRAMMARS: '/api/quiz/grammars',
  GRAMMAR_TOPICS: '/api/grammar/topics',
  
  // Subscription
  SUBSCRIPTION_CHECK: '/api/subscription/check',
  SUBSCRIPTION_ADMIN: '/api/subscription/admin/subscriptions',
  SUBSCRIPTION_FINANCIAL: '/api/subscription/admin/financial',
  BUSINESS_PROFILE: '/api/subscription/admin/business',
  
  // Progress & Leaderboard
  PROGRESS_SUBMIT: '/api/progress/submit',
  PROGRESS_USER: '/api/progress/my-progress',
  LEADERBOARD: '/api/leaderboard/leaderboard',
  
  // Translation
  TRANSLATION: '/api/translation/translate'
};

// Cache Configuration
export const CACHE_CONFIG = {
  DEFAULT_TTL: 5 * 60 * 1000, // 5 minutes in milliseconds
  LONG_TTL: 30 * 60 * 1000,   // 30 minutes in milliseconds
  SHORT_TTL: 1 * 60 * 1000    // 1 minute in milliseconds
};

// Local Storage Keys
export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'admin_access_token',
  REFRESH_TOKEN: 'admin_refresh_token',
  USER_DATA: 'admin_user_data',
  CACHE_PREFIX: 'cache_'
};

// UI Constants
export const UI_TEXT = {
  // Common
  LOADING: 'Yuklanmoqda...',
  SAVE: 'Saqlash',
  CANCEL: 'Bekor qilish',
  DELETE: 'O\'chirish',
  EDIT: 'Tahrirlash',
  ADD: 'Qo\'shish',
  SEARCH: 'Qidirish...',
  CONFIRM: 'Tasdiqlash',
  SUCCESS: 'Muvaffaqiyatli!',
  ERROR: 'Xatolik!',
  WARNING: 'Ogohlantirish!',
  INFO: 'Ma\'lumot',
  CLOSE: 'Yopish',
  
  // Navigation
  DASHBOARD: 'Boshqaruv paneli',
  USERS: 'Foydalanuvchilar',
  EDUCATION: 'Ta\'lim',
  CONTENT: 'Kontent',
  SUBSCRIPTIONS: 'Obunalar',
  PROGRESS: 'Taraqqiyot',
  SETTINGS: 'Sozlamalar',
  LOGOUT: 'Chiqish',
  
  // Auth
  LOGIN: 'Kirish',
  PHONE_NUMBER: 'Telefon raqam',
  PASSWORD: 'Parol',
  LOGIN_TITLE: 'Admin panelga kirish',
  INVALID_CREDENTIALS: 'Noto\'g\'ri ma\'lumotlar',
  
  // Dashboard
  TOTAL_USERS: 'Jami foydalanuvchilar',
  ACTIVE_USERS: 'Faol foydalanuvchilar',
  TOTAL_REVENUE: 'Jami daromad',
  MONTHLY_REVENUE: 'Oylik daromad',
  TOTAL_MODULES: 'Jami modullar',
  TOTAL_LESSONS: 'Jami darslar',
  TOTAL_PACKS: 'Jami paketlar',
  TOTAL_WORDS: 'Jami so\'zlar',
  STATISTICS: 'Statistika',
  
  // Users
  USER_LIST: 'Foydalanuvchilar ro\'yxati',
  USER_DETAILS: 'Foydalanuvchi ma\'lumotlari',
  FIRST_NAME: 'Ism',
  LAST_NAME: 'Familiya',
  REGISTRATION_DATE: 'Ro\'yxatdan o\'tgan sana',
  PHONE: 'Telefon',
  
  // Education
  MODULES: 'Modullar',
  LESSONS: 'Darslar',
  PACKS: 'Paketlar',
  MODULE_TITLE: 'Modul nomi',
  LESSON_TITLE: 'Dars nomi',
  LESSON_DESCRIPTION: 'Dars tavsifi',
  PACK_TITLE: 'Paket nomi',
  PACK_TYPE: 'Paket turi',
  WORD_COUNT: 'So\'zlar soni',
  CREATE_MODULE: 'Modul yaratish',
  CREATE_LESSON: 'Dars yaratish',
  CREATE_PACK: 'Paket yaratish',
  
  // Content
  WORDS: 'So\'zlar',
  GRAMMAR: 'Grammatika',
  GRAMMAR_TOPICS: 'Grammatika mavzulari',
  RUSSIAN_TEXT: 'Rus tilidagi matn',
  UZBEK_TEXT: 'O\'zbek tilidagi matn',
  AUDIO_URL: 'Audio URL',
  QUESTION_TEXT: 'Savol matni',
  CORRECT_OPTION: 'To\'g\'ri javob',
  SENTENCE: 'Jumla',
  VIDEO_URL: 'Video URL',
  MARKDOWN_TEXT: 'Markdown matn',
  
  // Subscriptions
  SUBSCRIPTION_LIST: 'Obunalar ro\'yxati',
  CREATE_SUBSCRIPTION: 'Obuna yaratish',
  START_DATE: 'Boshlanish sanasi',
  END_DATE: 'Tugash sanasi',
  AMOUNT: 'Miqdor',
  CURRENCY: 'Valyuta',
  NOTES: 'Izohlar',
  ACTIVE_SUBSCRIPTIONS: 'Faol obunalar',
  FINANCIAL_STATS: 'Moliyaviy statistika',
  
  // Pack Types
  PACK_TYPE_WORD: 'So\'z paketi',
  PACK_TYPE_GRAMMAR: 'Grammatika paketi',
  
  // Grammar Types
  GRAMMAR_TYPE_FILL: 'To\'ldirish',
  GRAMMAR_TYPE_BUILD: 'Qurish',
  
  // Messages
  DELETE_CONFIRM: 'Rostdan ham o\'chirmoqchimisiz?',
  SAVE_SUCCESS: 'Muvaffaqiyatli saqlandi',
  DELETE_SUCCESS: 'Muvaffaqiyatli o\'chirildi',
  NETWORK_ERROR: 'Tarmoq xatosi',
  REQUIRED_FIELD: 'Ushbu maydon to\'ldirilishi shart',
  
  // Business Profile
  BUSINESS_PROFILE: 'Biznes profil',
  TELEGRAM_URL: 'Telegram URL',
  INSTAGRAM_URL: 'Instagram URL',
  WEBSITE_URL: 'Veb-sayt URL',
  SUPPORT_EMAIL: 'Qo\'llab-quvvatlash email',
  COMPANY_NAME: 'Kompaniya nomi',
  REQUIRED_APP_VERSION: 'Talab qilinadigan ilova versiyasi'
};

// Table Configuration
export const TABLE_CONFIG = {
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [10, 25, 50, 100]
};

// File Upload Configuration
export const UPLOAD_CONFIG = {
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/gif'],
  ALLOWED_AUDIO_TYPES: ['audio/mpeg', 'audio/wav', 'audio/ogg']
};

// Chart Colors
export const CHART_COLORS = {
  PRIMARY: '#3B82F6',
  SUCCESS: '#10B981',
  WARNING: '#F59E0B',
  DANGER: '#EF4444',
  INFO: '#6366F1',
  GRADIENT: ['#3B82F6', '#8B5CF6', '#06B6D4', '#10B981']
};

// Responsive Breakpoints
export const BREAKPOINTS = {
  SM: '640px',
  MD: '768px',
  LG: '1024px',
  XL: '1280px'
};

export default {
  API_BASE_URL,
  API_ENDPOINTS,
  CACHE_CONFIG,
  STORAGE_KEYS,
  UI_TEXT,
  TABLE_CONFIG,
  UPLOAD_CONFIG,
  CHART_COLORS,
  BREAKPOINTS
};