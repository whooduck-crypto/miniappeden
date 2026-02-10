import 'dotenv/config';
import pool from './db.js';

async function initializeDatabase() {
  try {
    console.log('🗄️ Инициализация базы данных...\n');

    // Удалить старые таблицы если существуют
    console.log('🗑️ Удаление старых таблиц...');
    await pool.query('DROP TABLE IF EXISTS user_achievements CASCADE');
    await pool.query('DROP TABLE IF EXISTS tournament_participants CASCADE');
    await pool.query('DROP TABLE IF EXISTS shop_items CASCADE');
    
    // Удалить constraint если он существует
    try {
      await pool.query('ALTER TABLE IF EXISTS tournaments DROP CONSTRAINT IF EXISTS tournaments_created_by_fkey');
    } catch (e) {
      // Ignore if constraint doesn't exist
    }
    
    await pool.query('DROP TABLE IF EXISTS tournaments CASCADE');
    await pool.query('DROP TABLE IF EXISTS users CASCADE');
    console.log('✅ Старые таблицы удалены\n');

    // Создание таблицы Users
    console.log('📝 Создание таблицы Users...');
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        telegram_id BIGINT PRIMARY KEY,
        username VARCHAR(255),
        first_name VARCHAR(255),
        balance INTEGER DEFAULT 1000,
        stars INTEGER DEFAULT 0,
        level INTEGER DEFAULT 1,
        experience INTEGER DEFAULT 0,
        wins INTEGER DEFAULT 0,
        losses INTEGER DEFAULT 0,
        game_id VARCHAR(255),
        server_id VARCHAR(255),
        owned_items TEXT[] DEFAULT '{}',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Таблица Users создана\n');

    // Создание таблицы Tournaments
    console.log('📝 Создание таблицы Tournaments...');
    await pool.query(`
      CREATE TABLE IF NOT EXISTS tournaments (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        start_date TIMESTAMP,
        end_date TIMESTAMP,
        max_participants INTEGER,
        current_participants INTEGER DEFAULT 0,
        entry_fee INTEGER DEFAULT 0,
        prize_pool INTEGER DEFAULT 0,
        status VARCHAR(50) DEFAULT 'pending',
        created_by BIGINT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Таблица Tournaments создана\n');

    // Создание таблицы Tournament Participants
    console.log('📝 Создание таблицы Tournament Participants...');
    await pool.query(`
      CREATE TABLE IF NOT EXISTS tournament_participants (
        id SERIAL PRIMARY KEY,
        tournament_id INTEGER REFERENCES tournaments(id) ON DELETE CASCADE,
        user_id BIGINT REFERENCES users(telegram_id),
        username VARCHAR(255),
        score INTEGER DEFAULT 0,
        role VARCHAR(50),
        joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(tournament_id, user_id)
      )
    `);
    console.log('✅ Таблица Tournament Participants создана\n');

    // Создание таблицы Shop Items
    console.log('📝 Создание таблицы Shop Items...');
    await pool.query(`
      CREATE TABLE IF NOT EXISTS shop_items (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        price INTEGER NOT NULL,
        category VARCHAR(50),
        emoji VARCHAR(10),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Таблица Shop Items создана\n');

    // Вставить стандартные товары
    console.log('📝 Добавление товаров в магазин...');
    await pool.query(`
      INSERT INTO shop_items (name, price, category, emoji) VALUES
      ('Golden Skin', 200, 'cosmetic', '✨'),
      ('Double Points', 150, 'powerup', '2️⃣'),
      ('VIP Badge', 300, 'badge', '👑')
      ON CONFLICT DO NOTHING
    `);
    console.log('✅ Товары добавлены\n');

    // Создание таблицы User Achievements
    console.log('📝 Создание таблицы User Achievements...');
    await pool.query(`
      CREATE TABLE IF NOT EXISTS user_achievements (
        id SERIAL PRIMARY KEY,
        user_id BIGINT REFERENCES users(telegram_id),
        achievement_id INTEGER,
        unlocked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, achievement_id)
      )
    `);
    console.log('✅ Таблица User Achievements создана\n');

    console.log('✨ База данных успешно инициализирована!\n');
    process.exit(0);
  } catch (err) {
    console.error('❌ Ошибка инициализации БД:', err);
    process.exit(1);
  }
}

initializeDatabase();
