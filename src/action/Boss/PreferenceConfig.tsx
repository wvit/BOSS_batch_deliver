import React, { memo } from 'react'
import { Space, Select, Checkbox, Spin, Popover, Input } from 'antd'
import { getArr } from '@/utils'

export type PreferenceType = {
  /** 每页加载数量 */
  pageSize: number
  /** 和职位招聘人打招呼的文案 */
  chatMessage: string
  /** 是否排除添加公司列表 */
  excludeCompany: boolean
  /** 是否排除猎头顾问职位 */
  excludeHeadhunter: boolean
  /** 是否排除已沟通过的职位 */
  excludeComm: boolean
  /** 是否排除JD内容中包含关键字的职位 */
  excludeKeyword: boolean
  /** 需要排除的公司名称列表 */
  companyNames: string[]
  /** 需要排除的内容关键词列表 */
  keywords: string[]
}

export interface PreferenceConfigProps {
  /** 职位列表数据 */
  jobList: any[]
  /** 请求职位详情时的状态数据 */
  fetchDetailStatus: { loading?: boolean; progress?: number }
  /** 获取当前职位禁用状态 */
  getDisableStatus: (
    jobData: any,
    preferenceKey?: keyof PreferenceType
  ) => boolean
  /** 获取偏好设置指定属性 */
  getPreference: <T extends keyof PreferenceType>(key: T) => PreferenceType[T]
  /** 修改偏好设置数据方法 */
  onChange: <T extends keyof PreferenceType>(
    key: T,
    value: PreferenceType[T]
  ) => void
}

/** 默认偏好配置 */
export const defaultPreference: PreferenceType = {
  pageSize: 30,
  chatMessage: '',
  excludeHeadhunter: false,
  excludeCompany: true,
  excludeComm: true,
  excludeKeyword: true,
  companyNames: [],
  keywords: [],
}

/** 偏好设置页面内容 */
export const PreferenceConfig = memo((props: PreferenceConfigProps) => {
  const {
    jobList,
    fetchDetailStatus,
    getPreference,
    getDisableStatus,
    onChange,
  } = props

  /** 获取标签选择器可选项列表 */
  const getTagOptions = (list: string[]) => {
    const listSet = Array.from(new Set(list))
    return listSet.map(item => ({ label: item, value: item }))
  }

  /** 渲染已排除的列表项 */
  const renderExcludeList = (preferenceKey: keyof PreferenceType) => {
    if (!getPreference(preferenceKey)) return

    const filterList = jobList
      .filter(item => getDisableStatus(item, preferenceKey))
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
            已排除第 {filterList} 项
          </div>
        }
      >
        <a className=" text-xs">(已排除 {filterList.length} 项)</a>
      </Popover>
    )
  }

  return (
    <Space direction="vertical" size="large" className="h-0 flex-1">
      <div className="flex items-center">
        <span className="flex-shrink-0 mr-2">沟通文案</span>
        <Input.TextArea
          value={getPreference('chatMessage')}
          onChange={e => onChange('chatMessage', e.target.value)}
          placeholder="请输入与招聘人打招呼的文案"
          autoSize={{ minRows: 3, maxRows: 6 }}
        />
      </div>
      <div>
        <Space>
          每页加载
          <Select
            className="min-w-16"
            size="small"
            options={getArr(4).map(item => {
              const count = (item + 1) * 15
              return { label: `${count}条`, value: count }
            })}
            value={getPreference('pageSize')}
            onChange={e => onChange('pageSize', e)}
          />
          条数据
        </Space>
      </div>
      <div>
        <Checkbox
          checked={getPreference('excludeHeadhunter')}
          onChange={e => onChange('excludeHeadhunter', e.target.checked)}
        >
          排除猎头顾问
        </Checkbox>
        {renderExcludeList('excludeHeadhunter')}
      </div>

      <div>
        <Checkbox
          checked={getPreference('excludeCompany')}
          onChange={e => onChange('excludeCompany', e.target.checked)}
        >
          排除下列公司
        </Checkbox>
        {renderExcludeList('excludeCompany')}
        <Select
          mode="tags"
          className="w-[100%] mt-1"
          placeholder="请输入需要排除的公司名称"
          value={getPreference('companyNames')}
          onChange={e => onChange('companyNames', e)}
          options={getTagOptions(jobList.map(item => item.brandName))}
        />
      </div>

      <Spin
        spinning={fetchDetailStatus?.loading}
        tip={`正在加载${fetchDetailStatus?.progress}%`}
      >
        <Space direction="vertical" size="large" className="w-[100%]">
          <div>
            <Checkbox
              checked={getPreference('excludeComm')}
              onChange={e => onChange('excludeComm', e.target.checked)}
            >
              排除已沟通过的职位
            </Checkbox>
            {renderExcludeList('excludeComm')}
          </div>

          <div>
            <Checkbox
              checked={getPreference('excludeKeyword')}
              onChange={e => onChange('excludeKeyword', e.target.checked)}
            >
              排除内容中包含下列关键字的职位
            </Checkbox>
            {renderExcludeList('excludeKeyword')}
            <Select
              mode="tags"
              className="w-[100%] mt-1"
              placeholder="请输入需要排除的JD内容关键字"
              value={getPreference('keywords')}
              onChange={e => onChange('keywords', e)}
              options={getTagOptions(['外派', '外包', '出差', '抗压'])}
            />
          </div>
        </Space>
      </Spin>
    </Space>
  )
})
