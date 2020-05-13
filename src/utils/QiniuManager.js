const qiniu = require('qiniu')
const axios = require('axios')
const fs = require('fs')
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
  // 获取下载链接
  getBucketDomain() {
    const reqURL = `http://api.qiniu.com/v6/domain/list?tbl=${this.bucket}`
    // 生成token
    const digest = qiniu.util.generateAccessToken(this.mac, reqURL)
    // 封装城promise
    return new Promise((resolve, reject) => {
      qiniu.rpc.postWithoutForm(reqURL, digest, this._handleCallback(resolve, reject))
    })
  }
  // 下载
  generateDownloadLink(key) {
    // 为了防止重复发请求
    const domainPromise = this.publicBucketDomain ? Promise.resolve([this.publicBucketDomain]) : this.getBucketDomain()
    return domainPromise.then(data => {
      // 判断一下是不是数组Array
      if (Array.isArray(data) && data.length > 0) {
        // 写一个正则表达式，判断是否有http.
        const pattern = /^https?/
        this.publicBucketDomain = pattern.test(data[0]) ? data[0] : `http://${data[0]}`
        return this.bucketManager.publicDownloadUrl(this.publicBucketDomain, key)
      } else {
        throw Error('域名未找到, 请查看存储空间是否过期')
      }
    }) 
  }
  // 实现文件下载方法
  downloadFile(key, downLoadPath) {
    return this.generateDownloadLink(key).then(link => {
      const timeStamp = new Date().getTime()
      const url = `${link}?timeStamp=${timeStamp}`
      return axios({
        url,
        method: 'GET',
        responseType: 'stream',
        // 为了防止缓存，加个`headers`
        headers: {'Cache-Control': 'no-cache'}
      })
    }).then((response) => {
      // 创建 写入`流`
      const writer = fs.createWriteStream(downLoadPath)
      response.data.pipe(writer)
      return new Promise((resolve, reject) => {
        writer.on('finish', resolve) // 写入成功`finish`调用的方法
        writer.on('error', reject)   // 写入失败 `error`调用的方法
      })
    }).catch(err => {
      // 抓取`axios`的错误
      return Promise.reject({ err: err.response })
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