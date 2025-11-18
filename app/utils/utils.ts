/**
 * 函数防抖 短时间内多次触发同一事件，只执行最后一次，或者只执行最开始的一次，中间的不执行
 * @param func 目标函数
 * @param wait 延迟执行毫秒数
 * @param immediate true - 立即执行， false - 延迟执行
 */
let timeout: NodeJS.Timeout | null = null
export function debounce(func: (...args: any[]) => void, wait: number = 500, immediate: boolean = false): void {
  // 清除定时器
  if (timeout !== null)
    clearTimeout(timeout)
  // 立即执行，此类情况一般用不到
  if (immediate) {
    const callNow = !timeout
    timeout = setTimeout(() => {
      timeout = null
    }, wait)
    if (callNow) {
      if (typeof func === 'function') {
        func()
      }
    }
  }
  else {
    // 设置定时器，当最后一次操作后，timeout不会再被清除，所以在延时wait毫秒后执行func回调方法
    timeout = setTimeout(() => {
      if (typeof func === 'function') {
        func()
        timeout = null
      }
    }, wait)
  }
}

/**
 * 函数节流 连续触发事件但是在 n 秒中只执行一次函数。即 2n 秒内执行 2 次
 * @param func 函数
 * @param wait 延迟执行毫秒数
 * @param immediate 是否立即执行
 */
let _timer: NodeJS.Timeout | null = null
let flag: boolean = false
export function throttling(func: (...args: any[]) => void, wait: number = 500, immediate: boolean = true): void {
  if (immediate) {
    if (!flag) {
      flag = true
      // 如果是立即执行，则在wait毫秒内开始时执行
      if (typeof func === 'function') {
        func()
      }
      _timer = setTimeout(() => {
        flag = false
      }, wait)
    }
  }
  else {
    if (!flag) {
      flag = true
      // 如果是非立即执行，则在wait毫秒内的结束处执行
      _timer = setTimeout(() => {
        flag = false
        if (typeof func === 'function') {
          func()
        }
      }, wait)
    }
  }
}

/**
 * 拼接完整的资源URL
 * 所有请求都通过Nitro服务器代理，避免CORS和HTTPS混合问题
 * 相对路径 → Nitro代理 → 后端服务
 * @param url 资源URL（相对路径或完整URL）
 * @returns 完整的资源URL
 */
export function buildFullUrl(url: string): string {
  return url
}
