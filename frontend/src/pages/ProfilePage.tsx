import { useEffect, useState } from 'react'
import '../App.css'
import { UserAvatar } from '../components/UserAvatar'
import { getTelegramUserInfo } from '../config/telegram'
import { api } from '../config/api'
import { userAPI } from '../services/api'

export function ProfilePage() {
  const telegramUser = getTelegramUserInfo()
  const userId = telegramUser?.id
  const username = telegramUser?.username || telegramUser?.first_name || 'User'

  const [userData, setUserData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [gameId, setGameId] = useState<string>('')
  const [serverId, setServerId] = useState<string>('')
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

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

        // Пытаемся получить пользователя
        let userData: any = null
        try {
          userData = await userAPI.getProfile(userId)
        } catch (err) {
          // Если пользователь не найден (404), создаем его
          console.log('👤 User not found, creating new user...')
          
          userData = await userAPI.createUser({
            telegramId: userId,
            username: username,
            firstName: telegramUser?.first_name || 'User',
          })
        }

        setUserData(userData)
        
        // Загружаем сохраненные gameId и serverId из localStorage
        const savedGameId = localStorage.getItem(`gameId_${userId}`)
        const savedServerId = localStorage.getItem(`serverId_${userId}`)
        
        setGameId(savedGameId || userData?.gameId || '')
        setServerId(savedServerId || userData?.serverId || '')
        
        console.log('📊 User Data:', userData)
        console.log('📦 Loaded from localStorage - gameId:', savedGameId, 'serverId:', savedServerId)
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
        const data = await userAPI.getProfile(userId)
        if (data) {
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
    username: telegramUser?.first_name || telegramUser?.username || userData?.username || 'YourPlayer',
    userAvatar: telegramUser?.photo_url || userData?.avatar || null,
    level: userData?.level || 1,
    experience: userData?.experience || 0,
    experienceToNextLevel: 10000,
    coins: userData?.balance || 0,
    stars: userData?.stars || 0,
    rating: userData?.rating || 0,
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
        {userStats.userAvatar ? (
          <div style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            overflow: 'hidden',
            marginRight: '15px',
            border: '3px solid #00d4ff',
          }}>
            <img 
              src={userStats.userAvatar} 
              alt={userStats.username}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
            />
          </div>
        ) : (
          <UserAvatar />
        )}
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

      {/* Форма для Game ID и Server ID */}
      <div style={{
        background: 'rgba(0, 212, 255, 0.05)',
        border: '1px solid #00d4ff',
        borderRadius: '8px',
        padding: '15px',
        marginBottom: '20px',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <h3 style={{ margin: 0 }}>🎮 Игровые данные</h3>
          <button
            onClick={() => setIsEditing(!isEditing)}
            style={{
              background: isEditing ? '#ff6b6b' : '#00d4ff',
              color: 'white',
              border: 'none',
              padding: '6px 12px',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '12px',
              fontWeight: 'bold',
              transition: 'all 0.3s'
            }}
          >
            {isEditing ? '❌ Отмена' : '✏️ Редактировать'}
          </button>
        </div>

        {isEditing ? (
          <div style={{ display: 'flex', gap: '10px', flexDirection: 'column' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', marginBottom: '4px', color: '#00d4ff' }}>
                Game ID
              </label>
              <input
                type="text"
                value={gameId}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === '' || /^\d+$/.test(value)) {
                    setGameId(value);
                  }
                }}
                placeholder="Введите Game ID"
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: '4px',
                  border: '1px solid #00d4ff',
                  background: 'rgba(0, 212, 255, 0.1)',
                  color: 'white',
                  boxSizing: 'border-box',
                  fontSize: '14px',
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', marginBottom: '4px', color: '#00d4ff' }}>
                Server ID
              </label>
              <input
                type="text"
                value={serverId}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === '' || /^\d+$/.test(value)) {
                    setServerId(value);
                  }
                }}
                placeholder="Введите Server ID"
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: '4px',
                  border: '1px solid #00d4ff',
                  background: 'rgba(0, 212, 255, 0.1)',
                  color: 'white',
                  boxSizing: 'border-box',
                  fontSize: '14px',
                }}
              />
            </div>
            <button
              onClick={async () => {
                try {
                  setIsSaving(true);
                  
                  // Проверяем, есть ли активные регистрации в турнирах
                  const activeTournamentsResponse = await fetch(
                    api.users.activeTournaments(userId)
                  );
                  const activeTournamentsData = await activeTournamentsResponse.json();
                  
                  if (activeTournamentsData.hasActiveTournaments && 
                      (userData?.gameId !== gameId || userData?.serverId !== serverId)) {
                    const tournamentsList = activeTournamentsData.tournaments
                      .map((t: any) => `• ${t.tournamentName} (${t.status})`)
                      .join('\n');
                    
                    const shouldCancel = confirm(
                      `⚠️ У вас есть активные регистрации в турнирах:\n\n${tournamentsList}\n\n` +
                      `Вы не можете изменить game_id и server_id пока вы зарегистрированы в активных турнирах.\n\n` +
                      `Отмените регистрацию перед изменением данных.`
                    );
                    
                    if (shouldCancel) {
                      setIsSaving(false);
                      return;
                    }
                  }
                  
                  // Сохраняем в localStorage
                  localStorage.setItem(`gameId_${userId}`, gameId);
                  localStorage.setItem(`serverId_${userId}`, serverId);
                  console.log('💾 Данные сохранены в localStorage');
                  
                  // Отправляем на сервер
                  await userAPI.updateProfile(userId, { gameId, serverId });
                  setUserData({ ...userData, gameId, serverId });
                  setIsEditing(false);
                  console.log('✅ Данные сохранены на сервере');
                  alert('✅ Game ID и Server ID успешно обновлены!');
                } catch (err) {
                  console.error('❌ Ошибка при сохранении:', err);
                  alert('❌ Ошибка при сохранении данных');
                } finally {
                  setIsSaving(false);
                }
              }}
              disabled={isSaving}
              style={{
                background: '#00d4ff',
                color: 'black',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: 'bold',
                opacity: isSaving ? 0.7 : 1,
              }}
            >
              {isSaving ? '⏳ Сохранение...' : '💾 Сохранить'}
            </button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div style={{ padding: '10px', background: 'rgba(0, 212, 255, 0.05)', borderRadius: '4px' }}>
              <div style={{ fontSize: '12px', color: '#00d4ff', marginBottom: '4px' }}>Game ID</div>
              <div style={{ fontSize: '14px', fontWeight: 'bold', color: 'white' }}>
                {gameId || '—'}
              </div>
            </div>
            <div style={{ padding: '10px', background: 'rgba(0, 212, 255, 0.05)', borderRadius: '4px' }}>
              <div style={{ fontSize: '12px', color: '#00d4ff', marginBottom: '4px' }}>Server ID</div>
              <div style={{ fontSize: '14px', fontWeight: 'bold', color: 'white' }}>
                {serverId || '—'}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Статус данных для турниров */}
      <div style={{
        background: (!gameId || !serverId) 
          ? 'rgba(255, 193, 7, 0.1)' 
          : 'rgba(76, 175, 80, 0.1)',
        border: (!gameId || !serverId) 
          ? '1px solid #ffc107' 
          : '1px solid #4caf50',
        borderRadius: '8px',
        padding: '15px',
        marginBottom: '20px',
      }}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '10px',
          marginBottom: '8px'
        }}>
          {(!gameId || !serverId) ? (
            <>
              <span style={{ fontSize: '20px' }}>⚠️</span>
              <span style={{ fontWeight: 'bold', color: '#ffc107' }}>
                Требуется заполнить данные для участия в турнирах
              </span>
            </>
          ) : (
            <>
              <span style={{ fontSize: '20px' }}>✅</span>
              <span style={{ fontWeight: 'bold', color: '#4caf50' }}>
                Все данные заполнены, вы готовы участвовать в турнирах!
              </span>
            </>
          )}
        </div>
        <div style={{ fontSize: '13px', opacity: 0.8, lineHeight: '1.6' }}>
          {!gameId && (
            <div>🎮 Game ID: {gameId ? '✅' : '❌ не заполнен'}</div>
          )}
          {!serverId && (
            <div>🖥️ Server ID: {serverId ? '✅' : '❌ не заполнен'}</div>
          )}
          {!gameId || !serverId ? (
            <div style={{ marginTop: '8px' }}>
              Для участия в турнирах необходимо указать ваш Game ID и Server ID.
              Заполните эти данные, нажав на кнопку &quot;✏️ Редактировать&quot; выше.
            </div>
          ) : null}
        </div>
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
