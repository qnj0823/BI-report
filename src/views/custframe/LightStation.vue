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
                    @click="addOrUpdateHandle()">新增</el-button>
            </el-form-item>
        </el-form>
        <el-table ref="table" v-loading="dataListLoading" :data="currentData" style="width: 100%;">
            <el-table-column :show-overflow-tooltip="true" align="center" prop="areaName" label="区域" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="linecode" label="线路编码" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="linename" label="线路名称" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="sitecode" label="站点编码" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="sitename" label="站点名称" />
            <el-table-column :show-overflow-tooltip="true" align="center" label="单号/双号" >
                    <template slot-scope="scope">
                        <span v-if="scope.row.type == '1'">单号</span>
                        <span v-else-if="scope.row.type == '2'">双号</span>
                        <span v-else>--</span>
                </template>
             </el-table-column>
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
import AddOrUpdate from './LightStation-add-updata'
import {
    exportExcel
} from './LightStationExpro.js'
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
            this.$confirm(`您确定对id：${id}这条数据进行删除操作?`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.dataListLoading = true
                console.log('删除', ids);
                api.wlDeliveryLinedelAPI(ids).then(res => {
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
            api.wlDeliveryLineAPI({
                size: 1000,
            }).then(res => {
                console.log(res)
                this.dataList = res.content
                this.dataList = this.dataList.filter(item =>
                    (item.areaName && item.areaName.includes(this.bullay)) ||
                    (item.linecode && item.linecode.includes(this.bullay)) ||
                    (item.linename && item.linename.includes(this.bullay)) ||
                    (item.sitecode && item.sitecode.includes(this.bullay)) ||
                    (item.sitename && item.sitename.includes(this.bullay))
                );
                this.currentData = {
                    ...this.dataList
                };
                this.sizeChangeHandle(this.pageSize);
            })
        },

        exportData() {
            this.$confirm('是否导出表格数据到Excel?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                exportExcel(this.dataList, '线路对应光明站点表.xlsx')
            })
        },
        // 每页数
        sizeChangeHandle(val) {
            console.log(val)
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