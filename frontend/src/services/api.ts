/**
 * API Service для работы с вашим Backend
 * 
 * Используется для сохранения данных игроков, покупок, турниров и т.д.
 */

// Use localhost for development, production URL for production
const isDev = !import.meta.env.PROD;
const API_URL = isDev 
  ? 'http://localhost:3000/api'
  : (import.meta.env.VITE_API_URL || 'https://miniappeden-production.up.railway.app/api');
const API_KEY = import.meta.env.VITE_API_KEY || '';

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

  try {
    const response = await fetch(url, {
      method: options.method || 'GET',
      headers,
      body: options.body ? JSON.stringify(options.body) : undefined,
    });

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
    throw error;
  }
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
  joinTournament(userId: number, tournamentId: number) {
    return apiRequest('/tournaments/join', {
      method: 'POST',
      body: { userId, tournamentId },
    });
  },

  // Выйти из турнира
  leaveTournament(userId: number, tournamentId: number) {
    return apiRequest('/tournaments/leave', {
      method: 'POST',
      body: { userId, tournamentId },
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
