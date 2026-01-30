import { useState } from 'react';
import '../App.css';

export function ShopPage() {
  const [balance, setBalance] = useState(2540);
  const [ownedItems, setOwnedItems] = useState<number[]>([]);

  const shopItems = [
    {
      id: 1,
      name: 'Золотая корона',
      description: 'Престижный аватар',
      price: 500,
      type: 'cosmetic',
      icon: '👑',
    },
    {
      id: 2,
      name: 'Серебряный щит',
      description: 'Защита в бою',
      price: 300,
      type: 'cosmetic',
      icon: '🛡️',
    },
    {
      id: 3,
      name: 'Огненный меч',
      description: 'Увеличение урона на 20%',
      price: 400,
      type: 'powerup',
      icon: '⚔️',
    },
    {
      id: 4,
      name: 'Кристалл скорости',
      description: 'Увеличение скорости на 15%',
      price: 350,
      type: 'powerup',
      icon: '💎',
    },
    {
      id: 5,
      name: 'Значок чемпиона',
      description: 'Покажи, что ты лучший',
      price: 200,
      type: 'badge',
      icon: '🏅',
    },
    {
      id: 6,
      name: 'Редкая аура',
      description: 'Светящийся эффект вокруг персонажа',
      price: 750,
      type: 'cosmetic',
      icon: '✨',
    },
  ];

  const handlePurchase = (id: number, price: number) => {
    if (balance >= price && !ownedItems.includes(id)) {
      setBalance(balance - price);
      setOwnedItems([...ownedItems, id]);
    }
  };

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      cosmetic: '🎨 Косметика',
      powerup: '⚡ Усиление',
      badge: '🎖️ Значок',
    };
    return labels[type] || type;
  };

  return (
    <div className="page shop-page">
      <h1>🛍️ Магазин</h1>

      <div className="balance-section">
        <div className="balance-card">
          <span className="balance-icon">💰</span>
          <div className="balance-info">
            <span className="balance-label">Ваш баланс</span>
            <span className="balance-value">{balance} монет</span>
          </div>
        </div>
      </div>

      <div className="shop-filters">
        <button className="filter-btn active">Все товары</button>
        <button className="filter-btn">Косметика</button>
        <button className="filter-btn">Усиления</button>
        <button className="filter-btn">Значки</button>
      </div>

      <div className="shop-items">
        {shopItems.map((item) => {
          const isOwned = ownedItems.includes(item.id);
          const canAfford = balance >= item.price;

          return (
            <div key={item.id} className="shop-item-card">
              <div className="item-header">
                <span className="item-icon">{item.icon}</span>
                <span className="item-type">{getTypeLabel(item.type)}</span>
              </div>

              <h3 className="item-name">{item.name}</h3>
              <p className="item-description">{item.description}</p>

              <div className="item-footer">
                <span className="item-price">
                  {item.price} <strong>💰</strong>
                </span>

                {isOwned ? (
                  <button className="btn btn-owned" disabled>
                    ✅ Куплено
                  </button>
                ) : (
                  <button
                    className={`btn ${canAfford ? 'btn-primary' : 'btn-disabled'}`}
                    onClick={() => handlePurchase(item.id, item.price)}
                    disabled={!canAfford}
                  >
                    Купить
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="shop-info">
        <h3>💡 Советы</h3>
        <ul>
          <li>Зарабатывайте монеты, участвуя в турнирах</li>
          <li>Косметика улучшает внешний вид вашего персонажа</li>
          <li>Усиления дают преимущество в боях</li>
          <li>Значки показывают ваш статус другим игрокам</li>
        </ul>
      </div>
    </div>
  );
}
