import '../App.css'
import { useState, useEffect } from 'react'
import { getTelegramUserInfo } from '../config/telegram'
import { canAccessAdminPanel } from '../config/admin'
import { useTournamentManagement } from '../hooks/useTournamentManagement'
import type { CreateTournamentData } from '../types/tournaments'

export function AdminPage() {
  const user = getTelegramUserInfo()
  const userId = user?.id

  // Проверка доступа
  const hasAccess = canAccessAdminPanel(userId)

  const {
    tournaments,
    loading,
    error,
    fetchTournaments,
    createTournament,
    deleteTournament,
    finishTournament,
  } = useTournamentManagement()

  // Форма создания турнира
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState<CreateTournamentData>({
    name: '',
    description: '',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    maxParticipants: 32,
    entryFee: 100,
    prizePool: 1000,
  })

  const [editing, setEditing] = useState<number | null>(null)
  const [creating, setCreating] = useState(false)

  useEffect(() => {
    if (hasAccess) {
      fetchTournaments()
    }
  }, [hasAccess, fetchTournaments])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name.includes('Participants') || name.includes('Fee') || name.includes('Pool')
        ? parseInt(value) || 0
        : value,
    }))
  }

  const handleCreateTournament = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!userId) return

    setCreating(true)
    try {
      await createTournament({
        ...formData,
        createdBy: userId,
      })
      setShowForm(false)
      setFormData({
        name: '',
        description: '',
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
        maxParticipants: 32,
        entryFee: 100,
        prizePool: 1000,
      })
    } catch (err) {
      console.error('Failed to create tournament:', err)
    } finally {
      setCreating(false)
    }
  }

  const handleDeleteTournament = async (tournamentId: number) => {
    if (window.confirm('Вы уверены? Этот турнир будет удален!')) {
      try {
        await deleteTournament(tournamentId)
      } catch (err) {
        console.error('Failed to delete tournament:', err)
      }
    }
  }

  const handleFinishTournament = async (tournamentId: number) => {
    if (window.confirm('Завершить турнир и распределить призы?')) {
      try {
        await finishTournament(tournamentId)
      } catch (err) {
        console.error('Failed to finish tournament:', err)
      }
    }
  }

  // Если нет доступа
  if (!hasAccess) {
    return (
      <div className="page" style={{ textAlign: 'center', paddingTop: '60px', color: '#fff' }}>
        <div style={{ fontSize: '48px', marginBottom: '20px' }}>🚫</div>
        <h1 style={{ fontSize: '24px', marginBottom: '15px' }}>Доступ запрещен</h1>
        <p style={{ fontSize: '16px', opacity: 0.7, marginBottom: '20px' }}>
          Вы не являетесь администратором
        </p>
        <p style={{ fontSize: '14px', opacity: 0.5 }}>
          {userId && `Ваш ID: ${userId}`}
        </p>
      </div>
    )
  }

  // Если есть доступ
  return (
    <div className="page" style={{ background: '#0f0f1e', color: 'white' }}>
      <h1 style={{ fontSize: '28px', marginBottom: '20px' }}>⚙️ Админка</h1>

      {/* Информация об админе */}
      <div style={{
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
        borderRadius: '12px',
        padding: '15px',
        marginBottom: '25px',
        border: '1px solid #00d4ff',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
          <span style={{ fontSize: '24px' }}>👤</span>
          <div>
            <div style={{ fontSize: '16px', fontWeight: 'bold' }}>Администратор</div>
            <div style={{ fontSize: '13px', opacity: 0.7 }}>ID: {userId}</div>
          </div>
        </div>
      </div>

      {/* Ошибки */}
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

      {/* Кнопка создания */}
      <button
        onClick={() => setShowForm(!showForm)}
        className="btn btn-primary"
        style={{
          width: '100%',
          marginBottom: '25px',
          padding: '12px',
          fontSize: '16px',
        }}
      >
        {showForm ? '❌ Отмена' : '➕ Создать турнир'}
      </button>

      {/* Форма создания */}
      {showForm && (
        <form
          onSubmit={handleCreateTournament}
          style={{
            background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
            borderRadius: '12px',
            padding: '20px',
            marginBottom: '25px',
            border: '1px solid #00d4ff',
          }}
        >
          <h3 style={{ marginTop: 0, color: '#00d4ff' }}>Новый турнир</h3>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px' }}>
              Название турнира
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Название турнира"
              required
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '8px',
                border: '1px solid #00d4ff',
                background: 'rgba(0, 212, 255, 0.05)',
                color: 'white',
                fontSize: '14px',
                boxSizing: 'border-box',
              }}
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px' }}>
              Описание
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Описание турнира"
              rows={3}
              required
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '8px',
                border: '1px solid #00d4ff',
                background: 'rgba(0, 212, 255, 0.05)',
                color: 'white',
                fontSize: '14px',
                boxSizing: 'border-box',
                fontFamily: 'inherit',
                resize: 'vertical',
              }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '15px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px' }}>
                Дата начала
              </label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleInputChange}
                required
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '8px',
                  border: '1px solid #00d4ff',
                  background: 'rgba(0, 212, 255, 0.05)',
                  color: 'white',
                  fontSize: '14px',
                  boxSizing: 'border-box',
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px' }}>
                Дата окончания
              </label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleInputChange}
                required
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '8px',
                  border: '1px solid #00d4ff',
                  background: 'rgba(0, 212, 255, 0.05)',
                  color: 'white',
                  fontSize: '14px',
                  boxSizing: 'border-box',
                }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '15px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px' }}>
                Макс участников
              </label>
              <input
                type="number"
                name="maxParticipants"
                value={formData.maxParticipants}
                onChange={handleInputChange}
                min="2"
                max="1000"
                required
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '8px',
                  border: '1px solid #00d4ff',
                  background: 'rgba(0, 212, 255, 0.05)',
                  color: 'white',
                  fontSize: '14px',
                  boxSizing: 'border-box',
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px' }}>
                Вступительный взнос
              </label>
              <input
                type="number"
                name="entryFee"
                value={formData.entryFee}
                onChange={handleInputChange}
                min="0"
                required
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '8px',
                  border: '1px solid #00d4ff',
                  background: 'rgba(0, 212, 255, 0.05)',
                  color: 'white',
                  fontSize: '14px',
                  boxSizing: 'border-box',
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px' }}>
                Призовой фонд
              </label>
              <input
                type="number"
                name="prizePool"
                value={formData.prizePool}
                onChange={handleInputChange}
                min="100"
                required
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '8px',
                  border: '1px solid #00d4ff',
                  background: 'rgba(0, 212, 255, 0.05)',
                  color: 'white',
                  fontSize: '14px',
                  boxSizing: 'border-box',
                }}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={creating}
            className="btn btn-primary"
            style={{ width: '100%', padding: '12px' }}
          >
            {creating ? '⏳ Создание...' : '✅ Создать турнир'}
          </button>
        </form>
      )}

      {/* Список турниров */}
      <div>
        <h2 style={{ fontSize: '20px', marginBottom: '15px', marginTop: 0 }}>
          🏆 Турниры ({tournaments.length})
        </h2>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', opacity: 0.7 }}>
            ⏳ Загрузка...
          </div>
        ) : tournaments.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '40px',
            background: 'rgba(0, 212, 255, 0.05)',
            borderRadius: '12px',
            border: '1px dashed #00d4ff',
            opacity: 0.7,
          }}>
            Нет турниров. Создайте первый! 🎮
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '12px' }}>
            {tournaments.map(tournament => (
              <div
                key={tournament.id}
                style={{
                  background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
                  borderRadius: '12px',
                  padding: '15px',
                  border: '1px solid #00d4ff',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px' }}>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '16px', marginBottom: '5px' }}>
                      {tournament.name}
                    </h3>
                    <p style={{ margin: 0, fontSize: '13px', opacity: 0.7 }}>
                      {tournament.description}
                    </p>
                  </div>
                  <div style={{
                    background: tournament.status === 'active' ? '#ff6b6b' : tournament.status === 'finished' ? '#51cf66' : '#ffa94d',
                    color: 'white',
                    padding: '4px 8px',
                    borderRadius: '6px',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    whiteSpace: 'nowrap',
                  }}>
                    {tournament.status === 'active' ? '🔴 Активный' : tournament.status === 'finished' ? '✅ Завершен' : '⏱️ Ожидание'}
                  </div>
                </div>

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(4, 1fr)',
                  gap: '10px',
                  marginBottom: '12px',
                }}>
                  <div>
                    <div style={{ fontSize: '12px', opacity: 0.7 }}>Участников</div>
                    <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#00d4ff' }}>
                      {tournament.currentParticipants}/{tournament.maxParticipants}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '12px', opacity: 0.7 }}>Взнос</div>
                    <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#ffd700' }}>
                      {tournament.entryFee}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '12px', opacity: 0.7 }}>Призовой фонд</div>
                    <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#ffd700' }}>
                      {tournament.prizePool}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '12px', opacity: 0.7 }}>Дата</div>
                    <div style={{ fontSize: '14px', fontWeight: 'bold' }}>
                      {new Date(tournament.startDate).toLocaleDateString('ru-RU')}
                    </div>
                  </div>
                </div>

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: '10px',
                }}>
                  <button
                    onClick={() => handleFinishTournament(tournament.id)}
                    disabled={tournament.status === 'finished'}
                    className="btn btn-primary"
                    style={{
                      fontSize: '12px',
                      padding: '8px',
                      opacity: tournament.status === 'finished' ? 0.5 : 1,
                      cursor: tournament.status === 'finished' ? 'not-allowed' : 'pointer',
                    }}
                  >
                    🏁 Завершить
                  </button>
                  <button
                    onClick={() => setEditing(editing === tournament.id ? null : tournament.id)}
                    className="btn btn-secondary"
                    style={{ fontSize: '12px', padding: '8px' }}
                  >
                    ✏️ Редакт
                  </button>
                  <button
                    onClick={() => handleDeleteTournament(tournament.id)}
                    className="btn btn-secondary"
                    style={{
                      fontSize: '12px',
                      padding: '8px',
                      color: '#ff6b6b',
                      borderColor: '#ff6b6b',
                    }}
                  >
                    🗑️ Удалить
                  </button>
                </div>

                {/* Информация о участниках */}
                {tournament.participants && tournament.participants.length > 0 && (
                  <div style={{
                    marginTop: '12px',
                    paddingTop: '12px',
                    borderTop: '1px solid rgba(0, 212, 255, 0.2)',
                  }}>
                    <div style={{ fontSize: '12px', marginBottom: '8px' }}>
                      <strong>Участники:</strong>
                    </div>
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))',
                      gap: '8px',
                    }}>
                      {tournament.participants.map(p => (
                        <div
                          key={p.userId}
                          style={{
                            background: 'rgba(0, 212, 255, 0.1)',
                            borderRadius: '6px',
                            padding: '6px',
                            fontSize: '12px',
                            textAlign: 'center',
                            border: '1px solid rgba(0, 212, 255, 0.2)',
                          }}
                        >
                          <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {p.username}
                          </div>
                          <div style={{ fontSize: '11px', opacity: 0.7 }}>
                            #{p.position || '-'}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminPage
