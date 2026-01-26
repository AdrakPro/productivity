const { ipcMain, app } = require("electron");

/**
 * Register app-related IPC handlers
 */
function registerAppHandlers(settingsRepo) {
  ipcMain.handle("app:getAutoLaunch", async () => {
    try {
      const settings = app.getLoginItemSettings();
      return settings.openAtLogin;
    } catch (error) {
      console.error("Error getting auto-launch status:", error);
      throw error;
    }
  });

  ipcMain.handle("app:setAutoLaunch", async (event, enabled) => {
    try {
      app.setLoginItemSettings({
        openAtLogin: enabled,
        openAsHidden: true,
      });

      settingsRepo.set("autoLaunch", enabled);
      return true;
    } catch (error) {
      console.error("Error setting auto-launch:", error);
      throw error;
    }
  });

  ipcMain.handle("app:getVersion", async () => {
    try {
      return app.getVersion();
    } catch (error) {
      console.error("Error getting app version:", error);
      throw error;
    }
  });
}

module.exports = {
  registerAppHandlers,
};
