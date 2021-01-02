import request from '@/utils/request.js'

// 模板管理-列表
export function templateListApi(data) {
  return request({
    url: 'risen/template/templateListApi.do',
    method: 'post',
    params: data
  })
}

// 模板管理-标记
export function templateUpsignApi(data) {
  return request({
    url: 'risen/template/templateUpsignApi.do',
    method: 'post',
    params: data
  })
}

// 模板管理-详情
export function templateDetailApi(data) {
  return request({
    url: 'risen/template/templateDetailApi.do',
    method: 'post',
    params: data
  })
}

// 2.6.模板管理-启用/禁用
export function templateUpstatusApi(data) {
  return request({
    url: 'risen/template/templateUpstatusApi.do',
    method: 'post',
    params: data
  })
}

// 2.7.模板管理-共享/取消共享
export function templateUpSharestatusApi(data) {
  return request({
    url: 'risen/template/templateUpSharestatusApi.do',
    method: 'post',
    params: data
  })
}

// 2.2.表单保存
export function templateAddFormApi(data) {
  return request({
    url: 'risen/template/templateAddFormApi.do',
    method: 'post',
    params: data
  })
}

// 2.3.模板管理-保存
export function templateAddApi(data) {
  return request({
    url: 'risen/template/templateAddApi.do',
    method: 'post',
    params: data
  })
}

// 2.1.模板管理-模板名称校验唯一
export function templateNameCheckApi(data) {
  return request({
    url: 'risen/template/templateNameCheckApi',
    method: 'post',
    params: data
  })
}
