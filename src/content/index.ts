import { Dom, getResource } from '@/utils'

window.addEventListener('DOMContentLoaded', () => {
  Dom.query('body').create('script', {
    type: 'text/javascript',
    src: getResource('/content/watchXHR.js'),
  })
})

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'getFetchListData') {
    const fetchListData = JSON.parse(
      localStorage.getItem('fetchListData') || 'null'
    )

    sendResponse({ fetchListData })
  }
})
