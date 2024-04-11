/** 当前打开窗口id */
let windowId: number | null = null

/** 打开聊天对话标签页 */
const openChatPage = async (
  sendResponse: (msg: string) => void,
  options: {
    jobData: any
    chatMessage: string
    intervalTime: number
  }
) => {
  const { jobData, chatMessage, intervalTime } = options
  const { encryptBossId, encryptJobId, securityId, lid } = jobData

  if (!windowId) {
    /** 打开新窗口 */
    windowId = (
      await chrome.windows.create({
        url: 'about:blank',
        type: 'normal',
        state: 'minimized',
      })
    ).id!
  }

  /** 打开新的聊天对话页面 */
  const tabId = (
    await chrome.tabs.create({
      windowId,
      url: `https://www.zhipin.com/web/geek/chat?id=${encryptBossId}&jobId=${encryptJobId}&securityId=${securityId}&lid=${lid}`,
    })
  ).id!

  /**  等待标签页加载完毕 */
  const tabsLoad = (id, changeInfo) => {
    if (!(id === tabId && changeInfo.status === 'complete')) return

    /** 删除监听的标签页事件，避免多次触发 */
    chrome.tabs.onUpdated.removeListener(tabsLoad)

    /** 注入js脚本代码 */
    chrome.scripting.executeScript(
      {
        target: { tabId },
        func: async (chatMessage, intervalTime) => {
          /** 睡眠定时器 */
          const sleep = time => {
            return new Promise(resolve => setTimeout(resolve, time))
          }
          /** 定时检测器 */
          const inspectTimer = (callback, maxCount) => {
            return new Promise<number>(resolve => {
              let count = 0

              const timer = setInterval(() => {
                const done = () => {
                  clearInterval(timer)
                  resolve(count)
                }

                count++
                try {
                  if (callback(count) || count > maxCount) done()
                } catch (e) {
                  done()
                  console.error('inspectTimer 出错', e)
                }
              }, 50)
            })
          }
          /** 获取dom节点 */
          const getDom = selector => document.querySelector(selector)

          let [chatInput, emoji, sendBtn] = [] as any[]

          /** 检测所需dom节点是否加载完毕 */
          await inspectTimer(() => {
            chatInput = getDom('#chat-input')
            emoji = getDom('.emoj.emoj-1')
            sendBtn = getDom('.chat-op .btn-send')

            return chatInput && emoji && sendBtn
          }, 60)

          if (!(chatInput && emoji && sendBtn)) {
            return { status: 'error', msg: '发送消息失败' }
          }

          /** 先添加一个符号表情，触发输入框事件 */
          emoji.click()

          await sleep(100)

          /** 添加输入框内容 */
          chatInput.innerText = chatMessage

          await sleep(Number(intervalTime))

          /** 点击触发按钮 */
          sendBtn.click()

          /** 检测消息是否发送完成 */
          const inspectSendCount = await inspectTimer(() => {
            const classList = Array.from(
              document.querySelectorAll('.item-myself .message-text .status')
            ).pop()?.classList

            return (
              classList?.contains('status-delivery') ||
              classList?.contains('status-read')
            )
          }, 40)

          if (inspectSendCount > 40) {
            return { status: 'error', msg: '发送消息超时' }
          } else {
            return { status: 'success', msg: '发送消息完成' }
          }
        },
        args: [
          chatMessage || '你好，请问此岗位还有需要吗？',
          intervalTime || 2000,
        ],
      },
      sendResponse as any
    )
  }

  chrome.tabs.onUpdated.addListener(tabsLoad)
}

/** 初始化boss直聘网站 background 脚本 */
export const bossInit = () => {
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    const { action, jobData, chatMessage, intervalTime } = message

    if (action === 'openChatPage') {
      openChatPage(sendResponse, { jobData, chatMessage, intervalTime })
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
