import hello from './test'
import imgUrl from './asset/img/test.png'

let dom = document.createElement('img')
dom.src = imgUrl
document.body.appendChild(dom)

hello()