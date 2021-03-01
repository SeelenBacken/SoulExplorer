const electron = require('electron')
const app = electron.app
const BrowserWindow = electron.BrowserWindow
const ipcMain = electron.ipcMain;

const path = require('path')
const url = require('url')

let mainWindow

function createWindow () {
  mainWindow = new BrowserWindow({
    width: 1600,
    height: 1200,
    frame: false,
    webPreferences: {
      nodeIntegration: true
    }
  })

  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'dist/SoulExplorer/index.html'),
    protocol: 'file:',
    slashes: true
  }))

  mainWindow.webContents.openDevTools()

  mainWindow.on('closed', function () {
    mainWindow = null
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow()
  }
})

ipcMain.on('exit', (event, args) => {
  mainWindow.close();
})

ipcMain.on('minimize', (event, args) => {
  mainWindow.minimize();
})

ipcMain.on('maximize', (event, args) => {
  if (mainWindow.isMaximized()) {
    mainWindow.unmaximize();
  } else {
    mainWindow.maximize();
  }
})

ipcMain.on('openNewLibrary', (event, args) => {
  let folderPath = electron.dialog.showOpenDialogSync({
    properties: ['openDirectory']
  });
  event.sender.send('addSteamLibrary', {folderPath: folderPath, folderNumber: args});
})
