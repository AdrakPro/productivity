const { contextBridge, ipcRenderer } = require("electron");

// Expose protected methods to the renderer process
contextBridge.exposeInMainWorld("api", {
  todos: {
    getAll: () => ipcRenderer.invoke("todos:getAll"),
    getByDate: (date) => ipcRenderer.invoke("todos:getByDate", date),
    getGlobal: () => ipcRenderer.invoke("todos:getGlobal"),
    getArchived: () => ipcRenderer.invoke("todos:getArchived"),
    create: (todo) => ipcRenderer.invoke("todos:create", todo),
    update: (id, updates) => ipcRenderer.invoke("todos:update", id, updates),
    delete: (id) => ipcRenderer.invoke("todos:delete", id),
    archive: (id) => ipcRenderer.invoke("todos:archive", id),
    archiveByDate: (date) => ipcRenderer.invoke("todos:archiveByDate", date),
  },

  subtasks: {
    create: (todoId, title) =>
      ipcRenderer.invoke("subtasks:create", todoId, title),
    update: (id, updates) => ipcRenderer.invoke("subtasks:update", id, updates),
    delete: (id) => ipcRenderer.invoke("subtasks:delete", id),
    reorder: (todoId, subtaskIds) =>
      ipcRenderer.invoke("subtasks:reorder", todoId, subtaskIds),
  },

  statistics: {
    get: () => ipcRenderer.invoke("statistics:get"),
    update: (data) => ipcRenderer.invoke("statistics:update", data),
  },

  streaks: {
    get: () => ipcRenderer.invoke("streaks:get"),
    getByDate: (date) => ipcRenderer.invoke("streaks:getByDate", date),
    recordCompletion: (date) =>
      ipcRenderer.invoke("streaks:recordCompletion", date),
  },

  files: {
    getTree: (rootPath) => ipcRenderer.invoke("files:getTree", rootPath),
    openFile: (filePath) => ipcRenderer.invoke("files:openFile", filePath),
    selectDirectory: () => ipcRenderer.invoke("files:selectDirectory"),
    getWorkingDirectory: () => ipcRenderer.invoke("files:getWorkingDirectory"),
    setWorkingDirectory: (dirPath) =>
      ipcRenderer.invoke("files:setWorkingDirectory", dirPath),
    createFile: (parentPath, fileName) =>
      ipcRenderer.invoke("files:createFile", parentPath, fileName),
    createFolder: (parentPath, folderName) =>
      ipcRenderer.invoke("files:createFolder", parentPath, folderName),
    rename: (oldPath, newName) =>
      ipcRenderer.invoke("files:rename", oldPath, newName),
    deleteItem: (itemPath) => ipcRenderer.invoke("files:deleteItem", itemPath),
    moveItem: (sourcePath, targetFolder) =>
      ipcRenderer.invoke("files:moveItem", sourcePath, targetFolder),
    copyItem: (sourcePath, targetFolder) =>
      ipcRenderer.invoke("files:copyItem", sourcePath, targetFolder),
  },

  app: {
    getAutoLaunch: () => ipcRenderer.invoke("app:getAutoLaunch"),
    setAutoLaunch: (enabled) =>
      ipcRenderer.invoke("app:setAutoLaunch", enabled),
    getVersion: () => ipcRenderer.invoke("app:getVersion"),
  },
});
