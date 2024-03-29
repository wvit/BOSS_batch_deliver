import React, { memo, ReactNode } from 'react'
import { Checkbox, Spin, Button, Popover, Space } from 'antd'
import type { PreferenceConfigProps } from './PreferenceConfig'

export interface JobListProps {
  /** 职位列表数据 */
  jobList: any[]
  /** 已选中的职位列表 */
  checkedList: any[]
  /** 允许选择的职位列表 */
  allowList: any[]
  /** 职位详情数据 */
  jobDetailMap: Record<string, any>
  /** 请求职位详情时的状态数据 */
  fetchListStatus: { loading?: boolean; progress?: number }
  /** 获取当前职位禁用状态 */
  getDisableStatus: PreferenceConfigProps['getDisableStatus']
  /** 请求职位列表 */
  fetchJobList: () => void
  /** 渲染序号列表 */
  renderSortList: (list: any[]) => ReactNode
  /** 职位列表数据改变事件 */
  onChange: (jobList: any[]) => void
}

/** 职位列表页面内容 */
export const JobList = memo((props: JobListProps) => {
  const {
    jobList,
    checkedList,
    allowList,
    jobDetailMap,
    fetchListStatus,
    getDisableStatus,
    fetchJobList,
    renderSortList,
    onChange,
  } = props

  /** 渲染职位列表项 */
  const renderJobItem = (item: any) => {
    const {
      jobName,
      brandName,
      skills,
      areaDistrict,
      businessDistrict,
      encryptJobId,
      salaryDesc,
      checked,
      sort,
    } = item
    const disabled = getDisableStatus(item)
    const { jobInfo, bossInfo } = jobDetailMap[encryptJobId] || {}
    const { address, postDescription } = jobInfo || {}
    const { activeTimeDesc } = bossInfo || {}

    return (
      <li
        id={`card-item-${sort}`}
        className="flex p-2 rounded mb-2 card-item bg-white text-xs"
        style={{
          border: '1px solid #f0f0f0',
          opacity: disabled ? '0.4' : '',
        }}
      >
        <Checkbox
          checked={checked && !disabled}
          className=" shrink-0 mr-2 relative w-4 "
          onChange={e => {
            item.checked = e.target.checked
            onChange([...jobList])
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
          <div className="flex justify-between items-center mt-2">
            <p className=" leading-[22px] overflow-x-auto whitespace-nowrap">
              {skills.map(item => {
                return (
                  <span className=" text-[#666] bg-[#ededed] p-1 rounded mr-1">
                    {item}
                  </span>
                )
              })}
            </p>

            <Popover
              content={
                <Space
                  direction="vertical"
                  size="large"
                  className=" max-w-[500px] max-h-[300px] overflow-auto m-1"
                >
                  <div>
                    <strong>招聘者活跃度：</strong>
                    <span className=" text-xs text-[#333]">
                      {activeTimeDesc}
                    </span>
                  </div>
                  <div>
                    <strong>详细地址：</strong>
                    <span className=" text-xs text-[#333]">{address}</span>
                  </div>
                  <div>
                    <strong>职位描述：</strong>
                    <p className=" text-xs text-[#333]">
                      <pre>{postDescription}</pre>
                    </p>
                  </div>
                </Space>
              }
            >
              <a className=" shrink-0 pl-2">详情</a>
            </Popover>
          </div>
        </div>
      </li>
    )
  }

  return (
    <>
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
            onChange([...jobList])
          }}
        >
          全选
        </Checkbox>

        {!!checkedList?.length && (
          <Popover
            content={
              <div className="max-w-[300px] max-h-[200px] overflow-y-auto">
                已选择第{renderSortList(checkedList)}项
              </div>
            }
          >
            <a className=" text-xs">(已选择 {checkedList.length} 项)</a>
          </Popover>
        )}
      </div>

      <Spin
        wrapperClassName="h-0 flex-1"
        spinning={fetchListStatus.loading}
        tip={`正在加载${fetchListStatus.progress}%`}
      >
        <ul className=" h-[100%] overflow-x-auto pr-2">
          {jobList.map(renderJobItem)}
          <li className=" text-center">
            <Button size="small" onClick={fetchJobList}>
              加载下一页
            </Button>
          </li>
        </ul>
      </Spin>
    </>
  )
})
