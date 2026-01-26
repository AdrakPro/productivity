const { ipcMain } = require("electron");

/**
 * Register statistics-related IPC handlers
 */
function registerStatisticsHandlers(statisticsRepo) {
  ipcMain.handle("statistics:get", async () => {
    try {
      return statisticsRepo.get();
    } catch (error) {
      console.error("Error getting statistics:", error);
      throw error;
    }
  });

  ipcMain.handle("statistics:update", async (event, data) => {
    try {
      return statisticsRepo.update(data);
    } catch (error) {
      console.error("Error updating statistics:", error);
      throw error;
    }
  });

  ipcMain.handle("streaks:get", async () => {
    try {
      return statisticsRepo.getAllStreaks();
    } catch (error) {
      console.error("Error getting streaks:", error);
      throw error;
    }
  });

  ipcMain.handle("streaks:getByDate", async (event, date) => {
    try {
      return statisticsRepo.getStreak(date);
    } catch (error) {
      console.error("Error getting streak by date:", error);
      throw error;
    }
  });

  ipcMain.handle("streaks:recordCompletion", async (event, date) => {
    try {
      return statisticsRepo.recordCompletion(date);
    } catch (error) {
      console.error("Error recording completion:", error);
      throw error;
    }
  });
}

module.exports = {
  registerStatisticsHandlers,
};
