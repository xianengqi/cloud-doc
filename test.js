const QiniuManager = require('./src/utils/QiniuManager')
const path = require('path')

const accessKey = 'eLNoQqdXl1rtvHQKAASAwm9udcFfr3CKyGBanG_3';
const secretKey = 'NIZ91vsQ12lrGqfgYkxZZiJkGMeMIG8-cJBR6t6n';
const localFile = "/Users/xianengqi/Documents/demo.md";
const key = 'demo.md';
const downLoadPath = path.join(__dirname, key)

const manager = new QiniuManager(accessKey, secretKey, 'test-xia')
// manager.uploadFile(key, localFile).then((data) => {
//   console.log('上传成功 =>', data)
//   return manager.deleteFile(key)
// }).then((data) => {
//   console.log('删除成功')
// }).catch((err) => {
//   console.error('错误了', err);
// })

// manager.generateDownloadLink(key).then(data => {
//   console.log(' data => ', data);
// })
// manager.deleteFile(key)
// const publicBucketDomain = 'http://qa4cqse7o.bkt.clouddn.com/';

manager.downloadFile(key, downLoadPath).then(() => {
  console.log('下载写入文件完毕');
}).catch(err => {
  console.error(err);
})