<template>
    <div class='NomalData'>
        <el-form :inline="true" style="margin-top: 10px;" @submit.native.prevent>
            <el-form-item>
                <el-date-picker v-model="dataForm.p_vouchdateend" value-format="yyyy-MM-dd" type="date"
                    placeholder="订单日期" clearable style="width: 100%"></el-date-picker>
            </el-form-item>
            <el-form-item>
                <el-form-item>
                    <el-input v-model="bullay" placeholder="模糊搜索" clearable @keyup.enter.native="searchEnterFun()"
                        ref="searchInput"></el-input>
                </el-form-item>
                <el-button class="filter-item" size="mini" type="success" icon="el-icon-search"
                    @click="getDataList">查询</el-button>
                <el-button class="filter-item" size="mini" type="success" @click="addOrUpdateHandle()">新增</el-button>
            </el-form-item>
        </el-form>
        <el-table ref="table" v-loading="dataListLoading" :data="dataList" style="width: 100%;">
            <el-table-column :show-overflow-tooltip="true" prop="areaName" align="center" label="区域"/>
            <el-table-column :show-overflow-tooltip="true" prop="productCode" align="center" label="集团产品编码"/>
            <el-table-column :show-overflow-tooltip="true" prop="factoryProductCode" align="center" label="工厂产品编码"/>
            <el-table-column :show-overflow-tooltip="true" prop="factoryProductName" align="center" label="产品"/>
            <el-table-column :show-overflow-tooltip="true" prop="wlSiteCode" align="center" label="光明物流编码"/>
            <el-table-column :show-overflow-tooltip="true" prop="wlSiteName" align="center" label="光明物流站点"/>
            <el-table-column :show-overflow-tooltip="true" prop="piece" align="center" label="数量(盒)"/>
            <el-table-column :show-overflow-tooltip="true" prop="vouchdate" align="center" label="日期"/>
            <el-table-column :show-overflow-tooltip="true" prop="days" align="center" label="T加几"/>
            <el-table-column :show-overflow-tooltip="true" prop="deliverydate" align="center" label="到货日期"/>
            <el-table-column :show-overflow-tooltip="true" prop="createdate" align="center" label="创建日期"/>
        </el-table>
        <add-or-update v-if="addOrUpdateVisible" :date="this.dataForm.p_vouchdateend"  ref="addOrUpdate" @close="addOrUpdateVisible = false"
            @refreshDataList="getDataList"></add-or-update>
    </div>
</template>

<script>
import * as api from '@/api/frame/customer.js'
import AddOrUpdate from './NomalData-add-updata'
export default {
    name: 'NomalData-page',
    components: {
        AddOrUpdate
    },
    data() {
        return {
            msg: 'NomalData-page',
            addOrUpdateVisible: false,
            dataList: [],
            dataListLoading:false,
            bullay:'',
            dataForm: {
                p_vouchdateend: ''
            }
        };
    },
    created() {
        this.calculateCurrentYearDates();
    },
    mounted() {
        this.getDataList()
    },
    methods: {
        getDataList() {
            api.NormalListAPI().then(res => {
                this.dataList = res
                this.dataList = this.dataList.filter(item =>
                    (item.areaName && item.areaName.includes(this.bullay)) ||
                    (item.productCode && item.productCode.includes(this.bullay))  ||
                    (item.factoryProductCode && item.factoryProductCode.includes(this.bullay))  ||
                    (item.factoryProductName && item.factoryProductName.includes(this.bullay)) ||
                    (item.wlSiteCode && item.wlSiteCode.includes(this.bullay))  ||
                    (item.wlSiteName && item.wlSiteName.includes(this.bullay)) ||
                    (item.vouchdate && item.vouchdate.includes(this.bullay)) 
                );
            })
        },
        // 新增 / 修改
        addOrUpdateHandle() {
            this.addOrUpdateVisible = true
            this.$nextTick(() => {
                this.$refs.addOrUpdate.init()
            })
        },
        // 获取今年的日期数据
        calculateCurrentYearDates() {
            const today = new Date();

            // 获取当前月份的月初时间 
            const startOfMonthDate = new Date(today.getFullYear(), today.getMonth(), 1);
            this.startOfMonth = this.formatDate(startOfMonthDate);

            // 获取截至今天的时间 
            this.endOfToday = this.formatDate(today);

            this.dataForm.p_vouchdateend = this.endOfToday;
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

<style scoped lang="scss"></style>