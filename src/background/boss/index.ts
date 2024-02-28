/** 当前打开窗口id */
let windowId = null

/** 打开聊天对话标签页 */
const openChatPage = async (
  jobData: any,
  chatMessage: string,
  sendResponse: (msg: string) => void
) => {
  const { encryptBossId, encryptJobId, securityId, lid } = jobData

  if (!windowId) {
    windowId = await new Promise(reslove => {
      /** 打开新窗口 */
      chrome.windows.create(
        {
          url: 'about:blank',
          type: 'normal',
          state: 'minimized',
        },
        window => reslove(window.id)
      )
    })
  }

  const tabId: any = await new Promise(resolve => {
    /** 打开新的聊天对话页面 */
    chrome.tabs.create(
      {
        windowId,
        url: `https://www.zhipin.com/web/geek/chat?id=${encryptBossId}&jobId=${encryptJobId}&securityId=${securityId}&lid=${lid}`,
      },
      tab => resolve(tab.id)
    )
  })

  chrome.scripting.executeScript(
    {
      target: { tabId },
      func: async chatMessage => {
        const getDom = selector => document.querySelector(selector)
        const sleep = time => new Promise(resolve => setTimeout(resolve, time))

        await sleep(500)

        const [chatInput, emoji, sendBtn] = [
          getDom('#chat-input'),
          getDom('.emoj.emoj-1'),
          getDom('.chat-op .btn-send'),
        ]

        if (!(chatInput && emoji && sendBtn)) return 'error'

        /** 先添加一个符号表情，触发输入框事件 */
        emoji.click()

        await sleep(500)

        /** 添加输入框内容 */
        chatInput.innerText = chatMessage

        await sleep(500)

        /** 点击触发按钮 */
        sendBtn.click()

        await sleep(500)

        return 'success'
      },
      args: [chatMessage],
    },
    sendResponse
  )
}

/** 初始化boss直聘网站 background 脚本 */
export const bossInit = () => {
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    const { action, jobData, chatMessage } = message

    if (action === 'openChatPage') {
      openChatPage(jobData, chatMessage, sendResponse)
    } else if (action === 'closeWindow' && windowId) {
      chrome.windows.remove(windowId, () => {
        windowId = null
      })
    }

    return true
  })

  chrome.windows.onRemoved.addListener(removedWindowId => {
    if (removedWindowId === windowId) {
      windowId = null
    }
  })
}
