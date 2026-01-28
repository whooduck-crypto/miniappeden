/**
 * Конфигурация администраторов
 * 
 * ВАЖНО: Используйте переменные окружения для продакшена!
 */

// Получить список админов из переменных окружения
const ADMIN_IDS_ENV = import.meta.env.VITE_ADMIN_IDS || ''

// Парсить строку ID (формат: "123456789,987654321,111222333")
const parseAdminIds = (idsString: string): number[] => {
  if (!idsString.trim()) return []
  return idsString.split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id))
}

export const ADMIN_CONFIG = {
  // ID администраторов, которые имеют доступ к админке
  ADMIN_IDS: parseAdminIds(ADMIN_IDS_ENV),
  
  // Минимальный уровень для создания турнира (если не админ)
  MIN_LEVEL_TO_CREATE_TOURNAMENT: 20,
  
  // Максимальное количество активных турниров одновременно
  MAX_ACTIVE_TOURNAMENTS: 10,
}

/**
 * Проверить, является ли пользователь администратором
 */
export function isAdmin(userId: number | null | undefined): boolean {
  if (!userId) return false
  return ADMIN_CONFIG.ADMIN_IDS.includes(userId)
}

/**
 * Проверить доступ пользователя к админке
 */
export function canAccessAdminPanel(userId: number | null | undefined): boolean {
  return isAdmin(userId)
}

/**
 * Проверить, может ли пользователь создать турнир
 */
export function canCreateTournament(userId: number | null | undefined, userLevel: number = 1): boolean {
  if (!userId) return false
  // Админ может создавать турниры в любом случае
  if (isAdmin(userId)) return true
  // Обычный пользователь должен быть достаточного уровня
  return userLevel >= ADMIN_CONFIG.MIN_LEVEL_TO_CREATE_TOURNAMENT
}

/**
 * Проверить, может ли пользователь редактировать турнир
 */
export function canEditTournament(userId: number | null | undefined, createdById: number): boolean {
  if (!userId) return false
  // Админ может редактировать любой турнир
  if (isAdmin(userId)) return true
  // Автор может редактировать свой турнир
  return userId === createdById
}

/**
 * Проверить, может ли пользователь удалить турнир
 */
export function canDeleteTournament(userId: number | null | undefined): boolean {
  if (!userId) return false
  // Только админ может удалять турниры
  return isAdmin(userId)
}
