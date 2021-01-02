import request from '@/utils/request.js'

// 登录
export function loginin(data) {
  return request({
    url: 'public/zdbyc/doLogin.do',
    method: 'post',
    params: data
  })
}

// 获取登录角色信息
export function getInfo(token) {
  return request({
    url: '/rmui-pc/user/info',
    method: 'post',
    data: token
  })
}
// 退出登录
export function logout() {
  return request({
    url: 'risen/pub/doLogout.action',
    method: 'post'
  })
}
