import '../App.css';

export function RatingPage() {
  const leaderboard = [
    { rank: 1, name: 'Pro_Player', level: 25, points: 5420, avatar: '👑' },
    { rank: 2, name: 'TopGamer', level: 23, points: 5100, avatar: '🥈' },
    { rank: 3, name: 'Champion_X', level: 22, points: 4850, avatar: '🥉' },
    { rank: 4, name: 'Legend_13', level: 21, points: 4620, avatar: '⭐' },
    { rank: 5, name: 'Ace_Player', level: 20, points: 4350, avatar: '⭐' },
    { rank: 6, name: 'Swift_Ninja', level: 19, points: 4100, avatar: '⭐' },
    { rank: 7, name: 'Victory_God', level: 18, points: 3850, avatar: '⭐' },
    { rank: 8, name: 'King_Master', level: 17, points: 3620, avatar: '⭐' },
    { rank: 9, name: 'Shadow_Beast', level: 16, points: 3400, avatar: '⭐' },
    { rank: 10, name: 'Your_Player', level: 12, points: 2540, avatar: '🎮' },
  ];

  const getRankMedal = (rank: number) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return `#${rank}`;
  };

  const isCurrentUser = (name: string) => name === 'Your_Player';

  return (
    <div className="page rating-page">
      <h1>📈 Рейтинг</h1>

      <div className="rating-filters">
        <button className="filter-btn active">Глобальный</button>
        <button className="filter-btn">Друзья</button>
        <button className="filter-btn">Недельный</button>
      </div>

      <div className="leaderboard-container">
        {leaderboard.map((player) => (
          <div
            key={player.rank}
            className={`leaderboard-entry ${isCurrentUser(player.name) ? 'current-user' : ''}`}
          >
            <div className="rank-medal">{getRankMedal(player.rank)}</div>

            <div className="player-info">
              <div className="player-avatar">{player.avatar}</div>
              <div className="player-details">
                <span className="player-name">{player.name}</span>
                <span className="player-level">Уровень {player.level}</span>
              </div>
            </div>

            <div className="player-points">
              <span className="points-value">{player.points}</span>
              <span className="points-label">очков</span>
            </div>
          </div>
        ))}
      </div>

      <div className="your-position">
        <h3>Ваша позиция</h3>
        <div className="position-card">
          <div className="position-stat">
            <span className="position-label">Место:</span>
            <span className="position-value">10/1000</span>
          </div>
          <div className="position-stat">
            <span className="position-label">Очки:</span>
            <span className="position-value">2540</span>
          </div>
          <div className="position-stat">
            <span className="position-label">До топ-5:</span>
            <span className="position-value">1810 очков</span>
          </div>
        </div>
      </div>
    </div>
  );
}
