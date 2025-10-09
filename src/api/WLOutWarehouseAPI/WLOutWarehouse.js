import request from '@/utils/request'
//查询Ncc系统订单
export function NccOrderApi(params) {
  return request({
    url: 'api/trackNccOrder',
    params,
    method: 'get'
  })
}
//产品基础*查询*
export function TtrackProductAdd(params) {
  return request({
    url: 'api/trackProduct',
    params,
    method: 'get'
  })
}

//返回全部(ncc推pts订单出库)
export function ptsNccOrderApi(params) {
  return request({
    url: 'api/ptsNccOrder/get_pts_ncc_order',
    params,
    method: 'get'
  })
}
//出库推送订单数据到PTS
export function pullOrderPtsApi(params) {
  return request({
    url: 'api/ptsNccOrder/pull_order_to_pts',
    params,
    method: 'get'
  })
}

//返回全部(ncc推pts订单已出库)
export function ptsNccOrderStopApi(params) {
  return request({
    url: 'api/ptsNccOrder/get_pts_ncc_order_stop',
    params,
    method: 'get'
  })
}

//出库推送订单数据到PTS(删除)
export function DelOrderPtsApi(params) {
  return request({
    url: 'api/ptsNccOrder/del_pull_order_to_pts',
    params,
    method: 'get'
  })
}

// //通过主单号删除NCC推订单到PTS
// export function DelOrderNCCApi(params) {
//   return request({
//     url: 'api/ptsNccOrder/deleteMainPtsNccOrder',
//     params,
//     method: 'get'
//   })
// }

//通过主单号删除NCC推订单到PTS
export function DelOrderNCCApi(data) {
  return request({
    url: 'api/ptsNccOrder/deleteMainPtsNccOrder',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
}

//新增NCC推订单到BI,BI审核后推PTS(发货单)
export function APIptsnccSendADD(data) {
  return request({
    url: 'api/ptsNccOrderSend',
    data,
    method: 'post'
  })
}

//返回全部(出库订单明细)
export function APIptsnccorderSend(params) {
  return request({
    url: 'api/ptsNccOrder/get_pts_ncc_order_send',
    params,
    method: 'get'
  })
}

//返回全部(入库统计明细表)
export function APIptsinoutdetails(params) {
  return request({
    url: 'api/report/get_pro_product_pts_order_sale_inout_details',
    params,
    method: 'get'
  })
}

//返回全部(入库统计明细表)
export function APIorderissend(params) {
  return request({
    url: 'api/ptsNccOrder/get_pts_ncc_order_issend',
    params,
    method: 'get'
  })
}


