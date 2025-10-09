<template>
    <div class='OF'>
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
                    @click="getDataList">查询</el-button>
            </el-form-item>
            <el-button size="mini" class="filter-item" type="warning" icon="el-icon-download"
                @click="exportData">导出</el-button>
        </el-form>
        <div style="display: flex; justify-content: center; align-items: center;">
            <label>{{ labelText }}</label>
        </div>
        <el-table class="table" ref="table" border :data="updatedArray" v-loading="dataListLoading"
            style="width: 100%; margin: 0 auto; margin-bottom: 50px;">
            <el-table-column :show-overflow-tooltip="true" align="center" width="80" prop="Rank" label="战区内老品增幅排名" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="orgdqname" label="战区" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="orgname" label="单位体" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="fzr" label="总经理" />
            <el-table-column align="center" :label="dynamicLabel + '月预算目标'">
                <el-table-column :show-overflow-tooltip="true" align="center" prop="Moldmthbox" label="低温系列(老品)" />
                <el-table-column :show-overflow-tooltip="true" align="center" prop="Mnewmthbox" label="其它系列(新品)" />
                <el-table-column :show-overflow-tooltip="true" align="center" prop="Mallsum" label="合计" />
            </el-table-column>
            <el-table-column align="center" :label="'截至' + dayLabel + '号实际达成(自然件)'">
                <el-table-column :show-overflow-tooltip="true" align="center" prop="lowBox" label="低温系列" />
                <el-table-column :show-overflow-tooltip="true" align="center" prop="nowBox" label="常温系列" />
                <el-table-column :show-overflow-tooltip="true" align="center" prop="FruBox" label="果汁系列" />
                <el-table-column :show-overflow-tooltip="true" align="center" prop="yzzBox" label="椰子汁系列" />
                <el-table-column :show-overflow-tooltip="true" align="center" prop="yznlBox" label="椰子牛乳系列" />
            </el-table-column>
            <el-table-column align="center" label="预算目标达成进度">
                <el-table-column :show-overflow-tooltip="true" align="center" prop="mouthDiff" label="本月缺口" />
                <el-table-column :show-overflow-tooltip="true" align="center" prop="remainingDays" label="余下天数" />
                <el-table-column :show-overflow-tooltip="true" align="center" prop="remainingbox" label="余下每日目标" />
            </el-table-column>
            <el-table-column align="center" label="同比增幅(截止当日)">
                <el-table-column :show-overflow-tooltip="true" align="center" prop="oldbox" label="老品" />
                <el-table-column :show-overflow-tooltip="true" align="center" prop="LowRate" label="累计増幅" />
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
import * as api from '@/api/frame/customer.js'
import {
    exportExcel
} from './SummaryOFnationalExpro.js'
export default {
    name: 'OF-page',
    data() {
        return {
            msg: 'OF-page',
            dataForm: {
                p_vouchdateend: '',
                p_vouchdatestart: '',
            },
            dataForm1: {
                p_vouchdateend: '',
                p_vouchdatestart: '',
            },
            taskForm: {
                page: 0,
                size: 800,
                sort: '',
            },
            dataListLoading: false,
            labelText: '',
            dynamicLabel: '',
            dayLabel: '',
            firstDayOfMonth: '',//选择之后月份第一天
            dataPreList: [],
            resultPre: [],
            dataList: [],
            taskList: [],
            mergedData: [],
            updatedArray: []
        };
    },
    created() {
        this.calculateDates();
    },
    mounted() {
        this.updateLabel()
        this.getDataList()
    },
    methods: {
        //合并数据
        mergeObjects(dataList) {
            const result = {};

            dataList.forEach(item => {
                // 使用 nAME 和 ocustomerClass_name 生成唯一键  
                const key = `${item.nAME}-${item.ocustomerClass_name}`;

                if (!result[key]) {
                    // 第一次遇到这个组合，初始化一个对象，只包含待保留的字段  
                    result[key] = {
                        nAME: item.nAME,
                        ocustomerClass_name: item.ocustomerClass_name
                    };
                }

                // 合并当前项的其他属性，排除 attribute 和 product_class_pname  
                for (const [attribute, value] of Object.entries(item)) {
                    if (attribute !== 'nAME' && attribute !== 'ocustomerClass_name' && attribute !== 'attribute' && attribute !== 'product_class_pname') {
                        result[key][attribute] = value; // 更新属性  
                    }
                }
            });

            // 转换为数组并返回结果  
            return Object.values(result);
        },
        //去出当前月的数据
        filterFieldsByDate(dataArray, dateString) {
            // 从日期字符串中提取月份和年份  
            const date = new Date(dateString);
            const currentMonth = date.getMonth() + 1; // getMonth() 返回 0-11  
            const currentYear = date.getFullYear();
            const inputDay = date.getDate(); // 获取传入日期的天数  

            // 获取当月的天数  
            const daysInMonth = new Date(currentYear, currentMonth, 0).getDate();

            // 计算剩余天数  
            const remainingDays = daysInMonth - inputDay;

            // 创建一个新的数组来存储结果  
            const result = dataArray.map((data) => {
                // 创建一个新的对象来存储每个对象的结果  
                const filteredData = { ...data }; // 先复制所有字段  

                // 删除当前月份及之前和之后的字段  
                for (let month = 1; month <= 12; month++) {
                    if (month !== currentMonth) {
                        const monthSuffix = month < 10 ? `${month}` : month; // 格式化为两位数  
                        delete filteredData[`yearmonth${monthSuffix}New`];
                        delete filteredData[`yearmonth${monthSuffix}Old`];
                    } else {
                        // 新建字段并赋值  
                        const monthSuffix = month < 10 ? `${month}` : month;
                        filteredData.Mnewmthbox = filteredData[`yearmonth${monthSuffix}New`];
                        filteredData.Moldmthbox = filteredData[`yearmonth${monthSuffix}Old`];
                        // 添加当月天数和剩余天数  
                        filteredData.daysInCurrentMonth = daysInMonth;
                        filteredData.remainingDays = remainingDays;
                    }
                }

                return filteredData;
            });

            return result;
        },
        //排序
        rankData(data) {
            // 转换 LowRate 为数字并按 orgdqname 分组  
            const groupedData = data.reduce((acc, obj) => {
                const rate1 = parseFloat(obj.LowRate) / 100; // 将 LowRate 转换为数字  
                if (!acc[obj.orgdqname]) {
                    acc[obj.orgdqname] = [];
                }
                acc[obj.orgdqname].push({ ...obj, LowRate1: rate1 });
                return acc;
            }, {});

            // 按 LowRate 排序并添加 Rank  
            const rankedData = [];
            Object.keys(groupedData).forEach(orgdqname => {
                const items = groupedData[orgdqname];
                items.sort((a, b) => b.LowRate1 - a.LowRate1); // 降序排序 LowRate  
                items.forEach((item, index) => {
                    rankedData.push({ ...item, Rank: index + 1 }); // 添加 Rank 字段  
                });
            });

            return rankedData;
        },

        //计划数据
        getTaskList() {
            api.CompanyTrackcheckApi(this.taskForm).then(res => {
                this.taskList = res.content
                // 合并到 this.taskList  
                this.mergedData.forEach(mergedItem => {
                    // 对比 nAME 和 ocustomerClass_name 与 orgdqname 和 orgname  
                    this.taskList.forEach(taskItem => {
                        if (mergedItem.nAME === taskItem.orgdqname && mergedItem.ocustomerClass_name === taskItem.orgname) {
                            // 添加合并数据的其他字段到 taskItem 中  
                            for (const [key, value] of Object.entries(mergedItem)) {
                                if (key !== 'nAME' && key !== 'ocustomerClass_name') {
                                    taskItem[key] = value; // 添加字段  
                                }
                            }
                        }
                    });
                });
                // 输出结果  
                console.log(this.taskList, '计划数据')
                // 对比并累加 oldbox  
                this.resultPre.forEach(result => {
                    const task = this.taskList.find(
                        t => t.orgdqname === result.nAME && t.orgname === result.ocustomerClass_name
                    );

                    if (task) {
                        task.oldbox = Number(result.oldbox).toFixed(2);
                    }
                });


                // 调用函数并打印结果  
                const filteredData = this.filterFieldsByDate(this.taskList, this.dataForm.p_vouchdateend);

                //计算
                this.updatedArray = filteredData.map(item => {
                    const MnewmthboxValue = Number(item.Mnewmthbox); // 转换为数字  
                    const MoldmthboxValue = Number(item.Moldmthbox); // 转换为数字  
                    const Mallsum = MnewmthboxValue + MoldmthboxValue;

                    const lowBoxValue = Number(item.lowBox) || 0;
                    const nowBoxValue = Number(item.nowBox) || 0;
                    const yznlBoxValue = Number(item.yznlBox) || 0;
                    const yzzBoxValue = Number(item.yzzBox) || 0;
                    const FruBoxValue = Number(item.FruBox) || 0;

                    const totalSubtraction = lowBoxValue + nowBoxValue + yznlBoxValue + yzzBoxValue + FruBoxValue;
                    const mouthDiff = Mallsum - totalSubtraction

                    const LowRate = (!item.lowBox || !item.oldbox || item.oldbox === 0)
                        ? '0%'
                        : (((item.lowBox - item.oldbox) / item.oldbox) * 100).toFixed(2) + '%';

                    return {
                        ...item, // 保留原来的属性  
                        Mallsum: Mallsum, // 计算并赋值 Mallsum
                        total: totalSubtraction,
                        mouthDiff: mouthDiff,
                        remainingbox: (mouthDiff / item.remainingDays).toFixed(2),
                        LowRate: LowRate
                    };
                });

                this.updatedArray = this.rankData(this.updatedArray);

                // 使用 reduce 方法进行总和计算   
                const total = this.updatedArray.reduce((acc, curr) => {
                    acc.lowBox += Number(curr.lowBox) || 0;
                    acc.nowBox += Number(curr.nowBox) || 0;
                    acc.FruBox += Number(curr.FruBox) || 0;
                    acc.yzzBox += Number(curr.yzzBox) || 0;
                    acc.yznlBox += Number(curr.yznlBox) || 0;
                    // 确保累加器不是 NaN  
                    if (isNaN(acc.mouthDiff)) {
                        acc.mouthDiff = 0;
                    }
                    acc.mouthDiff += Number(curr.mouthDiff) || 0;
                    // 确保累加器不是 NaN  
                    if (isNaN(acc.oldbox)) {
                        acc.oldbox = 0;
                    }
                    acc.oldbox += Number(curr.oldbox) || 0;

                    acc.remainingDays = curr.remainingDays
                    return acc;
                }, { orgname: '合计', lowBox: 0, nowBox: 0, FruBox: 0, yzzBox: 0, yznlBox: 0 }); // 初始化累加器  

                total.remainingbox = total.remainingDays !== 0 ? total.mouthDiff.toFixed(2) / total.remainingDays.toFixed(2) : 0;
                total.LowRate = (((total.lowBox-total.oldbox)/total.oldbox)*100).toFixed(2)+'%';
                // 将合计对象添加到原数组的最后  
                this.updatedArray.push(total);

                console.log(this.updatedArray, 'this.updatedArra结果');
                this.dataListLoading = false

            })
        },

        //当月的数据
        getDataList() {
            this.dataListLoading = true
            api.companygoalApi(this.dataForm).then(res => {
                this.dataList = res
                this.dataList = this.dataList.map(product => {
                    // 创建一个新对象，复制原有的字段  
                    const newProduct = { ...product };

                    // 根据 product_class_pname 的值，进行 box 字段名称的改变和赋值  
                    switch (product.product_class_pname) {
                        case "低温系列":
                            newProduct.lowBox = product.box;  // 把原 box 值赋给 newProduct.lowBox  
                            delete newProduct.box;             // 删除原来的 box 字段  
                            break;
                        case "常温系列":
                            newProduct.nowBox = product.box;   // 把原 box 值赋给 newProduct.nowBox  
                            delete newProduct.box;              // 删除原来的 box 字段  
                            break;
                        case "椰子牛乳系列":
                            newProduct.yznlBox = product.box;  // 把原 box 值赋给 newProduct.yznlBox  
                            delete newProduct.box;              // 删除原来的 box 字段  
                            break;
                        case "椰子汁系列":
                            newProduct.yzzBox = product.box;    // 把原 box 值赋给 newProduct.yzzBox  
                            delete newProduct.box;               // 删除原来的 box 字段  
                            break;
                        case "果汁系列":
                            newProduct.FruBox = product.box;    // 把原 box 值赋给 newProduct.FruBox  
                            delete newProduct.box;               // 删除原来的 box 字段  
                            break;
                        default:
                            break; // 处理没有匹配的情况  
                    }
                    return newProduct; // 返回新的 product 对象  
                });
                this.mergedData = this.mergeObjects(this.dataList);

                this.getPreDataList()

                console.log(this.mergedData, 'mergedData')
            })

        },
        //变老新品字段
        convertBoxFields(dataList) {
            dataList.forEach(item => {
                // 检查 attribute 字段并进行相应修改  
                if (typeof item.attribute === 'string') {
                    if (item.attribute.includes('老品')) {
                        item.oldbox = Number(item.box); // 将 box 转换为数字并赋值给 oldbox  
                        delete item.box; // 删除原来的 box 字段  
                    } else if (item.attribute.includes('新品')) {
                        item.newbox = Number(item.box); // 将 box 转换为数字并赋值给 newbox  
                        delete item.box; // 删除原来的 box 字段  
                    }
                }
            });
        },

        //上一年当月老品数据
        getPreDataList() {
            api.companygoalApi(this.dataForm1).then(res => {
                this.dataPreList = res
                this.convertBoxFields(this.dataPreList)
                this.dataPreList = this.dataPreList.filter(item => item.attribute === '老品');

                this.resultPre = Object.values(this.dataPreList.reduce((accumulator, current) => {
                    const key = `${current.ocustomerClass_name}-${current.nAME}`;

                    if (!accumulator[key]) {
                        accumulator[key] = {
                            ocustomerClass_name: current.ocustomerClass_name,
                            nAME: current.nAME,
                            oldbox: 0
                        };
                    }

                    accumulator[key].oldbox += current.oldbox;
                    return accumulator;
                }, {}));

                console.log(this.resultPre, '上年同月');
                this.getTaskList()
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

            console.log(this.dataForm.p_vouchdatestart, this.dataForm.p_vouchdateend)

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
            const day = selectedDate.getDate();
            this.dayLabel = `${day}`;
        },

        formatDate(date) {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0'); // 月份从0开始，所以加1   
            const day = String(date.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
        },
        updateLabel() {
            const { p_vouchdatestart, p_vouchdateend } = this.dataForm;
            const selectedDate = new Date(p_vouchdateend); // 创建日期对象  
            const year = selectedDate.getFullYear(); // 获取年份  
            const month = selectedDate.getMonth() + 1; // 获取月份（0-11，需要加 1）  
            const day = selectedDate.getDate(); // 获取日期 
            this.labelText = `${year}年全国${month}月 全品目标跟进汇总表`; // 如果没有选择日期，显示默认文本  

        },
        handleDateChange(newValue) {
            if (newValue) {
                const selectedDate = new Date(newValue);
                const month = String(selectedDate.getMonth() + 1).padStart(2, '0'); // 月份从0开始，所以加1   
                // const month = selectedDate.getMonth() + 1; // 获取月份（0-11，需要加 1）
                const year = selectedDate.getFullYear(); // 获取年份 
                const day = selectedDate.getDate(); // 获取日期  
                this.dynamicLabel = `${month}`
                this.dayLabel = `${day}`;
                // 创建该月份的第一天  
                this.firstDayOfMonth = `${year}-${month}-01`
                this.dataForm.p_vouchdatestart = this.firstDayOfMonth

                console.log(this.dataForm.p_vouchdatestart)

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
        exportData() {
            this.$confirm('是否导出表格数据到Excel?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                exportExcel(this.updatedArray, this.dataForm.p_vouchdateend, '全国目标跟进表.xlsx')
            })
        },
    }
};
</script>

<style scoped lang="scss">
::v-deep .table .el-table__cell {
    padding: 2px !important;

}

;

::v-deep th.el-table__cell>.cell {
    padding: 0px !important;
}

;

::v-deep .el-table__header-wrapper {
    font-size: 13px;
    background: #f5f7fa;
}

::v-deep .el-table th {
    background: #f5f7fa;
}
</style>