/**
 * Telegram Bot API Configuration
 * 
 * ВАЖНО: Это чувствительная информация!
 * - НИКОГДА не коммитьте токены в Git
 * - Используйте переменные окружения (.env)
 */

// ===== ВАРИАНТ 1: Через переменные окружения (РЕКОМЕНДУЕТСЯ) =====
export const TELEGRAM_CONFIG = {
  BOT_TOKEN: import.meta.env.VITE_TELEGRAM_BOT_TOKEN || '',
  BOT_USERNAME: import.meta.env.VITE_TELEGRAM_BOT_USERNAME || '',
  API_URL: 'https://api.telegram.org',
};

// ===== ВАРИАНТ 2: Для локального разработки (удалите перед продакшеном) =====
// export const TELEGRAM_CONFIG = {
//   BOT_TOKEN: 'YOUR_BOT_TOKEN_HERE',  // Получить у @BotFather
//   BOT_USERNAME: 'YOUR_BOT_USERNAME', // Имя бота в Телеграме
//   API_URL: 'https://api.telegram.org',
// };

/**
 * Помощник для работы с Telegram Bot API
 */
export class TelegramBotAPI {
  private token: string;
  private apiUrl: string;

  constructor(token: string) {
    this.token = token;
    this.apiUrl = TELEGRAM_CONFIG.API_URL;
  }

  /**
   * Отправить сообщение пользователю
   * @param chatId - ID чата/пользователя
   * @param text - Текст сообщения
   */
  async sendMessage(chatId: number, text: string) {
    try {
      const response = await fetch(
        `${this.apiUrl}/bot${this.token}/sendMessage`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: chatId,
            text,
            parse_mode: 'HTML',
          }),
        }
      );
      return await response.json();
    } catch (error) {
      console.error('Failed to send message:', error);
      throw error;
    }
  }

  /**
   * Отправить сообщение с кнопками
   */
  async sendMessageWithButtons(
    chatId: number,
    text: string,
    buttons: Array<Array<{ text: string; callback_data: string }>>
  ) {
    try {
      const response = await fetch(
        `${this.apiUrl}/bot${this.token}/sendMessage`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: chatId,
            text,
            parse_mode: 'HTML',
            reply_markup: {
              inline_keyboard: buttons,
            },
          }),
        }
      );
      return await response.json();
    } catch (error) {
      console.error('Failed to send message with buttons:', error);
      throw error;
    }
  }

  /**
   * Получить информацию о боте
   */
  async getMe() {
    try {
      const response = await fetch(
        `${this.apiUrl}/bot${this.token}/getMe`
      );
      return await response.json();
    } catch (error) {
      console.error('Failed to get bot info:', error);
      throw error;
    }
  }
}

/**
 * Парсить Telegram WebApp initData
 * (Для использования в мини-приложении)
 */
export function parseTelegramWebAppData(initData: string) {
  const data = new URLSearchParams(initData);
  const user = data.get('user');
  
  if (!user) return null;

  return {
    user: JSON.parse(decodeURIComponent(user)),
    chatInstance: data.get('chat_instance'),
    authDate: data.get('auth_date'),
    hash: data.get('hash'),
  };
}

/**
 * Получить ID пользователя из Telegram WebApp
 */
export function getTelegramUserId(): number | null {
  if (typeof window !== 'undefined' && (window as any).Telegram?.WebApp) {
    return (window as any).Telegram.WebApp.initDataUnsafe?.user?.id || null;
  }
  return null;
}

/**
 * Инициализировать Telegram WebApp
 */
export function initTelegramWebApp() {
  if (typeof window !== 'undefined' && (window as any).Telegram?.WebApp) {
    const webApp = (window as any).Telegram.WebApp
    
    // Инициализировать WebApp
    webApp.ready()
    
    // Развернуть приложение на весь экран
    webApp.expand()
    
    // Отключить вертикальный скролл для бота
    webApp.disableVerticalSwipes()
    
    console.log('✅ Telegram WebApp инициализирован')
    return webApp
  }
  return null
}

/**
 * Получить полную информацию пользователя из Telegram WebApp
 */
export function getTelegramUserInfo() {
  if (typeof window !== 'undefined') {
    const webApp = (window as any).Telegram?.WebApp
    const telegramUser = webApp?.initDataUnsafe?.user || null
    
    // Логирование для отладки
    console.log('📱 Telegram WebApp:', webApp ? '✅ Доступна' : '❌ НЕ доступна')
    console.log('📱 initDataUnsafe:', webApp?.initDataUnsafe ? '✅ Доступна' : '❌ НЕ доступна')
    console.log('👤 User ID:', telegramUser?.id || 'не найден')
    console.log('👤 User data:', telegramUser)
    
    return telegramUser
  }
  return null;
}
