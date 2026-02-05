/**
 * МИГРАЦИЯ: Добавление колонки role в таблицу tournament_participants
 * 
 * Запустить на Railway:
 * Подключиться к PostgreSQL консоли и выполнить эту команду:
 * 
 * ALTER TABLE tournament_participants ADD COLUMN IF NOT EXISTS role VARCHAR(50);
 * 
 * Или через Node.js скрипт:
 * node migrate-add-role.js
 */

import 'dotenv/config';
import pool from './db.js';

async function migrateDatabase() {
  try {
    console.log('🔄 Выполнение миграции: добавление колонки role...\n');

    // Проверяем, есть ли уже колонка role
    const checkColumn = await pool.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name='tournament_participants' AND column_name='role'
    `);

    if (checkColumn.rows.length > 0) {
      console.log('✅ Колонка role уже существует');
      return;
    }

    // Добавляем колонку role
    await pool.query(`
      ALTER TABLE tournament_participants 
      ADD COLUMN role VARCHAR(50)
    `);

    console.log('✅ Колонка role успешно добавлена в таблицу tournament_participants');

  } catch (err) {
    console.error('❌ Ошибка при миграции:', err);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

migrateDatabase();
