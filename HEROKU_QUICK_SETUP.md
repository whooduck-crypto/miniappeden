# ⚡ Быстрый Deploy на Netlify + Heroku за 5 минут

## 🎯 Что делаем:
1. Frontend → Netlify (Бесплатно)
2. Backend → Heroku (Бесплатно)

---

## 1️⃣ Netlify Frontend (2 минуты)

### Шаг 1: Создайте сайт на Netlify
```
1. Откройте https://app.netlify.com
2. "Add new site" → "Import an existing project"
3. GitHub → Select repository
4. Deploy
```

### Шаг 2: Настройте для Frontend папки

```
Base directory: frontend
Build command: npm run build
Publish directory: dist
```

### Шаг 3: Добавьте переменные

Site Settings → Build & deploy → Environment:

```
VITE_API_URL = (оставьте пока http://localhost:3000)
VITE_TELEGRAM_BOT_TOKEN = YOUR_BOT_TOKEN
VITE_ADMIN_IDS = 5116606689
```

✅ **Frontend готов на Netlify!**

---

## 2️⃣ Heroku Backend (3 минуты)

### Шаг 1: Установите Heroku CLI

**Windows:**
- Скачайте: https://devcenter.heroku.com/articles/heroku-cli
- Установите
- Перезагрузитесь

### Шаг 2: Авторизуйтесь

```powershell
heroku login
# Откроется браузер, авторизуйтесь
```

### Шаг 3: Создайте приложение

```powershell
heroku create miniapp-backend

# Готово! Будет: https://miniapp-backend.herokuapp.com
```

### Шаг 4: Добавьте переменные окружения

```powershell
heroku config:set TELEGRAM_BOT_TOKEN=YOUR_BOT_TOKEN
heroku config:set NODE_ENV=production
```

### Шаг 5: Задеплойте Backend

```powershell
# Убедитесь что в корне проекта
cd c:\Users\bigplay\Downloads\source

# Добавьте Heroku remote
heroku git:remote -a miniapp-backend

# Отправьте
git push heroku main

# Проверьте
heroku logs --tail
```

### Шаг 6: Проверьте что Backend работает

```powershell
# Откройте в браузере
https://miniapp-backend.herokuapp.com/health

# Должна вернуться: {"status":"ok"}
```

✅ **Backend готов на Heroku!**

---

## 3️⃣ Свяжите Frontend и Backend

### Обновите Frontend переменные на Netlify

1. Откройте https://app.netlify.com
2. Выберите ваш сайт
3. Site settings → Build & deploy → Environment
4. Измените:

```
VITE_API_URL = https://miniapp-backend.herokuapp.com
```

5. Netlify автоматически пересоберет приложение

---

## ✅ Готово!

**Вашы URLs:**

```
Frontend: https://miniappeden.netlify.app
Backend:  https://miniapp-backend.herokuapp.com
```

### Проверка:

1. Откройте Frontend в браузере
2. Перейдите на "🏆 Турниры"
3. Должны загрузиться турниры с Backend
4. Если есть - всё работает! 🎉

---

## 🔄 Обновление кода

### Обновить Frontend:
```bash
git add frontend/
git commit -m "update frontend"
git push
# Netlify автоматически задеплоит
```

### Обновить Backend:
```bash
git add backend/
git commit -m "update backend"
git push heroku main
# Heroku автоматически задеплоит
```

---

## 🚨 Если не работает

### Frontend не видит Backend

Откройте DevTools (F12) → Console и проверьте:

```javascript
// Скопируйте в консоль:
fetch('https://miniapp-backend.herokuapp.com/health').then(r => r.json()).then(console.log)
```

Если ошибка - Backend не запущен. Проверьте:
```powershell
heroku logs --tail
```

### Backend не запускается

```powershell
# Посмотрите логи
heroku logs --tail

# Перезагрузите
heroku restart

# Проверьте переменные
heroku config
```

### Heroku говорит "No web processes running"

```powershell
# Создайте Procfile в корне проекта
echo "web: cd backend && npm start" > Procfile

git add Procfile
git commit -m "add procfile"
git push heroku main
```

---

## 💡 Советы

- **Netlify автоматически деплоит** при `git push`
- **Heroku нужен явный push**: `git push heroku main`
- **Логи помогут найти проблемы**: `heroku logs --tail`
- **Перезагрузить приложение**: `heroku restart`

---

## ❓ Вопросы?

- Frontend документация: `frontend/README.md`
- Backend документация: `backend/README.md`
- Полная инструкция: `NETLIFY_DEPLOYMENT.md`

---

**Всё готово! Ваше приложение в облаке! 🌐✨**
