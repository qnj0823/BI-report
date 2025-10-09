<template>
    <div class='time'>
        <el-form :inline="true" style="margin-top: 10px;" :model="dataForm" @submit.native.prevent>
            <el-form-item>
                <el-input v-model="dataForm2.file" placeholder="选择文件" readonly></el-input>
                <input type="file" ref="fileInput" style="display: none" @change="handleFileUpload">
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="openFileInput">选择文件</el-button>
                <el-button type="success" @click="uploadFile">导入</el-button>
            </el-form-item>
            <el-form-item>
                <!-- <el-button class="filter-item" size="mini" type="success" @click="addOrUpdateHandle()">新增</el-button> -->
                <el-button size="mini" class="filter-item" type="warning" icon="el-icon-download"
                    @click="exportData">下载模板</el-button>
            </el-form-item>
        </el-form>
        <el-table ref="table" v-loading="dataListLoading" :data="CycleList" style="width: 100%;">
            <el-table-column :show-overflow-tooltip="true" align="center" prop="dqname" label="战区" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="sqname" label="销售区域/省区"
                :formatter="(row) => row.sqname.replace(/\d+/g, '').trim()" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="days" label="到货周期" />
            <el-table-column header-align="center" align="center" width="150" label="操作">
                <template slot-scope="scope">
                    <el-button type="text" size="small"
                        @click="addOrUpdateHandle(scope.row.id, scope.row)">修改</el-button>
                    <el-button type="text" size="small" @click="deleteHandle(scope.row.id)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @close="addOrUpdateVisible = false"
            @refreshDataList="getCycleList"></add-or-update>
    </div>
</template>

<script>
import AddOrUpdate from './ArrivalTime-add-updata'
import * as api from '@/api/frame/customer.js'
import {
    exportExcel
} from './ArrivalTimeExpro.js'
export default {
    name: 'time-page',
    components: {
        AddOrUpdate
    },
    data() {
        return {
            msg: 'time-page',
            addOrUpdateVisible: false,
            dataListLoading: false,
            dataForm: {
                blurry: '',
            },
            dataForm1: {
                page: 0,
                size: 2000
            },
            dataForm2: {
                file: '',
            },
            dataList: [],
            dictList: [],
            exportList: [],
            CycleList: []
        };
    },
    mounted() {
        this.getDataList()
        this.getCycleList()
    },
    methods: {
        //选择文件
        openFileInput() {
            this.$refs.fileInput.click();
        },
        handleFileUpload(event) {
            this.files = event.target.files[0]
            this.dataForm2.file = event.target.files[0].name;
            console.log(this.files, this.dataForm2.file)
        },
        //导入
        uploadFile() {
            this.dataListLoading = true
            if (this.dataForm2.file) {
                let formData = new FormData();
                console.log(this.files)
                formData.append("file", this.files);

                api.DeliveryCycleimpordApi(formData).then(res => {
                    this.getCycleList()
                    this.$message.success('导入成功')
                    api.DeliveryCycleupallApi().then(res=>{
                        
                    })
                    this.dataListLoading = false
                })
                    .catch(error => {
                        this.dataListLoading = false
                        this.$message.error("导入失败");
                    });
            } else {
                this.$message.error("请先选择文件");
            }
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
                api.DeliveryCycledelApi(ids).then(res => {
                    // TODO 处理删除
                    this.$emit('refreshDataList')
                    this.$emit('close')
                    this.$message.success('删除成功')
                    this.getCycleList()
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
        exportData() {
            this.$confirm('是否导出表格数据到Excel?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                exportExcel(this.dictList, '到货周期填写模板.xlsx')
            })
        },
        getCycleList() {
            api.DeliveryCyclecheckApi(this.dataForm1).then(res => {
                this.CycleList = res.content
                // console.log(this.CycleList)

            })
        },
        getDataList() {
            api.BdallCustomer(this.dataForm).then(res => {
                this.dictList = res
                this.dictList.forEach(item => {
                    const levels = item.levelName.split(' -> ');
                    item.levelName1 = levels[0] || "";
                    // 去掉 levelName2 中的数字  
                    item.levelName2 = levels[1] || "";
                    item.levelName3 = levels[2] || "";
                });
                // 去重
                const map = new Map();
                this.dictList.forEach(item => {
                    if (!map.has(item.levelName2)) {
                        map.set(item.levelName2, item);
                    }
                });
                this.dictList = Array.from(map.values());
                console.log(this.dictList)
            })
        }
    }
};
</script>

<style scoped lang="scss"></style>