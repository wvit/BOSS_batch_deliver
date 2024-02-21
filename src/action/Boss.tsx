import React, { useEffect, useState } from 'react'
import { Alert, Space, Select, Row, Col, Spin } from 'antd'
import { axios } from '@/utils'

export const Boss = () => {
  const [fetchListData, setFetchListData] = useState<any>(null)
  const [jobList, setJobList] = useState([])
  const [config, setConfig] = useState({ pageSize: 50 })

  /** 请求岗位列表 */
  const fetchJobList = async () => {
    const { url, params } = fetchListData
    const res = await axios.get(url, { params })
    const list = res?.zpData?.jobList || []

    setJobList(list)
    console.log(11111, res)
  }

  /** 绑定message事件 */
  const bindMessage = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
      if (!tabs[0]?.id) return
      chrome.tabs.sendMessage(
        tabs[0].id,
        { action: 'getFetchListData' },
        res => {
          setFetchListData(res?.fetchListData)
        }
      )
    })
  }

  useEffect(() => {
    bindMessage()
  }, [])

  useEffect(() => {
    if (fetchListData) fetchJobList()
  }, [fetchListData])

  return (
    <div className="h-[100%] flex flex-col">
      <Alert
        message="将根据当前页面职位列表和筛选条件进行查询"
        type="info"
        closable
      />
      <Row className="my-2 h-0 flex-1">
        <Col span={14} className="h-[100%] overflow-x-auto">
          <ul>
            {jobList.map(item => {
              const {
                jobName,
                jobExperience,
                jobDegree,
                skills,
                cityName,
                areaDistrict,
                businessDistrict,
                salaryDesc,
              } = item

              return (
                <li
                  className=" p-2 rounded mb-2 card-item bg-white"
                  style={{
                    border: '1px solid #f0f0f0',
                  }}
                >
                  <span>{jobName}</span>
                </li>
              )
            })}
          </ul>
        </Col>
        <Col span={10} className="pl-4">
          <Space className="">
            每页加载
            <Select
              className="min-w-16"
              size="small"
              options={[{ label: '50条', value: 50 }]}
              defaultValue={config.pageSize}
            />
            条数据
          </Space>
        </Col>
      </Row>
    </div>
  )
}
