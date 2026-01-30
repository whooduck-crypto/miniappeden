import { useEffect, useState } from 'react'
import '../App.css'
import { UserAvatar } from '../components/UserAvatar'
import { getTelegramUserInfo } from '../config/telegram'

export function ProfilePage() {
  const telegramUser = getTelegramUserInfo()
  const userId = telegramUser?.id
  const username = telegramUser?.username || telegramUser?.first_name || 'User'

  const [userData, setUserData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Загружаем данные пользователя с сервера
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true)
        setError(null)

        if (!userId) {
          setError('User ID not found')
          setLoading(false)
          return
        }

        console.log('📱 ProfilePage - Telegram User:', telegramUser)
        console.log('🔄 Fetching user data for ID:', userId)

        // Сначала пытаемся получить пользователя
        let response = await fetch(`/api/users/${userId}`)
        
        // Если пользователь не найден (404), создаем его
        if (response.status === 404) {
          console.log('👤 User not found, creating new user...')
          
          const createResponse = await fetch('/api/users', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              telegramId: userId,
              username: username,
              firstName: telegramUser?.first_name || 'User',
            }),
          })

          if (!createResponse.ok) {
            const errorText = await createResponse.text()
            console.error('Create user failed:', createResponse.status, errorText)
            throw new Error(`Failed to create user: ${createResponse.status} ${errorText}`)
          }

          response = createResponse
        }

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json()
        setUserData(data)
        console.log('📊 User Data:', data)
      } catch (err) {
        console.error('Error fetching user data:', err)
        setError(err instanceof Error ? err.message : 'Failed to load user data')
      } finally {
        setLoading(false)
      }
    }

    if (userId) {
      fetchUserData()
    }
  }, [userId, telegramUser])

  // Периодическое обновление данных (каждые 5 секунд)
  useEffect(() => {
    if (!userId) return

    const interval = setInterval(async () => {
      try {
        const response = await fetch(`/api/users/${userId}`)
        if (response.ok) {
          const data = await response.json()
          setUserData(data)
        }
      } catch (err) {
        console.error('Error updating user data:', err)
      }
    }, 5000)

    return () => clearInterval(interval)
  }, [userId])

  if (loading) {
    return (
      <div className="page profile-page">
        <h1>👤 Профиль</h1>
        <div style={{ textAlign: 'center', padding: '40px', opacity: 0.7 }}>
          ⏳ Загрузка профиля...
        </div>
      </div>
    )
  }

  if (error || !userData) {
    return (
      <div className="page profile-page">
        <h1>👤 Профиль</h1>
        <div style={{
          background: 'rgba(255, 107, 107, 0.2)',
          border: '1px solid #ff6b6b',
          color: '#ff6b6b',
          padding: '12px',
          borderRadius: '8px',
          marginBottom: '15px',
        }}>
          ❌ {error || 'Failed to load profile'}
        </div>
        <div style={{
          background: 'rgba(0, 212, 255, 0.05)',
          border: '1px solid #00d4ff',
          borderRadius: '8px',
          padding: '15px',
          marginTop: '15px',
          fontSize: '13px',
          lineHeight: '1.6',
        }}>
          <div style={{ fontWeight: 'bold', marginBottom: '8px', color: '#00d4ff' }}>⚠️ Помощь</div>
          <div>
            • Убедитесь, что сервер запущен (http://localhost:3000)<br/>
            • Проверьте консоль браузера (F12) для подробной информации<br/>
            • Перезагрузите страницу (F5)<br/>
            {userId && `• Ваш ID: ${userId}`}
          </div>
        </div>
      </div>
    )
  }

  const userStats = {
    username: userData?.username || telegramUser?.first_name || 'YourPlayer',
    level: userData?.level || 1,
    experience: userData?.experience || 0,
    experienceToNextLevel: 10000,
    coins: userData?.balance || 0,
    stars: userData?.stars || 0,
    rating: userData?.balance || 0,
    rank: 10,
    totalWins: userData?.wins || 0,
    totalLosses: userData?.losses || 0,
    winRate: userData?.wins && userData?.losses 
      ? Math.round((userData.wins / (userData.wins + userData.losses)) * 100)
      : 0,
  };

  const achievements = [
    { icon: '🥇', name: 'Первая победа', unlocked: userStats.totalWins > 0 },
    { icon: '🔟', name: '10 побед', unlocked: userStats.totalWins >= 10 },
    { icon: '💯', name: '100 побед', unlocked: userStats.totalWins >= 100 },
    { icon: '💰', name: '1000 монет', unlocked: userStats.coins >= 1000 },
    { icon: '⭐', name: 'Все турниры', unlocked: userStats.stars >= 50 },
    { icon: '🏆', name: 'Топ-100', unlocked: false },
  ];

  const recentMatches = [
    { opponent: 'Pro_Player', result: 'loss', date: 'сегодня' },
    { opponent: 'TopGamer', result: 'win', date: 'вчера' },
    { opponent: 'Legend_13', result: 'win', date: '2 дня назад' },
    { opponent: 'Champion_X', result: 'loss', date: '3 дня назад' },
  ];

  return (
    <div className="page profile-page">
      <h1>👤 Профиль</h1>

      <div className="profile-header">
        <UserAvatar />
        <div className="profile-info">
          <h2>{userStats.username}</h2>
          <p className="profile-rank">Место #{userStats.rank} • Уровень {userStats.level}</p>
        </div>
      </div>

      <div className="progress-section">
        <h3>Опыт</h3>
        <div className="experience-bar">
          <div
            className="experience-fill"
            style={{ width: `${(userStats.experience / userStats.experienceToNextLevel) * 100}%` }}
          ></div>
        </div>
        <p className="experience-text">
          {userStats.experience} / {userStats.experienceToNextLevel} EXP
        </p>
      </div>

      <div className="stats-grid">
        <div className="stat-box">
          <span className="stat-icon">💰</span>
          <span className="stat-label">Монеты</span>
          <span className="stat-value">{userStats.coins}</span>
        </div>

        <div className="stat-box">
          <span className="stat-icon">⭐</span>
          <span className="stat-label">Звезды</span>
          <span className="stat-value">{userStats.stars}</span>
        </div>

        <div className="stat-box">
          <span className="stat-icon">🏆</span>
          <span className="stat-label">Побед</span>
          <span className="stat-value">{userStats.totalWins}</span>
        </div>

        <div className="stat-box">
          <span className="stat-icon">❌</span>
          <span className="stat-label">Поражений</span>
          <span className="stat-value">{userStats.totalLosses}</span>
        </div>

        <div className="stat-box">
          <span className="stat-icon">📊</span>
          <span className="stat-label">Процент побед</span>
          <span className="stat-value">{userStats.winRate}%</span>
        </div>

        <div className="stat-box">
          <span className="stat-icon">📈</span>
          <span className="stat-label">Уровень</span>
          <span className="stat-value">{userStats.level}</span>
        </div>
      </div>

      <div className="achievements-section">
        <h3>🎖️ Достижения</h3>
        <div className="achievements-grid">
          {achievements.map((achievement, index) => (
            <div
              key={index}
              className={`achievement ${achievement.unlocked ? 'unlocked' : 'locked'}`}
              title={achievement.name}
            >
              <span className="achievement-icon">{achievement.icon}</span>
              {!achievement.unlocked && <span className="lock-icon">🔒</span>}
            </div>
          ))}
        </div>
      </div>

      <div className="matches-section">
        <h3>⚔️ Последние поединки</h3>
        <div className="matches-list">
          {recentMatches.map((match, index) => (
            <div key={index} className={`match-item ${match.result}`}>
              <div className="match-info">
                <span className="opponent-name">vs {match.opponent}</span>
                <span className="match-date">{match.date}</span>
              </div>
              <span className={`match-result ${match.result}`}>
                {match.result === 'win' ? '✅ Победа' : '❌ Поражение'}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="profile-actions">
        <button className="btn btn-primary">⚙️ Настройки</button>
        <button className="btn btn-secondary">🚪 Выход</button>
      </div>
    </div>
  );
}
