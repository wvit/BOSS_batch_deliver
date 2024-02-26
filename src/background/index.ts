import { sleep, Dom } from '@/utils'

let windowId = null

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  const { action, jobData } = message
  const { encryptBossId, encryptJobId, securityId, lid } = jobData

  if (action === 'openChatPage') {
    /** 在需要异步响应 sendResponse 时，需要将业务逻辑包裹一下  */
    const syncFn = async () => {
      if (!windowId) {
        windowId = await new Promise(reslove => {
          /** 打开新窗口 */
          chrome.windows.create(
            {
              url: 'about:blank',
              type: 'normal',
              state: 'minimized',
            },
            window => {
              reslove(window.id)
            }
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
          function: async () => {
            return await new Promise<void>(resolve => {
              window.onload = async () => {
                await sleep(200)
                const [chatInput, emoji, sendBtn] = [
                  Dom.query('#chat-input'),
                  Dom.query('.emoj.emoj-1'),
                  Dom.query('.chat-op .btn-send'),
                ]
                if (!(chatInput && emoji && sendBtn)) return

                /** 先添加一个符号表情，触发输入框事件 */
                emoji.click()

                /** 添加输入框内容 */
                chatInput.innerText =
                  '你好，我叫吴维，请问贵公司还需要高级前端开发工程师吗，6年前端工作经验。这是我的个人主页，里面有非常详细的自我介绍: https://wuwei.chat'

                await sleep(500)

                /** 点击触发按钮 */
                //  sendBtn.click()

                resolve()
              }
            })
          },
        },
        sendResponse
      )
    }

    syncFn()

    return true
  }
})

chrome.windows.onRemoved.addListener(removedWindowId => {
  if (removedWindowId === windowId) {
    windowId = null
  }
})
