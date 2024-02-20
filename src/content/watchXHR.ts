/** 拦截XHR请求 */
const interceptorXHR = () => {
  const XHR = (window as any)._ahrealxhr
  const XHROpen = XHR.prototype.open

  XHR.prototype.open = function (method: string, url: string) {
    if (
      method === 'GET' &&
      url.indexOf('/wapi/zpgeek/pc/recommend/job/list.json') === 0
    ) {
      console.log(111111, method, url)
    }

    return XHROpen.apply(this, arguments as any)
  }
}

interceptorXHR()
