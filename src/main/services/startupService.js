const { app } = require("electron");

/**
 * Setup auto-launch on system startup
 */
function setupAutoLaunch(enabled = false) {
  app.setLoginItemSettings({
    openAtLogin: enabled,
    openAsHidden: true,
    path: app.getPath("exe"),
  });
}

/**
 * Check if auto-launch is enabled
 */
function isAutoLaunchEnabled() {
  const settings = app.getLoginItemSettings();
  return settings.openAtLogin;
}

module.exports = {
  setupAutoLaunch,
  isAutoLaunchEnabled,
};
