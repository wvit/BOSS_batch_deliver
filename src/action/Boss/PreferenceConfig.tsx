import React, { memo } from 'react'
import { Space, Select, Checkbox, Spin, Popover } from 'antd'
import { getArr } from '@/utils'

export type PreferenceType = {
  /** 每页加载数量 */
  pageSize: number
  /** 是否排除猎头顾问职位 */
  excludeHeadhunter: boolean
  /** 是否排除已沟通过的职位 */
  excludeComm: boolean
}

export interface PreferenceConfigProps {
  /** 职位列表数据 */
  jobList: any[]
  /** 职位详情数据 */
  jobDetailMap: Record<string, any>
  /** 请求职位详情时的状态数据 */
  fetchDetailStatus: { loading?: boolean; progress?: number }
  /** 偏好配置数据 */
  preference: PreferenceType
  /** 修改偏好设置数据方法 */
  onChange: (
    key: keyof PreferenceType,
    value: PreferenceType[keyof PreferenceType]
  ) => void
}

/** 默认偏好配置 */
export const defaultPreference: PreferenceType = {
  pageSize: 30,
  excludeHeadhunter: false,
  excludeComm: true,
}

/** 偏好设置页面内容 */
export const PreferenceConfig = memo((props: PreferenceConfigProps) => {
  const { preference, jobList, jobDetailMap, fetchDetailStatus, onChange } =
    props
  const { pageSize, excludeHeadhunter, excludeComm } = preference || {}

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

  return (
    <Space direction="vertical" size="large" className="h-0 flex-1">
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
            value={pageSize}
            onChange={e => onChange?.('pageSize', e)}
          />
          条数据
        </Space>
      </div>
      <div>
        <Checkbox
          checked={excludeHeadhunter}
          onChange={e => onChange?.('excludeHeadhunter', e.target.checked)}
        >
          排除猎头顾问
        </Checkbox>
        {excludeHeadhunter &&
          renderExcludeList(item => {
            return item.bossTitle.includes('猎头顾问')
          })}
      </div>

      <Spin
        spinning={fetchDetailStatus?.loading}
        tip={`正在加载${fetchDetailStatus?.progress}%`}
      >
        <div>
          <Checkbox
            checked={excludeComm}
            onChange={e => onChange?.('excludeComm', e.target.checked)}
          >
            排除已沟通过的职位
          </Checkbox>
          {excludeComm &&
            renderExcludeList(item => {
              const jobDetail = jobDetailMap?.[item.encryptJobId]
              return jobDetail?.relationInfo?.beFriend
            })}
        </div>
      </Spin>
    </Space>
  )
})
