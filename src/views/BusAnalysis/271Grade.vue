<template>
    <div class='271'>
        <el-form :inline="true" style="width: 95%; margin: 0 auto;">
            <el-form-item>
                <el-date-picker v-model="dataForm.p_vouchdatestart" value-format="yyyy-MM-dd" type="date"
                    placeholder="开始日期" clearable style="width: 100%"></el-date-picker>
            </el-form-item>
            <el-form-item>
                <el-date-picker v-model="dataForm.p_vouchdateend" value-format="yyyy-MM-dd" type="date"
                    placeholder="结束日期" clearable style="width: 100%"></el-date-picker>
            </el-form-item>
            <el-form-item>
                <el-input v-model="bullay" placeholder="模糊搜索" clearable @keyup.enter.native="searchEnterFun()"
                    ref="searchInput"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button class="filter-item" size="mini" type="success" icon="el-icon-search"
                    @click="getdataList">查询</el-button>
            </el-form-item>
            <el-button size="mini" class="filter-item" type="warning" icon="el-icon-download"
                @click="exportData">导出</el-button>
        </el-form>
        <div style="display: flex; justify-content: center; align-items: center;">
            <label>{{ labelText }}</label>
        </div>
        <el-table class="table" ref="table" border :data="currentData"  max-height="600"   v-loading="dataListLoading"
            style="width: 95%;  margin: 0 auto; margin-bottom: 50px;">
            <el-table-column :show-overflow-tooltip="true" align="center" width="100" prop="dEF17_NAME" label="性质" />
            <el-table-column align="center" width="100" prop="ocustomerClass_name" label="分公司/办事处" />
            <el-table-column :show-overflow-tooltip="true" align="center" width="100" prop="cSiteName" label="客户站点" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="fzr" label="区域负责人" />
            <el-table-column :show-overflow-tooltip="true" align="center" width="100" prop="vcol2_name" label="销量区域" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="direct_sale" label="是否直营" />
            <el-table-column :show-overflow-tooltip="true" align="center" label="月销售量">
                <el-table-column :show-overflow-tooltip="true" align="center" prop="samebox" label="同期销量" />
                <el-table-column :show-overflow-tooltip="true" align="center" prop="curbox" label="本期销量" />
            </el-table-column>
            <el-table-column :show-overflow-tooltip="true" align="center" prop="onyearrate" label="同比增幅" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="salerate" label="销售占比" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="cust_sales" label="月销量(客户不含平台)" />
            <el-table-column :show-overflow-tooltip="true" align="center" label="利润贡献">
                <!-- <el-table-column :show-overflow-tooltip="true" align="center" prop="norigtaxmny" label="订单金额" />
                <el-table-column :show-overflow-tooltip="true" align="center" prop="cost_price" label="成本" /> -->
                <el-table-column :show-overflow-tooltip="true" align="center" prop="gross_profit" label="毛利润" />
                <el-table-column :show-overflow-tooltip="true" align="center" prop="one_gross_profit" label="单件毛利" />
            </el-table-column>
            <el-table-column :show-overflow-tooltip="true" align="center" label="费用">
                <el-table-column :show-overflow-tooltip="true" align="center" prop="fOrderRebateMoney" label="市场费用" />
                <el-table-column :show-overflow-tooltip="true" align="center" prop="one_fOrderRebateMoney"
                    label="单件费用" />
                <el-table-column :show-overflow-tooltip="true" align="center" prop="human" label="人力+运营" />
                <el-table-column :show-overflow-tooltip="true" align="center" prop="" label="单件费用" />
            </el-table-column>
            <el-table-column :show-overflow-tooltip="true" align="center" prop="sales_profit" label="销售利润" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="gdp" label="GDP" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="people" label="人口" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="" label="271评级" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="" label="备注说明" />
        </el-table>
        <el-pagination style="width: 90%; margin: 0 auto; " @size-change="sizeChangeHandle" ref="pagination"
            @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[20, 40, 60, 80, 100, 1000]"
            :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="dataList.length">
        </el-pagination>

    </div>
</template>

<script>
import * as api from '@/api/Business/analysis.js'
import * as oapi from '@/api/frame/customer.js'
import {
    exportExcel
} from './271GradeExpro.js'
export default {
    name: 'leix-page',
    data() {
        return {
            dataForm: {
                p_vouchdateend: '',
                p_vouchdatestart: '',
                p_orgname: ''
            },
            dataListLoading: false,
            dataList: [],
            siteList:[],
            currentData: [],
            currentPage: 1,
            pageSize: 20,
            totalItems: 0,
            labelText: '',
            bullay: ''
        };
    },
    created() {
        this.calculateDates();
    },
    mounted() {
        this.getdataList()
    },
    methods: {
        updateLabel() {
            const { p_vouchdatestart, p_vouchdateend } = this.dataForm;

            if (p_vouchdatestart && p_vouchdateend) {
                const startYear = p_vouchdatestart.split('-')[0].slice(-2); // 获取年份后两位  
                const startMonth = p_vouchdatestart.split('-')[1]; // 获取开始月份  
                const endMonth = p_vouchdateend.split('-')[1]; // 获取结束月份  
                if (startMonth == endMonth) {
                    this.labelText = `271客户分层分级管理`; // 更新标签文本  
                } else {
                    this.labelText = `271客户分层分级管理`; // 更新标签文本  
                }

            } else {
                this.labelText = '请选择日期'; // 如果没有选择日期，显示默认文本  
            }
        },
        exportData() {
            this.$confirm('是否导出表格数据到Excel?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                exportExcel(this.dataList, '271分级表.xlsx', this.labelText)

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
            // this.updateLabel()
        },
        formatDate(date) {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0'); // 月份从0开始，所以加1 
            const day = String(date.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
        },
        getsiteList() {
            oapi.SupplierpricesiteallApi().then(res => {
                this.siteList = res
                console.log(this.siteList, 156542)
                this.dataList.forEach(data => {
                    const matchingSite = this.siteList.find(site => site.siteid === data.cNccSiteId);
                    if (matchingSite) {
                        data.human = matchingSite.human; // 添加 human 字段  
                    }
                });
                this.currentData = {
                    ...this.dataList
                };

                this.sizeChangeHandle(this.pageSize);
                this.dataListLoading = false
                
            })
        },
        getdataList() {
            this.updateLabel()
            this.dataListLoading = true
            api.nccorder271API(this.dataForm).then(res => {
                this.dataList = res
                this.dataList.forEach(item => {
                    // 保留两位小数并加上百分号  
                    item.salerate = parseFloat(item.salerate).toFixed(2) + '%';
                    item.samebox = parseFloat(item.samebox).toFixed(2);
                    item.curbox = parseFloat(item.curbox).toFixed(2);
                    item.gross_profit = isNaN(parseFloat(item.gross_profit)) ? '0.00' : parseFloat(item.gross_profit).toFixed(2);
                    item.one_gross_profit = isNaN(parseFloat(item.one_gross_profit)) ? '0.00' : parseFloat(item.one_gross_profit).toFixed(2);
                    item.fOrderRebateMoney = isNaN(parseFloat(item.fOrderRebateMoney)) ? '0.00' : parseFloat(item.fOrderRebateMoney).toFixed(2);
                    item.one_fOrderRebateMoney = isNaN(parseFloat(item.one_fOrderRebateMoney)) ? '0.00' : parseFloat(item.one_fOrderRebateMoney).toFixed(2);
                    item.sales_profit = isNaN(parseFloat(item.sales_profit)) ? '0.00' : parseFloat(item.sales_profit).toFixed(2);
                });
                // 过滤数据  
                this.dataList = this.dataList.filter(item =>
                    (item.ocustomerClass_name && item.ocustomerClass_name.toLowerCase().includes(this.bullay)) ||
                    (item.cSiteName && item.cSiteName.toLowerCase().includes(this.bullay)) ||
                    (item.fzr && item.fzr.toLowerCase().includes(this.bullay)) ||
                    (item.vcol2_name && item.vcol2_name.toLowerCase().includes(this.bullay)) ||
                    (item.direct_sale && item.direct_sale.toLowerCase().includes(this.bullay))
                );
                this.getsiteList()
                // this.currentData = {
                //     ...this.dataList
                // };
                // this.sizeChangeHandle(this.pageSize);
                
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
    font-size: 12px;
    background: #f5f7fa;
}


::v-deep .el-table th {
    background: #f5f7fa;
}
</style>