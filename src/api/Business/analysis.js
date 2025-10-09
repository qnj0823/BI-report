import request from '@/utils/request'

//返回全部(分公司管理层销量、利润贡献汇总--271)*
export function nccorder271API(params) {
  return request({
    url: 'api/subcompanyreport/pro_product_ncc_order_271',
    params,
    method: 'get'
  })
}

//返回全部(费用总表)*
export function rebaterecordAPI(params) {
  return request({
    url: 'api/subcompanyreport/get_pro_rebate_record',
    params,
    method: 'get'
  })
}
//返回全部(销售订单与采购成本)
export function ordercostAPI(params) {
  return request({
    url: 'api/subcompanyreport/get_pro_product_order_cost',
    params,
    method: 'get'
  })
}
//返回全部(费用明细表)
export function recorddetailsAPI(params) {
  return request({
    url: 'api/subcompanyreport/get_pro_rebate_record_details',
    params,
    method: 'get'
  })
}
//返回全部(销售订单赠品)
export function ordergiftAPI(params) {
  return request({
    url: 'api/subcompanyreport/get_pro_product_ncc_order_gift',
    params,
    method: 'get'
  })
}
//返回全部(净销售明细表)
export function salesclearlyAPI(params) {
  return request({
    url: 'api/subcompanyreport/get_pro_order_sales_clearly',
    params,
    method: 'get'
  })
}
//红平台基础数据导入
export function RedimportorderdataAPi(data) {
  return request({
    url: 'api/trackRedPlatform/importorderdata',
    method: 'POST',
    data,
    // headers: {
    //   'Content-Type': 'multipart/form-data;boundary=--------------------------752686129664336765872926' // 设置请求头为 multipart/form-data
    // }
  })
}
//查询红平台基础数据导入表
export function trackRedPlatformAPI(params) {
  return request({
    url: 'api/trackRedPlatform',
    params,
    method: 'get'
  })
}
//红平台（订单执行情况统计表）
export function redplatformAPI(params) {
  return request({
    url: 'api/subcompanyreport/get_pro_red_platform',
    params,
    method: 'get'
  })
}
//客户产品费用表
export function productmoneyAPI(params) {
  return request({
    url: 'api/subcompanyreport/get_pro_bip_cust_product_rebate_money',
    params,
    method: 'get'
  })
}
//数据字典的使用
export function getdictDetailAPI(params) {
  return request({
    url: 'api/dictDetail',
    params,
    method: 'get'
  })
}
//获取省区
export function gettracksqAPI(params) {
  return request({
    url: 'api/subcompanyreport/get_track_sq',
    params,
    method: 'get'
  })
}
//查询LOOK每日计划数据
export function getDailyPlanAPI(params) {
  return request({
    url: 'api/trackLookDailyPlan',
    params,
    method: 'get'
  })
}
//新增LOOK每日计划数据
export function getDailyPlanaddAPI(data) {
  return request({
    url: 'api/trackLookDailyPlan',
    data,
    method: 'post'
  })
}
//修改LOOK每日计划数据
export function getDailyPlanupdataAPI(data) {
  return request({
    url: 'api/trackLookDailyPlan',
    data,
    method: 'put'
  })
}
//LOOK每日计划数据
export function lookdailyplanAPI(params) {
  return request({
    url: 'api/subcompanyreport/get_pro_track_look_daily_plan',
    params,
    method: 'get'
  })
}
// // /查询中国行政区域
// export function getebSystemCityAPI(params) {
//   return request({
//     url: 'api/ebSystemCity',
//     params,
//     method: 'get'
//   })
// }
// // 新增中国行政区域
// export function getebSystemCityaddAPI(data) {
//   return request({
//     url: 'api/ebSystemCity',
//     data,
//     method: 'post'
//   })
// }
//新增附件表
export function reportUserFileAPI(data) {
  return request({
    url: 'api/reportUserFile',
    data,
    method: 'post'
  })
}
//订单模版导入(订单专员)
export function reportOrderTemplateAPi(data) {
  return request({
    url: 'api/reportOrderTemplate/importorderdata',
    method: 'POST',
    data,
    // headers: {
    //   'Content-Type': 'multipart/form-data;boundary=--------------------------752686129664336765872926' // 设置请求头为 multipart/form-data
    // }
  })
}
// 查询报表
export function TemplategetAPI(params) {
  return request({
    url: 'api/reportOrderTemplate',
    params,
    method: 'get'
  })
}
// 计算
export function gcomputerAPI(params) {
  return request({
    url: 'api/reportOrderTemplate/computer',
    params,
    method: 'get'
  })
}
/**
 * 获取下载地址列表
 * @param pram
 */
export function reporgeturllistAPi(params) {
  return request({
    url: 'api/reportOrderTemplate/geturllist',
    method: 'GET',
    params
  })
}
/**
 * 订单任务数据填充列表
 * @param pram
 */
export function exceloutAPi(params) {
  return request({
    url: 'api/reportOrderTemplate/exceloutproduct',
    method: 'GET',
    params
  })
}
//新增分子公司行政城市配置表
export function figCompanyCityAPI(data) {
  return request({
    url: 'api/configCompanyCity',
    data,
    method: 'post'
  })
}