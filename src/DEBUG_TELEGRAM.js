// DEBUG: Используйте это для проверки Telegram ID в консоли браузера

// 1. Откройте DevTools (F12) в браузере
// 2. Откройте Console tab
// 3. Скопируйте и выполните этот код:

// === ПРОВЕРКА 1: Telegram WebApp доступна? ===
console.log('=== TELEGRAM ПРОВЕРКА ===')
console.log('Telegram объект:', window.Telegram)
console.log('WebApp:', window.Telegram?.WebApp)
console.log('initDataUnsafe:', window.Telegram?.WebApp?.initDataUnsafe)
console.log('User:', window.Telegram?.WebApp?.initDataUnsafe?.user)

// === ПРОВЕРКА 2: Какой ID пользователя? ===
const userId = window.Telegram?.WebApp?.initDataUnsafe?.user?.id
console.log('Ваш User ID:', userId)

// ===== ДЛЯ ТЕСТИРОВАНИЯ =====
// Если Telegram не доступна (открыли в браузере, не в Telegram),
// выполните это чтобы добавить тестовые данные:

console.log('\n=== ТЕСТОВЫЙ РЕЖИМ ===')
console.log('Если Telegram не доступна, используйте это для тестирования:')
console.log(`
// Вставьте ваш ID (например, 5116606689):
window.Telegram = {
  WebApp: {
    initDataUnsafe: {
      user: {
        id: 5116606689,  // ← ЗАМЕНИТЕ НА ВАШЕ ID
        is_bot: false,
        first_name: "Your",
        username: "yourusername"
      }
    }
  }
};
window.location.reload();
`)

// ===== ПРОВЕРКА 3: Скопируйте здесь и выполните =====
console.log('\n=== АВТОМАТИЧЕСКАЯ УСТАНОВКА ТЕСТОВЫХ ДАННЫХ ===')
console.log('Скопируйте этот код в консоль для тестирования админки:')
const testCode = `
window.Telegram = {
  WebApp: {
    initDataUnsafe: {
      user: {
        id: 5116606689,
        is_bot: false,
        first_name: "Test",
        username: "testuser"
      }
    }
  }
};
// Перезагрузить страницу чтобы применить изменения
location.reload();
`
console.log(testCode)
