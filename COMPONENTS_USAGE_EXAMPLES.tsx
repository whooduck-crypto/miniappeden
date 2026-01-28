// ===== ПРИМЕРЫ ИСПОЛЬЗОВАНИЯ КОМПОНЕНТОВ =====

// 1. Использование Navigation компонента
import { Navigation } from './components/Navigation';

function AppExample1() {
  const [page, setPage] = React.useState('home');

  return (
    <div>
      {page === 'home' && <HomePage />}
      {page === 'tournaments' && <TournamentsPage />}
      <Navigation currentPage={page} onNavigate={setPage} />
    </div>
  );
}

// 2. Добавление обработчика при клике на турнир
function TournamentCardExample() {
  const handleJoinTournament = (tournamentId: number, entryFee: number) => {
    console.log(`Присоединяюсь к турниру ${tournamentId} за ${entryFee} монет`);
    // Здесь будет логика присоединения к турниру
  };

  return (
    <button 
      className="btn btn-primary"
      onClick={() => handleJoinTournament(1, 50)}
    >
      Присоединиться
    </button>
  );
}

// 3. Использование ShopPage с функцией покупки
function ShopExample() {
  const [balance, setBalance] = React.useState(2540);

  const handlePurchase = (itemId: number, price: number) => {
    if (balance >= price) {
      setBalance(balance - price);
      console.log(`Товар ${itemId} куплен за ${price} монет`);
      // Здесь будет логика покупки
    } else {
      console.log('Недостаточно монет!');
    }
  };

  return (
    <button 
      onClick={() => handlePurchase(1, 500)}
      disabled={balance < 500}
    >
      Купить за {500} 💰
    </button>
  );
}

// 4. Получение информации о пользователе
function ProfileExample() {
  const user = {
    username: 'YourPlayer',
    level: 12,
    rating: 2540,
    coins: 2540,
    wins: 28,
    losses: 15,
  };

  const winRate = Math.round((user.wins / (user.wins + user.losses)) * 100);

  return (
    <div>
      <h2>Профиль {user.username}</h2>
      <p>Уровень: {user.level}</p>
      <p>Процент побед: {winRate}%</p>
    </div>
  );
}

// 5. Создание кастомного компонента статистики
function StatsComponent() {
  const stats = [
    { icon: '🏆', label: 'Побед', value: 28 },
    { icon: '❌', label: 'Поражений', value: 15 },
    { icon: '📊', label: 'Процент', value: '65%' },
    { icon: '💰', label: 'Монет', value: 2540 },
  ];

  return (
    <div className="stats-grid">
      {stats.map((stat, idx) => (
        <div key={idx} className="stat-box">
          <span className="stat-icon">{stat.icon}</span>
          <span className="stat-label">{stat.label}</span>
          <span className="stat-value">{stat.value}</span>
        </div>
      ))}
    </div>
  );
}

// 6. Фильтр списка турниров
function FilteredTournaments() {
  const allTournaments = [
    { id: 1, name: 'Быстрый', status: 'ongoing' },
    { id: 2, name: 'Часовой', status: 'ongoing' },
    { id: 3, name: 'Дневной', status: 'upcoming' },
  ];

  const [filter, setFilter] = React.useState('all');

  const filtered = filter === 'all' 
    ? allTournaments 
    : allTournaments.filter(t => t.status === filter);

  return (
    <div>
      <button onClick={() => setFilter('all')}>Все</button>
      <button onClick={() => setFilter('ongoing')}>Активные</button>
      <button onClick={() => setFilter('upcoming')}>Предстоящие</button>

      {filtered.map(t => (
        <div key={t.id}>{t.name}</div>
      ))}
    </div>
  );
}

// 7. Модальное окно подтверждения покупки
function ConfirmPurchaseModal({ itemName, price, onConfirm, onCancel }: any) {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.7)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <div style={{
        background: '#1a1a2e',
        padding: '30px',
        borderRadius: '15px',
        textAlign: 'center',
        color: 'white',
      }}>
        <h2>Подтверждение покупки</h2>
        <p>Вы уверены, что хотите купить <strong>{itemName}</strong> за <strong>{price} 💰</strong>?</p>
        <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
          <button className="btn btn-primary" onClick={onConfirm}>Купить</button>
          <button className="btn btn-secondary" onClick={onCancel}>Отмена</button>
        </div>
      </div>
    </div>
  );
}

// 8. Progressbar опыта
function ExperienceProgressBar() {
  const current = 6234;
  const max = 10000;
  const percentage = (current / max) * 100;

  return (
    <div>
      <div style={{
        height: '10px',
        background: '#333',
        borderRadius: '5px',
        overflow: 'hidden',
        marginBottom: '5px',
      }}>
        <div style={{
          height: '100%',
          width: `${percentage}%`,
          background: 'linear-gradient(90deg, #00d4ff, #0099cc)',
          transition: 'width 0.3s ease',
        }} />
      </div>
      <p>{current} / {max} EXP ({Math.round(percentage)}%)</p>
    </div>
  );
}

// 9. Таблица лидеров с сортировкой
function LeaderboardWithSort() {
  const [players, setPlayers] = React.useState([
    { id: 1, name: 'Player1', points: 5420 },
    { id: 2, name: 'Player2', points: 5100 },
    { id: 3, name: 'Player3', points: 4850 },
  ]);

  const [sortBy, setSortBy] = React.useState('points');

  const sorted = [...players].sort((a, b) => {
    if (sortBy === 'points') return b.points - a.points;
    return a.name.localeCompare(b.name);
  });

  return (
    <div>
      <button onClick={() => setSortBy('points')}>По очкам</button>
      <button onClick={() => setSortBy('name')}>По имени</button>

      {sorted.map((player, idx) => (
        <div key={player.id} style={{ padding: '10px' }}>
          #{idx + 1} {player.name} - {player.points} очков
        </div>
      ))}
    </div>
  );
}

// 10. Карточка достижения
function AchievementCard({ icon, name, unlocked }: any) {
  return (
    <div style={{
      width: '50px',
      height: '50px',
      background: unlocked ? '#00d4ff' : '#555',
      borderRadius: '10px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '24px',
      opacity: unlocked ? 1 : 0.4,
      position: 'relative',
      cursor: 'pointer',
      transition: 'all 0.2s',
    }}
    title={name}
    >
      {icon}
      {!unlocked && <div style={{ position: 'absolute', fontSize: '16px' }}>🔒</div>}
    </div>
  );
}

// 11. История поединков
function MatchHistory() {
  const matches = [
    { opponent: 'Pro_Player', result: 'win', date: 'сегодня' },
    { opponent: 'TopGamer', result: 'loss', date: 'вчера' },
  ];

  return (
    <div>
      {matches.map((match, idx) => (
        <div key={idx} style={{
          display: 'flex',
          justifyContent: 'space-between',
          padding: '10px',
          background: '#1a1a2e',
          margin: '5px 0',
          borderRadius: '8px',
          borderLeft: `3px solid ${match.result === 'win' ? '#51cf66' : '#ff6b6b'}`,
        }}>
          <div>
            <strong>vs {match.opponent}</strong>
            <p style={{ margin: '0', fontSize: '12px', opacity: 0.7 }}>{match.date}</p>
          </div>
          <span style={{ color: match.result === 'win' ? '#51cf66' : '#ff6b6b' }}>
            {match.result === 'win' ? '✅ Победа' : '❌ Поражение'}
          </span>
        </div>
      ))}
    </div>
  );
}

// 12. Уведомление с автоскрытием
function Toast({ message, type = 'info', duration = 3000 }: any) {
  const [visible, setVisible] = React.useState(true);

  React.useEffect(() => {
    const timer = setTimeout(() => setVisible(false), duration);
    return () => clearTimeout(timer);
  }, [duration]);

  if (!visible) return null;

  const bgColor = {
    info: '#00d4ff',
    success: '#51cf66',
    error: '#ff6b6b',
    warning: '#ffa94d',
  }[type] || '#00d4ff';

  return (
    <div style={{
      position: 'fixed',
      bottom: '100px',
      left: '50%',
      transform: 'translateX(-50%)',
      background: bgColor,
      color: '#000',
      padding: '15px 20px',
      borderRadius: '8px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
      zIndex: 1000,
      animation: 'slideUp 0.3s ease',
    }}>
      {message}
    </div>
  );
}

// 13. Toggle компонент
function ToggleSwitch({ checked, onChange }: any) {
  return (
    <div style={{
      width: '50px',
      height: '24px',
      background: checked ? '#00d4ff' : '#555',
      borderRadius: '12px',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      padding: '2px',
      transition: 'all 0.2s',
    }}
    onClick={() => onChange(!checked)}
    >
      <div style={{
        width: '20px',
        height: '20px',
        background: 'white',
        borderRadius: '50%',
        transform: checked ? 'translateX(26px)' : 'translateX(0)',
        transition: 'transform 0.2s',
      }} />
    </div>
  );
}

// 14. Сортируемая таблица
function SortableTable() {
  const [data, setData] = React.useState([
    { name: 'Player1', level: 12, rating: 2540 },
    { name: 'Player2', level: 15, rating: 3100 },
  ]);

  const [sort, setSort] = React.useState({ key: 'rating', asc: false });

  const sorted = [...data].sort((a, b) => {
    const aVal = a[sort.key as keyof typeof a];
    const bVal = b[sort.key as keyof typeof b];
    return sort.asc ? aVal - bVal : bVal - aVal;
  });

  return (
    <table>
      <thead>
        <tr>
          <th onClick={() => setSort({ key: 'name', asc: !sort.asc })}>Имя</th>
          <th onClick={() => setSort({ key: 'level', asc: !sort.asc })}>Уровень</th>
          <th onClick={() => setSort({ key: 'rating', asc: !sort.asc })}>Рейтинг</th>
        </tr>
      </thead>
      <tbody>
        {sorted.map(row => (
          <tr key={row.name}>
            <td>{row.name}</td>
            <td>{row.level}</td>
            <td>{row.rating}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

// 15. Форма для редактирования профиля
function ProfileEditForm({ onSave }: any) {
  const [profile, setProfile] = React.useState({
    username: 'Player',
    bio: 'Моя биография',
  });

  const handleChange = (e: any) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    onSave(profile);
    console.log('Профиль сохранен:', profile);
  };

  return (
    <div>
      <input
        type="text"
        name="username"
        value={profile.username}
        onChange={handleChange}
        placeholder="Имя"
      />
      <textarea
        name="bio"
        value={profile.bio}
        onChange={handleChange}
        placeholder="Биография"
      />
      <button className="btn btn-primary" onClick={handleSave}>Сохранить</button>
    </div>
  );
}
