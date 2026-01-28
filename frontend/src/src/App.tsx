import { useState, useEffect } from 'react'
import { Navigation } from './components/Navigation'
import { DebugPanel } from './components/DebugPanel'
import { HomePage } from './pages/HomePage'
import { TournamentsPage } from './pages/TournamentsPage'
import { RatingPage } from './pages/RatingPage'
import { ShopPage } from './pages/ShopPage'
import { ProfilePage } from './pages/ProfilePage'
import { AdminPage } from './pages/AdminPage'
import { getTelegramUserInfo } from './config/telegram'
import { getTelegramUserId, isAdmin, ADMIN_CONFIG } from './config/admin'
import './App.css'

function App() {
  const [currentPage, setCurrentPage] = useState('home')
  const [debugInfo, setDebugInfo] = useState<any>(null)

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

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage />
      case 'tournaments':
        return <TournamentsPage />
      case 'rating':
        return <RatingPage />
      case 'shop':
        return <ShopPage />
      case 'profile':
        return <ProfilePage />
      case 'admin':
        return <AdminPage />
      default:
        return <HomePage />
    }
  }

  return (
    <div className="app-container">
      <DebugPanel />
      <main className="app-content">
        {renderPage()}
      </main>
      <Navigation currentPage={currentPage} onNavigate={setCurrentPage} />
    </div>
  )
}

export default App

