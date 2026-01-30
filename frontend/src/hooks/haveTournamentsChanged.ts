import { useState, useCallback } from 'react'

interface Tournament {
  id: number
  name: string
  description: string
  status: 'pending' | 'active' | 'finished'
  startDate: string
  endDate: string
  entryFee: number | string
  prizePool: number | string
  currentParticipants: number
  maxParticipants: number
}

export function useTournamentManagement() {
  const [tournaments, setTournaments] = useState<Tournament[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Функция для глубокого сравнения турниров
  const haveTournamentsChanged = useCallback((oldTournaments: Tournament[], newTournaments: Tournament[]) => {
    if (oldTournaments.length !== newTournaments.length) {
      return true
    }

    return oldTournaments.some((oldTournament, index) => {
      const newTournament = newTournaments[index]
      return (
        oldTournament.id !== newTournament.id ||
        oldTournament.currentParticipants !== newTournament.currentParticipants ||
        oldTournament.status !== newTournament.status ||
        oldTournament.name !== newTournament.name ||
        oldTournament.description !== newTournament.description ||
        oldTournament.startDate !== newTournament.startDate ||
        oldTournament.endDate !== newTournament.endDate ||
        oldTournament.entryFee !== newTournament.entryFee ||
        oldTournament.prizePool !== newTournament.prizePool ||
        oldTournament.maxParticipants !== newTournament.maxParticipants
      )
    })
  }, [])

  const fetchTournaments = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      // Замените URL на ваш API endpoint
      const response = await fetch('/api/tournaments')
      
      if (!response.ok) {
        throw new Error('Не удалось загрузить турниры')
      }

      const data = await response.json()
      const newTournaments: Tournament[] = data.tournaments || data || []

      // Обновляем состояние только если данные действительно изменились
      setTournaments(prev => {
        if (haveTournamentsChanged(prev, newTournaments)) {
          return newTournaments
        }
        return prev
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Неизвестная ошибка')
      console.error('Ошибка загрузки турниров:', err)
    } finally {
      setLoading(false)
    }
  }, [haveTournamentsChanged])

  const joinTournament = useCallback(async (userId: number, tournamentId: number) => {
    try {
      const response = await fetch('/api/tournaments/join', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          tournamentId,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Не удалось присоединиться к турниру')
      }

      const result = await response.json()

      // Обновляем локальное состояние
      setTournaments(prev =>
        prev.map(tournament =>
          tournament.id === tournamentId
            ? {
                ...tournament,
                currentParticipants: tournament.currentParticipants + 1,
              }
            : tournament
        )
      )

      return result
    } catch (err) {
      throw err
    }
  }, [])

  return {
    tournaments,
    loading,
    error,
    fetchTournaments,
    joinTournament,
  }
}