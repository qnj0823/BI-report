<template>
    <div class='wrong'>
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
            style="width: 80%; margin: 0 auto; margin-bottom: 50px;">
            <el-table-column :show-overflow-tooltip="true" align="center" prop="levelName1" label="战区" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="levelName2" label="销售区域/省区" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="levelName3" label="分公司/办事处" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="cu_name" label="站点名称" />
            <el-table-column :show-overflow-tooltip="true" align="center" width="250" prop="cust_name" label="客户名称" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="mqty" label="错误码入库数量" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="ship_date" label="入库时间" />
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
} from './WrongStorageExpor.js'
export default {
    name: 'wrong-page',
    data() {
        return {
            msg: 'wrong-page',
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
            dataListLoading: false,
            dataList: [],
        };
    },
    created() {
        this.calculateDates();
    },
    mounted() {
        this.getdataList()
    },
    methods: {
        exportData() {
            this.$confirm('是否导出表格数据到Excel?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {

                exportExcel(this.dataList, '错误码入库表.xlsx')

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
        },
        formatDate(date) {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0'); // 月份从0开始，所以加1 
            const day = String(date.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
        },
        getdataList() {
            this.dataListLoading = true
            api.Ptserrcufgisone(this.dataForm).then(res => {
                this.dataList = res
                this.dataList.forEach(item => {
                    const levels = item.level_name.split(' -> ');
                    item.levelName1 = levels[0] || "";
                    // 去掉 levelName2 中的数字  
                    item.levelName2 = levels[1] ? levels[1].replace(/\d+/g, '').trim() : "";
                    item.levelName3 = levels[2] || "";
                    item.mqty = parseFloat(item.mqty).toFixed(0);
                });
                // // 定义 levelName1 的自定义顺序  
                const levelOrder = [
                    '营销一部',
                    '营销二部',
                    '营销三部',
                    '营销四部',
                    '营销五部',
                    '营销六部',
                    '营销七部',
                    '营销八部',
                    '大客户部'
                ];

                // 创建一个 mapping 以便于比较  
                const orderMap = {};
                levelOrder.forEach((level, index) => {
                    orderMap[level] = index;
                });

                // 排序  
                this.dataList.sort((a, b) => {
                    // 首先按 levelName1 的自定义顺序排序  
                    const levelComparison = orderMap[a.levelName1] - orderMap[b.levelName1];
                    if (levelComparison !== 0) {
                        return levelComparison;
                    }

                    // 如果 levelName1 相同，按 levelName2 排序  
                    if (a.levelName2 < b.levelName2) {
                        return -1;
                    }
                    if (a.levelName2 > b.levelName2) {
                        return 1;
                    }

                    // 如果 levelName1 和 levelName2 都相同，再按 levelName3 字段排序  
                    if (a.levelName3 < b.levelName3) {
                        return -1;
                    }
                    if (a.levelName3 > b.levelName3) {
                        return 1;
                    }

                    return 0; // 完全相同  
                });

                // this.dataList = this.dataList.sort((a, b) => new Date(a.ship_date) - new Date(b.ship_date)); 

                // 若在 Vue 中，确保视图更新  
                this.dataList = [...this.dataList]; // 触发视图更新 
                // 过滤数据  
                this.dataList = this.dataList.filter(item =>
                    item.levelName1.toLowerCase().includes(this.bullay) ||
                    item.levelName2.toLowerCase().includes(this.bullay) ||
                    item.levelName3.toLowerCase().includes(this.bullay) ||
                    item.cust_name.toLowerCase().includes(this.bullay) ||
                    item.cu_name.toLowerCase().includes(this.bullay)
                );
                this.dataListLoading = false
                this.currentData = {
                    ...this.dataList
                };
                this.sizeChangeHandle(this.pageSize);
                console.log(this.dataList)

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
    },

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