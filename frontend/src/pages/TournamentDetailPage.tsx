import '../App.css'
import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getTelegramUserInfo } from '../config/telegram'
<<<<<<< HEAD
import { tournamentAPI } from '../services/api'
import type { Tournament } from '../types/tournaments'
=======
import { api } from '../config/api'
import { useTournamentManagement } from '../hooks/useTournamentManagement'
import type { Tournament, ParticipantRole } from '../types/tournaments'

/**
 * Функция для правильного парсинга и форматирования дат
 */
function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return 'N/A'
    return date.toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  } catch (error) {
    console.error('Error parsing date:', dateString, error)
    return 'N/A'
  }
}
>>>>>>> f6e6efebfb8623d4fe58cf21d0a2749b1f6a81ea

export function TournamentDetailPage() {
  const { tournamentId } = useParams<{ tournamentId: string }>()
  const navigate = useNavigate()
  const user = getTelegramUserInfo()
  const userId = user?.id

<<<<<<< HEAD
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
=======
  console.log('🎫 TournamentDetailPage - User info:', { userId, username: user?.username })

  const [tournament, setTournament] = useState<Tournament | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showRoleSelection, setShowRoleSelection] = useState(false)
  const [selectedRole, setSelectedRole] = useState<ParticipantRole | null>(null)
  const [joining, setJoining] = useState(false)
  const [canceling, setCanceling] = useState(false)

  // Проверяем, уже ли пользователь присоединился (должно пересчитываться при изменении tournament)
  const isUserJoined = tournament?.participants?.some((p: any) => p.userId === userId) || false

  useEffect(() => {
    console.log('🔍 Tournament updated:', { tournament: tournament?.id, participants: tournament?.participants?.length, userId, isUserJoined })
  }, [tournament, userId, isUserJoined])

  useEffect(() => {
    const fetchTournament = async () => {
      try {
        setLoading(true)
        const id = parseInt(tournamentId || '')
        const response = await fetch(api.tournaments.detail(id))
        
        if (!response.ok) {
          throw new Error('Tournament not found')
        }
        
        const data = await response.json()
        setTournament(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load tournament')
        console.error('Error fetching tournament:', err)
>>>>>>> f6e6efebfb8623d4fe58cf21d0a2749b1f6a81ea
      } finally {
        setLoading(false)
      }
    }

<<<<<<< HEAD
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
=======
    if (tournamentId) {
      fetchTournament()
    }
  }, [tournamentId])

  const handleRoleSelect = (role: ParticipantRole) => {
    setSelectedRole(role)
  }

  const handleJoinWithRole = async () => {
    if (!userId || !selectedRole || !tournament) {
      alert('❌ Необходимо выбрать роль')
      return
    }

    setJoining(true)
    try {
      console.log('📤 Joining tournament with:', { userId, role: selectedRole, username: user?.username })
      
      // Отправляем запрос с ролью
      const response = await fetch(api.tournaments.join(tournament.id), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          role: selectedRole,
          username: user?.username,
        }),
      })

      console.log('📥 Response status:', response.status)

      if (!response.ok) {
        const errorData = await response.json()
        console.error('❌ Error response:', errorData)
        
        // Обработка специфичных ошибок
        if (errorData.error === 'Missing game_id' || errorData.error === 'Missing server_id') {
          throw new Error(errorData.message || 'Пожалуйста, заполните game_id и server_id в профиле')
        }
        
        throw new Error(errorData.message || errorData.error || 'Failed to join tournament')
      }

      const data = await response.json()
      console.log('✅ Successfully joined:', data)
      
      alert(`✅ Вы присоединились к турниру как ${selectedRole === 'mider' ? 'Мидер' : 'Роумер'}!`)
      
      // Обновляем данные турнира
      const updatedResponse = await fetch(api.tournaments.detail(tournament.id))
      const updatedTournament = await updatedResponse.json()
      console.log('📊 Updated tournament participants:', updatedTournament.participants)
      console.log('🔎 Checking if user joined:', { userId, participants: updatedTournament.participants.map((p: any) => ({ userId: p.userId, username: p.username })) })
      setTournament(updatedTournament)
      
      setShowRoleSelection(false)
      setSelectedRole(null)
    } catch (err) {
      console.error('Error joining tournament:', err)
      alert(`❌ ${err instanceof Error ? err.message : 'Ошибка при присоединении'}`)
    } finally {
      setJoining(false)
    }
  }

  if (loading) {
    return (
      <div className="page" style={{ textAlign: 'center', padding: '40px' }}>
        ⏳ Загрузка турнира...
>>>>>>> f6e6efebfb8623d4fe58cf21d0a2749b1f6a81ea
      </div>
    )
  }

  if (error || !tournament) {
    return (
<<<<<<< HEAD
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
=======
      <div className="page">
        <button onClick={() => navigate(-1)} className="btn" style={{ marginBottom: '20px' }}>
          ← Вернуться
        </button>
        <div style={{
          background: 'rgba(255, 107, 107, 0.2)',
          border: '1px solid #ff6b6b',
          color: '#ff6b6b',
          padding: '20px',
          borderRadius: '8px',
          textAlign: 'center',
        }}>
>>>>>>> f6e6efebfb8623d4fe58cf21d0a2749b1f6a81ea
          ❌ {error || 'Турнир не найден'}
        </div>
      </div>
    )
  }

<<<<<<< HEAD
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
=======
  return (
    <div className="page" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <button onClick={() => navigate(-1)} className="btn" style={{ marginBottom: '20px' }}>
        ← Вернуться
      </button>

      {/* Основная информация */}
      <div style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '30px',
        borderRadius: '12px',
        marginBottom: '25px',
        color: 'white',
      }}>
        <h1 style={{ margin: '0 0 15px 0', fontSize: '32px' }}>{tournament.name}</h1>
        <p style={{ margin: '0 0 15px 0', fontSize: '16px', opacity: 0.9 }}>
          {tournament.description}
        </p>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '20px' }}>
          <div>
            <div style={{ opacity: 0.8, fontSize: '14px' }}>Статус</div>
            <div style={{ fontSize: '18px', fontWeight: 'bold' }}>
              {tournament.status === 'active' ? '🔴 Активный' : 
               tournament.status === 'pending' ? '⏰ Ожидание' : 
               '✅ Завершен'}
            </div>
          </div>
          <div>
            <div style={{ opacity: 0.8, fontSize: '14px' }}>Участники</div>
            <div style={{ fontSize: '18px', fontWeight: 'bold' }}>
              {tournament.currentParticipants || 0}/{tournament.maxParticipants || 0}
            </div>
          </div>
        </div>
      </div>

      {/* Детали */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '15px',
        marginBottom: '25px',
      }}>
        <div style={{
          background: 'rgba(255, 215, 0, 0.1)',
          border: '2px solid #ffd700',
          padding: '15px',
          borderRadius: '8px',
        }}>
          <div style={{ opacity: 0.7, fontSize: '12px', marginBottom: '8px' }}>💰 Вход</div>
          <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#ffd700' }}>
            {tournament.entryFee} монет
          </div>
        </div>

        <div style={{
          background: 'rgba(255, 215, 0, 0.1)',
          border: '2px solid #ffd700',
          padding: '15px',
          borderRadius: '8px',
        }}>
          <div style={{ opacity: 0.7, fontSize: '12px', marginBottom: '8px' }}>🎁 Призовой фонд</div>
          <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#ffd700' }}>
            {tournament.prizePool} монет
          </div>
        </div>

        <div style={{
          background: 'rgba(0, 212, 255, 0.1)',
          border: '2px solid #00d4ff',
          padding: '15px',
          borderRadius: '8px',
        }}>
          <div style={{ opacity: 0.7, fontSize: '12px', marginBottom: '8px' }}>📅 Начало</div>
          <div style={{ fontSize: '14px', fontWeight: 'bold' }}>
            {formatDate(tournament.startDate)}
          </div>
        </div>

        <div style={{
          background: 'rgba(0, 212, 255, 0.1)',
          border: '2px solid #00d4ff',
          padding: '15px',
          borderRadius: '8px',
        }}>
          <div style={{ opacity: 0.7, fontSize: '12px', marginBottom: '8px' }}>🏁 Конец</div>
          <div style={{ fontSize: '14px', fontWeight: 'bold' }}>
            {formatDate(tournament.endDate)}
          </div>
        </div>
      </div>

      {/* Информация о требованиях */}
      <div style={{
        background: 'rgba(33, 150, 243, 0.1)',
        border: '1px solid #2196f3',
        borderRadius: '8px',
        padding: '12px',
        marginBottom: '20px',
        fontSize: '13px',
      }}>
        <div style={{ marginBottom: '6px', fontWeight: 'bold', color: '#2196f3' }}>
          ℹ️ Требования для регистрации
        </div>
        <div style={{ opacity: 0.8, lineHeight: '1.5' }}>
          • Заполненные Game ID и Server ID в профиле<br/>
          • Достаточный баланс монет ({tournament.entryFee || 0} монет)<br/>
          • Выбор роли (Мидер или Роумер)
        </div>
      </div>

      {/* Выбор роли */}
      {!isUserJoined && !showRoleSelection && (
        <button
          onClick={() => setShowRoleSelection(true)}
          className="btn btn-primary"
          style={{ width: '100%', padding: '16px', fontSize: '16px', marginBottom: '25px' }}
        >
          ➕ Зарегистрироваться
        </button>
      )}

      {showRoleSelection && (
        <div style={{
          background: 'rgba(102, 126, 234, 0.1)',
          border: '2px solid #667eea',
          padding: '20px',
          borderRadius: '12px',
          marginBottom: '25px',
        }}>
          <h3 style={{ margin: '0 0 20px 0', color: '#667eea' }}>🎮 Выберите роль</h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px' }}>
            {/* Мидер */}
            <div
              onClick={() => handleRoleSelect('mider')}
              style={{
                background: selectedRole === 'mider' ? 'rgba(102, 126, 234, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                border: selectedRole === 'mider' ? '2px solid #667eea' : '2px solid rgba(102, 126, 234, 0.3)',
                padding: '20px',
                borderRadius: '8px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                textAlign: 'center',
              }}
              onMouseEnter={(e) => {
                if (selectedRole !== 'mider') {
                  (e.currentTarget as HTMLDivElement).style.borderColor = '#667eea'
                }
              }}
              onMouseLeave={(e) => {
                if (selectedRole !== 'mider') {
                  (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(102, 126, 234, 0.3)'
                }
              }}
            >
              <div style={{ fontSize: '32px', marginBottom: '10px' }}>⚔️</div>
              <div style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '8px' }}>Мидер</div>
              <div style={{ fontSize: '13px', opacity: 0.7 }}>
                Берёте на себя основную роль, контролируете центр карты
              </div>
            </div>

            {/* Роумер */}
            <div
              onClick={() => handleRoleSelect('roumer')}
              style={{
                background: selectedRole === 'roumer' ? 'rgba(102, 126, 234, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                border: selectedRole === 'roumer' ? '2px solid #667eea' : '2px solid rgba(102, 126, 234, 0.3)',
                padding: '20px',
                borderRadius: '8px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                textAlign: 'center',
              }}
              onMouseEnter={(e) => {
                if (selectedRole !== 'roumer') {
                  (e.currentTarget as HTMLDivElement).style.borderColor = '#667eea'
                }
              }}
              onMouseLeave={(e) => {
                if (selectedRole !== 'roumer') {
                  (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(102, 126, 234, 0.3)'
                }
              }}
            >
              <div style={{ fontSize: '32px', marginBottom: '10px' }}>🏃</div>
              <div style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '8px' }}>Роумер</div>
              <div style={{ fontSize: '13px', opacity: 0.7 }}>
                Поддерживаете команду, помогаете на других лайнах
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <button
              onClick={() => {
                setShowRoleSelection(false)
                setSelectedRole(null)
              }}
              className="btn"
              style={{ padding: '12px' }}
            >
              ❌ Отмена
            </button>
            <button
              onClick={handleJoinWithRole}
              disabled={!selectedRole || joining}
              className={`btn ${selectedRole ? 'btn-primary' : ''}`}
              style={{
                padding: '12px',
                opacity: selectedRole ? 1 : 0.5,
                cursor: selectedRole ? 'pointer' : 'not-allowed',
              }}
            >
              {joining ? '⏳ Регистрация...' : '✅ Присоединиться'}
            </button>
          </div>
        </div>
      )}

      {isUserJoined && (
        <div>
          <div style={{
            background: 'rgba(76, 175, 80, 0.1)',
            border: '2px solid #4caf50',
            padding: '15px',
            borderRadius: '8px',
            textAlign: 'center',
            marginBottom: '15px',
            color: '#4caf50',
            fontSize: '16px',
            fontWeight: 'bold',
          }}>
            ✅ Вы уже присоединились к этому турниру!
          </div>
          
          <button
            onClick={async () => {
              if (!window.confirm('Вы уверены, что хотите отменить регистрацию?\nВам будут возвращены монеты')) {
                return;
              }
              
              try {
                setJoining(true);
                const response = await fetch(
                  api.tournaments.leave(tournament.id),
                  {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ userId }),
                  }
                );

                if (!response.ok) {
                  const errorData = await response.json();
                  throw new Error(errorData.error || 'Failed to leave tournament');
                }

                const data = await response.json();
                alert(`✅ Вы отменили регистрацию! Вам возвращено ${data.refundedAmount} монет`);
                
                // Обновляем данные турнира
                const updatedResponse = await fetch(
                  api.tournaments.detail(tournament.id)
                );
                const updatedTournament = await updatedResponse.json();
                setTournament(updatedTournament);
              } catch (err) {
                console.error('Error leaving tournament:', err);
                alert(`❌ ${err instanceof Error ? err.message : 'Ошибка при отмене регистрации'}`);
              } finally {
                setJoining(false);
              }
            }}
            disabled={joining}
            className="btn"
            style={{
              width: '100%',
              padding: '12px',
              background: '#ff9800',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: joining ? 'not-allowed' : 'pointer',
              fontWeight: 'bold',
              opacity: joining ? 0.7 : 1,
              marginBottom: '25px',
            }}
          >
            {joining ? '⏳ Отмена регистрации...' : '❌ Отменить регистрацию'}
          </button>
        </div>
      )}

      {/* Список участников */}
      <div>
        <h3 style={{ marginBottom: '15px' }}>👥 Участники ({tournament.participants.length})</h3>
        
        {tournament.participants.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '40px',
            background: 'rgba(0, 212, 255, 0.05)',
            borderRadius: '12px',
            border: '1px dashed #00d4ff',
            opacity: 0.7,
          }}>
            Нет участников
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '10px' }}>
            {tournament.participants.map((participant, index) => (
              <div
                key={`${participant.userId}-${index}`}
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  padding: '12px',
                  borderRadius: '8px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div>
                  <div style={{ fontWeight: 'bold' }}>{participant.username}</div>
                  <div style={{ fontSize: '12px', opacity: 0.6 }}>
                    {participant.role === 'mider' ? '⚔️ Мидер' : 
                     participant.role === 'roumer' ? '🏃 Роумер' : 
                     '❓ Без роли'}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: 'bold', color: '#ffd700' }}>Очки: {participant.score}</div>
                </div>
              </div>
            ))}
>>>>>>> f6e6efebfb8623d4fe58cf21d0a2749b1f6a81ea
          </div>
        )}
      </div>
    </div>
  )
}
