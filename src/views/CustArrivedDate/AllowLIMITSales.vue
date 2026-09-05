<template>
    <div class='AllowLIMITSales'>
        <el-form :inline="true" style="margin-top: 10px;" :model="dataForm" @submit.native.prevent>
            <el-form-item>
                <el-form-item>
                    <el-input v-model="bullay" placeholder="模糊搜索" clearable @keyup.enter.native="searchEnterFun()"
                        ref="searchInput"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button class="filter-item" size="mini" type="success" icon="el-icon-search"
                        @click="getDateList">查询</el-button>
                </el-form-item>
                <el-button size="mini" class="filter-item" type="warning" icon="el-icon-download"
                    @click="exportData">导出</el-button>
            </el-form-item>
        </el-form>
        <el-table border ref="table" v-loading="dataListLoading" :data="currentData" style="width: 100%;">
            <el-table-column :show-overflow-tooltip="true" align="center" width="200" prop="orgname" label="销售组织" />
            <el-table-column :show-overflow-tooltip="true" align="center" width="200" prop="cname" label="客户" />
            <el-table-column :show-overflow-tooltip="true" align="center" width="150" prop="ccode" label="客户编码" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="pname" label="产品" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="pcode" label="产品编码" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="price" label="价格" />
        </el-table>
        <el-pagination @size-change="sizeChangeHandle" ref="pagination" @current-change="handleCurrentChange"
            :current-page="currentPage" :page-sizes="[20, 40, 60, 80, 100, 1000]" :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper" :total="dataList.length">
        </el-pagination>
    </div>
</template>

<script>
import axios from 'axios';
import {
    exportExcel
} from './AllowLIMITSalesExpro.js'
export default {
    name: 'AllowLIMITSales-page',
    data() {
        return {
            msg: 'AllowLIMITSales-page',
            constants: this.$constants,
            dataForm: {
                page: 0,
                size: this.$constants.page.limit[0],
            },
            dataList: [],
            bullay: '',
            currentData: [],
            currentPage: 1,
            pageSize: 20,
            totalItems: 0,
            dataListLoading: false
        };
    },
    mounted() {
        this.getDateList()
    },
    methods: {
        async getDateList() {
            this.dataListLoading = true;
            this.error = null;
            try {
                const response = await axios.get(
                    'http://bi.yufanjtbip.com:8069/api/trackBipJgdDetailHz/all',
                );
                this.dataList = response.data;

                this.dataList = this.dataList.sort((a, b) => {
                    // 比较 orgname
                    const orgnameCompare = (a.orgname || '').localeCompare(b.orgname || '');
                    if (orgnameCompare !== 0) return orgnameCompare;

                    // 如果 orgname 相同，再比较 cname
                    return (a.cname || '').localeCompare(b.cname || '');
                });
                this.dataList = this.dataList.filter(item =>
                    (item.orgname && item.orgname.includes(this.bullay)) ||
                    (item.cname && item.cname.includes(this.bullay))  ||
                    (item.pname && item.pname.includes(this.bullay)) 
                );


                this.currentData = {
                    ...this.dataList
                };
                this.sizeChangeHandle(this.pageSize);
                this.dataListLoading = false
                console.log(this.dataList)
            } catch (err) {
                this.error = err.message || '请求失败';
            } finally {
                this.loading = false;
            }
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

        exportData() {

            this.$confirm('是否导出表格数据到Excel?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                // exportExcel()

                exportExcel(this.dataList, '客户产品规则.xlsx',)

            })
        },
    }
};
</script>

<style scoped lang="scss"></style>