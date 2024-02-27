import React, { memo } from 'react'
import { Checkbox, Spin, Button } from 'antd'

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
  /** 获取当前职位是否为禁用状态 */
  getDisableStatus: (jobData: any) => boolean
  /** 请求职位列表 */
  fetchJobList: () => void
  /** 职位列表数据改变事件 */
  onChange: (jobList: any[]) => void
}

/** 职位列表页面内容 */
export const JobList = memo((props: JobListProps) => {
  const {
    jobList,
    checkedList,
    allowList,
    fetchListStatus,
    getDisableStatus,
    fetchJobList,
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
