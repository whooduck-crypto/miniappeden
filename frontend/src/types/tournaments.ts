/**
 * Типы данных для турниров
 */

export type ParticipantRole = 'roamer' | 'holder' | 'expert' | 'lesnik' | 'mider'

export interface Tournament {
  id: number
  name: string
  description: string
  startDate: string
  endDate: string
  maxParticipants: number
  currentParticipants: number
  entryFee: number
  prizePool: number
  status: 'pending' | 'active' | 'finished'
  createdBy: number
  createdAt: string
  participants: TournamentParticipant[]
}

export interface TournamentParticipant {
  userId: number
  username: string
  joinedAt: string
  score: number
  position?: number
  role?: ParticipantRole
}

export interface CreateTournamentData {
  name: string
  description: string
  startDate: string
  endDate: string
  maxParticipants: number
  entryFee: number
  prizePool: number
  createdBy?: number
}

export interface TournamentResult {
  userId: number
  username: string
  position: number
  prize: number
  score: number
  role?: ParticipantRole
}

export interface TeamMember {
  userId: number
  username: string
  role: ParticipantRole
}

export interface Team {
  id?: number
  members: TeamMember[]
}
