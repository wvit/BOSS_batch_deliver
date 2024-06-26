import React, { memo } from 'react'
import { Alert, Popover, Space } from 'antd'

/** 头部提示栏 */
export const Header = memo(() => {
  const zhipinUrl = 'https://www.zhipin.com/web/geek/job-recommend'
  const githubUrl = 'https://github.com/wvit/BOSS_batch_deliver.git'

  return (
    <Alert
      message={
        <>
          将根据Boss直聘网站，
          <Popover content={`点击跳转至：${zhipinUrl}`}>
            <a href={zhipinUrl} target="_blank">
              推荐职位页面
            </a>
          </Popover>
          中，展示的职位列表和筛选条件进行查询。
          <Popover
            trigger={['click']}
            content={
              <div className="w-[500px]">
                <Space direction="vertical" size="large">
                  <p>
                    1、当您跳转到推荐职位页面后，页面会展示【推荐职位】或您自己添加【求职期望】，这时候打开插件，职位列表就是当前网站中展示职位列表。
                  </p>
                  <p>
                    2、在添加自定义打招呼消息文案后，然后开始批量沟通已选中职位，这时候会自动打开一个最小化浏览器窗口帮您自动发送沟通消息。
                  </p>
                  <p>
                    3、如果你在平台配置过【打招呼语】，那么将不会使用在插件中配置的自定义消息。
                    并且批量沟通的进度也比发送自定义消息要快，因为会少几个处理步骤。
                  </p>
                  <p>
                    4、请注意您当日沟通的职位数量，因为Boss直聘平台对每日沟通数量有限制，大概在
                    80 多个。建议批量沟通超过最好不要超过 70
                    个，因为如果你再看到心动的职位，会陷入“您沟通的职位已达当日上限”。
                  </p>
                  <p>
                    5、如果在使用过程中出现问题，您可以尝试网页或重新加载插件。本插件不会记录和获取你在招聘平台的任何用户信息，请放心使用。
                    这是插件的代码仓库地址：
                    <a href={githubUrl} target="_blank">
                      {githubUrl}
                    </a>
                  </p>
                </Space>
              </div>
            }
          >
            <a className=" ml-4">【更多说明】</a>
          </Popover>
        </>
      }
      type="info"
      closable
    />
  )
})
