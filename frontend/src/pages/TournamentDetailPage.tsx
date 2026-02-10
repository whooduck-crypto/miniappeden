import '../App.css'
import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getTelegramUserInfo } from '../config/telegram'
import { tournamentAPI } from '../services/api'
import type { Tournament } from '../types/tournaments'

export function TournamentDetailPage() {
  const { tournamentId } = useParams<{ tournamentId: string }>()
  const navigate = useNavigate()
  const user = getTelegramUserInfo()
  const userId = user?.id

  const [tournament, setTournament] = useState<Tournament | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isRegistered, setIsRegistered] = useState(false)
  const [registering, setRegistering] = useState(false)
  const [leaving, setLeaving] = useState(false)

  useEffect(() => {
    const fetchTournament = async () => {
      if (!tournamentId) return

      setLoading(true)
      setError(null)

      try {
        const data = await tournamentAPI.getTournament(parseInt(tournamentId))
        setTournament(data)

        // Проверяем, зарегистрирован ли пользователь
        if (userId) {
          const isUserRegistered = data.participants.some(
            (p: any) => p.userId === userId
          )
          setIsRegistered(isUserRegistered)
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Ошибка загрузки турнира')
      } finally {
        setLoading(false)
      }
    }

    fetchTournament()
  }, [tournamentId, userId])

  const handleRegister = async () => {
    if (!userId) {
      alert('❌ Требуется авторизация в Telegram')
      return
    }

    setRegistering(true)
    try {
      await tournamentAPI.joinTournament(userId, parseInt(tournamentId || '0'))
      setIsRegistered(true)
      alert('✅ Вы успешно зарегистрировались!')
      // Обновляем данные турнира
      if (tournamentId) {
        const updatedTournament = await tournamentAPI.getTournament(
          parseInt(tournamentId)
        )
        setTournament(updatedTournament)
      }
    } catch (err) {
      alert(
        `❌ Ошибка: ${err instanceof Error ? err.message : 'Неизвестная ошибка'}`
      )
    } finally {
      setRegistering(false)
    }
  }

  const handleUnregister = async () => {
    if (!userId) return

    if (!window.confirm('Вы уверены, что хотите отменить регистрацию?')) {
      return
    }

    setLeaving(true)
    try {
      await tournamentAPI.leaveTournament(userId, parseInt(tournamentId || '0'))
      setIsRegistered(false)
      alert('✅ Регистрация отменена!')
      // Обновляем данные турнира
      if (tournamentId) {
        const updatedTournament = await tournamentAPI.getTournament(
          parseInt(tournamentId)
        )
        setTournament(updatedTournament)
      }
    } catch (err) {
      alert(
        `❌ Ошибка: ${err instanceof Error ? err.message : 'Неизвестная ошибка'}`
      )
    } finally {
      setLeaving(false)
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

  if (loading) {
    return (
      <div className="page tournament-detail">
        <button onClick={() => navigate(-1)} className="btn-back">
          ← Назад
        </button>
        <div style={{ textAlign: 'center', padding: '40px', opacity: 0.7 }}>
          ⏳ Загрузка турнира...
        </div>
      </div>
    )
  }

  if (error || !tournament) {
    return (
      <div className="page tournament-detail">
        <button onClick={() => navigate(-1)} className="btn-back">
          ← Назад
        </button>
        <div
          style={{
            background: 'rgba(255, 107, 107, 0.2)',
            border: '1px solid #ff6b6b',
            color: '#ff6b6b',
            padding: '20px',
            borderRadius: '8px',
            textAlign: 'center',
          }}
        >
          ❌ {error || 'Турнир не найден'}
        </div>
      </div>
    )
  }

  const isFull = tournament.currentParticipants >= tournament.maxParticipants
  const isFinished = tournament.status === 'finished'
  const canRegister = !isFinished && !isFull && !isRegistered

  return (
    <div className="page tournament-detail">
      <button onClick={() => navigate(-1)} className="btn-back">
        ← Назад
      </button>

      <div className="tournament-detail-header">
        <h1>{tournament.name}</h1>
        <span className={`badge ${getStatusClass(tournament.status)}`}>
          {getStatusBadge(tournament.status)}
        </span>
      </div>

      <p className="tournament-detail-description">{tournament.description}</p>

      <div className="tournament-detail-card">
        <h2>Основная информация</h2>
        <div className="detail-row">
          <span className="detail-label">Статус:</span>
          <span className="detail-value">{getStatusBadge(tournament.status)}</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Участники:</span>
          <span className="detail-value">
            {tournament.currentParticipants} / {tournament.maxParticipants}
          </span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Плата за вход:</span>
          <span className="detail-value">💰 {tournament.entryFee}</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Призовой фонд:</span>
          <span className="detail-value prize">🎁 {tournament.prizePool}</span>
        </div>
      </div>

      <div className="tournament-detail-card">
        <h2>Даты</h2>
        <div className="detail-row">
          <span className="detail-label">Начало:</span>
          <span className="detail-value">
            {new Date(tournament.startDate).toLocaleDateString('ru-RU', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Завершение:</span>
          <span className="detail-value">
            {new Date(tournament.endDate).toLocaleDateString('ru-RU', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </span>
        </div>
      </div>

      <div className="tournament-detail-card">
        <h2>Участники ({tournament.participants.length})</h2>
        {tournament.participants.length === 0 ? (
          <p style={{ opacity: 0.7, textAlign: 'center' }}>
            Пока нет участников
          </p>
        ) : (
          <div className="participants-list">
            {tournament.participants.map((participant, index) => (
              <div key={index} className="participant-item">
                <div className="participant-rank">#{index + 1}</div>
                <div className="participant-info">
                  <div className="participant-name">{participant.username}</div>
                  {participant.score !== undefined && (
                    <div className="participant-score">
                      Очки: {participant.score}
                    </div>
                  )}
                </div>
                {participant.position !== undefined && (
                  <div className="participant-position">
                    {participant.position === 1 && '🥇'}
                    {participant.position === 2 && '🥈'}
                    {participant.position === 3 && '🥉'}
                    {participant.position > 3 && `#${participant.position}`}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="tournament-actions">
        {isRegistered ? (
          <button
            onClick={handleUnregister}
            disabled={leaving}
            className="btn btn-danger"
          >
            {leaving ? '⏳ Отмена регистрации...' : '❌ Отменить регистрацию'}
          </button>
        ) : canRegister ? (
          <button
            onClick={handleRegister}
            disabled={registering}
            className="btn btn-primary"
          >
            {registering ? '⏳ Регистрация...' : '✅ Зарегистрироваться'}
          </button>
        ) : isFinished ? (
          <button disabled className="btn btn-disabled">
            ✅ Турнир завершен
          </button>
        ) : isFull ? (
          <button disabled className="btn btn-disabled">
            ❌ Турнир полный
          </button>
        ) : null}

        {isRegistered && (
          <div style={{
            marginTop: '12px',
            padding: '12px',
            background: 'rgba(81, 207, 102, 0.2)',
            border: '1px solid #51cf66',
            color: '#51cf66',
            borderRadius: '8px',
            textAlign: 'center',
            fontSize: '14px',
          }}>
            ✅ Вы зарегистрированы в этом турнире
          </div>
        )}
      </div>
    </div>
  )
}
