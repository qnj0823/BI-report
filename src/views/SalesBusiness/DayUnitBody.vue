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
                    @click="getYearList">查询</el-button>
            </el-form-item>
            <el-button size="mini" class="filter-item" type="warning" icon="el-icon-download"
                @click="exportData">导出</el-button>
        </el-form>
        <div style="display: flex; justify-content: center; align-items: center;">
            <label>{{ labelText }}</label>
        </div>
        <el-table class="table" ref="table" border :data="dataALLList" v-loading="dataListLoading"
            style="width: 100%; margin: 0 auto; margin-bottom: 50px;">
            
            <el-table-column :show-overflow-tooltip="true" align="center" prop="orgname" label="战区" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="ocustomerclassName" label="单位体" />
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
} from './DayUnitBodyExpro.js'
import { number } from 'echarts/lib/export.js';
export default {
    name: 'Und-page',
    data() {
        return {
            msg: 'Und-page',
            dataForm: {
                p_vouchdateend: '',
                p_vouchdatestart: '',
                p_orgname: ''
            },
            dataForm1: {
                p_vouchdateend: '',
                p_vouchdatestart: '',
                p_orgname: ''
            },
            dictForm: {
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
            dataList: [],
            mergedDataList: [],
            uniqueOrgNames: [],
            allResults: [],
            dataPreList: [],
            mergedPreList: [],
            allPrets: [],
            allPromises: [],
            dataALLList: [],
            result: []

        };
    },
    created() {
        this.calculateDates();
    },
    mounted() {
        this.updateLabel()
        this.getYearList()
    },
    methods: {
        updateLabel() {
            const { p_vouchdatestart, p_vouchdateend } = this.dataForm;
            const selectedDate = new Date(p_vouchdateend); // 创建日期对象  
            const year = selectedDate.getFullYear(); // 获取年份  
            const month = selectedDate.getMonth() + 1; // 获取月份（0-11，需要加 1）  
            const day = selectedDate.getDate(); // 获取日期 
            this.labelText = `${year}年${month}月全国各单位体 完成进度---截止到${p_vouchdateend}`; // 如果没有选择日期，显示默认文本  

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
                this.dictForm.p_vouchdatestart = this.firstDayOfMonth


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
        sumBoxes(array) {
            //计算 box 字段的总和 
            const sum = array.reduce((accumulator, current) => accumulator + current.box, 0);
            // 提取 orgname 字段，假设所有对象的 orgname 字段相同  
            const orgname = array.length > 0 ? array[0].orgname : '';
            // 创建一个新对象并存储总和
            const result = { box: sum, ocustomerclassName: orgname + '小计' };
            // 将新对象推入数组 
            array.push(result);
            return array;
        },
        sumFields(array) {
            // 初始化累加器对象  
            const accumulator = {};

            // 设置需要累加的字段  
            const fieldsToSum = ["low_num", "last_year_low_num", "total_num", "last_year_total_num","cur_task"];

            // 遍历数组中的每个对象  
            for (const item of array) {
                // 仅对ocustomerClass_name包含"小计"的对象进行累加  
                if (item.ocustomerClass_name.includes("小计")) {
                    for (const key of fieldsToSum) {
                        // 累加指定字段的值，如果字段不存在则取0  
                        accumulator[key] = (accumulator[key] || 0) + (item[key] || 0);
                    }
                }
            }

            // 创建合计对象（只包含指定字段）  
            const totalObject = {
                ocustomerClass_name: "合计", // 设置 ocustomerClass_name 为“合计”  
                ...accumulator // 将累加的值展开到新对象中  
            };

            // 将合计对象添加到原数组中  
            array.push(totalObject);
        },
        //一年同期
        getYearList() {
            this.dataListLoading = true
            this.PerForm.p_vouchdateend = this.dataForm.p_vouchdateend
            api.progressApi(this.PerForm).then(res => {
                const resultdata = [];
                // 使用 Map 来存储和汇总数据  
                const summaryMap = new Map();

                res.forEach(item => {
                    const { dqname, total_num, last_year_total_num, low_num, last_year_low_num, cur_task } = item;

                    // 将 total_num 和 last_year_total_num 转换为数字  
                    const totalNumValue = Number(total_num);
                    const lastYearTotalNumValue = Number(last_year_total_num);
                    const Lownum = Number(low_num);
                    const lastLow = Number(last_year_low_num);
                    const curtask = Number(cur_task)

                    // 如果 Map 中已经存在这个 dqname，就累加相应的字段  
                    if (summaryMap.has(dqname)) {
                        const existing = summaryMap.get(dqname);
                        existing.total_num += totalNumValue;  // 累加 total_num 字段  
                        existing.last_year_total_num += lastYearTotalNumValue;  // 累加 last_year_total_num 字段  
                        existing.low_num += Lownum;
                        existing.last_year_low_num += lastLow;
                        existing.cur_task += curtask
                    } else {
                        // 如果不存在，则新增一个项  
                        summaryMap.set(dqname, {
                            dqname,
                            total_num: totalNumValue,  // 确保值为数字  
                            last_year_total_num: lastYearTotalNumValue,  // 确保值为数字  
                            low_num: Lownum,
                            last_year_low_num: lastLow,
                            cur_task: curtask,
                            ocustomerClass_name: dqname + "小计",
                            
                        });
                    }
                });
                // 将汇总后的对象添加到结果数组中  
                summaryMap.forEach(value => resultdata.push(value));
                // 原数组与新对象合并  
                const finalResult = [...res, ...resultdata];
                this.sumFields(finalResult)
                console.log(finalResult, 'finalResult')


                this.result = finalResult.map(obj => {
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
                console.log(this.result, 'this.result');
                this.getZQList()
            })
        },
        getZQList() {
            api.vProductXiDqAll(this.dictForm).then(res => {
                this.uniqueOrgNames = [...new Set(res.map(item => item.orgname))];
                this.getDataList()
                this.getdataPreList()
            })
        },
        //上期
        getdataPreList() {
            // 初始化 mergedDataList 和 allResults  
            this.mergedPreList = [];
            this.allPrets = []

            // 定义一个处理 API 响应的函数  
            const fetchData = (orgname) => {
                this.dataForm1.p_orgname = orgname; // 将当前 orgname 赋值给 dataForm  
                return api.vProductXiCompanyAll(this.dataForm1).then(res => {
                    this.dataPreList = res;
                    this.dataPreList = this.dataPreList.filter(product => product.productClassPname !== '其它');

                    const sumMap = new Map();
                    // 遍历原数组，将 box 值相加  
                    this.dataPreList.forEach(item => {
                        if (sumMap.has(item.ocustomerclassName)) {
                            sumMap.set(item.ocustomerclassName, sumMap.get(item.ocustomerclassName) + item.box);
                        } else {
                            sumMap.set(item.ocustomerclassName, item.box);
                        }
                    });
                    // 创建修改后的数组  
                    this.dataPreList = this.dataPreList.map(item => ({
                        ...item, // 保留原对象的字段  
                        sum: sumMap.get(item.ocustomerclassName) // 添加新字段 sum  
                    }));

                    this.dataPreList = this.sumBoxes(this.dataPreList);

                    const currData = this.dataPreList.map(item => {
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
                            sqname: item.sqname,
                            ocustomerclassName: item.ocustomerclassName,
                            productClassPname: item.productClassPname,
                            sum: item.sum
                        };
                    });

                    this.mergedPreList = currData.reduce((acc, item) => {
                        // 查找已存在的对象
                        let existingOrg = acc.find(org => org.ocustomerclassName === item.ocustomerclassName);

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
                    this.mergedPreList = this.mergedPreList.map(item => {
                        // 检查 orgname 是否为 "小计"  
                        if (item.ocustomerclassName.includes("小计")) {
                            return {
                                ...item,
                                sum: item.box, // 将 box 的值赋给 
                                box: undefined // 删除原来的 box 字段 
                            };
                        }
                        return item; // 返回原对象
                    });
                    // 初始化总和变量
                    let totalLowSeries = 0;
                    let totalNorSeries = 0;
                    let totalFruitSeries = 0;
                    let totalYzSeries = 0;
                    let totalYzzSeries = 0;

                    // 遍历数据汇总
                    this.mergedPreList.forEach(item => {
                        totalLowSeries += item.lowSeries || 0;
                        totalNorSeries += item.NorSeries || 0; // 确保值存在
                        totalFruitSeries += item.FruitSeries || 0;
                        totalYzSeries += item.YzSeries || 0;
                        totalYzzSeries += item.YzzSeries || 0;

                    });

                    // 将总和放入小计对象中
                    const totalObject = this.mergedPreList.find(item => item.ocustomerclassName.includes("小计"));
                    if (totalObject) {
                        totalObject.lowSeries = totalLowSeries;
                        totalObject.NorSeries = totalNorSeries;
                        totalObject.FruitSeries = totalFruitSeries;
                        totalObject.YzSeries = totalYzSeries;
                        totalObject.YzzSeries = totalYzzSeries;

                    }
                    this.allPrets.push(...this.mergedPreList)

                });
            };

            // 创建一个所有请求的 Promise 数组  
            const allPromisesPre = this.uniqueOrgNames.map(orgname => fetchData(orgname));

            // 等待所有 API 调用完成  
            Promise.all(allPromisesPre).then(() => {
                this.sumSpecifiedFields(this.allPrets);
                console.log(this.allPrets, 'this.allPrets')

                // 等待所有 API 调用完成  
                Promise.all(this.allPromises).then(() => {
                    this.sumSpecifiedFields(this.allResults);
                    console.log(this.allResults, 'this.allResults')
                    //计算同比
                    this.allResults.forEach((item) => {
                        // 在 allPrets 中查找 ocustomerclassName 匹配的对象  
                        const matchingPreItem = this.allPrets.find(preItem => preItem.ocustomerclassName === item.ocustomerclassName);

                        if (matchingPreItem) {
                            // 计算 lowRate  
                            const lowRate = ((item.lowSeries - matchingPreItem.lowSeries) / matchingPreItem.lowSeries) * 100; // 计算得出百分比  
                            const sumRate = ((item.sum - matchingPreItem.sum) / matchingPreItem.sum) * 100; // 计算得出百分比  
                            const diff = item.sum - (matchingPreItem.sum ? matchingPreItem.sum : 0)
                            item.lowRate = !isNaN(lowRate) ? `${lowRate.toFixed(2)}%` : ''; // 格式化为百分比，保留两位小数或赋值为空  
                            item.sumRate = !isNaN(sumRate) ? `${sumRate.toFixed(2)}%` : '';
                            item.diff = diff
                        } else {
                            // 如果没有匹配的项，可以选择赋值为 0% 或其他默认值  
                            item.lowRate = '0%';
                            item.sumRate = '0%';
                            item.diff = item.sum
                        }
                    });
                    this.dataListLoading = false
                    this.dataALLList = [...this.allResults]

                    this.allResults.forEach(allItem => {
                        // 在 result 中查找匹配的项  
                        const matchingResult = this.result.find(resultItem => resultItem.ocustomerClass_name === allItem.ocustomerclassName);

                        // 如果找到匹配项，则将相应字段添加到 allItem 中  
                        if (matchingResult) {
                            allItem.LowyearRate = matchingResult.LowyearRate;
                            allItem.diffyear = matchingResult.diffyear;
                            allItem.totalyearRate = matchingResult.totalyearRate;
                            allItem.cur_task = matchingResult.cur_task;
                            allItem.curdiff = (matchingResult.cur_task - allItem.sum).toFixed(0);
                            allItem.currate = (matchingResult.cur_task > 0)
                                ? ((allItem.sum / matchingResult.cur_task) * 100).toFixed(2) + '%'
                                : '0.00%';
                        }
                    });

                    // console.log("所有数据请求完成:", this.allResults);
                });

            });

        },

        sumSpecifiedFields(array) {
            // 初始化累加器对象  
            const accumulator = {};

            // 设置需要累加的字段  
            const fieldsToSum = ["FruitSeries", "NorSeries", "YzSeries", "YzzSeries", "lowSeries", "sum"];

            // 遍历数组中的每个对象  
            for (const item of array) {
                // 仅对ocustomerclassName不等于"合计"的对象进行累加  
                if (!item.ocustomerclassName.includes("小计")) { // 假设“小计”是需要避开的标识  
                    for (const key of fieldsToSum) {
                        // 累加指定字段的值，如果字段不存在则取0  
                        accumulator[key] = (accumulator[key] || 0) + (item[key] || 0);
                    }
                }
            }

            // 创建合计对象（只包含指定字段）  
            const totalObject = {
                ocustomerclassName: "合计", // 设置 ocustomerclassName 为“合计”  
                ...accumulator // 将累加的值展开到新对象中  
            };

            // 将合计对象添加到原数组中  
            array.push(totalObject);
        },
        //本期
        getDataList() {
            // 初始化 mergedDataList 和 allResults  
            this.mergedDataList = [];
            this.allResults = []

            // 定义一个处理 API 响应的函数  
            const fetchData = (orgname) => {
                this.dataForm.p_orgname = orgname; // 将当前 orgname 赋值给 dataForm  
                return api.vProductXiCompanyAll(this.dataForm).then(res => {
                    this.dataList = res;
                    this.dataList = this.dataList.filter(product => product.productClassPname !== '其它');

                    const sumMap = new Map();
                    // 遍历原数组，将 box 值相加  
                    this.dataList.forEach(item => {
                        if (sumMap.has(item.ocustomerclassName)) {
                            sumMap.set(item.ocustomerclassName, sumMap.get(item.ocustomerclassName) + item.box);
                        } else {
                            sumMap.set(item.ocustomerclassName, item.box);
                        }
                    });
                    // 创建修改后的数组  
                    this.dataList = this.dataList.map(item => ({
                        ...item, // 保留原对象的字段  
                        sum: sumMap.get(item.ocustomerclassName) // 添加新字段 sum  
                    }));

                    this.dataList = this.sumBoxes(this.dataList);

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
                            sqname: item.sqname,
                            ocustomerclassName: item.ocustomerclassName,
                            productClassPname: item.productClassPname,
                            sum: item.sum
                        };
                    });

                    this.mergedDataList = currData.reduce((acc, item) => {
                        // 查找已存在的对象
                        let existingOrg = acc.find(org => org.ocustomerclassName === item.ocustomerclassName);

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
                        // 检查 orgname 是否为 "小计"  
                        if (item.ocustomerclassName.includes("小计")) {
                            return {
                                ...item,
                                sum: item.box, // 将 box 的值赋给 
                                box: undefined // 删除原来的 box 字段 
                            };
                        }
                        return item; // 返回原对象
                    });
                    // 初始化总和变量
                    let totalLowSeries = 0;
                    let totalNorSeries = 0;
                    let totalFruitSeries = 0;
                    let totalYzSeries = 0;
                    let totalYzzSeries = 0;

                    // 遍历数据汇总
                    this.mergedDataList.forEach(item => {
                        totalLowSeries += item.lowSeries || 0;
                        totalNorSeries += item.NorSeries || 0; // 确保值存在
                        totalFruitSeries += item.FruitSeries || 0;
                        totalYzSeries += item.YzSeries || 0;
                        totalYzzSeries += item.YzzSeries || 0;

                    });

                    // 将总和放入小计对象中
                    const totalObject = this.mergedDataList.find(item => item.ocustomerclassName.includes("小计"));
                    if (totalObject) {
                        totalObject.lowSeries = totalLowSeries;
                        totalObject.NorSeries = totalNorSeries;
                        totalObject.FruitSeries = totalFruitSeries;
                        totalObject.YzSeries = totalYzSeries;
                        totalObject.YzzSeries = totalYzzSeries;

                    }
                    this.allResults.push(...this.mergedDataList)
                });
            };

            // 创建一个所有请求的 Promise 数组  
            this.allPromises = this.uniqueOrgNames.map(orgname => fetchData(orgname));


        },
        exportData() {
            this.$confirm('是否导出表格数据到Excel?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {

                exportExcel(this.dataALLList, this.dataForm.p_vouchdateend, '日销量跟进表/单位体.xlsx')

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
            this.dataForm.p_vouchdatestart = this.startOfMonth
            this.dataForm.p_vouchdateend = this.endOfToday
            this.dictForm.p_vouchdatestart = this.startOfMonth
            this.dictForm.p_vouchdateend = this.endOfToday

            // 获取当前时间的上一年当前时间  
            const lastYearDate = new Date(today.getFullYear() - 1, today.getMonth(), today.getDate());
            this.lastYearDate = this.formatDate(lastYearDate); // 格式化为 YYYY-MM-DD  
            // 获取上一年当前月份的第一天  
            const lastYearStartOfMonthDate = new Date(today.getFullYear() - 1, today.getMonth(), 1);
            this.lastYearStartOfMonth = this.formatDate(lastYearStartOfMonthDate); // 格式化为 YYYY-MM-DD 
            this.dataForm1.p_vouchdatestart = this.lastYearStartOfMonth;
            this.dataForm1.p_vouchdateend = this.lastYearDate;

            //获取动态月份
            const selectedDate = new Date(this.dataForm.p_vouchdateend);
            const month = selectedDate.getMonth() + 1; // getMonth() 返回 0-11，因此加 1 
            this.dynamicLabel = `${month}`
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

<style scoped lang="scss">
::v-deep .table .el-table__cell {
    padding: 0px !important;
}

;

::v-deep th.el-table__cell>.cell {
    padding: 0px !important;
}

;

::v-deep .el-table__header-wrapper {
    font-size: 15px;
}

// ::v-deep .el-table .el-table__body-wrapper tbody tr:last-child {
//     font-size: 15px;
//     /* 根据需要设置字体大小 */
//     font-weight: 600;
// }

::v-deep .el-table th {
    background: #f5f7fa;
}
</style>