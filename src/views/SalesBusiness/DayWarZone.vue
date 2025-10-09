<template>
    <div class='Und'>
        <el-form :inline="true" style="width: 100%; margin: 0 auto;">
            <!-- <el-form-item>
                <el-date-picker v-model="dataForm.p_vouchdatestart" value-format="yyyy-MM-dd" type="date"
                    placeholder="开始日期" clearable style="width: 100%"></el-date-picker>
            </el-form-item> -->
            <el-form-item>
                <el-date-picker v-model="dataForm.p_vouchdateend" value-format="yyyy-MM-dd" type="date"
                    placeholder="结束日期" clearable style="width: 100%" @change="handleDateChange"></el-date-picker>
            </el-form-item>
            <el-form-item>
                <el-button class="filter-item" size="mini" type="success" icon="el-icon-search"
                    @click="getdataPreList">查询</el-button>
            </el-form-item>
            <el-button size="mini" class="filter-item" type="warning" icon="el-icon-download"
                @click="exportData">导出</el-button>
            <el-button size="mini" class="filter-item" type="warning" @click="goToUnit">
                单位体
            </el-button>
        </el-form>
        <div style="display: flex; justify-content: center; align-items: center;">
            <label>{{ labelText }}</label>
        </div>
        <el-table class="table" ref="table" border :data="allList" v-loading="dataListLoading"
            style="width: 100%; margin: 0 auto; margin-bottom: 50px;">
            <el-table-column :show-overflow-tooltip="true" align="center" prop="Rank" label="当月增幅排名" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="nAME" label="战区" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="cur_task" label="本月任务" />
            <el-table-column align="center" :label="dynamicLabel + ' 月已完成'">
                <el-table-column align="center" label="老品">
                    <el-table-column :show-overflow-tooltip="true" align="center" prop="lowSeries" label="低温系列" />
                    <el-table-column :show-overflow-tooltip="true" align="center" prop="lowRate" label="同比增幅" />
                </el-table-column>
                <el-table-column align="center" label="新品(自然件)">
                    <el-table-column :show-overflow-tooltip="true" align="center" prop="NorSeries" label="常温系列" />
                    <el-table-column :show-overflow-tooltip="true" align="center" prop="YzSeries" label="椰子牛乳系列" />
                    <el-table-column :show-overflow-tooltip="true" align="center" prop="YzzSeries" label="椰子汁系列" />
                    <el-table-column :show-overflow-tooltip="true" align="center" prop="FruitSeries" label="果汁系列" />
                    <el-table-column :show-overflow-tooltip="true" align="center" prop="sum" label="合计" />
                </el-table-column>
            </el-table-column>
            <el-table-column :show-overflow-tooltip="true" align="center" prop="curdiff" label="本月差额" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="currate" label="本月完成率" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="sumRate" width="120rem"
                :label="dynamicLabel + ' 月全品同比增幅'" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="diff" label="同比差异件数" width="100rem" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="allbox"
                :label="'1' + '-' + dynamicLabel + '月完成'">
                <el-table-column :show-overflow-tooltip="true" align="center" prop="LowyearRate"
                    :label="'1' + '-' + dynamicLabel + '月同比老品增幅'" />
                <el-table-column :show-overflow-tooltip="true" align="center" prop="totalyearRate"
                    :label="'1' + '-' + dynamicLabel + '月全品同比增幅'" />
                <el-table-column :show-overflow-tooltip="true" align="center" prop="diffyear"
                    :label="'1' + '-' + dynamicLabel + '月同比差异件数'" />
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
import * as api from '@/api/frame/customer.js'
import {
    exportExcel
} from './DayWarZoneExpro.js'
export default {
    name: 'Und-page',
    data() {
        return {
            msg: 'Und-page',
            dataForm: {
                p_vouchdateend: '',
                p_vouchdatestart: '',
            },
            dataForm1: {
                p_vouchdateend: '',
                p_vouchdatestart: '',
            },
            PerForm: {
                p_vouchdateend: '',
            },
            dataListLoading: '',
            labelText: '',
            dynamicLabel: '',
            firstDayOfMonth: '',//选择之后月份第一天
            allList: [],
            dataList: [],
            mergedDataList: [],
            prevList: [],
            mergedDataPreList: [],
            result: [],
            summedArray: []

        };
    },
    created() {
        this.calculateDates();
    },
    mounted() {
        this.updateLabel()
        this.getdataPreList()

    },
    methods: {
        goToUnit() {
            // 使用 router.push() 方法进行路由跳转  
            this.$router.push('/SalesBusiness/DayUnitBody');
        },
        updateLabel() {
            const { p_vouchdatestart, p_vouchdateend } = this.dataForm;
            const selectedDate = new Date(p_vouchdateend); // 创建日期对象  
            const year = selectedDate.getFullYear(); // 获取年份  
            const month = selectedDate.getMonth() + 1; // 获取月份（0-11，需要加 1）  
            const day = selectedDate.getDate(); // 获取日期 
            this.labelText = `${year}年${month}月全国各战区 完成进度---截止到${p_vouchdateend}`; // 如果没有选择日期，显示默认文本  

        },
        handleDateChange(newValue) {
            if (newValue) {
                const selectedDate = new Date(newValue);
                // const month = String(selectedDate.getMonth() + 1).padStart(2, '0'); // 月份从0开始，所以加1   
                const month = selectedDate.getMonth() + 1; // 获取月份（0-11，需要加 1）
                const year = selectedDate.getFullYear(); // 获取年份  
                this.dynamicLabel = `${month}`
                // 创建该月份的第一天  
                this.firstDayOfMonth = `${year}-${month}-01`
                this.dataForm.p_vouchdatestart = this.firstDayOfMonth

                // 假设 获取上一年 
                const p_vouchdateend = this.dataForm.p_vouchdateend;

                // 将字符串转换为 Date 对象  
                const currentDate = new Date(p_vouchdateend);

                // 获取当前年份和月份  
                const currentYear = currentDate.getFullYear();
                const currentMonth = currentDate.getMonth(); // 注意：getMonth() 返回 0-11  

                // 获取上一年当前月份的第一天  
                const firstDayLastYear = new Date(currentYear - 1, currentMonth, 1); // 上一年当前月份的第一天  

                // 获取上一年当前日期  
                const lastYearCurrentDate = new Date(currentYear - 1, currentMonth, currentDate.getDate()); // 上一年当前日期  

                // 获取格式化字符串 
                const formattedFirstDayLastYear = this.formatDate(firstDayLastYear);
                const formattedLastYearCurrentDate = this.formatDate(lastYearCurrentDate); // '2024-01-09'  
                this.dataForm1.p_vouchdatestart = formattedFirstDayLastYear;
                this.dataForm1.p_vouchdateend = formattedLastYearCurrentDate;

                // 输出结果  
                console.log("上一年当前月份的第一天:", formattedFirstDayLastYear); // 输出: 2024-01-01  
                console.log("上一年当前日期:", formattedLastYearCurrentDate); // 输出: 2024-01-09  

                this.updateLabel()
            } else {
                this.firstDayOfMonth = ''; // 如果没有选择日期，重置  
            }
        },
        sumByDqname(data) {
            const result = {};

            data.forEach(item => {
                const { dqname, ocustomerClass_id, ocustomerClass_name, ...values } = item;

                // 初始化以 dqname 为键的对象  
                if (!result[dqname]) {
                    result[dqname] = { dqname, ...Object.keys(values).reduce((acc, key) => ({ ...acc, [key]: 0 }), {}) };
                }

                // 对其他字段的值进行求和，处理缺失或为空的情况  
                Object.keys(values).forEach(key => {
                    // 获取当前字段值，如果缺失则取 0  
                    const currentValue = values[key];
                    const numericValue = (currentValue !== undefined && currentValue !== '') ? Number(currentValue) : 0; // 将缺失或空值视为 0  
                    result[dqname][key] += isNaN(numericValue) ? 0 : numericValue; // 如果是 NaN 则取 0  
                });
            });

            // 将结果对象转换为数组并返回  
            return Object.values(result);
        },
        sumFields(array) {
            // 初始化累加器对象  
            const accumulator = {};

            // 设置需要累加的字段  
            const fieldsToSum = ["low_num", "last_year_low_num", "total_num", "last_year_total_num", "cur_task"];

            // 遍历数组中的每个对象  
            for (const item of array) {
                // 仅对ocustomerClass_name包含"小计"的对象进行累加  

                for (const key of fieldsToSum) {
                    // 累加指定字段的值，如果字段不存在则取0  
                    accumulator[key] = (accumulator[key] || 0) + (item[key] || 0);
                }

            }

            // 创建合计对象（只包含指定字段）  
            const totalObject = {
                dqname: "合计", // 设置 dqname 为“合计”  
                ...accumulator // 将累加的值展开到新对象中  
            };

            // 将合计对象添加到原数组中  
            array.push(totalObject);
        },
        //一年同期
        getYearList() {
            this.PerForm.p_vouchdateend = this.dataForm.p_vouchdateend
            api.progressApi(this.PerForm).then(res => {

                this.result = this.sumByDqname(res);
                console.log(this.result, 'this.result999999111')

                this.sumFields(this.result)



                this.result = this.result.map(obj => {
                    const LowyearRate = (obj.last_year_low_num == 0 || obj.low_num == 0)
                        ? '0%'
                        : (((obj.low_num - obj.last_year_low_num) / obj.last_year_low_num) * 100).toFixed(2) + '%';

                    const totalyearRate = (obj.last_year_total_num == 0 || obj.total_num == 0)
                        ? '0%'
                        : (((obj.total_num - obj.last_year_total_num) / obj.last_year_total_num) * 100).toFixed(2) + '%';

                    const diffyear = (obj.total_num - obj.last_year_total_num).toFixed(0);



                    return {
                        ...obj,
                        LowyearRate,
                        diffyear,
                        totalyearRate // Add new fields   
                    };
                });

                this.getdataList()
            })
        },

        convertBoxFields(dataList) {
            dataList.forEach(item => {
                // 检查 product_class_pname 字段并进行相应修改  
                if (typeof item.product_class_pname === 'string') {
                    if (item.product_class_pname.includes('低温系列')) {
                        item.lowSeries = Number(item.box); // 将 box 转换为数字并赋值给 oldbox  
                        delete item.box; // 删除原来的 box 字段  
                    } else if (item.product_class_pname.includes('常温系列')) {
                        item.NorSeries = Number(item.box); // 将 box 转换为数字并赋值给 newbox  
                        delete item.box; // 删除原来的 box 字段  
                    } else if (item.product_class_pname.includes('果汁系列')) {
                        item.FruitSeries = Number(item.box); // 将 box 转换为数字并赋值给 newbox  
                        delete item.box; // 删除原来的 box 字段  
                    } else if (item.product_class_pname.includes('椰子汁系列')) {
                        item.YzzSeries = Number(item.box); // 将 box 转换为数字并赋值给 newbox  
                        delete item.box; // 删除原来的 box 字段  
                    } else if (item.product_class_pname.includes('椰子牛乳系列')) {
                        item.YzSeries = Number(item.box); // 将 box 转换为数字并赋值给 newbox  
                        delete item.box; // 删除原来的 box 字段  
                    }
                }
            });
        },
        sumBoxes(dataArray) {
            const result = Object.values(
                dataArray.reduce((acc, obj) => {
                    const { nAME } = obj;

                    // 如果 acc 中没有 nAME，初始化  
                    if (!acc[nAME]) {
                        acc[nAME] = { nAME, lowSeries: 0, NorSeries: 0, FruitSeries: 0, YzzSeries: 0, YzSeries: 0, sum: 0 };
                    }

                    // 转为数字并累加各个字段的值，缺失字段视为0  
                    acc[nAME].lowSeries += Number(obj.lowSeries || 0);
                    acc[nAME].NorSeries += Number(obj.NorSeries || 0);
                    acc[nAME].FruitSeries += Number(obj.FruitSeries || 0);
                    acc[nAME].YzzSeries += Number(obj.YzzSeries || 0);
                    acc[nAME].YzSeries += Number(obj.YzSeries || 0);

                    // 计算每个对象的总和  
                    acc[nAME].sum = acc[nAME].lowSeries + acc[nAME].NorSeries + acc[nAME].FruitSeries + acc[nAME].YzzSeries + acc[nAME].YzSeries;

                    return acc;
                }, {})
            );

            // 计算合计对象  
            const totalObject = {
                nAME: '合计',
                lowSeries: result.reduce((sum, obj) => sum + obj.lowSeries, 0),
                NorSeries: result.reduce((sum, obj) => sum + obj.NorSeries, 0),
                FruitSeries: result.reduce((sum, obj) => sum + obj.FruitSeries, 0),
                YzzSeries: result.reduce((sum, obj) => sum + obj.YzzSeries, 0),
                YzSeries: result.reduce((sum, obj) => sum + obj.YzSeries, 0),
                sum: 0 // 先初始化 sum，后面会进行计算  
            };

            // 计算合计的 sum 值  
            totalObject.sum = totalObject.lowSeries + totalObject.NorSeries + totalObject.FruitSeries + totalObject.YzzSeries + totalObject.YzSeries;

            // 添加合计对象到原数组最后  
            result.push(totalObject);

            return result;
        },
        //上期数据
        getdataPreList() {
            this.dataListLoading = true
            api.productonesellsite(this.dataForm1).then(res => {
                this.prevList = res
                this.convertBoxFields(this.prevList)

                this.mergedDataPreList = this.sumBoxes(this.prevList);
                console.log(this.mergedDataPreList,'mergedDataPreList')

                this.getYearList()


            })
        },
        //本期数据
        getdataList() {
            api.productonesellsite(this.dataForm).then(res => {
                this.dataList = res
                this.convertBoxFields(this.dataList)

                this.mergedDataList = this.sumBoxes(this.dataList);
                console.log(this.mergedDataList,'mergedDataList')

                //计算同比
                this.mergedDataList.forEach((item) => {
                    // 在 mergedDataPreList 中查找 orgname 匹配的对象  
                    const matchingPreItem = this.mergedDataPreList.find(preItem => preItem.nAME === item.nAME);

                    if (matchingPreItem) {
                        // 计算 lowRate  
                        const lowRate = ((item.lowSeries - matchingPreItem.lowSeries) / matchingPreItem.lowSeries) * 100; // 计算得出百分比  
                        const sumRate = ((item.sum - matchingPreItem.sum) / matchingPreItem.sum) * 100; // 计算得出百分比  
                        const diff = item.sum - matchingPreItem.sum
                        item.lowRate = !isNaN(lowRate) ? `${lowRate.toFixed(2)}%` : ''; // 格式化为百分比，保留两位小数或赋值为空  
                        item.sumRate = !isNaN(sumRate) ? `${sumRate.toFixed(2)}%` : '';
                        item.diff = diff.toFixed(0)
                    } else {
                        // 如果没有匹配的项，可以选择赋值为 0% 或其他默认值  
                        item.lowRate = '0%';
                        item.sumRate = '0%'
                    }
                });
                this.allList = [...this.mergedDataList]
                this.allList.forEach(allItem => {
                    // 在 result 中查找匹配的项  
                    const matchingResult = this.result.find(resultItem => resultItem.dqname === allItem.nAME);

                    // 如果找到匹配项，则将相应字段添加到 allItem 中  
                    if (matchingResult) {
                        allItem.LowyearRate = matchingResult.LowyearRate;
                        allItem.diffyear = matchingResult.diffyear;
                        allItem.totalyearRate = matchingResult.totalyearRate;
                        allItem.cur_task = matchingResult.cur_task;
                        allItem.curdiff = (matchingResult.cur_task - allItem.sum).toFixed(0);
                        allItem.currate = ((allItem.sum / matchingResult.cur_task) * 100).toFixed(2) + '%';
                    }
                });

                this.sortAndMoveTotal(this.allList);
                //遍历数组，为每个对象添加 Rank 字段  
                this.allList.forEach((item, index) => {
                    if (index < this.allList.length - 1) { // 只处理除了最后一个对象之外的对象  
                        item.Rank = index + 1; // Rank 从 1 开始  
                    }
                });
                this.dataListLoading = false
                console.log(this.allList, ' this.allList');

            })
        },
        sortAndMoveTotal(array) {
            // 通用比较函数，将"%"转换为数字以便排序  
            const parseLowYearRate = (rate) => parseFloat(rate.replace("%", ""));

            // 进行排序  
            array.sort((a, b) => {
                // 判断是否为“合计”对象  
                const isTotalA = a.nAME === "合计";
                const isTotalB = b.nAME === "合计";

                // 如果都是合计或者都不是，按LowyearRate降序排序  
                if (!isTotalA && !isTotalB) {
                    return parseLowYearRate(b.currate) - parseLowYearRate(a.currate);
                }

                // 将“合计”对象放到最后  
                return isTotalA ? 1 : -1;
            });
        },
        exportData() {
            this.$confirm('是否导出表格数据到Excel?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {

                exportExcel(this.allList, this.dataForm.p_vouchdateend, '日销量跟进表/战区.xlsx')

            })
        },
        //获取时间
        calculateDates() {
            const today = new Date();

            // 获取当前月份的月初时间   
            const startOfMonthDate = new Date(today.getFullYear(), today.getMonth(), 1);
            this.startOfMonth = this.formatDate(startOfMonthDate);

            // 获取截至今天的时间   
            this.endOfToday = this.formatDate(today);
            this.dataForm.p_vouchdatestart = this.startOfMonth;
            this.dataForm.p_vouchdateend = this.endOfToday;
            this.PerForm.p_vouchdateend = this.endOfToday;
            // 获取当前时间的上一年当前时间  
            const lastYearDate = new Date(today.getFullYear() - 1, today.getMonth(), today.getDate());
            this.lastYearDate = this.formatDate(lastYearDate); // 格式化为 YYYY-MM-DD  
            // 获取上一年当前月份的第一天  
            const lastYearStartOfMonthDate = new Date(today.getFullYear() - 1, today.getMonth(), 1);
            this.lastYearStartOfMonth = this.formatDate(lastYearStartOfMonthDate); // 格式化为 YYYY-MM-DD 
            this.dataForm1.p_vouchdatestart = this.lastYearStartOfMonth;
            this.dataForm1.p_vouchdateend = this.lastYearDate;
            // 打印上一年当前时间  
            console.log("上一年当前时间:", this.lastYearDate);
            console.log("上一年当前月份的第一天:", this.lastYearStartOfMonth);

            //获取动态月份
            const selectedDate = new Date(this.dataForm.p_vouchdateend);
            const month = selectedDate.getMonth() + 1; // getMonth() 返回 0-11，因此加 1   
            this.dynamicLabel = `${month}`;
        },

        formatDate(date) {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0'); // 月份从0开始，所以加1   
            const day = String(date.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
        },
    }
};
</script>

<style scoped lang="scss"></style>