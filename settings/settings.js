const { remote } = require('electron')
const Store = require('electron-store')
const settingsStore = new Store({name: 'Settings'})
const $ = (id) => {
  return document.getElementById(id)
}

document.addEventListener('DOMContentLoaded', () => {
  let savedLocation = settingsStore.get('savedFileLocation')
  if (savedLocation) {
    $('savedFileLocation').value = savedLocation
  }
  $('select-new-location').addEventListener('click', () => {
    remote.dialog.showOpenDialog({
      properties: ['openDirectory'],
      message: '选择文件的存储路径',
    }).then(path => {
      if (Array.isArray(path.filePaths)) {
        $('savedFileLocation').value = path.filePaths[0]
        savedLocation = path.filePaths[0]
      }
    }).catch(err => {
      console.log(err)
    })
  })
  $('settings-form').addEventListener('submit', () => {
    settingsStore.set('savedFileLocation', savedLocation)
    remote.getCurrentWindow().close()
  })
})