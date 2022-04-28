/**
@description 页面垂直平滑滚动到指定滚动高度
@author zhangxinxu(.com)
*/
export const scrollSmoothTo = function (position) {
  if (!window.requestAnimationFrame) {
    window.requestAnimationFrame = function (callback) {
      return window.setTimeout(callback, 17)
    }
  }
  // 当前滚动高度
  var scrollTop = document.documentElement.scrollTop || document.body.scrollTop
  // 滚动step方法
  var step = function () {
    // 距离目标滚动距离
    var distance = position - scrollTop
    // 目标滚动位置
    scrollTop = scrollTop + distance / 4
    if (Math.abs(distance) < 1) {
      window.scrollTo(0, position)
    } else {
      window.scrollTo(0, scrollTop)
      window.requestAnimationFrame(step)
    }
  }
  step()
}

/**
 * 复制文本到剪切板
 * @param str
 */
export const copyToClipboard = (str: string) => {
  const el = document.createElement('textarea')
  el.value = str
  el.setAttribute('readonly', '')
  el.style.position = 'absolute'
  el.style.left = '-9999px'
  document.body.appendChild(el)
  el.select()
  document.execCommand('copy')
  document.body.removeChild(el)
}