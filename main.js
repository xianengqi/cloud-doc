const { app, BrowserWindow } = require('electron')
const isDev = require('electron-is-dev')

let win;

app.on('ready', () => {
  win = new BrowserWindow({
    width: 1024,
    height: 680,
    webPreferences: {
      nodeIntegration: true
    }
  })
  const urlLocation = isDev ? 'http://localhost:3000' : ''
  win.loadURL(urlLocation)
})