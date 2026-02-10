import '../App.css'
<<<<<<< HEAD
import { useState, useEffect } from 'react'
=======
import { useState, useEffect, useRef } from 'react'
>>>>>>> f6e6efebfb8623d4fe58cf21d0a2749b1f6a81ea
import { useNavigate } from 'react-router-dom'
import { getTelegramUserInfo } from '../config/telegram'
import { useTournamentManagement } from '../hooks/useTournamentManagement'
import type { Tournament } from '../types/tournaments'

/**
 * Функция для правильного парсинга и форматирования дат
 * Преобразует ISO 8601 строку в локальную дату
 */
function formatDate(dateString: string): string {
  try {
    // Парсим ISO 8601 дату
    const date = new Date(dateString)
    
    // Проверяем, что дата валидна
    if (isNaN(date.getTime())) {
      return 'N/A'
    }
    
    // Форматируем в локальную дату (ru-RU)
    return date.toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
    })
  } catch (error) {
    console.error('Error parsing date:', dateString, error)
    return 'N/A'
  }
}

export function TournamentsPage() {
  const navigate = useNavigate()
  const user = getTelegramUserInfo()
  const userId = user?.id
  const navigate = useNavigate()

  const { tournaments, loading, error, fetchTournaments } = useTournamentManagement()
  const [filter, setFilter] = useState<'all' | 'active' | 'upcoming'>('all')
<<<<<<< HEAD
=======
  const previousTournamentsRef = useRef<typeof tournaments>(null)
>>>>>>> f6e6efebfb8623d4fe58cf21d0a2749b1f6a81ea

  useEffect(() => {
    fetchTournaments()
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      fetchTournaments()
    }, 30000)

    return () => clearInterval(interval)
  }, [])

  const filtered = tournaments.filter(t => {
    if (filter === 'active') return t.status === 'active'
    if (filter === 'upcoming') return t.status === 'pending'
    return true
  })

<<<<<<< HEAD
=======
  const handleJoin = (tournamentId: number) => {
    if (!userId) {
      alert('❌ Требуется авторизация в Telegram')
      return
    }

    // Открываем страницу деталей турнира
    navigate(`/tournament/${tournamentId}`)
  }

>>>>>>> f6e6efebfb8623d4fe58cf21d0a2749b1f6a81ea
  const getStatusBadge = (status: string) => {
    if (status === 'active') return '🔴 Активный'
    if (status === 'pending') return '⏰ Ожидание'
    return '✅ Завершен'
  }

  const getStatusClass = (status: string) => {
    if (status === 'active') return 'active'
    if (status === 'pending') return 'upcoming'
    return 'finished'
  }

  const handleTournamentClick = (tournamentId: number) => {
    navigate(`/tournament/${tournamentId}`)
  }

  return (
    <div className="page tournaments-page">
      <h1>🏆 Турниры</h1>

      {error && (
        <div style={{
          background: 'rgba(255, 107, 107, 0.2)',
          border: '1px solid #ff6b6b',
          color: '#ff6b6b',
          padding: '12px',
          borderRadius: '8px',
          marginBottom: '15px',
        }}>
          ❌ {error}
        </div>
      )}

      <div className="filters">
        <button
          className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          Все
        </button>
        <button
          className={`filter-btn ${filter === 'active' ? 'active' : ''}`}
          onClick={() => setFilter('active')}
        >
          Активные
        </button>
        <button
          className={`filter-btn ${filter === 'upcoming' ? 'active' : ''}`}
          onClick={() => setFilter('upcoming')}
        >
          Ожидание
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px', opacity: 0.7 }}>
          ⏳ Загрузка турниров...
        </div>
      ) : filtered.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '40px',
          background: 'rgba(0, 212, 255, 0.05)',
          borderRadius: '12px',
          border: '1px dashed #00d4ff',
          opacity: 0.7,
        }}>
          Нет турниров в этой категории 😕
        </div>
      ) : (
        <div className="tournaments-grid">
          {filtered.map((tournament) => (
            <div
              key={tournament.id}
              className="tournament-card"
              onClick={() => handleTournamentClick(tournament.id)}
            >
              <div className="tournament-card-header">
                <h3>{tournament.name}</h3>
                <span className={`badge ${getStatusClass(tournament.status)}`}>
                  {getStatusBadge(tournament.status)}
                </span>
              </div>

              <p className="tournament-description">{tournament.description}</p>

<<<<<<< HEAD
              <div className="tournament-stats">
                <div className="stat">
                  <div className="stat-label">Участники</div>
                  <div className="stat-value">
                    {tournament.currentParticipants}/{tournament.maxParticipants}
                  </div>
                </div>
                <div className="stat">
                  <div className="stat-label">Вход</div>
                  <div className="stat-value">💰 {tournament.entryFee}</div>
                </div>
                <div className="stat">
                  <div className="stat-label">Призовой</div>
                  <div className="stat-value prize">🎁 {tournament.prizePool}</div>
                </div>
              </div>

              <div className="tournament-dates">
                <div className="date">
                  <span className="date-label">Начало:</span>
                  <span>{new Date(tournament.startDate).toLocaleDateString('ru-RU')}</span>
                </div>
                <div className="date">
                  <span className="date-label">Конец:</span>
                  <span>{new Date(tournament.endDate).toLocaleDateString('ru-RU')}</span>
                </div>
              </div>

              <div className="tournament-footer">
                <span className="view-details">Подробнее →</span>
              </div>
=======
              <div className="tournament-info">
                <div className="info-row">
                  <span>👥 Участники:</span>
                  <span className="info-value">
                    {tournament.currentParticipants || 0}/{tournament.maxParticipants || 0}
                  </span>
                </div>
                <div className="info-row">
                  <span>💰 Вход:</span>
                  <span className="info-value">{tournament.entryFee || 0}</span>
                </div>
                <div className="info-row">
                  <span>🎁 Призовой:</span>
                  <span className="info-value prize">{tournament.prizePool || 0}</span>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '12px' }}>
                <div style={{ fontSize: '12px', opacity: 0.7 }}>
                  📅 {tournament.startDate ? formatDate(tournament.startDate) : 'N/A'}
                </div>
                <div style={{ fontSize: '12px', opacity: 0.7 }}>
                  🏁 {tournament.endDate ? formatDate(tournament.endDate) : 'N/A'}
                </div>
              </div>

              <button
                onClick={() => handleJoin(tournament.id)}
                disabled={tournament.status === 'finished'}
                className={`btn ${
                  tournament.status === 'finished'
                    ? 'btn-disabled'
                    : 'btn-primary'
                }`}
                style={{ width: '100%', marginTop: '12px' }}
              >
                {tournament.status === 'finished'
                  ? '✅ Завершен'
                  : '➕ Подробнее / Присоединиться'}
              </button>
>>>>>>> f6e6efebfb8623d4fe58cf21d0a2749b1f6a81ea
            </div>
          ))}
        </div>
      )}

      <div className="info-box">
        <h3>ℹ️ Информация</h3>
        <p>
          Участвуйте в турнирах, побеждайте соперников и зарабатывайте монеты! Администраторы могут
          создавать новые турниры через админку.
        </p>
      </div>
    </div>
  )
}