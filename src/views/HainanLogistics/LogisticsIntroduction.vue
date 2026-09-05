<template>
    <div class='LogisticsIntroduction'>
        <el-form :inline="true" style="margin-top: 10px;" :model="dataForm" @submit.native.prevent>
            <el-form-item>
                <el-input v-model="bullay" placeholder="模糊搜索" clearable @keyup.enter.native="searchEnterFun()"
                    ref="searchInput"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button class="filter-item" size="mini" type="success" icon="el-icon-search"
                    @click="getDataList()">查询</el-button>
                <el-button size="mini" class="filter-item" type="warning" icon="el-icon-download"
                    @click="exportData">导出</el-button>
                <el-button size="mini" class="filter-item" type="warning" icon="el-icon-download"
                    @click="exportDatatest">导入模板下载</el-button>
            </el-form-item>
            <el-form>
                <el-form-item>
                    <el-button class="filter-item" size="mini" type="success" :disabled="disablede"
                        @click="uploug('湖南')">湖南</el-button>
                    <el-button class="filter-item" size="mini" type="success" :disabled="disablede"
                        @click="uploug('湖北')">湖北</el-button>
                    <el-button class="filter-item" size="mini" type="success" :disabled="disablede"
                        @click="uploug('四川')">四川</el-button>
                    <el-button class="filter-item" size="mini" type="success" :disabled="disablede"
                        @click="uploug('云南')">云南</el-button>
                    <el-button class="filter-item" size="mini" type="success" :disabled="disablede"
                        @click="uploug('贵州')">贵州</el-button>
                    <el-button class="filter-item" size="mini" type="success" :disabled="disablede"
                        @click="uploug('重庆')">重庆</el-button>
                    <el-button class="filter-item" size="mini" type="success" :disabled="disablede"
                        @click="uploug('江西')">江西</el-button>
                    <el-button class="filter-item" size="mini" type="success" :disabled="disablede"
                        @click="uploug('安徽')">安徽</el-button>
                    <el-button class="filter-item" size="mini" type="success" :disabled="disablede"
                        @click="uploug('河南')">河南</el-button>
                    <el-button class="filter-item" size="mini" type="success" :disabled="disablede"
                        @click="uploug('陕西')">陕西</el-button>
                    <el-button class="filter-item" size="mini" type="success" :disabled="disablede"
                        @click="uploug('福建')">福建</el-button>
                    <el-button class="filter-item" size="mini" type="success" :disabled="disablede"
                        @click="uploug('江苏')">江苏</el-button>
                    <el-button class="filter-item" size="mini" type="success" :disabled="disablede"
                        @click="uploug('浙江')">浙江</el-button>
                    <el-button class="filter-item" size="mini" type="success" :disabled="disablede"
                        @click="uploug('广西')">广西</el-button>
                </el-form-item>

                <el-form-item>
                    <el-input v-model="dataForm2.file" placeholder="选择文件" clearable readonly></el-input>
                    <input type="file" ref="fileInput" style="display: none" @change="handleFileUpload">
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" :disabled="disabledeAD" @click="openFileInput">选择文件</el-button>
                    <el-button type="success" :disabled="disabledeAD" @click="HandleuploadFile">导入</el-button>
                </el-form-item>
            </el-form>

            <el-table ref="table" v-loading="dataListLoading" :data="currentData" style="width: 100%;">
                <el-table-column :show-overflow-tooltip="true" align="center" width="100" prop="planDeliveryDate"
                    label="发货日期" />
                <el-table-column :show-overflow-tooltip="true" align="center" prop="orgLevel1" label="一级组织" />
                <el-table-column :show-overflow-tooltip="true" align="center" prop="orgLevel2" label="二级组织" />
                <el-table-column :show-overflow-tooltip="true" align="center" prop="orgLevel3" width="180"
                    label="三级组织" />
                <el-table-column :show-overflow-tooltip="true" align="center" prop="region" width="180" label="区域" />
                <el-table-column :show-overflow-tooltip="true" align="center" prop="totalQuantity" label="合计-件" />
                <el-table-column :show-overflow-tooltip="true" align="center" prop="totalWeightTon" label="合计-吨" />
                <el-table-column :show-overflow-tooltip="true" align="center" prop="product950gLuche"
                    label="950G常温噜渴" />
                <el-table-column :show-overflow-tooltip="true" align="center" prop="product950gLucheBanquet"
                    label="950G常温噜渴(宴席）" />
                <el-table-column :show-overflow-tooltip="true" align="center" prop="product300gLuche"
                    label="300G常温噜渴" />
                <el-table-column :show-overflow-tooltip="true" align="center" prop="product300mlLucheBanquet"
                    label="300ML常温噜渴(宴席)" />
                <el-table-column :show-overflow-tooltip="true" align="center" prop="product1lCoconutMilk"
                    label="1L椰子牛乳" />
                <el-table-column :show-overflow-tooltip="true" align="center" prop="product300mlcurcuma"
                    label="300ML姜黄" />
                <el-table-column :show-overflow-tooltip="true" align="center" prop="product300mlCurcuma"
                    label="380ML双柚汁" />
                <el-table-column :show-overflow-tooltip="true" align="center" prop="product135lDoublePlum"
                    label="1.35ML双柚汁" />
                <el-table-column :show-overflow-tooltip="true" align="center" prop="product380mlOrange"
                    label="380ML橙汁" />
                <el-table-column :show-overflow-tooltip="true" align="center" prop="product135lOrange"
                    label="1.35ML橙汁" />
                <el-table-column :show-overflow-tooltip="true" align="center" prop="product380mlCoconutWater"
                    label="380ML椰子水" />
                <el-table-column :show-overflow-tooltip="true" align="center" prop="product1lCoconutWater"
                    label="1L椰子水" />
                <el-table-column :show-overflow-tooltip="true" align="center" prop="product900mlPineappleMango"
                    label="900M菠萝芒果" />
                <el-table-column :show-overflow-tooltip="true" align="center" prop="product300mlPineappleMango"
                    label="300ML菠萝芒果" />
                <el-table-column :show-overflow-tooltip="true" align="center" prop="product900mlApple"
                    label="900ML苹果汁" />
                <el-table-column :show-overflow-tooltip="true" align="center" prop="product300mlApple"
                    label="300ML苹果汁" />
                <el-table-column :show-overflow-tooltip="true" align="center" prop="product300gAloe" label="300G芦荟汁" />
                <el-table-column :show-overflow-tooltip="true" align="center" prop="product300gHawthorn"
                    label="300G山楂汁" />
                <el-table-column :show-overflow-tooltip="true" align="center" prop="product1lLucheCoconut"
                    label="1L噜渴椰汁" />
                <el-table-column :show-overflow-tooltip="true" align="center" prop="product125lLucheCoconutBanquet"
                    label="1.25L噜渴椰汁（宴席）" />
                <el-table-column :show-overflow-tooltip="true" align="center" prop="product125lLucheCoconut"
                    label="1.25L噜渴椰汁" />
                <el-table-column :show-overflow-tooltip="true" align="center" prop="product300mlLucheCoconut"
                    label="300ML噜渴椰汁" />
                <el-table-column :show-overflow-tooltip="true" align="center" prop="product245mlLucheCoconut"
                    label="245ML噜渴椰汁" />
                <el-table-column :show-overflow-tooltip="true" align="center" prop="product280gLuche"
                    label="280G常温噜渴" />
                <el-table-column :show-overflow-tooltip="true" align="center" prop="product185mlLucheOffline"
                    label="185ML常温噜渴(线下)" />
                <el-table-column :show-overflow-tooltip="true" align="center" prop="product185mlLucheOnline"
                    label="185ML常温噜渴(线上)" />
                <el-table-column :show-overflow-tooltip="true" align="center" prop="product720gLuche"
                    label="720g常温噜渴" />
                <el-table-column :show-overflow-tooltip="true" align="center" prop="product125lLuche"
                    label="1.25L常温噜渴" />
                <el-table-column :show-overflow-tooltip="true" align="center" prop="product125lLuche"
                    label="320ML椰子水(1*15)" />
                <el-table-column :show-overflow-tooltip="true" align="center" prop="product125lLuche"
                    label="320ML椰子水(1*24)" />
                <el-table-column :show-overflow-tooltip="true" align="center" prop="product125lLuche"
                    label="920ML椰子水" />
                <el-table-column :show-overflow-tooltip="true" align="center" prop="product125lLuche" label="950G芦荟汁" />
                <el-table-column :show-overflow-tooltip="true" align="center" prop="product125lLuche" label="950G山楂汁" />
                <el-table-column header-align="center" align="center" width="150" label="操作">
                    <template slot-scope="scope">
                        <el-button type="text" size="small"
                            @click="addOrUpdateHandle(scope.row.id, scope.row)">修改</el-button>
                        <el-button type="text" size="small" @click="deleteHandle(scope.row.id)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination style="width: 90%; margin: 0 auto; " @size-change="sizeChangeHandle" ref="pagination"
                @current-change="handleCurrentChange" :current-page="currentPage"
                :page-sizes="[20, 40, 60, 80, 100, 1000]" :page-size="pageSize"
                layout="total, sizes, prev, pager, next, jumper" :total="dataList.length">
            </el-pagination>
        </el-form>
        <!-- 选出导出类型弹窗 -->
        <AddUpdate v-if="addUpdateVisible" ref="addUpdate" @close="addUpdateVisible = false"
            @select-type="handleReceiveType">
        </AddUpdate>
    </div>
</template>

<script>
import AddUpdate from './Logis-add-updata'
import * as api from '@/api/frame/customer.js'
import {
    exportExcel
} from './LogisticsIntroductionExpro.js'
export default {
    components: {
        AddUpdate
    },
    name: 'LogisticsIntroduction-page',
    data() {
        return {
            msg: 'LogisticsIntroduction-page',
            disablede: true,
            disabledeAD: true,
            addUpdateVisible: false,
            dataListLoading: false,
            types: '',
            bullay: '',
            dataList: [],
            currentData: [],
            currentPage: 1,
            pageSize: 20,
            totalItems: 0,
            dataForm2: {
                file: '',
            },
            dataForm: {
            },
        };
    },
    mounted() {
        this.getDateTime()
        this.getDataList()
    },
    methods: {
        getDataList() {
            this.dataListLoading = true
            api.tracAmbientOrder(this.dataForm).then(res => {
                this.dataList = res
                console.log(this.dataList, 'this.dataList')
                // 过滤数据  
                this.dataList = this.dataList.filter(item =>
                    (item.orgLevel1 && item.orgLevel1.includes(this.bullay)) ||
                    (item.orgLevel2 && item.orgLevel2.includes(this.bullay)) ||
                    (item.orgLevel3 && item.orgLevel3.includes(this.bullay)) ||
                    (item.planDeliveryDate && item.planDeliveryDate.includes(this.bullay))
                );
                this.currentData = {
                    ...this.dataList
                };
                this.sizeChangeHandle(this.pageSize);
                console.log(this.currentData)
                this.dataListLoading = false
            })
        },
        exportData() {
            this.$confirm('是否导出表格数据到Excel?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {

                exportExcel(this.dataList, '常温数据.xlsx')

            })
        },
        getDateTime() {
            // 获取当前日期
            const now = new Date('2026-04-20');
            this.$nextTick(() => {
                // 当月几号
                const day = now.getDate();
                console.log(day, 'day')

                // 判断：15号 或者 20-25号
                const isEnable = day == 15 || (day >= 20 && day <= 25);
                console.log(isEnable, 'isEnable')

                this.disablede = !isEnable;
            });
        },
        handleReceiveType(type) {
            if (type) {
                this.disabledeAD = false
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
        HandleuploadFile() {
            if (this.types == '覆盖') {
                this.uploadFile('importAmbientOrderAPi')
            } else if (this.types == '追加') {
                this.uploadFile('importAmbientOrderinsertAPi')
            }
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
        exportDatatest(){
            window.open('http://bi.yufanjtbip.com:8069/file/%E6%96%87%E6%A1%A3/常温填报模板.xlsx')
        },
        //导入
        uploadFile(API) {
            this.dataListLoading = true
            if (this.dataForm2.file) {
                let formData = new FormData();
                console.log(this.files)
                if (this.types == '覆盖') {
                    formData.append("area_name", this.area_name);
                }
                formData.append("file", this.files);

                console.log(formData, 'formData')

                api[API](formData).then(res => {
                    this.$message.success('导入成功')
                    this.dataListLoading = false
                    this.clearFileData()
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
        clearFileData() {
            this.dataForm2.file = ''
            // 清空原生file
            this.$refs.fileInput.value = ''
            this.selectFile = null
            this.disabledeAD = true
            // 替换 this.$refs.formRef?.clearValidate()
            // if (this.$refs.formRef) {
            //     this.$refs.formRef.clearValidate()
            // }
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
                api.wltrackAmbientOrderdelAPI(ids).then(res => {
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