const isElectron = () => {
  return typeof window !== "undefined" && window.api !== undefined;
};

const mockApi = {
  todos: {
    getAll: async () => [],
    getByDate: async () => [],
    getGlobal: async () => [],
    getArchived: async () => [],
    create: async (todo) => ({ id: Date.now(), ...todo, subtasks: [] }),
    update: async (id, updates) => ({ id, ...updates }),
    delete: async () => true,
    archive: async (id) => ({ id, is_archived: true }),
    archiveByDate: async () => 0,
  },
  subtasks: {
    create: async (todoId, title) => ({
      id: Date.now(),
      todo_id: todoId,
      title,
      is_completed: false,
    }),
    update: async (id, updates) => ({ id, ...updates }),
    delete: async () => true,
    reorder: async () => [],
  },
  statistics: {
    get: async () => ({
      total_completed: 0,
      current_streak: 0,
      longest_streak: 0,
    }),
    update: async (data) => data,
  },
  streaks: {
    get: async () => [],
    getByDate: async () => null,
    recordCompletion: async () => ({}),
  },
  files: {
    getTree: async () => null,
    openFile: async () => true,
    selectDirectory: async () => null,
    getWorkingDirectory: async () => null,
    setWorkingDirectory: async () => true,
  },
  app: {
    getAutoLaunch: async () => false,
    setAutoLaunch: async () => true,
    getVersion: async () => "1.0.0",
  },
};

export const api = isElectron() ? window.api : mockApi;

// Todo API
export const todosApi = {
  async getAll() {
    return api.todos.getAll();
  },

  async getByDate(date) {
    return api.todos.getByDate(date);
  },

  async getGlobal() {
    return api.todos.getGlobal();
  },

  async getArchived() {
    return api.todos.getArchived();
  },

  async create(todo) {
    return api.todos.create(todo);
  },

  async update(id, updates) {
    return api.todos.update(id, updates);
  },

  async delete(id) {
    return api.todos.delete(id);
  },

  async archive(id) {
    return api.todos.archive(id);
  },

  async archiveByDate(date) {
    return api.todos.archiveByDate(date);
  },
};

// Subtask API
export const subtasksApi = {
  async create(todoId, title) {
    return api.subtasks.create(todoId, title);
  },

  async update(id, updates) {
    return api.subtasks.update(id, updates);
  },

  async delete(id) {
    return api.subtasks.delete(id);
  },

  async reorder(todoId, subtaskIds) {
    return api.subtasks.reorder(todoId, subtaskIds);
  },
};

// Statistics API
export const statisticsApi = {
  async get() {
    return api.statistics.get();
  },

  async update(data) {
    return api.statistics.update(data);
  },
};

// Streaks API
export const streaksApi = {
  async get() {
    return api.streaks.get();
  },

  async getByDate(date) {
    return api.streaks.getByDate(date);
  },

  async recordCompletion(date) {
    return api.streaks.recordCompletion(date);
  },
};

// Files API
export const filesApi = {
  async getTree(rootPath) {
    return api.files.getTree(rootPath);
  },

  async openFile(filePath) {
    return api.files.openFile(filePath);
  },

  async openInFileManager(folderPath) {
    return api.files.openInFileManager(folderPath);
  },

  async showInFileManager(itemPath) {
    return api.files.showInFileManager(itemPath);
  },

  async selectDirectory() {
    return api.files.selectDirectory();
  },

  async getWorkingDirectory() {
    return api.files.getWorkingDirectory();
  },

  async setWorkingDirectory(dirPath) {
    return api.files.setWorkingDirectory(dirPath);
  },

  async createFile(parentPath, fileName) {
    return api.files.createFile(parentPath, fileName);
  },

  async createFolder(parentPath, folderName) {
    return api.files.createFolder(parentPath, folderName);
  },

  async rename(oldPath, newName) {
    return api.files.rename(oldPath, newName);
  },

  async deleteItem(itemPath) {
    return api.files.deleteItem(itemPath);
  },

  async moveItem(sourcePath, targetFolder) {
    return api.files.moveItem(sourcePath, targetFolder);
  },

  async copyItem(sourcePath, targetFolder) {
    return api.files.copyItem(sourcePath, targetFolder);
  },
};

// App API
export const appApi = {
  async getAutoLaunch() {
    return api.app.getAutoLaunch();
  },

  async setAutoLaunch(enabled) {
    return api.app.setAutoLaunch(enabled);
  },

  async getVersion() {
    return api.app.getVersion();
  },
};
