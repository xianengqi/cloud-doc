const fs = require('fs').promises
const path = require('path')

const fileHelper = {
  readFile: (path) => {
    return fs.readFile(path, { encoding: 'utf8' })
  },
  writeFile: (path, content) => {
    return fs.writeFile(path, content, { encoding: 'utf8' })
  },
  renameFile: (path, newPath) => {
    return fs.rename(path, newPath)
  },
  deleteFile: (path) => {
    return fs.unlink(path)
  }
}

const testPath = path.join(__dirname, 'helper.js')
const testWritePath = path.join(__dirname, 'hello.md')
const renamePath = path.join(__dirname, 'rename.md')
// fileHelper.readFile(testPath).then((data) => {
//   console.log(data)
// })

// fileHelper.writeFile(testWritePath, '## Hello ').then(() => {
//   console.log('写入成功');
// })
// fileHelper.renameFile(testWritePath, renamePath).then(() => {
//   console.log('重命名成功');
// })
fileHelper.deleteFile(renamePath).then(() => {
  console.log(`${renamePath} 删除成功`);
})