/**
 * Todo Repository - handles all todo-related database operations
 */
class TodoRepository {
  constructor(db) {
    this.db = db;
    this.prepareStatements();
  }

  prepareStatements() {
    this.statements = {
      getAll: this.db.prepare(`
        SELECT * FROM todos ORDER BY created_at DESC
      `),

      getById: this.db.prepare(`
        SELECT * FROM todos WHERE id = ?
      `),

      getByDate: this.db.prepare(`
        SELECT * FROM todos 
        WHERE due_date = ? AND is_global = 0 AND is_archived = 0
        ORDER BY created_at ASC
      `),

      getGlobal: this.db.prepare(`
        SELECT * FROM todos 
        WHERE is_global = 1 AND is_archived = 0
        ORDER BY created_at ASC
      `),

      getArchived: this.db.prepare(`
        SELECT * FROM todos 
        WHERE is_archived = 1
        ORDER BY completed_at DESC
      `),

      create: this.db.prepare(`
        INSERT INTO todos (title, description, due_date, is_global, created_at, updated_at)
        VALUES (@title, @description, @due_date, @is_global, datetime('now'), datetime('now'))
      `),

      update: this.db.prepare(`
        UPDATE todos 
        SET title = @title, 
            description = @description, 
            due_date = @due_date,
            is_global = @is_global,
            is_completed = @is_completed,
            completed_at = @completed_at,
            updated_at = datetime('now')
        WHERE id = @id
      `),

      delete: this.db.prepare(`
        DELETE FROM todos WHERE id = ?
      `),

      archive: this.db.prepare(`
        UPDATE todos 
        SET is_archived = 1, 
            is_completed = 1,
            completed_at = COALESCE(completed_at, datetime('now')),
            updated_at = datetime('now')
        WHERE id = ?
      `),

      archiveByDate: this.db.prepare(`
        UPDATE todos 
        SET is_archived = 1,
            completed_at = COALESCE(completed_at, datetime('now')),
            updated_at = datetime('now')
        WHERE due_date = ? AND is_global = 0 AND is_archived = 0
      `),

      markCompleted: this.db.prepare(`
        UPDATE todos 
        SET is_completed = 1,
            completed_at = datetime('now'),
            updated_at = datetime('now')
        WHERE id = ?
      `),

      markIncomplete: this.db.prepare(`
        UPDATE todos 
        SET is_completed = 0,
            completed_at = NULL,
            updated_at = datetime('now')
        WHERE id = ?
      `),
    };
  }

  getAll() {
    return this.statements.getAll.all();
  }

  getById(id) {
    return this.statements.getById.get(id);
  }

  getByDate(date) {
    return this.statements.getByDate.all(date);
  }

  getGlobal() {
    return this.statements.getGlobal.all();
  }

  getArchived() {
    return this.statements.getArchived.all();
  }

  create(todo) {
    const result = this.statements.create.run({
      title: todo.title,
      description: todo.description || null,
      due_date: todo.due_date || null,
      is_global: todo.is_global ? 1 : 0,
    });

    return this.getById(result.lastInsertRowid);
  }

  update(id, updates) {
    const existing = this.getById(id);
    if (!existing) {
      throw new Error(`Todo with id ${id} not found`);
    }

    this.statements.update.run({
      id,
      title: updates.title ?? existing.title,
      description: updates.description ?? existing.description,
      due_date: updates.due_date ?? existing.due_date,
      is_global: updates.is_global !== undefined ? (updates.is_global ? 1 : 0) : existing.is_global,
      is_completed: updates.is_completed !== undefined ? (updates.is_completed ? 1 : 0) : existing.is_completed,
      completed_at: updates.completed_at ?? existing.completed_at,
    });

    return this.getById(id);
  }

  delete(id) {
    const result = this.statements.delete.run(id);
    return result.changes > 0;
  }

  archive(id) {
    const result = this.statements.archive.run(id);
    return result.changes > 0 ? this.getById(id) : null;
  }

  archiveByDate(date) {
    const result = this.statements.archiveByDate.run(date);
    return result.changes;
  }

  markCompleted(id) {
    this.statements.markCompleted.run(id);
    return this.getById(id);
  }

  markIncomplete(id) {
    this.statements.markIncomplete.run(id);
    return this.getById(id);
  }
}

module.exports = {
  TodoRepository,
};
