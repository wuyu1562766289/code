/**
 * Created by ebi on 2017/6/19.
 */
import cookie from 'js-cookie'
import platform from './platform'
import cookieStorage from './cookieStorage'
const tenant = window.tenant

export function isMobile (num) { // 验证手机
  return /^1[3|4|5|6|7|8|9][0-9]\d{8}$/.test(num)
}

export function isChinaName (name) {
  return /^[\u4E00-\u9FA5]{2,4}$/.test(name)
}

export function isTelphone (num) { // 验证固话号码
  return /^([0-9]{3,4}-)?[0-9]{7,8}$/.test(num)
}

export function isEmail (email) { // 验证邮箱
  return /^([a-zA-Z0-9]+[_|_|-|\-|.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|_|.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/.test(email)
}

export function isNumber (num) { // 验证数字
  return /^[0-9]*$/.test(num)
}

export function cardId (val) { // 验证身份证号码
  return /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/.test(val)
}

export function htmlEncode (str) { // html编码
  let s = ''
  if (str.length === 0) return ''
  s = str.replace(/</g, '&lt;')
  s = s.replace(/>/g, '&gt;')
  // s = s.replace(/ /g, '&nbsp;')
  s = s.replace(/'/g, '&#39;')
  s = s.replace(/'/g, '&quot;')
  /* s = s.replace(/(&lt;)br(&gt;)/gi, () => {
    if (arguments.length > 1) {
      return '<br>'
    }
  }) */
  return s
}

export function htmlDecode (str) { // html解码
  let s = ''
  if (str.length === 0) return ''
  s = str.replace(/&amp;/g, '&')
  s = s.replace(/&lt;/g, '<')
  s = s.replace(/&gt;/g, '>')
  s = s.replace(/&nbsp;/g, ' ')
  s = s.replace(/&#39;/g, '\'')
  s = s.replace(/&quot;/g, '"')
  return s
}

export function isEmptyObject (target) {
  for (let key in target) {
    return false
  }
  return true
}

export function arrayUnique (array) {
  let newArr = array.filter(function (element, index, array) {
    return array.indexOf(element) === index
  })
  return newArr
}

export function getCurrentPosition (noCache) {
  return new Promise((resolve, reject) => {
    if (!noCache) {
      var lat
      var lng
      if (platform.wechat) {
        lat = cookieStorage.get('latitude')
        lng = cookieStorage.get('longitude')
      } else {
        lat = cookie.get('latitude')
        lng = cookie.get('longitude')
      }
      if (lat && lng) {
        resolve({ lat, lng })
        return
      }
    }

    if (platform.wechat) {
      const fn = () => {
        wx.getLocation({
          type: 'wgs84',
          success: function (res) {
            // console.log(res)
            // const domain = window.location.host.indexOf('9ji.com') > -1 ? '9ji.com' : ''
            cookieStorage.setAge(10 * 60 * 60 * 1000).set('latitude', res.latitude)
            cookieStorage.setAge(10 * 60 * 60 * 1000).set('longitude', res.longitude)
            resolve({ lat: res.latitude, lng: res.longitude })
          },
          fail: function (err) {
            console.error(err)
            reject(err)
          }
        })
        setTimeout(() => {
          reject(new Error('timeout'))
        }, 5000)
      }
      fn()
      wx.ready(function () {
        fn()
      })
    } else {
      if (cookie.get('locationError')) {
        reject(new Error('一天内已失败过'))
        return
      }
      if (!('geolocation' in window.navigator)) {
        reject(new Error('browser not support'))
        return
      }
      setTimeout(() => {
        reject(new Error('timeout'))
      }, 5000)
      window.navigator.geolocation.getCurrentPosition(position => {
        const domain = window.location.host.indexOf(tenant.domain) > -1 ? tenant.domain : ''
        cookie.set('latitude', position.coords.latitude, { expires: 0.007, domain })
        cookie.set('longitude', position.coords.longitude, { expires: 0.007, domain })
        resolve({ lat: position.coords.latitude, lng: position.coords.longitude })
      }, (err) => {
        cookie.set('locationError', 1, { expires: 0.007 })
        reject(err)
      }, { enableHighAcuracy: false, timeout: 5000, maximumAge: 1000 * 3600 })
    }
  })
}

export function setShareInfo ({
  title = tenant.shareInfo.title,
  desc = tenant.shareInfo.desc,
  link = tenant.shareInfo.link,
  imgUrl = tenant.shareInfo.imgUrl,
  success = () => {}
}, isDefault) {
  // APP jsBridge配置分享信息
  if (window.jiujiJsBridge) {
    setTimeout(() => {
      window.jiujiJsBridge.pageShare({ title, desc, link, imgUrl }, success)
    }, 200)
  } else {
    window.onJiujiJsBridgeReady = () => {
      setTimeout(() => {
        window.jiujiJsBridge.pageShare({ title, desc, link, imgUrl }, success)
      }, 200)
    }
  }
  // qq分享
  if (platform.qq && window.mqq && !platform.app) {
    window.mqq.invoke('data', 'setShareInfo', {
      share_url: link,
      title,
      desc,
      image_url: imgUrl
    }, success)
  }
  if (isDefault) {
    if (window.isSetedShare === link) { // 防止签名接口比业务接口慢，覆盖了页面设置的分享信息
      window.isSetedShare = null
      return
    }
  } else {
    window.isSetedShare = link
  }
  /* eslint-disable no-undef */
  wx.ready(() => {
    wx.showOptionMenu()
    wx.onMenuShareTimeline({
      title: title,
      desc: desc,
      link: link,
      imgUrl: imgUrl,
      success: success,
      cancel: () => {}
    })
    wx.onMenuShareAppMessage({
      title: title,
      desc: desc,
      link: link,
      imgUrl: imgUrl,
      type: 'link',
      dataUrl: '',
      success: success,
      cancel: () => {}
    })
    wx.onMenuShareQQ({
      title: title,
      desc: desc,
      link: link,
      imgUrl: imgUrl,
      success: success,
      cancel: () => {}
    })
    wx.onMenuShareWeibo({
      title: title,
      desc: desc,
      link: link,
      imgUrl: imgUrl,
      success: success,
      cancel: () => {}
    })
  })
}

export function jsonp (url, params, callback) {
  let randomNum = new Date().getTime()
  let callName = null
  let sendScriptRequest = function (url, id) {
    let head = document.getElementsByTagName('head')[0]
    let script = document.createElement('script')
    script.id = id
    script.src = url
    script.charset = 'utf-8'
    head.appendChild(script)
  }
  let buildTempFunction = function (callback) {
    // 创建一个全局方法，并将方法名当做请求地址的一个参数
    callName = 'jsonp' + randomNum++
    window[callName] = function (data) {
      callback(data)
      window[callName] = undefined
      try {
        delete window[callName]
        let jsNode = document.getElementById(callName)
        jsNode.parentElement.removeChild(jsNode) // 执行全局方法后，将script标签删除
      } catch (e) { }
    }
    return callName
  }

  params.callback = buildTempFunction(callback)
  url += (url.indexOf('?') > -1) ? '' : '?'
  for (let i in params) { url += '&' + i + '=' + params[i] }
  sendScriptRequest(url, callName)
}

export function dateFormat (value, formatStr, pretty, serveTime) {
  if (!isNaN(Number(value))) {
    value = Number(value)
  }
  let self = new Date(value)
  let str = formatStr
  let Week = ['日', '一', '二', '三', '四', '五', '六']

  str = str.replace(/yyyy|YYYY/, self.getFullYear())
  str = str.replace(/yy|YY/, (self.getYear() % 100) > 9 ? (self.getYear() % 100).toString() : '0' + (self.getYear() % 100))

  str = str.replace(/MM/, (self.getMonth() + 1) > 9 ? (self.getMonth() + 1).toString() : '0' + (self.getMonth() + 1))
  str = str.replace(/M/g, (self.getMonth() + 1))

  str = str.replace(/w|W/g, Week[self.getDay()])

  str = str.replace(/dd|DD/, self.getDate() > 9 ? self.getDate().toString() : '0' + self.getDate())
  str = str.replace(/d|D/g, self.getDate())

  str = str.replace(/hh|HH/, self.getHours() > 9 ? self.getHours().toString() : '0' + self.getHours())
  str = str.replace(/h|H/g, self.getHours())
  str = str.replace(/mm/, self.getMinutes() > 9 ? self.getMinutes().toString() : '0' + self.getMinutes())
  str = str.replace(/m/g, self.getMinutes())

  str = str.replace(/ss|SS/, self.getSeconds() > 9 ? self.getSeconds().toString() : '0' + self.getSeconds())
  str = str.replace(/s|S/g, self.getSeconds())

  if (pretty === 'pretty') { // 人性化时间
    let now = serveTime || new Date()
    let differ = (now - self) / 1000
    let indexOfH = formatStr.indexOf('h') === -1 ? formatStr.indexOf('H') : formatStr.indexOf('h')
    if (self.getFullYear() === now.getFullYear()) {
      if (now.getDate() === self.getDate() && now.getMonth() === self.getMonth()) {
        // str = `今天`
        str = `${self.getHours() < 10 ? '0' + self.getHours() : self.getHours()}:${self.getMinutes() < 10 ? '0' + self.getMinutes() : self.getMinutes()}`
        // if (indexOfH > -1) { // 有小时则可以显示
        if ((differ < 60 && differ >= 0) || (-differ >= 0 && -differ < 60)) {
          str = '刚刚'
        } else if (differ >= 60 && differ < 3600) {
          str = parseInt(differ / 60) + '分钟前'
        } else if (differ >= 3600 && parseInt(differ / 3600) <= now.getHours()) {
          str = parseInt(differ / 3600) + '小时前'
        } else if (-differ >= 60 && -differ < 3600) {
          str = -parseInt(differ / 60) + '分钟后'
        } else if (-differ >= 3600 && -parseInt(differ / 3600) <= (24 - now.getHours())) {
          str = -parseInt(differ / 3600) + '小时后'
        }
        // }
      } else if (now.getDate() - self.getDate() === 1 && now.getMonth() === self.getMonth()) {
        str = '昨天'
        if (indexOfH > -1) {
          // str += self.format(formatStr.substr(indexOfH))
          str += dateFormat(self.getTime(), formatStr.substr(indexOfH))
        }
      } else if (now.getDate() - self.getDate() === 2 && now.getMonth() === self.getMonth()) {
        str = '前天'
        if (indexOfH > -1) {
          // str += self.format(formatStr.substr(indexOfH))
          str += dateFormat(self.getTime(), formatStr.substr(indexOfH))
        }
      } else if (now.getDate() - self.getDate() === -1 && now.getMonth() === self.getMonth()) {
        str = '明天'
        if (indexOfH > -1) {
          // str += self.format(formatStr.substr(indexOfH))
          str += dateFormat(self.getTime(), formatStr.substr(indexOfH))
        }
      } else if (now.getDate() - self.getDate() === -2 && now.getMonth() === self.getMonth()) {
        str = '后天'
        if (indexOfH > -1) {
          // str += self.format(formatStr.substr(indexOfH))
          str += dateFormat(self.getTime(), formatStr.substr(indexOfH))
        }
      } else if (formatStr.indexOf('M') > -1) {
        formatStr = formatStr.substr(formatStr.indexOf('M'))
        // str = self.format(formatStr)
        str = dateFormat(self.getTime(), formatStr)
      }
    } else if (self.getFullYear() - now.getFullYear() === 1) {
      str = '明年'
      if (formatStr.indexOf('M') > -1) {
        formatStr = formatStr.substr(formatStr.indexOf('M'))
        if (now.getMonth() === 11) { // 12月不显示明年
          // str = self.format(formatStr)
          str = dateFormat(self.getTime(), formatStr)
        } else {
          // str += self.format(formatStr)
          str += dateFormat(self.getTime(), formatStr)
        }
      }
    } else if (self.getFullYear() - now.getFullYear() === -1) {
      str = '去年'
      if (formatStr.indexOf('M') > -1) {
        formatStr = formatStr.substr(formatStr.indexOf('M'))
        // str += self.format(formatStr)
        str += dateFormat(self.getTime(), formatStr)
      }
    }
  }
  return str
}
export function findParentIntree (tree, value, findKey = 'id', recursionKey = 'children') {
  for (let i = 0; i < tree.length; i++) {
    const item = tree[i]
    if (item[findKey] === value) {
      return [item]
    } else {
      if (item[recursionKey] && item[recursionKey].length > 0) {
        let parentNode = [item]
        let find = findParentIntree(item[recursionKey], value, findKey, recursionKey)
        if (find) {
          parentNode.push(...find)
          return parentNode
        }
      }
    }
  }
}
/***
 * 连续输入节流阀
 * func 输入完成的回调函数
 * delay 延迟时间
 */
export function debounce (func, delay) {
  let timer
  return (...args) => {
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      func.apply(this, args)
    }, delay)
  }
}
