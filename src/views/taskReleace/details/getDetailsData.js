import { showtaskDetialsList } from '@/api/task'
/**
 * 获取下发任务详情页面信息
 */
export const getDetailsDatas = (data) => {
  return new Promise((resolve, reject) => {
    showtaskDetialsList({
      ...data
    }).then(res => {
      if (res.success) {
        resolve(res.data)
      } else {
        this.$message.error('刷新重试')
      }
    })
  })
}
