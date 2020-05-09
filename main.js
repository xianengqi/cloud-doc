const { app, BrowserWindow, Menu } = require('electron')
const isDev = require('electron-is-dev')
const menuTemplate = require('./src/menuTemplate')

let win;
app.allowRendererProcessReuse = true
app.on('ready', () => {
  win = new BrowserWindow({
    width: 1024,
    height: 680,
    webPreferences: {
      nodeIntegration: true,
    }
  })
  const urlLocation = isDev ? 'http://localhost:3000' : ''
  win.loadURL(urlLocation)
  
  const menu = Menu.buildFromTemplate(menuTemplate)
  Menu.setApplicationMenu(menu)
})