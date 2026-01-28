# 🚀 Развертывание на Netlify

Инструкция по развертыванию Frontend и Backend отдельно на Netlify.

## 📋 Что нужно

- GitHub аккаунт с вашим репозиторием
- Netlify аккаунт (бесплатно на netlify.com)
- Git установлен локально

---

## 1️⃣ Развертывание Frontend на Netlify

### Шаг 1: Подключить GitHub репозиторий

1. Откройте https://app.netlify.com
2. Кликните "Add new site" → "Import an existing project"
3. Выберите GitHub
4. Авторизуйтесь если нужно
5. Найдите ваш репозиторий `miniappeden`

### Шаг 2: Настройте сборку для Frontend

В форме "Deploy settings" заполните:

| Поле | Значение |
|------|---------|
| Base directory | `frontend` |
| Build command | `npm run build` |
| Publish directory | `frontend/dist` |

**Как это выглядит:**

```
Base directory: frontend
Build command: npm run build
Publish directory: dist
```

⚠️ **Важно**: Если указали `frontend/dist`, это неправильно! Должно быть просто `dist` (относительно папки `frontend`)

### Шаг 3: Добавить переменные окружения

1. После создания сайта, откройте **Site settings**
2. Перейдите в **Build & deploy** → **Environment**
3. Кликните "Edit variables"
4. Добавьте переменные:

```
VITE_API_URL = https://miniapp-backend.netlify.app
VITE_TELEGRAM_BOT_TOKEN = your_token_here
VITE_ADMIN_IDS = 5116606689
```

**Где найти эти значения:**
- `VITE_API_URL` - URL вашего backend на Netlify (см. шаг 2️⃣)
- `VITE_TELEGRAM_BOT_TOKEN` - вы получили от BotFather в Telegram
- `VITE_ADMIN_IDS` - ваш Telegram User ID (например: 5116606689)

### Шаг 4: Запустить деплой

1. Кликните "Deploy site"
2. Ждите ~2-3 минуты
3. Готово! 🎉 Ваш фронтенд на: `https://your-site-name.netlify.app`

---

## 2️⃣ Развертывание Backend на Netlify Functions

Netlify позволяет запускать backend как serverless functions. Но есть проблема: **Express требует постоянный сервер**.

### Вариант A: Развернуть Backend на Heroku (Рекомендуется)

Это проще, потому что вы можете использовать полный Node.js + Express.

```bash
# 1. Установите Heroku CLI
# Скачайте с https://devcenter.heroku.com/articles/heroku-cli

# 2. Авторизуйтесь
heroku login

# 3. Создайте приложение
heroku create miniapp-backend

# 4. Закоммитьте изменения
git add .
git commit -m "prepare for heroku deployment"

# 5. Отправьте backend на Heroku
git push heroku main

# 6. Проверьте статус
heroku logs --tail
```

**После развертывания на Heroku:**

Backend будет доступен по: `https://miniapp-backend.herokuapp.com`

Обновите `VITE_API_URL` в Frontend:
```
VITE_API_URL = https://miniapp-backend.herokuapp.com
```

---

### Вариант B: Развернуть Backend на Vercel (Альтернатива)

1. Откройте https://vercel.com
2. Кликните "Add New..." → "Project"
3. Импортируйте GitHub репозиторий
4. Выберите папку: `backend`
5. Build command: `npm install`
6. Разверните

Backend будет на: `https://miniapp-backend.vercel.app`

---

## 🔗 Финальная конфигурация

После развертывания обеих частей:

| Компонент | URL |
|-----------|-----|
| Frontend | https://miniappeden.netlify.app |
| Backend (Heroku) | https://miniapp-backend.herokuapp.com |
| Backend (Vercel) | https://miniapp-backend.vercel.app |

Обновите Frontend переменные:

**Frontend environment variables на Netlify:**
```
VITE_API_URL = https://miniapp-backend.herokuapp.com
VITE_TELEGRAM_BOT_TOKEN = your_token
VITE_ADMIN_IDS = 5116606689
```

---

## ⚙️ Детальная инструкция для Heroku

### Установка Heroku CLI

**Windows:**
1. Скачайте установщик: https://devcenter.heroku.com/articles/heroku-cli
2. Запустите installers
3. Перезагрузитесь
4. Откройте PowerShell

**macOS:**
```bash
brew tap heroku/brew && brew install heroku
```

**Linux:**
```bash
sudo snap install --classic heroku
```

### Создание Heroku приложения

```bash
# Авторизуйтесь
heroku login

# Создайте приложение
heroku create miniapp-backend

# Или если хотите конкретное имя:
heroku create my-custom-backend-name

# Проверьте созданное приложение
heroku apps
```

### Деплой Backend на Heroku

```bash
# Убедитесь что вы в корневой папке проекта
cd c:\Users\bigplay\Downloads\source

# Добавьте Heroku remote (если автоматически не добавилось)
heroku git:remote -a miniapp-backend

# Закоммитьте все изменения
git add .
git commit -m "ready for heroku deployment"

# Отправьте только backend в Heroku
git push heroku main

# Или если главная ветка не main:
git push heroku master

# Посмотрите логи
heroku logs --tail
```

### Установка переменных окружения на Heroku

```bash
# Способ 1: Через CLI
heroku config:set TELEGRAM_BOT_TOKEN=your_token
heroku config:set PORT=3000
heroku config:set NODE_ENV=production

# Способ 2: Через веб-интерфейс
# 1. Откройте dashboard.heroku.com
# 2. Выберите ваше приложение
# 3. Settings → Config Vars
# 4. Добавьте переменные вручную
```

### Проверка Backend на Heroku

```bash
# Откройте в браузере
https://miniapp-backend.herokuapp.com/health

# Должна вернуться:
{"status":"ok"}
```

---

## 🔄 Обновление кода после деплоя

### Обновить Frontend на Netlify

```bash
# 1. Внесите изменения в frontend/
# 2. Закоммитьте
git add frontend/
git commit -m "update frontend"

# 3. Отправьте
git push

# Netlify автоматически пересоберет и задеплоит
```

### Обновить Backend на Heroku

```bash
# 1. Внесите изменения в backend/
# 2. Закоммитьте
git add backend/
git commit -m "update backend"

# 3. Отправьте на Heroku
git push heroku main

# Проверьте что задеплоилось
heroku logs --tail
```

---

## 🐛 Troubleshooting

### Frontend не видит Backend

**Проблема:** Ошибка "Failed to load tournaments" на странице Турниры

**Решение:**
1. Проверьте что Backend запущен: `https://miniapp-backend.herokuapp.com/health`
2. Проверьте `VITE_API_URL` в Frontend переменных окружения Netlify
3. Проверьте CORS в `backend/server.js` (должен быть `cors()` без ограничений)
4. Откройте DevTools (F12) → Network → посмотрите какой URL используется для запроса

### Backend на Heroku не запускается

**Проверьте логи:**
```bash
heroku logs --tail
```

**Типичные проблемы:**
- Missing dependencies: `npm install` не был выполнен
- Port не указан: добавьте `PORT=3000` в Config Vars
- node_modules в .gitignore: это нормально, Heroku сам запустит `npm install`

### Превышена лимит свободного Heroku

Heroku предоставляет ~550 часов в месяц бесплатно (достаточно для постоянного запуска).

Если лимит превышен:
- Используйте Vercel вместо Heroku
- Или добавьте кредитную карту для большего лимита

---

## 💳 Альтернативы Heroku

Если Heroku не подходит, используйте:

1. **Vercel** (Рекомендуется)
   - Переразворачивает Backend автоматически
   - https://vercel.com

2. **Railway**
   - Новая платформа, похожа на Heroku
   - https://railway.app

3. **Render**
   - Бесплатный tier с 750 часов/месяц
   - https://render.com

4. **Fly.io**
   - Современная платформа
   - https://fly.io

---

## ✅ Финальная чек-лист

- [ ] Frontend развернут на Netlify
- [ ] Backend развернут на Heroku (или Vercel)
- [ ] `VITE_API_URL` указывает на Backend URL
- [ ] Переменные окружения установлены везде
- [ ] Frontend видит Backend (проверить Network в DevTools)
- [ ] Турниры загружаются на странице
- [ ] Админ-панель работает
- [ ] Присоединение к турниру работает

---

## 🎉 Готово!

Ваше приложение теперь работает в облаке! 🌐

**Frontend:** https://miniappeden.netlify.app  
**Backend:** https://miniapp-backend.herokuapp.com

Откройте приложение через Telegram бота и пройдитесь по всем функциям!

---

## 📞 Если что-то не работает

1. Проверьте логи:
   - Frontend: https://app.netlify.com → select site → Deploys
   - Backend: `heroku logs --tail`

2. Откройте DevTools в браузере (F12)
   - Network tab: проверьте какие запросы идут
   - Console tab: проверьте ошибки JavaScript

3. Проверьте что Backend живой: `curl https://miniapp-backend.herokuapp.com/health`

4. Убедитесь что переменные окружения установлены везде

---

**Последнее обновление:** Январь 2024  
**Версия:** 1.0
