<template>
    <div class='SpecialCycleSetOther'>
        <el-form :inline="true" style="margin-top: 10px;" @submit.native.prevent>
            <el-form-item>
                <el-button class="filter-item" size="mini" type="success" @click="addOrUpdateHandle()">新增</el-button>
                <el-form-item>
                    <el-input v-model="bullay" placeholder="模糊搜索" clearable @keyup.enter.native="searchEnterFun()"
                        ref="searchInput"></el-input>
                </el-form-item>
                <el-button class="filter-item" size="mini" type="success" icon="el-icon-search"
                    @click="getDataList">查询</el-button>
                <el-button size="mini" class="filter-item" type="warning" icon="el-icon-download"
                    @click="exportData">导出</el-button>
            </el-form-item>
        </el-form>
        <el-form :inline="true">
            <el-form-item>
                <el-button class="filter-item" size="mini" type="success" @click="uploug('贵州')">贵州</el-button>
                <el-button class="filter-item" size="mini" type="success" @click="uploug('云南')">云南</el-button>
            </el-form-item>
            <!-- <el-button class="filter-item" size="mini" type="success" @click="uploug('广东')">广东</el-button> -->
            <el-form-item>
                <el-input v-model="dataForm2.file" placeholder="选择文件" readonly></el-input>
                <input type="file" ref="fileInput" style="display: none" @change="handleFileUpload">
            </el-form-item>
            <el-form-item>
                <el-button type="primary" :disabled="disablede" @click="openFileInput">选择文件</el-button>
                <el-button type="success" :disabled="disablede" @click="uploadFile">导入</el-button>
            </el-form-item>
        </el-form>
        <el-table ref="table" v-loading="dataListLoading" :data="currentData" style="width: 100%;">
            <el-table-column :show-overflow-tooltip="true" align="center" prop="areaName" label="区域" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="wlSiteCode" label="站点code" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="wlSiteName" label="站点名称" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="factoryProductCode" label="产品编码" />
            <el-table-column :show-overflow-tooltip="true" align="center" width="350" prop="factoryProductName"
                label="产品名称" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="days" label="到货周期" />
            <el-table-column :show-overflow-tooltip="true" align="center"  prop="sheets" label="sheets编号" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="dates" label="运行时间" />
            <el-table-column header-align="center" align="center" width="150" label="操作">
                <template slot-scope="scope">
                    <el-button type="text" size="small"
                        @click="addOrUpdateHandle(scope.row.id, scope.row)">修改</el-button>
                    <el-button type="text" size="small" @click="deleteHandle(scope.row.id)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination @size-change="sizeChangeHandle" ref="pagination" @current-change="handleCurrentChange"
            :current-page="currentPage" :page-sizes="[20, 40, 60, 80, 100, 1000]" :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper" :total="dataList.length">
        </el-pagination>
        <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @close="addOrUpdateVisible = false"
            @refreshDataList="getDataList"></add-or-update>
    </div>
</template>

<script>
import * as api from '@/api/frame/customer.js'
import AddOrUpdate from './SpecialCycleSetOther-add-updata'
import {
    exportExcel
} from './SpecialCycleSetOtherExpro.js'
export default {
    name: 'SpecialCycleSetOther-page',
    components: {
        AddOrUpdate
    },
    data() {
        return {
            msg: 'SpecialCycleSetOther-page',
            addOrUpdateVisible: false,
            bullay: '',
            dataList: [],
            dataListHis: [],
            exportList: [],
            currentData: [],
            currentPage: 1,
            pageSize: 20,
            totalItems: 0,
            dataListLoading: false,
            dataForm2: {
                file: '',
            },
            upList: {
                area_name: '',
                formData: ''
            },
            area_name: '',
            disablede: true,
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
                console.log(formData, 'formData')

                api.importproCycleSpaceaddAPi(formData).then(res => {
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
                api.WLSetOtherdelAPI(ids).then(res => {
                    // TODO 处理删除
                    this.$emit('refreshDataList')
                    this.$emit('close')
                    this.$message.success('删除成功')
                    this.getDataList()
                })
            })
        },
        getDataList() {
            api.WLSetOtherAPI().then(res => {
                console.log(res, 'res')
                this.dataList = res
                this.dataList = this.dataList.filter(item =>
                    (item.areaName && item.areaName.includes(this.bullay)) ||
                    (item.factoryProductCode && item.factoryProductCode.includes(this.bullay)) ||
                    (item.wlSiteName && item.wlSiteName.includes(this.bullay))
                );
                this.currentData = {
                    ...this.dataList
                };
                this.sizeChangeHandle(this.pageSize);
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
        exportData() {
            this.$confirm('是否导出表格数据到Excel?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                exportExcel(this.dataList, '特殊规则表.xlsx')
            })
        },
    }
};
</script>

<style scoped lang="scss"></style>