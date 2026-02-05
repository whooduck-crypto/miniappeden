import '../App.css'
import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getTelegramUserInfo } from '../config/telegram'
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

export function TournamentDetailPage() {
  const { tournamentId } = useParams<{ tournamentId: string }>()
  const navigate = useNavigate()
  const user = getTelegramUserInfo()
  const userId = user?.id

  const [tournament, setTournament] = useState<Tournament | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showRoleSelection, setShowRoleSelection] = useState(false)
  const [selectedRole, setSelectedRole] = useState<ParticipantRole | null>(null)
  const [joining, setJoining] = useState(false)

  // Проверяем, уже ли пользователь присоединился
  const isUserJoined = tournament?.participants.some((p: any) => p.userId === userId)

  useEffect(() => {
    const fetchTournament = async () => {
      try {
        setLoading(true)
        const id = parseInt(tournamentId || '')
        const response = await fetch(`https://web-production-b6f80.up.railway.app/api/tournaments/${id}`)
        
        if (!response.ok) {
          throw new Error('Tournament not found')
        }
        
        const data = await response.json()
        setTournament(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load tournament')
        console.error('Error fetching tournament:', err)
      } finally {
        setLoading(false)
      }
    }

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
      const response = await fetch(`https://web-production-b6f80.up.railway.app/api/tournaments/${tournament.id}/join`, {
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
      const updatedResponse = await fetch(`https://web-production-b6f80.up.railway.app/api/tournaments/${tournament.id}`)
      const updatedTournament = await updatedResponse.json()
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
      </div>
    )
  }

  if (error || !tournament) {
    return (
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
          ❌ {error || 'Турнир не найден'}
        </div>
      </div>
    )
  }

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
        <div style={{
          background: 'rgba(76, 175, 80, 0.1)',
          border: '2px solid #4caf50',
          padding: '15px',
          borderRadius: '8px',
          textAlign: 'center',
          marginBottom: '25px',
          color: '#4caf50',
          fontSize: '16px',
          fontWeight: 'bold',
        }}>
          ✅ Вы уже присоединились к этому турниру!
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
          </div>
        )}
      </div>
    </div>
  )
}
