// API Configuration
export const API_BASE_URL = 'https://web-production-b6f80.up.railway.app';

export const api = {
  tournaments: {
    list: () => `${API_BASE_URL}/api/tournaments`,
    detail: (id: number) => `${API_BASE_URL}/api/tournaments/${id}`,
    join: (id: number) => `${API_BASE_URL}/api/tournaments/${id}/join`,
    leave: (id: number) => `${API_BASE_URL}/api/tournaments/${id}/leave`,
    finish: (id: number) => `${API_BASE_URL}/api/tournaments/${id}/finish`,
  },
  users: {
    get: (userId: number) => `${API_BASE_URL}/api/users/${userId}`,
    create: () => `${API_BASE_URL}/api/users`,
    update: (userId: number) => `${API_BASE_URL}/api/users/${userId}`,
    activeTournaments: (userId: number) => `${API_BASE_URL}/api/users/${userId}/active-tournaments`,
    stars: (userId: number) => `${API_BASE_URL}/api/users/${userId}/stars`,
    addStars: (userId: number) => `${API_BASE_URL}/api/users/${userId}/add-stars`,
    addBalance: (userId: number) => `${API_BASE_URL}/api/users/${userId}/add-balance`,
    deductBalance: (userId: number) => `${API_BASE_URL}/api/users/${userId}/deduct-balance`,
    tournaments: (userId: number) => `${API_BASE_URL}/api/users/${userId}/tournaments`,
  },
};
