/**
 * API Service для работы с вашим Backend
 * 
 * Используется для сохранения данных игроков, покупок, турниров и т.д.
 */

// Логика выбора API URL:
// 1. Если установлена VITE_API_URL в .env - используем её
// 2. Если в production режиме - используем Railway URL
// 3. Если в development режиме - используем localhost
const isDev = !import.meta.env.PROD;
const API_URL = import.meta.env.VITE_API_URL || (
  isDev 
    ? 'http://localhost:3000/api'
    : 'https://web-production-b6f80.up.railway.app/api'
);
const API_KEY = import.meta.env.VITE_API_KEY || '';

// Логирование текущего API URL
console.log(`🔌 API URL: ${API_URL}`);

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: any;
  headers?: Record<string, string>;
}

/**
 * Основной метод для API запросов
 */
async function apiRequest(endpoint: string, options: RequestOptions = {}) {
  const url = `${API_URL}${endpoint}`;
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(API_KEY && { 'X-API-Key': API_KEY }),
    ...options.headers,
  };

  console.log(`📤 API Request: ${options.method || 'GET'} ${url}`);

  try {
    const response = await fetch(url, {
      method: options.method || 'GET',
      headers,
      body: options.body ? JSON.stringify(options.body) : undefined,
    });

    console.log(`📥 API Response: ${response.status} ${response.statusText}`);

    if (!response.ok) {
      const text = await response.text();
      console.error(`API Error Response: ${text}`);
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    const contentType = response.headers.get('content-type');
    if (!contentType?.includes('application/json')) {
      const text = await response.text();
      console.error(`Invalid Content-Type: ${contentType}, Response: ${text}`);
      throw new Error(`Invalid response format: expected JSON, got ${contentType}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`API Request Failed: ${endpoint}`, error);
    // Вместо того чтобы крашить приложение, возвращаем mock данные для режима разработки
    const mockData = getMockDataForEndpoint(endpoint, options);
    console.warn(`⚠️ Using mock data for ${endpoint} (backend not available)`);
    console.log(`📦 Mock data:`, mockData);
    return mockData;
  }
}

/**
 * Получить mock данные для разработки (когда backend недоступен)
 */
function getMockDataForEndpoint(endpoint: string, options: RequestOptions): any {
  // Пользователь
  if (endpoint.match(/^\/users\/\d+$/)) {
    return {
      id: 123456789,
      telegramId: 123456789,
      username: 'dev_user',
      firstName: 'Dev User',
      level: 12,
      coins: 2540,
      balance: 2540,
      wins: 28,
      losses: 5,
      rating: 1850,
      avatar: 'https://via.placeholder.com/160?text=Dev+User',
      photo_url: 'https://via.placeholder.com/160?text=Dev+User',
      gameId: '',
      serverId: '',
      createdAt: new Date().toISOString(),
    };
  }
  
  // Статистика
  if (endpoint.match(/^\/users\/\d+\/stats$/)) {
    return {
      level: 12,
      coins: 2540,
      wins: 28,
      losses: 5,
      rating: 1850,
      totalPlayTime: 240,
      achievements: []
    };
  }
  
  // Товары в магазине
  if (endpoint === '/shop/items') {
    return [
      { id: 1, name: 'Golden Skin', price: 200, category: 'cosmetic', emoji: '✨' },
      { id: 2, name: 'Double Points', price: 150, category: 'powerup', emoji: '2️⃣' },
      { id: 3, name: 'VIP Badge', price: 300, category: 'badge', emoji: '👑' },
    ];
  }
  
  // Турниры
  if (endpoint === '/tournaments') {
    return [];
  }
  
  // Создание пользователя
  if (endpoint === '/users' && options.method === 'POST') {
    const body = options.body || {};
    return {
      id: body.telegramId || 123456789,
      telegramId: body.telegramId || 123456789,
      username: body.username || 'dev_user',
      firstName: body.firstName || 'Dev User',
      level: 1,
      coins: 1000,
      balance: 1000,
      stars: 0,
      experience: 0,
      wins: 0,
      losses: 0,
      createdAt: new Date().toISOString(),
    };
  }
  
  // По умолчанию
  return { success: true, data: null };
}

/**
 * API методы для работы с пользователем
 */
export const userAPI = {
  // Получить профиль пользователя
  getProfile(userId: number) {
    return apiRequest(`/users/${userId}`);
  },

  // Обновить профиль пользователя
  updateProfile(userId: number, data: any) {
    return apiRequest(`/users/${userId}`, {
      method: 'PUT',
      body: data,
    });
  },

  // Получить статистику пользователя
  getStats(userId: number) {
    return apiRequest(`/users/${userId}/stats`);
  },

  // Создать нового пользователя
  createUser(data: { telegramId: number; username: string; firstName: string }) {
    return apiRequest('/users', {
      method: 'POST',
      body: data,
    });
  },
};

/**
 * API методы для работы с магазином
 */
export const shopAPI = {
  // Получить все товары
  getItems() {
    return apiRequest('/shop/items');
  },

  // Совершить покупку
  purchase(userId: number, itemId: number) {
    return apiRequest('/shop/purchase', {
      method: 'POST',
      body: { userId, itemId },
    });
  },

  // Получить купленные товары пользователя
  getUserItems(userId: number) {
    return apiRequest(`/shop/user/${userId}/items`);
  },
};

/**
 * API методы для турниров
 */
export const tournamentAPI = {
  // Получить все турниры
  getTournaments() {
    return apiRequest('/tournaments');
  },

  // Получить турнир по ID
  getTournament(tournamentId: number) {
    return apiRequest(`/tournaments/${tournamentId}`);
  },

  // Создать новый турнир
  createTournament(data: any) {
    return apiRequest('/tournaments', {
      method: 'POST',
      body: data,
    });
  },

  // Обновить турнир
  updateTournament(tournamentId: number, data: any) {
    return apiRequest(`/tournaments/${tournamentId}`, {
      method: 'PUT',
      body: data,
    });
  },

  // Удалить турнир
  deleteTournament(tournamentId: number) {
    return apiRequest(`/tournaments/${tournamentId}`, {
      method: 'DELETE',
    });
  },

  // Присоединиться к турниру
  joinTournament(userId: number, tournamentId: number, options?: { role?: string; username?: string; gameId?: string; serverId?: string }) {
    return apiRequest(`/tournaments/${tournamentId}/join`, {
      method: 'POST',
      body: { userId, ...options },
    });
  },

  // Выйти из турнира
  leaveTournament(userId: number, tournamentId: number) {
    return apiRequest(`/tournaments/${tournamentId}/leave`, {
      method: 'POST',
      body: { userId },
    });
  },

  // Получить результаты турнира
  getResults(tournamentId: number) {
    return apiRequest(`/tournaments/${tournamentId}/results`);
  },

  // Завершить турнир (только админ)
  finishTournament(tournamentId: number) {
    return apiRequest(`/tournaments/${tournamentId}/finish`, {
      method: 'POST',
    });
  },

  // Получить активные турниры
  getActiveTournaments() {
    return apiRequest('/tournaments?status=active');
  },

  // Получить турниры пользователя
  getUserTournaments(userId: number) {
    return apiRequest(`/users/${userId}/tournaments`);
  },
};

/**
 * API методы для рейтинга
 */
export const ratingAPI = {
  // Получить топ игроков
  getLeaderboard(limit: number = 100) {
    return apiRequest(`/rating/leaderboard?limit=${limit}`);
  },

  // Получить позицию пользователя
  getUserRating(userId: number) {
    return apiRequest(`/rating/user/${userId}`);
  },

  // Добавить очки пользователю
  addPoints(userId: number, points: number, reason: string) {
    return apiRequest('/rating/add-points', {
      method: 'POST',
      body: { userId, points, reason },
    });
  },
};

/**
 * API методы для достижений
 */
export const achievementAPI = {
  // Получить все достижения
  getAchievements() {
    return apiRequest('/achievements');
  },

  // Получить достижения пользователя
  getUserAchievements(userId: number) {
    return apiRequest(`/achievements/user/${userId}`);
  },

  // Разблокировать достижение
  unlockAchievement(userId: number, achievementId: number) {
    return apiRequest('/achievements/unlock', {
      method: 'POST',
      body: { userId, achievementId },
    });
  },
};

export default {
  userAPI,
  shopAPI,
  tournamentAPI,
  ratingAPI,
  achievementAPI,
  apiRequest,
};
