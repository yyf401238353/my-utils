
/**
 *
 * @description 通过reader把File转换成base64
 * @param {string | File} target
 * @returns {string | ArrayBuffer} base64
 */
export const file2base64 = (target) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(target)
    reader.onload = () => resolve(reader.result)
    reader.onerror = (error) => reject(error)
  })
}

/**
 *
 * @description 通过canvas压缩图片的方法 主要是jpeg的压缩 png的压缩需要其他的算法
 * @param {string | File} target
 * @param {{ maxWidth: number }} [{ maxWidth }={}]
 * @returns {string} base64
 */
export const imageZip = async (
  target,
  { maxWidth, maxHeight, maxSize, fileSize, orientation } = {} as any
) => {
  const base64 = typeof target === 'string' ? target : await file2base64(target)
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  const img = new Image()
  img.src = base64 as string
  return await new Promise((resolve, reject) => {
    img.onload = () => {
      let width = img.width
      let height = img.height
      let scale = 1

      if (maxWidth && width > height && width > maxWidth) {
        width = maxWidth
        height = (maxWidth / img.width) * img.height
      } else if (maxHeight && height > width && height > maxHeight) {
        height = maxHeight
        width = (maxHeight / img.height) * img.width
      }

      if (maxSize && fileSize && fileSize > maxSize) {
        scale = maxSize / fileSize
      }

      canvas.width = width
      canvas.height = height
      // 在windows下正常 其他系统可能有问题
      if (orientation) {
        let biggerBorder = Math.max(width, height)
        canvas.width = biggerBorder
        canvas.height = biggerBorder
        switch (orientation) {
          case 2:
            ctx.transform(-1, 0, 0, 1, width, 0)
            break
          case 3:
            ctx.transform(-1, 0, 0, -1, width, height)
            break
          case 4:
            ctx.transform(1, 0, 0, -1, 0, height)
            break
          case 5:
            ctx.transform(0, 1, 1, 0, 0, 0)
            break
          case 6:
            ctx.transform(0, 1, -1, 0, height, 0)
            break
          case 7:
            ctx.transform(0, 1, -1, 0, height, 0)
            break
          case 8:
            ctx.transform(0, -1, 1, 0, 0, width)
            break
          default:
        }
        ctx.drawImage(img, 0, 0, width, height)
        const imgdata =
          orientation > 3
            ? ctx.getImageData(0, 0, height, width)
            : ctx.getImageData(0, 0, width, height)
        const canvasContainer = document.createElement('canvas')
        if (orientation > 3) {
          canvasContainer.width = height
          canvasContainer.height = width
        } else {
          canvasContainer.width = width
          canvasContainer.height = height
        }
        const newCtx = canvasContainer.getContext('2d')
        newCtx.putImageData(imgdata, 0, 0)
        resolve(canvasContainer.toDataURL('image/jpeg', scale))
      } else {
        ctx.drawImage(img, 0, 0, width, height)
        resolve(canvas.toDataURL('image/jpeg', scale))
      }
    }
    img.onerror = reject
  })
}

/**
 *
 * @description 通过reader把dataUrl转换成file
 * @param {string} dataurl
 * @param {string} filename
 * @returns
 */
export const dataURLtoFile = (dataurl, filename) => {
  var arr = dataurl.split(','),
    mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[1]),
    n = bstr.length,
    u8arr = new Uint8Array(n)
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n)
  }
  return new File([u8arr], filename, { type: mime })
}
