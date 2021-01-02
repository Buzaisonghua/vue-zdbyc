import request from '@/utils/request.js'
// 路由权限
export function operatorMenu(data) {
  return request({
    url: 'risen/pub/operatorMenu.do?strMap.key= ZDBYC&strMap.type=T,C,N',
    method: 'post',
    params: data
  })
}

// 权限配置-查看
export function orguserbindAllList(data) {
  return request({
    url: 'risen/orguserbind/orguserBindView.do',
    method: 'post'
    // params: data
  })
}

// 权限配置-编辑
export function orguserbindEdit(data) {
  return request({
    url: 'risen/orguserbind/orguserbindEdit.do',
    method: 'post',
    params: data
  })
}

