# 🔐 Интеграция Telegram Bot API

## 📋 Быстрый старт

### 1️⃣ Получить токен бота

1. Откройте Telegram и найти **@BotFather**
2. Отправить `/newbot`
3. Ответить на вопросы о названии и юзернейме
4. Получить токен вида: `123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11`

### 2️⃣ Добавить токен в приложение

**Вариант A: Через файл `.env.local` (рекомендуется)**

Создайте файл `.env.local` в корне проекта:

```env
VITE_TELEGRAM_BOT_TOKEN=YOUR_BOT_TOKEN_HERE
VITE_TELEGRAM_BOT_USERNAME=YourBotUsername
VITE_API_URL=http://localhost:3000/api
```

**Вариант B: Через переменные окружения**

```bash
# Windows PowerShell
$env:VITE_TELEGRAM_BOT_TOKEN="123456:ABC-DEF1234..."
npm run dev

# Linux/Mac
export VITE_TELEGRAM_BOT_TOKEN="123456:ABC-DEF1234..."
npm run dev
```

### 3️⃣ Использовать в компонентах

```tsx
import { getTelegramUserInfo, TelegramBotAPI } from '@/config/telegram'
import { useUserProfile } from '@/hooks/useAPI'

function MyComponent() {
  // Получить информацию пользователя
  const user = getTelegramUserInfo()
  console.log('User:', user)
  
  // Использовать API хук
  const { profile, loading } = useUserProfile(user?.id)
  
  return <div>{loading ? 'Loading...' : profile?.username}</div>
}
```

---

## 🛠️ Структура файлов

```
src/
├── config/
│   └── telegram.ts          ← Конфигурация и классы
├── services/
│   └── api.ts               ← API методы для backend
├── hooks/
│   └── useAPI.ts            ← React хуки для данных
└── pages/
    ├── HomePage.tsx
    ├── ShopPage.tsx
    └── ...
```

---

## 🌐 Backend интеграция (Node.js)

### Установка зависимостей

```bash
npm init -y
npm install express cors dotenv node-telegram-bot-api
```

### Создание файла `.env` для сервера

```env
TELEGRAM_BOT_TOKEN=YOUR_BOT_TOKEN
PORT=3000
```

### Запуск сервера

```bash
node server.js
```

Сервер будет доступен на `http://localhost:3000`

---

## 📤 Примеры использования

### Отправить сообщение пользователю

```tsx
import { TelegramBotAPI, TELEGRAM_CONFIG } from '@/config/telegram'

const bot = new TelegramBotAPI(TELEGRAM_CONFIG.BOT_TOKEN)

async function notifyUser() {
  await bot.sendMessage(123456789, '🎉 Поздравляем с победой!')
}
```

### Получить профиль пользователя

```tsx
import { userAPI } from '@/services/api'

async function loadProfile() {
  try {
    const profile = await userAPI.getProfile(userId)
    console.log('Profile:', profile)
  } catch (error) {
    console.error('Failed to load:', error)
  }
}
```

### Совершить покупку

```tsx
import { shopAPI } from '@/services/api'

async function buyItem() {
  try {
    const result = await shopAPI.purchase(userId, itemId)
    alert(`✅ Куплено: ${result.message}`)
  } catch (error) {
    alert(`❌ Ошибка: ${error.message}`)
  }
}
```

### Получить рейтинг

```tsx
import { useLeaderboard } from '@/hooks/useAPI'

function RatingPage() {
  const { leaderboard, loading, fetchLeaderboard } = useLeaderboard()
  
  useEffect(() => {
    fetchLeaderboard(10) // Топ 10
  }, [])
  
  return (
    <div>
      {loading ? 'Loading...' : leaderboard.map(player => (
        <div key={player.telegramId}>{player.username}</div>
      ))}
    </div>
  )
}
```

---

## 🔒 Безопасность

**⚠️ ВАЖНО:**

1. **НИКОГДА** не коммитьте `.env.local` в Git
2. Добавьте в `.gitignore`:
   ```
   .env.local
   .env
   ```

3. На продакшене используйте переменные окружения платформы:
   - **Vercel**: Project Settings → Environment Variables
   - **Netlify**: Site settings → Build & deploy → Environment
   - **Heroku**: Config Vars

4. Используйте **webhook вместо polling** для бота на продакшене

---

## 📚 Полезные ссылки

- [Telegram Bot API](https://core.telegram.org/bots/api)
- [Telegram WebApp](https://core.telegram.org/bots/webapps)
- [node-telegram-bot-api](https://github.com/yagop/node-telegram-bot-api)
- [@BotFather](https://t.me/BotFather)

---

## ✅ Чек-лист развертывания

- [ ] Получил токен от @BotFather
- [ ] Добавил токен в `.env.local`
- [ ] Запустил `npm run dev` и проверил консоль
- [ ] Backend сервер запущен на `http://localhost:3000`
- [ ] API запросы работают в DevTools
- [ ] Протестировал все страницы и функции
- [ ] Готов к развертыванию на Vercel/Netlify

