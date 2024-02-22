import React, { useEffect, useState } from 'react'
import { Alert, Space, Select, Row, Col, Spin, Checkbox } from 'antd'
import { axios } from '@/utils'

export const Boss = () => {
  const [fetchJobListData, setFetchJobListData] = useState<any>(null)
  const [jobList, setJobList] = useState<any[]>([])
  const [config, setConfig] = useState({
    pageSize: 50,
    excludeHeadhunter: true,
  })

  const { pageSize, excludeHeadhunter } = config

  /** 获取职位列表项禁用状态 */
  const getDisableStatus = item => {
    return item.bossTitle.includes('猎头顾问') && excludeHeadhunter
  }

  /** 允许正常操作的职位列表 */
  const allowList = jobList.filter(item => !getDisableStatus(item))

  /** 选中的职位列表 */
  const checkedList = allowList.filter(item => item.checked)

  /** 请求岗位列表 */
  const fetchJobList = async () => {
    const { url, params } = fetchJobListData
    const res = await axios.get(url, { params })
    const list = res?.zpData?.jobList || []
    const { encryptBossId, encryptJobId, securityId, lid } = list[0]

    setJobList(list)

    console.log(111111, list)

    // await axios.post('/wapi/zpgeek/friend/add.json', {
    //   params: {
    //     securityId,
    //     lid,
    //     encryptJobId,
    //   },
    // })

    // sendMessage(
    //   {
    //     action: 'openChatPage',
    //     url: `/web/geek/chat?id=${encryptBossId}&jobId=${encryptJobId}&securityId=${securityId}&lid=${lid}`,
    //   },
    //   msg => {}
    // )
  }

  /** 发送message事件 */
  const sendMessage = (message, callback) => {
    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
      if (!tabs[0]?.id) return
      chrome.tabs.sendMessage(tabs[0].id, message, callback)
    })
  }

  /** 渲染职位列表项 */
  const renderJobItem = (item: any, index) => {
    const {
      jobName,
      brandName,
      skills,
      areaDistrict,
      businessDistrict,
      salaryDesc,
      checked,
    } = item
    const disabled = getDisableStatus(item)

    return (
      <li
        className="flex p-2 rounded mb-2 card-item bg-white text-xs"
        style={{
          border: '1px solid #f0f0f0',
          pointerEvents: disabled ? 'none' : 'auto',
          opacity: disabled ? '0.4' : '',
        }}
      >
        <Checkbox
          checked={checked && !disabled}
          className=" shrink-0 mr-2 relative w-4 "
          onChange={e => {
            item.checked = e.target.checked
            setJobList([...jobList])
          }}
        >
          <span className="absolute p-0 left-0 top-[-2px] text-[12px]">
            {index + 1}、
          </span>
        </Checkbox>
        <div className=" w-0 flex-1">
          <div className="flex justify-between">
            <p className="flex">
              <span
                className="font-medium truncate max-w-[100px]"
                title={brandName}
              >
                {brandName}
              </span>
              {'>'}
              <span
                className="text-[#00a6a7] truncate max-w-[100px]"
                title={jobName}
              >
                {jobName}
              </span>
              {'>'}
              <span className="text-[#fe574a]">{salaryDesc}</span>
            </p>
            <span
              className="truncate max-w-[100px]"
              title={`${areaDistrict}·${businessDistrict}`}
            >
              {areaDistrict}·{businessDistrict}
            </span>
          </div>
          <div className="flex justify-between items-center mt-3">
            <p className=" leading-[22px] overflow-x-auto whitespace-nowrap">
              {skills.map(item => {
                return (
                  <span className=" text-[#666] bg-[#ededed] p-1 rounded mr-1">
                    {item}
                  </span>
                )
              })}
            </p>
            <a className=" shrink-0 pl-2">详情</a>
          </div>
        </div>
      </li>
    )
  }

  useEffect(() => {
    sendMessage({ action: 'getFetchJobListData' }, msg => {
      setFetchJobListData(msg?.fetchListData)
    })
  }, [])

  useEffect(() => {
    if (fetchJobListData) fetchJobList()
  }, [fetchJobListData])

  return (
    <div className="h-[100%] flex flex-col">
      <Alert
        message="将根据当前网站页面展示的职位列表和筛选条件进行查询"
        type="info"
        closable
      />
      <Row className="my-2 h-0 flex-1">
        <Col span={14} className="h-[100%] flex flex-col ">
          <div className=" pl-2 mb-2 font-medium">
            <Checkbox
              indeterminate={
                !!checkedList.length && checkedList.length < allowList.length
              }
              checked={
                !!allowList.length && checkedList.length === allowList.length
              }
              onChange={e => {
                jobList.forEach(item => (item.checked = e.target.checked))
                setJobList([...jobList])
              }}
            >
              全选
            </Checkbox>
          </div>
          <ul className=" h-[100%] overflow-x-auto pr-2">
            {jobList.map(renderJobItem)}
          </ul>
        </Col>
        <Col
          span={10}
          className="pl-2 border border-t-0 border-r-0 border-b-0 border-dashed border-[#999]"
        >
          <div>
            <Space>
              每页加载
              <Select
                className="min-w-16"
                size="small"
                options={[{ label: '50条', value: 50 }]}
                defaultValue={pageSize}
              />
              条数据
            </Space>
          </div>

          <div className=" mt-4">
            <Checkbox
              checked={excludeHeadhunter}
              onChange={e => {
                setConfig({ ...config, excludeHeadhunter: e.target.checked })
              }}
            >
              排除猎头/顾问
            </Checkbox>
          </div>
        </Col>
      </Row>
    </div>
  )
}
