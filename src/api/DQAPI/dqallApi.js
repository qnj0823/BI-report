import request from '@/utils/request'
//大区低温系列前十与后十站点排名*全部*
export function companylowApi(params) {
  return request({
    url: 'api/subcompanyreport/get_pro_sub_company_low_temperature',
    params,
    method: 'get'
  })
}
//分子公司新老品--ncc*全部*
export function fgsnewoldApi(params) {
  return request({
    url: 'api/subcompanyreport/get_pro_project_team_new_old_product_sq_ncc',
    params,
    method: 'get'
  })
}
//返回全部(订单频次与数量)*
export function fgsorderrateApi(params) {
  return request({
    url: 'api/subcompanyreport/get_pro_product_ncc_order_rate_count',
    params,
    method: 'get'
  })
}
//返回全部(单品省区--ncc销售订单)
export function fgonesellsqApi(params) {
  return request({
    url: 'api/subcompanyreport/get_pro_product_one_sell_sq_ncc',
    params,
    method: 'get'
  })
}

//返回全部(目标、销量、环比)
export function ordersqrateApi(params) {
  return request({
    url: 'api/subcompanyreport/get_pro_product_ncc_order_sq_rate',
    params,
    method: 'get'
  })
}
//返回全部(单品)
export function indexsqnccApi(params) {
  return request({
    url: 'api/subcompanyreport/get_pro_product_one_sell_index_sq_ncc',
    params,
    method: 'get'
  })
}
//返回全部(单品 bip)
export function indexsqnccbipApi(params) {
  return request({
    url: 'api/subcompanyreport/get_pro_product_one_sell_index_sq_bip',
    params,
    method: 'get'
  })
}
//获取地级市当日销量
export function cityTodayApi(params) {
  return request({
    url: 'api/subcompanyreport/get_city_today_order_city',
    params,
    method: 'get'
  })
}
//返回全部(站点同期数据)
export function periodDataApi(params) {
  return request({
    url: 'api/report/get_pro_site_same_period_data_ncc',
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


