<template>
    <div class='gdp'>
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
                <el-button size="mini" class="filter-item" type="warning" icon="el-icon-download"
                    @click="exportData">下载模板</el-button>
            </el-form-item>
        </el-form>
        <el-table ref="table" v-loading="dataListLoading" :data="currentData" style="width: 100%;">
            <el-table-column :show-overflow-tooltip="true" align="center" prop="levelName1" label="战区" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="levelName2" label="销售区域/省区" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="pkCustclassName" label="分公司/办事处" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="name" label="客户名称" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="def5Name" label="销量区域" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="def1Name" label="站点" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="human" label="人力+运营" />
        </el-table>
        <el-pagination @size-change="sizeChangeHandle" ref="pagination" @current-change="handleCurrentChange"
            :current-page="currentPage" :page-sizes="[20, 40, 60, 80, 100, 1000]" :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper" :total="dataList.length">
        </el-pagination>
    </div>
</template>

<script>
import * as api from '@/api/frame/customer.js'
import {
    exportExcel
} from './peopleandyunyinExpro.js'
export default {
    name: 'gdp-page',
    data() {
        return {
            msg: 'gdp-page',
            dataListLoading: false,
            addOrUpdateVisible: false,
            dataForm: {
                blurry: '',
                page: 0,
                size: this.$constants.page.limit[0],
                sort: '',
            },
            dataForm2: {
                file: '',
            },
            dataList: [],
            currentData: [],
            currentPage: 1,
            pageSize: 20,
            totalItems: 0,
            dataFormreglist: {
                page: 0,
                size: 5000
            },
            siteList: [],
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

                api.importcompanydatasiteAPi(formData).then(res => {
                    this.$message.success('导入成功')
                    this.dataListLoading = false
                    this.getDataList()
                })
                    .catch(error => {
                        this.dataListLoading = false
                        this.$message.error("导入失败");
                    });
            } else {
                this.$message.error("请先选择文件");
            }
        },
        exportData() {
            this.$confirm('是否导出表格数据到Excel?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {

                exportExcel(this.dataList, '人力运营维护导入表.xlsx')

            })
        },
        getsiteList() {
            api.SupplierpricesiteallApi().then(res => {
                this.siteList = res
                
                this.dataList.forEach(data => {
                    const matchingSite = this.siteList.find(site => site.siteid === data.dEF1);
                    if (matchingSite) {
                        data.human = matchingSite.human; // 添加 human 字段  
                    }
                });
                this.currentData = {
                    ...this.dataList
                };

                this.sizeChangeHandle(this.pageSize);
                this.dataListLoading = false
                console.log(this.siteList, 125642)
            })
        },
        // getsiteList(){
        //     api.SupplierpricesiteallApi().then(res=>{
        //         console.log(99, res)
        //     })
        // },
        getDataList() {
            this.dataListLoading = true
            api.SiteallCustomer(this.dataForm).then(res => {
                this.dataList = res
                console.log(this.dataList, 99999)
                this.dataList.forEach(item => {
                    const levels = item.levelName.split(' -> ');
                    item.levelName1 = levels[0] || "";
                    // 去掉 levelName2 中的数字  
                    item.levelName2 = levels[1] ? levels[1].replace(/\d+/g, '').trim() : "";
                    item.levelName3 = levels[2] || "";
                });

                // this.currentData = {
                //     ...this.dataList
                // };

                // this.sizeChangeHandle(this.pageSize);
                this.getsiteList()
                console.log(this.dataList)
                // this.dataListLoading = false
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