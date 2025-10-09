<template>
    <div class='DD'>
        <el-form :inline="true" style="width: 100%; margin: 0 auto;">
            <el-form-item>
                <el-date-picker v-model="dataForm.p_vouchdatestart" value-format="yyyy-MM-dd" type="date"
                    placeholder="开始日期" clearable style="width: 100%"></el-date-picker>
            </el-form-item>
            <el-form-item>
                <el-date-picker v-model="dataForm.p_vouchdateend" value-format="yyyy-MM-dd" type="date"
                    placeholder="结束日期" clearable style="width: 100%"></el-date-picker>
            </el-form-item>
            <el-form-item>
                <el-button class="filter-item" size="mini" type="success" icon="el-icon-search"
                    @click="getPreList">查询</el-button>
            </el-form-item>
            <el-button size="mini" class="filter-item" type="warning" icon="el-icon-download"
                @click="exportData">导出</el-button>
        </el-form>
        <el-table class="table" ref="table" border :data="mergedDataList" v-loading="dataListLoading"
            style="width: 95%; margin: 0 auto; margin-bottom: 50px;">
            <el-table-column :show-overflow-tooltip="true" align="center" prop="orgname" label="战区" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="ocustomerclassName" label="单位体" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="cSiteName" label="客户站点" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="mb" label="本月目标" />
            <el-table-column align="center" label="今日报单（自然件）">
                <el-table-column :show-overflow-tooltip="true" align="center" prop="lowSeries" label="低温系列" />
                <el-table-column :show-overflow-tooltip="true" align="center" prop="NorSeries" label="常温系列" />
                <el-table-column :show-overflow-tooltip="true" align="center" prop="YzSeries" label="椰子牛乳系列" />
                <el-table-column align="center" width="100" prop="YzzSeries" label="椰子汁系列" />
                <el-table-column align="center" width="100" prop="FruitSeries" label="果汁系列" />
                <el-table-column :show-overflow-tooltip="true" align="center" prop="sum" label="本单合计完成" />
            </el-table-column>
            <el-table-column prop="bdrw" align="center" label="本单任务" />
            <el-table-column prop="bdce" align="center" label="本单差额" />
            <el-table-column prop="ljwc" align="center" label="本月累计完成" />
            <el-table-column prop="byce" align="center" label="本月差额" />
            <el-table-column prop="bywcl" align="center" label="本月完成率" />
        </el-table>
    </div>
</template>

<script>
import * as api from '@/api/frame/customer.js'
import {
    exportExcel
} from './DayDeclaraExpro.js'
export default {
    name: 'DD-page',
    data() {
        return {
            msg: 'DD-page',
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
            dataList: [],
            dataPre:[],
            mergedDataList: [],
            mergedPreList:[],
            dataListLoading: false

        };
    },
    created() {
        this.calculateDates();
    },
    mounted() {
        this.getPreList()
    },
    methods: {
        //获取时间
        calculateDates() {
            const today = new Date();

            // 获取当前月份的月初时间 
            const startOfMonthDate = new Date(today.getFullYear(), today.getMonth(), 1);
            this.startOfMonth = this.formatDate(startOfMonthDate);

            // 获取截至今天的时间 
            this.endOfToday = this.formatDate(today);
            this.dataForm.p_vouchdatestart = this.endOfToday
            this.dataForm.p_vouchdateend = this.endOfToday
            this.dataForm1.p_vouchdatestart = this.startOfMonth
            this.dataForm1.p_vouchdateend = this.endOfToday
            console.log(this.dataForm1.p_vouchdatestart, this.dataForm1.p_vouchdateend)
        },
        formatDate(date) {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0'); // 月份从0开始，所以加1 
            const day = String(date.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
        },
        sumBoxes(array) {
            //计算 box 字段的总和 
            const sum = array.reduce((accumulator, current) => accumulator + current.box, 0);
            // 创建一个新对象并存储总和
            const result = { box: sum, cSiteName: '合计' };
            // 将新对象推入数组 
            array.push(result);
            return array;
        },
        //本月
        getPreList() {
            this.dataListLoading=true
            api.productxisiteteam(this.dataForm1).then(res => {
                this.dataPre = res
                const sumMap = new Map();
                // 遍历原数组，将 box 值相加  
                this.dataPre.forEach(item => {
                    if (sumMap.has(item.cSiteName)) {
                        sumMap.set(item.cSiteName, sumMap.get(item.cSiteName) + item.box);
                    } else {
                        sumMap.set(item.cSiteName, item.box);
                    }
                });
                // 创建修改后的数组  
                this.dataPre = this.dataPre.map(item => ({
                    ...item, // 保留原对象的字段  
                    sum: sumMap.get(item.cSiteName) // 添加新字段 sum  
                }));
                this.dataPre = this.sumBoxes(this.dataPre);
                const currData = this.dataPre.map(item => {
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
                        cSiteName: item.cSiteName,
                        ocustomerclassName: item.ocustomerclassName,
                        productClassPname: item.productClassPname,
                        sum: item.sum
                    };
                });

                this.mergedPreList = currData.reduce((acc, item) => {
                    // 查找已存在的对象
                    let existingOrg = acc.find(org => org.cSiteName === item.cSiteName);

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
                    // 检查 orgname 是否为 "合计"  
                    if (item.cSiteName === "合计") {
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

                // 将总和放入合计对象中
                const totalObject = this.mergedPreList.find(item => item.cSiteName == "合计");
                if (totalObject) {
                    totalObject.lowSeries = totalLowSeries;
                    totalObject.NorSeries = totalNorSeries;
                    totalObject.FruitSeries = totalFruitSeries;
                    totalObject.YzSeries = totalYzSeries;
                    totalObject.YzzSeries = totalYzzSeries;
                }
                console.log(this.mergedPreList, 'mergedPreList')
                this.getDataList()
            })

        },
        //本日
        getDataList() {
            api.productxisiteteam(this.dataForm).then(res => {
                this.dataList = res
                const sumMap = new Map();
                // 遍历原数组，将 box 值相加  
                this.dataList.forEach(item => {
                    if (sumMap.has(item.cSiteName)) {
                        sumMap.set(item.cSiteName, sumMap.get(item.cSiteName) + item.box);
                    } else {
                        sumMap.set(item.cSiteName, item.box);
                    }
                });
                // 创建修改后的数组  
                this.dataList = this.dataList.map(item => ({
                    ...item, // 保留原对象的字段  
                    sum: sumMap.get(item.cSiteName) // 添加新字段 sum  
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
                        cSiteName: item.cSiteName,
                        ocustomerclassName: item.ocustomerclassName,
                        productClassPname: item.productClassPname,
                        sum: item.sum
                    };
                });

                this.mergedDataList = currData.reduce((acc, item) => {
                    // 查找已存在的对象
                    let existingOrg = acc.find(org => org.cSiteName === item.cSiteName);

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
                    if (item.cSiteName === "合计") {
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

                // 将总和放入合计对象中
                const totalObject = this.mergedDataList.find(item => item.cSiteName == "合计");
                if (totalObject) {
                    totalObject.lowSeries = totalLowSeries;
                    totalObject.NorSeries = totalNorSeries;
                    totalObject.FruitSeries = totalFruitSeries;
                    totalObject.YzSeries = totalYzSeries;
                    totalObject.YzzSeries = totalYzzSeries;
                }
                this.dataListLoading=false
                console.log(this.mergedDataList, 'mergedDataList')
            })
        },
        exportData() {
            this.$confirm('是否导出表格数据到Excel?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                exportExcel(this.dataList, '日销量跟进表/单位体.xlsx')

            })
        }
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
    font-size: 14px;
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