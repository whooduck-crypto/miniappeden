# 📱 ПОШАГОВАЯ ИНСТРУКЦИЯ ДЛЯ TELEGRAM MINI APP

## 🎯 БЫСТРОЕ РЕШЕНИЕ ОШИБКИ "botinvalid"

Ошибка появляется потому что:
1. ❌ Не создан бот в @BotFather
2. ❌ Токен не добавлен в `.env.local`
3. ❌ Mini App URL не настроена

---

## 📝 ШАГ 1: Создать бота

**Откройте Telegram → найти @BotFather**

Отправьте: `/newbot`

**Ответ BotFather:**
```
Alright! Send me the name of your bot.
Your bot's name must end in 'bot'.
For example, such names are suitable for bots:
MusicBot
@example_bot
bot
```

**Вы ответьте:** `Games Arena Bot` (или любое имя)

**Потом BotFather спросит username:**
```
Good. Now let's choose a username for your bot.
It must end in `bot`.
Like this, for example:
@TetrisBot
@ZooBot
```

**Вы ответьте:** `miniappeden_bot`

**⭐ BotFather выдаст вам токен:**
```
Done! Congratulations on your new bot. You will find it at t.me/miniappeden_bot. 
You can now add a description, about section and profile picture for your bot, see /help for a list of commands.

Use this token to access the HTTP API:
123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11

For a step-by-step guide on how to use the Bot API, 
have a look at this page: https://core.telegram.org/bots/tutorial
```

**СКОПИРУЙТЕ ТОКЕН!** ⬆️

---

## 📝 ШАГ 2: Добавить токен в .env.local

Откройте в VS Code файл `.env.local`:

```bash
# НАЙТИ ЭТУ СТРОКУ:
VITE_TELEGRAM_BOT_TOKEN=

# ЗАМЕНИТЬ НА:
VITE_TELEGRAM_BOT_TOKEN=123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11

# И ДОБАВИТЬ:
VITE_TELEGRAM_BOT_USERNAME=miniappeden_bot
```

**Сохранить файл:** Ctrl+S

---

## 📝 ШАГ 3: Найти URL вашего приложения

### Если на Netlify:

1. Перейти https://app.netlify.com
2. Нажать на свой сайт
3. **Скопировать URL в шапке:**
   ```
   https://miniappeden.netlify.app
   ```

### Если на Vercel:

1. Перейти https://vercel.com/dashboard
2. Нажать на свой проект
3. **Скопировать Production URL:**
   ```
   https://miniappeden.vercel.app
   ```

---

## 📝 ШАГ 4: Настроить Mini App в @BotFather

**В Telegram откройте @BotFather и отправьте:**

```
/mybots
```

**BotFather ответит с кнопками:**
```
Select a bot:
[miniappeden_bot] - 0 commands

[Other bots...]
```

**Нажмите на "miniappeden_bot"**

**Выберите "Bot Settings":**
```
Alright! Let me help you manage your bots.
[miniappeden_bot]

⚙️ Bot Settings
🔍 See Your Bot
🛠 Manage Commands
...
```

**Нажмите "Bot Settings"**

**Выберите "Menu Button"** (или "App Menu Button"):
```
What do you want to change?

📝 Edit Bot Name
🎭 Edit Description
...
📱 Menu Button
```

**Нажмите "Menu Button"** (или "App Menu Button")

**BotFather спросит:**
```
Choose an option for the menu button:
[Web App] [Commands]
```

**Нажмите "Web App"**

**Вставьте ваш URL:**
```
Alright, provide the URL for the web app:
```

**Скопируйте и вставьте:**
```
https://miniappeden.netlify.app
```

(Или ваш Vercel URL)

**Telegram ответит:**
```
✅ Web app button updated!
```

---

## 📝 ШАГ 5: Проверить что работает

1. **Откройте своего бота:** t.me/miniappeden_bot (или ваш username)
2. **Нажмите на меню (три линии) внизу**
3. **Нажмите "App"** (должна быть кнопка)
4. **Откроется ваше приложение!** ✅

Если ошибка пропала и приложение открылось - **все работает!** 🎉

---

## 🆘 ЕСЛИ ОШИБКА ОСТАЕТСЯ

### Проверьте эти пункты:

1. **Токен скопирован правильно?**
   - В `.env.local` между `=` и числом не должно быть пробела
   - ✅ Правильно: `VITE_TELEGRAM_BOT_TOKEN=123456:ABC...`
   - ❌ Неправильно: `VITE_TELEGRAM_BOT_TOKEN= 123456:ABC...`

2. **Username правильный?**
   - Должен заканчиваться на `_bot`
   - ✅ Правильно: `miniappeden_bot`
   - ❌ Неправильно: `miniappeden` (без _bot)

3. **URL добавлен в @BotFather?**
   - Команда `/mybots` → выбрать бота → **Bot Settings** → **Menu Button** → **Web App**
   - Вставить URL и нажать Enter

4. **Приложение открывается в браузере?**
   - Откройте URL в браузере: https://miniappeden.netlify.app
   - Должно открыться приложение (без Telegram контекста, с пустым профилем)

5. **Бот закрыт в Telegram и переоткрыт?**
   - Полностью закройте бота
   - Откройте заново
   - Нажмите на меню

---

## 📊 ЧЕКЛИСТ

- [ ] Создан бот в @BotFather
- [ ] Получен токен
- [ ] Токен добавлен в `.env.local`
- [ ] Username добавлен в `.env.local`
- [ ] Приложение развернуто (Netlify/Vercel)
- [ ] URL получен
- [ ] URL добавлен в @BotFather
- [ ] Бот переоткрыт в Telegram
- [ ] Видна кнопка "App"
- [ ] Приложение открывается ✅

Если все пункты - **готово!** 🚀

---

## 💬 ЕСЛИ ВСЕ ЕЩЕ НЕ РАБОТАЕТ

**Отправьте эту информацию:**

1. **URL приложения:**
   ```
   https://...
   ```

2. **Ошибка в DevTools (F12):**
   ```
   Скопируйте красную ошибку
   ```

3. **Какая платформа:**
   - Netlify / Vercel / другое?

4. **На каком устройстве:**
   - Telegram Desktop / Web / Android / iOS?

Тогда смогу помочь точнее! 🆘
