import request from '@/utils/request.js'
// 单位/部门通讯录
export function loadCmmTreeCoreOrganization(data) {
  return request({
    isFormData: true,
    url: 'public/zdbyc/loadCmmTreeCoreOrganization.do',
    method: 'post',
    data: data
  })
}
//
// 人员
export function loadCmmTreeCoreOrgTree(data) {
  return request({
    isFormData: true,
    url: 'public/zdbyc/loadCmmTreeCoreOrgTree',
    method: 'post',
    data: data
  })
}
