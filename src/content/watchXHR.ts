import qs from 'qs'

/** 拦截XHR请求 */
const interceptorXHR = () => {
  const XHR = (window as any)._ahrealxhr
  const XHROpen = XHR.prototype.open

  XHR.prototype.open = function (method: string, url: string) {
    if (
      method === 'GET' &&
      url.indexOf('/wapi/zpgeek/pc/recommend/job/list.json') === 0
    ) {
      const [path, params] = url.split('?')

      localStorage.setItem(
        'fetchJobListOptions',
        JSON.stringify({ method, url: path, params: qs.parse(params) })
      )
    }

    return XHROpen.apply(this, arguments as any)
  }
}

interceptorXHR()
