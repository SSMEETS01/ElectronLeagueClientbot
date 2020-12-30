const {
  app,
  BrowserWindow,
  ipcMain
} = require('electron');
const fetch = require('node-fetch');
const Secret = require('./secret');
const bot = require('./clientBot');
var User, accountId, puuId, userId, clientBot;

process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;

function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 720,
    webPreferences: {
      nodeIntegration: true
    },
    frame: false
  });

  win.loadFile('./index.html');
}

async function getLocalUser() {
  var response = await fetch(`${Secret.PROTOCOL}${Secret.HOST}:${Secret.PORT}/lol-chat/v1/me`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      Authorization: `Basic ${Secret.AUTH}`,
    }
  })
  User = await response.json();
}
async function getUserInfo() {
  var response = await fetch(`https://euw1.api.riotgames.com//lol/summoner/v4/summoners/by-name/${User.gameName}?api_key=${Secret.TOKEN})`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      Origin: 'https://developer.riotgames.com',
      'X-Riot-Token': Secret.TOKEN
    }
  })
  response = await response.json();
  userId = response.id;
  accountId = response.accountId;
  puuId = response.puuid
}
getLocalUser();
setTimeout(() => {
  getUserInfo();
  setTimeout(() => {
    clientBot = new bot(Secret, User.gameName, userId, accountId, puuId)
    app.whenReady().then(createWindow);
  }, 2000);
}, 5500);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
})


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