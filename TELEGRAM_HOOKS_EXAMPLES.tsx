// Пример использования Telegram WebApp API в React приложении

// 1. Инициализация Telegram WebApp в main.tsx
if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
  // Готовит веб-приложение к отображению
  window.Telegram.WebApp.ready();
  
  // Разворачивает приложение на весь экран
  window.Telegram.WebApp.expand();
  
  // Отключает кнопку "Назад" в Telegram
  window.Telegram.WebApp.disableVerticalSwipes();
}

// 2. Hook для получения информации о пользователе
export function useTelegramUser() {
  const [user, setUser] = React.useState(null);
  
  React.useEffect(() => {
    if (window.Telegram?.WebApp?.initDataUnsafe?.user) {
      setUser(window.Telegram.WebApp.initDataUnsafe.user);
    }
  }, []);
  
  return user;
}

// 3. Hook для работы с главной кнопкой
export function useTelegramMainButton(onClick: () => void, text: string = 'Отправить') {
  const mainButton = window.Telegram?.WebApp?.MainButton;
  
  React.useEffect(() => {
    if (mainButton) {
      mainButton.text = text;
      mainButton.show();
      mainButton.onClick(onClick);
      
      return () => {
        mainButton.offClick(onClick);
        mainButton.hide();
      };
    }
  }, [text, onClick]);
}

// 4. Hook для работы с back button
export function useTelegramBackButton(onClick: () => void) {
  const backButton = window.Telegram?.WebApp?.BackButton;
  
  React.useEffect(() => {
    if (backButton) {
      backButton.show();
      backButton.onClick(onClick);
      
      return () => {
        backButton.offClick(onClick);
        backButton.hide();
      };
    }
  }, [onClick]);
}

// 5. Функция для показа popup
export function showTelegramPopup(title: string, message: string) {
  window.Telegram?.WebApp?.showPopup?.({
    title,
    message,
    buttons: [{ id: 'close', type: 'cancel' }]
  });
}

// 6. Функция для копирования в буфер обмена
export function copyToClipboard(text: string) {
  window.Telegram?.WebApp?.HapticFeedback?.impactOccurred?.('medium');
  navigator.clipboard.writeText(text);
}

// 7. Функция для haptic feedback (вибрация)
export function triggerHaptic(type: 'light' | 'medium' | 'heavy' = 'medium') {
  window.Telegram?.WebApp?.HapticFeedback?.impactOccurred?.(type);
}

// 8. Функция для уведомления
export function notifyUser(type: 'notification' | 'warning' | 'error' = 'notification') {
  window.Telegram?.WebApp?.HapticFeedback?.notificationOccurred?.(type);
}

// 9. Пример компонента с интеграцией
import React from 'react';

export function TelegramIntegratedComponent() {
  const user = useTelegramUser();
  const [text, setText] = React.useState('');
  
  const handleMainButtonClick = () => {
    triggerHaptic('medium');
    showTelegramPopup('Успешно!', `Ваше сообщение: ${text}`);
  };
  
  useTelegramMainButton(handleMainButtonClick, 'Отправить');
  
  if (!user) {
    return <div>Загрузка данных пользователя...</div>;
  }
  
  return (
    <div>
      <h2>Привет, {user.first_name}!</h2>
      <textarea 
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Напишите сообщение..."
      />
    </div>
  );
}

// 10. Функция для закрытия приложения
export function closeTelegramApp() {
  window.Telegram?.WebApp?.close?.();
}

// 11. Функция для отправки данных back-end'у с верификацией
export async function sendDataToBackend(data: any) {
  const initData = window.Telegram?.WebApp?.initData;
  
  const response = await fetch('/api/save-user-data', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      initData,
      data
    })
  });
  
  return response.json();
}

// 12. Использование всех hooks в компоненте
export function FullTelegramExample() {
  const user = useTelegramUser();
  const [inputValue, setInputValue] = React.useState('');
  
  const handleMainClick = async () => {
    try {
      const result = await sendDataToBackend({
        message: inputValue,
        timestamp: Date.now()
      });
      
      if (result.success) {
        showTelegramPopup('✅ Успех', 'Данные сохранены!');
        notifyUser('notification');
      }
    } catch (error) {
      showTelegramPopup('❌ Ошибка', 'Не удалось сохранить данные');
      notifyUser('error');
    }
  };
  
  const handleBackClick = () => {
    closeTelegramApp();
  };
  
  useTelegramMainButton(handleMainClick, '📤 Отправить');
  useTelegramBackButton(handleBackClick);
  
  return (
    <div style={{ padding: '20px' }}>
      <h1>Telegram Mini App</h1>
      {user && <p>Пользователь: {user.username || user.first_name}</p>}
      
      <textarea
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="Введите текст"
        style={{
          width: '100%',
          height: '100px',
          padding: '10px',
          borderRadius: '8px',
          border: '1px solid #ccc'
        }}
      />
      
      <button
        onClick={copyToClipboard}
        style={{
          marginTop: '10px',
          padding: '10px 20px',
          backgroundColor: '#0088cc',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        📋 Копировать
      </button>
    </div>
  );
}
