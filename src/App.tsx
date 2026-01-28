import { useState, useEffect } from 'react'
import { Navigation } from './components/Navigation'
import { HomePage } from './pages/HomePage'
import { TournamentsPage } from './pages/TournamentsPage'
import { RatingPage } from './pages/RatingPage'
import { ShopPage } from './pages/ShopPage'
import { ProfilePage } from './pages/ProfilePage'
import { AdminPage } from './pages/AdminPage'
import { getTelegramUserInfo } from './config/telegram'
import './App.css'

function App() {
  const [currentPage, setCurrentPage] = useState('home')

  // Инициализация Telegram WebApp
  useEffect(() => {
    const user = getTelegramUserInfo()
    if (user) {
      console.log('Telegram User:', user)
    }
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
      <main className="app-content">
        {renderPage()}
      </main>
      <Navigation currentPage={currentPage} onNavigate={setCurrentPage} />
    </div>
  )
}

export default App

