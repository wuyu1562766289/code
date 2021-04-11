/**
 * Created by ebi on 2017/6/19.
 */
const ua = window.navigator.userAgent.toLowerCase()
const uaExp = new RegExp(window.tenant.APP.uaRegMatch)
const versionReg = new RegExp(`${uaExp}\\/(\\d+\\.\\d+\\.\\d+)\\/`)
const platform = {
  mobile: /mobile/.test(ua),
  ua: ua,
  ios: /iphone/.test(ua) || /ipad/.test(ua),
  android: /android/.test(ua),
  osVersion: 0,
  app: uaExp.test(ua) && !new RegExp(window.tenant.oaAPP.uaRegMatch).test(ua),
  appVersion: ua.match(versionReg) ? ua.match(versionReg)[1] : 0,
  wechat: /micromessenger/.test(ua),
  qq: /qq\//.test(ua),
  miniProgram: false,
  compareVersion (a = '0.0.0', b = '0.0.0') { // 大于0则a大，小于0则b大，等于0则相等
    let i, diff
    let regExStrip0 = /(\.0+)+$/
    let segmentsA = a.replace(regExStrip0, '').split('.')
    let segmentsB = b.replace(regExStrip0, '').split('.')
    let l = Math.min(segmentsA.length, segmentsB.length)

    for (i = 0; i < l; i++) {
      diff = parseInt(segmentsA[i], 10) - parseInt(segmentsB[i], 10)
      if (diff) {
        return diff
      }
    }
    return segmentsA.length - segmentsB.length
  }
}
platform.android && (platform.osVersion = ua.substr(ua.indexOf('android') + 8, 3))
platform.ios && (platform.osVersion = /iphone/.test(ua) ? ua.match(/iphone os (\w+) like/)[1].replace(/_/g, '.') : ua.match(/cpu os (\w+) like/)[1].replace(/_/g, '.'))
if (platform.ua.indexOf('miniProgram') > -1 || window.__wxjs_environment === 'miniprogram' || window.location.search.indexOf('miniProgram') > -1 || document.cookie.indexOf('miniProgram') > -1) {
  platform.miniProgram = true
}

export default platform
