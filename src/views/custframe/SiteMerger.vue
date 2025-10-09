<template>
    <div class='SM'>
        <el-form :inline="true" style="margin-top: 10px;" @submit.native.prevent>
            <el-form-item>

                <el-button class="filter-item" size="mini" type="success" 
                    @click="addOrUpdateHandle()">新增</el-button>
                    <el-form-item>
                <el-input v-model="bullay" placeholder="模糊搜索" clearable @keyup.enter.native="searchEnterFun()"
                    ref="searchInput"></el-input>
            </el-form-item>
                <el-button class="filter-item" size="mini" type="success" icon="el-icon-search"
                    @click="getDataList">查询</el-button>
            </el-form-item>
        </el-form>
        <el-table ref="table" v-loading="dataListLoading" :data="currentData" style="width: 100%;">
            <el-table-column align="center" label="现在系统内的站点">
                <el-table-column :show-overflow-tooltip="true" align="center" prop="dqname" label="战区" />
                <el-table-column :show-overflow-tooltip="true" align="center" prop="sqname" label="销售区域/省区" />
                <el-table-column :show-overflow-tooltip="true" align="center" prop="companyname" label="分子公司/办事处" />
                <el-table-column prop="custname" width="200" align="center" label="客户名称" />
                <el-table-column :show-overflow-tooltip="true" align="center" prop="sitename" label="站点" />
            </el-table-column>
            <el-table-column align="center" label="合并后需归到站点">
                <el-table-column :show-overflow-tooltip="true" align="center" prop="dqnamenew" label="战区" />
                <el-table-column :show-overflow-tooltip="true" align="center" prop="sqnamenew" label="销售区域/省区" />
                <el-table-column :show-overflow-tooltip="true" align="center" prop="companynamenew" label="分子公司/办事处" />
                <el-table-column prop="custnamenew"  width="200" align="center" label="客户名称" />
                <el-table-column :show-overflow-tooltip="true" align="center" prop="sitenamenew" label="站点" />
            </el-table-column>
            <el-table-column header-align="center" align="center" width="150" label="操作">
                <template slot-scope="scope">
                    <el-button type="text" size="small"
                        @click="addOrUpdateHandle(scope.row.id, scope.row)">修改</el-button>
                    <el-button type="text" size="small" @click="deleteHandle(scope.row.id)">删除</el-button>
                </template>
            </el-table-column>
            <el-table-column :show-overflow-tooltip="true" align="center" prop="createman" label="操作人" />
        </el-table>
        <el-pagination @size-change="sizeChangeHandle" ref="pagination" @current-change="handleCurrentChange"
            :current-page="currentPage" :page-sizes="[20, 40, 60, 80, 100, 1000]" :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper" :total="dataList.length">
        </el-pagination>
        <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @close="addOrUpdateVisible = false"
            @refreshDataList="getDataList"></add-or-update>
    </div>
</template>

<script>
import * as api from '@/api/frame/customer.js'
import AddOrUpdate from './SiteMerger-add-updata'
export default {
    components: {
        AddOrUpdate
    },
    name: 'SM-page',
    data() {
        return {
            msg: 'SM-page',
            dataListLoading: false,
            addOrUpdateVisible: false,
            dataForm: {
                page: 0,
                size: 10000
            },
            bullay:'',
            dataList: [],
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
        // 新增 / 修改
        addOrUpdateHandle(id, data) {
            this.addOrUpdateVisible = true
            this.$nextTick(() => {
                this.$refs.addOrUpdate.init(id, data)
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
                api.newOldadddeleteApi(ids).then(res => {
                    // TODO 处理删除
                    this.$emit('refreshDataList')
                    this.$emit('close')
                    this.$message.success('删除成功')
                    this.getDataList()
                })
            })

        },
        getDataList() {
            api.newOldaddcheckApi(this.dataForm).then(res => {
                this.dataList = res.content
                this.dataList = this.dataList.filter(item =>
                    item.dqname.toLowerCase().includes(this.bullay) ||
                    item.sqname.toLowerCase().includes(this.bullay) ||
                    item.companyname.toLowerCase().includes(this.bullay) ||
                    item.custname.toLowerCase().includes(this.bullay) ||
                    item.sitename.toLowerCase().includes(this.bullay) ||
                    item.dqnamenew.toLowerCase().includes(this.bullay) ||
                    item.sqnamenew.toLowerCase().includes(this.bullay) ||
                    item.companynamenew.toLowerCase().includes(this.bullay)||
                    item.custnamenew.toLowerCase().includes(this.bullay)||
                    item.sitenamenew.toLowerCase().includes(this.bullay)

                );
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

<style scoped lang="scss"></style>