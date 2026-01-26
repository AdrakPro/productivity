const Database = require('better-sqlite3');
const path = require('path');
const { app } = require('electron');
const fs = require('fs');

let db = null;

/**
 * Get the database file path
 */
function getDatabasePath() {
  const userDataPath = app.getPath('userData');

  // Ensure the directory exists
  if (!fs.existsSync(userDataPath)) {
    fs.mkdirSync(userDataPath, { recursive: true });
  }

  return path.join(userDataPath, 'todo-productivity.db');
}

/**
 * Initialize the database connection
 */
function initializeDatabase() {
  if (db) {
    return db;
  }

  const dbPath = getDatabasePath();
  console.log('Database path:', dbPath);

  try {
    db = new Database(dbPath, {
      verbose: process.env.NODE_ENV === 'development' ? console.log : null,
    });

    // Enable WAL mode for better performance
    db.pragma('journal_mode = WAL');

    // Enable foreign keys
    db.pragma('foreign_keys = ON');

    console.log('Database initialized successfully');
    return db;
  } catch (error) {
    console.error('Failed to initialize database:', error);
    throw error;
  }
}

/**
 * Get the database instance
 */
function getDatabase() {
  if (!db) {
    throw new Error('Database not initialized. Call initializeDatabase() first.');
  }
  return db;
}

/**
 * Close the database connection
 */
function closeDatabase() {
  if (db) {
    console.log('Closing database connection...');
    db.close();
    db = null;
  }
}

module.exports = {
  initializeDatabase,
  getDatabase,
  closeDatabase,
};
