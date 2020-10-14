const {
  app,
  BrowserWindow,
  ipcMain
} = require('electron')

function createWindow() {
  // Create the browser window.
  const win = new BrowserWindow({
    width: 1280,
    height: 720,
    webPreferences: {
      nodeIntegration: true
    },
    frame: false
  });

  // and load the index.html of the app.
  win.loadFile('./index.html');
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
const Secret = require('./secret');
const bot = require('./clientBot');
const clientBot = new bot(Secret);

ipcMain.on("startAccepter", async function (event, arg) {
  await clientBot.AutoAccepter();
});

ipcMain.on("minimize", function (event, arg) {
  var window = BrowserWindow.getFocusedWindow();
  window.minimize();
});

ipcMain.on("maximize", function (event, arg) {
  var window = BrowserWindow.getFocusedWindow();
  window.isMaximized() ? window.unmaximize() : window.maximize();
});

ipcMain.on("close", function (event, arg) {
  var window = BrowserWindow.getFocusedWindow();
  window.close();
});