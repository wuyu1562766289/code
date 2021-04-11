/**
 * Created by ebi on 2017/12/29.
 */
class OverScrollBehavior {
  constructor () {
    this.scroller = null
    this.startY = 0
    this.enableScrollHeight = 0
    this.scrollTop = 0
    this.htmlClassName = document.documentElement.className.split(' ')

    // 添加样式
    if (!document.querySelector('#preventScrollStyleElement')) {
      const css = '.prevent-scroll,.prevent-scroll body {overflow: hidden;}.prevent-scroll body {position: relative;}'
      const styleNode = document.createElement('style')
      styleNode.type = 'text/css'
      styleNode.id = 'preventScrollStyleElement'
      if (window.attachEvent && !window.opera) {
        styleNode.styleSheet.cssText = css
      } else {
        const styleText = document.createTextNode(css)
        styleNode.appendChild(styleText)
      }
      document.getElementsByTagName('head')[0].appendChild(styleNode)
    }
  }
  contain (container, scroller) {
    const parent = document.querySelector(container)
    if (scroller) {
      this.scroller = document.querySelector(scroller)
      if ('overscrollBehavior' in document.documentElement.style) {
        this.scroller.style.overscrollBehavior = 'contain'
        return
      }
    }
    this._addEvent(parent)
  }
  addHtmlStyle () {
    if (this.htmlClassName.indexOf('prevent-scroll') === -1) {
      this.htmlClassName.push('prevent-scroll')
      document.documentElement.className = this.htmlClassName.join(' ')
    }
  }
  removeHtmlStyle () {
    let index = this.htmlClassName.indexOf('prevent-scroll')
    if (index > -1) {
      this.htmlClassName.splice(index, 1)
      document.documentElement.className = this.htmlClassName.join(' ')
    }
  }
  _addEvent (element) {
    if (element.getAttribute('bind-event')) {
      return
    }
    element.setAttribute('bind-event', 1)
    element.addEventListener('touchstart', e => {
      this.addHtmlStyle()
      const target = e.touches[0].target // 最里层元素，可能是滚动元素，也可能是滚动元素的子孙元素
      let inScrollArea = false // 是否在滚动区域内
      if (target === this.scroller) {
        inScrollArea = true
      } else {
        let parentNodes = []
        let x = target
        while (x.tagName !== 'BODY') {
          parentNodes.push(x)
          x = x.parentNode
        }
        inScrollArea = parentNodes.indexOf(this.scroller) > -1
      }
      if (!inScrollArea) {
        return
      }
      this.startY = e.touches[0].pageY
      this.scrollTop = this.scroller.scrollTop
      // 可以滚动的高度
      this.enableScrollHeight = this.scroller.scrollHeight - this.scroller.clientHeight
    })
    element.addEventListener('touchmove', e => {
      if (this.enableScrollHeight <= 0) {
        e.preventDefault()
      }
      let scrollTop = this.scroller.scrollTop
      let touchDistance = e.touches[0].pageY - this.startY
      if (touchDistance > 0 && scrollTop === 0) { // 往上滑，并且到头
        e.preventDefault()
        return
      }
      if (touchDistance < 0 && (scrollTop + 1 >= this.enableScrollHeight)) { // 往下滑，并且到头
        e.preventDefault()
      }
    })
    element.addEventListener('touchend', () => {
      this.removeHtmlStyle()
    })
  }
}
export default OverScrollBehavior
