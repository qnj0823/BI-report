<template>
    <div class='profile'>
        <el-form :inline="true" style="margin-top: 10px;" :model="dataForm1" @submit.native.prevent>
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
        <el-table ref="table" v-loading="dataListLoading" :data="currentData" style="width: 100%;">
            <el-table-column :show-overflow-tooltip="true" align="center" prop="dqname" label="一级分类" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="sqname" label="二级分类" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="companyname" label="三级分类" />
            <el-table-column :show-overflow-tooltip="true" prop="ccitename" align="center" label="客户站点" />
            <!-- <el-table-column :show-overflow-tooltip="true" align="center" prop="cname" label="客户名称" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="year" label="年份" /> -->
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
} from './siteFrameworkExpro.js'
export default {
    name: 'ceshi-page',
    data() {
        return {
            constants: this.$constants,
            msg: 'ceshi-page',
            dataForm1: {
                blurry: '',
            },
            bullay: '',
            dataListLoading: false,
            dataList: [],
            dataListHis: [],
            exportList: [],
            currentData: [],
            currentPage: 1,
            pageSize: 20,
            totalItems: 0,


        };
    },
    mounted() {
        this.getDataList()
    },
    methods: {
        async getDataList() {
            this.dataListLoading = true

            try {
                const [ywkjres] = await Promise.all([
                    api.CustomerSite(),//2025
                ]);
                this.dataList = ywkjres
                this.dataList = this.dataList.map(obj => ({
                    ...obj,
                    year: 2025
                }));

                this.dataList = this.dataList.filter(item => item.cname !== "杭州聚积宝网络科技有限公司");
                this.dataList = this.groupByCompanyName(this.dataList);

                this.dataList = this.dataList.map(item => {
                    if (!item.sqname) return item;    // 如果 sqname 为空、null 或 undefined，直接返回原对象
                    return {
                        ...item,
                        sqname: item.sqname.replace(/^\d+/, ''), // 否则去掉开头的数字
                    };
                });
                this.dataList = this.dataList.filter(item =>
                    (item.dqname && item.dqname.toLowerCase().includes(this.bullay)) ||
                    (item.sqname && item.sqname.toLowerCase().includes(this.bullay)) ||
                    (item.companyname && item.companyname.toLowerCase().includes(this.bullay)) ||
                    (item.ccitename && item.ccitename.toLowerCase().includes(this.bullay)) ||
                    (item.cname && item.cname.toLowerCase().includes(this.bullay))
                );
                this.currentData = {
                    ...this.dataList
                };
                this.sizeChangeHandle(this.pageSize);
                console.log(this.dataList)
                this.dataListLoading = false

            } catch (error) {
                console.error("获取数据时出错:", error);
                // 可以在这里添加错误提示
                this.$message.error('数据加载失败，请重试');
            }
        },
        groupByCompanyName(arr) {
            return arr.sort((a, b) => {
                const nameA = a.companyname || ''; // 处理可能的undefined
                const nameB = b.companyname || '';

                if (nameA < nameB) return -1;
                if (nameA > nameB) return 1;
                return 0;
            });
        },
        exportData() {
            this.$confirm('是否导出表格数据到Excel?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                exportExcel(this.dataList, '框架/客户/站点.xlsx')
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

<style scoped lang="scss"></style>