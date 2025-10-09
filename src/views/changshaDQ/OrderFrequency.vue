<template>
    <div class='Frequency'>
        <el-form :inline="true" style="width: 55%; margin: 0 auto;">
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
                    @click="getdataList">查询</el-button>
            </el-form-item>
            <el-button size="mini" class="filter-item" type="warning" icon="el-icon-download"
                @click="exportData">导出</el-button>
        </el-form>
        <el-table class="table" ref="table" border :data="currentData" v-loading="dataListLoading"
            style="width: 55%; margin: 0 auto; margin-bottom: 50px;">
            <el-table-column :show-overflow-tooltip="true" align="center" prop="iParentName" label="销售区域" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="ocustomerClass_name" label="分公司/办事处" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="cSiteName" label="站点" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="count" label="频次" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="box" label="数量" />
        </el-table>
        <el-pagination style="width: 90%; margin: 0 auto; " @size-change="sizeChangeHandle" ref="pagination"
            @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[20, 40, 60, 80, 100, 1000]"
            :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="dataList.length">
        </el-pagination>
    </div>
</template>

<script>
import * as api from '@/api/DQAPI/dqallApi.js'
import {
    exportExcel
} from './OrderFrequencyExpro.js'
export default {
    name: 'Frequency-page',
    data() {
        return {
            dataListLoading: false,
            dataList: [],
            currentData: [],
            currentPage: 1,
            pageSize: 20,
            totalItems: 0,
            dataForm: {
                p_vouchdateend: '',
                p_vouchdatestart: '',
                p_orgname: ''
            },
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

        this.getdataList()
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

                exportExcel(this.dataList, '订单频次数量表.xlsx')

            })
        },
        getdataList() {
            this.dataForm.p_orgname = this.rujobs//动态省区
            this.dataListLoading = true
            api.fgsorderrateApi(this.dataForm).then(res => {
                this.dataList = res
                this.dataList.forEach(item => {
                    if (item.iParentName) { // 检查 iParentName 是否存在且非空  
                        item.iParentName = item.iParentName.replace(/\d+/g, '').trim(); // 替换数字并去除空格  
                        item.box = !isNaN(parseFloat(item.box)) ? parseFloat(item.box).toFixed(0) : '0';
                    }
                });
                this.dataList.sort((a, b) => a.count - b.count);
                this.currentData = {
                    ...this.dataList
                };
                this.sizeChangeHandle(this.pageSize);
                console.log(this.dataList)
                this.dataListLoading = false
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