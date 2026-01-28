#!/usr/bin/env bash

# Script to reorganize project into frontend and backend folders

echo "🔄 Starting project reorganization..."

# Create frontend structure
mkdir -p frontend

# Copy frontend files
cp -r src frontend/
cp -r public frontend/
cp index.html frontend/
cp vite.config.ts frontend/
cp tsconfig.json frontend/
cp tsconfig.app.json frontend/
cp tsconfig.node.json frontend/
cp eslint.config.js frontend/
cp package.json frontend/
cp .env.local frontend/
cp .env.example frontend/

# Create .gitignore for frontend
cat > frontend/.gitignore << 'EOF'
# Logs
logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
lerna-debug.log*

node_modules
dist
dist-ssr
*.local

# Editor directories and files
.vscode/*
!.vscode/extensions.json
.idea
.DS_Store
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?
EOF

# Create frontend README
cat > frontend/README.md << 'EOF'
# 🎮 Telegram Mini App - Frontend

React + TypeScript + Vite frontend для Telegram Mini App.

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
VITE_ADMIN_IDS=your_user_id
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
├── config/           # Конфигурация (admin, telegram)
├── hooks/            # Custom React hooks
├── pages/            # Страницы приложения
├── services/         # API сервисы
├── styles/           # CSS стили
├── types/            # TypeScript типы
├── App.tsx           # Главный компонент
├── main.tsx          # Точка входа
└── index.css         # Глобальные стили
```

## 📄 Страницы

- **HomePage** (🏠) - Главная страница с описанием и ссылками
- **TournamentsPage** (🏆) - Список турниров и регистрация
- **RatingPage** (⭐) - Рейтинг игроков и лидерборд
- **ShopPage** (🛍️) - Магазин товаров и скинов
- **ProfilePage** (👤) - Профиль пользователя и статистика
- **AdminPage** (⚙️) - Админ-панель для создания турниров (только для администраторов)

## 🔑 Переменные окружения

| Переменная | Описание | Пример |
|-----------|---------|--------|
| `VITE_API_URL` | URL backend API | `http://localhost:3000` |
| `VITE_TELEGRAM_BOT_TOKEN` | Токен Telegram бота | `123456:ABC-DEF1234` |
| `VITE_ADMIN_IDS` | ID администраторов (через запятую) | `5116606689,987654321` |

## 🎨 Компоненты

- **Navigation** - Нижняя навигация между страницами
- **UserAvatar** - Аватар пользователя с динамическими цветами
- **DebugPanel** - Панель отладки для диагностики (видна в разработке)

## 🔌 API Интеграция

Frontend использует API на `VITE_API_URL` для:
- Получения списка турниров
- Регистрации в турнирах
- Получения данных пользователя
- Покупки товаров в магазине
- Получения рейтинга

## 🚀 Развертывание

### Netlify
1. Подключите репозиторий GitHub
2. Install command: `cd frontend && npm install`
3. Build command: `npm run build`
4. Publish directory: `dist`
5. Добавьте переменные окружения в Netlify settings

### Vercel
1. Импортируйте проект
2. Выберите папку: `frontend`
3. Environment Variables добавьте `VITE_*` переменные
4. Deploy!

### GitHub Pages
```bash
npm run build
npx gh-pages -d dist
```

## 📚 Дополнительные ресурсы

- [Vite Documentation](https://vitejs.dev/)
- [React Documentation](https://react.dev/)
- [TypeScript Documentation](https://www.typescriptlang.org/)
- [Telegram Mini Apps](https://core.telegram.org/bots/webapps)

## 🐛 Troubleshooting

### Ошибка: "Cannot find module '@vite/plugin-react'"
Решение: Выполните `npm install`

### API returns 404
Решение: Убедитесь, что backend запущен на `VITE_API_URL`

### Telegram WebApp not available
Решение: Откройте приложение через Telegram бота, не напрямую в браузере

## 📝 Лицензия

MIT

## 👨‍💻 Автор

Gaming Arena Team
EOF

echo "✅ Frontend setup completed!"
echo ""
echo "Frontend файлы находятся в: frontend/"
echo "Backend файлы находятся в: backend/"
echo ""
echo "Для развертывания:"
echo "1. Frontend: cd frontend && npm install && npm run dev"
echo "2. Backend: cd backend && npm install && npm start"

EOF
