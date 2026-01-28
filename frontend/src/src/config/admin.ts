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
 * Получить ID пользователя из Telegram Mini App
 * Пробует несколько способов получения ID
 */
export function getTelegramUserId(): number | null {
  if (typeof window === 'undefined') return null
  
  const tg = (window as any).Telegram
  
  // Способ 1: Через WebApp.initDataUnsafe (стандартный способ)
  const webAppUser = tg?.WebApp?.initDataUnsafe?.user?.id
  if (webAppUser) {
    console.log('📌 User ID из WebApp.initDataUnsafe:', webAppUser)
    return webAppUser
  }
  
  // Способ 2: Через WebApp.initData парсинг
  try {
    const initData = tg?.WebApp?.initData
    if (initData) {
      const params = new URLSearchParams(initData)
      const userStr = params.get('user')
      if (userStr) {
        const userData = JSON.parse(decodeURIComponent(userStr))
        if (userData?.id) {
          console.log('📌 User ID из WebApp.initData парсинга:', userData.id)
          return userData.id
        }
      }
    }
  } catch (e) {
    console.log('⚠️ Ошибка парсинга WebApp.initData')
  }
  
  console.log('❌ User ID не найден')
  return null
}

/**
 * Проверить, является ли пользователь администратором
 */
export function isAdmin(userId: number | null | undefined): boolean {
  if (!userId) {
    console.log('❌ isAdmin: userId пусто')
    return false
  }
  
  const adminIds = ADMIN_CONFIG.ADMIN_IDS
  const isAdminUser = adminIds.includes(userId)
  
  console.log('🔐 Admin Check:')
  console.log('  - User ID:', userId)
  console.log('  - Admin IDs:', adminIds)
  console.log('  - Is Admin:', isAdminUser ? '✅ ДА' : '❌ НЕТ')
  
  return isAdminUser
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
