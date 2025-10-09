<template>
    <div class='OfficeDetails'>
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
                <el-select style="width: 13rem; " v-model="bullay" filterable placeholder="请选择">
                    <el-option v-for="item in iParentNameList" :key="item.value" :label="item.name"
                        :value="item.name" />
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button class="filter-item" size="mini" type="success" icon="el-icon-search"
                    @click="getdataList">查询</el-button>
                <el-button size="mini" class="filter-item" type="warning" icon="el-icon-download"
                    @click="exportData">导出</el-button>
            </el-form-item>
            <div class="test">{{ this.labelText }}</div>
        </el-form>
        <el-table border ref="table" v-loading="dataListLoading" height="680" :data="currentData" style="width: 100%;">
            <el-table-column :show-overflow-tooltip="true" align="center" prop="sort" label="序号" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="ocustomerClass_name" label="单位体" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="companyman" label="负责人" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="goalnumtotal" label="低温目标" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="converBigPiece" :label="`今日完成`">
                <el-table-column :show-overflow-tooltip="true" align="center" prop="goalnum" label="今日目标">
                </el-table-column>
                <el-table-column :show-overflow-tooltip="true" align="center" prop="looktodaybox" label="look系列">
                </el-table-column>
                <el-table-column :show-overflow-tooltip="true" align="center" prop="today330box" label="330/310">
                </el-table-column>
                <el-table-column :show-overflow-tooltip="true" align="center" prop="today180box" label="180宴席">
                </el-table-column>
                <el-table-column :show-overflow-tooltip="true" align="center" prop="todayend" label="今日完成">
                </el-table-column>
                <el-table-column :show-overflow-tooltip="true" align="center" prop="todaydiff" label="今日缺口(正为缺口)">
                </el-table-column>
            </el-table-column>
            <el-table-column :show-overflow-tooltip="true" align="center" prop="daydiff" label="截止今日累计完成">
                <el-table-column :show-overflow-tooltip="true" align="center" prop="ordersnumStage" label="累计目标">
                </el-table-column>
                <el-table-column :show-overflow-tooltip="true" align="center" prop="lookleijibox" label="look系列">
                </el-table-column>
                <el-table-column :show-overflow-tooltip="true" align="center" prop="leiji330box" label="330/310">
                </el-table-column>
                <el-table-column :show-overflow-tooltip="true" align="center" prop="leiji180box" label="180宴席">
                </el-table-column>
                <el-table-column :show-overflow-tooltip="true" align="center" prop="leijiend" label="累计完成">
                </el-table-column>
                <el-table-column :show-overflow-tooltip="true" align="center" prop="leijidiff" label="累计缺口(正为缺口)">
                </el-table-column>
            </el-table-column>
            <el-table-column :show-overflow-tooltip="true" align="center" prop="goalnumTommo" label="明日指标">
            </el-table-column>
        </el-table>
        <el-pagination @size-change="sizeChangeHandle" ref="pagination" @current-change="handleCurrentChange"
            :current-page="currentPage" :page-sizes="[20, 40, 60, 80, 100, 1000]" :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper" :total="dataList.length">
        </el-pagination>
    </div>
</template>

<script>
import {
    exportExcel
} from './BranchCompanyDetailsExpro.js'
import * as api from '@/api/frame/customer.js'
export default {
    name: 'OfficeDetails-page',
    data() {
        return {
            msg: 'OfficeDetails-page',
            dataForm: {
                p_vouchdatestart: '',
                p_vouchdateend: ''
            },
            dataListLoading: false,
            currentData: [],
            currentPage: 1,
            pageSize: 20,
            totalItems: 0,
            labelText: '',
            bullay: '',
            dataList: [],
            ALLList: [],
            bsczdList: [],
            goalList: [],
            iParentNameList: []
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

            this.labelText = `${year}年${month}.${day}—${monthend}.${dayend}${this.bullay || '全部'}单位体 完成进度---截至到(${monthend}/${dayend})`;

            try {
                const [oerdebip, goal] = await Promise.all([
                    api.companyorderBip(this.dataForm),
                    api.MagDepSiteGoal()

                ]);

                //第一个接口
                this.dataList = oerdebip
                this.iParentNameList = [...new Set(
                    this.dataList.map(item =>
                        item.iParentName ? item.iParentName.replace(/\d+/g, '') : null
                    )
                )]
                    .filter(Boolean) // 过滤掉 null/undefined/空字符串
                    .map((name, index) => ({
                        name: name,
                        value: index + 1 // 生成唯一数字（从1开始）
                    }));
                this.dataList = this.mergeObjectsBySqname(this.dataList)
                //处理第二个接口
                this.goalList = goal
                console.log(this.goalList, 'this.goalList')
                // //根据单位体id去重
                const uniqueArray = [...new Map(this.goalList.map(item => [item.companyid, item]))].map(([_, value]) => value);
                //根据单位体id去重的结果添加负责人
                this.dataList = this.dataList.map(dataItem => {
                    const matchedUniqueItem = uniqueArray.find(uniqueItem => uniqueItem.companyid === dataItem.ocustomerClass_id);
                    if (matchedUniqueItem && matchedUniqueItem.companyman !== undefined) {
                        return { ...dataItem, companyman: matchedUniqueItem.companyman }; // 合并字段（不修改原对象）
                    }
                    return dataItem; // 无匹配则返回原对象
                });
                //根据站点名称去重
                const uniqueArray1 = [...new Map(this.goalList.map(item => [item.sitename, item]))].map(([_, value]) => value);

                const uniqueArray2 = this.mergesqByname(uniqueArray1)

                //根据单位体id去重的结果添加总目标
                this.dataList = this.dataList.map(dataItem => {
                    const matchedUniqueItem = uniqueArray2.find(uniqueItem => uniqueItem.companyid === dataItem.ocustomerClass_id);
                    if (matchedUniqueItem && matchedUniqueItem.goalnumtotal !== undefined) {
                        return { ...dataItem, goalnumtotal: matchedUniqueItem.goalnumtotal }; // 合并字段（不修改原对象）
                    }
                    return dataItem; // 无匹配则返回原对象
                });

                //根据时间段过滤对象
                const filteredData2 = this.goalList.filter(item => {
                    const itemDate = new Date(item.goaldate);
                    return itemDate >= new Date('2025-06-20') &&
                        itemDate <= new Date(this.dataForm.p_vouchdateend);
                });
                //更据站点计算ordersnum 形成ordersnumStage
                const dataStage = this.mergezdByname(filteredData2);

                //根据分公司id计算形成ordersnumStage
                const datesqStage = this.mergefgsidByname(dataStage)
                this.dataList = this.dataList.map(dataItem => {
                    const matchedUniqueItem = datesqStage.find(uniqueItem => uniqueItem.companyid === dataItem.ocustomerClass_id);
                    if (matchedUniqueItem && matchedUniqueItem.ordersnumStage !== undefined) {
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
                console.log(filteredArray, 'filteredArray')
                const filtereddateArray = this.mergeObjectsByname(filteredArray);
                this.dataList = this.dataList.map(dataItem => {
                    const matchedUniqueItem = filtereddateArray.find(uniqueItem => uniqueItem.companyid === dataItem.ocustomerClass_id);
                    if (matchedUniqueItem && matchedUniqueItem.goalnum !== undefined) {
                        return { ...dataItem, goalnum: matchedUniqueItem.goalnum, ordersnum: matchedUniqueItem.ordersnum }; // 合并字段（不修改原对象）
                    }
                    return dataItem; // 无匹配则返回原对象
                });
                console.log(this.dataList, 'this.dataList')
                //获取明天的指标
                const nextDay = this.addDays(this.dataForm.p_vouchdateend, 1);
                // 根据明天匹配的日期
                const filteTomorrArray = this.goalList.filter(item =>
                    item.goaldate === nextDay
                );
                const filtereTOMMArray = this.mergeTomorrByname(filteTomorrArray);
                this.dataList = this.dataList.map(dataItem => {
                    const matchedUniqueItem = filtereTOMMArray.find(uniqueItem => uniqueItem.companyid === dataItem.ocustomerClass_id);
                    if (matchedUniqueItem && matchedUniqueItem.goalnumTommo !== undefined) {
                        return { ...dataItem, goalnumTommo: matchedUniqueItem.goalnumTommo }; // 合并字段（不修改原对象）
                    }
                    return dataItem; // 无匹配则返回原对象
                });
                console.log(nextDay, filteTomorrArray)


                this.dataList = this.dataList.map(item => {
                    // 1. 计算今日完成
                    const todayend = (Number(item.today180box) || 0) + (Number(item.today330box) || 0) + (Number(item.looktodaybox) || 0);

                    const todaydiff = (Number(item.goalnum) || 0) - (Number(todayend) || 0);//今日差额

                    const leijiend = (Number(item.leiji180box) || 0) + (Number(item.leiji330box) || 0) + (Number(item.lookleijibox) || 0);//累计完成

                    const leijidiff = (Number(item.ordersnumStage) || 0) - (Number(leijiend) || 0)//累计差额
                    return {
                        ...item,
                        todayend,
                        todaydiff,
                        leijiend,
                        leijidiff
                    };
                });

                this.dataList.forEach(item => {
                    item.goalnum = parseInt(item.goalnum) || '';
                    item.looktodaybox = parseInt(item.looktodaybox) || '';
                    item.today330box = parseInt(item.today330box) || '';
                    item.today180box = parseInt(item.today180box) || '';

                    item.lookleijibox = parseInt(item.lookleijibox) || '';
                    item.leiji330box = parseInt(item.leiji330box) || '';
                    item.leiji180box = parseInt(item.leiji180box) || '';
                });

                // 按 leijiend 降序排序
                this.dataList.sort((a, b) => b.leijiend - a.leijiend);

                // 2. 添加 sort 字段（1, 2, 3...）
                this.dataList = this.dataList.map((item, index) => ({
                    ...item,
                    sort: index + 1, // 从 1 开始编号
                }));

                this.dataList = this.dataList.filter(item =>
                    (item.iParentName && item.iParentName.includes(this.bullay))
                );
                this.dataList = this.addSummaryObject(this.dataList);

                this.currentData = {
                    ...this.dataList
                };
                this.sizeChangeHandle(this.pageSize);


            } catch (error) {
                console.error("获取数据时出错:", error);
                // 可以在这里添加错误提示
                this.$message.error('数据加载失败，请重试');
            } finally {
                this.dataListLoading = false; // 确保无论成功失败都会重置加载状态
            }
        },
        addSummaryObject(array) {
            // 定义需要求和的字段
            const sumFields = [
                'goalnumtotal', 'goalnum', 'looktodaybox', 'today330box', 'today180box',
                'todayend', 'todaydiff', 'ordersnumStage', 'lookleijibox', 'leiji330box',
                'leiji180box', 'leijiend', 'leijidiff', 'goalnumTommo'
            ];

            // 创建合计对象，初始化字段为0
            const summary = {
                ocustomerClass_name: '合计'
            };

            // 初始化所有求和字段为0
            sumFields.forEach(field => {
                summary[field] = 0;
            });

            // 遍历数组中的每个对象，累加指定字段的值
            array.forEach(item => {
                sumFields.forEach(field => {
                    // 将字段值转为数字（如果无法转换则为0），然后累加
                    const value = parseFloat(item[field]) || 0;
                    summary[field] += value;
                });
            });

            // 将合计对象添加到数组最后
            array.push(summary);

            return array;
        },
        //时间加一天处理
        addDays(dateStr, days) {
            const date = new Date(dateStr);
            date.setDate(date.getDate() + days);
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
        },
        //按分公司id当前时间计算明天goalnum今日目标
        mergeTomorrByname(arr) {
            const result = {};

            arr.forEach(obj => {
                const key = obj.companyid;

                if (!result[key]) {
                    // 如果是第一次遇到这个companyid，创建一个新对象（保留所有原始字段）
                    result[key] = { ...obj };
                    // 只转换我们需要计算的字段
                    result[key].goalnumTommo = parseFloat(obj.goalnum) || 0;
                    result[key].ordersnum = parseFloat(obj.ordersnum) || 0;
                } else {
                    // 如果已经存在，只累加指定的两个字段
                    result[key].goalnumTommo += parseFloat(obj.goalnum) || 0;
                    result[key].ordersnum += parseFloat(obj.ordersnum) || 0;
                }
            });

            // 转换回数组
            return Object.values(result);
        },
        //按分公司id当前时间计算goalnum今日目标
        mergeObjectsByname(arr) {
            const result = {};

            arr.forEach(obj => {
                const key = obj.companyid;

                if (!result[key]) {
                    // 如果是第一次遇到这个companyid，创建一个新对象（保留所有原始字段）
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
        mergefgsidByname(arr) {
            const result = {};

            arr.forEach(obj => {
                const key = obj.companyid;

                if (!result[key]) {
                    // 如果是第一次遇到这个companyid，创建一个新对象（保留所有原始字段）
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
        //按分公司id时间段计算goalnumtotal截至低温目标
        mergesqByname(arr) {
            const result = {};

            arr.forEach(obj => {
                const key = obj.companyid;

                if (!result[key]) {
                    // 如果是第一次遇到这个companyid，创建一个新对象（保留所有原始字段）
                    result[key] = { ...obj };
                    // 只转换我们需要计算的字段
                    result[key].goalnumtotal = parseFloat(obj.goalnumtotal) || 0;
                } else {
                    // 如果已经存在，只累加指定的两个字段
                    result[key].goalnumtotal += parseFloat(obj.goalnumtotal) || 0;
                }
            });

            // 转换回数组
            return Object.values(result);
        },
        mergeObjectsBySqname(arr) {
            const result = {};

            arr.forEach(obj => {
                const key = obj.ocustomerClass_id;

                if (!result[key]) {
                    // 如果是第一次遇到这个ocustomerClass_id，创建一个新对象
                    result[key] = {
                        ...obj,
                        leiji180box: parseFloat(obj.leiji180box) || 0,
                        // 对于goalrate，我们需要先去掉百分号再转换为数字
                        leiji330box: parseFloat(obj.leiji330box) || 0,
                        lookleijibox: parseFloat(obj.lookleijibox) || 0,
                        looktodaybox: parseFloat(obj.looktodaybox) || 0,
                        today180box: parseFloat(obj.today180box) || 0,
                        today330box: parseFloat(obj.today330box) || 0
                    };
                } else {
                    // 如果已经存在，累加数值
                    const existing = result[key];
                    existing.leiji180box += parseFloat(obj.leiji180box) || 0;
                    existing.leiji330box += parseFloat(obj.leiji330box) || 0;
                    existing.lookleijibox += parseFloat(obj.lookleijibox) || 0;
                    existing.looktodaybox += parseFloat(obj.looktodaybox) || 0;
                    existing.today180box += parseFloat(obj.today180box) || 0;
                    existing.today330box += parseFloat(obj.today330box) || 0;
                }
            });

            // 转换回数组并处理goalrate为百分数字符串
            return Object.values(result); // 转换为数组
        },
        // 每页数
        sizeChangeHandle(val) {
            this.pageSize = val;
            this.currentPage = 1;
            this.currentData = this.dataList.slice((this.currentPage - 1) * this.pageSize, this.currentPage * this
                .pageSize);
        },
        // 当前页
        handleCurrentChange(val) {
            console.log(val)
            this.currentPage = val;
            this.currentData = this.dataList.slice((val - 1) * this.pageSize, val * this.pageSize);
        },
        exportData() {
            this.$confirm('是否导出表格数据到Excel?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                exportExcel(this.dataList, this.dataForm.p_vouchdatestart, this.dataForm.p_vouchdateend, this.bullay, '分公司售销完成进度明细表.xlsx')
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

            this.dataForm.p_vouchdatestart = '2025-06-20';
            this.dataForm.p_vouchdateend = this.endOfToday;
            this.labelText = `${this.year}年(分公司)售销完成进度明细表(${this.month}月${this.day}日—${this.month}月${this.day}日)`;
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