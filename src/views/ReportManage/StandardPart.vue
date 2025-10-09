<template>
    <div class='profile'>
        <el-form :inline="true" style="margin-top: 10px;" :model="dataForm" @submit.native.prevent>
            <el-form-item>
                <el-input v-model="bullay" placeholder="模糊搜索" style="width: 185px;" clearable @keyup.enter.native="searchEnterFun()"
                    ref="searchInput"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button class="filter-item" size="mini" type="success" icon="el-icon-search"
                    @click="getDataList">查询</el-button>
                <el-button class="filter-item" size="mini" type="success" icon="el-icon-plus"
                    @click="addOrUpdateHandle()">新增分类</el-button>
                <el-button size="mini" class="filter-item" type="warning" icon="el-icon-download"
                    @click="exportData">导出</el-button>
            </el-form-item>
        </el-form>
        <el-form :inline="true" style="margin-top: 10px;" :model="dataForm" @submit.native.prevent>
            <el-form-item>
                <el-input v-model="dataForm2.file" placeholder="选择文件" readonly></el-input>
                <input type="file" ref="fileInput" style="display: none"  @change="handleFileUpload">
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
        <el-table ref="table" v-loading="dataListLoading" :data="currentData" style="width: 100%;">
            <el-table-column :show-overflow-tooltip="true" align="center" prop="productClassPname" label="大类" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="productClassName" label="小类" />
            <el-table-column prop="simplename" align="center" label="产品简称" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="name" label="产品名称" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="code" label="产品编号" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="converBox" label="换算单位（箱/盒）">
            </el-table-column>
            <el-table-column :show-overflow-tooltip="true" align="center" prop="converBigPiece" label="标准件转换">
            </el-table-column>
            <el-table-column :show-overflow-tooltip="true" align="center" prop="attribute" label="属性">
            </el-table-column>
            <el-table-column :show-overflow-tooltip="true" align="center" prop="def18Name" label="备注">
            </el-table-column>
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
            layout="total, sizes, prev, pager, next, jumper" :total="dataList.totalElements">
        </el-pagination>

        <!-- 表单弹窗, 新增数据和修改数据 -->
        <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @close="addOrUpdateVisible = false"
            @refreshDataList="getDataList"></add-or-update>
    </div>
</template>

<script>
import * as api from '@/api/management/management.js'
import AddOrUpdate from './StandardPart-add-update-add'
import {
    exportExcel
} from './StandardPartExpro.js'
import { data } from 'vue-echarts';
export default {
    components: {
        AddOrUpdate,
    },
    name: 'ceshi-page',
    data() {
        return {
            constants: this.$constants,
            msg: '管理部产品分类与标准件换算',
            dataForm: {
                page: 0,
                size: this.$constants.page.limit[0],
                sort: '',
            },
            dataForm1: {
                page: 0,
                size: 200,
                sort: '',
            },
            dataForm2: {
                file: '',
            },
            bullay: '',
            currentData: [],
            currentPage: 1,
            pageSize: 20,
            totalItems: 0,
            dataListLoading: false,
            dataList: [],
            exportList: [],
            addOrUpdateVisible: false,
        };
    },
    mounted() {
        this.getDataList()
    },
    methods: {
        //下载模板
        DownTemplate(){

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

                api.APIbasiIMPORT(formData).then(res => {
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
                api.APIbasiDEL(ids).then(res => {
                    // TODO 处理删除
                    this.$emit('refreshDataList')
                    this.$emit('close')
                    this.$message.success('删除成功')
                    this.getDataList()
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
        getDataList() {
            api.APIbasiCHECK(this.dataForm1).then(res => {
                this.dataList = res
                this.dataList.content.sort((a, b) => {
                    if (a.productClassPname === '其它') {
                        return 1; // a 是 '其他系列'，排到后面  
                    }
                    if (b.productClassPname === '其它') {
                        return -1; // b 是 '其他系列'，将 a 排到前面  
                    }
                    // 正常排序其余的系列  
                    if (a.productClassPname < b.productClassPname) {
                        return -1; // a 在 b 之前  
                    }
                    if (a.productClassPname > b.productClassPname) {
                        return 1; // a 在 b 之后  
                    }
                    return 0; // 相等  
                });
                // 过滤数据  
                this.dataList.content = this.dataList.content.filter(item =>
                    (item.productClassPname && item.productClassPname.toLowerCase().includes(this.bullay)) ||
                    (item.productClassName && item.productClassName.toLowerCase().includes(this.bullay)) ||
                    (item.simplename && item.simplename.toLowerCase().includes(this.bullay)) ||
                    (item.name && item.name.toLowerCase().includes(this.bullay))
                );
                this.currentData = {
                    ...this.dataList.content
                };
                this.sizeChangeHandle(this.pageSize);
                console.log(this.dataList)
                // this.dataListLoading = false
            })

        },
        exportData() {
            this.$confirm('是否导出表格数据到Excel?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                api.APIbasiCHECK(this.dataForm1).then(res => {
                    this.exportList = res
                    exportExcel(this.dataList.content, '标准件转换.xlsx')
                })

            })
        },
        // 每页数
        sizeChangeHandle(val) {
            this.pageSize = val;
            this.currentPage = 1;
            this.currentData = this.dataList.content.slice((this.currentPage - 1) * this.pageSize, this.currentPage * this
                .pageSize);
        },
        // 当前页
        handleCurrentChange(val) {
            console.log(val)
            this.currentPage = val;
            this.currentData = this.dataList.content.slice((val - 1) * this.pageSize, val * this.pageSize);
        },
    }
};
</script>

<style scoped lang="scss"></style>