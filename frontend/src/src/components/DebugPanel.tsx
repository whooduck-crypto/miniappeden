import { useEffect, useState } from 'react'
import { getTelegramUserInfo } from '../config/telegram'
import { getTelegramUserId, isAdmin, ADMIN_CONFIG } from '../config/admin'

export function DebugPanel() {
  const [info, setInfo] = useState<any>(null)
  const [showDebug, setShowDebug] = useState(false)

  useEffect(() => {
    const tg = (window as any).Telegram
    const userId = getTelegramUserId()
    const userInfo = getTelegramUserInfo()

    setInfo({
      telegramExists: !!tg,
      webAppExists: !!tg?.WebApp,
      userId: userId,
      isAdmin: isAdmin(userId),
      adminIds: ADMIN_CONFIG.ADMIN_IDS,
      userInfo: userInfo,
      hasInitData: !!tg?.WebApp?.initData,
      hasInitDataUnsafe: !!tg?.WebApp?.initDataUnsafe,
    })
  }, [])

  if (!info) return null

  return (
    <>
      {/* Кнопка для открытия DEBUG */}
      <button
        onClick={() => setShowDebug(!showDebug)}
        style={{
          position: 'fixed',
          top: '10px',
          right: '10px',
          zIndex: 10000,
          padding: '8px 12px',
          background: '#ff6b6b',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '12px',
        }}
      >
        🐛 DEBUG
      </button>

      {/* DEBUG Panel */}
      {showDebug && (
        <div
          style={{
            position: 'fixed',
            top: '50px',
            right: '10px',
            zIndex: 9999,
            background: '#1a1a2e',
            color: '#00ff00',
            padding: '16px',
            borderRadius: '8px',
            fontSize: '12px',
            maxWidth: '400px',
            maxHeight: '600px',
            overflow: 'auto',
            fontFamily: 'monospace',
            border: '2px solid #00ff00',
          }}
        >
          <div style={{ marginBottom: '8px', fontWeight: 'bold' }}>DEBUG INFO</div>

          <div style={{ marginBottom: '4px' }}>
            Telegram: {info.telegramExists ? '✅' : '❌'}
          </div>
          <div style={{ marginBottom: '4px' }}>
            WebApp: {info.webAppExists ? '✅' : '❌'}
          </div>
          <div style={{ marginBottom: '4px' }}>
            initData: {info.hasInitData ? '✅' : '❌'}
          </div>
          <div style={{ marginBottom: '4px' }}>
            initDataUnsafe: {info.hasInitDataUnsafe ? '✅' : '❌'}
          </div>

          <hr style={{ borderColor: '#00ff00', margin: '8px 0' }} />

          <div style={{ marginBottom: '4px' }}>
            <strong>User ID:</strong> {info.userId || 'не найден'}
          </div>
          <div style={{ marginBottom: '4px' }}>
            <strong>Is Admin:</strong> {info.isAdmin ? '✅ ДА' : '❌ НЕТ'}
          </div>
          <div style={{ marginBottom: '4px' }}>
            <strong>Admin IDs:</strong> {info.adminIds.join(', ') || 'пусто'}
          </div>

          <hr style={{ borderColor: '#00ff00', margin: '8px 0' }} />

          <div style={{ marginBottom: '4px', fontSize: '11px' }}>
            <strong>User Info:</strong>
            <pre style={{ margin: '4px 0', whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>
              {JSON.stringify(info.userInfo, null, 2)}
            </pre>
          </div>

          <button
            onClick={() => setShowDebug(false)}
            style={{
              width: '100%',
              padding: '8px',
              background: '#ff6b6b',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              marginTop: '8px',
            }}
          >
            Закрыть
          </button>
        </div>
      )}
    </>
  )
}
