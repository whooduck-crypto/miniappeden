import { useEffect, useState } from 'react'
import { getTelegramUserInfo } from '../config/telegram'

/**
 * Компонент для отображения аватарки пользователя из Telegram
 */
export function UserAvatar() {
    const [user, setUser] = useState<any>(null)
    const [initial, setInitial] = useState<string>('U')
    const [backgroundColor, setBackgroundColor] = useState<string>('#4ECDC4')

    useEffect(() => {
        // Попытка получить user info
        const telegramUser = getTelegramUserInfo()

        console.log('🎨 UserAvatar useEffect:')
        console.log('   User:', telegramUser)

        if (telegramUser) {
            setUser(telegramUser)

            // Получить первую букву имени
            const name = telegramUser.first_name || telegramUser.username || 'User'
            const firstLetter = name.charAt(0).toUpperCase()
            setInitial(firstLetter)

            // Выбрать цвет на основе ID
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
            const color = colors[telegramUser.id % colors.length]
            setBackgroundColor(color)

            console.log('   ✅ User loaded:')
            console.log('   - ID:', telegramUser.id)
            console.log('   - Name:', name)
            console.log('   - Initial:', firstLetter)
            console.log('   - Color:', color)
        } else {
            console.log('   ❌ No user found')
        }
    }, [])




    if (user.photo_url) {
        return (<div>
            <img src={user.photo_url} alt="Avatar" style={{ width: '100px', height: '100px', borderRadius: '50%' }} />
        </div>
        )
    }
    else {

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
}

/**
 * Компонент для маленькой аватарки (в навигации, etc)
 */
export function UserAvatarSmall({ size = 40 }: { size?: number }) {
    const [initial, setInitial] = useState<string>('U')
    const [backgroundColor, setBackgroundColor] = useState<string>('#4ECDC4')
    const [userId, setUserId] = useState<number | null>(null)

    useEffect(() => {
        const user = getTelegramUserInfo()

        console.log('🎨 UserAvatarSmall useEffect:')
        console.log('   User:', user)

        if (user) {
            setUserId(user.id)

            // Получить первую букву имени
            const name = user.first_name || user.username || 'U'
            const firstLetter = name.charAt(0).toUpperCase()
            setInitial(firstLetter)

            // Выбрать цвет на основе ID
            const colors = [
                '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A',
                '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E2',
            ]
            const color = colors[user.id % colors.length]
            setBackgroundColor(color)

            console.log('   ✅ User loaded: ID=' + user.id + ', Initial=' + firstLetter)
        } else {
            console.log('   ❌ No user found')
        }
    }, [])

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
            {initial}
        </div>
    )
}
