<template>
    <div class='salesdetails'>
        <el-form :inline="true" style="width: 70%; margin: 0 auto;">
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
                    @click="getDataList">查询</el-button>
            </el-form-item>
            <el-button size="mini" class="filter-item" type="warning" icon="el-icon-download"
                @click="exportData">导出</el-button>
        </el-form>
        <el-table class="table" ref="table" border v-loading="dataListLoading" :data="currentData"
            style="width: 70%; margin: 0 auto; margin-bottom: 50px;">
            <el-table-column :show-overflow-tooltip="true" align="center" prop="sqname" label="销售区域/省区" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="ocustomerclassName" label="分公司办事处" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="cSiteName" label="站点" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="NorSeries" label="常温系列" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="FruitSeries" label="果汁系列" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="YzzSeries" label="椰子汁系列" />
            <el-table-column prop="nonum" align="center" label="小计" />
        </el-table>
        <el-pagination style="width: 80%; margin: 0 auto; " @size-change="sizeChangeHandle" ref="pagination"
            @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[20, 40, 60, 80, 100, 1000]"
            :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="mergedDataList.length">
        </el-pagination>
    </div>
</template>

<script>
import * as api from '@/api/frame/customer.js'
import {
    exportExcel
} from './nomalguozhiExpro.js'
export default {
    name: 'salesdetails-page',
    data() {
        return {
            dataListLoading: false,
            dataList: [],
            result: [],
            chartList: [],
            dataForm: {
                p_vouchdatestart: '',
                p_vouchdateend: '',
                p_orgname: ''
            },
            dataListLoading: false,
            dataList: [],
            currentData: [],
            currentPage: 1,
            pageSize: 20,
            totalItems: 0,
            startOfMonth: '',
            endOfToday: '',
            mergedDataList: [],
            rudepts: '',
            rujobs: ''
        };
    },
    created() {
        this.calculateDates();
    },
    mounted() {
        this.rudepts = sessionStorage.getItem('Busdept');
        this.rujobs = sessionStorage.getItem('Busjobs');
        if (this.rujobs == '全部') {
            this.rujobs = sessionStorage.getItem('sf');
            this.rudepts = sessionStorage.getItem('yxb');
        }

        this.getDataList()
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
            this.dataForm.p_vouchdatestart = this.startOfMonth
            this.dataForm.p_vouchdateend = this.endOfToday
        },
        formatDate(date) {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0'); // 月份从0开始，所以加1 
            const day = String(date.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
        },

        exportData() {
            this.$confirm('是否导出表格数据到Excel?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {

                exportExcel(this.mergedDataList, '分子公司产品系列销售表-站点.xlsx')

            })
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
        getDataList() {
            this.dataListLoading = true
            api.productxisite(this.dataForm).then(res => {
                console.log(res, 'res')
                this.dataList = res
                this.dataList = this.dataList.filter(item => item.sqname === this.rujobs);
                console.log(this.dataList)
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
                this.dataListLoading = false
                this.dataList = this.sumBoxes(this.dataList);

                console.log(this.dataList, 11122)
                const currData = this.dataList.map(item => {
                    // 确定新的属性名 
                    let newFieldName;
                    switch (item.productClassPname) {
                        case "常温系列":
                            newFieldName = "NorSeries";
                            break;
                        case "果汁系列":
                            newFieldName = "FruitSeries";
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
                let totalNorSeries = 0;
                let totalFruitSeries = 0;
                let totalYzzSeries = 0;

                // 遍历数据汇总
                this.mergedDataList.forEach(item => {
                    totalNorSeries += item.NorSeries || 0; // 确保值存在
                    totalFruitSeries += item.FruitSeries || 0;
                    totalYzzSeries += item.YzzSeries || 0;

                });

                // 将总和放入合计对象中
                const totalObject = this.mergedDataList.find(item => item.cSiteName == "合计");
                if (totalObject) {
                    totalObject.NorSeries = totalNorSeries;
                    totalObject.FruitSeries = totalFruitSeries;
                    totalObject.YzzSeries = totalYzzSeries;
                }

                // 按照 ocustomerClass_name、sqname 和 cSiteName 排序  
                this.mergedDataList.sort((a, b) => {
                    // 处理比较时确保处理了空值情况  
                    const classNameA = a.ocustomerClass_name || ''; // 默认值为空字符串  
                    const classNameB = b.ocustomerClass_name || ''; // 默认值为空字符串  
                    const nameA = a.sqname || ''; // 默认值为空字符串  
                    const nameB = b.sqname || ''; // 默认值为空字符串  

                    // 如果 cSiteName 是 "合计"，则确保其排到最后  
                    if (a.cSiteName === "合计") return 1;
                    if (b.cSiteName === "合计") return -1;

                    // 首先比较 ocustomerClass_name  
                    const classComparison = classNameA.localeCompare(classNameB);

                    // 如果 ocustomerClass_name 相同，则比较 sqname  
                    if (classComparison === 0) {
                        return nameA.localeCompare(nameB); // 次级排序  
                    }

                    return classComparison; // 返回 ocustomerClass_name 的比较结果  
                });
                // 遍历 mergedDataList，计算 nonum 字段  
                this.mergedDataList = this.mergedDataList.map(item => {
                    // 转换值为数字，并处理可能的 undefined 值  
                    const norSeries = Number(item.NorSeries) || 0;
                    const fruitSeries = Number(item.FruitSeries) || 0;
                    const yzzSeries = Number(item.YzzSeries) || 0;

                    // 计算 total  
                    const nonum = norSeries + fruitSeries + yzzSeries;

                    // 返回新对象，包含原有字段和新的 nonum 字段  
                    return {
                        ...item,
                        nonum // 将计算出的 total 赋值给 nonum 字段  
                    };
                });

                console.log(this.mergedDataList, 99999);
                this.currentData = {
                    ...this.mergedDataList
                };
                this.dataListLoading = false;
                this.sizeChangeHandle(this.pageSize);

            })
        },
        // 每页数
        sizeChangeHandle(val) {
            this.pageSize = val;
            this.currentPage = 1;
            this.currentData = this.mergedDataList.slice((this.currentPage - 1) * this.pageSize, this.currentPage * this
                .pageSize);
        },
        // 当前页
        handleCurrentChange(val) {
            console.log(val)
            this.currentPage = val;
            this.currentData = this.mergedDataList.slice((val - 1) * this.pageSize, val * this.pageSize);
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
    font-size: 15px;
    background: #f5f7fa;
}


::v-deep .el-table th {
    background: #f5f7fa;
}
</style>