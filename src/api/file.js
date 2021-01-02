import request from '@/utils/request.js'
// 单文件上传
export function loadFile(data) {
  return request({
    url: 'public/meeting/loadFile.do?CMD=UF',
    method: 'post',
    data: data
  })
}
// 下载
export function downLoadFile(params) {
  return request({
    url: 'public/meeting/loadFile.do',
    method: 'get',
    params: params
  })
}
// 预览
export function pdf_view(params) {
  return request({
    url: 'public/risen/core/resrc/view/pdf_view.html.do',
    method: 'get',
    params: params
  })
}

// 删除
export function delFile(params) {
  return request({
    url: 'risen/core/resrc/file/removeCoreResrcFileByIdList.do',
    isFormData: true,
    method: 'get',
    params: params
  })
}
