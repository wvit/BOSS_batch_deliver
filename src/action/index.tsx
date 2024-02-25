import React from 'react'
import { createRoot } from 'react-dom/client'
import { ConfigProvider } from 'antd'
import zhCN from 'antd/locale/zh_CN'
import { Boss } from './Boss'
import './index.css'

const App = () => {
  return (
    <ConfigProvider locale={zhCN}>
      <div className="w-[800px] h-[600px] p-2 box-border bg-[#f9f9f9]">
        <Boss />
      </div>
    </ConfigProvider>
  )
}

createRoot(document.getElementById('app') as any).render(<App />)
