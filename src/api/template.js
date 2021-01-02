export const temUrl = 'http://60.191.64.3:8601/zdbyc'

// 下发模板预览
export const getTemplateDetails = (data) => {
  window.open(`${temUrl}/web/risen/form/popup/formView.html?uuid=${data}`)
}
