import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
const { database } = require('../../databases/database')
const UserController = require('../../databases/Controllers/UserController')
const AuthController = require('../../databases/Controllers/AuthController')
const ClasseController = require('../../databases/Controllers/ClasseController')

// importation de tous les models
require('../../databases/Models/School')
require('../../databases/Models/Role')
require('../../databases/Models/Annee_Scolaire')
require('../../databases/Models/User')
require('../../databases/Models/Classes')
require('../../databases/Models/Eleve')

let mainWindow
function createWindow() {
  mainWindow = new BrowserWindow({
    minWidth: 900,
    minHeight: 670,
    show: false,
    icon: icon,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      contextIsolation: true,
      nodeIntegration: true
    }
  })

  mainWindow.on('ready-to-show', async () => {
    mainWindow.maximize()
    mainWindow.show()
    await database.sync({ force: false, alter: true })
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // IPC test
  ipcMain.on('ping', () => console.log('pong'))

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

UserController.userHandler(ipcMain)
AuthController.userHandler(ipcMain)
ClasseController.classHandler(ipcMain)
