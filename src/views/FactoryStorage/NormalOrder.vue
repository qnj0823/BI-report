<template>
    <div class='normal'>
        <el-form :inline="true" style="width: 90%; margin: 0 auto;">
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
            style="width: 90%; margin: 0 auto; margin-bottom: 50px;">
            <el-table-column :show-overflow-tooltip="true" width="120" align="center" prop="levelName1" label="战区" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="levelName2" label="销售区域" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="levelName3" label="分公司/办事处" />
            <el-table-column :show-overflow-tooltip="true" align="center" width="250" prop="cName" label="客户营业执照" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="cSiteName" label="客户站点" />
            <el-table-column :show-overflow-tooltip="true" align="left" width="320" prop="cProductName" label="产品" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="box" label="数量" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="vouchdate" label="订单日期" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="dbizdate" label="出库日期" />
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
} from './NormalOrderExpor.js'
export default {
    name: 'normal-page',
    data() {
        return {
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
        this.getdataList()
    },
    methods: {
        exportData() {
            this.$confirm('是否导出表格数据到Excel?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {

                exportExcel(this.dataList, '常温订单.xlsx')

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
            api.PtsNomalone(this.dataForm).then(res => {
                this.dataList = res
                console.log(this.dataList)
                this.dataList.forEach(item => {
                    if (item.level_name) {
                        const levels = item.level_name.split(' -> ');
                        item.levelName1 = levels[0] || "";
                        // 去掉 levelName2 中的数字  
                        item.levelName2 = levels[1] ? levels[1].replace(/\d+/g, '').trim() : "";
                        item.levelName3 = levels[2] || "";
                        item.box = parseFloat(item.box).toFixed(0);
                    } else {
                        console.warn('item.level_name is undefined', item);
                        item.levelName1 = "";
                        item.levelName2 = "";
                        item.levelName3 = "";
                    }


                });
                // 分开已出库和未出库的对象  
                const inStock = this.dataList.filter(item => item.dbizdate !== '未出库');
                const outOfStock = this.dataList.filter(item => item.dbizdate === '未出库');

                // 对已出库对象按 dbizdate 排序  
                inStock.sort((a, b) => {
                    const dateA = new Date(a.dbizdate);
                    const dateB = new Date(b.dbizdate);
                    return dateA - dateB; // 按 dbizdate 排序  
                });

                // 对未出库对象按 vouchdate 排序  
                outOfStock.sort((a, b) => {
                    const vouchDateA = new Date(a.vouchdate);
                    const vouchDateB = new Date(b.vouchdate);
                    return vouchDateA - vouchDateB; // 按 vouchdate 排序  
                });

                // 合并已出库和未出库的对象  
                this.dataList = [...inStock, ...outOfStock];
                // 过滤数据  
                this.dataList = this.dataList.filter(item =>
                    item.levelName1.toLowerCase().includes(this.bullay) ||
                    item.levelName2.toLowerCase().includes(this.bullay) ||
                    item.levelName3.toLowerCase().includes(this.bullay) ||
                    item.cName.toLowerCase().includes(this.bullay) ||
                    item.cSiteName.toLowerCase().includes(this.bullay) ||
                    item.cProductName.toLowerCase().includes(this.bullay)
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