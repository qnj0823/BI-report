<template>
    <div class='statis'>
        <el-form :inline="true" style="width: 80%; margin: 0 auto;">
            <el-form-item>
                <el-date-picker v-model="dataForm.p_vouchdatestart" value-format="yyyy-MM-dd" type="date"
                    placeholder="开始日期" clearable style="width: 100%"></el-date-picker>
            </el-form-item>
            <el-form-item>
                <el-date-picker v-model="dataForm.p_vouchdateend" value-format="yyyy-MM-dd" type="date"
                    placeholder="结束日期" clearable style="width: 100%"></el-date-picker>
            </el-form-item>
            <el-form-item>
                <el-input v-model="bullay" placeholder="模糊查询" clearable @keyup.enter.native="searchEnterFun()"
                    ref="searchInput"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button class="filter-item" size="mini" type="success" icon="el-icon-search"
                    @click="getdataList">查询</el-button>
            </el-form-item>
            <el-button size="mini" class="filter-item" type="warning" icon="el-icon-download"
                @click="exportData">导出</el-button>
        </el-form>
        <el-table class="table" ref="table" border :data="currentData" v-loading="dataListLoading"
            style="width: 80%; margin: 0 auto; margin-bottom: 50px;"
           >
            <el-table-column :show-overflow-tooltip="true" align="center" prop="levelName1" label="战区" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="levelName2" label="销售区域" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="levelName3" label="分公司/办事处" />
            <el-table-column :show-overflow-tooltip="true" width="250" align="center" prop="cust_name" label="客户营业执照" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="cu_name" label="客户站点" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="total_count" label="订单总数" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="mqty" label="入库数" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="rate" label="入库百分比" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="diff" label="入库差异" />
        </el-table>
        <el-pagination style="width: 80%; margin: 0 auto; " @size-change="sizeChangeHandle" ref="pagination"
            @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[20, 40, 60, 80, 100, 1000]"
            :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="dataList.length">
        </el-pagination>
    </div>
</template>

<script>
import * as api from '@/api/factory/PutStorage.js'
import {
    exportExcel
} from './NowareHouseExpor.js'
export default {
    name: 'no-page',
    data() {
        return {
            msg: 'no-page',
            dataListLoading: false,
            dataList: [],
            dataForm: {
                p_vouchdateend: '',
                p_vouchdatestart: '',
                p_orgname: ''
            },
            bullay: '',
            currentData: [],
            currentPage: 1,
            pageSize: 20,
            totalItems: 0,
        };
    },
    created() {
        this.calculateDates();
    },
    mounted() {
        console.log(this.endOfToday)
        this.getdataList()
    },
    methods: {
        objectSpanMethod({
            row,
            column,
            rowIndex,
            columnIndex
        }, items) {
            if (columnIndex === 6) { // 处理第一列
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
        },
        exportData() {
            this.$confirm('是否导出表格数据到Excel?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {

                exportExcel(this.dataList, '未入库前十表.xlsx')

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
            this.dataForm.p_vouchdatestart = this.endOfToday
            this.dataForm.p_vouchdateend = this.endOfToday
        },
        formatDate(date) {
            // 创建一个新的Date对象，以避免修改原始日期  
            const newDate = new Date(date);
            // 减去5天  
            newDate.setDate(newDate.getDate() - 5);
           
            const year = newDate.getFullYear();
            const month = String(newDate.getMonth() + 1).padStart(2, '0'); // 月份从0开始，所以加1   
            const day = String(newDate.getDate()).padStart(2, '0');

            return `${year}-${month}-${day}`;
        },
        getdataList() {
            this.dataListLoading = true
            api.PtsNomalinout(this.dataForm).then(res => {
                this.dataList = res
                this.dataList = this.dataList.filter(item => item.cu_name !== "正式测试");
                this.dataList.forEach(item => {
                    const levels = item.level_name.split(' -> ');
                    item.levelName1 = levels[0] || "";
                    // 去掉 levelName2 中的数字  
                    item.levelName2 = levels[1] ? levels[1].replace(/\d+/g, '').trim() : "";
                    item.levelName3 = levels[2] || "";

                });
                // 计算 rate 字段并添加到每个对象中  
                this.dataList.forEach(item => {
                    item.mqty = parseFloat(item.mqty).toFixed(0);
                    item.total_count = parseFloat(item.total_count).toFixed(0);
                    // 检查 total_count 是否为零，以避免除以零的错误  
                    item.rate = item.total_count > 0
                        ? ((item.mqty / item.total_count) * 100).toFixed(2) + '%' // 保留两位小数后加百分号  
                        : '0.00%'; // 如果 total_count 为 0， rate 为 0%  
                });
                // 使用 map 方法计算 diff  
                this.dataList = this.dataList.map(item => {
                    return {
                        ...item, // 保留原始对象的其他字段  
                        diff: item.total_count - item.mqty // 计算差值并赋值给 diff  
                    };
                });

                // 按 diff 从高到低排序并取前十个  
                this.dataList = this.dataList
                    .sort((a, b) => b.diff - a.diff) // 倒序排序 
                // 过滤数据  
                this.dataList = this.dataList.filter(item =>
                    item.levelName1.toLowerCase().includes(this.bullay) ||
                    item.levelName2.toLowerCase().includes(this.bullay) ||
                    item.levelName3.toLowerCase().includes(this.bullay) ||
                    item.cust_name.toLowerCase().includes(this.bullay) ||
                    item.cu_name.toLowerCase().includes(this.bullay)
                );


                console.log(this.dataList)
                this.dataListLoading = false
                this.currentData = {
                    ...this.dataList
                };
                this.sizeChangeHandle(this.pageSize);
            })
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