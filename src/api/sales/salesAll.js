import request from '@/utils/request'
//项目组销量管理*查询*
export function BdMonthGoal(params) {
  return request({
    url: 'api/reportCompanyMonthGoal',
    params,
    method: 'get'
  })
}
//项目组销量管理*新增*
export function AddMonthGoal(data) {
  return request({
    url: 'api/reportCompanyMonthGoal',
    method: 'post',
    data
  })
}
//项目组销量管理*修改*
export function UpdateMonthGoal(data) {
  return request({
    url: 'api/reportCompanyMonthGoal',
    data,
    method: 'put'
  })
}
//项目组销量管理*删除*
export function DeleteMonthGoal() {
  return request({
    url: 'api/reportCompanyMonthGoal',
    method: 'delete'
  })
}
//项目组销量管理*导入模板*
export function importorderdataAPi(data) {
  return request({
    url: 'api/report/importorderdata',
    method: 'POST',
    data,
    // headers: {
    //   'Content-Type': 'multipart/form-data;boundary=--------------------------752686129664336765872926' // 设置请求头为 multipart/form-data
    // }
  })
}
//闪电站项目组销量进度数据
export function BdprojectTeam(params) {
  return request({
    url: 'api/report/get_pro_project_team',
    params,
    method: 'get'
  })
}
//项目组销量进度数据(全部)
export function BdprojectTeamall(params) {
  return request({
    url: 'api/report/get_pro_project_team_main_all',
    params,
    method: 'get'
  })
}
//项目组销量进度数据分子公司(从表)
export function BdprojectTeamallcompany(params) {
  return request({
    url: 'api/report/get_pro_project_team_details_company',
    params,
    method: 'get'
  })
}

