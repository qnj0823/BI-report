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
            <el-table-column :show-overflow-tooltip="true" align="center" prop="def5Name" label="销量区域" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="gdb" label="gdp" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="peoples" label="人口" />
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
} from './regGDPpeoExpro.js'
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
            regList: [],
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

                api.importcompanydataAPi(formData).then(res => {
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

                exportExcel(this.dataList, '销量区域GDP/人口导入表.xlsx')

            })
        },
        getregList() {
            api.regTablelist(this.dataFormreglist).then(res => {
                this.regList = res.content
                this.regList.forEach(regItem => {
                    // 在 this.dataList 中寻找与 regItem.regionid 匹配的对象  
                    const matchingItem = this.dataList.find(dataItem => dataItem.dEF5 === regItem.regionid);

                    if (matchingItem) {
                        // 将 regItem 的其他字段添加到匹配的 dataItem 中  
                        // 假设你要添加的字段为 regField1 和 regField2  
                        matchingItem.gdb = regItem.gdb;
                        matchingItem.peoples = regItem.peoples;
                        // 你可以根据需要添加更多字段  
                    }
                });
                this.currentData = {
                    ...this.dataList
                };

                this.sizeChangeHandle(this.pageSize);
                console.log(this.regList, 666)
            })
        },
        getDataList() {
            this.dataListLoading = true
            api.SiteallCustomer(this.dataForm).then(res => {
                this.dataList = res
                this.dataList.forEach(item => {
                    const levels = item.levelName.split(' -> ');
                    item.levelName1 = levels[0] || "";
                    // 去掉 levelName2 中的数字  
                    item.levelName2 = levels[1] ? levels[1].replace(/\d+/g, '').trim() : "";
                    item.levelName3 = levels[2] || "";
                });
                const seen = new Set();
                this.dataList = this.dataList.filter(item => {
                    // 判断 def5Name 是否非空且没有被见过  
                    if (item.def5Name && !seen.has(item.def5Name)) {
                        seen.add(item.def5Name);
                        return true; // 保留这个对象  
                    }
                    return false; // 过滤掉重复对象或 def5Name 为空的对象  
                }).map(item => ({
                    def5Name: item.def5Name,
                    dEF5: item.dEF5,
                    levelName2: item.levelName2,
                    levelName3: item.levelName3
                }));
                this.getregList()
                console.log(this.dataList)
                this.dataListLoading = false
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