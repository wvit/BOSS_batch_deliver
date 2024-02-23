import React, { useEffect, useState } from 'react'
import {
  Alert,
  Space,
  Select,
  Row,
  Col,
  Spin,
  Checkbox,
  Popover,
  Button,
} from 'antd'
import { axios } from '@/utils'

export const Boss = () => {
  const [fetchJobListData, setFetchJobListData] = useState<any>(null)
  const [jobList, setJobList] = useState<any[]>([])
  const [jobDetailMap, setJobDetailMap] = useState({})
  const [fetchListLoading, setFetchListLoading] = useState(false)
  const [fetchDetailLoading, setFetchDetailLoading] = useState(false)
  const [config, setConfig] = useState({
    /** 每页数量 */
    pageSize: 50,
    /** 排除猎头职位 */
    excludeHeadhunter: true,
    /** 排除已沟通过的职位 */
    excludeComm: true,
  })

  const { pageSize, excludeHeadhunter, excludeComm } = config

  /** 获取职位列表项禁用状态 */
  const getDisableStatus = item => {
    const { bossTitle, encryptJobId } = item
    const jobDetail = jobDetailMap[encryptJobId]
    const { beFriend } = jobDetail?.relationInfo || {}

    return (
      (excludeHeadhunter && bossTitle.includes('猎头顾问')) ||
      (excludeComm && beFriend)
    )
  }

  /** 允许正常操作的职位列表 */
  const allowList = jobList.filter(item => !getDisableStatus(item))

  /** 选中的职位列表 */
  const checkedList = allowList.filter(item => item.checked)

  /** 请求岗位列表 */
  const fetchJobList = async () => {
    setFetchListLoading(true)
    const { url, params } = fetchJobListData
    const res = await axios.get(url, { params })
    const list = res?.zpData?.jobList || []
    const mergeList = [...jobList, ...list].map((item, index) => ({
      ...item,
      sort: index + 1,
    }))

    setFetchListLoading(false)
    setJobList(mergeList)
    await fetchJobListDetail(list)

    console.log(list, jobDetailMap)
  }

  /** 获取职位列表详情 */
  const fetchJobListDetail = async list => {
    setFetchDetailLoading(true)

    for (const item of list) {
      const { securityId, lid, encryptJobId } = item
      const res = await axios.get('/wapi/zpgeek/job/detail.json', {
        params: { securityId, lid },
      })

      jobDetailMap[encryptJobId] = res?.zpData
    }

    setFetchDetailLoading(false)
    setJobDetailMap({ ...jobDetailMap })
  }

  /** 发送message事件 */
  const sendMessage = (message, callback?) => {
    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
      if (!tabs[0]?.id) return
      chrome.tabs.sendMessage(tabs[0].id, message, callback)
    })
  }

  /** 渲染已排除的列表项 */
  const renderExcludeList = (rule: (item: any) => boolean) => {
    const filterList = jobList
      .filter(item => rule(item))
      .map((item, index) => {
        const { sort } = item
        return (
          <>
            {!!index && '、'}
            <a
              onClick={() => {
                const cardItem = document.querySelector(`#card-item-${sort}`)
                cardItem?.scrollIntoView({ behavior: 'smooth' })
              }}
            >
              {sort}
            </a>
          </>
        )
      })

    return (
      <Popover
        content={
          <div className="max-w-[300px] max-h-[200px] overflow-y-auto">
            已排除 {filterList} 项
          </div>
        }
      >
        <a>(已排除 {filterList.length} 项)</a>
      </Popover>
    )
  }

  /** 渲染职位列表项 */
  const renderJobItem = (item: any) => {
    const {
      jobName,
      brandName,
      skills,
      areaDistrict,
      businessDistrict,
      salaryDesc,
      checked,
      sort,
    } = item
    const disabled = getDisableStatus(item)

    return (
      <li
        id={`card-item-${sort}`}
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
            {sort}、
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

  /** 渲染页面左边区域内容 */
  const renderLeftContent = () => {
    return (
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
          <Spin spinning={fetchListLoading} className="pt-[100px]">
            {jobList.map(renderJobItem)}
          </Spin>
        </ul>
      </Col>
    )
  }

  /** 渲染页面右边区域内容 */
  const renderRightContent = () => {
    return (
      <Col
        span={10}
        className="pl-2 border border-t-0 border-r-0 border-b-0 border-dashed border-[#999] flex flex-col"
      >
        <Space direction="vertical" size="large" className="h-0 flex-1">
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
          <div>
            <Checkbox
              checked={excludeHeadhunter}
              onChange={e => {
                setConfig({ ...config, excludeHeadhunter: e.target.checked })
              }}
            >
              排除猎头顾问
            </Checkbox>
            {excludeHeadhunter &&
              renderExcludeList(item => {
                return item.bossTitle.includes('猎头顾问')
              })}
          </div>

          <Spin spinning={fetchDetailLoading}>
            <div>
              <Checkbox
                checked={excludeComm}
                onChange={e => {
                  setConfig({ ...config, excludeComm: e.target.checked })
                }}
              >
                排除已沟通过的职位
              </Checkbox>
              {excludeComm &&
                renderExcludeList(item => {
                  const jobDetail = jobDetailMap[item.encryptJobId]
                  return jobDetail?.relationInfo?.beFriend
                })}
            </div>
          </Spin>
        </Space>

        <div className="footer-btns text-right">
          <Button
            type="primary"
            onClick={() => {
              sendMessage({ action: 'openChatPage', jobList: checkedList })
            }}
          >
            沟通已选中职位
          </Button>
        </div>
      </Col>
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
        {renderLeftContent()}
        {renderRightContent()}
      </Row>
    </div>
  )
}
