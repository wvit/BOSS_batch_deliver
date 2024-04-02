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

  /**  等待标签页加载完毕 */
  const tabsLoad = (id, changeInfo) => {
    if (!(id === tabId && changeInfo.status === 'complete')) return

    /** 删除监听的标签页事件，避免多次触发 */
    chrome.tabs.onUpdated.removeListener(tabsLoad)

    /** 注入js脚本代码 */
    chrome.scripting.executeScript(
      {
        target: { tabId },
        func: async chatMessage => {
          const getDom = selector => document.querySelector(selector)

          /** 睡眠定时器 */
          const sleep = time => {
            return new Promise(resolve => setTimeout(resolve, time))
          }

          /** 定时检测器 */
          const inspectTimer = callback => {
            return new Promise<number>(resolve => {
              let count = 0

              const timer = setInterval(() => {
                const done = () => {
                  clearInterval(timer)
                  resolve(count)
                }

                count++
                try {
                  if (callback(count) || count > 30) done()
                } catch (e) {
                  done()
                  console.error('inspectTimer 出错', e)
                }
              }, 100)
            })
          }

          await sleep(500)

          const [chatInput, emoji, sendBtn] = [
            getDom('#chat-input'),
            getDom('.emoj.emoj-1'),
            getDom('.chat-op .btn-send'),
          ]

          if (!(chatInput && emoji && sendBtn)) {
            return { status: 'error', msg: '发送消息失败' }
          }

          /** 先添加一个符号表情，触发输入框事件 */
          emoji.click()

          await sleep(100)

          /** 添加输入框内容 */
          chatInput.innerText = chatMessage

          await sleep(500)

          /** 点击触发按钮 */
          sendBtn.click()

          /** 检测消息是否发送完成 */
          const count = await inspectTimer(() => {
            const classList = Array.from(
              document.querySelectorAll('.item-myself .message-text .status')
            ).pop()?.classList

            return (
              classList?.contains('status-delivery') ||
              classList?.contains('status-read')
            )
          })

          if (count > 30) {
            return { status: 'error', msg: '发送消息超时' }
          } else {
            await sleep(200)
            return { status: 'success', msg: '发送消息完成' }
          }
        },
        args: [chatMessage],
      },
      sendResponse
    )
  }

  chrome.tabs.onUpdated.addListener(tabsLoad)
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
