import { Dom, getResource } from '@/utils'

window.addEventListener('DOMContentLoaded', () => {
  Dom.query('body').create('script', {
    type: 'text/javascript',
    src: getResource('/content/watchXHR.js'),
  })
})

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  const { action, url } = message
  const actionHandle = {
    /** 获取请求职位列表接口参数 */
    getFetchJobListData: () => {
      const fetchListData = JSON.parse(
        localStorage.getItem('fetchJobListData') || 'null'
      )

      sendResponse({ fetchListData })
    },

    /** 打开聊天对话页面 */
    openChatPage: () => {
      const chatPage = window.open(url, '_blank')
      if (!chatPage) return

      chatPage.onload = () => {
        setTimeout(() => {
          const chatInput = chatPage.document.querySelector('#chat-input')
          console.log(11111, chatInput)
          if (!chatInput) return
          chatInput.innerHTML = '你好，请问最近还招聘高级前端工程师吗'
        }, 1000)
      }
    },
  }[action]

  actionHandle?.()
})
