import { Modal } from 'ant-design-vue'

// 开发提示弹窗
export function developing() {
  Modal.warning({
    title: '功能开发中',
    centered: true,
    okText: '确定'
  })
}

// 操作成功弹窗
export function save_success(callback) {
  let secondsToGo = 3
  const modal = Modal.success({
    title: '操作成功',
    content: `${secondsToGo}秒后关闭`,
    centered: true,
    okText: '确定',
    onOk: () => {
      if (callback) {
        callback()
      }
    }
  })
  const timer = setInterval(() => {
    secondsToGo -= 1
    modal.update({
      content: `${secondsToGo}秒后关闭`
    })
  }, 1000)
  setTimeout(() => {
    clearInterval(timer)
    modal.destroy()
    if (callback) {
      callback()
    }
  }, secondsToGo * 1000)
}

// 表单校验弹窗
export function form_validate() {
  Modal.error({
    title: '表单输入有误',
    centered: true,
    okText: '确定'
  })
}

// 关闭页面
export function win_close() {
  window.opener = window
  var win = window.open('', '_self')
  win.close()
  // frame的时候
  top.close()
}

// 检验内容
export function formatVal(value) {
  if (value === '' || value === undefined || value === null) {
    return false
  }
  return true
}

// 监听新窗口关闭并刷新主页面
export function closeAndRefresh(path) {
  var winObj = path
  var loop = setInterval(function() {
    if (winObj.closed) {
      alert(1)
      clearInterval(loop)
    }
  }, 1000)
}

// 不允许删除
export function del_row(msg) {
  Modal.error({
    title: msg,
    centered: true,
    okText: '确定'
  })
}
