const electron = require('electron')
const app = electron.app
const BrowserWindow = electron.BrowserWindow
const ipcMain = electron.ipcMain;

const path = require('path')
const url = require('url')
const glob = require("glob");
const fs = require("fs");
const exec = require("child_process");

let mainWindow
let steamConfigPath = process.env.APPDATA + '/SoulExplorer/steamGames.config'

let getSteamGames = function (src, callback) {
  glob(src + '/steamapps/common/*', callback);
}

let checkGame = function (src, callback) {
  glob(src + '/*.exe', callback);
}

function createWindow () {

  initSave();

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

function initSave() {
  let dir = process.env.APPDATA + '/SoulExplorer';
  try {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
      console.log('Save Directory created')
    } else {
      console.log('Save Directory already exists')
    }
  } catch (err) {
    console.log(err);
  }
}

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

ipcMain.on('scanSteamLibraries', (event, args) => {
  let libs = args;
  let promises = [];
  for(let lib of libs) {
    promises.push(scanSteamLibrary(lib));
  }
  Promise.all(promises).then(
    function (value) {
      console.log('Scanned Steam Games');
      event.sender.send('scannedSteamLibraries', value);
    }
  );
})

ipcMain.on('saveSteamLibrary', (event, args) => {
  /*if(!fs.existsSync(steamConfigPath)) {
    fs.writeFileSync(steamConfigPath, [])
  }*/
  let libraries = JSON.stringify(args);
  fs.writeFileSync(steamConfigPath, libraries);
})

ipcMain.on('loadSteamLibraries', (event, args) => {
  if (fs.existsSync(steamConfigPath)) {
    let configFile = fs.readFileSync(steamConfigPath);
    let libraries = JSON.parse(configFile);
    event.sender.send('setSteamLibraries', libraries);
  }
})

function checkSteamGame(game) {
  return new Promise((res, rej) => {
    checkGame(game, (err, resp) => {
      if (err) {
        rej(err)
      } else {
        res(resp)
      }
    })
  })
}

function getAllSteamGames(library) {
  return new Promise((res, rej) => {
    getSteamGames(library.filePath, (err, resp) => {
      if (err) {
        rej(err)
      } else {
        res(resp);
      }
    })
  })
}

function scanSteamLibrary(library) {
  return new Promise((res, rej) => {
    library.games = [];
    getAllSteamGames(library).then(
      function (lib) {
        let formatPath = library.filePath[0].replace(/\\/g, '/');
        let promises = [];
        for (let game of lib) {
          promises.push(
            checkSteamGame(game).then(
              function (value) {
                let exes = [];
                let name = game.replace(formatPath + '/steamapps/common/', '');
                for (let exe of value) {
                  let exeName = exe.replace(formatPath + '/steamapps/common/' + name + '/', '');
                  exes.push({filePath: exe, label: exeName})
                }
                library.games.push({name: name, folderPath: game, exes: exes});
              }
            )
          )
        }
        Promise.all(promises).then(
          function (value) {
            library.scanned = true;
            res(library);
          }
        )

      }
    )
  })
}
