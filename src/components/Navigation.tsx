import '../styles/Navigation.css'
import { getTelegramUserInfo } from '../config/telegram'
import { isAdmin } from '../config/admin'

export function Navigation({ currentPage, onNavigate }: any) {
  const user = getTelegramUserInfo()
  const userId = user?.id
  const isUserAdmin = isAdmin(userId)

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
