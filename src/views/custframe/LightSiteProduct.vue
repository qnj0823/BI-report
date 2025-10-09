<template>
    <div class='Light'>
        <el-button class="filter-item" size="mini" type="success" icon="el-icon-plus"
            @click="addOrUpdateHandle()">新增产品</el-button>
        <!-- 光明产品排序 -->
        <el-table ref="table" v-loading="dataListLoading" :data="dataList" style="width: 100%;">
            <el-table-column :show-overflow-tooltip="true" align="center" prop="orderid" label="序号" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="name" label="产品名称" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="model" label="箱规格" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="factory" label="工厂" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="simplename" label="产品简称" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="code" label="产品编码/备注" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="areaname" label="区域" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="materialcode" label="集团产品编码" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="materialname" label="集团产品名称" />
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
import AddOrUpdate from './LightSiteProduct-add-updata'
export default {
    name: 'Light-page',
    props: {
        message: {
            type: String,
            default: ''
        },
        test: {
            type: String,
            default: ''
        }
    },
    components: {
        AddOrUpdate,
    },
    data() {
        return {
            msg: 'Light-page',
            dataList: [],
            addOrUpdateVisible: false,
            dataListLoading: false,
            dataForm: {
                page: 0,
                size: 5000
            },
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
        getDataList() {
            this.dataListLoading = true
            api.BDMaterialFactorycheckApi(this.dataForm).then(res => {
                this.dataList = res.content

                this.dataList = this.dataList.filter(item =>
                    item.areaname.includes(this.message)
                );
                this.dataList = this.dataList.filter(item =>
                    item.name.includes(this.test)
                );
                this.dataList = this.dataList.sort((a, b) => {
                    return a.orderid - b.orderid; // 升序排序  
                    // 如果需要降序排序，可以使用: return b.orderId - a.orderId;  
                });

                this.dataListLoading = false
            })
        },
        //删除
        deleteHandle(id) {
            console.log(id)
            var ids = id ? [id] : this.dataListSelections.map(item => {
                return item.id
            })
            this.$confirm(`您确定对[ids=${ids.join(',')}]进行[${id ? '删除' : '批量删除'}]操作?`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                console.log('删除', ids);
                api.BDMaterialFactorydelApi(ids).then(res => {
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