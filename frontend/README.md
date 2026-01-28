# 🎮 Telegram Mini App - Frontend

React + TypeScript + Vite фронтенд для Telegram Mini App.

## 📋 Требования

- Node.js 18+
- npm или yarn

## 🛠️ Установка

1. Перейдите в папку frontend:
```bash
cd frontend
```

2. Установите зависимости:
```bash
npm install
```

3. Создайте `.env.local` файл:
```bash
cp .env.example .env.local
```

4. Заполните переменные окружения:
```env
VITE_API_URL=http://localhost:3000
VITE_TELEGRAM_BOT_TOKEN=your_token_here
VITE_ADMIN_IDS=5116606689
```

## 🚀 Запуск

### Development mode:
```bash
npm run dev
```

Откроется на `http://localhost:5173`

### Build for production:
```bash
npm run build
```

### Preview production build:
```bash
npm run preview
```

## 🏗️ Структура проекта

```
src/
├── components/        # React компоненты
│   ├── Navigation.tsx
│   ├── UserAvatar.tsx
│   └── DebugPanel.tsx
├── config/           # Конфигурация
│   ├── admin.ts
│   └── telegram.ts
├── hooks/            # Custom React hooks
│   └── useTournamentManagement.ts
├── pages/            # Страницы приложения
│   ├── HomePage.tsx
│   ├── TournamentsPage.tsx
│   ├── RatingPage.tsx
│   ├── ShopPage.tsx
│   ├── ProfilePage.tsx
│   └── AdminPage.tsx
├── services/         # API сервисы
│   └── api.ts
├── styles/           # CSS стили
├── types/            # TypeScript типы
│   └── tournaments.ts
├── App.tsx           # Главный компонент
├── main.tsx          # Точка входа
└── index.css         # Глобальные стили
```

## 📄 Страницы

- **🏠 HomePage** - Главная страница с описанием
- **🏆 TournamentsPage** - Список турниров и регистрация
- **⭐ RatingPage** - Рейтинг и лидерборд
- **🛍️ ShopPage** - Магазин товаров
- **👤 ProfilePage** - Профиль и статистика
- **⚙️ AdminPage** - Админ-панель (только для администраторов)

## 🔑 Переменные окружения

| Переменная | Описание | Пример |
|-----------|---------|--------|
| `VITE_API_URL` | URL backend API | `http://localhost:3000` |
| `VITE_TELEGRAM_BOT_TOKEN` | Telegram бот токен | `123456:ABC-DEF1234` |
| `VITE_ADMIN_IDS` | ID админов (через запятую) | `5116606689,987654321` |

## 🎨 Компоненты

- **Navigation** - Нижняя навигация (5 вкладок)
- **UserAvatar** - Аватар пользователя с динамическими цветами
- **DebugPanel** - Панель отладки (красная кнопка в углу)

## 📚 Hooks

- **useTournamentManagement** - Управление турнирами (fetch, create, join, leave)

## 🔌 API Сервис

Файл `src/services/api.ts` содержит все API методы:

```typescript
// Турниры
tournamentAPI.getTournaments()
tournamentAPI.createTournament(data)
tournamentAPI.joinTournament(userId, tournamentId)

// Пользователи
userAPI.getUser(userId)
userAPI.createUser(data)

// Рейтинг
ratingAPI.getLeaderboard()
ratingAPI.getUserRating(userId)

// Магазин
shopAPI.getItems()
shopAPI.purchase(userId, itemId)
```

## 🚀 Развертывание

### На Netlify

1. Подключите GitHub репозиторий
2. Выберите папку: `frontend`
3. Build command: `npm run build`
4. Publish directory: `dist`
5. Добавьте переменные окружения в Netlify settings

### На Vercel

1. Импортируйте проект
2. Выберите папку: `frontend`
3. Добавьте `VITE_*` переменные окружения
4. Deploy!

### На GitHub Pages

```bash
npm run build
npx gh-pages -d dist
```

## 🔧 Конфигурация

### `vite.config.ts`
Настройки Vite для React + TypeScript

### `tsconfig.json`
TypeScript конфигурация

### `eslint.config.js`
ESLint правила

## 📚 Дополнительные ресурсы

- [Vite](https://vitejs.dev/)
- [React](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Telegram Mini Apps](https://core.telegram.org/bots/webapps)

## 🐛 Troubleshooting

### Ошибка: "Cannot find module"
```bash
rm -rf node_modules package-lock.json
npm install
```

### API returns 404
Убедитесь, что backend запущен на `http://localhost:3000`

### Telegram WebApp не определяется
Откройте приложение через Telegram бота, не в обычном браузере

## 📝 Лицензия

MIT

## 👨‍💻 Автор

Gaming Arena Team
