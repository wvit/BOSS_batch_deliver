import { Dom, getResource, axios, sleep } from '@/utils'

/** 批量打开沟通聊天对话 */
const openChatPage = async jobList => {
  const zp_token = (await axios.get('/wapi/zppassport/get/zpToken'))?.zpData
    ?.token
  if (!zp_token) return

  for (const item of jobList) {
    const { encryptBossId, encryptJobId, securityId, lid } = item

    /** 将对方添加进联系人才可以发消息 */
    await axios.post(
      '/wapi/zpgeek/friend/add.json',
      {},
      {
        /** 没有 zp_token 接口会报错 “请求不合法”  */
        headers: { zp_token },
        params: {
          securityId,
          lid,
          jobId: encryptJobId,
        },
      }
    )

    /** 打开聊天对话页面 */
    const chatPage = window.open(
      `/web/geek/chat?id=${encryptBossId}&jobId=${encryptJobId}&securityId=${securityId}&lid=${lid}`,
      '_blank'
    )
    if (!chatPage) return
    const getNode = selector => chatPage.document.querySelector(selector)

    await new Promise<void>(reslove => {
      chatPage.onload = async () => {
        await sleep(200)
        const [chatInput, emoji, sendBtn] = [
          getNode('#chat-input'),
          getNode('.emoj.emoj-1'),
          getNode('.chat-op .btn-send'),
        ]
        if (!(chatInput && emoji && sendBtn)) return

        /** 先添加一个符号表情，触发输入框事件 */
        emoji.click()

        /** 添加输入框内容 */
        chatInput.innerText =
          '你好，我叫吴维，请问贵公司还需要高级前端开发工程师吗，6年前端工作经验。这是我的个人主页，里面有非常详细的自我介绍: https://wuwei.chat'

        await sleep(500)

        /** 点击触发按钮 */
        sendBtn.click()

        await sleep(500)

        /** 关闭页面 */
        chatPage.close()
        /** 进入下一个循环 */
        reslove()
      }
    })
  }
}

/** 初始化boss直聘网站 content 脚本 */
export const bossInit = () => {
  window.addEventListener('DOMContentLoaded', () => {
    Dom.query('body').create('script', {
      type: 'text/javascript',
      src: getResource('/content/boss/watchXhr.js'),
    })
  })

  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    const { action, jobList } = message
    const actionHandle = {
      /** 获取请求职位列表接口参数 */
      getFetchJobListOptions: () => {
        const fetchListOptions = JSON.parse(
          localStorage.getItem('fetchJobListOptions') || 'null'
        )

        sendResponse({ fetchListOptions })
      },

      /** 批量打开沟通聊天对话 */
      openChatPage: () => openChatPage(jobList),
    }[action]

    actionHandle?.()
  })
}
