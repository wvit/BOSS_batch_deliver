import React from 'react'
import { Modal, Progress } from 'antd'

/** 批量沟通进度 */
class CommProgress {
  /** 弹窗调用返回值 */
  modal = null as unknown as ReturnType<typeof Modal.info>

  /** 职位列表 */
  jobList: any[] = []

  /** 打开批量沟通进度弹窗 */
  open(jobList: any[]) {
    this.jobList = jobList

    this.modal = Modal.info({
      width: 800,
      okText: '关闭弹窗',
      title: (
        <>
          批量沟通职位进度
          <span className=" text-[#666] text-sm">
            （关闭弹窗将停止批量沟通）
          </span>
        </>
      ),
      content: this.renderContent(),
    })
  }

  /** 更新当前正在处理的职位 */
  updateCurrentJob = (currentIndex: number) => {
    const jobItem = document.querySelector(`#job-item-${currentIndex + 1}`)

    this.modal.update({
      content: this.renderContent(currentIndex),
    })
    jobItem?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }

  /** 渲染弹窗内容 */
  renderContent(currentIndex = 0) {
    const currentJob = this.jobList[currentIndex]
    const currentSort = currentIndex + 1
    const listLength = this.jobList.length
    const done = listLength === currentSort
    const percent = Math.min(Math.ceil((100 / listLength) * currentSort), 100)

    return (
      <div>
        <div className="mt-5">
          {!done && (
            <div>
              正在处理第 {currentSort} 项：
              <span className="font-medium" title={currentJob.brandName}>
                {currentJob.brandName}
              </span>
              {'>'}
              <span className="text-[#00a6a7]" title={currentJob.jobName}>
                {currentJob.jobName}
              </span>
            </div>
          )}
          <Progress
            percent={percent}
            status={done ? 'success' : 'active'}
            size={['100%', 10]}
          />
        </div>

        <ul className="max-h-[300px] overflow-x-auto my-4 pr-4">
          {this.jobList.map((item, index) => {
            const {
              jobName,
              brandName,
              areaDistrict,
              businessDistrict,
              salaryDesc,
            } = item
            const sort = index + 1

            return (
              <li
                id={`job-item-${sort}`}
                className="flex justify-between mb-2"
                style={{
                  opacity: currentSort > sort || done ? '0.5' : '',
                }}
              >
                <p className="flex">
                  <span>{sort}、</span>
                  <span
                    className="font-medium truncate max-w-[200px]"
                    title={brandName}
                  >
                    {brandName}
                  </span>
                  {'>'}
                  <span
                    className="text-[#00a6a7] truncate max-w-[300px]"
                    title={jobName}
                  >
                    {jobName}
                  </span>
                  {'>'}
                  <span className="text-[#fe574a]">{salaryDesc}</span>
                </p>
                <span
                  className="truncate max-w-[150px]"
                  title={`${areaDistrict}·${businessDistrict}`}
                >
                  {areaDistrict}·{businessDistrict}
                </span>
              </li>
            )
          })}
        </ul>
      </div>
    )
  }
}

export const commProgress = new CommProgress()
