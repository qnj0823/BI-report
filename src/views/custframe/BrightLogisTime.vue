<template>
    <div class='wl'>
        <el-form :inline="true" style="margin-top: 10px;" :model="dataForm" @submit.native.prevent>
            <el-form-item>
                <el-input v-model="bullay" placeholder="模糊搜索" clearable @keyup.enter.native="searchEnterFun()"
                    ref="searchInput"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button class="filter-item" size="mini" type="success" icon="el-icon-search"
                    @click="getDataList">查询</el-button>
                <el-button size="mini" class="filter-item" type="warning" icon="el-icon-download"
                    @click="exportData">导出</el-button>
            </el-form-item>
            <el-form-item>
                <el-button class="filter-item" size="mini" type="success" icon="el-icon-plus"
                    @click="addOrUpdateHandle()">新增</el-button>
            </el-form-item>
        </el-form>
        <!-- <el-form :inline="true">
            <el-button class="filter-item" size="mini" type="success" @click="uploug('湖南')">湖南</el-button>
            <el-button class="filter-item" size="mini" type="success" @click="uploug('湖北')" >湖北</el-button>
            <el-form-item>
                <el-input v-model="dataForm2.file" placeholder="选择文件" readonly></el-input>
                <input type="file" ref="fileInput" style="display: none" @change="handleFileUpload">
            </el-form-item>
            <el-form-item>
                <el-button type="primary" :disabled="disablede" @click="openFileInput">选择文件</el-button>
                <el-button type="success" :disabled="disablede" @click="uploadFile">导入</el-button>
            </el-form-item>
        </el-form> -->
        <!-- 站点排序 -->
        <el-table ref="table" v-loading="dataListLoading" :data="currentData" style="width: 100%;">
            <el-table-column :show-overflow-tooltip="true" align="center" prop="areaName" label="区域" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="wlSiteCode" label="光明站点code" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="wlSiteName" width="180" label="光明站点" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="factoryProductCode" label="光明产品编号" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="factoryProductName" width="300"
                label="光明产品名称" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="days" label="第几天到货" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="sheets" label="sheet编号" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="dates" label="特殊到货规则" />
            <el-table-column header-align="center" align="center" width="150" label="操作">
                <template slot-scope="scope">
                    <el-button type="text" size="small"
                        @click="addOrUpdateHandle(scope.row.id, scope.row)">修改</el-button>
                    <el-button type="text" size="small" @click="deleteHandle(scope.row.id)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination style="width: 90%; margin: 0 auto; " @size-change="sizeChangeHandle" ref="pagination"
            @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[20, 40, 60, 80, 100, 1000]"
            :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="dataList.length">
        </el-pagination>
        <!-- 表单弹窗, 新增数据和修改数据 -->
        <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @close="addOrUpdateVisible = false"
            @refreshDataList="getDataList"></add-or-update>
    </div>
</template>

<script>
import * as api from '@/api/frame/customer.js'
import AddOrUpdate from './BrightLogisTime-add-updata'
import {
    exportExcel
} from './BrightLogisTimeExpro.js'
export default {
    name: 'wl-page',
    components: {
        AddOrUpdate,
    },
    data() {
        return {
            msg: 'wl-page',
            disablede: true,
            dataForm2: {
                file: '',
            },
            dataForm: {

            },

            upList: {
                area_name: '',
                formData: ''
            },
            area_name: '',
            dataList: [],
            childMessage: '',
            dataListLoading: false,
            bullay: '',
            addOrUpdateVisible: false,
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
        uploug(area) {
            this.disablede = false
            this.area_name = area
        },
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
                formData.append("area_name", this.area_name);
                api.importproCycleAPi(formData).then(res => {
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

                exportExcel(this.dataList, '光明站点产品到货周期表.xlsx')

            })
        },
        // 新增 / 修改
        addOrUpdateHandle(id, data) {
            this.addOrUpdateVisible = true
            this.$nextTick(() => {
                this.$refs.addOrUpdate.init(id, data)
            })
        },
        getDataList() {
            this.dataListLoading = true
            api.wlFacteprocheckApi(this.dataForm).then(res => {
                this.dataList = res
                // 过滤数据  
                this.dataList = this.dataList.filter(item =>
                    (item.areaName && item.areaName.includes(this.bullay)) ||
                    (item.wlSiteName && item.wlSiteName.includes(this.bullay)) ||
                    (item.factoryProductName && item.factoryProductName.includes(this.bullay))
                );
                this.currentData = {
                    ...this.dataList
                };
                this.sizeChangeHandle(this.pageSize);
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
                api.wlFacteprodelApi(ids).then(res => {
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