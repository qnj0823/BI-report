<template>
    <div class='DailyReport'>
        <el-form :inline="true" style="width:90%; margin: 0 auto;">
            <div class="test">{{ this.labelText }}</div>
            <el-form-item>
                日期区间：
                <el-form-item>
                    <el-date-picker v-model="dataForm.p_vouchdatestart" value-format="yyyy-MM-dd" type="date"
                        placeholder="开始日期" clearable style="width: 100%"></el-date-picker>
                </el-form-item>
                <el-form-item>
                    <el-date-picker v-model="dataForm.p_vouchdateend" value-format="yyyy-MM-dd" type="date"
                        placeholder="结束日期" clearable style="width: 100%"></el-date-picker>
                </el-form-item>
            </el-form-item>
            <el-form-item>
                当前数据日期：
                <el-form-item>
                    <el-date-picker v-model="dataForm.p_vouchdatecur" value-format="yyyy-MM-dd" type="date"
                        placeholder="开始日期" clearable style="width: 100%"></el-date-picker>
                </el-form-item>
            </el-form-item>
            <el-form-item>
                <el-button class="filter-item" size="mini" type="success" icon="el-icon-search"
                    @click="getDataList">查询</el-button>
            </el-form-item>
            <el-form-item>
                <el-button size="mini" class="filter-item" type="warning" icon="el-icon-download"
                    @click="exportData">导出</el-button>
            </el-form-item>
        </el-form>
        <el-table class="table" ref="table" :data="currentData" v-loading="dataListLoading"
            style="width: 90%; margin: 0 auto; margin-bottom: 50px;">
            <el-table-column :show-overflow-tooltip="true" align="center" prop="vouchdate" label="日期" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="areaname" label="城市" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="provincename" label="区域" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="cSiteName" label="客户(站点)" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="js"   label="24年10月累积" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="yznr" label="10月报单累积" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="yznr" label="同比完成率" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="yznr" label="今日同期" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="todaybox" label="今日报单" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="yznr" label="今日同期差额" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="yznr" label="累积同期差额111" />
        </el-table>
        <el-pagination @size-change="sizeChangeHandle" ref="pagination" @current-change="handleCurrentChange"
            :current-page="currentPage" :page-sizes="[20, 40, 60, 80, 100, 1000]" :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper" :total="dataList.length">
        </el-pagination>
    </div>
</template>

<script>
import * as api from '@/api/frame/customer.js'

import {
    exportExcel
} from './DailyReportExpro.js'
export default {
    name: 'DailyReport-page',
    data() {
        return {
            msg: 'DailyReport-page',
            dataForm: {
                p_vouchdatestart: '',
                p_vouchdateend: '',
                p_vouchdatecur: ''
            },
            dataListLoading: false,
            dataList: [],
            currentData: [],
            currentPage: 1,
            pageSize: 20,
            totalItems: 0,
            labelText: '销售日订单跟进表'
        };
    },
    created() {
        this.calculateCurrentYearDates();
        // this.calculateLastYearDates()
    },
    mounted() {
        this.getDataList()
    },
    methods: {
        getDataList() {
            this.dataListLoading = true
            api.APIdaily_report(this.dataForm).then(res => {
                console.log(res, 'res')
                this.dataList = res
                this.currentData = {
                    ...this.dataList
                };
                this.dataListLoading = false
                this.sizeChangeHandle(this.pageSize);
            })
        },
        exportData() {
            this.$confirm('是否导出表格数据到Excel?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                exportExcel(this.dataList, '销售日订单跟进表.xlsx')
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
        // 获取今年的日期数据
        calculateCurrentYearDates() {
            const today = new Date();

            // 获取当前月份的月初时间 
            const startOfMonthDate = new Date(today.getFullYear(), today.getMonth(), 1);
            this.startOfMonth = this.formatDate(startOfMonthDate);

            // 获取截至今天的时间 
            this.endOfToday = this.formatDate(today);

            // 获取当前月份的最后一天（月末）
            const endOfMonthDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);
            this.endOfMonth = this.formatDate(endOfMonthDate);

            this.dataForm.p_vouchdatestart = this.startOfMonth;
            this.dataForm.p_vouchdateend = this.endOfMonth;
            this.dataForm.p_vouchdatecur = this.endOfToday

        },
        // 格式化日期
        formatDate(date) {
            this.year = date.getFullYear();
            this.month = String(date.getMonth() + 1).padStart(2, '0'); // 月份从0开始，所以加1 
            this.day = String(date.getDate()).padStart(2, '0');
            return `${this.year}-${this.month}-${this.day}`;
        },
    }
};
</script>

<style scoped lang="scss">
.test {
    font-family: 'Microsoft YaHei', 微软雅黑, sans-serif;
    font-size: 22px;
    text-align: center;
    margin-bottom: 10px;
}
</style>