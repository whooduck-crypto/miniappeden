import '../styles/Navigation.css'
import { getTelegramUserInfo } from '../config/telegram'
import { isAdmin, getTelegramUserId } from '../config/admin'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

export function Navigation({ currentPage, onNavigate }: any) {
  const navigate = useNavigate()
  const [userId, setUserId] = useState<number | null>(null)
  const [isUserAdmin, setIsUserAdmin] = useState(false)

  useEffect(() => {
    // Способ 1: Попробовать через getTelegramUserInfo
    let id = getTelegramUserInfo()?.id || null

    // Способ 2: Если не получилось, использовать getTelegramUserId
    if (!id) {
      id = getTelegramUserId()
    }

    // Логирование для отладки
    console.log('🔍 Navigation Init:')
    console.log('  - User ID:', id)
    console.log('  - Is Admin:', isAdmin(id) ? '✅' : '❌')

    setUserId(id)
    setIsUserAdmin(isAdmin(id))
  }, [])

  const navItems = [
    { id: 'home', label: 'Главная', emoji: '🏠', path: '/' },
    { id: 'tournaments', label: 'Турниры', emoji: '🏆', path: '/tournaments' },
    { id: 'rating', label: 'Рейтинг', emoji: '📈', path: '/rating' },
    { id: 'shop', label: 'Магазин', emoji: '🛍️', path: '/shop' },
    { id: 'profile', label: 'Профиль', emoji: '👤', path: '/profile' },
    ...(isUserAdmin ? [{ id: 'admin', label: 'Админка', emoji: '⚙️', path: '/admin' }] : []),
  ]

  return (
    <nav className="navigation">
      {navItems.map(({ id, label, emoji, path }) => (
        <button
          key={id}
          className={`nav-item ${currentPage === id ? 'active' : ''}`}
          onClick={() => navigate(path)}
          title={label}
        >
          <span className="nav-emoji">{emoji}</span>
          <span className="nav-label">{label}</span>
        </button>
      ))}
    </nav>
  )
}
