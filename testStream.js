const fs = require('fs')
// 压缩包`zlib`模块
const zlib = require('zlib')
// 创建数据源头 可读`流`
const src = fs.createReadStream('./test.js')
// 创建 可写`流`
const writeDesc = fs.createWriteStream('./test.gz')
src.pipe(zlib.createGzip()).pipe(writeDesc)