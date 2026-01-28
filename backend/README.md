# 🚀 Telegram Mini App - Backend

Node.js + Express backend server для Telegram Mini App.

## 📋 Требования

- Node.js 18+
- npm или yarn

## 🛠️ Установка

1. Перейдите в папку backend:
```bash
cd backend
```

2. Установите зависимости:
```bash
npm install
```

3. Создайте `.env` файл на основе `.env.example`:
```bash
cp .env.example .env
```

4. Заполните переменные окружения:
```env
PORT=3000
TELEGRAM_BOT_TOKEN=your_token_here
MINI_APP_URL=https://miniappeden.netlify.app
NODE_ENV=development
```

## 🚀 Запуск

### Development mode (с автоперезагрузкой):
```bash
npm run dev
```

### Production mode:
```bash
npm start
```

Сервер запустится на `http://localhost:3000`

## 📚 API Endpoints

### Users
- `GET /api/users/:userId` - Получить пользователя
- `POST /api/users` - Создать пользователя
- `PUT /api/users/:userId` - Обновить пользователя

### Tournaments
- `GET /api/tournaments` - Получить все турниры
- `GET /api/tournaments/:id` - Получить турнир по ID
- `POST /api/tournaments` - Создать турнир
- `PUT /api/tournaments/:id` - Обновить турнир
- `DELETE /api/tournaments/:id` - Удалить турнир
- `POST /api/tournaments/join` - Присоединиться к турниру
- `POST /api/tournaments/leave` - Выйти из турнира
- `POST /api/tournaments/:id/finish` - Завершить турнир
- `GET /api/tournaments/:id/results` - Получить результаты

### Shop
- `GET /api/shop/items` - Получить товары
- `POST /api/shop/purchase` - Купить товар
- `GET /api/shop/user/:userId/items` - Получить товары пользователя

### Rating
- `GET /api/rating/leaderboard` - Получить рейтинг
- `GET /api/rating/user/:userId` - Получить рейтинг пользователя
- `POST /api/rating/add-points` - Добавить очки

### Health Check
- `GET /health` - Проверка статуса сервера

## 🗃️ Хранение данных

Данные о турнирах сохраняются в `data/tournaments.json` для persistence.

## 🔧 Конфигурация

### Переменные окружения

| Переменная | Описание | Пример |
|-----------|---------|--------|
| `PORT` | Порт сервера | `3000` |
| `TELEGRAM_BOT_TOKEN` | Токен Telegram бота | `123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11` |
| `MINI_APP_URL` | URL мини-приложения | `https://miniappeden.netlify.app` |
| `NODE_ENV` | Окружение | `development` или `production` |

## 📦 Зависимости

- **express** - Web-фреймворк
- **cors** - Cross-Origin Resource Sharing
- **dotenv** - Загрузка переменных окружения
- **node-telegram-bot-api** - Telegram Bot API

## 🐛 Troubleshooting

### Ошибка: "Cannot find module 'express'"
Решение: Выполните `npm install`

### Ошибка: "PORT is already in use"
Решение: Измените PORT в `.env` файле или закройте процесс, который использует этот порт

### Ошибка: "TELEGRAM_BOT_TOKEN is not set"
Решение: Убедитесь, что `.env` файл создан и содержит `TELEGRAM_BOT_TOKEN`

## 🌐 Развертывание

### Netlify
1. Подключите репозиторий GitHub
2. Установите build command: `cd backend && npm install`
3. Установите publish directory: `backend`
4. Добавьте переменные окружения в Netlify settings

### Heroku
```bash
heroku create your-app-name
heroku config:set TELEGRAM_BOT_TOKEN=your_token
git push heroku main
```

### Vercel
```bash
vercel --prod
```

## 📝 Лицензия

MIT

## 👨‍💻 Автор

Gaming Arena Team
