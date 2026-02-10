/**
 * Backend сервер на Node.js + Express + PostgreSQL
 * 
 * УСТАНОВКА:
 * npm install
 * 
 * ИНИЦИАЛИЗАЦИЯ БД:
 * node init-db.js
 * 
 * ЗАПУСК:
 * node server.js
 */

import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import TelegramBot from 'node-telegram-bot-api';
import pool from './db.js';

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

// ===== HELPER: Преобразование snake_case в camelCase =====
function transformTournament(row) {
  if (!row) return row;
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    startDate: row.start_date,
    endDate: row.end_date,
    maxParticipants: row.max_participants,
    currentParticipants: row.current_participants,
    entryFee: row.entry_fee,
    prizePool: row.prize_pool,
    status: row.status,
    createdBy: row.created_by,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

/**
 * Трансформирует участника турнира из snake_case в camelCase
 */
function transformParticipant(row) {
  if (!row) return row;
  return {
    id: row.id,
    tournamentId: row.tournament_id,
    userId: row.user_id,
    username: row.username,
    score: row.score,
    role: row.role,
    joinedAt: row.joined_at,
  };
}
// ===== MIGRATION ENDPOINT =====
app.post('/api/migrate/add-role-column', async (req, res) => {
  try {
    console.log('🔄 Running migration: Adding role column...');
    
    // Проверяем, есть ли уже колонка role
    const checkColumn = await pool.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name='tournament_participants' AND column_name='role'
    `);

    if (checkColumn.rows.length > 0) {
      console.log('✅ Column role already exists');
      return res.json({ message: 'Column role already exists', status: 'success' });
    }

    // Добавляем колонку role
    await pool.query(`
      ALTER TABLE tournament_participants 
      ADD COLUMN role VARCHAR(50)
    `);

    console.log('✅ Column role successfully added');
    res.json({ message: 'Column role successfully added', status: 'success' });
  } catch (err) {
    console.error('❌ Migration error:', err);
    res.status(500).json({ error: 'Migration failed', details: err.message });
  }
});

// ===== ROUTES: USERS =====

// Проверить, есть ли активные регистрации в турнирах
app.get('/api/users/:userId/active-tournaments', async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);

    // Получаем активные турниры, где пользователь зарегистрирован
    const result = await pool.query(
      `SELECT tp.*, t.name, t.status
       FROM tournament_participants tp
       JOIN tournaments t ON tp.tournament_id = t.id
       WHERE tp.user_id = $1 AND t.status IN ('pending', 'active')`,
      [userId]
    );

    res.json({
      hasActiveTournaments: result.rows.length > 0,
      count: result.rows.length,
      tournaments: result.rows.map(row => ({
        tournamentId: row.tournament_id,
        tournamentName: row.name,
        status: row.status,
        role: row.role,
      })),
    });
  } catch (err) {
    console.error('Error checking active tournaments:', err);
    res.status(500).json({ error: 'Failed to check active tournaments' });
  }
});

app.post('/api/users', async (req, res) => {
  try {
    const { telegramId, username, firstName } = req.body;
    
    // Проверяем, существует ли уже пользователь
    const existing = await pool.query('SELECT * FROM users WHERE telegram_id = $1', [telegramId]);
    
    if (existing.rows.length > 0) {
      return res.json(existing.rows[0]);
    }

    const result = await pool.query(
      `INSERT INTO users (telegram_id, username, first_name, balance, stars, level, experience, wins, losses)
       VALUES ($1, $2, $3, 1000, 0, 1, 0, 0, 0)
       RETURNING *`,
      [telegramId, username, firstName]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error creating user:', err);
    res.status(500).json({ error: 'Failed to create user' });
  }
});

app.get('/api/users/:userId', async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);

    const result = await pool.query('SELECT * FROM users WHERE telegram_id = $1', [userId]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error fetching user:', err);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

app.put('/api/users/:userId', async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    const { username, firstName, balance, stars, level, experience, wins, losses, gameId, serverId } = req.body;

    const result = await pool.query(
      `UPDATE users 
       SET username = COALESCE($2, username),
           first_name = COALESCE($3, first_name),
           balance = COALESCE($4, balance),
           stars = COALESCE($5, stars),
           level = COALESCE($6, level),
           experience = COALESCE($7, experience),
           wins = COALESCE($8, wins),
           losses = COALESCE($9, losses),
           game_id = COALESCE($10, game_id),
           server_id = COALESCE($11, server_id),
           updated_at = CURRENT_TIMESTAMP
       WHERE telegram_id = $1
       RETURNING *`,
      [userId, username, firstName, balance, stars, level, experience, wins, losses, gameId, serverId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error updating user:', err);
    res.status(500).json({ error: 'Failed to update user' });
  }
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
app.post('/api/admin/distribute-stars', async (req, res) => {
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
        const cleanUsername = username.startsWith('@') ? username : `@${username}`;
        const result = await pool.query(
          'SELECT * FROM users WHERE username = $1 OR username = $2',
          [username, cleanUsername]
        );

        if (result.rows.length === 0) {
          results.push({
            username,
            success: false,
            error: 'Пользователь не найден',
          });
          continue;
        }

        const user = result.rows[0];
        const newStars = (user.stars || 0) + stars;

        await pool.query(
          'UPDATE users SET stars = $1, updated_at = CURRENT_TIMESTAMP WHERE telegram_id = $2',
          [newStars, user.telegram_id]
        );

        results.push({
          username,
          success: true,
          stars: newStars,
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
app.get('/api/users/:userId/stars', async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    const result = await pool.query('SELECT telegram_id, username, stars FROM users WHERE telegram_id = $1', [userId]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = result.rows[0];
    res.json({
      userId: user.telegram_id,
      username: user.username,
      stars: user.stars || 0,
    });
  } catch (err) {
    console.error('Error fetching stars:', err);
    res.status(500).json({ error: 'Failed to fetch stars' });
  }
});

/**
 * Добавить звезды пользователю (по ID)
 * POST /api/users/:userId/add-stars
 * 
 * Body:
 * { "stars": 50, "reason": "Achievement unlocked" }
 */
app.post('/api/users/:userId/add-stars', async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    const { stars, reason } = req.body;

    if (!Number.isInteger(stars) || stars <= 0) {
      return res.status(400).json({ error: 'Stars must be a positive integer' });
    }

    const result = await pool.query(
      'UPDATE users SET stars = stars + $1, updated_at = CURRENT_TIMESTAMP WHERE telegram_id = $2 RETURNING *',
      [stars, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      success: true,
      message: `Added ${stars} stars${reason ? ` (${reason})` : ''}`,
      newStars: result.rows[0].stars,
    });
  } catch (err) {
    console.error('Error adding stars:', err);
    res.status(500).json({ error: 'Failed to add stars' });
  }
});

/**
 * Получить топ пользователей по звездам
 * GET /api/rating/stars-leaderboard?limit=10
 */
app.get('/api/rating/stars-leaderboard', async (req, res) => {
  try {
    const limit = Math.min(parseInt(req.query.limit) || 100, 100);
    const result = await pool.query(
      'SELECT * FROM users ORDER BY stars DESC, telegram_id ASC LIMIT $1',
      [limit]
    );

    const leaderboard = result.rows.map((user, index) => ({
      ...user,
      position: index + 1,
    }));

    res.json(leaderboard);
  } catch (err) {
    console.error('Error getting stars leaderboard:', err);
    res.status(500).json({ error: 'Failed to get leaderboard' });
  }
});

/**
 * Увеличить монеты пользователю (по ID)
 * POST /api/users/:userId/add-balance
 * 
 * Body:
 * { "amount": 500, "reason": "Tournament prize" }
 */
app.post('/api/users/:userId/add-balance', async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    const { amount, reason } = req.body;

    if (!Number.isInteger(amount) || amount <= 0) {
      return res.status(400).json({ error: 'Amount must be a positive integer' });
    }

    const result = await pool.query(
      'UPDATE users SET balance = balance + $1, updated_at = CURRENT_TIMESTAMP WHERE telegram_id = $2 RETURNING *',
      [amount, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      success: true,
      message: `Added ${amount} coins${reason ? ` (${reason})` : ''}`,
      newBalance: result.rows[0].balance,
    });
  } catch (err) {
    console.error('Error adding balance:', err);
    res.status(500).json({ error: 'Failed to add balance' });
  }
});

/**
 * Уменьшить монеты пользователя (по ID)
 * POST /api/users/:userId/deduct-balance
 * 
 * Body:
 * { "amount": 100, "reason": "Tournament entry" }
 */
app.post('/api/users/:userId/deduct-balance', async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    const { amount, reason } = req.body;

    if (!Number.isInteger(amount) || amount <= 0) {
      return res.status(400).json({ error: 'Amount must be a positive integer' });
    }

    const result = await pool.query(
      'SELECT balance FROM users WHERE telegram_id = $1',
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (result.rows[0].balance < amount) {
      return res.status(400).json({ error: 'Insufficient balance' });
    }

    const updateResult = await pool.query(
      'UPDATE users SET balance = balance - $1, updated_at = CURRENT_TIMESTAMP WHERE telegram_id = $2 RETURNING *',
      [amount, userId]
    );

    res.json({
      success: true,
      message: `Deducted ${amount} coins${reason ? ` (${reason})` : ''}`,
      newBalance: updateResult.rows[0].balance,
    });
  } catch (err) {
    console.error('Error deducting balance:', err);
    res.status(500).json({ error: 'Failed to deduct balance' });
  }
});

/**
 * Получить лидерборд по монетам
 * GET /api/rating/coins-leaderboard?limit=10
 */
app.get('/api/rating/coins-leaderboard', async (req, res) => {
  try {
    const limit = Math.min(parseInt(req.query.limit) || 100, 100);
    const result = await pool.query(
      'SELECT * FROM users ORDER BY balance DESC, telegram_id ASC LIMIT $1',
      [limit]
    );

    const leaderboard = result.rows.map((user, index) => ({
      ...user,
      position: index + 1,
    }));

    res.json(leaderboard);
  } catch (err) {
    console.error('Error getting coins leaderboard:', err);
    res.status(500).json({ error: 'Failed to get leaderboard' });
  }
});

// ===== ROUTES: SHOP =====
app.get('/api/shop/items', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM shop_items ORDER BY id');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching shop items:', err);
    res.status(500).json({ error: 'Failed to fetch shop items' });
  }
});

app.post('/api/shop/purchase', async (req, res) => {
  try {
    const { userId, itemId } = req.body;

    // Получить товар
    const itemResult = await pool.query('SELECT * FROM shop_items WHERE id = $1', [itemId]);
    if (itemResult.rows.length === 0) {
      return res.status(404).json({ error: 'Item not found' });
    }

    const item = itemResult.rows[0];

    // Получить пользователя
    const userResult = await pool.query('SELECT * FROM users WHERE telegram_id = $1', [userId]);
    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = userResult.rows[0];

    if (user.balance < item.price) {
      return res.status(400).json({ error: 'Insufficient balance' });
    }

    // Обновить баланс пользователя
    await pool.query(
      'UPDATE users SET balance = balance - $1, updated_at = CURRENT_TIMESTAMP WHERE telegram_id = $2',
      [item.price, userId]
    );

    res.json({
      success: true,
      message: `Purchased ${item.name}`,
      newBalance: user.balance - item.price,
    });
  } catch (err) {
    console.error('Error purchasing item:', err);
    res.status(500).json({ error: 'Failed to purchase item' });
  }
});

app.get('/api/shop/user/:userId/items', async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    const result = await pool.query('SELECT owned_items FROM users WHERE telegram_id = $1', [userId]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(result.rows[0].owned_items || []);
  } catch (err) {
    console.error('Error fetching user items:', err);
    res.status(500).json({ error: 'Failed to fetch user items' });
  }
});

// ===== ROUTES: RATING =====
app.get('/api/rating/leaderboard', async (req, res) => {
  try {
    const limit = Math.min(parseInt(req.query.limit) || 100, 100);
    const result = await pool.query(
      'SELECT * FROM users ORDER BY wins DESC, losses ASC, telegram_id ASC LIMIT $1',
      [limit]
    );

    const leaderboard = result.rows.map((user, index) => ({
      ...user,
      position: index + 1,
    }));

    res.json(leaderboard);
  } catch (err) {
    console.error('Error getting leaderboard:', err);
    res.status(500).json({ error: 'Failed to get leaderboard' });
  }
});

app.get('/api/rating/user/:userId', async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    
    const userResult = await pool.query('SELECT * FROM users WHERE telegram_id = $1', [userId]);
    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = userResult.rows[0];

    const leaderboardResult = await pool.query(
      'SELECT telegram_id FROM users ORDER BY wins DESC, losses ASC, telegram_id ASC'
    );

    const position = leaderboardResult.rows.findIndex(u => u.telegram_id === userId) + 1;

    res.json({
      user,
      position,
      totalPlayers: leaderboardResult.rows.length,
    });
  } catch (err) {
    console.error('Error getting user rating:', err);
    res.status(500).json({ error: 'Failed to get user rating' });
  }
});

app.post('/api/rating/add-points', async (req, res) => {
  try {
    const { userId, points, reason } = req.body;

    const result = await pool.query(
      'UPDATE users SET balance = balance + $1, updated_at = CURRENT_TIMESTAMP WHERE telegram_id = $2 RETURNING *',
      [points, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      success: true,
      message: `Added ${points} points (${reason})`,
      newBalance: result.rows[0].balance,
    });
  } catch (err) {
    console.error('Error adding points:', err);
    res.status(500).json({ error: 'Failed to add points' });
  }
});

// ===== ROUTES: TOURNAMENTS =====
app.get('/api/tournaments', async (req, res) => {
  try {
    const status = req.query.status;
    let query = 'SELECT * FROM tournaments';
    
    if (status) {
      query += ' WHERE status = $1';
      const result = await pool.query(query, [status]);
      return res.json(result.rows.map(transformTournament));
    }
    
    const result = await pool.query(query + ' ORDER BY created_at DESC');
    res.json(result.rows.map(transformTournament));
  } catch (err) {
    console.error('Error getting tournaments:', err);
    res.status(500).json({ error: 'Failed to get tournaments' });
  }
});

app.get('/api/tournaments/:tournamentId', async (req, res) => {
  try {
    const tournamentId = parseInt(req.params.tournamentId);
    const result = await pool.query('SELECT * FROM tournaments WHERE id = $1', [tournamentId]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Tournament not found' });
    }

    const tournament = transformTournament(result.rows[0]);

    // Получить участников
    const participantsResult = await pool.query(
      'SELECT * FROM tournament_participants WHERE tournament_id = $1 ORDER BY joined_at',
      [tournamentId]
    );

    tournament.participants = participantsResult.rows.map(transformParticipant);
    res.json(tournament);
  } catch (err) {
    console.error('Error getting tournament:', err);
    res.status(500).json({ error: 'Failed to get tournament' });
  }
});

app.post('/api/tournaments', async (req, res) => {
  try {
    const { name, description, startDate, endDate, maxParticipants, entryFee, prizePool, createdBy } = req.body;
    
    if (!name || !createdBy) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const result = await pool.query(
      `INSERT INTO tournaments (name, description, start_date, end_date, max_participants, entry_fee, prize_pool, status, created_by)
       VALUES ($1, $2, $3, $4, $5, $6, $7, 'pending', $8)
       RETURNING *`,
      [name, description || '', startDate, endDate, maxParticipants, entryFee || 0, prizePool || 0, createdBy]
    );

    res.json(transformTournament(result.rows[0]));
  } catch (err) {
    console.error('Error creating tournament:', err);
    res.status(500).json({ error: 'Failed to create tournament' });
  }
});

app.put('/api/tournaments/:tournamentId', async (req, res) => {
  try {
    const tournamentId = parseInt(req.params.tournamentId);
    const { name, description, startDate, endDate, maxParticipants, entryFee, prizePool, status } = req.body;

    const result = await pool.query(
      `UPDATE tournaments 
       SET name = COALESCE($2, name),
           description = COALESCE($3, description),
           start_date = COALESCE($4, start_date),
           end_date = COALESCE($5, end_date),
           max_participants = COALESCE($6, max_participants),
           entry_fee = COALESCE($7, entry_fee),
           prize_pool = COALESCE($8, prize_pool),
           status = COALESCE($9, status),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $1
       RETURNING *`,
      [tournamentId, name, description, startDate, endDate, maxParticipants, entryFee, prizePool, status]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Tournament not found' });
    }

    res.json(transformTournament(result.rows[0]));
  } catch (err) {
    console.error('Error updating tournament:', err);
    res.status(500).json({ error: 'Failed to update tournament' });
  }
});

app.delete('/api/tournaments/:tournamentId', async (req, res) => {
  try {
    const tournamentId = parseInt(req.params.tournamentId);
    
    const result = await pool.query('DELETE FROM tournaments WHERE id = $1 RETURNING id', [tournamentId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Tournament not found' });
    }

    res.json({ success: true, message: 'Tournament deleted' });
  } catch (err) {
    console.error('Error deleting tournament:', err);
    res.status(500).json({ error: 'Failed to delete tournament' });
  }
});

app.post('/api/tournaments/:tournamentId/join', async (req, res) => {
  try {
    const tournamentId = parseInt(req.params.tournamentId);
    const { userId, role, username } = req.body;

    console.log('🔗 Join Tournament Request:', { tournamentId, userId, role, username });

    // Получить турнир
    const tournamentResult = await pool.query('SELECT * FROM tournaments WHERE id = $1', [tournamentId]);
    if (tournamentResult.rows.length === 0) {
      return res.status(404).json({ error: 'Tournament not found' });
    }

    const tournament = tournamentResult.rows[0];

    // Получить пользователя или создать если не существует
    let userResult = await pool.query('SELECT * FROM users WHERE telegram_id = $1', [userId]);
    let user;

    if (userResult.rows.length === 0) {
      console.log('👤 User not found, creating new user:', userId);
      // Создаем пользователя если его нет
      const createUserResult = await pool.query(
        `INSERT INTO users (telegram_id, username, balance, stars, level, experience, wins, losses)
         VALUES ($1, $2, 1000, 0, 1, 0, 0, 0)
         RETURNING *`,
        [userId, username || `User${userId}`]
      );
      user = createUserResult.rows[0];
      console.log('✅ User created:', user.telegram_id);
    } else {
      user = userResult.rows[0];
      console.log('✅ User found:', user.telegram_id);
    }

    // Проверить ограничения
    if (tournament.current_participants >= tournament.max_participants) {
      return res.status(400).json({ error: 'Tournament is full' });
    }

    if (user.balance < tournament.entry_fee) {
      return res.status(400).json({ error: 'Insufficient balance' });
    }

    // Проверить наличие game_id и server_id
    if (!user.game_id || user.game_id.trim() === '') {
      return res.status(400).json({ 
        error: 'Missing game_id',
        message: 'Вы не указали game_id. Обновите ваш профиль в приложении.' 
      });
    }

    if (!user.server_id || user.server_id.trim() === '') {
      return res.status(400).json({ 
        error: 'Missing server_id',
        message: 'Вы не указали server_id. Обновите ваш профиль в приложении.' 
      });
    }

    // Проверить, не участвует ли уже
    const existingResult = await pool.query(
      'SELECT id FROM tournament_participants WHERE tournament_id = $1 AND user_id = $2',
      [tournamentId, userId]
    );

    if (existingResult.rows.length > 0) {
      return res.status(400).json({ error: 'Already joined' });
    }

    // Попытаемся добавить участника с ролью
    // Если колонка role не существует, попробуем добавить её
    try {
      await pool.query(
        `INSERT INTO tournament_participants (tournament_id, user_id, username, score, role)
         VALUES ($1, $2, $3, 0, $4)`,
        [tournamentId, userId, user.username, role || null]
      );
    } catch (insertError) {
      console.error('Insert error:', insertError.message);
      
      // Если ошибка связана с отсутствием колонки role, добавим её и попробуем ещё раз
      if (insertError.message.includes('column "role"')) {
        console.log('⚠️  Adding role column to tournament_participants table...');
        try {
          await pool.query('ALTER TABLE tournament_participants ADD COLUMN IF NOT EXISTS role VARCHAR(50)');
          
          // Попробуем вставить ещё раз
          await pool.query(
            `INSERT INTO tournament_participants (tournament_id, user_id, username, score, role)
             VALUES ($1, $2, $3, 0, $4)`,
            [tournamentId, userId, user.username, role || null]
          );
        } catch (altError) {
          console.error('Error adding role column:', altError);
          throw altError;
        }
      } else {
        throw insertError;
      }
    }

    // Обновить турнир
    await pool.query(
      'UPDATE tournaments SET current_participants = current_participants + 1, updated_at = CURRENT_TIMESTAMP WHERE id = $1',
      [tournamentId]
    );

    // Вычесть плату за участие
    await pool.query(
      'UPDATE users SET balance = balance - $1, updated_at = CURRENT_TIMESTAMP WHERE telegram_id = $2',
      [tournament.entry_fee, userId]
    );

    const updatedTournamentResult = await pool.query('SELECT * FROM tournaments WHERE id = $1', [tournamentId]);

    res.json({
      success: true,
      message: 'Joined tournament',
      tournament: transformTournament(updatedTournamentResult.rows[0]),
    });
  } catch (err) {
    console.error('❌ Error joining tournament:', err);
    console.error('Error details:', {
      message: err.message,
      code: err.code,
      detail: err.detail,
    });
    res.status(500).json({ 
      error: 'Failed to join tournament',
      details: err.message 
    });
  }
});

app.post('/api/tournaments/:tournamentId/leave', async (req, res) => {
  try {
    const tournamentId = parseInt(req.params.tournamentId);
    const { userId } = req.body;

    console.log('🚪 Leave Tournament Request:', { tournamentId, userId });

    // Получить турнир для узнания entry_fee
    const tournamentResult = await pool.query('SELECT * FROM tournaments WHERE id = $1', [tournamentId]);
    if (tournamentResult.rows.length === 0) {
      return res.status(404).json({ error: 'Tournament not found' });
    }

    const tournament = tournamentResult.rows[0];

    // Удалить участника
    const participantResult = await pool.query(
      'DELETE FROM tournament_participants WHERE tournament_id = $1 AND user_id = $2 RETURNING id',
      [tournamentId, userId]
    );

    if (participantResult.rows.length === 0) {
      return res.status(400).json({ error: 'Not a participant' });
    }

    console.log('✅ Participant removed');

    // Обновить турнир (уменьшить количество участников)
    await pool.query(
      'UPDATE tournaments SET current_participants = current_participants - 1, updated_at = CURRENT_TIMESTAMP WHERE id = $1',
      [tournamentId]
    );

    // Вернуть деньги пользователю (вернуть entry_fee)
    await pool.query(
      'UPDATE users SET balance = balance + $1, updated_at = CURRENT_TIMESTAMP WHERE telegram_id = $2',
      [tournament.entry_fee, userId]
    );

    console.log('💰 Refunded', tournament.entry_fee, 'coins to user', userId);

    res.json({
      success: true,
      message: 'Left tournament',
      refundedAmount: tournament.entry_fee,
    });
  } catch (err) {
    console.error('❌ Error leaving tournament:', err);
    res.status(500).json({ error: 'Failed to leave tournament' });
  }
});

app.post('/api/tournaments/:tournamentId/finish', async (req, res) => {
  try {
    const tournamentId = parseInt(req.params.tournamentId);

    const tournamentResult = await pool.query('SELECT * FROM tournaments WHERE id = $1', [tournamentId]);
    if (tournamentResult.rows.length === 0) {
      return res.status(404).json({ error: 'Tournament not found' });
    }

    const tournament = tournamentResult.rows[0];

    if (tournament.status === 'finished') {
      return res.status(400).json({ error: 'Tournament already finished' });
    }

    // Получить участников отсортированных по score
    const participantsResult = await pool.query(
      'SELECT * FROM tournament_participants WHERE tournament_id = $1 ORDER BY score DESC',
      [tournamentId]
    );

    const prizes = [
      { position: 0, percentage: 0.5 },
      { position: 1, percentage: 0.3 },
      { position: 2, percentage: 0.2 },
    ];

    // Распределить призы
    for (let index = 0; index < participantsResult.rows.length; index++) {
      const participant = participantsResult.rows[index];
      const prize = prizes.find(p => p.position === index);

      if (prize) {
        const prizeAmount = Math.floor(tournament.prize_pool * prize.percentage);
        await pool.query(
          'UPDATE users SET balance = balance + $1, updated_at = CURRENT_TIMESTAMP WHERE telegram_id = $2',
          [prizeAmount, participant.user_id]
        );
      }
    }

    // Обновить статус турнира
    const updatedResult = await pool.query(
      'UPDATE tournaments SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *',
      ['finished', tournamentId]
    );

    res.json({
      success: true,
      message: 'Tournament finished and prizes distributed',
      tournament: updatedResult.rows[0],
    });
  } catch (err) {
    console.error('Error finishing tournament:', err);
    res.status(500).json({ error: 'Failed to finish tournament' });
  }
});

app.get('/api/tournaments/:tournamentId/results', async (req, res) => {
  try {
    const tournamentId = parseInt(req.params.tournamentId);

    const tournamentResult = await pool.query('SELECT * FROM tournaments WHERE id = $1', [tournamentId]);
    if (tournamentResult.rows.length === 0) {
      return res.status(404).json({ error: 'Tournament not found' });
    }

    const tournament = tournamentResult.rows[0];

    const participantsResult = await pool.query(
      'SELECT * FROM tournament_participants WHERE tournament_id = $1 ORDER BY score DESC',
      [tournamentId]
    );

    const results = participantsResult.rows.map((p, index) => ({
      ...p,
      position: index + 1,
      prize: calculatePrize(tournament.prize_pool, index),
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

app.get('/api/users/:userId/tournaments', async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);

    const result = await pool.query(
      `SELECT DISTINCT t.* FROM tournaments t
       INNER JOIN tournament_participants tp ON t.id = tp.tournament_id
       WHERE tp.user_id = $1
       ORDER BY t.created_at DESC`,
      [userId]
    );

    res.json(result.rows.map(transformTournament));
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

app.get('/api/achievements/user/:userId', async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    const result = await pool.query(
      'SELECT * FROM user_achievements WHERE user_id = $1 ORDER BY unlocked_at DESC',
      [userId]
    );

    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching user achievements:', err);
    res.status(500).json({ error: 'Failed to fetch achievements' });
  }
});

// ===== TELEGRAM BOT WEBHOOK =====
app.post(`/webhook/${process.env.TELEGRAM_BOT_TOKEN}`, (req, res) => {
  bot.processUpdate(req.body);
  res.sendStatus(200);
});

// ===== BOT HANDLERS =====
bot.onText(/\/start/, async (msg) => {
  try {
    const userId = msg.from.id;
    const username = msg.from.username || 'User';
    
    // Создать или получить пользователя
    const existingResult = await pool.query('SELECT * FROM users WHERE telegram_id = $1', [userId]);
    
    if (existingResult.rows.length === 0) {
      await pool.query(
        'INSERT INTO users (telegram_id, username, first_name) VALUES ($1, $2, $3)',
        [userId, username, msg.from.first_name]
      );
    }

    bot.sendMessage(msg.chat.id, 
      `🎮 Добро пожаловать в Gaming Arena!\n\n` +
      `👤 Профиль: ${username}\n` +
      `💰 Баланс: 1000 монет\n` +
      `⭐ Звезды: 0\n\n` +
      `Открыть приложение: ${process.env.MINI_APP_URL}`
    );
  } catch (err) {
    console.error('Error in /start handler:', err);
  }
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
  console.log(`   POST   /api/migrate/add-role-column (Migration: Add role column)`);
  console.log(`   GET    /health\n`);
});