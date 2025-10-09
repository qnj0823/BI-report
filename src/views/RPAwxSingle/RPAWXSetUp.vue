<template>
    <div class='RPAWXSetUp'>
        <el-form :inline="true" style="width: 100%; margin: 0 auto;">
            <el-form-item>
                <el-button class="filter-item" size="mini" type="success" icon="el-icon-plus"
                @click="addOrUpdateHandle()">新增</el-button>
            </el-form-item>
            <el-form-item>
                <el-button class="filter-item" size="mini" type="success" icon="el-icon-search"
                    @click="getDataList">查询</el-button>
            </el-form-item>
        </el-form>
        <el-table ref="table" v-loading="dataListLoading" :data="dataList" style="width: 100%;">
            <el-table-column :show-overflow-tooltip="true" align="center" prop="city" label="省区" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="groups" label="群聊名称" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="status" label="状态" />
            <el-table-column header-align="center" align="center" width="150" label="操作">
                <template slot-scope="scope">
                    <el-button type="text" size="small"
                        @click="addOrUpdateHandle(scope.row.id, scope.row)">修改</el-button>
                    <el-button type="text" size="small" @click="deleteHandle(scope.row.id)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <!-- 表单弹窗, 新增数据和修改数据 -->
        <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @close="addOrUpdateVisible = false"
            @refreshDataList="getDataList"></add-or-update>
    </div>
</template>

<script>
import * as api from '@/api/frame/customer.js'
import AddOrUpdate from './RPAWXSetUp-add-updata'
export default {
    components: {
        AddOrUpdate,
    },
    name: 'RPAWXSetUp-page',
    data() {
        return {
            msg: 'RPAWXSetUp-page',
            dataList:[],
            dataForm:{
                page:'0',
                size:'200'
            },
            dataListLoading:false,
            addOrUpdateVisible: false,
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
        getDataList(){
            this.dataListLoading = true
            api.RPIWechupsAPI(this.dataForm).then(res=>{
                this.dataList = res.content
                this.dataListLoading = false
                console.log(res,'6666')
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
                api.RPIWechupsdelAPI(ids).then(res => {
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