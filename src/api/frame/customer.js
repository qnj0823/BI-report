import request from '@/utils/request'
//客户表*分页*
export function BdCustomer(params) {
  return request({
    url: 'api/vTrackBdCustomer',
    params,
    method: 'get'
  })
}
//客户表*全部*
export function BdallCustomer(params) {
  return request({
    url: 'api/vTrackBdCustomer/all',
    params,
    method: 'get'
  })
}
//客户/站点*分页*
export function SiteCustomer(params) {
  return request({
    url: 'api/vTrackBdCustomerSite',
    params,
    method: 'get'
  })
}
//客户/站点*全部2025*
export function SiteallCustomer(params) {
  return request({
    url: 'api/vTrackBdCustomerSite/all',
    params,
    method: 'get'
  })
}
//客户/站点*全部2024*
export function SiteallhistoryCustomer(params) {
  return request({
    url: 'api/vTrackBdCustomerSite/siteallhistory',
    params,
    method: 'get'
  })
}
//物料管理*查询*
export function bdMaterialall(params) {
  return request({
    url: 'api/trackBdMaterial',
    params,
    method: 'get'
  })
}

//物料管理*查询*
export function varbdMaterialall(data) {
  return request({
    url: 'api/trackBdMaterial/queryTrackBdMaterialView',
    data,
    method: 'post'
  })
}

//产品分类*查询*
export function BdtrackProductClass(params) {
  return request({
    url: 'api/trackProductClass/all',
    params,
    method: 'get'
  })
}
//产品分类*新增*
export function TrackProductClassAdd(data) {
  return request({
    url: 'api/trackProductClass',
    data,
    method: 'post'
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
//产品基础*新增*
export function BdtrackProduct(data) {
  return request({
    url: 'api/trackProduct',
    data,
    method: 'post'
  })
}
//返回全部产品数据*
export function ProdStoreDetailsAll(params) {
  return request({
    url: 'api/vTrackWmsProdStoreDetails/all',
    params,
    method: 'get'
  })
}
//大区产品系列统计*
export function vProductXiDqAll(params) {
  return request({
    url: 'api/report/get_pro_project_team_product_xi_dq_ncc',
    params,
    method: 'get'
  })
}

//大区产品系列统计*
export function vProductXiDqAll1(params) {
  return request({
    url: 'api/report/get_pro_project_team_product_xi_dq',
    params,
    method: 'get'
  })
}
//分子公司产品系列统计*
export function vProductXiCompanyAll(params) {
  return request({
    url: 'api/report/get_pro_project_team_product_xi_company_ncc',
    params,
    method: 'get'
  })
}
//分子公司产品系列统计*
export function vProductXiCompanyAll1(params) {
  return request({
    url: 'api/report/get_pro_project_team_product_xi_company',
    params,
    method: 'get'
  })
}
//分子公司产品前十系列统计*
export function projectteamtopAll(params) {
  return request({
    url: 'api/report/get_pro_project_team_top_company_ncc',
    params,
    method: 'get'
  })
}
//新老品营销部*
export function newoldproductAll(params) {
  return request({
    url: 'api/report/get_pro_project_team_new_old_product_ncc',
    params,
    method: 'get'
  })
}
//新老品分子公司*
export function newoldcompanyAll(params) {
  return request({
    url: 'api/report/get_pro_project_team_new_old_product_company_ncc',
    params,
    method: 'get'
  })
}
//返回全部(全部单品大区)*
export function productoneselldq(params) {
  return request({
    url: 'api/report/get_pro_product_one_sell_dq_ncc',
    params,
    method: 'get'
  })
}
//返回全部(全部单品大区bip)*
export function productonesellbipdq(params) {
  return request({
    url: 'api/report/get_pro_product_one_sell_dq',
    params,
    method: 'get'
  })
}
//返回全部(全部单品分公司)*
export function productonesellcompany(params) {
  return request({
    url: 'api/report/get_pro_product_one_sell_company_ncc',
    params,
    method: 'get'
  })
}
//返回全部(全部单品分公司 bip)*
export function productonesellcompanybip(params) {
  return request({
    url: 'api/report/get_pro_product_one_sell_company',
    params,
    method: 'get'
  })
}
//返回全部(单品大区内页)*
export function productonesellindex(params) {
  return request({
    url: 'api/report/get_pro_product_one_sell_index',
    params,
    method: 'get'
  })
}
//返回全部(单品分子公司内页饼图)*
export function productonesedetails(params) {
  return request({
    url: 'api/report/get_pro_product_one_sell_details_ncc',
    params,
    method: 'get'
  })
}
//返回全部(单品站点)*
export function productonesellsite(params) {
  return request({
    url: 'api/report/get_pro_product_one_sell_site_ncc',
    params,
    method: 'get'
  })
}
//返回全部(单品站点 bip)*
export function productonesellsitebip(params) {
  return request({
    url: 'api/report/get_pro_product_one_sell_site_bip',
    params,
    method: 'get'
  })
}
//项目组销量进度数据(产品系列销售表站点--ncc)
export function productxisite(params) {
  return request({
    url: 'api/report/get_pro_project_team_product_xi_site_ncc',
    params,
    method: 'get'
  })
}
//返回全部(新老品销量站点--ncc)
export function newoldproductsite(params) {
  return request({
    url: 'api/report/get_pro_project_team_new_old_product_site_ncc',
    params,
    method: 'get'
  })
}
//返回全部(月度销量更进表站点--ncc)
export function productxisiteteam(params) {
  return request({
    url: 'api/report/get_pro_project_team_product_xi_site',
    params,
    method: 'get'
  })
}
//项目组销量进度数据(销售前十单位体下面的站点--ncc)
export function monthTensite(params) {
  return request({
    url: 'api/report/get_pro_project_team_top_site_ncc',
    params,
    method: 'get'
  })
}

//查询分子公司扩展表
export function CompanyTablelist(params) {
  return request({
    url: 'api/trackCompanyAttachedTable',
    params,
    method: 'get'
  })
}

//新增分子公司扩展表
export function CompanyTableadd(data) {
  return request({
    url: 'api/trackCompanyAttachedTable',
    method: 'post',
    data
  })
}

//修改分子公司扩展表
export function CompanyTable(data) {
  return request({
    url: 'api/trackCompanyAttachedTable',
    data,
    method: 'put'
  })
}

//查询站点扩展表
export function zdTablelist(params) {
  return request({
    url: 'api/trackSiteAttachedTable',
    params,
    method: 'get'
  })
}

//新增站点扩展表
export function zdTableadd(data) {
  return request({
    url: 'api/trackSiteAttachedTable',
    method: 'post',
    data
  })
}

//修改站点扩展表
export function zdTable(data) {
  return request({
    url: 'api/trackSiteAttachedTable',
    data,
    method: 'put'
  })
}

//查询销售区域扩展表
export function regTablelist(params) {
  return request({
    url: 'api/trackRegionAttachedTable',
    params,
    method: 'get'
  })
}

//新增销售区域扩展表
export function regTableadd(data) {
  return request({
    url: 'api/trackRegionAttachedTable',
    method: 'post',
    data
  })
}

//修改销售区域扩展表
export function regTable(data) {
  return request({
    url: 'api/trackRegionAttachedTable',
    data,
    method: 'put'
  })
}

//项目组销量管理*导入模板*
export function importcompanydataAPi(data) {
  return request({
    url: 'api/subcompanyreport/importdata',
    method: 'POST',
    data,
    // headers: {
    //   'Content-Type': 'multipart/form-data;boundary=--------------------------752686129664336765872926' // 设置请求头为 multipart/form-data
    // }
  })
}

//供应商价目管理全部
export function SupplierpriceApi(params) {
  return request({
    url: 'api/vTrackPurpSupplierprice/all',
    params,
    method: 'get'
  })
}

//查询省区采购价格设置返回全部的数据
export function SupplierpriceallApi(params) {
  return request({
    url: 'api/trackPurpSupplierpriceSq/all',
    params,
    method: 'get'
  })
}

//新增省区采购价格设置
export function SupplierpriceaddApi(data) {
  return request({
    url: 'api/trackPurpSupplierpriceSq',
    method: 'post',
    data
  })
}

//修改省区采购价格设置
export function SupplierpriceputApi(data) {
  return request({
    url: 'api/trackPurpSupplierpriceSq',
    data,
    method: 'put'
  })
}
//删除省区采购价格设置
export function SupplierpricedeletetApi() {
  return request({
    url: 'api/trackPurpSupplierpriceSq',
    method: 'delete'
  })
}

//站点人力*导入模板*
export function importcompanydatasiteAPi(data) {
  return request({
    url: 'api/subcompanyreport/importdatamansite',
    method: 'POST',
    data,
    // headers: {
    //   'Content-Type': 'multipart/form-data;boundary=--------------------------752686129664336765872926' // 设置请求头为 multipart/form-data
    // }
  })
}
//站点人力设置返回全部的数据
export function SupplierpricesiteallApi(params) {
  return request({
    url: 'api/trackSiteManAttachedTable/all',
    params,
    method: 'get'
  })
}

//新增站点销售订单合并表
export function newOldaddApi(data) {
  return request({
    url: 'api/newOldSiteMergeTable',
    method: 'post',
    data
  })
}

//修改站点销售订单合并表
export function newOldaddupdatApi(data) {
  return request({
    url: 'api/newOldSiteMergeTable',
    data,
    method: 'put'
  })
}
//查询站点销售订单合并表
export function newOldaddcheckApi(params) {
  return request({
    url: 'api/newOldSiteMergeTable',
    params,
    method: 'get'
  })
}
//删除站点销售订单合并表
export function newOldadddeleteApi(ids) {
  return request({
    url: 'api/newOldSiteMergeTable',
    method: 'delete',
    data: ids
  })
}

//新增物流--光明产品与工厂配置表
export function wlProductaddApi(data) {
  return request({
    url: 'api/wlProductOrFactorySet',
    method: 'post',
    data
  })
}
//查询物流--光明产品与工厂配置表
export function wlProductcheckApi(params) {
  return request({
    url: 'api/wlProductOrFactorySet',
    params,
    method: 'get'
  })
}

//修改光明产品与工厂配置表
export function wlProductupdataApi(data) {
  return request({
    url: 'api/wlProductOrFactorySet',
    data,
    method: 'put'
  })
}

//删除光明产品与工厂配置表
export function wlProductdeleteApi(ids) {
  return request({
    url: 'api/wlProductOrFactorySet',
    method: 'delete',
    data: ids
  })
}


//新增物流--集团产品与光明产品对应表
export function wlProductaFactddApi(data) {
  return request({
    url: 'api/wlJtproductOrFactoryproductSet',
    method: 'post',
    data
  })
}
//查询物流--集团产品与光明产品对应表
export function wlProductaFactcheckApi(params) {
  return request({
    url: 'api/wlJtproductOrFactoryproductSet',
    params,
    method: 'get'
  })
}
//修改集团产品与光明产品对应表
export function wlProductaFactupdataApi(data) {
  return request({
    url: 'api/wlJtproductOrFactoryproductSet',
    data,
    method: 'put'
  })
}
//删除光明产品与工厂配置表
export function wlProductaFactdeleteApi(ids) {
  return request({
    url: 'api/wlJtproductOrFactoryproductSet',
    method: 'delete',
    data: ids
  })
}

//返回全部(物流及开单表)
export function wlProductApi(params) {
  return request({
    url: 'api/report/get_pro_wl_product_or_factory',
    params,
    method: 'get'
  })
}
//返回全部(物流及开单表--导出EXCEL)
export function wlProductexcelApi(params) {
  return request({
    url: 'api/report/get_pro_wl_product_or_factory_excel',
    params,
    method: 'get'
  })
}
//返回全部(全国各单位体今年去年同期销量)
export function progressApi(params) {
  return request({
    url: 'api/report/get_pro_company_completion_progress',
    params,
    method: 'get'
  })
}

//返回全部(物流及开单表)
export function wlprofactApi(params) {
  return request({
    url: 'api/report/get_pro_wl_product_or_factory',
    params,
    method: 'get'
  })
}

//返回全部(已审核每日报单)
export function prosalesApi(params) {
  return request({
    url: 'api/report/get_pro_sales_fact_date_ncc',
    params,
    method: 'get'
  })
}

//返回全部(已审核每日报单)
export function prositeApi(params) {
  return request({
    url: 'api/report/get_pro_product_one_sell_site_ncc_daily_report',
    params,
    method: 'get'
  })
}

//返回全部(单品站点-每日报单)
export function sitenccApi(params) {
  return request({
    url: 'api/report/pro_product_one_sell_site_ncc_day',
    params,
    method: 'get'
  })
}

//项目组销量进度目标模版导入*
export function importMonthGoalAPi(data) {
  return request({
    url: 'api/reportCompanyMonthGoalTrack/importorderdata',
    method: 'POST',
    data,
    // headers: {
    //   'Content-Type': 'multipart/form-data;boundary=--------------------------752686129664336765872926' // 设置请求头为 multipart/form-data
    // }
  })
}

//查询全国分子公司任务目标
export function CompanyTrackcheckApi(params) {
  return request({
    url: 'api/reportCompanyMonthGoalTrack',
    params,
    method: 'get'
  })
}

//年度全国月份目标跟进汇总表
export function companygoalApi(params) {
  return request({
    url: 'api/report/get_company_goal',
    params,
    method: 'get'
  })
}

//全国分公司销售跟进表(销售费用)
export function companysalesApi(params) {
  return request({
    url: 'api/report/get_pro_product_one_sell_company_sales_sum_ncc',
    params,
    method: 'get'
  })
}

//查询订单到货周期设置
export function DeliveryCyclecheckApi(params) {
  return request({
    url: 'api/trackOrderDeliveryCycle',
    params,
    method: 'get'
  })
}
//新增订单到货周期设置
export function DeliveryCycleaddApi(data) {
  return request({
    url: 'api/trackOrderDeliveryCycle',
    method: 'post',
    data
  })
}
//修改订单到货周期设置
export function DeliveryCycleupdataApi(data) {
  return request({
    url: 'api/trackOrderDeliveryCycle',
    data,
    method: 'put'
  })
}
//删除订单到货周期设置
export function DeliveryCycledelApi(ids) {
  return request({
    url: 'api/trackOrderDeliveryCycle',
    method: 'delete',
    data: ids
  })
}
//项到货周期设置模版导入
export function DeliveryCycleimpordApi(data) {
  return request({
    url: 'api/trackOrderDeliveryCycle/importordercycledata',
    method: 'POST',
    data,
    // headers: {
    //   'Content-Type': 'multipart/form-data;boundary=--------------------------752686129664336765872926' // 设置请求头为 multipart/form-data
    // }
  })
}
//修改所有订单的到货日期
export function DeliveryCycleupallApi(data) {
  return request({
    url: 'api/trackOrderDeliveryCycle/updateordercycledata',
    method: 'post',
    data
  })
}

//返回全部,已审核(单品站点-每日报单(到货周期))
export function checkNccArrivalApi(params) {
  return request({
    url: 'api/report/pro_product_one_sell_site_ncc_day_arrival',
    params,
    method: 'get'
  })
}

//查询物流开单光明物流站点
export function BDSiteFactorycheckApi(params) {
  return request({
    url: 'api/bdSiteFactory',
    params,
    method: 'get'
  })
}

//新增物流开单光明物流站点
export function BDSiteFactoryaddApi(data) {
  return request({
    url: 'api/bdSiteFactory',
    method: 'post',
    data
  })
}
//修改物流开单光明物流站点
export function BDSiteFactoryupallApi(data) {
  return request({
    url: 'api/bdSiteFactory',
    method: 'post',
    data
  })
}
//删除订单到货周期设置
export function BDSiteFactorydelApi(ids) {
  return request({
    url: 'api/bdSiteFactory',
    method: 'delete',
    data: ids
  })
}

//返回全部(物流及开单表(新版)--导出EXCEL)
export function wlProductexcelnewApi(params) {
  return request({
    url: 'api/report/get_pro_wl_product_or_factory_excel_new',
    params,
    method: 'get'
  })
}

//返回全部(开单计划表(湖南正常单)--导出EXCEL)
export function wlProductexcelhnnApi(params) {
  return request({
    url: 'api/report/get_pro_wl_product_or_factory_excel_hunan_normal',
    params,
    method: 'get'
  })
}

//返回全部(开单计划表(湖南新鲜牧场)--导出EXCEL)
export function wlProductexcelhnmcApi(params) {
  return request({
    url: 'api/report/get_pro_wl_product_or_factory_excel_hunan',
    params,
    method: 'get'
  })
}

//返回全部(物流及开单表(湖北)--导出EXCEL)
export function wlProductexcelnewhbApi(params) {
  return request({
    url: 'api/report/get_pro_wl_product_or_factory_excel_new_hubei',
    params,
    method: 'get'
  })
}

//返回全部(物流及开单表(湖南)--导出EXCEL)
export function wlProductexcelnewhnApi(params) {
  return request({
    url: 'api/report/get_pro_wl_product_or_factory_excel_new_hunan',
    params,
    method: 'get'
  })
}


//返回全部(物流及开单表(湖北计划)--导出EXCEL)
export function wlProductexcelhbjhApi(params) {
  return request({
    url: 'api/report/get_pro_wl_product_or_factory_excel_new_plan_hubei',
    params,
    method: 'get'
  })
}

//返回全部(物流及开单表(湖北计划)--导出EXCEL--中百罗森)
export function wlProductexcelhbzbjhApi(params) {
  return request({
    url: 'api/report/get_pro_wl_product_or_factory_excel_new_plan_hubei_zbls',
    params,
    method: 'get'
  })
}


//返回全部(开单计划表(西南[云南])--导出EXCEL)
export function wlyunnanApi(params) {
  return request({
    url: 'api/report/get_pro_wl_product_or_factory_excel_xinan_normal_yunnan',
    params,
    method: 'get'
  })
}


//返回全部(物流及开单表(陕西)--导出EXCEL)
export function wlshanxiApi(params) {
  return request({
    url: 'api/report/get_pro_wl_product_or_factory_excel_new_shanxi',
    params,
    method: 'get'
  })
}
//返回全部(物流及开单表(陕西计划)--导出EXCEL)
export function wlshanxiPlanApi(params) {
  return request({
    url: 'api/report/get_pro_wl_product_or_factory_excel_new_plan_shanxi',
    params,
    method: 'get'
  })
}

//返回全部(物流及开单表(浙江计划)--导出EXCEL)
export function WlplanzhejiangApi(params) {
  return request({
    url: 'api/report/get_pro_wl_product_or_factory_excel_new_plan_zhejiang',
    params,
    method: 'get'
  })
}

//返回全部(物流及开单表(福建计划)--导出EXCEL)
export function WlplanfujianApi(params) {
  return request({
    url: 'api/report/get_pro_wl_product_or_factory_excel_new_plan_fujian',
    params,
    method: 'get'
  })
}

//返回全部(物流及开单表(江苏计划)--导出EXCEL
export function WlplanjiangsuApi(params) {
  return request({
    url: 'api/report/get_pro_wl_product_or_factory_excel_new_plan_jiangsu',
    params,
    method: 'get'
  })
}

//返回全部(物流及开单表(山东)--导出EXCEL)
export function wlSDOpenthenApi(params) {
  return request({
    url: 'api/report/get_pro_wl_product_or_factory_excel_new_shandong',
    params,
    method: 'get'
  })
}

//返回全部(物流及开单表(山东杭州仓计划)--导出EXCEL)
export function wlSDOpenthenotherApi(params) {
  return request({
    url: 'api/report/get_pro_wl_product_or_factory_excel_new_plan_other_shandong',
    params,
    method: 'get'
  })
}

//返回全部(物流及开单表(山东非杭州仓计划)--导出EXCEL)
export function wlSDOpenthenotherNoApi(params) {
  return request({
    url: 'api/report/get_pro_wl_product_or_factory_excel_new_plan_shandong',
    params,
    method: 'get'
  })
}


//返回全部(物流及开单表(山西计划与开单)--导出EXCEL)
export function wldataShanxiApi(params) {
  return request({
    url: 'api/report/get_pro_wl_product_or_factory_site_data_shanxi',
    params,
    method: 'get'
  })
}

//返回全部(物流及开单表(北京天津)--导出EXCEL)
export function wlnewBjtjApi(params) {
  return request({
    url: 'api/report/get_pro_wl_product_or_factory_excel_new_bjtj',
    params,
    method: 'get'
  })
}

//返回全部(物流及开单表(北京天津计划)--导出EXCEL)
export function wlnewBjtjPlanApi(params) {
  return request({
    url: 'api/report/get_pro_wl_product_or_factory_excel_new_bjtj_plan',
    params,
    method: 'get'
  })
}






//新增物流开单产品表
export function BDMaterialFactoryaddApi(data) {
  return request({
    url: 'api/bdMaterialFactory',
    method: 'post',
    data
  })
}
//修改物流开单光明物流站点
export function BDMaterialFactoryupallApi(data) {
  return request({
    url: 'api/bdMaterialFactory',
    method: 'post',
    data
  })
}
//删除订单到货周期设置
export function BDMaterialFactorydelApi(ids) {
  return request({
    url: 'api/bdMaterialFactory',
    method: 'delete',
    data: ids
  })
}
//查询物流开单光明物流站点
export function BDMaterialFactorycheckApi(params) {
  return request({
    url: 'api/bdMaterialFactory',
    params,
    method: 'get'
  })
}


//查询特殊物流站点数据归属
export function BDspicecheckApi(params) {
  return request({
    url: 'api/bdWlsiteFactoryConfig',
    params,
    method: 'get'
  })
}

//新增特殊物流站点数据归属
export function BDspiceaddApi(data) {
  return request({
    url: 'api/bdWlsiteFactoryConfig',
    method: 'post',
    data
  })
}
//修改殊物流站点数据归属
export function BDspiceupdataApi(data) {
  return request({
    url: 'api/bdWlsiteFactoryConfig',
    method: 'post',
    data
  })
}
//删除殊物流站点数据归属
export function BDspicedelApi(ids) {
  return request({
    url: 'api/bdWlsiteFactoryConfig',
    method: 'delete',
    data: ids
  })
}


//查询物流开单光明物流站点特殊站点物流到货日期
export function BDwldatecheckApi(params) {
  return request({
    url: 'api/bdWlsiteFactoryDateConfig',
    params,
    method: 'get'
  })
}

//新增物流开单光明物流站点特殊站点物流到货日期
export function BDwldateaddApi(data) {
  return request({
    url: 'api/bdWlsiteFactoryDateConfig',
    method: 'post',
    data
  })
}
//修改物流开单光明物流站点特殊站点物流到货日期
export function BDwldateupdateApi(data) {
  return request({
    url: 'api/bdWlsiteFactoryDateConfig',
    method: 'post',
    data
  })
}
//删除物流开单光明物流站点特殊站点物流到货日期
export function BDwldatedelApi(ids) {
  return request({
    url: 'api/bdWlsiteFactoryDateConfig',
    method: 'delete',
    data: ids
  })
}


//查询客户费用-金额
export function BipCustcheckApi(params) {
  return request({
    url: 'api/vTrackBipCustRebate',
    params,
    method: 'get'
  })
}




//查询物流站点与光明产品到货周期对应表
export function wlFacteprocheckApi(params) {
  return request({
    url: 'api/wlWlsiteOrFactoryproductDeliveryCycleSet/all',
    params,
    method: 'get'
  })
}

//新增物流站点与光明产品到货周期对应表
export function wlFacteproaddApi(data) {
  return request({
    url: 'api/wlWlsiteOrFactoryproductDeliveryCycleSet',
    method: 'post',
    data
  })
}
//修改物流站点与光明产品到货周期对应表
export function wlFacteproupdateApi(data) {
  return request({
    url: 'api/wlWlsiteOrFactoryproductDeliveryCycleSet',
    method: 'post',
    data
  })
}
//删除物流站点与光明产品到货周期对应表
export function wlFacteprodelApi(ids) {
  return request({
    url: 'api/wlWlsiteOrFactoryproductDeliveryCycleSet',
    method: 'delete',
    data: ids
  })
}




//查询物流报表管理(到货)-二次物流
export function wlFacteprocheckTwoApi(params) {
  return request({
    url: 'api/wlWlsiteOrFactoryproductDeliveryCycleSetSecond/all',
    params,
    method: 'get'
  })
}

//新增物流报表管理(到货)-二次物流
export function wlFacteproaddTwoApi(data) {
  return request({
    url: 'api/wlWlsiteOrFactoryproductDeliveryCycleSetSecond',
    method: 'post',
    data
  })
}
//修改物流报表管理(到货)-二次物流
export function wlFacteproupdateTwoApi(data) {
  return request({
    url: 'api/wlWlsiteOrFactoryproductDeliveryCycleSetSecond',
    method: 'post',
    data
  })
}
//删除物流报表管理(到货)-二次物流
export function wlFacteprodelTwoApi(ids) {
  return request({
    url: 'api/wlWlsiteOrFactoryproductDeliveryCycleSetSecond',
    method: 'delete',
    data: ids
  })
}



//新增退货单录入表
export function trackReturnGoodsadd(data) {
  return request({
    url: 'api/trackReturnGoods',
    data,
    method: 'post'
  })
}

//查询退货单录入表
export function trackReturnGoodscheck(params) {
  return request({
    url: 'api/trackReturnGoods/alltime',
    params,
    method: 'get'
  })
}

//修改退货单录入表
export function trackReturnGoodsedit(data) {
  return request({
    url: 'api/trackReturnGoods',
    method: 'post',
    data
  })
}
//删除退货单录入表
export function trackReturnGoodsdel(ids) {
  return request({
    url: 'api/trackReturnGoods',
    method: 'delete',
    data: ids
  })
}

//物流--物流站点与光明产品到货周期对应表(导入小月复盖)
export function importproCycleAPi(formData) {
  return request({
    url: 'api/wlWlsiteOrFactoryproductDeliveryCycleSet/importorderdata',
    method: 'POST',
    data: formData,
    // headers: { 'Content-Type': 'multipart/form-data' }
  })
}

//物流--物流站点与光明产品到货周期对应表(导入大月复盖)
export function importproCyclemaxAPi(formData) {
  return request({
    url: 'api/wlWlsiteOrFactoryproductDeliveryCycleSet/importorderdatamax',
    method: 'POST',
    data: formData,
    // headers: { 'Content-Type': 'multipart/form-data' }
  })
}



//物流--物流站点与光明产品到货周期对应表(导入追加)
export function importproCycleaddAPi(formData) {
  return request({
    url: 'api/wlWlsiteOrFactoryproductDeliveryCycleSet/importorderdataadd',
    method: 'POST',
    data: formData,
    
  })
}


//物流--物流站点与光明产品到货周期对应表特殊规则(导入追加)
export function importproCycleSpaceaddAPi(formData) {
  return request({
    url: 'api/wlWlsiteOrFactoryproductDeliveryCycleSetOther/importorderdataadd',
    method: 'POST',
    data: formData,
   
  })
}

//返回全部(物流及开单表(西南[四川、云南、重庆、贵州])--导出EXCEL)
export function wlexcelxinanApi(params) {
  return request({
    url: 'api/report/get_pro_wl_product_or_factory_excel_xinan',
    params,
    method: 'get'
  })
}

//返回全部(开单计划表(西南[四川、云南、重庆、贵州])--导出EXCEL)
export function wlexcelxinannormalApi(params) {
  return request({
    url: 'api/report/get_pro_wl_product_or_factory_excel_xinan_normal',
    params,
    method: 'get'
  })
}
//返回全部(物流及开单表(西南[四川、云南、重庆、贵州]大清新活力、小清新活力)--导出EXCEL)
export function wlexcelxinanqingxingApi(params) {
  return request({
    url: 'api/report/get_pro_wl_product_or_factory_excel_xinan_qingxing',
    params,
    method: 'get'
  })
}
//返回全部(开单计划表(西南[四川、云南、重庆、贵州]大清新活力、小清新活力)--导出EXCEL)
export function wlexcelxinanqingxingnorApi(params) {
  return request({
    url: 'api/report/get_pro_wl_product_or_factory_excel_xinan_normal_qingxing',
    params,
    method: 'get'
  })
}

//返回全部(物流表(长沙区域到货明细))
export function wlhunanarrivedApi(params) {
  return request({
    url: 'api/wlWlsiteOrFactoryproductOrderDeliveryCycle/get_pro_wl_product_or_factory_excel_new_hunan_arrived',
    params,
    method: 'get'
  })
}

//返回全部(物流及开单表(安徽)--导出EXCEL)
export function wlnewanhuiApi(params) {
  return request({
    url: 'api/report/get_pro_wl_product_or_factory_excel_new_anhui',
    params,
    method: 'get'
  })
}
//返回全部(物流及计划表(安徽)--导出EXCEL)
export function wlnewanhuiplanApi(params) {
  return request({
    url: 'api/report/get_pro_wl_product_or_factory_excel_new_plan_anhui',
    params,
    method: 'get'
  })
}

//返回全部(物流表(物流站点联系人))
export function wlsitepersonApi(params) {
  return request({
    url: 'api/report/get_pro_wl_product_or_factory_excel_new_hunan_contacts',
    params,
    method: 'get'
  })
}

//返回全部(物流及开单表(河南)--导出EXCEL)
export function wlnewhenanApi(params) {
  return request({
    url: 'api/report/get_pro_wl_product_or_factory_excel_new_henan',
    params,
    method: 'get'
  })
}

//返回全部(物流及开单表(河南计划)--导出EXCEL)
export function wlnewhenanplanApi(params) {
  return request({
    url: 'api/report/get_pro_wl_product_or_factory_excel_new_plan_henan',
    params,
    method: 'get'
  })
}

//返回全部(物流表(根据日期重新计算))
export function getrunArrivedApi(params) {
  return request({
    url: 'api/wlWlsiteOrFactoryproductOrderDeliveryCycle/get_runArrived',
    params,
    method: 'get'
  })
}

//返回全部(物流表(根据订单日期重新计算[湖南]))
export function getrunOrderArrivedApi(params) {
  return request({
    url: 'api/wlWlsiteOrFactoryproductOrderDeliveryCycle/get_runOrderArrived',
    params,
    method: 'get'
  })
}

//返回全部(物流表(根据订单日期重新计算[西南('四川','云南','贵州','重庆')]))
export function getrunOrderArrivedXINANApi(params) {
  return request({
    url: 'api/wlWlsiteOrFactoryproductOrderDeliveryCycle/get_runOrderArrived_xinan',
    params,
    method: 'get'
  })
}

//返回全部(物流表(根据订单日期重新计算[浙江]))
export function getrunArrivedZJApi(params) {
  return request({
    url: 'api/wlWlsiteOrFactoryproductOrderDeliveryCycle/get_runOrderArrived_zhejiang',
    params,
    method: 'get'
  })
}
//返回全部(物流表(根据订单日期重新计算[广西]))
export function getrunArrivedGXApi(params) {
  return request({
    url: 'api/wlWlsiteOrFactoryproductOrderDeliveryCycle/get_runOrderArrived_guangxi',
    params,
    method: 'get'
  })
}
//返回全部(物流表(根据订单日期重新计算[福建]))
export function getrunArrivedFJApi(params) {
  return request({
    url: 'api/wlWlsiteOrFactoryproductOrderDeliveryCycle/get_runOrderArrived_fujian',
    params,
    method: 'get'
  })
}

//返回全部(物流表(根据订单日期重新计算[安徽]))
export function getrunArrivedAHApi(params) {
  return request({
    url: 'api/wlWlsiteOrFactoryproductOrderDeliveryCycle/get_runOrderArrived_anhui',
    params,
    method: 'get'
  })
}

//返回全部(物流表(根据订单日期重新计算[江苏]))
export function getrunArrivedJSApi(params) {
  return request({
    url: 'api/wlWlsiteOrFactoryproductOrderDeliveryCycle/get_runOrderArrived_jiangsu',
    params,
    method: 'get'
  })
}


//返回全部(物流及开单表(广东)--导出EXCEL)
export function wlnewguangdongApi(params) {
  return request({
    url: 'api/report/get_pro_wl_product_or_factory_excel_new_guangdong',
    params,
    method: 'get'
  })
}

//返回全部(物流及开单表(河南计划)--导出EXCEL)
export function wlnewguangdongplanApi(params) {
  return request({
    url: 'api/report/get_pro_wl_product_or_factory_excel_new_plan_guangdong',
    params,
    method: 'get'
  })
}

//返回全部(物流及开单表(江西)--导出EXCEL)
export function wlnewjiangxiApi(params) {
  return request({
    url: 'api/report/get_pro_wl_product_or_factory_excel_new_jiangxi',
    params,
    method: 'get'
  })
}

//返回全部(物流及开单表(江西计划)--导出EXCEL)
export function wlnewjiangxiplanApi(params) {
  return request({
    url: 'api/report/get_pro_wl_product_or_factory_excel_new_plan_jiangxi',
    params,
    method: 'get'
  })
}

//返回全部(物流表())(物流(广西)--导出EXCEL)
export function wlguangxiApi(params) {
  return request({
    url: 'api/wlWlsiteOrFactoryproductOrderDeliveryCycle/get_OrderArrived_guangxi',
    params,
    method: 'get'
  })
}

//返回全部(物流及开单表(湖北大月)--导出EXCEL(大月特殊几天)
export function wlhbkdbigApi(params) {
  return request({
    url: 'api/report/get_pro_wl_product_or_factory_excel_new_hubei_max',
    params,
    method: 'get'
  })
}
//返回全部(物流及开单表(江西)--导出EXCEL)
export function wlhbjhbigApi(params) {
  return request({
    url: 'api/report/get_pro_wl_product_or_factory_excel_new_plan_hubei_max',
    params,
    method: 'get'
  })
}

//返回全部(物流表(长沙区域到货明细--到货日期))
export function wlarrivedApi(params) {
  return request({
    url: 'api/wlWlsiteOrFactoryproductOrderDeliveryCycle/get_pro_wl_product_or_factory_excel_new_hunan_arrived_goods',
    params,
    method: 'get'
  })
}
//返回全部(物流表(四川单独到货明细--到货日期))
export function wlarrivedsichuanApi(params) {
  return request({
    url: 'api/wlWlsiteOrFactoryproductOrderDeliveryCycle/get_pro_wl_product_or_factory_excel_new_hunan_arrived_goods_sichuan',
    params,
    method: 'get'
  })
}

//查询物流报表管理(到货)-二次物流生成并查询
export function wlarrivedbuildApi(params) {
  return request({
    url: 'api/wlWlsiteOrFactoryproductDeliveryCycleSetSecond/build',
    params,
    method: 'get'
  })
}

//物流表(山东)
export function wlarrivedShanDongApi(params) {
  return request({
    url: 'api/wlWlsiteOrFactoryproductOrderDeliveryCycle/get_data_shandong',
    params,
    method: 'get'
  })
}

//查询管理部去年低温基数(每天)
export function APILowTempLBaseCHECK(params) {
  return request({
    url: 'api/basicSqAndCompanyLowTempBase/all',
    params,
    method: 'get'
  })
}



//查询线路对应光明站点表
export function wlDeliveryLineAPI(params) {
  return request({
    url: 'api/wlWlsiteOrFactoryproductOrderDeliveryLine',
    params,
    method: 'get'
  })
}

//新增线路对应光明站点表
export function wlDeliveryLineaddAPI(data) {
  return request({
    url: 'api/wlWlsiteOrFactoryproductOrderDeliveryLine',
    method: 'post',
    data
  })
}

//修改线路对应光明站点表
export function wlDeliveryLineputAPI(data) {
  return request({
    url: 'api/wlWlsiteOrFactoryproductOrderDeliveryLine',
    data,
    method: 'put'
  })
}
//删除线路对应光明站点表
export function wlDeliveryLinedelAPI() {
  return request({
    url: 'api/wlWlsiteOrFactoryproductOrderDeliveryLine',
    method: 'delete'
  })
}


//查询物流--物流站点联系人表
export function WlsiteAndContactsAPI(params) {
  return request({
    url: 'api/wlWlsiteAndContacts/all',
    params,
    method: 'get'
  })
}



//查询报单周期设置
export function OrderCycleSetAPI(params) {
  return request({
    url: 'api/trackOrderCycleSet/all',
    params,
    method: 'get'
  })
}

//新增报单周期设置
export function OrderCycleSetaddAPI(data) {
  return request({
    url: 'api/trackOrderCycleSet',
    method: 'post',
    data
  })
}

//修改报单周期设置
export function OrderCycleSetputAPI(data) {
  return request({
    url: 'api/trackOrderCycleSet',
    data,
    method: 'put'
  })
}
//删除报单周期设置
export function OrderCycleSetedelAPI(ids) {
  return request({
    url: 'api/trackOrderCycleSet',
    method: 'delete',
    data: ids
  })
}

//返回全部(各单位体累计、同期、今日数据)
export function companyOrderData(params) {
  return request({
    url: 'api/trackMagDepSiteGoal/get_company_order_data',
    params,
    method: 'get'
  })
}


//查询单数与目标
export function MagDepSiteGoal(params) {
  return request({
    url: 'api/trackMagDepSiteGoal/querytrackMagDepSiteGoal',
    params,
    method: 'get'
  })
}

//查询单数与目标站点
export function MagDepSiteGoalSite(params) {
  return request({
    url: 'api/trackMagDepSiteGoalSite/querytrackMagDepSiteGoal',
    params,
    method: 'get'
  })
}


//同期数据(站点)
export function MagSiteorderdata(params) {
  return request({
    url: 'api/trackMagDepSiteGoal/get_site_order_data',
    params,
    method: 'get'
  })
}


//返回全部(各站点bip系统look系列、330-310、180宴席数据)
export function companyorderBip(params) {
  return request({
    url: 'api/trackMagDepSiteGoal/get_company_order_data_bip',
    params,
    method: 'get'
  })
}

//返回全部的数据
export function CustomerSite(params) {
  return request({
    url: 'api/vTrackBdCustomerSite/siteall',
    params,
    method: 'get'
  })
}

//返回全部的数据(2024下单分子公司-办事处累计数)
export function companypartSite(params) {
  return request({
    url: 'api/vTrackBdCustomerSite/companyparthistory',
    params,
    method: 'get'
  })
}


//返回全部的数据(2025下单分子公司-办事处累计数)
export function companySite(params) {
  return request({
    url: 'api/vTrackBdCustomerSite/companypart',
    params,
    method: 'get'
  })
}

//西南常温物流站点物流表(常温300)
export function XinanNomalSite(params) {
  return request({
    url: 'api/report/get_pro_wl_product_or_factory_300',
    params,
    method: 'get'
  })
}

//返回全部(单品站点(包括历史数据)-每日报单)
export function onesellSite(params) {
  return request({
    url: 'api/report/pro_product_one_sell_site_ncc_day_all',
    params,
    method: 'get'
  })
}



//查询报单周期设置
export function bdSiteAPI(params) {
  return request({
    url: 'api/bdSiteFactoryXinan/all',
    params,
    method: 'get'
  })
}

//新增报单周期设置
export function bdSiteaddAPI(data) {
  return request({
    url: 'api/bdSiteFactoryXinan',
    method: 'post',
    data
  })
}

//修改报单周期设置
export function bdSiteputAPI(data) {
  return request({
    url: 'api/bdSiteFactoryXinan',
    data,
    method: 'put'
  })
}
//删除报单周期设置
export function bdSitedelAPI(ids) {
  return request({
    url: 'api/bdSiteFactoryXinan',
    method: 'delete',
    data: ids
  })
}



//查询基础数据新老站点对照表
export function NewOldSiteAPI(params) {
  return request({
    url: 'api/basicNewOldSite/all',
    params,
    method: 'get'
  })
}

//新增基础数据新老站点对照表
export function NewOldSiteaddAPI(data) {
  return request({
    url: 'api/basicNewOldSite',
    method: 'post',
    data
  })
}

//修改基础数据新老站点对照表
export function NewOldSiteputAPI(data) {
  return request({
    url: 'api/basicNewOldSite',
    data,
    method: 'put'
  })
}
//删除基础数据新老站点对照表
export function NewOldSitedelAPI(ids) {
  return request({
    url: 'api/basicNewOldSite',
    method: 'delete',
    data: ids
  })
}


//查询物流--物流站点联系人表(所有)
export function WLContactsAPI(params) {
  return request({
    url: 'api/wlWlsiteAndContacts/all',
    params,
    method: 'get'
  })
}

//新增物流--物流站点联系人表
export function WLContactsaddAPI(data) {
  return request({
    url: 'api/wlWlsiteAndContacts',
    method: 'post',
    data
  })
}

//修改物流--物流站点联系人表
export function WLContactsputAPI(data) {
  return request({
    url: 'api/wlWlsiteAndContacts',
    data,
    method: 'put'
  })
}

//删除物流--物流站点联系人表
export function WLContactsdelAPI(ids) {
  return request({
    url: 'api/wlWlsiteAndContacts',
    method: 'delete',
    data: ids
  })
}


//查询物流--物流站点与光明产品到货周期对应表特殊规则
export function WLSetOtherAPI(params) {
  return request({
    url: 'api/wlWlsiteOrFactoryproductDeliveryCycleSetOther/all',
    params,
    method: 'get'
  })
}

//新增物流--物流站点与光明产品到货周期对应表特殊规则
export function WLSetOtheraddAPI(data) {
  return request({
    url: 'api/wlWlsiteOrFactoryproductDeliveryCycleSetOther',
    method: 'post',
    data
  })
}

//修改物流--物流站点与光明产品到货周期对应表特殊规则
export function WLSetOtherputAPI(data) {
  return request({
    url: 'api/wlWlsiteOrFactoryproductDeliveryCycleSetOther',
    data,
    method: 'put'
  })
}

//删除物流--物流站点与光明产品到货周期对应表特殊规则
export function WLSetOtherdelAPI(ids) {
  return request({
    url: 'api/wlWlsiteOrFactoryproductDeliveryCycleSetOther',
    method: 'delete',
    data: ids
  })
}


//查询基础数据新老站点对照表
export function NormalListAPI(params) {
  return request({
    url: 'api/wlWlsiteOrFactoryproductOrderDeliveryCycleNormal/all',
    params,
    method: 'get'
  })
}

//新增物流--物流站点与光明产品订单到货周期常温(批量)
export function NormalListaddAPI(data) {
  return request({
    url: 'api/wlWlsiteOrFactoryproductOrderDeliveryCycleNormal',
    method: 'post',
    data
  })
}



//查询机器人人工干预开单列表
export function rpaArtificialBillAPI(params) {
  return request({
    url: 'api/rpaArtificialBill/all',
    params,
    method: 'get'
  })
}

//新增机器人人工干预开单列表
export function rpaArtificialBilladdAPI(data) {
  return request({
    url: 'api/rpaArtificialBill',
    method: 'post',
    data
  })
}
//删除机器人人工干预开单列表
export function rpaArtificialBilldelAPI(ids) {
  return request({
    url: 'api/rpaArtificialBill',
    method: 'delete',
    data: ids
  })
}

//查询rpa-微信群报单与催单提醒
export function RPIWechAPI(params) {
  return request({
    url: 'api/rpaWechatPrompt',
    params,
    method: 'get'
  })
}

//查询rpa微信群设置
export function RPIWechupsAPI(params) {
  return request({
    url: 'api/rpaWechatGroups',
    params,
    method: 'get'
  })
}

//新增rpa微信群设置
export function RPIWechupsaddAPI(data) {
  return request({
    url: 'api/rpaWechatGroups',
    method: 'post',
    data
  })
}

//修改rpa微信群设置
export function RPIWechupsputAPI(data) {
  return request({
    url: 'api/rpaWechatGroups',
    data,
    method: 'put'
  })
}

//删除机器人人工干预开单列表
export function RPIWechupsdelAPI(ids) {
  return request({
    url: 'api/rpaWechatGroups',
    method: 'delete',
    data: ids
  })
}

//导入rpa微信群报单与催单提醒
export function RPIWechupsimportAPI(params) {
  return request({
    url: 'api/rpaWechatPrompt/importorderdata',
    params,
    method: 'get'
  })
}

//查询(管理部)大区&单位体负责人数据表
export function APIDqAndCompanyCHECK(params) {
  return request({
    url: 'api/basicDqAndCompany',
    params,
    method: 'get'
  })
}

//查询站点销售任务目标日跟进表
export function APIdaily_report(params) {
  return request({
    url: 'api/report/get_pro_site_daily_report',
    params,
    method: 'get'
  })
}

//导入Excel重复数据提醒
export function importTestAPi(formData) {
  return request({
    url: 'api/basicDqAndCompany/importorderdatatest',
    method: 'POST',
    data: formData,
   
  })
}