<template>
    <div class='SalesProgressSummary'>
        <el-form :inline="true" style="width: 100%; margin: 0 auto;">
            <el-form-item>
                <el-date-picker v-model="dataForm.p_vouchdatestart" value-format="yyyy-MM-dd" type="date"
                    placeholder="开始日期" clearable style="width: 100%"></el-date-picker>
            </el-form-item>
            <el-form-item>
                <el-date-picker v-model="dataForm.p_vouchdateend" value-format="yyyy-MM-dd" type="date" placeholder="日期"
                    clearable style="width: 100%"></el-date-picker>
            </el-form-item>
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
            <el-table-column :show-overflow-tooltip="true" align="center" prop="companyname" label="单位体" />
            <el-table-column prop="companyman" width="110" align="center" label="负责人" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="converBigPiece" :label="`低温系列`">
                <el-table-column :show-overflow-tooltip="true" align="center" prop="fixedbox" label="2024年基数">
                </el-table-column>
                <el-table-column :show-overflow-tooltip="true" align="center" prop="goalnumtotal" label="低温目标">
                </el-table-column>
                <el-table-column :show-overflow-tooltip="true" align="center" prop="goalrate" label="目标增幅">
                </el-table-column> 
                <el-table-column :show-overflow-tooltip="true" align="center" prop="goalnum" label="今日目标">
                </el-table-column>
                <el-table-column :show-overflow-tooltip="true" align="center" prop="todaybox" label="今日报单">
                </el-table-column>
                <el-table-column :show-overflow-tooltip="true" align="center" prop="difference" label="今日差额">
                </el-table-column>
                <el-table-column :show-overflow-tooltip="true" align="center" prop="leijibox" label="累计报单">
                </el-table-column>
                <el-table-column :show-overflow-tooltip="true" align="center" prop="cumulativeDiff" label="累计差额">
                </el-table-column>
                <el-table-column :show-overflow-tooltip="true" align="center" prop="leijiboxhistory" label="累计基数">
                </el-table-column>
                <el-table-column :show-overflow-tooltip="true" align="center" prop="lasteyear" label="累计同比">
                </el-table-column>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
import {
    exportExcel
} from './SalesProgressSummaryExpro.js'
import * as api from '@/api/frame/customer.js'
export default {
    name: 'SalesProgressSummary-page',
    data() {
        return {
            msg: 'SalesProgressSummary-page',
            dataForm: {
                p_vouchdatestart: '',
                p_vouchdateend: ''
            },
            dataListLoading: false,
            labelText: '',
            bullay: '',
            dataList: [],
            fgsList: [],
            bscList: [],
            goalList: []
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
        async getdataList() {
            this.dataListLoading = true;

            const [year, month, day] = this.dataForm.p_vouchdatestart.split('-').map(Number);
            const [yearend, monthend, dayend] = this.dataForm.p_vouchdateend.split('-').map(Number);

            this.labelText = `${this.year}年全国 各办事处 低温销售数据进度表(${month}月${day}日—${monthend}月${dayend}日)`;

            try {
                const [ywkjres, ljtqjr, goal] = await Promise.all([
                    api.SiteallCustomer(),//今日低温
                    api.companyOrderData(this.dataForm),
                    api.MagDepSiteGoal()
                ]);

                // 处理第一个业务框架API的响应
                this.fgsList = ywkjres;
                this.fgsList.forEach(item => {
                    const levels = item.levelName.split(' -> ');
                    item.levelName1 = levels[0] || "";
                    // 去掉 levelName2 中的数字  
                    item.levelName2 = levels[1] ? levels[1].replace(/\d+/g, '').trim() : "";
                    item.levelName3 = levels[2] || "";
                });

                const map = new Map();
                this.fgsList.forEach(item => {
                    const key = `${item.levelName1}-${item.levelName2}-${item.levelName3}`;
                    if (!map.has(key)) {
                        map.set(key, item);
                    }
                });
                this.fgsList = Array.from(map.values());
                this.bscList = this.fgsList.filter(item =>
                    item.def17Name == "集团办事处"
                );
                this.bscList = this.filterEmptyLevelName2(this.bscList);

                //第二个接口
                this.dataList = ljtqjr
                this.dataList = this.dataList.filter(item => item.companyname !== "新零售事业部");
                this.dataList.forEach(item => {
                    if (item.sqname) {
                        item.sqname = item.sqname.replace(/^\d+/g, '').trim();
                    } else {
                        item.sqname = ""; // 如果 sqname 不存在，设为空字符串
                    }
                });
                this.dataList = this.dataList.filter(item =>
                    item.type == "集团办事处"
                );
                //处理第三个接口
                this.goalList = goal
                console.log(this.goalList, 'this.goalList')
                //根据单位体id去重
                const uniqueArray = [...new Map(this.goalList.map(item => [item.companyname, item]))].map(([_, value]) => value);
                //根据单位体id去重的结果添加负责人
                this.dataList = this.dataList.map(dataItem => {
                    const matchedUniqueItem = uniqueArray.find(uniqueItem => uniqueItem.companyname === dataItem.companyname);
                    if (matchedUniqueItem && matchedUniqueItem.companyman !== undefined) {
                        return { ...dataItem, companyman: matchedUniqueItem.companyman }; // 合并字段（不修改原对象）
                    }
                    return dataItem; // 无匹配则返回原对象
                });
                //根据单位体id和站点去重
                const uniquezdArray = [
                    ...new Map(
                        this.goalList.map((item) => [
                            `${item.companyname}_${item.sitename}`, // 用组合键作为唯一标识
                            item,
                        ])
                    ).values(),
                ];
                //计算单位体单数总计。报单数总计
                const mergedArray = this.mergeObjectsBySqname(uniquezdArray);
                //根据单位体id和站点去重的结果添加总单数，总报单数
                this.dataList = this.dataList.map(dataItem => {
                    const matchedUniqueItem = mergedArray.find(uniqueItem => uniqueItem.companyname === dataItem.companyname);
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
                //根据分公司id计算形成ordersnumStage
                const datesqStage = this.mergesqByname(dataStage)
                this.dataList = this.dataList.map(dataItem => {
                    const matchedUniqueItem = datesqStage.find(uniqueItem => uniqueItem.companyname === dataItem.companyname);
                    if (matchedUniqueItem && matchedUniqueItem.sqman !== undefined) {
                        return { ...dataItem, ordersnumStage: matchedUniqueItem.ordersnumStage, }; // 合并字段（不修改原对象）
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
                    const matchedUniqueItem = filtereddateArray.find(uniqueItem => uniqueItem.companyname === dataItem.companyname);
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

                    const cumulativeDiff = current - ((goalnumtotal / ordersnumtotal) * ordersnumStage);

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
                this.dataList = this.addGroupTotals(this.dataList)

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
                this.dataList = this.dataList.filter(item => item.sqname !== "办事处总计合计");

                this.dataList.forEach(item => {
                    item.fixedbox = parseInt(item.fixedbox) || '';
                    item.todaybox = parseInt(item.todaybox) || '';
                    item.leijibox = parseInt(item.leijibox) || '';
                    item.leijiboxhistory = parseInt(item.leijiboxhistory) || '';
                });

                this.dataList = this.dataList.map(item => ({
                    ...item,
                    cumulativeDiff: -item.cumulativeDiff
                }));
                console.log('接口:', this.dataList);

            } catch (error) {
                console.error("获取数据时出错:", error);
                // 可以在这里添加错误提示
                this.$message.error('数据加载失败，请重试');
            } finally {
                this.dataListLoading = false; // 确保无论成功失败都会重置加载状态
            }
        },
        addNationalTotal(dataArray) {
            // 初始化新对象
            const nationalTotal = {
                sqname: '办事处总计',
                fixedbox: 0,
                goalnumtotal: 0,
                goalrate: 0,  // 这里初始化为0，后面会处理百分数
                goalnum: 0,
                todaybox: 0,
                difference: 0,
                leijibox: 0,
                cumulativeDiff: 0,  // 这个会保留两位小数
                leijiboxhistory: 0
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
        addGroupTotals(dataArray) {
            // 1. 按sqname分组
            const groups = {};
            dataArray.forEach(item => {
                const key = item.sqname;
                if (!groups[key]) {
                    groups[key] = [];
                }
                groups[key].push(item);
            });

            // 2. 为每个分组创建汇总对象
            const totals = [];
            Object.keys(groups).forEach(sqname => {
                const groupItems = groups[sqname];
                const groupTotal = {
                    sqname: `${sqname}合计`,
                    fixedbox: 0,
                    goalnumtotal: 0,
                    goalrate: 0,
                    goalnum: 0,
                    todaybox: 0,
                    difference: 0,
                    leijibox: 0,
                    cumulativeDiff: 0,
                    leijiboxhistory: 0
                };

                // 3. 计算每个字段的总和
                groupItems.forEach(item => {
                    groupTotal.fixedbox += Number(item.fixedbox) || 0;
                    groupTotal.goalnumtotal += Number(item.goalnumtotal) || 0;

                    const goalrateValue = parseFloat(item.goalrate) || 0;
                    groupTotal.goalrate += goalrateValue;

                    groupTotal.goalnum += Number(item.goalnum) || 0;
                    groupTotal.todaybox += Number(item.todaybox) || 0;
                    groupTotal.difference += Number(item.difference) || 0;
                    groupTotal.leijibox += Number(item.leijibox) || 0;

                    const cumulativeDiffValue = parseFloat(item.cumulativeDiff) || 0;
                    groupTotal.cumulativeDiff = parseFloat(
                        (groupTotal.cumulativeDiff + cumulativeDiffValue).toFixed(0)
                    );

                    groupTotal.leijiboxhistory += Number(item.leijiboxhistory) || 0;
                });

                // 格式化百分数
                groupTotal.goalrate = groupTotal.goalrate.toFixed(2) + '%';

                totals.push(groupTotal);
            });

            // 4. 将汇总对象添加到原数组
            return dataArray.concat(totals);
        },
        //按单位体计算goalnumtotal，goalrate，ordersnumtotal---总单数目标，总报单目标，总增长率
        mergeObjectsBySqname(arr) {
            const result = {};

            arr.forEach(obj => {
                const key = obj.companyname;

                if (!result[key]) {
                    // 如果是第一次遇到这个companyname，创建一个新对象
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
        //按站点时间段计算ordersnumStage截至当日单数
        mergezdByname(arr) {
            const result = {};

            arr.forEach(obj => {
                const key = obj.sitename;
                const currentValue = parseFloat(obj.ordersnum) || 0; // 安全转换为数字

                if (!result[key]) {
                    // 第一次遇到这个站点，创建新对象
                    result[key] = {
                        ...obj, // 保留所有原始字段
                        ordersnumStage: currentValue // 初始化累计值
                    };
                } else {
                    // 已存在该站点，累加ordersnum值
                    result[key].ordersnumStage += currentValue;

                    // 可选：保留其他需要的信息，如最新日期的数据
                    // if (new Date(obj.date) > new Date(result[key].date)) {
                    //     result[key].date = obj.date;
                    // }
                }
            });

            return Object.values(result); // 转换为数组
        },
        //按分公司id时间段计算ordersnumStage截至当日单数
        mergesqByname(arr) {
            const result = {};

            arr.forEach(obj => {
                const key = obj.companyname;

                if (!result[key]) {
                    // 如果是第一次遇到这个companyname，创建一个新对象（保留所有原始字段）
                    result[key] = { ...obj };
                    // 只转换我们需要计算的字段
                    result[key].ordersnumStage = parseFloat(obj.ordersnumStage) || 0;
                } else {
                    // 如果已经存在，只累加指定的两个字段
                    result[key].ordersnumStage += parseFloat(obj.ordersnumStage) || 0;
                }
            });

            // 转换回数组
            return Object.values(result);
        },
        //按分公司id当前时间计算goalnum今日目标
        mergeObjectsByname(arr) {
            const result = {};

            arr.forEach(obj => {
                const key = obj.companyname;

                if (!result[key]) {
                    // 如果是第一次遇到这个companyname，创建一个新对象（保留所有原始字段）
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
        //过滤掉 levelName2 为空的对象
        filterEmptyLevelName2(array) {
            return array.filter(item => {
                const value = item.levelName2;
                return value != null && value !== "";
            });
        },
        exportData() {
            this.$confirm('是否导出表格数据到Excel?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                exportExcel(this.dataList, this.dataForm.p_vouchdatestart, this.dataForm.p_vouchdateend, '办事处低温销售数据进度表.xlsx')
            })
        },
        // 获取今年的日期数据
        calculateCurrentYearDates() {
            const today = new Date();

            // 获取当前月份的月初时间 
            const startOfMonthDate = new Date(today.getFullYear(), today.getMonth(), 1);
            this.startOfMonth = this.formatDate(startOfMonthDate);

            // 获取截至今天的时间 
            this.endOfToday = this.formatDate(today);

            // this.dataForm.p_vouchdatestart = this.startOfMonth;
            this.dataForm.p_vouchdatestart = '2025-06-20';
            this.dataForm.p_vouchdateend = this.endOfToday;
            this.labelText = `${this.year}年全国 各办事处 低温销售数据进度表(${this.month}月${this.day}日—${this.month}月${this.day}日)`;
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