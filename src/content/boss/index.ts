import { message } from 'antd'
import { dom, getResource, axios, sleep } from '@/utils'
import { commProgress } from './CommProgress'
import './index.css'

/** 批量打开沟通聊天对话 */
const batchOpenChatPage = async (options: {
  jobList: any[]
  chatMessage: string
  intervalTime: number
}) => {
  const { jobList, chatMessage, intervalTime } = options
  if (!jobList?.length) return
  /** 添加沟通联系人需要的 token */
  const { token } =
    (await axios.get('/wapi/zppassport/get/zpToken'))?.zpData || {}
  /** 是否停止发送消息 */
  let stopSendMsg = false

  commProgress.open({
    jobList,
    onClose: () => {
      stopSendMsg = true
      chrome.runtime.sendMessage({ action: 'closeWindow' })
    },
    onStop: () => {
      stopSendMsg = true
    },
  })

  for (const [index, item] of jobList.entries()) {
    const { encryptJobId, securityId, lid } = item

    /** 是否停止发送沟通消息 */
    if (stopSendMsg || !token) return

    /** 将对方添加进联系人才可以发消息 */
    const addRes = await axios.post(
      '/wapi/zpgeek/friend/add.json',
      {},
      {
        /** 没有 zp_token 接口会报错 “请求不合法”  */
        headers: { zp_token: token },
        params: {
          securityId,
          lid,
          jobId: encryptJobId,
        },
      }
    )
    const { code, zpData } = addRes || {}

    if (code === 1) {
      /** 添加沟通联系人失败 */
      if (zpData?.bizCode === 1) {
        const { content, title } = zpData.bizData?.chatRemindDialog || {}
        commProgress.updateCurrentJob(index, {
          status: 'error',
          msg: content || title,
        })
        message.warning(content)
      }

      await sleep(1000)
    } else if (zpData?.showGreeting) {
      /** 自己已在Boss直聘平台上已经配置了打招呼语 */
      commProgress.updateCurrentJob(index, {
        status: 'success',
        msg: '发送消息完成',
      })
      message.info('已向招聘者发送您的招呼语')

      await sleep(1000)
    } else {
      /** 打开浏览器新窗口，发送自定义信息 */
      await new Promise<void>(reslove => {
        chrome.runtime.sendMessage(
          { action: 'openChatPage', jobData: item, chatMessage, intervalTime },
          msg => {
            commProgress.updateCurrentJob(index, msg?.[0]?.result)
            /** 进入下一个循环 */
            reslove()
          }
        )
      })
    }
  }
}

/** 初始化boss直聘网站 content 脚本 */
export const bossInit = () => {
  /** 因为直接在content脚本中无法部分window属性，所以需要单独插入一段脚本 */
  dom.query('body').create('script', {
    type: 'text/javascript',
    src: getResource('/content/boss/watchXhr.js'),
  })

  chrome.runtime.onMessage.addListener(
    async (message, sender, sendResponse) => {
      const { action, jobList, chatMessage, intervalTime } = message

      if (action === 'getFetchJobListOptions') {
        const fetchListOptions = JSON.parse(
          localStorage.getItem('fetchJobListOptions') || 'null'
        )
        sendResponse({ fetchListOptions })
      } else if (action === 'batchOpenChatPage') {
        batchOpenChatPage({ jobList, chatMessage, intervalTime })
      }
    }
  )
}
