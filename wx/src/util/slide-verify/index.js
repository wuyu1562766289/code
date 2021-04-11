/**
 * Created by ebi on 2018/9/6.
 */
import draggable from '../draggable'
import { commonApi } from '~/api'
import '~/polyfill/classList'
import './verify.scss'
import { Toast } from 'mint-ui'
class SlideVerify {
  constructor (token) {
    if (typeof window !== 'undefined') {
      this.token = token
      this._init()
    }
  }
  _init () {
    const dom = `
      <div class="slide-verify">
        <div class="mask"></div>
        <div class="verify-box">
          <div class="verify-img-box">
            <div class="verify-bg-img"></div>
            <img src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" class="verify-fg-img">
            <div class="verify-tips"></div>
          </div>
          <div class="verify-drag-box">
            <div class="verify-drag-track">
              <p>向右拖动滑块完成上方拼图</p>
              <a href="javascript:;" class="flex flex-center">
                <svg viewBox="0 0 30 30" style="width:20px;height:20px;fill:#9c9c9c;">
                  <path d="M 15 3 C 8.9134751 3 3.87999 7.5533546 3.1132812 13.439453 A 1.0001 1.0001 0 1 0 5.0957031 13.697266 C 5.7349943 8.7893639 9.9085249 5 15 5 C 17.766872 5 20.250574 6.1285473 22.058594 7.9414062 L 20 10 L 26 11 L 25 5 L 23.470703 6.5292969 C 21.300701 4.3575454 18.309289 3 15 3 z M 25.912109 15.417969 A 1.0001 1.0001 0 0 0 24.904297 16.302734 C 24.265006 21.210636 20.091475 25 15 25 C 11.977904 25 9.2987537 23.65024 7.4648438 21.535156 L 9 20 L 3 19 L 4 25 L 6.0488281 22.951172 C 8.2452659 25.422716 11.436061 27 15 27 C 21.086525 27 26.12001 22.446646 26.886719 16.560547 A 1.0001 1.0001 0 0 0 25.912109 15.417969 z" />
                </svg>
              </a>
            </div>
            <div class="verify-drag-trigger">
              <div></div>  
              <div></div>
              <div></div>
            </div>
          </div>
        </div>
      </div>
    `
    if (!document.querySelector('.slide-verify')) {
      let wrap = document.createElement('div')
      wrap.innerHTML = dom
      document.body.appendChild(wrap)
    }
    this.wrap = document.querySelector('.slide-verify')
    this.mask = document.querySelector('.mask')
    this.verifyBox = document.querySelector('.verify-box')
    this.bgImg = document.querySelector('.verify-bg-img')
    this.fgImg = document.querySelector('.verify-fg-img')
    this.tips = document.querySelector('.verify-tips')
    this.dragTrack = document.querySelector('.verify-drag-track')
    this.dragTrigger = document.querySelector('.verify-drag-trigger')
  }
  open () {
    this.wrap.style.display = 'block'
    setTimeout(() => {
      this.mask.classList.add('show')
      this.verifyBox.classList.add('show')
    }, 100)
    return new Promise((resolve, reject) => {
      let go = () => {
        this._reset().then(t => {
          this.tips.classList.add('success')
          this.tips.innerText = `仅用了${t / 1000}秒击败了99%用户`
          setTimeout(() => {
            this.close().then(() => {
              this.dragTrack.querySelector('a').removeEventListener('click', go)
              resolve()
            })
          }, 1000)
        })
      }
      go()
      this.dragTrack.querySelector('a').addEventListener('click', go)
      this.mask.addEventListener('click', () => {
        this.close().then(() => {
          this.dragTrack.querySelector('a').removeEventListener('click', go)
        })
      })
    })
  }
  close () {
    return new Promise((resolve, reject) => {
      this.tips.classList.remove('success')
      this.mask.classList.remove('show')
      this.verifyBox.classList.remove('show')
      setTimeout(() => {
        this.wrap.style.display = 'none'
        resolve()
      }, 300)
    })
  }
  _reset () {
    this.fgImg.classList.remove('show')
    this.fgImg.style.transform = 'translateX(0px)'
    this.dragTrigger.style.transform = 'translateX(0px)'
    this.dragTrack.querySelector('p').classList.remove('transparent')
    this.dragTrack.querySelector('a').classList.remove('transparent')
    return new Promise((resolve, reject) => {
      commonApi.getCode({ spec: '300*200', token: this.token }).then(
        res => {
          if (res.code === 0) {
            this.fgImg.setAttribute('src', res.data.small)
            this.fgImg.style.top = res.data.y + 'px'
            let unitBg = ''
            const unitWidth = res.data.imgx / 10 // 10列
            const unitHeight = res.data.imgy / 2 // 2行
            let positionArr = res.data.array.split(',')
            for (let i = 0; i < positionArr.length; i++) {
              let index = positionArr.indexOf(String(i))
              let x = 0
              let y = 0
              // 还原前偏移
              y = i > 9 ? -unitHeight : 0
              x = i > 9 ? (i - 10) * -unitWidth : i * -unitWidth
              // 当前y轴偏移量
              if (index > 9 && i < 10) y = y - unitHeight
              if (i > 9 && index < 10) y = y + unitHeight
              // 当前x轴偏移量
              x = x + (index - i) * -unitWidth
              // 显示第i张图片
              unitBg += `<div class="verify-bg-unit" style="background-image:url(${res.data.normal});background-position:${x}px ${y}px;"></div>`
            }
            this.bgImg.innerHTML = unitBg
            this._dragHandle().then(t => resolve(t))
          }
        }
      )
    })
  }
  _dragHandle () {
    return new Promise((resolve, reject) => {
      let trackData = []
      let startTime = 0
      let endTime = 0
      let originX = 0
      let currentX = 0
      draggable(this.dragTrigger, {
        resetListener: true,
        start: e => {
          this.dragTrack.querySelector('p').classList.add('transparent')
          this.dragTrack.querySelector('a').classList.add('transparent')
          this.fgImg.classList.add('show')
          originX = this.dragTrigger.getBoundingClientRect().left
          startTime = Date.now()
        },
        drag: e => {
          currentX = e.pageX - originX
          if (currentX <= 30) {
            currentX = 30
          }
          if (currentX >= 270) {
            currentX = 270
          }
          this.fgImg.style.transform = `translateX(${currentX - 20 - 10}px)`
          this.dragTrigger.style.transform = `translateX(${currentX - 30}px)`
          trackData.push([Math.round(currentX), Date.now()])
        },
        end: e => {
          endTime = Date.now()
          let timeDiff = endTime - startTime
          commonApi.checkCode({ point: Math.round(currentX - 20), timeDiff, token: this.token, timeEvent: trackData.join('|') }).then(
            res => {
              if (res.code === 0) {
                resolve(timeDiff)
              } else {
                this.tips.classList.add('err')
                this.tips.innerText = '移动滑块到对应的位置'
                setTimeout(() => {
                  this.tips.classList.remove('err')
                  this._reset().then(t => resolve(t))
                }, 800)
              }
            },
            () => {
              Toast('加载商品静态数据失败')
            }
          )
        }
      })
    })
  }
}
export default SlideVerify
