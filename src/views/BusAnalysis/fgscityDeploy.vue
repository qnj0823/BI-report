<template>
    <div class='deploy'>
        <el-form :inline="true" style="width:75%; margin: 0 auto;">
            <el-form-item>
                <el-button class="filter-item" size="mini" type="success" icon="el-icon-plus"
                    @click="addOrUpdateHandle()">新增</el-button>
            </el-form-item>
        </el-form>
        <el-table ref="table" v-loading="dataListLoading" style="width: 100%;">
            <el-table-column :show-overflow-tooltip="true" align="center" prop="levelName1" label="战区" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="levelName2" label="销量区域" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="levelName3" label="分公司/办事处" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="custname" label="省区 " />
        </el-table>
        <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @close="addOrUpdateVisible = false"
        @refreshDataList="getDataList"></add-or-update>
    </div>
</template>

<script>
import AddOrUpdate from './fgscityDeploy-add-updata'
export default {
    components: {
        AddOrUpdate
    },
    name: 'deploy-page',
    data() {
        return {
            msg: 'deploy-page',
            addOrUpdateVisible: false,
            dataListLoading:false
        };
    },
    mounted() {
    },
    methods: {
        // 新增 / 修改
        addOrUpdateHandle() {
            this.addOrUpdateVisible = true
            this.$nextTick(() => {
                this.$refs.addOrUpdate.init()
            })
        },
        getDataList(){
            
        }
    }
};
</script>

<style scoped lang="scss"></style>