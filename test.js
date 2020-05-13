const QiniuManager = require('./src/utils/QiniuManager')

const accessKey = 'eLNoQqdXl1rtvHQKAASAwm9udcFfr3CKyGBanG_3';
const secretKey = 'NIZ91vsQ12lrGqfgYkxZZiJkGMeMIG8-cJBR6t6n';
const localFile = "/Users/xianengqi/Documents/test.md";
const key = 'test.md';

const manager = new QiniuManager(accessKey, secretKey, 'test-xia')
manager.uploadFile(key, localFile).then((data) => {
  console.log('上传成功 =>', data)
  return manager.deleteFile(key)
}).then((data) => {
  console.log('删除成功')
}).catch((err) => {
  console.error('错误了', err);
})
// manager.deleteFile(key)
// const publicBucketDomain = 'http://qa4cqse7o.bkt.clouddn.com/';
