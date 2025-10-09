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
            <el-form-item>
                <el-button class="filter-item" size="mini" type="success" icon="el-icon-plus"
                    @click="addOrUpdateHandle()">新增站点</el-button>
            </el-form-item>
        </el-form>
        <el-table ref="table" v-loading="dataListLoading" :data="currentData" style="width: 100%;">
            <el-table-column :show-overflow-tooltip="true" align="center" prop="orderid" label="序号" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="areaname" label="区域" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="sitecode" label="光明站点code" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="othercode"  label="光明清新站点code" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="sitename" label="光明站点" />
            <el-table-column header-align="center" align="center" width="150" label="操作">
                <template slot-scope="scope">
                    <el-button type="text" size="small"
                        @click="addOrUpdateHandle(scope.row.id, scope.row)">修改</el-button>
                    <el-button type="text" size="small" @click="deleteHandle(scope.row.id)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination @size-change="sizeChangeHandle" ref="pagination" @current-change="handleCurrentChange"
            :current-page="currentPage" :page-sizes="[20, 40, 60, 80, 100, 1000]" :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper" :total="dataList.length">
        </el-pagination>
        <!-- 表单弹窗, 新增数据和修改数据 -->
        <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @close="addOrUpdateVisible = false"
            @refreshDataList="getDataList"></add-or-update>
    </div>
</template>

<script>
import * as api from '@/api/frame/customer.js'
import AddOrUpdate from './RefreshSite-add-updata'
import {
    exportExcel
} from './RefreshSiteExpro.js'
export default {
    name: 'ceshi-page',
    components: {
        AddOrUpdate,
    },
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
            addOrUpdateVisible: false,


        };
    },
    mounted() {
        this.getDataList()
    },
    methods: {
        //删除
        deleteHandle(id) {
            var ids = id ? [id] : this.dataListSelections.map(item => {
                return item.id
            })
            this.$confirm(`您确定对[ids=${ids.join(',')}]进行[${id ? '删除' : '批量删除'}]操作?`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.dataListLoading = true
                console.log('删除', ids);
                api.bdSitedelAPI(ids).then(res => {
                    // TODO 处理删除
                    this.$emit('refreshDataList')
                    this.$emit('close')
                    this.$message.success('删除成功')
                    this.dataListLoading = false
                    this.getDataList()
                })
            })

        },
        // 新增 / 修改
        addOrUpdateHandle(id, data) {
            this.addOrUpdateVisible = true
            this.$nextTick(() => {
                this.$refs.addOrUpdate.init(id, data)
            })
        },
        getDataList() {
            api.bdSiteAPI().then(res => {
                console.log(res)
                this.dataList = res
                this.dataList = this.dataList.filter(item =>
                    (item.areaname && item.areaname.includes(this.bullay)) ||
                    (item.areaname && item.areaname.includes(this.bullay))  ||
                    (item.sitecode && item.sitecode.includes(this.bullay))  ||
                    (item.sitename && item.sitename.includes(this.bullay)) 
                );
                this.currentData = {
                    ...this.dataList
                };
                this.sizeChangeHandle(this.pageSize);
            })
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
                exportExcel(this.dataList, '光明新新活力站点表.xlsx')
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