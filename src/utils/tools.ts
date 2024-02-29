/** 操作chrome缓存 */
export const local = {
  /** 获取chrome数据缓存 */
  async get(key: string) {
    const value = await new Promise<any>(resolve => {
      chrome.storage.local.get(key, (store: any) => resolve(store[key]))
    })

    return value
  },

  /** 设置chrome数据缓存 */
  set(data: any, callback?: () => void) {
    return chrome.storage.local.set(data, callback)
  },

  /** 删除一个或多个缓存 */
  remove(keys: string | string[]) {
    return chrome.storage.local.remove(keys)
  },
}

/** 获取chrome扩展资源 */
export const getResource = (resource: string) => chrome.runtime.getURL(resource)

/** 获取一个指定长度的数组 */
export const getArr = length => {
  return Array(length)
    .fill(null)
    .map((_, index) => index)
}

/** 睡眠定时器，一般用于防止触发机器人验证或等待节点加载 */
export const sleep = time => new Promise(resolve => setTimeout(resolve, time))
