# 📦 Инструкция по миграции на разделенную структуру

## ✅ Что произошло

Проект был разделен на две отдельные папки:

```
source/
├── frontend/    ← React + Vite приложение
├── backend/     ← Express сервер
└── [старые файлы]  ← Можно удалить после проверки
```

## 🔄 Что нужно сделать

### 1. **Скопировать фронтенд файлы в папку `frontend/src`**

Все файлы из `src/` нужно скопировать в `frontend/src/`:

```bash
# Копируем вручную или через терминал:
Copy-Item -Path "src/*" -Destination "frontend/src/" -Recurse -Force
Copy-Item -Path "public/*" -Destination "frontend/public/" -Recurse -Force
```

Файлы, которые нужно скопировать:
- ✅ `src/` → скопировать в `frontend/src/`
- ✅ `public/` → скопировать в `frontend/public/`
- ✅ `index.html` → скопировать в `frontend/`
- ✅ `vite.config.ts` → скопировать в `frontend/`
- ✅ `tsconfig*.json` → скопировать в `frontend/`
- ✅ `eslint.config.js` → скопировать в `frontend/`
- ✅ `.env.local` → скопировать в `frontend/`

### 2. **Обновить Backend .env**

В папке `backend/` создайте `.env` файл на основе `.env.example`:

```bash
cd backend
cp .env.example .env
```

Заполните:
```env
PORT=3000
TELEGRAM_BOT_TOKEN=your_token_here
MINI_APP_URL=https://miniappeden.netlify.app
NODE_ENV=development
```

### 3. **Обновить Frontend .env.local**

В папке `frontend/` создайте `.env.local` файл на основе `.env.example`:

```bash
cd frontend
cp .env.example .env.local
```

Убедитесь, что `VITE_API_URL` указывает на backend:
```env
VITE_API_URL=http://localhost:3000
VITE_TELEGRAM_BOT_TOKEN=your_token_here
VITE_ADMIN_IDS=5116606689
```

### 4. **Установить зависимости для обеих папок**

```bash
# Backend
cd backend
npm install

# Frontend (в новом терминале)
cd frontend
npm install
```

### 5. **Запустить оба сервера**

**Терминал 1 - Backend:**
```bash
cd backend
npm start
# Сервер запустится на http://localhost:3000
```

**Терминал 2 - Frontend:**
```bash
cd frontend
npm run dev
# Приложение откроется на http://localhost:5173
```

## 🗂️ Финальная структура проекта

После всех шагов у вас должна быть:

```
source/
├── frontend/                    # Фронтенд
│   ├── src/
│   │   ├── components/
│   │   ├── config/
│   │   ├── hooks/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── types/
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   ├── public/
│   ├── index.html
│   ├── vite.config.ts
│   ├── tsconfig.json
│   ├── package.json
│   ├── .env.example
│   ├── .env.local (создать из .env.example)
│   ├── .gitignore
│   └── README.md
│
├── backend/                     # Бэкенд
│   ├── server.js
│   ├── data/                   # Хранилище турниров
│   │   └── tournaments.json
│   ├── package.json
│   ├── .env.example
│   ├── .env (создать из .env.example)
│   ├── .gitignore
│   └── README.md
│
├── README_STRUCTURE.md          # Этот файл
├── SETUP_MIGRATION.md          # Инструкции
└── [другие документы]
```

## 🚀 Проверка работоспособности

### Проверить backend

```bash
cd backend
npm start

# В браузере откройте:
http://localhost:3000/health

# Вы должны увидеть:
{"status":"ok"}
```

### Проверить frontend

```bash
cd frontend
npm run dev

# Откроется http://localhost:5173
# Должна загрузиться страница приложения
```

### Проверить API соединение

1. Откройте браузер на http://localhost:5173
2. Откройте DevTools (F12)
3. Перейдите на вкладку "Сеть" (Network)
4. На странице "🏆 Турниры" должны загрузиться данные
5. Вы должны увидеть запросы GET/POST к `http://localhost:3000/api/tournaments`

## 🔄 Миграция на Git

Если вы хотите обновить Git репозиторий:

```bash
# Добавить все изменения
git add .

# Создать commit
git commit -m "refactor: separate frontend and backend into different folders

- Moved React app to frontend/ directory
- Moved Express server to backend/ directory  
- Added proper .env.example files for both
- Added README files for both directories
- Updated .gitignore for each folder
- Projects now fully separated and independent"

# Отправить в репозиторий
git push
```

## 📚 Дополнительная информация

- **Frontend документация**: `frontend/README.md`
- **Backend документация**: `backend/README.md`
- **Структура проекта**: `README_STRUCTURE.md`

## ⚠️ Важно

### Порты по умолчанию

- **Backend**: `3000`
- **Frontend**: `5173`

Если эти порты заняты, вы можете изменить их в:
- Backend: `backend/server.js` (переменная `PORT`)
- Frontend: `frontend/vite.config.ts`

### Развертывание

- **Frontend**: Развертывается отдельно на Netlify/Vercel
- **Backend**: Развертывается отдельно на Heroku/Vercel/Netlify

Смотрите README каждой папки для деталей.

## 🆘 Если что-то пошло не так

### 1. Чистая переустановка

```bash
# Backend
cd backend
rm -rf node_modules package-lock.json
npm install
npm start

# Frontend
cd frontend
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### 2. Проверить порты

```bash
# Linux/macOS
lsof -i :3000
lsof -i :5173

# Windows
netstat -ano | findstr :3000
netstat -ano | findstr :5173
```

### 3. Очистить кэш браузера

Используйте Ctrl+Shift+Del или откройте DevTools → Application → Clear Site Data

## ✅ Когда всё работает

Вы должны увидеть:

1. ✅ Backend запущен на http://localhost:3000
2. ✅ Frontend открыт на http://localhost:5173  
3. ✅ API запросы успешны (смотрите Network tab в DevTools)
4. ✅ Турниры загружаются на странице "🏆 Турниры"
5. ✅ Админ-панель доступна (если ID в VITE_ADMIN_IDS)

---

**Готово! 🎉**

Проект теперь полностью разделен и готов к развитию!
