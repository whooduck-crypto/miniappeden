import { useState, useCallback } from 'react'
import { tournamentAPI } from '../services/api'
import type { Tournament, CreateTournamentData } from '../types/tournaments'

/**
 * Хук для работы с турнирами
 */
export function useTournamentManagement() {
  const [tournaments, setTournaments] = useState<Tournament[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchTournaments = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await tournamentAPI.getTournaments()
      setTournaments(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load tournaments')
    } finally {
      setLoading(false)
    }
  }, [])

  const createTournament = useCallback(async (data: CreateTournamentData) => {
    setError(null)
    try {
      const newTournament = await tournamentAPI.createTournament(data)
      setTournaments(prev => [...prev, newTournament])
      return newTournament
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to create tournament'
      setError(errorMsg)
      throw err
    }
  }, [])

  const updateTournament = useCallback(async (id: number, data: Partial<Tournament>) => {
    setError(null)
    try {
      const updated = await tournamentAPI.updateTournament(id, data)
      setTournaments(prev => prev.map(t => t.id === id ? updated : t))
      return updated
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to update tournament'
      setError(errorMsg)
      throw err
    }
  }, [])

  const deleteTournament = useCallback(async (id: number) => {
    setError(null)
    try {
      await tournamentAPI.deleteTournament(id)
      setTournaments(prev => prev.filter(t => t.id !== id))
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to delete tournament'
      setError(errorMsg)
      throw err
    }
  }, [])

  const joinTournament = useCallback(async (userId: number, tournamentId: number) => {
    setError(null)
    try {
      const result = await tournamentAPI.joinTournament(userId, tournamentId)
      // Обновить количество участников локально
      setTournaments(prev => prev.map(t => 
        t.id === tournamentId 
          ? { ...t, currentParticipants: t.currentParticipants + 1 }
          : t
      ))
      return result
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to join tournament'
      setError(errorMsg)
      throw err
    }
  }, [])

  const leaveTournament = useCallback(async (userId: number, tournamentId: number) => {
    setError(null)
    try {
      const result = await tournamentAPI.leaveTournament(userId, tournamentId)
      // Обновить количество участников локально
      setTournaments(prev => prev.map(t => 
        t.id === tournamentId 
          ? { ...t, currentParticipants: Math.max(0, t.currentParticipants - 1) }
          : t
      ))
      return result
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to leave tournament'
      setError(errorMsg)
      throw err
    }
  }, [])

  const finishTournament = useCallback(async (tournamentId: number) => {
    setError(null)
    try {
      const result = await tournamentAPI.finishTournament(tournamentId)
      setTournaments(prev => prev.map(t => 
        t.id === tournamentId 
          ? { ...t, status: 'finished' as const }
          : t
      ))
      return result
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to finish tournament'
      setError(errorMsg)
      throw err
    }
  }, [])

  return {
    tournaments,
    loading,
    error,
    fetchTournaments,
    createTournament,
    updateTournament,
    deleteTournament,
    joinTournament,
    leaveTournament,
    finishTournament,
  }
}
