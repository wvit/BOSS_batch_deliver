import React from 'react'
import { Modal, Progress, Button } from 'antd'

/** 批量沟通进度 */
class CommProgress {
  /** 弹窗调用返回值 */
  modal = null as unknown as ReturnType<typeof Modal.info>

  /** 职位列表 */
  jobList: any[] = []

  /** 打开批量沟通进度弹窗 */
  open(options: { jobList: any[]; onClose: () => void; onStop: () => void }) {
    const { jobList, onClose, onStop } = options

    this.jobList = jobList

    this.modal = Modal.info({
      width: 800,
      title: (
        <>
          批量沟通职位进度
          <span className=" text-[#666] text-sm">
            （关闭弹窗将停止批量沟通）
          </span>
        </>
      ),
      footer: (
        <div className=" text-right">
          <Button className=" mr-4" onClick={onStop}>
            停止发送消息
          </Button>
          <Button
            type="primary"
            onClick={() => {
              onClose?.()
              this.modal.destroy()
            }}
          >
            关闭弹窗
          </Button>
        </div>
      ),
      content: this.renderContent(-1),
    })
  }

  /** 更新当前正在处理的职位 */
  updateCurrentJob = (endIndex: number, status: string) => {
    const jobItem = document.querySelector(`#job-item-${endIndex + 1}`)

    /** 添加沟通状态 */
    this.jobList[endIndex].commStatus = status
    this.modal.update({
      content: this.renderContent(endIndex),
    })
    jobItem?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }

  /** 渲染弹窗内容 */
  renderContent(endIndex: number) {
    /** endIndex 为上一次处理结束的数据索引，currentIndex 为正在处理的数据索引 */
    const currentIndex = endIndex + 1
    /** 正在处理的职位数据 */
    const currentJob = this.jobList[currentIndex]
    /** 正在处理的职位顺序值 */
    const currentSort = currentIndex + 1
    const listLength = this.jobList.length
    const done = currentSort > listLength
    const percent = Math.min(Math.ceil((100 / listLength) * currentIndex), 100)

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
              commStatus,
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
                <div className="flex">
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
                </div>
                <div className="flex">
                  <span
                    className="truncate max-w-[150px] mr-2"
                    title={`${areaDistrict}·${businessDistrict}`}
                  >
                    {areaDistrict}·{businessDistrict}
                  </span>
                  {commStatus === 'error' && (
                    <span className=" text-red-600">处理失败</span>
                  )}
                  {commStatus === 'success' && (
                    <span className=" text-green-600">处理完成</span>
                  )}
                </div>
              </li>
            )
          })}
        </ul>
      </div>
    )
  }
}

export const commProgress = new CommProgress()
