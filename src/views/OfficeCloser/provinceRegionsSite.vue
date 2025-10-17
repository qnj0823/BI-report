<template>
    <div class='provinceRegionsSite'>
        <el-form :inline="true" style="width: 100%; margin: 0 auto;">
            <el-form-item>
                <el-date-picker v-model="dataForm.p_vouchdatestart" value-format="yyyy-MM-dd" type="date"
                    placeholder="开始日期" clearable style="width: 100%"></el-date-picker>
            </el-form-item>
            <el-form-item>
                <el-date-picker v-model="dataForm.p_vouchdateend" value-format="yyyy-MM-dd" type="date" placeholder="日期"
                    clearable style="width: 100%"></el-date-picker>
            </el-form-item>
            <!-- <el-form-item>
                <el-input v-model="bullay" placeholder="模糊查询" clearable @keyup.enter.native="searchEnterFun()"
                    ref="searchInput"></el-input>
            </el-form-item> -->
            <el-form-item>
                <el-button class="filter-item" size="mini" type="success" icon="el-icon-search"
                    @click="getdataList">查询</el-button>
                <el-button size="mini" class="filter-item" type="warning" icon="el-icon-download"
                    @click="exportData">导出</el-button>
            </el-form-item>
            <div class="test">{{ this.labelText }}</div>
        </el-form>
        <el-table border ref="table" v-loading="dataListLoading" height="680" :data="dataList" style="width: 100%;">
            <el-table-column :show-overflow-tooltip="true" align="center" prop="sort" label="增幅排名" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="sqname" label="省区" />
            <el-table-column prop="companyman" width="110" align="center" label="负责人" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="converBigPiece" :label="`低温系列`">
                <el-table-column :show-overflow-tooltip="true" align="center" prop="fixedbox"
                    :label="`${month1}.1-${month1}.${dayend1}报单基数`">
                </el-table-column>
                <el-table-column :show-overflow-tooltip="true" align="center" prop="todaybox" label="今日报单">
                </el-table-column>
                <el-table-column :show-overflow-tooltip="true" align="center" prop="leijibox"
                    :label="`${month1}.${day1}-今日累计报单`">
                </el-table-column>
                <el-table-column :show-overflow-tooltip="true" align="center" prop="leijiboxhistory"
                    :label="`${month1}.${day1}-今日报单基数`">
                </el-table-column>
                <el-table-column :show-overflow-tooltip="true" align="center" prop="cumulativeDiff"
                    :label="`${month1}.${day1}-今日累计缺口`">
                </el-table-column>
                <el-table-column :show-overflow-tooltip="true" align="center" prop="lasteyear"
                    :label="`${month1}.${day1}-今日累计同比`">
                </el-table-column>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
import {
    exportExcel
} from './provinceRegionsSiteExpro.js'
import * as api from '@/api/frame/customer.js'
export default {
    name: 'provinceRegionsSite-page',
    data() {
        return {
            msg: 'provinceRegionsSite-page',
            dataForm: {
                p_vouchdatestart: '',
                p_vouchdateend: ''
            },
            dataFormNow: {
                p_vouchdatestart: '',
                p_vouchdateend: ''
            },
            dataFormADD: {
                p_vouchdatestart: '',
                p_vouchdateend: ''
            },
            yearForm: {
                p_vouchdatestart: '',
                p_vouchdateend: ''
            },
            dataFzrForm: {
                page: 0,
                size: 2000,
                sort: '',
            },
            dataListLoading: false,
            labelText: '',
            bullay: '',
            dataList: [],
            fgsList: [],
            bscList: [],
            goalList: [],
            yearSame: [],
            FZRList: [],
            yearaddSame: [],
            NowSame: [],
            nowaddSame: [],
            yearDaysum: [],//去年本月截止今日数据
            yearDayallsum: [],//去年本月所有数据
            month1: '',
            day1: '',
            monthend1: '',
            dayend1: ''
        };
    },
    created() {
        this.calculateCurrentYearDates();
        // this.calculateLastYearDates()
    },
    mounted() {
        this.getdataList()
    },
    methods: {
        subtractYear(dateStr) {
            const date = new Date(dateStr);
            date.setFullYear(date.getFullYear() - 1);
            return date.toISOString().split('T')[0];
        },
        getMonthStartAndEnd(dateString) {
            // 验证输入格式
            if (!dateString || typeof dateString !== 'string') {
                throw new Error('请输入有效的日期字符串');
            }

            // 解析日期
            const date = new Date(dateString);
            if (isNaN(date.getTime())) {
                throw new Error('日期格式无效,请使用YYYY-MM-DD格式');
            }

            // 获取月份的第一天
            const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);

            // 获取月份的最后一天
            const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);

            // 格式化为YYYY-MM-DD
            const format = d => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

            return {
                firstDay: format(firstDay),
                lastDay: format(lastDay)
            };
        },
        async getdataList() {
            this.dataListLoading = true;

            const [year, month, day] = this.dataForm.p_vouchdatestart.split('-').map(Number);
            const [yearend, monthend, dayend] = this.dataForm.p_vouchdateend.split('-').map(Number);
            this.month1 = month
            this.day1 = day
            this.monthend1 = monthend
            // this.dayend1 = dayend

            this.labelText = `${this.year}年全国(各省区)低温销售数据进度表(${month}月${day}日—${monthend}月${dayend}日)`;
            this.yearForm.p_vouchdatestart = this.subtractYear(this.dataForm.p_vouchdatestart);
            this.yearForm.p_vouchdateend = this.subtractYear(this.dataForm.p_vouchdateend);

            const result = this.getMonthStartAndEnd(this.dataForm.p_vouchdatestart);
            this.dataFormADD.p_vouchdatestart = result.firstDay
            this.dataFormADD.p_vouchdateend = result.lastDay

            const [yearend12, monthend12, dayend12] = this.dataFormADD.p_vouchdateend.split('-').map(Number);
            this.dayend1 = dayend12

            this.dataFormADD.p_vouchdatestart = this.subtractYear(this.dataFormADD.p_vouchdatestart);
            this.dataFormADD.p_vouchdateend = this.subtractYear(this.dataFormADD.p_vouchdateend);

            this.dataFormNow.p_vouchdatestart = this.dataForm.p_vouchdateend
            this.dataFormNow.p_vouchdateend = this.dataForm.p_vouchdateend
            try {
                const [yearCAR, yearADD, nowCAR, nowADD, ljtqjr, goal, fzr] = await Promise.all([
                    // api.companypartSite(this.yearForm),
                    api.APILowTempLBaseCHECK(),
                    api.companypartSite(this.dataFormADD),
                    api.companySite(this.dataForm),
                    api.companySite(this.dataFormNow),
                    api.companyOrderData(this.dataForm),
                    api.MagDepSiteGoal(),
                    api.APIDqAndCompanyCHECK(this.dataFzrForm)
                ]);
                //第一个接口取出所有导出数据
                this.yearSame = yearCAR
                //根据时间段过滤对象
                const yearDay = this.yearSame.filter(item => {
                    const itemDate = new Date(item.yearmonthdate);
                    return itemDate >= new Date(this.yearForm.p_vouchdatestart) &&
                        itemDate <= new Date(this.yearForm.p_vouchdateend);
                });
                //(1)取出截止今日数据的和
                this.yearDaysum = this.sumBySqname(yearDay)
                console.log(this.yearDaysum, 'this.yearDaysum')
                console.log(this.yearSame, 'this.yearSame')

                //(2)取出本月数据之和
                this.yearDayallsum = this.sumBySqname(this.yearSame)
                console.log(this.yearDayallsum, 'this.yearDayallsum')

                //第三个接口今年6-20到当前日期
                this.NowSame = nowCAR
                this.NowSame = this.NowSame.reduce((acc, curr) => {
                    const existingItem = acc.find(item => item.sqid === curr.sqid);
                    if (existingItem) {
                        existingItem.box = Number(existingItem.box) + Number(curr.box);
                    } else {
                        acc.push({ ...curr, box: Number(curr.box) });
                    }
                    return acc;
                }, []);
                //第四个接口当年当前日期
                this.nowaddSame = nowADD
                this.nowaddSame = this.nowaddSame.reduce((acc, curr) => {
                    const existingItem = acc.find(item => item.sqid === curr.sqid);
                    if (existingItem) {
                        existingItem.box = Number(existingItem.box) + Number(curr.box);
                    } else {
                        acc.push({ ...curr, box: Number(curr.box) });
                    }
                    return acc;
                }, []);

                //第五个接口
                this.dataList = ljtqjr
                this.dataList = this.dataList.map(item => ({
                    ...item,
                    sqname: item.sqname.replace(/^\d+/, '') // 去掉开头的所有数字
                }));

                this.dataList = this.dataList.filter(item => item.companyname !== "新零售事业部");
                this.dataList.forEach(item => {
                    if (item.sqname) {
                        item.sqname = item.sqname.replace(/^\d+/g, '').trim();
                    } else {
                        item.sqname = ""; // 如果 sqname 不存在，设为空字符串
                    }
                });
                this.dataList = this.mergeObjectsBySqid(this.dataList);

                //历史到今天的数据
                this.dataList.forEach(item => {
                    const matchedYearSameItem = this.yearDaysum.find(yearItem => yearItem.sqname === item.sqname);
                    if (matchedYearSameItem) {
                        item.leijiboxhistory = matchedYearSameItem.goalvalue;
                    }
                });
                //2024年基数
                this.dataList.forEach(item => {
                    const matchedYearSameItemadd = this.yearDayallsum.find(yearItem => yearItem.sqname === item.sqname);
                    if (matchedYearSameItemadd) {
                        item.fixedbox = matchedYearSameItemadd.goalvalue;
                    }
                });
                //累计报单
                this.dataList.forEach(item => {
                    const matchedYearSameItemadd = this.NowSame.find(yearItem => yearItem.companyid === item.companyid);
                    if (matchedYearSameItemadd) {
                        item.leijibox = matchedYearSameItemadd.box;
                    }
                });
                //今日报单
                this.dataList.forEach(item => {
                    const matchedYearSameItemadd = this.nowaddSame.find(yearItem => yearItem.companyid === item.companyid);
                    if (matchedYearSameItemadd) {
                        item.todaybox = matchedYearSameItemadd.box;
                    }
                });

                console.log(this.dataList, 'this.dataList')

                //处理第六个接口

                this.FZRList = fzr.content
                this.dataList.forEach(item => {
                    const matchedYearSameItem = this.FZRList.find(yearItem => yearItem.dqname === item.sqname);
                    if (matchedYearSameItem) {
                        item.companyman = matchedYearSameItem.companyperson;
                    }
                });

                console.log(this.FZRList, 'this.FZRList')

                this.goalList = goal
                // //根据省区去重
                const uniqueArray = [...new Map(this.goalList.map(item => [item.sqname, item]))].map(([_, value]) => value);
                console.log(uniqueArray, '根据省区去重')
                //根据省区去重的结果添加负责人
                this.dataList = this.dataList.map(dataItem => {
                    const matchedUniqueItem = uniqueArray.find(uniqueItem => uniqueItem.sqname === dataItem.sqname);
                    if (matchedUniqueItem && matchedUniqueItem.sqman !== undefined) {
                        return { ...dataItem, sqman: matchedUniqueItem.sqman }; // 合并字段（不修改原对象）
                    }
                    return dataItem; // 无匹配则返回原对象
                });
                //根据省区和站点去重
                const uniquezdArray = [
                    ...new Map(
                        this.goalList.map((item) => [
                            `${item.sqname}_${item.sitename}`, // 用组合键作为唯一标识
                            item,
                        ])
                    ).values(),
                ];
                //计算省区单数总计。报单数总计
                const mergedArray = this.mergeObjectsBySqname(uniquezdArray);
                //根据省区和站点去重的结果添加总单数，总报单数
                this.dataList = this.dataList.map(dataItem => {
                    const matchedUniqueItem = mergedArray.find(uniqueItem => uniqueItem.sqname === dataItem.sqname);
                    if (matchedUniqueItem && matchedUniqueItem.sqman !== undefined) {
                        return { ...dataItem, goalnumtotal: matchedUniqueItem.goalnumtotal, ordersnumtotal: matchedUniqueItem.ordersnumtotal, goalrate: matchedUniqueItem.goalrate }; // 合并字段（不修改原对象）
                    }
                    return dataItem; // 无匹配则返回原对象
                });
                console.log(mergedArray, '相加')

                //根据时间段过滤对象
                const filteredData2 = this.goalList.filter(item => {
                    const itemDate = new Date(item.goaldate);
                    return itemDate >= new Date('2025-06-20') &&
                        itemDate <= new Date(this.dataForm.p_vouchdateend);
                });

                //更据站点计算ordersnum 形成ordersnumStage
                const dataStage = this.mergezdByname(filteredData2);

                //根据省区计算形成ordersnumStage
                const datesqStage = this.mergesqByname(dataStage)

                this.dataList = this.dataList.map(dataItem => {
                    const matchedUniqueItem = datesqStage.find(uniqueItem => uniqueItem.sqname === dataItem.sqname);
                    if (matchedUniqueItem && matchedUniqueItem.sqman !== undefined) {
                        return { ...dataItem, ordersnumStage: matchedUniqueItem.ordersnumStage, goalnumStage: matchedUniqueItem.goalnumStage }; // 合并字段（不修改原对象）
                    }
                    return dataItem; // 无匹配则返回原对象
                });

                //获取时间
                //根据时间过滤对象
                // 方法1：直接过滤匹配的日期
                const filteredArray = this.goalList.filter(item =>
                    item.goaldate === this.dataForm.p_vouchdateend
                );

                const filtereddateArray = this.mergeObjectsByname(filteredArray);
                this.dataList = this.dataList.map(dataItem => {
                    const matchedUniqueItem = filtereddateArray.find(uniqueItem => uniqueItem.sqname === dataItem.sqname);
                    if (matchedUniqueItem && matchedUniqueItem.sqman !== undefined) {
                        return { ...dataItem, goalnum: matchedUniqueItem.goalnum, ordersnum: matchedUniqueItem.ordersnum }; // 合并字段（不修改原对象）
                    }
                    return dataItem; // 无匹配则返回原对象
                });

                console.log(filtereddateArray)

                this.dataList = this.dataList.map(item => {
                    // 1. 计算当日差值
                    const difference = (Number(item.goalnum) || 0) - (Number(item.todaybox) || 0);

                    // 2. 计算同比增长率
                    const current = Number(item.leijibox) || 0;
                    const previous = Number(item.leijiboxhistory) || 0;
                    let lasteyear = '0%';

                    if (previous !== 0) {
                        const growthRate = ((current - previous) / previous) * 100;
                        lasteyear = `${growthRate.toFixed(2)}%`;
                    } else if (current !== 0) {
                        lasteyear = '∞';
                    }

                    // 3. 计算累计差值 cumulativeDiff
                    const goalnumtotal = Number(item.goalnumtotal) || 0;
                    const ordersnumtotal = Number(item.ordersnumtotal) || 1; // 避免除以0
                    const ordersnumStage = Number(item.ordersnumStage) || 0;

                    const leijiboxhistory = Number(item.leijiboxhistory) || 0;
                    const leijibox = Number(item.leijibox) || 0;

                    // const cumulativeDiff = current - ((goalnumtotal / ordersnumtotal) * ordersnumStage);
                    const cumulativeDiff = leijiboxhistory - leijibox;

                    return {
                        ...item,
                        difference,
                        lasteyear,
                        cumulativeDiff: Number(cumulativeDiff.toFixed(0)) // 保留2位小数
                    };
                });

                // 1. 按 lasteyear 降序排序
                this.dataList = this.dataList.sort((a, b) => {
                    // 处理 a.lasteyear
                    const strA = a.lasteyear.replace('%', '');
                    const numA = strA === '∞' ? Infinity : parseFloat(strA);

                    // 处理 b.lasteyear
                    const strB = b.lasteyear.replace('%', '');
                    const numB = strB === '∞' ? Infinity : parseFloat(strB);

                    // 降序排序（Infinity 最大，NaN 或无效值可以单独处理）
                    return numB - numA;
                });

                // 2. 添加 sort 字段（1, 2, 3...）
                this.dataList = this.dataList.map((item, index) => ({
                    ...item,
                    sort: index + 1, // 从 1 开始编号
                }));

                this.dataList = this.addNationalTotal(this.dataList);

                this.dataList = this.dataList.map(item => {

                    // 2. 计算同比增长率
                    const current = Number(item.leijibox) || 0;
                    const previous = Number(item.leijiboxhistory) || 0;
                    let lasteyear = '0%';

                    if (previous !== 0) {
                        const growthRate = ((current - previous) / previous) * 100;
                        lasteyear = `${growthRate.toFixed(2)}%`;
                    } else if (current !== 0) {
                        lasteyear = '∞';
                    }

                    return {
                        ...item,
                        lasteyear,
                    };
                });
                sessionStorage.setItem('dataListSite', JSON.stringify(this.dataList));
                this.dataList = this.dataList.map(item => ({
                    ...item,
                    cumulativeDiff: item.cumulativeDiff
                }));
                console.log('累计、同期、今日:', this.dataList);
                
            } catch (error) {
                console.error("获取数据时出错:", error);
                // 可以在这里添加错误提示
                this.$message.error('数据加载失败，请重试');
            } finally {
                this.dataListLoading = false; // 确保无论成功失败都会重置加载状态
            }
        },
        //根据sqname分组计算goalvalue的值
        sumBySqname(originalArray) {
            // 检查输入是否为有效的数组
            if (!Array.isArray(originalArray)) {
                throw new Error("输入必须是一个数组");
            }

            // 分组并累加goalvalue
            const grouped = originalArray.reduce((acc, item) => {
                // 确保item是对象且包含必要的字段
                if (typeof item !== 'object' || item === null) return acc;
                if (!('sqname' in item) || !('goalvalue' in item)) return acc;

                const sqname = item.sqname;
                // 将goalvalue转换为数字，非数字值按0处理
                const value = Number(item.goalvalue) || 0;

                if (acc[sqname]) {
                    acc[sqname] += value;
                } else {
                    acc[sqname] = value;
                }
                return acc;
            }, {});

            // 转换为目标格式的数组
            return Object.entries(grouped).map(([sqname, goalvalue]) => ({
                sqname,
                goalvalue
            }));
        },



        addNationalTotal(dataArray) {
            // 初始化新对象
            const nationalTotal = {
                sqname: '全国合计',
                fixedbox: 0,
                goalnumtotal: 0,
                goalrate: 0,  // 这里初始化为0，后面会处理百分数
                goalnum: 0,
                todaybox: 0,
                difference: 0,
                leijibox: 0,
                cumulativeDiff: 0,  // 这个会保留两位小数
                leijiboxhistory: 0,
                goalnumStage: 0
            };

            // 遍历数组中的每个对象，累加指定字段
            dataArray.forEach(item => {
                nationalTotal.fixedbox += Number(item.fixedbox) || 0;
                nationalTotal.goalnumtotal += Number(item.goalnumtotal) || 0;

                // 处理百分数相加
                const goalrateValue = parseFloat(item.goalrate) || 0;
                nationalTotal.goalrate += goalrateValue;

                nationalTotal.goalnum += Number(item.goalnum) || 0;
                nationalTotal.todaybox += Number(item.todaybox) || 0;
                nationalTotal.difference += Number(item.difference) || 0;
                nationalTotal.leijibox += Number(item.leijibox) || 0;
                nationalTotal.goalnumStage += Number(item.goalnumStage) || 0;

                // 处理cumulativeDiff，保留两位小数
                const cumulativeDiffValue = parseFloat(item.cumulativeDiff) || 0;
                nationalTotal.cumulativeDiff = parseFloat((nationalTotal.cumulativeDiff + cumulativeDiffValue).toFixed(0));

                nationalTotal.leijiboxhistory += Number(item.leijiboxhistory) || 0;
            });

            // 将goalrate格式化为百分数字符串
            nationalTotal.goalrate = nationalTotal.goalrate.toFixed(2) + '%';

            // 将新对象添加到原数组末尾
            dataArray.push(nationalTotal);

            return dataArray;
        },
        //过滤掉 levelName2 为空的对象
        filterEmptyLevelName2(array) {
            return array.filter(item => {
                const value = item.levelName2;
                return value != null && value !== "";
            });
        },
        //按站点时间段计算ordersnumStage截至当日单数
        mergezdByname(arr) {
            const result = {};

            arr.forEach(obj => {
                const key = obj.sitename;
                const currentValue = parseFloat(obj.ordersnum) || 0; // 安全转换为数字
                const goalnumValue = parseFloat(obj.goalnum) || 0; // 安全转换为数字

                if (!result[key]) {
                    // 第一次遇到这个站点，创建新对象
                    result[key] = {
                        ...obj, // 保留所有原始字段
                        ordersnumStage: currentValue, // 初始化累计值
                        goalnumStage: goalnumValue
                    };
                } else {
                    // 已存在该站点，累加ordersnum值
                    result[key].ordersnumStage += currentValue;
                    result[key].goalnumStage += goalnumValue;

                    // 可选：保留其他需要的信息，如最新日期的数据
                    // if (new Date(obj.date) > new Date(result[key].date)) {
                    //     result[key].date = obj.date;
                    // }
                }
            });

            return Object.values(result); // 转换为数组
        },
        //按省区时间段计算ordersnumStage截至当日单数
        mergesqByname(arr) {
            const result = {};

            arr.forEach(obj => {
                const key = obj.sqname;

                if (!result[key]) {
                    // 如果是第一次遇到这个sqname，创建一个新对象（保留所有原始字段）
                    result[key] = { ...obj };
                    // 只转换我们需要计算的字段
                    result[key].ordersnumStage = parseFloat(obj.ordersnumStage) || 0;
                    result[key].goalnumStage = parseFloat(obj.goalnumStage) || 0;
                } else {
                    // 如果已经存在，只累加指定的两个字段
                    result[key].ordersnumStage += parseFloat(obj.ordersnumStage) || 0;
                    result[key].goalnumStage += parseFloat(obj.goalnumStage) || 0;
                }
            });

            // 转换回数组
            return Object.values(result);
        },
        //按省区当前时间计算goalnum今日目标
        mergeObjectsByname(arr) {
            const result = {};

            arr.forEach(obj => {
                const key = obj.sqname;

                if (!result[key]) {
                    // 如果是第一次遇到这个sqname，创建一个新对象（保留所有原始字段）
                    result[key] = { ...obj };
                    // 只转换我们需要计算的字段
                    result[key].goalnum = parseFloat(obj.goalnum) || 0;
                    result[key].ordersnum = parseFloat(obj.ordersnum) || 0;
                } else {
                    // 如果已经存在，只累加指定的两个字段
                    result[key].goalnum += parseFloat(obj.goalnum) || 0;
                    result[key].ordersnum += parseFloat(obj.ordersnum) || 0;
                }
            });

            // 转换回数组
            return Object.values(result);
        },
        //按省区计算goalnumtotal，goalrate，ordersnumtotal---总单数目标，总报单目标，总增长率
        mergeObjectsBySqname(arr) {
            const result = {};

            arr.forEach(obj => {
                const key = obj.sqname;

                if (!result[key]) {
                    // 如果是第一次遇到这个sqname，创建一个新对象
                    result[key] = {
                        ...obj,
                        goalnumtotal: parseFloat(obj.goalnumtotal) || 0,
                        // 对于goalrate，我们需要先去掉百分号再转换为数字
                        goalrate: parseFloat(obj.goalrate.replace('%', '')) || 0,
                        ordersnumtotal: parseFloat(obj.ordersnumtotal) || 0
                    };
                } else {
                    // 如果已经存在，累加数值
                    const existing = result[key];
                    existing.goalnumtotal += parseFloat(obj.goalnumtotal) || 0;
                    existing.goalrate += parseFloat(obj.goalrate.replace('%', '')) || 0;
                    existing.ordersnumtotal += parseFloat(obj.ordersnumtotal) || 0;
                }
            });

            // 转换回数组并处理goalrate为百分数字符串
            return Object.values(result).map(item => ({
                ...item,
                goalrate: item.goalrate.toFixed(2) + '%'
            }));
        },
        mergeObjectsBySqid(arr) {
            const result = {};
            arr.forEach(obj => {
                const sqid = obj.sqid;
                if (!result[sqid]) {
                    // 初始化新对象，保留 sqname 和 zqname
                    result[sqid] = {
                        sqid: sqid,
                        sqname: obj.sqname,
                        type: obj.type,
                        companyname: obj.companyname,
                        companyid: obj.companyid,
                        zhanquame: obj.zhanquame,
                        zhanquid: obj.zhanquid,
                    };

                    // 其他字段初始化为 0
                    for (const key in obj) {
                        if (key !== 'sqid' && key !== 'sqname' && key !== 'type' && key !== 'companyname' && key !== 'companyid' && key !== 'zhanquame' && key !== 'zhanquid') {
                            result[sqid][key] = parseFloat(obj[key]) || 0;
                        }
                    }
                } else {
                    // 累加其他字段
                    for (const key in obj) {
                        if (key !== 'sqid' && key !== 'sqname' && key !== 'type' && key !== 'companyname' && key !== 'companyid' && key !== 'zhanquame' && key !== 'zhanquid') {
                            result[sqid][key] = (parseFloat(result[sqid][key]) || 0) + (parseFloat(obj[key]) || 0);
                        }
                    }
                }
            });

            return Object.values(result);
        },
        exportData() {
            this.$confirm('是否导出表格数据到Excel?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                exportExcel(this.dataList, this.dataForm.p_vouchdatestart, this.dataForm.p_vouchdateend, this.month1, this.day1, this.monthend1, this.dayend1, '省区低温销售数据进度表.xlsx')
            })
        },
        // 获取今年的日期数据
        calculateCurrentYearDates() {
            const today = new Date();

            // 获取当前月份的月初时间 
            const startOfMonthDate = new Date(today.getFullYear(), today.getMonth(), 1);
            this.startOfMonth = this.formatDate(startOfMonthDate);

            // 获取当前月份的月末时间
            const endOfMonthDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);
            this.endOfMonth = this.formatDate(endOfMonthDate);


            // 获取截至今天的时间 
            this.endOfToday = this.formatDate(today);

            this.dataForm.p_vouchdatestart = this.startOfMonth;
            // this.dataForm.p_vouchdatestart = '2025-06-20';
            this.dataForm.p_vouchdateend = this.endOfToday;

            this.dataFormADD.p_vouchdatestart = this.startOfMonth;
            this.dataFormADD.p_vouchdateend = this.endOfMonth;
            this.labelText = `${this.year}年全国(各省区)低温销售数据进度表(${this.month}月${this.day}日—${this.month}月${this.day}日)`;
        },
        // 格式化日期
        formatDate(date) {
            this.year = date.getFullYear();
            this.month = String(date.getMonth() + 1).padStart(2, '0'); // 月份从0开始，所以加1 
            this.day = String(date.getDate()).padStart(2, '0');
            return `${this.year}-${this.month}-${this.day}`;
        },
    }
};
</script>

<style scoped lang="scss">
.test {
    font-family: 'Microsoft YaHei', 微软雅黑, sans-serif;
    font-size: 20px;
    text-align: center;
}
</style>