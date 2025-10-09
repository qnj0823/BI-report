import request from '@/utils/request'
//入库账号管理*pts*
export function LevelAccountone(params) {
    return request({
      url: 'api/vPtsAccountDetails/all',
      params,
      method: 'get'
    })
  }
  //客户站点订单*pts*
export function PtslDetailsone(params) {
  return request({
    url: 'api/report/get_pro_product_pts_site_order_details',
    params,
    method: 'get'
  })
}
 //错误码入库*pts*
 export function Ptserrcufgisone(params) {
  return request({
    url: 'api/report/get_pro_product_pts_sal_errcufgi',
    params,
    method: 'get'
  })
}
//常温订单*pts*
export function PtsNomalone(params) {
  return request({
    url: 'api/report/get_pro_product_pts_order_sale_out',
    params,
    method: 'get'
  })
}
//入库统计表*pts*
export function PtsNomalinout(params) {
  return request({
    url: 'api/report/get_pro_product_pts_order_sale_inout',
    params,
    method: 'get'
  })
}