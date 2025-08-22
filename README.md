# LRUSS Admin Panel

LRUSS Educational Platform uchun React asosida qurilgan administrator paneli.

## Xususiyatlar

- 🔐 **Admin autentifikatsiya** - Telefon va parol orqali kirish
- 👥 **O'quvchilar boshqaruvi** - Ro'yxat, progress kuzatish, Telegram havola
- 📚 **Kontent boshqaruvi** - Modullar, darslar, paketlar, so'zlar va grammatika
- 💰 **Obuna tizimi** - Moliyaviy hisobotlar va obuna boshqaruvi
- 📊 **Tahlil sahifasi** - Platforma statistikasi va reyting jadvali
- 🚀 **Kesh tizimi** - Redis cache bilan tez yuklash
- 📱 **Responsive dizayn** - Barcha qurilmalarda ishlaydi
- 🌐 **O'zbek tili** - To'liq o'zbekcha interfeys

## Texnologiyalar

- **Frontend**: React 18, React Router DOM, Axios
- **Styling**: Custom CSS (CSS Variables)
- **State Management**: React Context API
- **Icons**: Custom SVG icons
- **Date Handling**: date-fns
- **Build Tool**: Create React App

## O'rnatish

### 1. Loyihani klonlash

```bash
git clone <repository-url>
cd lruss-admin
```

### 2. Bog'liqliklarni o'rnatish

```bash
npm install
```

### 3. Environment o'zgaruvchilarini sozlash

`.env` faylini yarating va quyidagi o'zgaruvchilarni qo'shing:

```env
# API Configuration
REACT_APP_API_BASE_URL=https://lrussrubackend-production.up.railway.app

# App Configuration
REACT_APP_NAME=LRUSS Admin
REACT_APP_VERSION=1.0.0

# Development Settings
REACT_APP_ENV=development
GENERATE_SOURCEMAP=true

# Cache Settings
REACT_APP_CACHE_ENABLED=true
REACT_APP_CACHE_TTL=300000

# Security Settings
REACT_APP_SESSION_TIMEOUT=86400000
```

### 4. Loyihani ishga tushirish

```bash
npm start
```

Loyiha `http://localhost:3000` da ishga tushadi.

## Skriptlar

- `npm start` - Development serverini ishga tushirish
- `npm run build` - Production uchun build qilish
- `npm test` - Testlarni ishga tushirish
- `npm run build:production` - Build sana bilan production build

## Loyiha strukturasi

```
lruss-admin/
├── public/
│   ├── index.html          # HTML template
│   ├── manifest.json       # PWA manifest
│   └── favicon.ico         # Favicon
├── src/
│   ├── components/         # React komponentlar
│   │   ├── layout/         # Layout komponentlari
│   │   ├── users/          # Foydalanuvchi komponentlari
│   │   └── common/         # Umumiy komponentlar
│   ├── pages/              # Sahifa komponentlari
│   ├── services/           # API va xizmat qatlamlari
│   ├── store/              # State management
│   ├── utils/              # Yordamchi funksiyalar
│   ├── styles/             # CSS fayllar
│   ├── App.js              # Asosiy React komponenti
│   └── index.js            # React entry point
├── .env                    # Environment o'zgaruvchilar
├── package.json            # NPM konfiguratsiya
└── README.md               # Loyiha hujjatlari
```

## API Endpointlar

### Autentifikatsiya
- `POST /api/admin/login` - Admin kirish

### Foydalanuvchilar
- `GET /api/admin/users` - Barcha foydalanuvchilar
- `GET /api/admin/stats` - Tizim statistikasi

### Kontent
- `GET /api/education/lessons` - Ta'lim kontenti
- `GET /api/quiz/quiz` - Test savollari
- `GET /api/grammar/topics` - Grammatika mavzulari

### Progress va Reyting
- `GET /api/leaderboard/leaderboard` - Reyting jadvali

### Obunalar
- `GET /api/subscription/admin/subscriptions` - Obunalar ro'yxati
- `GET /api/subscription/admin/financial` - Moliyaviy statistika

## Xususiyatlar

### Kesh tizimi
- Redis cache bilan backend ma'lumotlarini keshlash
- LocalStorage fallback
- TTL: 5 daqiqa (REACT_APP_CACHE_TTL)

### Responsive dizayn
- Desktop: Sidebar + header layout
- Tablet: Adaptiv grid tizimi  
- Mobile: Burger menu va stack layout

### PWA xususiyatlari
- Manifest.json fayli
- Service worker (qo'shilishi mumkin)
- Offline rejimi (ixtiyoriy)

## Development

### CSS o'zgaruvchilar

Loyihada CSS Custom Properties ishlatilgan:

```css
:root {
  --primary-color: #3b82f6;
  --gray-50: #f9fafb;
  --border-radius: 8px;
  --shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1);
}
```

### Komponent nomlashtirish

- `Page` komponentlari: `src/pages/` papkasida
- `Layout` komponentlari: `src/components/layout/` da
- `Common` komponentlar: `src/components/common/` da

### State management

React Context API orqali:
- `AuthProvider` - Autentifikatsiya holati
- Local state hook'lar har bir komponent uchun

## Deployment

### Production build

```bash
npm run build:production
```

Build fayllar `build/` papkasida paydo bo'ladi.

### Environment o'zgaruvchilar

Production uchun quyidagi o'zgaruvchilarni sozlang:

```env
REACT_APP_ENV=production
REACT_APP_API_BASE_URL=https://your-production-api.com
GENERATE_SOURCEMAP=false
```

## Backend integratsiya

Ushbu admin panel quyidagi backend API bilan ishlaydi:
- Base URL: `https://lrussrubackend-production.up.railway.app`
- JWT autentifikatsiya
- Redis cache tizimi
- PostgreSQL ma'lumotlar bazasi

### Admin hisobi

Backend'da admin hisobi yaratish uchun:
1. Telegram bot orqali telefon raqamni ro'yxatdan o'tkazing
2. Backend environment o'zgaruvchilarida `ADMIN_PHONE` va `ADMIN_PASSWORD` ni sozlang
3. Admin panel orqali kirish

## Troubleshooting

### Umumiy muammolar

1. **API ulanish xatoligi**
   - Backend server ishlab turganini tekshiring
   - CORS sozlamalarini tekshiring
   - Network tab orqali so'rovlarni kuzating

2. **Cache muammolari**
   - Browser cache'ni tozalang
   - LocalStorage'ni tozalang
   - `REACT_APP_CACHE_ENABLED=false` qiling

3. **Auth muammolari**
   - Token'lar LocalStorage'da saqlanishini tekshiring
   - Admin telefon va parolni tekshiring
   - Backend admin sozlamalarini tekshiring

### Browser qo'llab-quvvatlash

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Hissa qo'shish

1. Repository'ni fork qiling
2. Feature branch yarating (`git checkout -b feature/yangi-funksiya`)
3. O'zgarishlarni commit qiling (`git commit -m 'Yangi funksiya qo'shildi'`)
4. Branch'ni push qiling (`git push origin feature/yangi-funksiya`)
5. Pull Request yarating

## Litsenziya

Ushbu loyiha [MIT License](LICENSE) ostida litsenziyalangan.

## Aloqa

Savollar yoki yordam uchun:
- Email: support@lruss.uz
- Telegram: @lruss_support

---

**LRUSS Educational Platform** - Zamonaviy ta'lim texnologiyalari bilan o'qitish.