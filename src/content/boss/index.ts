import { Dom, getResource, axios, sleep } from '@/utils'
import { commProgress } from './CommProgress'
import './index.css'

/** 批量打开沟通聊天对话 */
const batchOpenChatPage = async jobList => {
  // const zp_token = (await axios.get('/wapi/zppassport/get/zpToken'))?.zpData
  //   ?.token
  // if (!zp_token) return

  commProgress.open(jobList)

  for (const [index, item] of jobList.entries()) {
    const { encryptJobId, securityId, lid } = item

    /** 更新批量沟通进度 */
    commProgress.updateCurrentJob(index)

    /** 将对方添加进联系人才可以发消息 */
    // await axios.post(
    //   '/wapi/zpgeek/friend/add.json',
    //   {},
    //   {
    //     /** 没有 zp_token 接口会报错 “请求不合法”  */
    //     headers: { zp_token },
    //     params: {
    //       securityId,
    //       lid,
    //       jobId: encryptJobId,
    //     },
    //   }
    // )

    await new Promise<void>(reslove => {
      chrome.runtime.sendMessage(
        { action: 'openChatPage', jobData: item },
        res => {
          console.log(11111111, res)
          /** 进入下一个循环 */
          reslove()
        }
      )
    })
  }
}

/** 初始化boss直聘网站 content 脚本 */
export const bossInit = () => {
  /** 因为直接在content脚本中无法部分window属性，所以需要单独插入一段脚本 */
  Dom.query('body').create('script', {
    type: 'text/javascript',
    src: getResource('/content/boss/watchXhr.js'),
  })

  chrome.runtime.onMessage.addListener(
    async (message, sender, sendResponse) => {
      const { action, jobList } = message

      if (action === 'getFetchJobListOptions') {
        const fetchListOptions = JSON.parse(
          localStorage.getItem('fetchJobListOptions') || 'null'
        )

        sendResponse({ fetchListOptions })
      } else if (action === 'batchOpenChatPage') {
        batchOpenChatPage(jobList)
      }
    }
  )
}
