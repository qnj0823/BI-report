<template>
    <div class='purch'>
        <el-form :inline="true" style="width: 95%; margin: 0 auto;">
            <el-form-item>
                <el-input v-model="bullay" placeholder="模糊搜索" clearable @keyup.enter.native="searchEnterFun()"
                    ref="searchInput"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button class="filter-item" size="mini" type="success" icon="el-icon-search"
                    @click="getDataList">查询</el-button>
                <el-button size="mini" class="filter-item" type="warning" icon="el-icon-download"
                    @click="exportData">导出</el-button>
            </el-form-item>
        </el-form>
        <el-table ref="table" v-loading="dataListLoading" :data="dataList" style="width: 100%;">
            <el-table-column :show-overflow-tooltip="true" align="center" prop="orgname" label="销售组织" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="supplierName" label="供应商" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="code" label="物料编码" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="name" label="物料名称 " />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="nastorigtaxprice" label="价格" />
        </el-table>
    </div>
</template>

<script>
import {
    exportExcel
} from './PurchasePriceExpro.js'
import * as api from '@/api/frame/customer.js'
export default {
    name: 'purch-page',
    data() {
        return {
            msg: 'purch-page',
            dataList: [],
            dataListLoading: false,
            bullay: ''
        };
    },
    mounted() {
        this.getDataList()
    },
    methods: {
        exportData() {
            this.$confirm('是否导出表格数据到Excel?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {

                exportExcel(this.dataList, '采购价格表.xlsx')

            })
        },
        getDataList() {
            this.dataListLoading = true
            api.SupplierpriceApi().then(res => {
                this.dataList = res
                this.dataList.forEach(item => {
                    // 保留两位小数并加上百分号  
                    item.nastorigtaxprice = isNaN(parseFloat(item.nastorigtaxprice)) ? '0.00' : parseFloat(item.nastorigtaxprice).toFixed(2);
                });
                this.dataList = this.dataList.filter(item =>
                    (item.orgname && item.orgname.toLowerCase().includes(this.bullay)) ||
                    (item.supplierName && item.supplierName.toLowerCase().includes(this.bullay)) ||
                    (item.name && item.name.toLowerCase().includes(this.bullay))
                );
                this.dataListLoading = false
                console.log(this.dataList)

            })
        },
    }
};
</script>

<style scoped lang="scss"></style>