import { useEffect, useState } from 'react'
import '../App.css'
import { UserAvatarSmall } from '../components/UserAvatar'
import { getTelegramUserInfo } from '../config/telegram'

export function HomePage() {
  const [telegramUser, setTelegramUser] = useState<any>(null)

  useEffect(() => {
    const user = getTelegramUserInfo()
    setTelegramUser(user)
  }, [])

  return (
    <div className="page home-page">
      <div className="header-section">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
          <UserAvatarSmall size={50} />
          <div>
            <h2 style={{ margin: '0' }}>Привет, {telegramUser?.first_name || 'игрок'}! 👋</h2>
            <p style={{ margin: '4px 0', fontSize: '14px', opacity: 0.8 }}>
              Добро пожаловать в Games Arena
            </p>
          </div>
        </div>
        <h1>🎮 Telegram Games Arena</h1>
        <p className="subtitle">Играй, побеждай и зарабатывай!</p>
      </div>

      <div className="quick-stats">
        <div className="stat-card">
          <span className="stat-icon">⭐</span>
          <div className="stat-info">
            <span className="stat-label">Ваш уровень</span>
            <span className="stat-value">12</span>
          </div>
        </div>
        <div className="stat-card">
          <span className="stat-icon">💰</span>
          <div className="stat-info">
            <span className="stat-label">Монеты</span>
            <span className="stat-value">2,540</span>
          </div>
        </div>
        <div className="stat-card">
          <span className="stat-icon">🏆</span>
          <div className="stat-info">
            <span className="stat-label">Побед</span>
            <span className="stat-value">28</span>
          </div>
        </div>
      </div>

      <div className="featured-section">
        <h2>🔥 Рекомендуемые турниры</h2>
        <div className="tournament-list">
          <div className="tournament-card">
            <div className="tournament-header">
              <h3>Быстрый поединок</h3>
              <span className="tournament-badge active">Идёт</span>
            </div>
            <p className="tournament-desc">Участников: 12/32</p>
            <p className="tournament-prize">Приз: 500 💰</p>
            <button className="btn btn-primary">Присоединиться</button>
          </div>

          <div className="tournament-card">
            <div className="tournament-header">
              <h3>Чемпионат дня</h3>
              <span className="tournament-badge upcoming">Скоро</span>
            </div>
            <p className="tournament-desc">Участников: 0/64</p>
            <p className="tournament-prize">Приз: 2000 💰</p>
            <button className="btn btn-secondary">Записаться</button>
          </div>
        </div>
      </div>

      <div className="featured-section">
        <h2>🎁 Ежедневный бонус</h2>
        <div className="bonus-card">
          <p>Вернитесь завтра для получения 100 монет</p>
          <button className="btn btn-primary">Посетить завтра</button>
        </div>
      </div>
    </div>
  );
}
