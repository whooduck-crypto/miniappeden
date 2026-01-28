import { useEffect, useState } from 'react'
import { getTelegramUserInfo } from '../config/telegram'

/**
 * Компонент для отображения аватарки пользователя из Telegram
 */
export function UserAvatar() {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const [firstName, setFirstName] = useState<string>('User')

  useEffect(() => {
    const user = getTelegramUserInfo()
    
    if (user) {
      // Получить имя пользователя
      setFirstName(user.first_name || user.username || 'User')
      
      // Telegram предоставляет аватарку через их CDN
      // Но так как мы не можем получить прямой URL в Mini App,
      // используем генератор аватарок на основе имени
      
      console.log('👤 User Info:', user)
      console.log('   - ID:', user.id)
      console.log('   - First Name:', user.first_name)
      console.log('   - Username:', user.username)
      console.log('   - Last Name:', user.last_name)
    }
  }, [])

  // Генератор случайного цвета на основе ID пользователя
  const generateAvatarColor = (userId?: number): string => {
    const colors = [
      '#FF6B6B', // Красный
      '#4ECDC4', // Бирюзовый
      '#45B7D1', // Голубой
      '#FFA07A', // Светло-коралловый
      '#98D8C8', // Мятный
      '#F7DC6F', // Жёлтый
      '#BB8FCE', // Лавандовый
      '#85C1E2', // Нежный голубой
    ]
    
    if (userId) {
      return colors[userId % colors.length]
    }
    return colors[Math.floor(Math.random() * colors.length)]
  }

  // Получить первую букву для аватарки
  const getInitial = (name: string): string => {
    return name.charAt(0).toUpperCase()
  }

  const user = getTelegramUserInfo()
  const backgroundColor = generateAvatarColor(user?.id)
  const initial = getInitial(firstName)

  return (
    <div
      className="user-avatar-large"
      style={{
        width: '100px',
        height: '100px',
        borderRadius: '50%',
        background: `linear-gradient(135deg, ${backgroundColor} 0%, ${backgroundColor}99 100%)`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '48px',
        fontWeight: 'bold',
        color: 'white',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
        border: '3px solid rgba(255, 255, 255, 0.2)',
      }}
    >
      {initial}
    </div>
  )
}

/**
 * Компонент для маленькой аватарки (в навигации, etc)
 */
export function UserAvatarSmall({ size = 40 }: { size?: number }) {
  const [firstName, setFirstName] = useState<string>('U')

  useEffect(() => {
    const user = getTelegramUserInfo()
    if (user?.first_name) {
      setFirstName(user.first_name.charAt(0).toUpperCase())
    }
  }, [])

  const user = getTelegramUserInfo()
  const colors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A',
    '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E2',
  ]
  const backgroundColor = colors[(user?.id || 0) % colors.length]

  return (
    <div
      style={{
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: '50%',
        background: `linear-gradient(135deg, ${backgroundColor} 0%, ${backgroundColor}99 100%)`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: `${size * 0.5}px`,
        fontWeight: 'bold',
        color: 'white',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
      }}
    >
      {firstName}
    </div>
  )
}
