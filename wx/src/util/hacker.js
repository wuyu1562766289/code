const ____ua = window.navigator.userAgent.toLowerCase()
if (/iphone/.test(____ua) || /ipad/.test(____ua)) {
  let ____scrollToBottomTimer = null
  document.addEventListener('focusin', e => {
    let types = ['text', 'password', 'email', 'number', 'search', 'url']
    let isInput = e.target.tagName === 'INPUT' && types.indexOf(e.target.getAttribute('type') > -1)
    if ((isInput || e.target.tagName === 'TEXTAREA') && e.target.className.indexOf('fixed-in-bottom') > -1) {
      let scrollToBottomTimes = 0
      ____scrollToBottomTimer = setInterval(() => {
        if (scrollToBottomTimes > 9) {
          clearInterval(____scrollToBottomTimer)
          return
        }
        const bodyHeight = document.documentElement.clientHeight || document.body.clientHeight
        // 微信的坑（https://developers.weixin.qq.com/community/develop/doc/00044ae90742f8c82fb78fcae56800）
        window.scrollTo(0, bodyHeight - window.innerHeight, 0)
        scrollToBottomTimes++
      }, 100)
    }
  })
  // 微信的坑（https://developers.weixin.qq.com/community/develop/doc/00044ae90742f8c82fb78fcae56800）
  document.addEventListener('focusout', e => {
    let types = ['text', 'password', 'email', 'number', 'search', 'url']
    let isInput = e.target.tagName === 'INPUT' && types.indexOf(e.target.getAttribute('type') > -1)
    if (isInput || e.target.tagName === 'TEXTAREA') {
      setTimeout(() => {
        const scrollHeight = document.documentElement.scrollTop || document.body.scrollTop || 0
        window.scrollTo(0, Math.max(scrollHeight - 1, 0))
      }, 100)
      if (e.target.className.indexOf('fixed-in-bottom') > -1) {
        clearInterval(____scrollToBottomTimer)
      }
    }
  })
}
