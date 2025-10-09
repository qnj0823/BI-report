<template>
    <div class='old'>
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
        </el-form>
        <div style="display: flex; justify-content: center; align-items: center;">
            <label>{{ labelText }}</label>
        </div>
        <el-table class="table" ref="table" border :data="mergedDataList" v-loading="dataListLoading"
            style="width: 95%; margin: 0 auto; margin-bottom: 50px;">
            <el-table-column :show-overflow-tooltip="true" align="center" prop="orgname" label="战区" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="lastlowSeries"
                :label="'上年' + dynamicLabel + '月销量累计'" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="lowSeries"
                :label="'本年' + dynamicLabel + '月销量累计'" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="MonthRate" label="同比完成率(本月)" />
            <el-table-column prop="mothdiff" align="center" label="差额件数" />
            <el-table-column prop="last_year_low_num" align="center" label="上年截止当日销量累计" />
            <el-table-column prop="low_num" align="center" label="本年截止当日销量累计" />
            <el-table-column prop="LastRate" align="center" label="同比完成率(当日)" />
            <el-table-column prop="lastdiff" align="center" label="差额件数" />
        </el-table>
    </div>
</template>

<script>
import * as api from '@/api/frame/customer.js'
import {
    exportExcel
} from './OldIncreaseExpro.js'
export default {
    name: 'old-page',
    data() {
        return {
            msg: 'old-page',
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
            result: []
        };
    },
    created() {
        this.calculateDates();
    },
    mounted() {
        this.getdataPreList()
        this.updateLabel()

    },
    methods: {
        updateLabel() {
            const { p_vouchdatestart, p_vouchdateend } = this.dataForm;
            const selectedDate = new Date(p_vouchdateend); // 创建日期对象  
            const year = selectedDate.getFullYear(); // 获取年份  
            const month = selectedDate.getMonth() + 1; // 获取月份（0-11，需要加 1）  
            const day = selectedDate.getDate(); // 获取日期 
            this.labelText = `截止${year}年${month}月${day}日全国各老品增幅情况表`; // 如果没有选择日期，显示默认文本  

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

                // 获取上一年当前月最后一天 
                const lastYearLastDayOfCurrentMonth = new Date(currentYear - 1, currentMonth + 1, 0); // 0 means the last day of the previous month  


                // 获取格式化字符串 
                const formattedFirstDayLastYear = this.formatDate(firstDayLastYear);
                const formattedLastYearCurrentDate = this.formatDate(lastYearLastDayOfCurrentMonth); // '2024-01-09'  
                this.dataForm1.p_vouchdatestart = formattedFirstDayLastYear;
                this.dataForm1.p_vouchdateend = formattedLastYearCurrentDate;

                // 输出结果  
                console.log("上一年当前月份的第一天:", formattedFirstDayLastYear); // 输出: 2024-01-01  
                console.log("上一年当前月份最后一天:", formattedLastYearCurrentDate); // 输出: 2024-01-09  

                this.updateLabel()
            } else {
                this.firstDayOfMonth = ''; // 如果没有选择日期，重置  
            }
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
            // 获取当前时间的上一年当前月最后一天  
            const lastYearDate = new Date(today.getFullYear() - 1, today.getMonth() + 1, 0); // Last day of the current month last year  
            this.lastYearDate = this.formatDate(lastYearDate); // Format as YYYY-MM-DD  

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
            const fieldsToSum = ["low_num", "last_year_low_num", "total_num", "last_year_total_num"];

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

                this.sumFields(this.result)

                this.result = this.result.map(obj => {
                    const LowyearRate = (obj.last_year_low_num == 0 || obj.low_num == 0)
                        ? '0%'
                        : (((obj.low_num - obj.last_year_low_num) / obj.last_year_low_num) * 100).toFixed(2) + '%';


                    const diffyear = (obj.low_num - obj.last_year_low_num).toFixed(0);

                    return {
                        ...obj,
                        LowyearRate,
                        diffyear,
                    };
                });
                console.log(this.result, 'result')

                this.getdataList()
            })
        },
        //本月
        getdataList() {
            api.vProductXiDqAll(this.dataForm).then(res => {
                this.dataList = res
                this.dataList = this.dataList.filter(product => product.productClassPname !== '其它');
                const sumMap = new Map();
                // 遍历原数组，将 box 值相加  
                this.dataList.forEach(item => {
                    if (sumMap.has(item.orgname)) {
                        sumMap.set(item.orgname, sumMap.get(item.orgname) + item.box);
                    } else {
                        sumMap.set(item.orgname, item.box);
                    }
                });
                // 创建修改后的数组  
                this.dataList = this.dataList.map(item => ({
                    ...item, // 保留原对象的字段  
                    sum: sumMap.get(item.orgname) // 添加新字段 sum  
                }));
                this.dataListLoading = false

                const currData = this.dataList.map(item => {
                    // 确定新的属性名 
                    let newFieldName;
                    switch (item.productClassPname) {
                        case "低温系列":
                            newFieldName = "lowSeries";
                            break;
                        case "常温系列":
                            newFieldName = "NorSeries";
                            break;
                        case "果汁系列":
                            newFieldName = "FruitSeries";
                            break;
                        case "椰子牛乳系列":
                            newFieldName = "YzSeries";
                            break;
                        case "椰子汁系列":
                            newFieldName = "YzzSeries";
                            break;
                        default:
                            newFieldName = "box"; // 如果没有匹配的项，保持原字段名 
                    }

                    // 创建一个新的对象，使用新字段名并保留原 box 值 
                    return {
                        [newFieldName]: item.box, // 使用动态属性名 
                        orgname: item.orgname,
                        productClassPname: item.productClassPname,
                        sum: item.sum
                    };
                });

                this.mergedDataList = currData.reduce((acc, item) => {
                    // 查找已存在的对象
                    let existingOrg = acc.find(org => org.orgname === item.orgname);

                    if (existingOrg) {
                        // 如果找到了，合并当前对象的字段 
                        Object.assign(existingOrg, item); // 将 item 的字段合并到 
                        existingOrg
                    } else {
                        // 如果没有找到，将当前对象添加到数组 
                        acc.push({ ...item }); // 使用展开运算符复制当前对象 
                    }

                    return acc; // 返回累加器
                }, []);
                this.mergedDataList = this.mergedDataList.map(item => {
                    // 检查 orgname 是否为 "合计"  
                    if (item.orgname === "合计") {
                        return {
                            ...item,
                            sum: item.box, // 将 box 的值赋给 
                            box: undefined // 删除原来的 box 字段 
                        };
                    }
                    return item; // 返回原对象
                });

                // 指定需要累加的字段
                const fieldsToSum = ['FruitSeries', 'NorSeries', 'YzSeries', 'YzzSeries', 'lowSeries', 'sum'];

                // 使用 reduce 方法计算合计
                const total = this.mergedDataList.reduce((acc, obj) => {
                    fieldsToSum.forEach(field => {
                        acc[field] = (acc[field] || 0) + (obj[field] || 0);
                    });
                    return acc;
                }, {});

                // 创建合计对象
                const totalObject = { orgname: "合计", ...total };

                // 将合计对象添加到原数组中
                this.mergedDataList.push(totalObject);

                this.mergedDataList.forEach(item => {
                    // 在 mergedDataPreList 中找到匹配的 orgname  
                    const match = this.mergedDataPreList.find(preItem => preItem.orgname === item.orgname);

                    // 如果找到了匹配的对象，将 lastlowSeries 和 lastsum 添加到当前项  
                    if (match) {
                        item.lastlowSeries = match.lastlowSeries;
                        item.lastsum = match.lastsum;
                    }
                });

                this.mergedDataList.forEach(item => {
                    // 在 mergedDataPreList 中找到匹配的 orgname  
                    const match = this.result.find(preItem => preItem.dqname === item.orgname);

                    // 如果找到了匹配的对象，将 lastlowSeries 和 lastsum 添加到当前项  
                    if (match) {
                        item.low_num = match.low_num;
                        item.last_year_low_num = match.last_year_low_num;
                    }
                });
                this.mergedDataList.forEach(item => {
                    // 确保字段存在，如果不存在则赋值为0  
                    const lastlowSeries = item.lastlowSeries || 0; // 如果 lastlowSeries 未定义，则取0  
                    const low_num = item.low_num || 0;             // 如果 low_num 未定义，则取0  
                    const last_year_low_num = item.last_year_low_num || 0; // 如果 last_year_low_num 未定义，则取0  
                    const lowSeries = item.lowSeries || 0
                    // 计算月率和差值  
                    const monthrate = lastlowSeries !== 0 ? (lowSeries / lastlowSeries) * 100 : 0;
                    const mothdiff = lowSeries - lastlowSeries;
                    const lastrate = last_year_low_num !== 0 ? (low_num / last_year_low_num) * 100 : 0;
                    const lastdiff = low_num - last_year_low_num;

                    // 将结果赋值给新字段  
                    item.MonthRate = monthrate.toFixed(2) + '%'; // 保留两位小数，并加上百分号  月  
                    item.mothdiff = mothdiff;                     // 月差值  
                    item.LastRate = lastrate.toFixed(2) + '%';   // 保留两位小数，并加上百分号  年  
                    item.lastdiff = lastdiff;                     // 年差值  
                });
                this.mergedDataList.sort((a, b) => {
                    // Check if either a or b has orgname equal to "合计"  
                    const isACombined = a.orgname === "合计";
                    const isBCombined = b.orgname === "合计";

                    if (isACombined && !isBCombined) {
                        return 1; // Move a to the end  
                    }
                    if (!isACombined && isBCombined) {
                        return -1; // Move b to the end  
                    }

                    // If neither or both are "合计", sort by MonthRate  
                    const rateA = parseFloat(a.MonthRate);
                    const rateB = parseFloat(b.MonthRate);
                    return rateB - rateA; // Descending order  
                });

                console.log(this.mergedDataList, '今年', this.mergedDataPreList, '去年')

            })

        },
        sortAndMoveTotal(array) {
            // 通用比较函数，将"%"转换为数字以便排序  
            const parseLowYearRate = (rate) => parseFloat(rate.replace("%", ""));

            // 进行排序  
            array.sort((a, b) => {
                // 判断是否为“合计”对象  
                const isTotalA = a.orgname === "合计";
                const isTotalB = b.orgname === "合计";

                // 如果都是合计或者都不是，按LowyearRate降序排序  
                if (!isTotalA && !isTotalB) {
                    return parseLowYearRate(b.LowyearRate) - parseLowYearRate(a.LowyearRate);
                }

                // 将“合计”对象放到最后  
                return isTotalA ? 1 : -1;
            });
        },
        getdataPreList() {
            this.dataListLoading = true
            api.vProductXiDqAll(this.dataForm1).then(res => {
                this.prevList = res
                this.prevList = this.prevList.filter(product => product.productClassPname !== '其它');
                const sumMap = new Map();
                // 遍历原数组，将 box 值相加  
                this.prevList.forEach(item => {
                    if (sumMap.has(item.orgname)) {
                        sumMap.set(item.orgname, sumMap.get(item.orgname) + item.box);
                    } else {
                        sumMap.set(item.orgname, item.box);
                    }
                });
                // 创建修改后的数组  
                this.prevList = this.prevList.map(item => ({
                    ...item, // 保留原对象的字段  
                    sum: sumMap.get(item.orgname) // 添加新字段 sum  
                }));

                const currData = this.prevList.map(item => {
                    // 确定新的属性名 
                    let newFieldName;
                    switch (item.productClassPname) {
                        case "低温系列":
                            newFieldName = "lastlowSeries";
                            break;
                        case "常温系列":
                            newFieldName = "lastNorSeries";
                            break;
                        case "果汁系列":
                            newFieldName = "lastFruitSeries";
                            break;
                        case "椰子牛乳系列":
                            newFieldName = "lastYzSeries";
                            break;
                        case "椰子汁系列":
                            newFieldName = "lastYzzSeries";
                            break;
                        default:
                            newFieldName = "lastbox"; // 如果没有匹配的项，保持原字段名 
                    }

                    // 创建一个新的对象，使用新字段名并保留原 box 值 
                    return {
                        [newFieldName]: item.box, // 使用动态属性名 
                        orgname: item.orgname,
                        productClassPname: item.productClassPname,
                        lastsum: item.sum
                    };
                });

                this.mergedDataPreList = currData.reduce((acc, item) => {
                    // 查找已存在的对象
                    let existingOrg = acc.find(org => org.orgname === item.orgname);

                    if (existingOrg) {
                        // 如果找到了，合并当前对象的字段 
                        Object.assign(existingOrg, item); // 将 item 的字段合并到 
                        existingOrg
                    } else {
                        // 如果没有找到，将当前对象添加到数组 
                        acc.push({ ...item }); // 使用展开运算符复制当前对象 
                    }

                    return acc; // 返回累加器
                }, []);
                this.mergedDataPreList = this.mergedDataPreList.map(item => {
                    // 检查 orgname 是否为 "合计"  
                    if (item.orgname === "合计") {
                        return {
                            ...item,
                            lastsum: item.box, // 将 box 的值赋给 
                            box: undefined // 删除原来的 box 字段 
                        };
                    }
                    return item; // 返回原对象
                });

                // 指定需要累加的字段
                const fieldsToSum = ['lastFruitSeries', 'lastNorSeries', 'lastYzSeries', 'lastYzzSeries', 'lastlowSeries', 'lastsum'];

                // 使用 reduce 方法计算合计
                const total = this.mergedDataPreList.reduce((acc, obj) => {
                    fieldsToSum.forEach(field => {
                        acc[field] = (acc[field] || 0) + (obj[field] || 0);
                    });
                    return acc;
                }, {});

                // 创建合计对象
                const totalObject = { orgname: "合计", ...total };

                // 将合计对象添加到原数组中
                this.mergedDataPreList.push(totalObject);
                this.getYearList()
            })

        },
        exportData() {
            this.$confirm('是否导出表格数据到Excel?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {

                exportExcel(this.mergedDataList, this.dataForm.p_vouchdateend, '老品增幅情况表.xlsx')

            })
        },
    }
};
</script>

<style scoped lang="scss"></style>