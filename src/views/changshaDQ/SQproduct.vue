<template>
    <div class='salesdetails'>
        <el-form :inline="true" style="width: 70%; margin: 10px auto;">
            <el-button size="mini" class="filter-item" type="warning" icon="el-icon-download"
                @click="exportData">导出</el-button>
        </el-form>
        <el-table class="table" ref="table" border v-loading="dataListLoading" :data="currentData"
            style="width: 70%; margin: 0 auto; margin-bottom: 50px;">
            <el-table-column :show-overflow-tooltip="true" align="center" prop="sqname" label="销售区域" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="ocustomerclassName" label="分公司办事处" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="cSiteName" label="站点" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="lowSeries" label="低温系列" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="NorSeries" label="常温系列" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="FruitSeries" label="果汁系列" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="YzSeries" label="椰子牛乳系列" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="YzzSeries" label="椰子汁系列" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="QtSeries" label="其它" />
            <el-table-column prop="sum" align="center" label="小计" />
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
} from './SQproductExpro.js'
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
    mounted() {
        this.rujobs = this.$route.query.param1;
        this.dataForm.p_vouchdatestart = this.$route.query.startdate;
        this.dataForm.p_vouchdateend = this.$route.query.enddata;
        this.getDataList()
    },
    methods: {
        sumBoxes(array) {
            //计算 box 字段的总和 
            const sum = array.reduce((accumulator, current) => accumulator + current.box, 0);
            // 创建一个新对象并存储总和
            const result = { box: sum, cSiteName: '合计' };
            // 将新对象推入数组 
            array.push(result);
            return array;
        },
        objectSpanMethod({
            row,
            column,
            rowIndex,
            columnIndex
        }, items) {
            if (columnIndex === 0) { // 处理第一列
                const currentValue = row[column.property];
                const preRow = items[rowIndex - 1];
                const preValue = preRow ? preRow[column.property] : null;

                if (currentValue === preValue) {
                    return {
                        rowspan: 0,
                        colspan: 0
                    }; // 隐藏当前单元格
                } else {
                    let rowspan = 1;
                    for (let i = rowIndex + 1; i < items.length; i++) {
                        const nextRow = items[i];
                        if (nextRow[column.property] === currentValue) {
                            rowspan++;
                        } else {
                            break;
                        }
                    }
                    return {
                        rowspan,
                        colspan: 1
                    }; // 当前单元格跨越行
                }
            }
            if (columnIndex === 3) { // 处理第一列
                const currentValue = row[column.property];
                const preRow = items[rowIndex - 1];
                const preValue = preRow ? preRow[column.property] : null;

                // 检查当前值是否为空
                if (!currentValue) {
                    return {
                        rowspan: 1, // 保留当前单元格
                        colspan: 1
                    }; // 不合并，但保留单元格
                }

                if (currentValue === preValue) {
                    return {
                        rowspan: 0,
                        colspan: 0
                    }; // 隐藏当前单元格
                } else {
                    let rowspan = 1;
                    for (let i = rowIndex + 1; i < items.length; i++) {
                        const nextRow = items[i];
                        if (nextRow[column.property] === currentValue) {
                            rowspan++;
                        } else {
                            break;
                        }
                    }
                    return {
                        rowspan,
                        colspan: 1
                    }; // 当前单元格跨越行
                }
            }
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

        getDataList() {
            this.dataListLoading = true
            api.productxisite(this.dataForm).then(res => {
                console.log(res, 'res')
                this.dataList = res
                this.dataList = this.dataList.filter(item => item.sqname === this.rujobs);
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
                        case "其它":
                            newFieldName = "QtSeries";
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
                let totalQtSeries = 0;
                let totalYzzSeries = 0;

                // 遍历数据汇总
                this.mergedDataList.forEach(item => {
                    totalLowSeries += item.lowSeries || 0;
                    totalNorSeries += item.NorSeries || 0; // 确保值存在
                    totalFruitSeries += item.FruitSeries || 0;
                    totalYzSeries += item.YzSeries || 0;
                    totalYzzSeries += item.YzzSeries || 0;
                    totalQtSeries += item.QtSeries || 0;

                });

                // 将总和放入合计对象中
                const totalObject = this.mergedDataList.find(item => item.cSiteName == "合计");
                if (totalObject) {
                    totalObject.lowSeries = totalLowSeries;
                    totalObject.NorSeries = totalNorSeries;
                    totalObject.FruitSeries = totalFruitSeries;
                    totalObject.YzSeries = totalYzSeries;
                    totalObject.YzzSeries = totalYzzSeries;
                    totalObject.QtSeries = totalQtSeries;

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