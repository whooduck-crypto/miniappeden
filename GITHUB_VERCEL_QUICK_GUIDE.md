# 🚀 БЫСТРАЯ ИНСТРУКЦИЯ ДЛЯ GITHUB И VERCEL

## ✅ Шаг 1: Git готов!

Git уже инициализирован в проекте. Все файлы добавлены в первый commit.

Проверка:
```bash
git log --oneline
# Должен показать: 263db56 Initial commit - Telegram Games Arena
```

## ✅ Шаг 2: Создать репозиторий на GitHub

1. Перейти на https://github.com
2. Нажать **"+"** → **"New repository"**
3. Название: `telegram-games-arena`
4. Описание: `Telegram Mini App with Tournaments`
5. Выбрать **"Public"** (чтобы был доступ)
6. **НЕ ИНИЦИАЛИЗИРОВАТЬ** README (он уже есть)
7. Нажать **"Create repository"**

## ✅ Шаг 3: Залить код на GitHub

После создания репозитория GitHub покажет команды. Выполните эти команды в PowerShell:

```bash
# Замените YOUR_USERNAME на ваше имя пользователя GitHub!

& 'C:\Program Files\Git\bin\git.exe' remote add origin https://github.com/YOUR_USERNAME/telegram-games-arena.git
& 'C:\Program Files\Git\bin\git.exe' branch -M main
& 'C:\Program Files\Git\bin\git.exe' push -u origin main
```

После этого на GitHub появится весь ваш код! 🎉

## ✅ Шаг 4: Развернуть на Vercel

1. Перейти на https://vercel.com
2. Нажать **"Sign up"** → выбрать **"Continue with GitHub"**
3. Авторизоваться
4. Нажать **"Add New Project"**
5. Найти **"telegram-games-arena"** и нажать **"Import"**
6. **Framework Preset:** оставить как есть (будет определено как Vite)

### Добавить переменные окружения на Vercel:

В разделе **"Environment Variables"** добавить:

```
VITE_TELEGRAM_BOT_TOKEN = YOUR_TOKEN_HERE
VITE_ADMIN_IDS = 5116606689
VITE_API_URL = http://localhost:3000/api
```

7. Нажать **"Deploy"**

**Vercel автоматически разместит ваш сайт!** ✅

Через 2-3 минуты он будет доступен по адресу типа:
```
https://telegram-games-arena.vercel.app
```

## ✅ Шаг 5: Добавить URL в Telegram @BotFather

1. Откройте Telegram → найти **@BotFather**
2. Отправить `/mybots`
3. Выбрать ваш бот
4. Выбрать **"Bot Settings"** → **"Menu Button"** → **"Web App"**
5. Вставить URL:
   ```
   https://telegram-games-arena.vercel.app
   ```

## ✅ Готово! 🎉

Откройте бота в Telegram и нажмите кнопку **"Menu"** → **"App"**

Ваше приложение откроется! 🚀

---

## 📝 Сокращённая инструкция (копировать и вставлять)

### Если у вас уже есть GitHub аккаунт:

```bash
# Залить на GitHub (замените YOUR_USERNAME)
& 'C:\Program Files\Git\bin\git.exe' remote add origin https://github.com/YOUR_USERNAME/telegram-games-arena.git
& 'C:\Program Files\Git\bin\git.exe' branch -M main
& 'C:\Program Files\Git\bin\git.exe' push -u origin main

# Или если уже есть remote:
& 'C:\Program Files\Git\bin\git.exe' push origin main
```

### На Vercel:
1. Подключить GitHub репозиторий
2. Добавить переменные окружения
3. Deploy!

### В @BotFather:
1. Добавить URL вашего приложения
2. Готово!

---

## 🆘 Если что-то не работает

**Error: "git command not found"**
- Используйте полный путь: `& 'C:\Program Files\Git\bin\git.exe'`
- Или закройте и переоткройте PowerShell

**Error: "remote already exists"**
```bash
& 'C:\Program Files\Git\bin\git.exe' remote remove origin
& 'C:\Program Files\Git\bin\git.exe' remote add origin https://github.com/YOUR_USERNAME/telegram-games-arena.git
```

**Error: "Permission denied" при push**
```bash
# Используйте Personal Access Token вместо пароля
# Создайте токен на https://github.com/settings/tokens
```

---

## 🎓 Что дальше?

1. **Продолжайте разработку** → `npm run dev`
2. **Тестируйте локально** → http://localhost:5173
3. **Коммитьте изменения** → `git commit -am "Your message"`
4. **Пушьте на GitHub** → `git push`
5. **Vercel автоматически переразвернет** приложение! 🚀

---

## 💡 Полезные команды Git

```bash
# Проверить статус
& 'C:\Program Files\Git\bin\git.exe' status

# Проверить логи
& 'C:\Program Files\Git\bin\git.exe' log --oneline

# Добавить конкретный файл
& 'C:\Program Files\Git\bin\git.exe' add src/pages/HomePage.tsx

# Добавить все изменения
& 'C:\Program Files\Git\bin\git.exe' add .

# Сделать commit
& 'C:\Program Files\Git\bin\git.exe' commit -m "Your message"

# Запушить на GitHub
& 'C:\Program Files\Git\bin\git.exe' push
```

После переоткрытия PowerShell можно будет использовать `git` вместо `& 'C:\Program Files\Git\bin\git.exe'`
