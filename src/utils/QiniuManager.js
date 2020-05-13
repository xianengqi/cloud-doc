const qiniu = require('qiniu')

class QiniuManager {
  // 构造函数
  constructor(accessKey, secretKey, bucket) {
    // `给mac加上this` 类实例上面的属性
    this.mac = new qiniu.auth.digest.Mac(accessKey, secretKey)
    this.bucket = bucket
    // 初始化
    this.config = new qiniu.conf.Config()
    // 空间对应的机房
    this.config.zone = qiniu.zone.Zone_z2

    this.bucketManager = new qiniu.rs.BucketManager(this.mac, this.config)
  }
  // 添加方法
  /** key => 是云空间的上传文件名称
   *  localFilePath => 是本地上传文件路径
    */
  uploadFile(key, localFilePath) {
    const options = {
      scope: this.bucket + ":" + key,
    };
    const putPolicy = new qiniu.rs.PutPolicy(options)
    const uploadToken = putPolicy.uploadToken(this.mac)
    const formUploader = new qiniu.form_up.FormUploader(this.config)
    const putExtra = new qiniu.form_up.PutExtra()
    // 文件上传
    return new Promise((resolve, reject) => {
      formUploader.putFile(uploadToken, key, localFilePath, putExtra, this._handleCallback(resolve, reject));
    })
  }
  // 删除文件
  deleteFile(key) {
    return new Promise((resolve, reject) => {
      this.bucketManager.delete(this.bucket, key, this._handleCallback(resolve, reject))
    })
  }
  // 高阶函数
  _handleCallback(resolve, reject) {
    return (respErr, respBody, respInfo ) => {
      if (respErr) {
        throw respErr;
      }
      if (respInfo.statusCode === 200) {
        resolve(respBody);
      } else {
        reject({
          statusCode: respInfo.statusCode,
          body: respBody
        })
      }
    }
  }
}

module.exports = QiniuManager