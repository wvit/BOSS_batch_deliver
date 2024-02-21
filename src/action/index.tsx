import React from 'react'
import { createRoot } from 'react-dom/client'
import { Boss } from './Boss'
import './index.css'

const App = () => {
  return (
    <div className="w-[800px] h-[600px] p-2 box-border bg-[#f9f9f9]">
      <Boss />
    </div>
  )
}

createRoot(document.getElementById('app') as any).render(<App />)
