/**
 * Created by ebi on 2017/11/30.
 */
import platform from './platform'
class Statistics {
  constructor ({ authorization = '', uuid = '', city = '', pt = 'M' }) {
    this.authorization = authorization
    this.uuid = uuid
    this.platform = pt
    this.device = `${window.screen.width}*${window.screen.height}`
    this.city = city
    this.os = platform.ios ? 'iOS' : platform.android ? 'Android' : ''
    this.osVersion = platform.osVersion
    this.browser = platform.app ? 'app' : 'browser'
  }
  _request ({ act = 'page', from = '', to = '', tag = '', value = '', name = '' }, timeout = 3000) {
    const params = {
      a: act, // 操作：1-访问页面，2-点击
      f: from, // 来源页面的url
      p: to, // 当前访问的页面url
      et: tag, // 事件类型，如：homeAD
      ei: value, // 事件唯一标识，如：20064857445
      en: name, // 事件名，如：首页广告20064857445点击
      u: this.uuid, // uuid
      os: this.os, // 系统：iOS/Android
      osv: this.osVersion, // 系统版本
      pt: this.platform, // 平台:M
      b: this.browser, // 浏览器：app/browser
      c: this.city, // 城市
      d: this.device, // 设备，M版为分辨率，如375*667
      t: this.authorization, // token
      v: Date.now() + Math.random()
    }
    let query = []
    for (let p in params) {
      query.push(p + '=' + params[p])
    }
    const url = `${window.tenant.mHost}/bigdata/api/statistic/img/v1`
    let img = document.createElement('img')
    img.src = `${url}?${query.join('&')}`
    return new Promise((resolve, reject) => {
      let timer = null
      timer = setTimeout(() => { // 如果超时图片还没加载，直接放弃
        resolve()
      }, timeout)
      img.onload = () => {
        img = null // 释放内存
        clearTimeout(timer)
        resolve()
      }
    })
  }
  pushPage (from = '', to = '') {
    this._request({ act: 1, from, to })
  }
  pushEvent ({ tag = '', value = '', name = '点击事件' }) {
    this._request({ act: 2, tag, value, name })
  }
  pushEventInTimer ({ tag = '', value = '', name = '点击事件' }) { // 限时200ms上传数据，用在点击还要跳转的地方
    return new Promise((resolve, reject) => {
      this._request({ act: 2, tag, value, name }, 200).then(() => {
        resolve()
      })
    })
  }
}
export default Statistics
