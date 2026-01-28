/**
 * ПРИМЕРЫ: Использование функционала админки
 * 
 * Эти примеры показывают как:
 * - Проверить права доступа
 * - Создать турнир
 * - Управлять турнирами
 * - Завершить турнир
 */

// ===== ПРИМЕР 1: Проверка доступа =====

import { getTelegramUserInfo } from '@/config/telegram'
import { isAdmin, canAccessAdminPanel, canCreateTournament } from '@/config/admin'

function CheckAccessExample() {
  const user = getTelegramUserInfo()
  const userId = user?.id

  // Проверить, является ли пользователь админом
  if (isAdmin(userId)) {
    console.log('✅ Пользователь является администратором')
  } else {
    console.log('❌ Пользователь НЕ является администратором')
  }

  // Проверить, может ли пользователь открыть админку
  if (canAccessAdminPanel(userId)) {
    console.log('✅ Доступ к админке разрешен')
    return <AdminPage />
  } else {
    return <div>❌ Доступ запрещен</div>
  }

  // Проверить, может ли создавать турниры
  const canCreate = canCreateTournament(userId, 25) // 25 = уровень пользователя
  if (canCreate) {
    console.log('✅ Может создавать турниры')
  }
}

// ===== ПРИМЕР 2: Создание турнира =====

import { useTournamentManagement } from '@/hooks/useTournamentManagement'

function CreateTournamentExample() {
  const { createTournament, loading, error } = useTournamentManagement()

  const handleCreate = async () => {
    try {
      const newTournament = await createTournament({
        name: 'Быстрый поединок',
        description: 'Турнир для новичков, награды за первое место!',
        startDate: '2026-01-28',
        endDate: '2026-01-29',
        maxParticipants: 32,
        entryFee: 100,
        prizePool: 1000,
      })

      console.log('✅ Турнир создан:', newTournament)
      alert(`Турнир "${newTournament.name}" создан успешно!`)
    } catch (err) {
      console.error('❌ Ошибка при создании:', err)
      alert(`Ошибка: ${err instanceof Error ? err.message : 'Unknown error'}`)
    }
  }

  return (
    <div>
      <button onClick={handleCreate} disabled={loading}>
        {loading ? '⏳ Создание...' : '➕ Создать турнир'}
      </button>
      {error && <div style={{ color: 'red' }}>❌ {error}</div>}
    </div>
  )
}

// ===== ПРИМЕР 3: Завершение турнира =====

import { tournamentAPI } from '@/services/api'

async function FinishTournamentExample(tournamentId: number) {
  try {
    const result = await tournamentAPI.finishTournament(tournamentId)

    console.log('✅ Турнир завершен')
    console.log('Результаты:', result)

    // Получить результаты
    const results = await tournamentAPI.getResults(tournamentId)
    console.log('Победители:')
    results.forEach((winner: any) => {
      console.log(`${winner.position}. ${winner.username} - ${winner.prize} монет`)
    })
  } catch (err) {
    console.error('❌ Ошибка при завершении:', err)
  }
}

// ===== ПРИМЕР 4: Получение всех турниров =====

function GetTournamentsExample() {
  const { tournaments, fetchTournaments } = useTournamentManagement()

  React.useEffect(() => {
    fetchTournaments()
  }, [fetchTournaments])

  return (
    <div>
      <h2>Все турниры ({tournaments.length}):</h2>
      {tournaments.map((tournament) => (
        <div key={tournament.id}>
          <h3>{tournament.name}</h3>
          <p>Статус: {tournament.status}</p>
          <p>Участников: {tournament.currentParticipants}/{tournament.maxParticipants}</p>
          <p>Цена входа: {tournament.entryFee}</p>
          <p>Призовой фонд: {tournament.prizePool}</p>
        </div>
      ))}
    </div>
  )
}

// ===== ПРИМЕР 5: Фильтрация турниров =====

function FilterTournamentsExample() {
  const { tournaments, fetchTournaments } = useTournamentManagement()

  // Активные турниры
  const activeTournaments = tournaments.filter((t) => t.status === 'active')
  console.log(`Активных турниров: ${activeTournaments.length}`)

  // Ожидающие турниры
  const pendingTournaments = tournaments.filter((t) => t.status === 'pending')
  console.log(`Ожидающих турниров: ${pendingTournaments.length}`)

  // Завершенные турниры
  const finishedTournaments = tournaments.filter((t) => t.status === 'finished')
  console.log(`Завершенных турниров: ${finishedTournaments.length}`)

  return (
    <div>
      <h2>Активные турниры</h2>
      {activeTournaments.map((t) => (
        <div key={t.id}>{t.name}</div>
      ))}
    </div>
  )
}

// ===== ПРИМЕР 6: Удаление турнира =====

async function DeleteTournamentExample(tournamentId: number) {
  try {
    const confirmed = window.confirm(
      'Вы уверены? Этот турнир будет удален безвозвратно!'
    )

    if (!confirmed) {
      console.log('Удаление отменено')
      return
    }

    await tournamentAPI.deleteTournament(tournamentId)
    console.log('✅ Турнир удален')
    alert('Турнир удален успешно')
  } catch (err) {
    console.error('❌ Ошибка при удалении:', err)
    alert(`Ошибка: ${err instanceof Error ? err.message : 'Unknown error'}`)
  }
}

// ===== ПРИМЕР 7: Проверка прав для редактирования =====

import { canEditTournament, canDeleteTournament } from '@/config/admin'

function EditPermissionsExample() {
  const user = getTelegramUserInfo()
  const userId = user?.id
  const tournamentCreatedBy = 123456789 // ID создателя турнира

  // Может ли редактировать
  if (canEditTournament(userId, tournamentCreatedBy)) {
    console.log('✅ Можно редактировать этот турнир')
  } else {
    console.log('❌ Нельзя редактировать этот турнир')
  }

  // Может ли удалить
  if (canDeleteTournament(userId)) {
    console.log('✅ Можно удалить этот турнир (админ)')
  } else {
    console.log('❌ Нельзя удалить этот турнир (не админ)')
  }
}

// ===== ПРИМЕР 8: Полный цикл управления турниром =====

async function FullTournamentManagementExample() {
  const { createTournament, tournaments, finishTournament } =
    useTournamentManagement()

  // 1. Создать турнир
  console.log('1️⃣ Создание турнира...')
  const tournament = await createTournament({
    name: 'Полный пример',
    description: 'Демонстрационный турнир',
    startDate: '2026-01-28',
    endDate: '2026-01-29',
    maxParticipants: 10,
    entryFee: 50,
    prizePool: 500,
  })
  console.log('✅ Турнир создан:', tournament.id)

  // 2. Пользователи присоединяются (это происходит на фронте)
  console.log('2️⃣ Пользователи присоединяются...')
  // (симуляция присоединения нескольких участников)

  // 3. Набеглось участников, начинаем турнир
  console.log('3️⃣ Активизация турнира...')
  const updated = await tournamentAPI.updateTournament(tournament.id, {
    status: 'active',
  })
  console.log('✅ Турнир активирован')

  // 4. Турнир проходит (в реальном приложении здесь логика игры)
  console.log('4️⃣ Турнир идет...')
  // (симуляция игровых матчей, обновление очков участников)

  // 5. Завершить турнир
  console.log('5️⃣ Завершение турнира...')
  await finishTournament(tournament.id)
  console.log('✅ Турнир завершен')

  // 6. Получить результаты
  console.log('6️⃣ Получение результатов...')
  const results = await tournamentAPI.getResults(tournament.id)
  results.forEach((result: any) => {
    console.log(`🏆 #${result.position} ${result.username}: ${result.prize} монет`)
  })

  console.log('✅ Полный цикл завершен!')
}

// ===== ПРИМЕР 9: Обработка ошибок =====

async function ErrorHandlingExample(tournamentId: number) {
  try {
    // Попытка завершить турнир
    const result = await tournamentAPI.finishTournament(tournamentId)
    console.log('✅ Турнир завершен')
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes('404')) {
        console.error('❌ Турнир не найден')
      } else if (error.message.includes('already finished')) {
        console.error('❌ Турнир уже завершен')
      } else {
        console.error('❌ Неизвестная ошибка:', error.message)
      }
    }

    // Показать пользователю
    alert(`⚠️ Ошибка: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

// ===== ПРИМЕР 10: Получить информацию о статусах =====

function TournamentStatsExample(tournaments: Tournament[]) {
  console.log('📊 Статистика турниров:')

  const active = tournaments.filter((t) => t.status === 'active').length
  const pending = tournaments.filter((t) => t.status === 'pending').length
  const finished = tournaments.filter((t) => t.status === 'finished').length

  console.log(`
    🔴 Активные: ${active}
    ⏰ Ожидание: ${pending}
    ✅ Завершены: ${finished}
    📈 Всего: ${tournaments.length}
  `)

  const totalPrizePool = tournaments.reduce((sum, t) => sum + t.prizePool, 0)
  console.log(`💰 Общий призовой фонд: ${totalPrizePool} монет`)

  const totalParticipants = tournaments.reduce(
    (sum, t) => sum + t.currentParticipants,
    0
  )
  console.log(`👥 Всего участников: ${totalParticipants}`)
}

export {
  CheckAccessExample,
  CreateTournamentExample,
  FinishTournamentExample,
  GetTournamentsExample,
  FilterTournamentsExample,
  DeleteTournamentExample,
  EditPermissionsExample,
  FullTournamentManagementExample,
  ErrorHandlingExample,
  TournamentStatsExample,
}
