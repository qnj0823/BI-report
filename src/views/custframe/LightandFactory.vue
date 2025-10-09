<template>
    <div class='LF'>
        <el-form :inline="true" style="margin-top: 10px;" @submit.native.prevent>
            <el-form-item>
                <el-button class="filter-item" size="mini" type="success" @click="addOrUpdateHandle()">新增</el-button>
                <el-form-item>
                    <el-input v-model="bullay" placeholder="模糊搜索" clearable @keyup.enter.native="searchEnterFun()"
                        ref="searchInput"></el-input>
                </el-form-item>
                <el-button class="filter-item" size="mini" type="success" icon="el-icon-search"
                    @click="getDataList">查询</el-button>
            </el-form-item>
        </el-form>
        <el-table ref="table" v-loading="dataListLoading" :data="dataList" style="width: 100%;">
            <el-table-column :show-overflow-tooltip="true" align="center" prop="factoryProductCode" label="光明产品编号" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="factoryProductName" label="光明产品名称" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="specifications" label="规格" />
            <el-table-column prop="factoryName" width="200" align="center" label="所属光明工厂" />
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
import AddOrUpdate from './LightandFactory-add-updata'
export default {
    name: 'LF-page',
    components: {
        AddOrUpdate
    },
    data() {
        return {
            msg: 'LF-page',
            bullay: '',
            addOrUpdateVisible: false,
            dataListLoading:false,
            dataList: [],
            dataForm:{
                page:0,
                size:1000,
            }
            
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
                api.wlProductdeleteApi(ids).then(res => {
                    // TODO 处理删除
                    this.$emit('refreshDataList')
                    this.$emit('close')
                    this.$message.success('删除成功')
                    this.getDataList()
                })
            })

        },
        getDataList(){
            api.wlProductcheckApi(this.dataForm).then(res=>{
                this.dataList = res.content
                console.log(this.dataList)
            })
        },
    }
};
</script>

<style scoped lang="scss"></style>