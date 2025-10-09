<template>
    <div class='CL'>
        <el-form :inline="true" style="margin-top: 10px;" @submit.native.prevent>
            <el-form-item>
                <el-button class="filter-item" size="mini" type="success" @click="addOrUpdateHandle()">新增</el-button>
                <el-form-item>
                    <el-input v-model="bullay" placeholder="模糊搜索" clearable @keyup.enter.native="searchEnterFun()"
                        ref="searchInput"></el-input>
                </el-form-item>
                <el-button class="filter-item" size="mini" type="success" icon="el-icon-search"
                    @click="getDataList">查询</el-button>
                <el-button size="mini" class="filter-item" type="warning" icon="el-icon-download"
                    @click="exportData">导出</el-button>
            </el-form-item>
        </el-form>
        <el-table ref="table" v-loading="dataListLoading" :data="dataList" style="width: 100%;">
            <el-table-column :show-overflow-tooltip="true" align="center" width="100" prop="areaName" label="地区分类 " />
            <el-table-column :show-overflow-tooltip="true" align="center" width="100" prop="jtProductCode" label="集团销售产品编号" />
            <el-table-column :show-overflow-tooltip="true" align="center" width="310" prop="jtProductName" label="集团销售产品名称" />
            <el-table-column prop="jtSpecifications" width="50" align="center" label="规格" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="factoryProductCode" label="光明产品编号 " />
            <el-table-column :show-overflow-tooltip="true" align="center"  width="310" prop="factoryProductName" label="光明产品名称" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="factoryProductSimpleName"
                label="光明产品简称" />
            <el-table-column :show-overflow-tooltip="true" align="center"  width="50" prop="factorySpecifications" label="规格" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="factoryName" label="光明工厂" />
            <el-table-column header-align="center" align="center" width="150" label="操作">
                <template slot-scope="scope">
                    <el-button type="text" size="small"
                        @click="addOrUpdateHandle(scope.row.id, scope.row)">修改</el-button>
                    <el-button type="text" size="small" @click="deleteHandle(scope.row.id)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @close="addOrUpdateVisible = false"
            @refreshDataList="getDataList"></add-or-update>
    </div>
</template>

<script>
import * as api from '@/api/frame/customer.js'
import AddOrUpdate from './CliqueandLiht-add-updata'
import {
    exportExcel
} from './CliqueandLihtExpro.js'
export default {
    name: 'cl-page',
    components: {
        AddOrUpdate
    },
    data() {
        return {
            msg: 'cl-page',
            bullay: '',
            addOrUpdateVisible: false,
            dataList: [],
            dataListLoading: false,
            dataForm: {
                page: 0,
                size: 800,
                sort: '',
            },
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

                exportExcel(this.dataList, '集团产品与光明产品对应表.xlsx')

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
            api.wlProductaFactcheckApi(this.dataForm).then(res => {
                this.dataList = res.content
                this.dataList = this.dataList.filter(item =>
                    (item.areaName && item.areaName.toLowerCase().includes(this.bullay)) ||
                    (item.jtProductName && item.jtProductName.toLowerCase().includes(this.bullay)) ||
                    (item.factoryProductName && item.factoryProductName.toLowerCase().includes(this.bullay))
                );
                this.dataList.sort((a, b) => {
                    if (a.areaName < b.areaName) {
                        return -1; // a 在 b 前面  
                    }
                    if (a.areaName > b.areaName) {
                        return 1; // a 在 b 后面  
                    }
                    return 0; // 相等  
                });
                console.log(this.dataList)
            })
        },
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
                console.log('删除', ids);
                api.wlProductaFactdeleteApi(ids).then(res => {
                    // TODO 处理删除
                    this.$emit('refreshDataList')
                    this.$emit('close')
                    this.$message.success('删除成功')
                    this.getDataList()
                })
            })

        },
    }
};
</script>

<style scoped lang="scss"></style>