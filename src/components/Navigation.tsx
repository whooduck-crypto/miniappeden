import '../styles/Navigation.css'
import { getTelegramUserInfo } from '../config/telegram'
import { isAdmin } from '../config/admin'
import { useEffect, useState } from 'react'

export function Navigation({ currentPage, onNavigate }: any) {
  const [userId, setUserId] = useState<number | null>(null)
  const [isUserAdmin, setIsUserAdmin] = useState(false)

  useEffect(() => {
    // Получить информацию о пользователе из Telegram
    const user = getTelegramUserInfo()
    const id = user?.id || null

    // Логирование для отладки
    console.log('🔍 Telegram User Info:', user)
    console.log('🔍 User ID:', id)
    console.log('🔍 Is Admin:', isAdmin(id))

    setUserId(id)
    setIsUserAdmin(isAdmin(id))
  }, [])

  const navItems = [
    { id: 'home', label: 'Главная', emoji: '🏠' },
    { id: 'tournaments', label: 'Турниры', emoji: '🏆' },
    { id: 'rating', label: 'Рейтинг', emoji: '📈' },
    { id: 'shop', label: 'Магазин', emoji: '🛍️' },
    { id: 'profile', label: 'Профиль', emoji: '👤' },
    ...(isUserAdmin ? [{ id: 'admin', label: 'Админка', emoji: '⚙️' }] : []),
  ]

  return (
    <nav className="navigation">
      {navItems.map(({ id, label, emoji }) => (
        <button
          key={id}
          className={`nav-item ${currentPage === id ? 'active' : ''}`}
          onClick={() => onNavigate(id)}
          title={label}
        >
          <span className="nav-emoji">{emoji}</span>
          <span className="nav-label">{label}</span>
        </button>
      ))}
    </nav>
  )
}
