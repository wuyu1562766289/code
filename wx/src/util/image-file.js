import EXIF from 'exif-js'
class ImageFile {
  dataURLtoBlob (dataURL = '') {
    let arr = dataURL.split(',')
    let mime = arr[0].match(/:(.*?);/)[1]
    let bstr = window.atob(arr[1])
    let n = bstr.length
    let u8arr = new Uint8Array(n)
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n)
    }
    return new window.Blob([u8arr], { type: mime })
  }
  orientation (file = null) {
    return new Promise((resolve, reject) => {
      EXIF.getData(file, function () {
        const orientation = EXIF.getTag(this, 'Orientation')
        resolve(orientation)
      })
    })
  }
  toDataURL (file = null) {
    const fr = new window.FileReader()
    fr.readAsDataURL(file)
    return new Promise((resolve, reject) => {
      fr.onload = (f) => {
        resolve(f.target.result)
      }
    })
  }
  compress ({ file = null, maxWidth = 1000, maxHeight = 1000, ratio = 1 }) {
    const self = this
    let img = document.createElement('img')
    let canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    self.toDataURL(file).then(base64 => {
      img.src = base64
    })
    return new Promise((resolve, reject) => {
      img.onload = async () => {
        const orientation = await self.orientation(file)
        const originWidth = img.width
        const originHeight = img.height

        let targetWidth = originWidth
        let targetHeight = originHeight
        if (originWidth > maxWidth || originHeight > maxHeight) {
          if (originWidth / originHeight > maxWidth / maxHeight) {
            targetWidth = maxWidth
            targetHeight = Math.round(maxWidth * (originHeight / originWidth))
          } else {
            targetHeight = maxHeight
            targetWidth = Math.round(maxHeight * (originWidth / originHeight))
          }
        }
        canvas.width = targetWidth
        canvas.height = targetHeight
        if (orientation && orientation !== 1) {
          switch (orientation) {
            case 6:
              canvas.width = targetHeight
              canvas.height = targetWidth
              ctx.rotate(Math.PI / 2)
              ctx.drawImage(img, 0, -targetHeight, targetWidth, targetHeight)
              break
            case 3:
              ctx.rotate(Math.PI)
              ctx.drawImage(img, -targetWidth, -targetHeight, targetWidth, targetHeight)
              break
            case 8:
              canvas.width = targetHeight
              canvas.height = targetWidth
              ctx.rotate(3 * Math.PI / 2)
              ctx.drawImage(img, -targetWidth, 0, targetWidth, targetHeight)
              break
          }
        } else {
          ctx.drawImage(img, 0, 0, targetWidth, targetHeight)
        }

        let dataURL = canvas.toDataURL(file.type, ratio)
        let blob = await self.dataURLtoBlob(dataURL)
        img = null
        canvas = null // 释放内存
        resolve({ dataURL, blob })
      }
    })
  }
}
export default ImageFile
