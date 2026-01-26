/**
 * Settings Repository - handles app settings storage
 */
class SettingsRepository {
  constructor(db) {
    this.db = db;
    this.prepareStatements();
  }

  prepareStatements() {
    this.statements = {
      get: this.db.prepare(`
        SELECT value FROM settings WHERE key = ?
      `),

      set: this.db.prepare(`
        INSERT INTO settings (key, value)
        VALUES (@key, @value)
        ON CONFLICT(key) DO UPDATE SET value = @value
      `),

      delete: this.db.prepare(`
        DELETE FROM settings WHERE key = ?
      `),

      getAll: this.db.prepare(`
        SELECT * FROM settings
      `),
    };
  }

  get(key, defaultValue = null) {
    const result = this.statements.get.get(key);
    if (!result) return defaultValue;

    try {
      return JSON.parse(result.value);
    } catch {
      return result.value;
    }
  }

  set(key, value) {
    const stringValue = typeof value === 'string' ? value : JSON.stringify(value);
    this.statements.set.run({ key, value: stringValue });
  }

  delete(key) {
    this.statements.delete.run(key);
  }

  getAll() {
    const results = this.statements.getAll.all();
    const settings = {};

    for (const row of results) {
      try {
        settings[row.key] = JSON.parse(row.value);
      } catch {
        settings[row.key] = row.value;
      }
    }

    return settings;
  }
}

module.exports = {
  SettingsRepository,
};
