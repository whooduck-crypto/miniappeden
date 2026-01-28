import '../App.css'
import { useState, useEffect } from 'react'
import { getTelegramUserInfo } from '../config/telegram'
import { useTournamentManagement } from '../hooks/useTournamentManagement'

export function TournamentsPage() {
  const user = getTelegramUserInfo()
  const userId = user?.id

  const { tournaments, loading, error, fetchTournaments, joinTournament } = useTournamentManagement()
  const [filter, setFilter] = useState<'all' | 'active' | 'upcoming'>('all')
  const [joining, setJoining] = useState<number | null>(null)

  // Загружаем турниры при монтировании
  useEffect(() => {
    fetchTournaments()
  }, [fetchTournaments])

  // Периодически обновляем список турниров (каждые 5 секунд)
  // Это обеспечивает синхронизацию при создании новых турниров в админке
  useEffect(() => {
    const interval = setInterval(() => {
      fetchTournaments()
    }, 5000)

    return () => clearInterval(interval)
  }, [fetchTournaments])

  const filtered = tournaments.filter(t => {
    if (filter === 'active') return t.status === 'active'
    if (filter === 'upcoming') return t.status === 'pending'
    return true
  })

  const handleJoin = async (tournamentId: number) => {
    if (!userId) {
      alert('❌ Требуется авторизация в Telegram')
      return
    }

    setJoining(tournamentId)
    try {
      await joinTournament(userId, tournamentId)
      alert('✅ Вы успешно присоединились к турниру!')
    } catch (err) {
      alert(`❌ Ошибка: ${err instanceof Error ? err.message : 'Unknown error'}`)
    } finally {
      setJoining(null)
    }
  }

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
        <div className="tournaments-list">
          {filtered.map((tournament) => (
            <div key={tournament.id} className="tournament-item">
              <div className="tournament-left">
                <h3>{tournament.name}</h3>
                <span className={`badge ${getStatusClass(tournament.status)}`}>
                  {getStatusBadge(tournament.status)}
                </span>
              </div>

              <p style={{ margin: '8px 0 0 0', fontSize: '13px', opacity: 0.8 }}>
                {tournament.description}
              </p>

              <div className="tournament-info">
                <div className="info-row">
                  <span>👥 Участники:</span>
                  <span className="info-value">
                    {tournament.currentParticipants}/{tournament.maxParticipants}
                  </span>
                </div>
                <div className="info-row">
                  <span>💰 Вход:</span>
                  <span className="info-value">{tournament.entryFee}</span>
                </div>
                <div className="info-row">
                  <span>🎁 Призовой:</span>
                  <span className="info-value prize">{tournament.prizePool}</span>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '12px' }}>
                <div style={{ fontSize: '12px', opacity: 0.7 }}>
                  📅 {new Date(tournament.startDate).toLocaleDateString('ru-RU')}
                </div>
                <div style={{ fontSize: '12px', opacity: 0.7 }}>
                  🏁 {new Date(tournament.endDate).toLocaleDateString('ru-RU')}
                </div>
              </div>

              <button
                onClick={() => handleJoin(tournament.id)}
                disabled={
                  joining === tournament.id ||
                  tournament.status === 'finished' ||
                  tournament.currentParticipants >= tournament.maxParticipants
                }
                className={`btn ${
                  tournament.status === 'finished'
                    ? 'btn-disabled'
                    : tournament.currentParticipants >= tournament.maxParticipants
                    ? 'btn-disabled'
                    : 'btn-primary'
                }`}
                style={{ width: '100%', marginTop: '12px' }}
              >
                {joining === tournament.id
                  ? '⏳ Присоединение...'
                  : tournament.status === 'finished'
                  ? '✅ Завершен'
                  : tournament.currentParticipants >= tournament.maxParticipants
                  ? '❌ Турнир полный'
                  : '➕ Присоединиться'}
              </button>
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
