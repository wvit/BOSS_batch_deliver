import React, { useEffect, useState } from 'react'
import { Alert, Row, Col, Button, Popconfirm } from 'antd'
import { local, axios, getArr, sleep } from '@/utils'
import { PreferenceConfig, defaultPreference } from './PreferenceConfig'
import { JobList } from './JobList'
import type { PreferenceType, PreferenceConfigProps } from './PreferenceConfig'
import { resourceUsage } from 'process'

type FetchJobListOptionsType = {
  /** 请求方法 */
  methods: string
  /** 请求地址 */
  url: string
  /** 请求参数 */
  params: Record<string, any>
}

/** Boss直聘网站页面 */
export const Boss = () => {
  const [fetchJobListOptions, setFetchJobListOptions] =
    useState<FetchJobListOptionsType>()
  const [fetchListStatus, setFetchListStatus] = useState({
    loading: false,
    progress: 0,
  })
  const [fetchDetailStatus, setFetchDetailStatus] = useState({
    loading: false,
    progress: 0,
  })
  const [jobList, setJobList] = useState<any[]>([])
  const [jobDetailMap, setJobDetailMap] = useState({})
  const [currentPageNo, setCurrentPageNo] = useState(0)
  const [preference, setPreference] =
    useState<PreferenceType>(defaultPreference)

  /** 获取偏好设置指定属性 */
  const getPreference: PreferenceConfigProps['getPreference'] = key => {
    return { ...defaultPreference, ...preference }[key]
  }

  /** 获取当前职位禁用状态 */
  const getDisableStatus: PreferenceConfigProps['getDisableStatus'] = (
    jobData,
    preferenceKey
  ) => {
    const { bossTitle, encryptJobId, brandName } = jobData
    const jobDetail = jobDetailMap[encryptJobId]
    const { relationInfo, jobInfo } = jobDetail || {}
    const disableStatus = {
      excludeComm: relationInfo?.beFriend,
      excludeHeadhunter: bossTitle.includes('猎头顾问'),
      excludeCompany: getPreference('companyNames').includes(brandName),
      excludeKeyword: !!getPreference('keywords').find(item => {
        const jd = jobInfo?.postDescription.replace(/\s/g, '')
        const pattern = new RegExp(item.replace(/\s/g, ''), 'i')
        return pattern.test(jd)
      }),
    }
    const disableList = Object.keys(disableStatus).map(key => {
      return getPreference(key as keyof PreferenceType) && disableStatus[key]
    })

    /** 根据指定的偏好设置，获取当前的职位的禁用状态 */
    if (preferenceKey) return disableStatus[preferenceKey]

    /** 根据所有的偏好设置，判断当前是否是否应该禁用 */
    return disableList.includes(true)
  }

  /** 允许正常操作的职位列表 */
  const allowList = jobList.filter(item => !getDisableStatus(item))

  /** 选中的职位列表 */
  const checkedList = allowList.filter(item => item.checked)

  /** 发起多次请求，直到返回数据列表达到指定数量 */
  const fetchPageSize = async (request: (params: any) => Promise<any>) => {
    const pageNoList = getArr(getPreference('pageSize') / 15)
    const maxPageNo = pageNoList.length
    let list: any[] = []

    for (const pageNo of pageNoList) {
      const thisPageNo = pageNo + 1
      const res = await request(currentPageNo + thisPageNo)

      list = [...list, ...res]
      setFetchListStatus(prevState => ({
        ...prevState,
        progress: Math.min(Math.ceil(100 / maxPageNo) * thisPageNo, 100),
      }))

      await sleep(200)
    }

    setCurrentPageNo(currentPageNo + maxPageNo)
    return list
  }

  /** 请求岗位列表 */
  const fetchJobList = async () => {
    if (!fetchJobListOptions) return
    setFetchListStatus(prevState => ({ ...prevState, loading: true }))
    const { url, params } = fetchJobListOptions
    const pageList = await fetchPageSize(async pageNo => {
      const res = await axios.get(url, {
        params: { ...params, page: pageNo },
      })
      return res?.zpData?.jobList || []
    })
    const mergeList = [...jobList, ...pageList].map((item, index) => ({
      ...item,
      sort: index + 1,
    }))

    setFetchListStatus(prevState => ({ ...prevState, loading: false }))
    setJobList(mergeList)
    await fetchJobListDetail(pageList)
    console.log('职位数据', pageList, jobDetailMap)
  }

  /** 获取职位列表详情 */
  const fetchJobListDetail = async (list: any[]) => {
    setFetchDetailStatus(prevState => ({ ...prevState, loading: true }))

    for (const [index, item] of list.entries()) {
      const { securityId, lid, encryptJobId } = item
      const res = await axios.get('/wapi/zpgeek/job/detail.json', {
        params: { securityId, lid },
      })

      jobDetailMap[encryptJobId] = res?.zpData
      setFetchDetailStatus(prevState => ({
        ...prevState,
        progress: Math.min(Math.ceil(100 / list.length) * (index + 1), 100),
      }))

      await sleep(100)
    }

    setFetchDetailStatus(prevState => ({ ...prevState, loading: false }))
    setJobDetailMap({ ...jobDetailMap })
  }

  /** 发送message事件 */
  const sendMessage = (message, callback?) => {
    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
      if (!tabs[0]?.id) return
      chrome.tabs.sendMessage(tabs[0].id, message, callback)
    })
  }

  /** 改变偏好配置数据 */
  const changePreference: PreferenceConfigProps['onChange'] = (key, value) => {
    const config = { ...preference, [key]: value }
    setPreference(config)
    local.set({ preference: config })
  }

  useEffect(() => {
    local.get('preference').then(setPreference)

    sendMessage({ action: 'getFetchJobListOptions' }, msg => {
      setFetchJobListOptions(msg?.fetchListOptions)
    })
  }, [])

  useEffect(() => {
    fetchJobList()
  }, [fetchJobListOptions])

  return (
    <div className="h-[100%] flex flex-col">
      <Alert
        message="将根据当前网站页面展示的职位列表和筛选条件进行查询"
        type="info"
        closable
      />
      <Row className="my-2 h-0 flex-1">
        <Col span={13} className="h-[100%] flex flex-col ">
          <JobList
            jobList={jobList}
            jobDetailMap={jobDetailMap}
            allowList={allowList}
            checkedList={checkedList}
            fetchListStatus={fetchListStatus}
            getDisableStatus={getDisableStatus}
            fetchJobList={fetchJobList}
            onChange={setJobList}
          />
        </Col>
        <Col
          span={11}
          className="pl-2 border border-t-0 border-r-0 border-b-0 border-dashed border-[#999] flex flex-col"
        >
          <PreferenceConfig
            jobList={jobList}
            fetchDetailStatus={fetchDetailStatus}
            getDisableStatus={getDisableStatus}
            getPreference={getPreference}
            onChange={changePreference}
          />
          <div className="footer-btns text-right">
            <Popconfirm
              title="是否确认执行?"
              description="请注意每个平台的每天最大沟通聊天限制"
              onConfirm={() => {
                sendMessage({
                  action: 'batchOpenChatPage',
                  chatMessage: getPreference('chatMessage'),
                  jobList: checkedList,
                })
                window.close()
              }}
            >
              <Button type="primary">沟通已选中职位</Button>
            </Popconfirm>
          </div>
        </Col>
      </Row>
    </div>
  )
}
