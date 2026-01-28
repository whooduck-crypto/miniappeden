# 🚀 Куда вставлять API от Telegram Bot

## 📍 Быстрый ответ

Есть **3 способа интеграции API**:

---

## 1️⃣ **СПОСОБ 1: Через файл `.env.local` (РЕКОМЕНДУЕТСЯ)**

### Шаг 1: Получить токен бота

1. Откройте **Telegram**
2. Найдите **@BotFather**
3. Отправьте команду: `/newbot`
4. Следуйте инструкциям
5. Получите токен вида: `123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11`

### Шаг 2: Создать файл `.env.local`

Откройте файл (находится в корне проекта): `.env.local`

Добавьте туда:
```env
VITE_TELEGRAM_BOT_TOKEN=123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11
VITE_TELEGRAM_BOT_USERNAME=YourBotUsername
```

### Шаг 3: Готово! ✅

Теперь в приложении можно использовать:

```tsx
import { TELEGRAM_CONFIG } from '@/config/telegram'

console.log(TELEGRAM_CONFIG.BOT_TOKEN)  // Ваш токен
```

---

## 2️⃣ **СПОСОБ 2: Прямо в коде (временно для разработки)**

Откройте файл `src/config/telegram.ts`:

```tsx
// РАСКОММЕНТИРУЙТЕ ЭТОТ ВАРИАНТ:
export const TELEGRAM_CONFIG = {
  BOT_TOKEN: '123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11',
  BOT_USERNAME: 'YourBotUsername',
  API_URL: 'https://api.telegram.org',
};
```

⚠️ **ВАЖНО:** После разработки вернуть назад на `.env.local`!

---

## 3️⃣ **СПОСОБ 3: Через переменные окружения (для CI/CD)**

### Windows PowerShell:
```powershell
$env:VITE_TELEGRAM_BOT_TOKEN="123456:ABC-DEF1234..."
npm run dev
```

### Linux/Mac:
```bash
export VITE_TELEGRAM_BOT_TOKEN="123456:ABC-DEF1234..."
npm run dev
```

---

## 📂 Где находятся файлы интеграции

```
📁 source/
├── src/
│   ├── config/
│   │   └── telegram.ts          ← ГЛАВНЫЙ ФАЙЛ С КОНФИГОМ
│   ├── services/
│   │   └── api.ts               ← API методы для работы с backend
│   ├── hooks/
│   │   └── useAPI.ts            ← React хуки для данных
│   └── pages/
│       └── ShopPageWithAPI.example.tsx  ← Пример с реальным API
├── .env.local                   ← ВАШИ ТОКЕНЫ (не коммитить!)
├── .env.example                 ← ШАБЛОН
├── TELEGRAM_SETUP.md            ← ПОЛНАЯ ДОКУМЕНТАЦИЯ
└── server.js                    ← ПРИМЕР BACKEND НА NODE.JS
```

---

## 🔌 Как использовать в компонентах

### Пример 1: Получить информацию пользователя

```tsx
import { getTelegramUserInfo } from '@/config/telegram'

function MyComponent() {
  const user = getTelegramUserInfo()
  
  if (!user) {
    return <div>❌ Откройте приложение через Telegram</div>
  }
  
  return (
    <div>
      👤 {user.first_name}
      🆔 {user.id}
    </div>
  )
}
```

### Пример 2: Отправить сообщение боту

```tsx
import { TelegramBotAPI, TELEGRAM_CONFIG } from '@/config/telegram'

async function notifyUser() {
  const bot = new TelegramBotAPI(TELEGRAM_CONFIG.BOT_TOKEN)
  
  await bot.sendMessage(
    123456789,  // ID пользователя
    '🎉 Поздравляем с победой!'
  )
}
```

### Пример 3: Загрузить данные с Backend

```tsx
import { useUserProfile } from '@/hooks/useAPI'

function ProfilePage() {
  const { profile, loading } = useUserProfile(userId)
  
  if (loading) return <div>⏳ Загрузка...</div>
  
  return <div>{profile?.username}</div>
}
```

### Пример 4: Совершить покупку

```tsx
import { shopAPI } from '@/services/api'

async function buyItem() {
  try {
    await shopAPI.purchase(userId, itemId)
    alert('✅ Товар куплен!')
  } catch (error) {
    alert('❌ Ошибка: ' + error.message)
  }
}
```

---

## 🖥️ Backend интеграция (Node.js)

### Установить зависимости:
```bash
cd source
npm init -y
npm install express cors dotenv node-telegram-bot-api
```

### Запустить сервер:
```bash
node server.js
```

Сервер будет на: `http://localhost:3000`

API endpoints:
- `GET /api/users/:userId`
- `POST /api/shop/purchase`
- `GET /api/rating/leaderboard`
- И другие...

---

## 🔐 Безопасность

### ✅ ПРАВИЛЬНО:
```env
# .env.local (НЕ коммитить в Git)
VITE_TELEGRAM_BOT_TOKEN=123456:ABC-DEF1234...
```

### ❌ НЕПРАВИЛЬНО:
```tsx
// Никогда так не делайте!
const token = '123456:ABC-DEF1234...'  // В коде!
```

### Добавить в `.gitignore`:
```
.env.local
.env
node_modules/
dist/
```

---

## ✅ Чек-лист

- [ ] Получил токен от @BotFather
- [ ] Создал файл `.env.local`
- [ ] Добавил токен в `.env.local`
- [ ] Запустил `npm run dev`
- [ ] Проверил консоль (должны быть логи Telegram User)
- [ ] Протестировал загрузку данных
- [ ] Запустил backend `node server.js`
- [ ] Готов к развертыванию!

---

## 🆘 Частые ошибки

### Ошибка: "API_URL is not defined"
**Решение:** Проверьте `.env.local`, может быть пропущена переменная

### Ошибка: "Failed to resolve import"
**Решение:** Убедитесь, что файлы созданы правильно:
```bash
ls src/config/telegram.ts      # Должен существовать
ls src/services/api.ts         # Должен существовать
ls src/hooks/useAPI.ts         # Должен существовать
```

### Ошибка: "Cannot find module 'node-telegram-bot-api'"
**Решение:** Установите зависимости для backend:
```bash
npm install node-telegram-bot-api
```

---

## 📚 Дополнительно

- Полная документация: `TELEGRAM_SETUP.md`
- Примеры кода: `TELEGRAM_HOOKS_EXAMPLES.tsx`
- Расширенные примеры: `ADVANCED_HOOKS_EXAMPLES.tsx`
- Использование компонентов: `COMPONENTS_USAGE_EXAMPLES.tsx`

---

## 🎯 Итого

**За 5 минут:**
1. Получить токен от @BotFather
2. Добавить в `.env.local`
3. Запустить `npm run dev`
4. Готово! ✅

**Все файлы уже созданы** - осталось только добавить токен! 🚀
