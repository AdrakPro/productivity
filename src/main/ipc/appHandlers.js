const { ipcMain, app, BrowserWindow } = require("electron");
const path = require("path");
const fs = require("fs");
const os = require("os");

/**
 * Register app-related IPC handlers
 */
function registerAppHandlers(settingsRepo) {
  // Get auto-launch status
  ipcMain.handle("app:getAutoLaunch", async () => {
    try {
      if (process.platform === "linux") {
        return getLinuxAutoLaunch();
      } else {
        const settings = app.getLoginItemSettings();
        return settings.openAtLogin;
      }
    } catch (error) {
      console.error("Error getting auto-launch status:", error);
      return false;
    }
  });

  // Set auto-launch
  ipcMain.handle("app:setAutoLaunch", async (event, enabled) => {
    try {
      if (process.platform === "linux") {
        setLinuxAutoLaunch(enabled);
      } else {
        app.setLoginItemSettings({
          openAtLogin: enabled,
          openAsHidden: true,
        });
      }

      settingsRepo.set("autoLaunch", enabled);
      return true;
    } catch (error) {
      console.error("Error setting auto-launch:", error);
      throw error;
    }
  });

  // Get app version
  ipcMain.handle("app:getVersion", async () => {
    try {
      return app.getVersion();
    } catch (error) {
      console.error("Error getting app version:", error);
      throw error;
    }
  });

  // Minimize to tray
  ipcMain.handle("app:minimize", async () => {
    try {
      const window = BrowserWindow.getFocusedWindow();
      if (window) {
        window.hide();
      }
      return true;
    } catch (error) {
      console.error("Error minimizing app:", error);
      throw error;
    }
  });

  // Quit app
  ipcMain.handle("app:quit", async () => {
    try {
      app.isQuitting = true;
      app.quit();
      return true;
    } catch (error) {
      console.error("Error quitting app:", error);
      throw error;
    }
  });

  // Clear all data
  ipcMain.handle("app:clearAllData", async () => {
    try {
      const userDataPath = app.getPath("userData");

      // Close database connection first
      const { closeDatabase } = require("../database/connection.js");
      closeDatabase();

      // Delete database files
      const dbFiles = [
        "todo-productivity.db",
        "todo-productivity.db-wal",
        "todo-productivity.db-shm",
      ];

      for (const file of dbFiles) {
        const filePath = path.join(userDataPath, file);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
          console.log("Deleted:", filePath);
        }
      }

      // Optionally clear settings file if you have one
      const settingsFile = path.join(userDataPath, "settings.json");
      if (fs.existsSync(settingsFile)) {
        fs.unlinkSync(settingsFile);
      }

      return true;
    } catch (error) {
      console.error("Error clearing data:", error);
      throw error;
    }
  });

  // Get app paths (for debugging)
  ipcMain.handle("app:getPaths", async () => {
    return {
      userData: app.getPath("userData"),
      appData: app.getPath("appData"),
      exe: app.getPath("exe"),
      home: app.getPath("home"),
    };
  });
}

/**
 * Get Linux autostart desktop file path
 */
function getLinuxDesktopFilePath() {
  const homeDir = os.homedir();
  const autostartDir = path.join(homeDir, ".config", "autostart");
  return path.join(autostartDir, "todo-productivity.desktop");
}

/**
 * Check if auto-launch is enabled on Linux
 */
function getLinuxAutoLaunch() {
  const desktopFilePath = getLinuxDesktopFilePath();
  return fs.existsSync(desktopFilePath);
}

/**
 * Set auto-launch on Linux by creating/removing .desktop file
 */
function setLinuxAutoLaunch(enabled) {
  const homeDir = os.homedir();
  const autostartDir = path.join(homeDir, ".config", "autostart");
  const desktopFilePath = getLinuxDesktopFilePath();

  if (enabled) {
    // Create autostart directory if it doesn't exist
    if (!fs.existsSync(autostartDir)) {
      fs.mkdirSync(autostartDir, { recursive: true });
    }

    // Get the executable path
    let execPath;
    if (app.isPackaged) {
      // Production: use the installed app path
      execPath = app.getPath("exe");
    } else {
      // Development: use electron with the project path
      execPath = `electron ${path.join(process.cwd())}`;
    }

    // Create .desktop file content
    const desktopContent = `[Desktop Entry]
Type=Application
Name=Todo Productivity
Comment=Minimalistic todo productivity app
Exec=${execPath}
Icon=todo-productivity
Terminal=false
Categories=Office;ProjectManagement;
StartupNotify=false
X-GNOME-Autostart-enabled=true
`;

    fs.writeFileSync(desktopFilePath, desktopContent);
    console.log("Created autostart file:", desktopFilePath);
  } else {
    // Remove .desktop file if it exists
    if (fs.existsSync(desktopFilePath)) {
      fs.unlinkSync(desktopFilePath);
      console.log("Removed autostart file:", desktopFilePath);
    }
  }
}

module.exports = {
  registerAppHandlers,
};
