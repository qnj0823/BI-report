<template>
    <div class='rpaWX'>
        <el-form :inline="true" style="margin-top: 10px;" :model="dataForm" @submit.native.prevent>
            <el-form-item>
                <el-input v-model="dataForm2.file" placeholder="选择文件" readonly></el-input>
                <input type="file" ref="fileInput" style="display: none"  @change="handleFileUpload">
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="openFileInput">选择文件</el-button>
                <el-button type="success" @click="uploadFile">导入</el-button>
            </el-form-item>
        </el-form>
        <el-table ref="table" v-loading="dataListLoading" :data="dataList" style="width: 100%;">
            <el-table-column :show-overflow-tooltip="true" align="center" prop="city" label="省区" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="line" label="线路/单双号" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="sitecode" label="报单提醒" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="sitename" label="催单提醒" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="sitename" label="月份" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="sitename" label="报单日期" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="sitename" label="报单品项" />
            <el-table-column header-align="center" align="center" width="150" label="操作">
                <template slot-scope="scope">
                    <el-button type="text" size="small"
                        @click="addOrUpdateHandle(scope.row.id, scope.row)">修改</el-button>
                    <el-button type="text" size="small" @click="deleteHandle(scope.row.id)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
import * as api from '@/api/frame/customer.js'
export default {
    name: 'rpaWX-page',
    data() {
        return {
            msg: 'rpaWX-page',
            dataList:[],
            dataForm:{
                page:'0',
                size:'100'
            },
            dataForm2: {
                file: '',
            },
            dataListLoading:false,
        };
    },
    mounted() {
        this.getDataList()
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

                api.RPIWechupsimportAPI(formData).then(res => {
                    this.getDataList()
                    this.$message.success('导入成功')
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
        getDataList(){
            api.RPIWechAPI(this.dataForm).then(res=>{
                console.log(res,66)
            })
        }
    }
};
</script>

<style scoped lang="scss"></style>