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
        <el-form :inline="true">
            <el-form-item>
                <el-button class="filter-item" size="mini" type="success" @click="uploug('湖南')">湖南</el-button>
                <el-button class="filter-item" size="mini" type="success" @click="uploug('湖北')">湖北</el-button>
                <el-button class="filter-item" size="mini" type="success" @click="uploug('四川')">四川</el-button>
                <el-button class="filter-item" size="mini" type="success" @click="uploug('云南')">云南</el-button>
                <el-button class="filter-item" size="mini" type="success" @click="uploug('贵州')">贵州</el-button>
                <el-button class="filter-item" size="mini" type="success" @click="uploug('重庆')">重庆</el-button>
                <el-button class="filter-item" size="mini" type="success" @click="uploug('江西')">江西</el-button>
                <el-button class="filter-item" size="mini" type="success" @click="uploug('安徽')">安徽</el-button>
                <el-button class="filter-item" size="mini" type="success" @click="uploug('河南')">河南</el-button>
                <el-button class="filter-item" size="mini" type="success" @click="uploug('陕西')">陕西</el-button>
                <el-button class="filter-item" size="mini" type="success" @click="uploug('福建')">福建</el-button>
                <el-button class="filter-item" size="mini" type="success" @click="uploug('江苏')">江苏</el-button>
                <el-button class="filter-item" size="mini" type="success" @click="uploug('浙江')">浙江</el-button>
                <el-button class="filter-item" size="mini" type="success" @click="uploug('广西')">广西</el-button>
            </el-form-item>
            <!-- <el-button class="filter-item" size="mini" type="success" @click="uploug('广东')">广东</el-button> -->
            <el-form-item>
                <el-input v-model="dataForm2.file" placeholder="选择文件" readonly></el-input>
                <input type="file" ref="fileInput" style="display: none" @change="handleFileUpload">
            </el-form-item>
            <el-form-item>
                <el-button type="primary" :disabled="disablede" @click="openFileInput">选择文件</el-button>
                <el-button type="success" :disabled="disablede" @click="HandleuploadFile">导入</el-button>
            </el-form-item>
        </el-form>
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
        <!-- 选出导出类型弹窗 -->
        <AddUpdate v-if="addUpdateVisible" ref="addUpdate" @close="addUpdateVisible = false"
            @select-type="handleReceiveType">
        </AddUpdate>
    </div>
</template>

<script>
import * as api from '@/api/frame/customer.js'
import AddOrUpdate from './BrightLogisTime-add-updata'
import AddUpdate from './Brig-add-updata'
import {
    exportExcel
} from './BrightLogisTimeExpro.js'
export default {
    name: 'wl-page',
    components: {
        AddOrUpdate,
        AddUpdate
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
            addUpdateVisible: false,
            currentData: [],
            currentPage: 1,
            pageSize: 20,
            totalItems: 0,
            types: '',
            testList: []
        };
    },
    mounted() {
        this.getDataList()
    },
    methods: {
        handleReceiveType(type) {
            if (type) {
                this.disablede = false
                this.types = type
            }

        },
        uploug(area) {

            this.area_name = area
            this.addUpdateVisible = true
            this.$nextTick(() => {
                this.$refs.addUpdate.init(area)
            })
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

        HandleuploadFile() {
            this.uploadFileTest()
            if (this.testList) {
                const h = this.$createElement;
                this.$notify({
                    title: '提示报错',
                    message: h('i', { style: 'color: teal' }, '导入表格有重复项')
                });
                console.log('导入表格有重复项')
            } else {
                this.HandleuploadFiletest()
            }

        },
        HandleuploadFiletest() {
            if (this.types == '小月') {
                this.uploadFile('importproCycleAPi')
            } else if (this.types == '大月') {
                this.uploadFile('importproCyclemaxAPi')
            } else if (this.types == '追加') {
                this.uploadFile('importproCycleaddAPi')
            }
        },
        //导入
        uploadFile(API) {
            this.dataListLoading = true
            if (this.dataForm2.file) {
                let formData = new FormData();
                console.log(this.files)
                formData.append("file", this.files);
                formData.append("area_name", this.area_name);
                console.log(formData, 'formData')

                api[API](formData).then(res => {
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
        //导入测试表
        uploadFileTest() {
            this.dataListLoading = true
            if (this.dataForm2.file) {
                let formData = new FormData();
                console.log(this.files)
                formData.append("file", this.files);

                api.importTestAPi(formData).then(res => {
                    console.log(res, 'res')
                    this.testList = res
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