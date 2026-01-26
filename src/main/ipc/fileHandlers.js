const { ipcMain, shell, dialog } = require('electron');
const fs = require('fs');
const path = require('path');

/**
 * Register file-related IPC handlers
 */
function registerFileHandlers(settingsRepo) {

  ipcMain.handle('files:getTree', async (event, rootPath) => {
    try {
      if (!rootPath || !fs.existsSync(rootPath)) {
        return null;
      }

      return buildFileTree(rootPath);
    } catch (error) {
      console.error('Error getting file tree:', error);
      throw error;
    }
  });

  ipcMain.handle('files:openFile', async (event, filePath) => {
    try {
      const result = await shell.openPath(filePath);
      if (result) {
        throw new Error(result);
      }
      return true;
    } catch (error) {
      console.error('Error opening file:', error);
      throw error;
    }
  });

  ipcMain.handle('files:selectDirectory', async () => {
    try {
      const result = await dialog.showOpenDialog({
        properties: ['openDirectory'],
      });

      if (result.canceled || result.filePaths.length === 0) {
        return null;
      }

      const selectedPath = result.filePaths[0];
      settingsRepo.set('workingDirectory', selectedPath);

      return selectedPath;
    } catch (error) {
      console.error('Error selecting directory:', error);
      throw error;
    }
  });

  ipcMain.handle('files:getWorkingDirectory', async () => {
    try {
      return settingsRepo.get('workingDirectory', null);
    } catch (error) {
      console.error('Error getting working directory:', error);
      throw error;
    }
  });

  ipcMain.handle('files:setWorkingDirectory', async (event, dirPath) => {
    try {
      settingsRepo.set('workingDirectory', dirPath);
      return true;
    } catch (error) {
      console.error('Error setting working directory:', error);
      throw error;
    }
  });
}

/**
 * Build a file tree structure from a directory
 */
function buildFileTree(dirPath, depth = 0, maxDepth = 5) {
  if (depth > maxDepth) return null;

  const stats = fs.statSync(dirPath);
  const name = path.basename(dirPath);

  if (name.startsWith('.') || ['node_modules', 'dist', 'build', '__pycache__'].includes(name)) {
    return null;
  }

  const node = {
    name,
    path: dirPath,
    isDirectory: stats.isDirectory(),
  };

  if (stats.isDirectory()) {
    try {
      node.children = fs.readdirSync(dirPath)
        .map((child) => buildFileTree(path.join(dirPath, child), depth + 1, maxDepth))
        .filter(Boolean)
        .sort((a, b) => {
          if (a.isDirectory && !b.isDirectory) return -1;
          if (!a.isDirectory && b.isDirectory) return 1;
          return a.name.localeCompare(b.name);
        });
    } catch (error) {
      node.children = [];
    }
  }

  return node;
}

module.exports = {
  registerFileHandlers,
};
