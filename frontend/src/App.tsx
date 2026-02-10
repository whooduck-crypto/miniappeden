import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import { Navigation } from './components/Navigation'
import { DebugPanel } from './components/DebugPanel'
import { HomePage } from './pages/HomePage'
import { TournamentsPage } from './pages/TournamentsPage'
import { TournamentDetailPage } from './pages/TournamentDetailPage'
import { RatingPage } from './pages/RatingPage'
import { ShopPage } from './pages/ShopPage'
import { ProfilePage } from './pages/ProfilePage'
import { AdminPage } from './pages/AdminPage'
import { getTelegramUserInfo } from './config/telegram'
import { getTelegramUserId, isAdmin, ADMIN_CONFIG } from './config/admin'
import { userAPI } from './services/api'
import './App.css'

function AppContent() {
  const [debugInfo, setDebugInfo] = useState<any>(null)
  const location = useLocation()

  // Инициализация пользователя при первом входе
  useEffect(() => {
    const initializeUser = async () => {
      try {
        const user = getTelegramUserInfo()
        const userId = getTelegramUserId()

        if (!userId || !user) {
          console.warn('⚠️ Cannot initialize user: missing Telegram data')
          return
        }

        console.log('👤 Initializing user:', { userId, username: user.username })

        // Пытаемся получить пользователя
        try {
          const existingUser = await userAPI.getProfile(userId)
          console.log('✅ User exists, updating...', existingUser)

          // Обновляем данные пользователя
          await userAPI.updateProfile(userId, {
            username: user.username,
            firstName: user.first_name || 'User',
          })
          console.log('✅ User data updated')
        } catch (err) {
          // Если пользователь не найден, создаем его
          console.log('👤 User not found, creating new...')

          const newUser = await userAPI.createUser({
            telegramId: userId,
            username: user.username,
            firstName: user.first_name || 'User',
          })
          console.log('✅ User created successfully:', newUser)
        }
      } catch (err) {
        console.error('❌ Error initializing user:', err)
      }
    }

    initializeUser()
  }, [])

  // Инициализация Telegram WebApp
  useEffect(() => {
    // Мощное логирование всего
    console.log('==================================================')
    console.log('🚀 APP ИНИЦИАЛИЗАЦИЯ')
    console.log('==================================================')
    
    // Проверка Telegram объекта
    const tg = (window as any).Telegram
    console.log('1️⃣ Telegram объект:', tg ? '✅ ЕСТЬ' : '❌ НЕТ')
    console.log('   Telegram:', tg)
    
    if (tg?.WebApp) {
      console.log('2️⃣ WebApp объект: ✅ ЕСТЬ')
      console.log('   initData:', tg.WebApp.initData)
      console.log('   initDataUnsafe:', tg.WebApp.initDataUnsafe)
    } else {
      console.log('2️⃣ WebApp объект: ❌ НЕТ')
    }
    
    // Получить user info
    const user = getTelegramUserInfo()
    console.log('3️⃣ User info:', user)
    
    // Получить ID
    const id = getTelegramUserId()
    console.log('4️⃣ User ID:', id)
    
    // Проверить админ
    const admin = isAdmin(id)
    console.log('5️⃣ Is Admin:', admin ? '✅ ДА' : '❌ НЕТ')
    console.log('   Admin IDs:', ADMIN_CONFIG.ADMIN_IDS)
    
    // Сохранить для отображения
    setDebugInfo({
      telegramExists: !!tg,
      webAppExists: !!tg?.WebApp,
      userId: id,
      isAdmin: admin,
      adminIds: ADMIN_CONFIG.ADMIN_IDS,
      userInfo: user
    })
  }, [])

  // Определяем текущую страницу для навигации
  const currentPage = location.pathname.startsWith('/tournament/')
    ? 'tournaments'
    : location.pathname === '/'
    ? 'home'
    : location.pathname.replace('/', '') || 'home'

  return (
    <div className="app-container">
      <DebugPanel />
      <main className="app-content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/tournaments" element={<TournamentsPage />} />
          <Route path="/tournament/:tournamentId" element={<TournamentDetailPage />} />
          <Route path="/rating" element={<RatingPage />} />
          <Route path="/shop" element={<ShopPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
      </main>
      <Navigation currentPage={currentPage} onNavigate={() => {}} />
    </div>
  )
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  )
}

export default App

