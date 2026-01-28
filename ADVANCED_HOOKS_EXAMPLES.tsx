import React from 'react';

// Пример: Компонент с лучше управлением состоянием пользователя
export function useGameState() {
  const [user, setUser] = React.useState({
    id: 1,
    username: 'Player',
    level: 12,
    experience: 6234,
    coins: 2540,
    rating: 2540,
    wins: 28,
    losses: 15,
  });

  const [inventory, setInventory] = React.useState<number[]>([]);

  const addCoins = (amount: number) => {
    setUser(prev => ({ ...prev, coins: prev.coins + amount }));
  };

  const spendCoins = (amount: number) => {
    if (user.coins >= amount) {
      setUser(prev => ({ ...prev, coins: prev.coins - amount }));
      return true;
    }
    return false;
  };

  const buyItem = (itemId: number, price: number) => {
    if (spendCoins(price)) {
      setInventory(prev => [...prev, itemId]);
      return true;
    }
    return false;
  };

  const addExperience = (amount: number) => {
    setUser(prev => {
      const newExp = prev.experience + amount;
      const nextLevelExp = 10000;
      
      if (newExp >= nextLevelExp) {
        return {
          ...prev,
          level: prev.level + 1,
          experience: newExp - nextLevelExp,
          rating: prev.rating + 100
        };
      }
      
      return { ...prev, experience: newExp };
    });
  };

  const recordMatch = (won: boolean) => {
    const ratingChange = won ? 50 : -25;
    setUser(prev => ({
      ...prev,
      wins: won ? prev.wins + 1 : prev.wins,
      losses: won ? prev.losses : prev.losses + 1,
      rating: prev.rating + ratingChange,
      coins: prev.coins + (won ? 100 : 10)
    }));
  };

  return {
    user,
    inventory,
    addCoins,
    spendCoins,
    buyItem,
    addExperience,
    recordMatch
  };
}

// Пример: Компонент с сохранением в LocalStorage
export function usePersistentGameState() {
  const [gameState, setGameState] = React.useState(() => {
    const saved = localStorage.getItem('gameState');
    return saved ? JSON.parse(saved) : {
      coins: 2540,
      level: 12,
      inventory: []
    };
  });

  React.useEffect(() => {
    localStorage.setItem('gameState', JSON.stringify(gameState));
  }, [gameState]);

  return [gameState, setGameState];
}

// Пример: API Hook для получения турниров
export function useTournaments() {
  const [tournaments, setTournaments] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    // Имитация API запроса
    setTimeout(() => {
      setTournaments([
        {
          id: 1,
          name: 'Быстрый поединок',
          participants: 12,
          maxParticipants: 32,
          entryFee: 50,
          prize: 500,
          status: 'ongoing'
        },
        {
          id: 2,
          name: 'Чемпионат дня',
          participants: 0,
          maxParticipants: 128,
          entryFee: 200,
          prize: 5000,
          status: 'upcoming'
        }
      ]);
      setLoading(false);
    }, 500);
  }, []);

  return { tournaments, loading, error };
}

// Пример: Hook для работы с API
export function useApi(url: string) {
  const [data, setData] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('API Error');
        const result = await response.json();
        setData(result);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url]);

  return { data, loading, error };
}

// Пример: Context для глобального состояния
interface GameContextType {
  user: any;
  coins: number;
  addCoins: (amount: number) => void;
  buyItem: (itemId: number, price: number) => boolean;
}

export const GameContext = React.createContext<GameContextType | undefined>(undefined);

export function GameProvider({ children }: { children: React.ReactNode }) {
  const gameState = useGameState();

  return (
    <GameContext.Provider value={{
      user: gameState.user,
      coins: gameState.user.coins,
      addCoins: gameState.addCoins,
      buyItem: gameState.buyItem
    }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = React.useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within GameProvider');
  }
  return context;
}

// Пример: Компонент со счетчиком
export function CoinsCounter() {
  const { coins, addCoins } = useGame();

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h2>💰 {coins}</h2>
      <button onClick={() => addCoins(100)}>+100 монет</button>
    </div>
  );
}

// Пример: Custom Hook для таймера
export function useTimer(initialSeconds: number) {
  const [seconds, setSeconds] = React.useState(initialSeconds);
  const [isActive, setIsActive] = React.useState(false);

  React.useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive && seconds > 0) {
      interval = setInterval(() => {
        setSeconds(prev => prev - 1);
      }, 1000);
    } else if (seconds === 0 && isActive) {
      setIsActive(false);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, seconds]);

  return {
    seconds,
    isActive,
    start: () => setIsActive(true),
    stop: () => setIsActive(false),
    reset: () => setSeconds(initialSeconds)
  };
}

// Пример: Hook для обработки сетевых ошибок
export function useAsyncOperation<T>(
  asyncFunction: () => Promise<T>,
  immediate = true
) {
  const [status, setStatus] = React.useState<'idle' | 'pending' | 'success' | 'error'>('idle');
  const [data, setData] = React.useState<T | null>(null);
  const [error, setError] = React.useState<Error | null>(null);

  const execute = React.useCallback(async () => {
    setStatus('pending');
    setData(null);
    setError(null);

    try {
      const response = await asyncFunction();
      setData(response);
      setStatus('success');
      return response;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
      setStatus('error');
      throw err;
    }
  }, [asyncFunction]);

  React.useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [execute, immediate]);

  return { execute, status, data, error };
}

// Пример использования всех hooks в компоненте
export function AdvancedGameComponent() {
  const gameState = useGameState();
  const tournaments = useTournaments().tournaments;
  const timer = useTimer(30);

  const handleJoinTournament = (fee: number) => {
    if (gameState.spendCoins(fee)) {
      gameState.addExperience(50);
      console.log('Joined tournament!');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Продвинутый компонент игры</h2>
      
      <div>
        <p>💰 Монеты: {gameState.user.coins}</p>
        <p>⭐ Уровень: {gameState.user.level}</p>
        <p>📊 Рейтинг: {gameState.user.rating}</p>
      </div>

      {timer.isActive && <p>⏱️ Время: {timer.seconds}сек</p>}
      <button onClick={timer.start}>Начать таймер</button>

      <div>
        <h3>Доступные турниры:</h3>
        {tournaments.map(tournament => (
          <button key={tournament.id} onClick={() => handleJoinTournament(tournament.entryFee)}>
            {tournament.name} ({tournament.entryFee} монет)
          </button>
        ))}
      </div>

      <button onClick={() => gameState.recordMatch(true)}>📈 Победил</button>
      <button onClick={() => gameState.recordMatch(false)}>📉 Проиграл</button>
    </div>
  );
}
