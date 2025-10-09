<template>
    <div class='rule'>
        <el-form :inline="true" style="width:100%; margin: 0 auto;">
            <el-form-item>
                <el-input v-model="bullay" placeholder="模糊搜索" clearable @keyup.enter.native="searchEnterFun()"
                    ref="searchInput"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button class="filter-item" size="mini" type="success" icon="el-icon-search"
                    @click="getDataList">查询</el-button>
            </el-form-item>
            <el-form-item>
                <el-button class="filter-item" size="mini" type="success" icon="el-icon-plus"
                    @click="addOrUpdateHandle()">新增</el-button>
            </el-form-item>
        </el-form>
        <el-table border ref="table" v-loading="dataListLoading" :data="dataList" style="width: 100%;">
            <el-table-column :show-overflow-tooltip="true" align="center" width="200" prop="orgname" label="销售组织" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="orgcode" label="销售组织编码" />
            <el-table-column :show-overflow-tooltip="true" align="center" width="200" prop="custname" label="客户" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="custcode" label="客户编码" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="productname" label="产品" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="productcode" label="产品编码" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="custtype" :formatter="formatCustType"
                label="客户类型" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="days" label="报单周期" />
            <el-table-column header-align="center" align="center" width="150" label="操作">
                <template #default="scope">
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
import AddOrUpdate from './DeclarationRule-add-updata'
import * as api from '@/api/frame/customer.js'
export default {
    components: {
        AddOrUpdate
    },
    name: 'rule-page',
    data() {
        return {
            msg: 'rule-page',
            addOrUpdateVisible: false,
            dataListLoading: false,
            dataList: [],
            bullay: ''
        };
    },
    mounted() {
        this.getDataList()
    },
    methods: {
        formatCustType(row) {
            const map = { '0': '单号客户', '1': '双号客户', '2': '单双客户' };
            return map[row.custtype] || row.custtype; // 默认显示原值（防错）
        },
        getDataList() {
            api.OrderCycleSetAPI().then(res => {
                this.dataList = res
                this.dataList = this.dataList.filter(item =>
                    (item.orgname && item.orgname.toLowerCase().includes(this.bullay)) ||
                    (item.custname && item.custname.toLowerCase().includes(this.bullay)) ||
                    (item.productname && item.productname.toLowerCase().includes(this.bullay)) ||
                    (item.productcode && item.productcode.toLowerCase().includes(this.bullay)) 
                );
                console.log(this.dataList, 'this.dataList')
            })
        },
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
                api.OrderCycleSetedelAPI(ids).then(res => {
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