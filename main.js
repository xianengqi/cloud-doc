const { app, BrowserWindow, Menu, ipcMain } = require('electron')
const isDev = require('electron-is-dev')
const menuTemplate = require('./src/menuTemplate')
const AppWindow = require('./src/AppWindow')
const path = require('path')

let win, settingsWindow;
app.allowRendererProcessReuse = true
app.on('ready', () => {
  // win = new BrowserWindow({
  //   width: 1440,
  //   height: 768,
  //   webPreferences: {
  //     nodeIntegration: true,
  //   }
  // })
  const mainWindowConfig = {
    width: 1440,
    height: 768,
  }
  const urlLocation = isDev ? 'http://localhost:3000' : ''
  win = new AppWindow(mainWindowConfig, urlLocation)
  win.on('closed', () => {
    win = null
  })
  ipcMain.on('open-settings-window', () => {
    const settingsWindowConfig = {
      width: 500,
      height: 400,
      parent: win
    }
    const settingsFileLocation = `file://${path.join(__dirname, './settings/settings.html')}`
    settingsWindow = new AppWindow(settingsWindowConfig, settingsFileLocation)
    settingsWindow.on('closed', () => {
      settingsWindow = null
    })
  })
  // win.loadURL(urlLocation)
  const menu = Menu.buildFromTemplate(menuTemplate)
  Menu.setApplicationMenu(menu)
})