// O'zbek tili matnlar va konstantalar
export const TEXTS = {
  // Common
  loading: "Yuklanmoqda...",
  error: "Xatolik yuz berdi",
  success: "Muvaffaqiyatli",
  save: "Saqlash",
  cancel: "Bekor qilish",
  delete: "O'chirish",
  edit: "Tahrirlash",
  view: "Ko'rish",
  refresh: "Yangilash",
  
  // Auth
  login: "Kirish",
  logout: "Chiqish",
  phone: "Telefon raqam",
  password: "Parol",
  loginError: "Telefon yoki parol noto'g'ri",
  
  // Navigation
  dashboard: "Bosh sahifa",
  students: "O'quvchilar",
  content: "Kontent",
  subscriptions: "Obunalar",
  analytics: "Tahlil",
  
  // Students
  studentsList: "O'quvchilar ro'yxati",
  totalStudents: "Jami o'quvchilar",
  activeStudents: "Faol o'quvchilar",
  openTelegram: "Telegramda ochish",
  viewProgress: "O'zlashtirishni ko'rish",
  studentProgress: "O'quvchi o'zlashtirishi",
  
  // Content
  modules: "Modullar",
  lessons: "Darslar",
  packs: "Paketlar",
  words: "So'zlar",
  grammar: "Grammatika",
  topics: "Mavzular",
  
  // Subscriptions
  totalRevenue: "Jami daromad",
  monthlyRevenue: "Oylik daromad",
  activeSubscriptions: "Faol obunalar",
  subscriptionHistory: "Obuna tarixi",
  
  // Stats
  systemStats: "Tizim statistikasi",
  leaderboard: "Reyting jadvali",
  rank: "O'rin",
  points: "Ballar"
};

export const API_ENDPOINTS = {
  // Auth
  adminLogin: '/api/admin/login',
  
  // Users
  users: '/api/admin/users',
  stats: '/api/admin/stats',
  
  // Content
  lessons: '/api/education/lessons',
  quiz: '/api/quiz/quiz',
  grammarTopics: '/api/grammar/topics',
  
  // Progress
  leaderboard: '/api/leaderboard/leaderboard',
  
  // Subscriptions
  subscriptions: '/api/subscription/admin/subscriptions',
  financialStats: '/api/subscription/admin/financial',
  businessProfile: '/api/subscription/admin/business'
};

export const CACHE_KEYS = {
  users: 'lruss_users',
  lessons: 'lruss_lessons',
  stats: 'lruss_stats',
  leaderboard: 'lruss_leaderboard',
  subscriptions: 'lruss_subscriptions'
};

export const ROUTES = {
  login: '/login',
  dashboard: '/',
  students: '/students',
  content: '/content',
  subscriptions: '/subscriptions',
  analytics: '/analytics'
};