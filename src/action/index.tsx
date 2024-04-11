import React, { useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { ConfigProvider, Button } from 'antd'
import zhCN from 'antd/locale/zh_CN'
import { Boss } from './Boss'
import { Header } from './Header'
import './index.css'

const App = () => {
  const [bossVisible, setBossVisible] = useState(false)

  /** 获取当前选中的浏览器标签页数据 */
  const getCurrentTabData = async () => {
    const { url } = (await chrome.tabs.query({ active: true }))[0]
    const isZhipin = /^https?:\/\/(?:www\.)?zhipin\.com(?:\/.*)?$/.test(url)
    setBossVisible(isZhipin)
  }

  useEffect(() => {
    getCurrentTabData()
  }, [])

  return (
    <ConfigProvider locale={zhCN}>
      <div className="w-[800px] h-[600px] p-2 box-border bg-[#f9f9f9] flex flex-col">
        <Header />
        {bossVisible ? (
          <Boss />
        ) : (
          <p className=" text-base mt-4">
            您当前似乎不在BOSS网站，需要
            <Button
              type="link"
              href="https://www.zhipin.com/web/geek/job-recommend"
              target="_blank"
              className="text-base"
            >
              跳转
            </Button>
            过去吗
          </p>
        )}
      </div>
    </ConfigProvider>
  )
}

createRoot(document.querySelector('#app') as any).render(<App />)
