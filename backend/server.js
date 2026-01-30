/**
 * ПРИМЕР: Backend сервер на Node.js + Express
 * 
 * УСТАНОВКА:
 * npm init -y
 * npm install express cors dotenv node-telegram-bot-api
 * 
 * ЗАПУСК:
 * node server.js
 */

import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import TelegramBot from 'node-telegram-bot-api';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: [
    'https://miniappeden.vercel.app',
    'http://localhost:3000',
    'http://localhost:5173'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Инициализация Telegram Bot
const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: false });

// ===== БАЗА ДАННЫХ (в реальном приложении используйте MongoDB/PostgreSQL) =====
const users = new Map();
const shopItems = [
  { id: 1, name: 'Golden Skin', price: 200, category: 'cosmetic', emoji: '✨' },
  { id: 2, name: 'Double Points', price: 150, category: 'powerup', emoji: '2️⃣' },
  { id: 3, name: 'VIP Badge', price: 300, category: 'badge', emoji: '👑' },
];

// ===== PERSISTENCE: TOURNAMENTS =====
const TOURNAMENTS_FILE = path.join(__dirname, 'data', 'tournaments.json');

// Убедимся, что папка data существует
if (!fs.existsSync(path.join(__dirname, 'data'))) {
  fs.mkdirSync(path.join(__dirname, 'data'), { recursive: true });
}

// Функция для загрузки турниров из файла
function loadTournaments() {
  try {
    if (fs.existsSync(TOURNAMENTS_FILE)) {
      const data = fs.readFileSync(TOURNAMENTS_FILE, 'utf-8');
      
      // Проверяем, что файл не пустой
      if (!data || data.trim() === '') {
        console.log('Tournaments file is empty, returning empty map');
        return new Map();
      }

      const tournamentsData = JSON.parse(data);
      
      // Проверяем, что это массив
      if (!Array.isArray(tournamentsData)) {
        console.log('Tournaments data is not an array, returning empty map');
        return new Map();
      }

      return new Map(tournamentsData.map(t => [t.id, t]));
    }
  } catch (err) {
    console.error('Error loading tournaments:', err.message);
  }
  return new Map();
}

// Функция для сохранения турниров в файл
function saveTournaments(tournamentsMap) {
  try {
    const data = Array.from(tournamentsMap.values());
    fs.writeFileSync(TOURNAMENTS_FILE, JSON.stringify(data, null, 2), 'utf-8');
    console.log('Tournaments saved to file');
  } catch (err) {
    console.error('Error saving tournaments:', err);
  }
}

// Хранилище турниров (загружаем из файла)
let tournaments = loadTournaments();
let tournamentIdCounter = Math.max(...Array.from(tournaments.keys()).map(k => k), 0) + 1;

// ===== ROUTES: USERS =====
app.post('/api/users', (req, res) => {
  const { telegramId, username, firstName } = req.body;
  
  if (users.has(telegramId)) {
    return res.json(users.get(telegramId));
  }

  const user = {
    telegramId,
    username,
    firstName,
    balance: 1000, // Начальный баланс
    stars: 0, // Добавляем поле звезд
    level: 1,
    experience: 0,
    wins: 0,
    losses: 0,
    createdAt: new Date(),
  };

  users.set(telegramId, user);
  res.json(user);
});

app.get('/api/users/:userId', (req, res) => {
  const user = users.get(parseInt(req.params.userId));
  
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  res.json(user);
});

app.put('/api/users/:userId', (req, res) => {
  const userId = parseInt(req.params.userId);
  const user = users.get(userId);
  
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  const updated = { ...user, ...req.body };
  users.set(userId, updated);
  res.json(updated);
});

// ===== ROUTES: STARS (Выдача звезд) =====

/**
 * Выдача звезд пользователям по юзернейму
 * POST /api/admin/distribute-stars
 * 
 * Body:
 * {
 *   "users": [
 *     { "username": "user1", "stars": 100 },
 *     { "username": "user2", "stars": 50 }
 *   ]
 * }
 */
app.post('/api/admin/distribute-stars', (req, res) => {
  try {
    const { users: usersToUpdate } = req.body;

    // Валидация
    if (!usersToUpdate || !Array.isArray(usersToUpdate) || usersToUpdate.length === 0) {
      return res.status(400).json({
        message: 'Передайте массив пользователей',
      });
    }

    // Проверяем каждого пользователя
    const validationErrors = [];
    for (let i = 0; i < usersToUpdate.length; i++) {
      const { username, stars } = usersToUpdate[i];

      if (!username || !username.trim()) {
        validationErrors.push(`Строка ${i + 1}: username не указан`);
      }

      if (!Number.isInteger(stars) || stars <= 0) {
        validationErrors.push(`Строка ${i + 1}: количество звезд должно быть числом > 0`);
      }
    }

    if (validationErrors.length > 0) {
      return res.status(400).json({
        message: validationErrors.join('; '),
      });
    }

    // Обновляем звезды каждому пользователю
    const results = [];
    let totalDistributed = 0;

    for (const { username, stars } of usersToUpdate) {
      try {
        // Ищем пользователя по username
        let foundUser = null;
        let foundUserId = null;

        // Ищем в Map users по username
        for (const [userId, user] of users.entries()) {
          if (user.username === username || user.username === `@${username}`) {
            foundUser = user;
            foundUserId = userId;
            break;
          }
        }

        if (!foundUser) {
          results.push({
            username,
            success: false,
            error: 'Пользователь не найден',
          });
          continue;
        }

        // Обновляем баланс звезд
        foundUser.stars = (foundUser.stars || 0) + stars;
        foundUser.updatedAt = new Date();
        users.set(foundUserId, foundUser);

        results.push({
          username,
          success: true,
          stars: foundUser.stars,
        });

        totalDistributed += stars;
      } catch (error) {
        results.push({
          username,
          success: false,
          error: error instanceof Error ? error.message : 'Неизвестная ошибка',
        });
      }
    }

    // Подсчитываем успешные операции
    const successCount = results.filter(r => r.success).length;
    const failCount = results.filter(r => !r.success).length;

    res.json({
      message: `Успешно обновлено: ${successCount} пользователей, ошибок: ${failCount}`,
      totalDistributed,
      results,
    });
  } catch (error) {
    console.error('Ошибка при выдаче звезд:', error);
    res.status(500).json({
      message: 'Внутренняя ошибка сервера',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

/**
 * Получить звезды пользователя
 * GET /api/users/:userId/stars
 */
app.get('/api/users/:userId/stars', (req, res) => {
  const user = users.get(parseInt(req.params.userId));
  
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  res.json({
    userId: user.telegramId,
    username: user.username,
    stars: user.stars || 0,
  });
});

/**
 * Добавить звезды пользователю (по ID)
 * POST /api/users/:userId/add-stars
 * 
 * Body:
 * { "stars": 50, "reason": "Achievement unlocked" }
 */
app.post('/api/users/:userId/add-stars', (req, res) => {
  const userId = parseInt(req.params.userId);
  const { stars, reason } = req.body;
  const user = users.get(userId);
  
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  if (!Number.isInteger(stars) || stars <= 0) {
    return res.status(400).json({ error: 'Stars must be a positive integer' });
  }

  user.stars = (user.stars || 0) + stars;
  user.updatedAt = new Date();
  users.set(userId, user);

  res.json({
    success: true,
    message: `Added ${stars} stars${reason ? ` (${reason})` : ''}`,
    newStars: user.stars,
  });
});

/**
 * Получить топ пользователей по звездам
 * GET /api/rating/stars-leaderboard?limit=10
 */
app.get('/api/rating/stars-leaderboard', (req, res) => {
  const limit = Math.min(parseInt(req.query.limit) || 100, 100);
  const leaderboard = Array.from(users.values())
    .sort((a, b) => (b.stars || 0) - (a.stars || 0))
    .slice(0, limit)
    .map((user, index) => ({
      ...user,
      position: index + 1,
    }));

  res.json(leaderboard);
});

// ===== ROUTES: SHOP =====
app.get('/api/shop/items', (req, res) => {
  res.json(shopItems);
});

app.post('/api/shop/purchase', (req, res) => {
  const { userId, itemId } = req.body;
  const user = users.get(userId);
  const item = shopItems.find(i => i.id === itemId);

  if (!user || !item) {
    return res.status(404).json({ error: 'User or item not found' });
  }

  if (user.balance < item.price) {
    return res.status(400).json({ error: 'Insufficient balance' });
  }

  user.balance -= item.price;
  users.set(userId, user);

  res.json({
    success: true,
    message: `Purchased ${item.name}`,
    newBalance: user.balance,
  });
});

app.get('/api/shop/user/:userId/items', (req, res) => {
  const userId = parseInt(req.params.userId);
  const user = users.get(userId);
  
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  res.json(user.ownedItems || []);
});

// ===== ROUTES: RATING =====
app.get('/api/rating/leaderboard', (req, res) => {
  const limit = Math.min(parseInt(req.query.limit) || 100, 100);
  const leaderboard = Array.from(users.values())
    .sort((a, b) => (b.wins - a.wins) || (a.losses - b.losses))
    .slice(0, limit);

  res.json(leaderboard);
});

app.get('/api/rating/user/:userId', (req, res) => {
  const userId = parseInt(req.params.userId);
  const user = users.get(userId);
  
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  const leaderboard = Array.from(users.values())
    .sort((a, b) => (b.wins - a.wins) || (a.losses - b.losses));
  
  const position = leaderboard.findIndex(u => u.telegramId === userId) + 1;

  res.json({
    user,
    position,
    totalPlayers: leaderboard.length,
  });
});

app.post('/api/rating/add-points', (req, res) => {
  const { userId, points, reason } = req.body;
  const user = users.get(userId);
  
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  user.balance += points;
  users.set(userId, user);

  res.json({
    success: true,
    message: `Added ${points} points (${reason})`,
    newBalance: user.balance,
  });
});

// ===== ROUTES: TOURNAMENTS =====
app.get('/api/tournaments', (req, res) => {
  try {
    const status = req.query.status;
    const allTournaments = Array.from(tournaments.values());
    
    if (status) {
      return res.json(allTournaments.filter(t => t.status === status));
    }
    
    res.json(allTournaments);
  } catch (err) {
    console.error('Error getting tournaments:', err);
    res.status(500).json({ error: 'Failed to get tournaments' });
  }
});

app.get('/api/tournaments/:tournamentId', (req, res) => {
  try {
    const tournament = tournaments.get(parseInt(req.params.tournamentId));
    
    if (!tournament) {
      return res.status(404).json({ error: 'Tournament not found' });
    }

    res.json(tournament);
  } catch (err) {
    console.error('Error getting tournament:', err);
    res.status(500).json({ error: 'Failed to get tournament' });
  }
});

app.post('/api/tournaments', (req, res) => {
  try {
    const { name, description, startDate, endDate, maxParticipants, entryFee, prizePool, createdBy } = req.body;
    
    if (!name || !createdBy) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const id = tournamentIdCounter++;
    const newTournament = {
      id,
      name,
      description: description || '',
      startDate,
      endDate,
      maxParticipants,
      currentParticipants: 0,
      entryFee: entryFee || 0,
      prizePool: prizePool || 0,
      status: 'pending',
      createdBy,
      createdAt: new Date().toISOString(),
      participants: [],
    };

    tournaments.set(id, newTournament);
    saveTournaments(tournaments);  // 💾 Сохраняем в файл
    res.json(newTournament);
  } catch (err) {
    console.error('Error creating tournament:', err);
    res.status(500).json({ error: 'Failed to create tournament' });
  }
});

app.put('/api/tournaments/:tournamentId', (req, res) => {
  try {
    const tournament = tournaments.get(parseInt(req.params.tournamentId));
    
    if (!tournament) {
      return res.status(404).json({ error: 'Tournament not found' });
    }

    const updated = { ...tournament, ...req.body };
    tournaments.set(tournament.id, updated);
    saveTournaments(tournaments);  // 💾 Сохраняем в файл
    res.json(updated);
  } catch (err) {
    console.error('Error updating tournament:', err);
    res.status(500).json({ error: 'Failed to update tournament' });
  }
});

app.delete('/api/tournaments/:tournamentId', (req, res) => {
  try {
    const id = parseInt(req.params.tournamentId);
    
    if (!tournaments.has(id)) {
      return res.status(404).json({ error: 'Tournament not found' });
    }

    tournaments.delete(id);
    saveTournaments(tournaments);  // 💾 Сохраняем в файл
    res.json({ success: true, message: 'Tournament deleted' });
  } catch (err) {
    console.error('Error deleting tournament:', err);
    res.status(500).json({ error: 'Failed to delete tournament' });
  }
});

app.post('/api/tournaments/join', (req, res) => {
  try {
    const { userId, tournamentId } = req.body;
    const tournament = tournaments.get(tournamentId);
    const user = users.get(userId);
    
    if (!tournament || !user) {
      return res.status(404).json({ error: 'Tournament or user not found' });
    }

    if (tournament.currentParticipants >= tournament.maxParticipants) {
      return res.status(400).json({ error: 'Tournament is full' });
    }

    if (user.balance < tournament.entryFee) {
      return res.status(400).json({ error: 'Insufficient balance' });
    }

    // Проверить, не участвует ли уже
    if (tournament.participants.find(p => p.userId === userId)) {
      return res.status(400).json({ error: 'Already joined' });
    }

    // Добавить участника
    tournament.participants.push({
      userId,
      username: user.username,
      joinedAt: new Date().toISOString(),
      score: 0,
    });

    tournament.currentParticipants += 1;
    user.balance -= tournament.entryFee;

    saveTournaments(tournaments);  // 💾 Сохраняем в файл

    res.json({
      success: true,
      message: 'Joined tournament',
      tournament,
    });
  } catch (err) {
    console.error('Error joining tournament:', err);
    res.status(500).json({ error: 'Failed to join tournament' });
  }
});

app.post('/api/tournaments/leave', (req, res) => {
  try {
    const { userId, tournamentId } = req.body;
    const tournament = tournaments.get(tournamentId);
    const user = users.get(userId);
    
    if (!tournament || !user) {
      return res.status(404).json({ error: 'Tournament or user not found' });
    }

    const index = tournament.participants.findIndex(p => p.userId === userId);
    if (index === -1) {
      return res.status(400).json({ error: 'Not a participant' });
    }

    tournament.participants.splice(index, 1);
    tournament.currentParticipants -= 1;

    saveTournaments(tournaments);  // 💾 Сохраняем в файл

    res.json({
      success: true,
      message: 'Left tournament',
    });
  } catch (err) {
    console.error('Error leaving tournament:', err);
    res.status(500).json({ error: 'Failed to leave tournament' });
  }
});

app.post('/api/tournaments/:tournamentId/finish', (req, res) => {
  try {
    const tournament = tournaments.get(parseInt(req.params.tournamentId));
    
    if (!tournament) {
      return res.status(404).json({ error: 'Tournament not found' });
    }

    if (tournament.status === 'finished') {
      return res.status(400).json({ error: 'Tournament already finished' });
    }

    tournament.status = 'finished';

    // Распределить призы (пример: 50% первому, 30% второму, 20% третьему)
    const sorted = [...tournament.participants].sort((a, b) => b.score - a.score);
    
    const prizes = [
      { position: 1, percentage: 0.5 },
      { position: 2, percentage: 0.3 },
      { position: 3, percentage: 0.2 },
    ];

    sorted.forEach((participant, index) => {
      const prize = prizes.find(p => p.position === index + 1);
      if (prize) {
        const prizeAmount = Math.floor(tournament.prizePool * prize.percentage);
        const user = users.get(participant.userId);
        if (user) {
          user.balance += prizeAmount;
        }
      }
    });

    saveTournaments(tournaments);  // 💾 Сохраняем в файл

    res.json({
      success: true,
      message: 'Tournament finished and prizes distributed',
      tournament,
    });
  } catch (err) {
    console.error('Error finishing tournament:', err);
    res.status(500).json({ error: 'Failed to finish tournament' });
  }
});

app.get('/api/tournaments/:tournamentId/results', (req, res) => {
  try {
    const tournament = tournaments.get(parseInt(req.params.tournamentId));
    
    if (!tournament) {
      return res.status(404).json({ error: 'Tournament not found' });
    }

    const results = tournament.participants
      .sort((a, b) => b.score - a.score)
      .map((p, index) => ({
        ...p,
        position: index + 1,
        prize: calculatePrize(tournament.prizePool, index),
      }));

    res.json(results);
  } catch (err) {
    console.error('Error getting tournament results:', err);
    res.status(500).json({ error: 'Failed to get tournament results' });
  }
});

function calculatePrize(prizePool, position) {
  const prizes = [0.5, 0.3, 0.2];
  if (position < prizes.length) {
    return Math.floor(prizePool * prizes[position]);
  }
  return 0;
}

app.get('/api/users/:userId/tournaments', (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    const userTournaments = Array.from(tournaments.values()).filter(t =>
      t.participants.some(p => p.userId === userId)
    );

    res.json(userTournaments);
  } catch (err) {
    console.error('Error getting user tournaments:', err);
    res.status(500).json({ error: 'Failed to get user tournaments' });
  }
});

// ===== ROUTES: ACHIEVEMENTS =====
app.get('/api/achievements', (req, res) => {
  res.json([
    { id: 1, name: 'First Win', emoji: '🏆', description: 'Win your first match' },
    { id: 2, name: 'Spender', emoji: '💰', description: 'Spend 1000 coins' },
    { id: 3, name: 'Pro Player', emoji: '👑', description: 'Win 100 matches' },
  ]);
});

app.get('/api/achievements/user/:userId', (req, res) => {
  const userId = parseInt(req.params.userId);
  res.json([
    { id: 1, unlocked: true, unlockedAt: new Date() },
  ]);
});

// ===== TELEGRAM BOT WEBHOOK =====
app.post(`/webhook/${process.env.TELEGRAM_BOT_TOKEN}`, (req, res) => {
  bot.processUpdate(req.body);
  res.sendStatus(200);
});

// ===== BOT HANDLERS =====
bot.onText(/\/start/, (msg) => {
  const userId = msg.from.id;
  const username = msg.from.username || 'User';
  
  // Создать или получить пользователя
  if (!users.has(userId)) {
    users.set(userId, {
      telegramId: userId,
      username,
      firstName: msg.from.first_name,
      balance: 1000,
      stars: 0,
      level: 1,
      experience: 0,
      wins: 0,
      losses: 0,
    });
  }

  bot.sendMessage(msg.chat.id, 
    `🎮 Добро пожаловать в Gaming Arena!\n\n` +
    `👤 Профиль: ${username}\n` +
    `💰 Баланс: 1000 монет\n` +
    `⭐ Звезды: 0\n\n` +
    `Открыть приложение: ${process.env.MINI_APP_URL}`
  );
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Запуск сервера
app.listen(PORT, () => {
  console.log(`\n🚀 Server is running on http://localhost:${PORT}`);
  console.log(`\n📝 API Documentation:`);
  console.log(`   GET    /api/users/:userId`);
  console.log(`   POST   /api/users`);
  console.log(`   GET    /api/shop/items`);
  console.log(`   POST   /api/shop/purchase`);
  console.log(`   GET    /api/rating/leaderboard`);
  console.log(`   GET    /api/tournaments`);
  console.log(`   POST   /api/admin/distribute-stars`);
  console.log(`   GET    /api/rating/stars-leaderboard`);
  console.log(`   GET    /health\n`);
});