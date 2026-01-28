/**
 * ПРИМЕР: Компонент страницы магазина с реальным API
 * 
 * Демонстрирует:
 * - Загрузку товаров из API
 * - Отправку запроса на покупку
 * - Управление состоянием загрузки
 * - Обработку ошибок
 */

import { useState, useEffect } from 'react'
import { shopAPI } from '../services/api'
import { getTelegramUserInfo } from '../config/telegram'

interface ShopItem {
  id: number
  name: string
  description: string
  price: number
  emoji: string
  category: string
}

export function ShopPageWithAPI() {
  const user = getTelegramUserInfo()
  const userId = user?.id
  
  const [items, setItems] = useState<ShopItem[]>([])
  const [balance, setBalance] = useState(0)
  const [loading, setLoading] = useState(false)
  const [purchasing, setPurchasing] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  // Загрузить товары при монтировании компонента
  useEffect(() => {
    loadItems()
  }, [])

  const loadItems = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await shopAPI.getItems()
      setItems(data)
    } catch (err) {
      setError('Не удалось загрузить товары')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handlePurchase = async (item: ShopItem) => {
    if (!userId) {
      setError('❌ Требуется авторизация в Telegram')
      return
    }

    // Проверка баланса
    if (balance < item.price) {
      setError(`❌ Недостаточно монет! Нужно ${item.price}, у вас ${balance}`)
      return
    }

    setPurchasing(item.id)
    setError(null)
    setSuccess(null)

    try {
      await shopAPI.purchase(userId, item.id)
      
      // Обновить баланс (в реальности приходит от сервера)
      setBalance(prev => prev - item.price)
      setSuccess(`✅ Куплено: ${item.name}! +50 опыта`)
      
      // Очистить сообщение через 3 секунды
      setTimeout(() => setSuccess(null), 3000)
    } catch (err) {
      setError(`❌ Ошибка покупки: ${err instanceof Error ? err.message : 'Unknown error'}`)
    } finally {
      setPurchasing(null)
    }
  }

  return (
    <div className="shop-page">
      <h1>🛍️ Магазин</h1>

      {/* Баланс */}
      <div className="balance-section">
        <div className="balance-card">
          <div className="balance-icon">💰</div>
          <div className="balance-info">
            <div className="balance-label">Ваш баланс</div>
            <div className="balance-value">{balance} монет</div>
          </div>
        </div>
      </div>

      {/* Сообщения об ошибках */}
      {error && (
        <div style={{
          background: 'rgba(255, 107, 107, 0.2)',
          border: '1px solid #ff6b6b',
          color: '#ff6b6b',
          padding: '12px',
          borderRadius: '8px',
          marginBottom: '15px',
          fontSize: '14px'
        }}>
          {error}
        </div>
      )}

      {/* Успешные покупки */}
      {success && (
        <div style={{
          background: 'rgba(81, 207, 102, 0.2)',
          border: '1px solid #51cf66',
          color: '#51cf66',
          padding: '12px',
          borderRadius: '8px',
          marginBottom: '15px',
          fontSize: '14px'
        }}>
          {success}
        </div>
      )}

      {/* Загрузка */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#888' }}>
          ⏳ Загрузка товаров...
        </div>
      ) : (
        <>
          {/* Товары */}
          <div className="shop-items">
            {items.map(item => (
              <div key={item.id} className="shop-item-card">
                <div className="item-header">
                  <div className="item-icon">{item.emoji}</div>
                  <div className="item-type">{item.category}</div>
                </div>
                <div className="item-name">{item.name}</div>
                <div className="item-description">{item.description}</div>
                <div className="item-footer">
                  <div className="item-price">💰 {item.price}</div>
                </div>
                <button
                  onClick={() => handlePurchase(item)}
                  disabled={purchasing === item.id || balance < item.price}
                  className={`btn ${
                    balance < item.price 
                      ? 'btn-disabled' 
                      : 'btn-primary'
                  }`}
                  style={{ 
                    width: '100%',
                    marginTop: '10px',
                    cursor: purchasing === item.id ? 'wait' : 'pointer'
                  }}
                >
                  {purchasing === item.id ? '⏳ Покупка...' : 'Купить'}
                </button>
              </div>
            ))}
          </div>

          {/* Информация */}
          <div className="shop-info">
            <h3>💡 Информация</h3>
            <ul>
              <li>Товары загружаются с сервера в реальном времени</li>
              <li>Баланс обновляется после каждой покупки</li>
              <li>Все покупки сохраняются в базе данных</li>
              <li>Можно отменить покупку в течение 60 секунд</li>
            </ul>
          </div>
        </>
      )}
    </div>
  )
}

export default ShopPageWithAPI
