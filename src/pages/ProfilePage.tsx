import '../App.css';

export function ProfilePage() {
  const userStats = {
    username: 'YourPlayer',
    level: 12,
    experience: 6234,
    experienceToNextLevel: 10000,
    coins: 2540,
    rating: 2540,
    rank: 10,
    totalWins: 28,
    totalLosses: 15,
    winRate: 65,
  };

  const achievements = [
    { icon: '🥇', name: 'Первая победа', unlocked: true },
    { icon: '🔟', name: '10 побед', unlocked: true },
    { icon: '💯', name: '100 побед', unlocked: false },
    { icon: '💰', name: '1000 монет', unlocked: true },
    { icon: '⭐', name: 'Все турниры', unlocked: false },
    { icon: '🏆', name: 'Топ-100', unlocked: true },
  ];

  const recentMatches = [
    { opponent: 'Pro_Player', result: 'loss', date: 'сегодня' },
    { opponent: 'TopGamer', result: 'win', date: 'вчера' },
    { opponent: 'Legend_13', result: 'win', date: '2 дня назад' },
    { opponent: 'Champion_X', result: 'loss', date: '3 дня назад' },
  ];

  return (
    <div className="page profile-page">
      <h1>👤 Профиль</h1>

      <div className="profile-header">
        <div className="profile-avatar">🎮</div>
        <div className="profile-info">
          <h2>{userStats.username}</h2>
          <p className="profile-rank">Место #{userStats.rank} • Уровень {userStats.level}</p>
        </div>
      </div>

      <div className="progress-section">
        <h3>Опыт</h3>
        <div className="experience-bar">
          <div
            className="experience-fill"
            style={{ width: `${(userStats.experience / userStats.experienceToNextLevel) * 100}%` }}
          ></div>
        </div>
        <p className="experience-text">
          {userStats.experience} / {userStats.experienceToNextLevel} EXP
        </p>
      </div>

      <div className="stats-grid">
        <div className="stat-box">
          <span className="stat-icon">💰</span>
          <span className="stat-label">Монеты</span>
          <span className="stat-value">{userStats.coins}</span>
        </div>

        <div className="stat-box">
          <span className="stat-icon">📈</span>
          <span className="stat-label">Рейтинг</span>
          <span className="stat-value">{userStats.rating}</span>
        </div>

        <div className="stat-box">
          <span className="stat-icon">🏆</span>
          <span className="stat-label">Побед</span>
          <span className="stat-value">{userStats.totalWins}</span>
        </div>

        <div className="stat-box">
          <span className="stat-icon">❌</span>
          <span className="stat-label">Поражений</span>
          <span className="stat-value">{userStats.totalLosses}</span>
        </div>

        <div className="stat-box">
          <span className="stat-icon">📊</span>
          <span className="stat-label">Процент побед</span>
          <span className="stat-value">{userStats.winRate}%</span>
        </div>

        <div className="stat-box">
          <span className="stat-icon">⭐</span>
          <span className="stat-label">Уровень</span>
          <span className="stat-value">{userStats.level}</span>
        </div>
      </div>

      <div className="achievements-section">
        <h3>🎖️ Достижения</h3>
        <div className="achievements-grid">
          {achievements.map((achievement, index) => (
            <div
              key={index}
              className={`achievement ${achievement.unlocked ? 'unlocked' : 'locked'}`}
              title={achievement.name}
            >
              <span className="achievement-icon">{achievement.icon}</span>
              {!achievement.unlocked && <span className="lock-icon">🔒</span>}
            </div>
          ))}
        </div>
      </div>

      <div className="matches-section">
        <h3>⚔️ Последние поединки</h3>
        <div className="matches-list">
          {recentMatches.map((match, index) => (
            <div key={index} className={`match-item ${match.result}`}>
              <div className="match-info">
                <span className="opponent-name">vs {match.opponent}</span>
                <span className="match-date">{match.date}</span>
              </div>
              <span className={`match-result ${match.result}`}>
                {match.result === 'win' ? '✅ Победа' : '❌ Поражение'}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="profile-actions">
        <button className="btn btn-primary">⚙️ Настройки</button>
        <button className="btn btn-secondary">🚪 Выход</button>
      </div>
    </div>
  );
}
