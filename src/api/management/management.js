import request from '@/utils/request'
//新增管理部产品分类与标准件换算
export function APIbasiADD(data) {
    return request({
        url: 'api/basicProduct',
        data,
        method: 'post'
    })
}

//查询管理部产品分类与标准件换算
export function APIbasiCHECK(params) {
    return request({
        url: 'api/basicProduct',
        params,
        method: 'get'
    })
}

//修改管理部产品分类与标准件换算
export function APIbasiEDIT(data) {
    return request({
        url: 'api/basicProduct',
        method: 'post',
        data
    })
}
//删除管理部产品分类与标准件换算
export function APIbasiDEL(ids) {
    return request({
        url: 'api/basicProduct',
        method: 'delete',
        data: ids
    })
}
//管理部产品分类与标准件换算导入
export function APIbasiIMPORT(data) {
    return request({
        url: 'api/basicProduct/importorderdata',
        method: 'POST',
        data,
    })
}

//新增(管理部)低温增幅比数据表
export function APILowTempADD(data) {
    return request({
        url: 'api/basicDqAndCompanyLowTemp',
        data,
        method: 'post'
    })
}

//查询(管理部)低温增幅比数据表
export function APILowTempCHECK(params) {
    return request({
        url: 'api/basicDqAndCompanyLowTemp',
        params,
        method: 'get'
    })
}

//修改(管理部)低温增幅比数据表
export function APILowTempEDIT(data) {
    return request({
        url: 'api/basicDqAndCompanyLowTemp',
        method: 'post',
        data
    })
}
//删除(管理部)低温增幅比数据表
export function APILowTempDEL(ids) {
    return request({
        url: 'api/basicDqAndCompanyLowTemp',
        method: 'delete',
        data: ids
    })
}
//导入(管理部)低温增幅比数据表
export function APILowTempIMPORT(data) {
    return request({
        url: 'api/basicDqAndCompanyLowTemp/importorderdata',
        method: 'POST',
        data,
    })
}


//新增(管理部)单位体下单周期数据表
export function APIMonthCycleADD(data) {
    return request({
        url: 'api/basicMonthCycle',
        data,
        method: 'post'
    })
}

//查询(管理部)单位体下单周期数据表
export function APIMonthCycleCHECK(params) {
    return request({
        url: 'api/basicMonthCycle/all',
        params,
        method: 'get'
    })
}

//修改(管理部)单位体下单周期数据表
export function APIMonthCycleEDIT(data) {
    return request({
        url: 'api/basicMonthCycle',
        method: 'post',
        data
    })
}
//删除(管理部)单位体下单周期数据表
export function APIMonthCycleDEL(ids) {
    return request({
        url: 'api/basicMonthCycle',
        method: 'delete',
        data: ids
    })
}
//导入(管理部)单位体下单周期数据表
export function APIMonthCycleMPORT(data) {
    return request({
        url: 'api/basicMonthCycle/importorderdata',
        method: 'POST',
        data,
    })
}


//新增(管理部)大区&单位体负责人数据表
export function APIDqAndCompanyADD(data) {
    return request({
        url: 'api/basicDqAndCompany',
        data,
        method: 'post'
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

//修改(管理部)大区&单位体负责人数据表
export function APIDqAndCompanyEDIT(data) {
    return request({
        url: 'api/basicDqAndCompany',
        method: 'post',
        data
    })
}
//删除(管理部)大区&单位体负责人数据表
export function APIDqAndCompanyDEL(ids) {
    return request({
        url: 'api/basicDqAndCompany',
        method: 'delete',
        data: ids
    })
}
//导入(管理部)大区&单位体负责人数据表
export function APIDqAndCompanyMPORT(data) {
    return request({
        url: 'api/basicDqAndCompany/importorderdata',
        method: 'POST',
        data,
    })
}


//新增(管理部)椰子汁&其他常温产品月目标数据表
export function APIMonthGoalADD(data) {
    return request({
        url: 'api/basicMonthGoal',
        data,
        method: 'post'
    })
}

//查询(管理部)椰子汁&其他常温产品月目标数据表
export function APIMonthGoalCHECK(params) {
    return request({
        url: 'api/basicMonthGoal',
        params,
        method: 'get'
    })
}

//修改(管理部)椰子汁&其他常温产品月目标数据表
export function APIMonthGoalEDIT(data) {
    return request({
        url: 'api/basicMonthGoal',
        method: 'post',
        data
    })
}
//删除(管理部)椰子汁&其他常温产品月目标数据表
export function APIMonthGoalDEL(ids) {
    return request({
        url: 'api/basicMonthGoal',
        method: 'delete',
        data: ids
    })
}
//导入(管理部)椰子汁&其他常温产品月目标数据表
export function APIMonthGoalPORT(data) {
    return request({
        url: 'api/basicMonthGoal/importorderdata',
        method: 'POST',
        data,
    })
}



//新增(管理部)班组&单位体负责人数据表
export function APITeamsAndADD(data) {
    return request({
        url: 'api/basicTeamsAndCompany',
        data,
        method: 'post'
    })
}

//查询(管理部)班组&单位体负责人数据表
export function APITeamsAndCHECK(params) {
    return request({
        url: 'api/basicTeamsAndCompany',
        params,
        method: 'get'
    })
}

//修改(管理部)班组&单位体负责人数据表
export function APITeamsAndEDIT(data) {
    return request({
        url: 'api/basicTeamsAndCompany',
        method: 'post',
        data
    })
}
//删除(管理部)班组&单位体负责人数据表
export function APITeamsAndDEL(ids) {
    return request({
        url: 'api/basicTeamsAndCompany',
        method: 'delete',
        data: ids
    })
}
//导入(管理部)班组&单位体负责人数据表
export function APITeamsAndPORT(data) {
    return request({
        url: 'api/basicTeamsAndCompany/importorderdata',
        method: 'POST',
        data,
    })
}


//新增(管理部)计入下月规则数据表
export function APIMonthRulesADD(data) {
    return request({
        url: 'api/basicMonthRules',
        data,
        method: 'post'
    })
}

//查询(管理部)计入下月规则数据表
export function APIMonthRulesCHECK(params) {
    return request({
        url: 'api/basicMonthRules',
        params,
        method: 'get'
    })
}

//修改(管理部)计入下月规则数据表
export function APIMonthRulesEDIT(data) {
    return request({
        url: 'api/basicMonthRules',
        method: 'post',
        data
    })
}
//删除(管理部)计入下月规则数据表
export function APIMonthRulesDEL(ids) {
    return request({
        url: 'api/basicMonthRules',
        method: 'delete',
        data: ids
    })
}
//导入(管理部)计入下月规则数据表
export function APIMonthRulesPORT(data) {
    return request({
        url: 'api/basicMonthRules/importorderdata',
        method: 'POST',
        data,
    })
}






//查询(管理部)班组&单位体今日低温
export function APIquerylowtempCHECK(params) {
    return request({
        url: 'api/basicTeamsAndCompany/querylowtemp',
        params,
        method: 'get'
    })
}
//查询(管理部)班组&单位体LOOk系列累计
export function APIquerylowtemplookCHECK(params) {
    return request({
        url: 'api/basicTeamsAndCompany/querylowtemplook',
        params,
        method: 'get'
    })
}
//查询(管理部)班组&单位体330-310系列累计
export function APIquerylowtempotherCHECK(params) {
    return request({
        url: 'api/basicTeamsAndCompany/querylowtempother',
        params,
        method: 'get'
    })
}
//查询(管理部)班组&单位体去年同月低温销售数据
export function APIquerylowtempyearCHECK(params) {
    return request({
        url: 'api/basicTeamsAndCompany/querymonthlowtemp',
        params,
        method: 'get'
    })
}



//查询(管理部)大区&单位体负责人数据表(所有)
export function APIdqlowtempallCHECK(params) {
    return request({
        url: 'api/basicDqAndCompany/all',
        params,
        method: 'get'
    })
}

//查询(管理部)大区&单位体今日低温
export function APIdqlowtempCHECK(params) {
    return request({
        url: 'api/basicDqAndCompany/querylowtemp',
        params,
        method: 'get'
    })
}

//查询(管理部)大区&LOOk系列累计
export function APIdqlowlookCHECK(params) {
    return request({
        url: 'api/basicDqAndCompany/querylowtemplook',
        params,
        method: 'get'
    })
}
//查询(管理部)大区&330-310系列累计
export function APIdqlowotherCHECK(params) {
    return request({
        url: 'api/basicDqAndCompany/querylowtempother',
        params,
        method: 'get'
    })
}
//查询(管理部)大区&单位体去年同月低温销售数据
export function APIdqyearlowtempCHECK(params) {
    return request({
        url: 'api/basicDqAndCompany/querymonthlowtemp',
        params,
        method: 'get'
    })
}

//查询(管理部)大区&单位体今日报单(常温全品)
export function APIdqnormaltempCHECK(params) {
    return request({
        url: 'api/basicDqAndCompany/querynormaltemp',
        params,
        method: 'get'
    })
}
//查询(管理部)大区&单位体300常温
export function APIdqnormaltemp300CHECK(params) {
    return request({
        url: 'api/basicDqAndCompany/querynormaltemp300',
        params,
        method: 'get'
    })
}
//查询(管理部)大区&单位体950常温
export function APIdqnormaltemp950CHECK(params) {
    return request({
        url: 'api/basicDqAndCompany/querynormaltemp950',
        params,
        method: 'get'
    })
}
//查询(管理部)大区&单位体椰子汁系列常温
export function APIdqnormaltempcoconutCHECK(params) {
    return request({
        url: 'api/basicDqAndCompany/querynormaltempcoconut',
        params,
        method: 'get'
    })
}
//查询(管理部)大区&单位体果汁系列常温
export function APIdqnormaltempfruitCHECK(params) {
    return request({
        url: 'api/basicDqAndCompany/querynormaltempfruit',
        params,
        method: 'get'
    })
}
//查询(管理部)大区&单位体1L椰乳常温
export function APIdqnormaltempmilkCHECK(params) {
    return request({
        url: 'api/basicDqAndCompany/querynormaltempmilk',
        params,
        method: 'get'
    })
}


//查询(管理部)班组&单位体今日报单(常温全品)
export function APIquerynormaltempCHECK(params) {
    return request({
        url: 'api/basicTeamsAndCompany/querynormaltemp',
        params,
        method: 'get'
    })
}
//查询(管理部)班组&单位体300常温
export function APIquerynormaltemp300CHECK(params) {
    return request({
        url: 'api/basicTeamsAndCompany/querynormaltemp300',
        params,
        method: 'get'
    })
}
//查询(管理部)班组&单位体950常温
export function APIquerynormaltemp950CHECK(params) {
    return request({
        url: 'api/basicTeamsAndCompany/querynormaltemp950',
        params,
        method: 'get'
    })
}

//查询(管理部)班组&单位体椰子汁系列常温
export function APIquerynormaltempcoconutCHECK(params) {
    return request({
        url: 'api/basicTeamsAndCompany/querynormaltempcoconut',
        params,
        method: 'get'
    })
}
//查询(管理部)班组&单位体果汁系列常温
export function APIquerynormaltempfruitCHECK(params) {
    return request({
        url: 'api/basicTeamsAndCompany/querynormaltempfruit',
        params,
        method: 'get'
    })
}
//查询(管理部)班组&单位体1L椰乳常温
export function APIquerynormaltempmilkCHECK(params) {
    return request({
        url: 'api/basicTeamsAndCompany/querynormaltempmilk',
        params,
        method: 'get'
    })
}

//查询(管理部)历史数据当天全部
export function APIgetcurall(params) {
    return request({
        url: 'api/lowtemphistorydata/get_cur_all',
        params,
        method: 'get'
    })
}

//查询(管理部)大区&LOOk系列累计
export function APIlookandother(params) {
    return request({
        url: 'api/basicDqAndCompany/querylowtemplookandother',
        params,
        method: 'get'
    })
}



//查询管理部去年低温基数
export function APILowTempLastsCHECK(params) {
    return request({
        url: 'api/basicDqAndCompanyLowTempLast',
        params,
        method: 'get'
    })
}
//新增管理部去年低温基数
export function APILowTempLastADD(data) {
    return request({
        url: 'api/basicDqAndCompanyLowTempLast',
        data,
        method: 'post'
    })
}

//修改管理部去年低温基数
export function APILowTempLastEDIT(data) {
    return request({
        url: 'api/basicDqAndCompanyLowTempLast',
        method: 'post',
        data
    })
}
//删除管理部去年低温基数
export function APILowTempLastDEL(ids) {
    return request({
        url: 'api/basicDqAndCompanyLowTempLast',
        method: 'delete',
        data: ids
    })
}
//导入管理部去年低温基数
export function APILowTempLastPORT(data) {
    return request({
        url: 'api/basicDqAndCompanyLowTempLast/importorderdata',
        method: 'POST',
        data,
    })
}

//导入管理部去年低温基数(每天)
export function APILowTempBasePORT(data) {
    return request({
        url: 'api/basicSqAndCompanyLowTempBase/importorderdata',
        method: 'POST',
        data,
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


//查询返回全部(当天)半小时计算一次
export function APIlowgetcurall(params) {
    return request({
        url: 'api/lowtempdata/get_cur_all',
        params,
        method: 'get'
    })
}

//查询(管理部)大区&LOOk系列累计(当天)计算
export function APIrunLook(params) {
    return request({
        url: 'api/basicDqAndCompany/runLook',
        params,
        method: 'get'
    })
}

//查询(管理部)大区&330-310系列累计(当天)计算
export function APIrunOther(params) {
    return request({
        url: 'api/basicDqAndCompany/runOther',
        params,
        method: 'get'
    })
}

//导入(管理部)跨月下单周期表
export function APIMCimport(data) {
    return request({
        url: 'api/basicMonthCycleNextMonth/importorderdata',
        method: 'POST',
        data,
    })
}
//查询(管理部)跨月下单周期表
export function APIMCNextMonth(params) {
    return request({
        url: 'api/basicMonthCycleNextMonth/all',
        params,
        method: 'get'
    })
}


//查询返回全部(当天跨月数据)
export function APInextmonth(params) {
    return request({
        url: 'api/lowtempdata/get_cur_next_month',
        params,
        method: 'get'
    })
}
