<template>
    <div class='profile'>
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
        </el-form>
        <el-table ref="table" v-loading="dataListLoading" :data="currentData" style="width: 100%;">
            <el-table-column :show-overflow-tooltip="true" align="center" prop="levelName1" label="战区" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="levelName2" label="销售区域/省区" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="pkCustclassName" label="分公司/办事处" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="name" label="客户名称" />
            <el-table-column prop="def1Name" align="center" label="客户站点" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="def5Name" label="销量区域" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="def3Name" label="物流站点" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="def6Name" label="光明站点" />
            <!-- <el-table-column :show-overflow-tooltip="true" align="center" prop="def17Name" label="所属性质" /> -->
            <el-table-column :show-overflow-tooltip="true" align="center" prop="pkAreaclName" label="地区分类" />
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
} from './fracussiteExpro.js'
export default {
    name: 'ceshi-page',
    data() {
        return {
            constants: this.$constants,
            msg: 'ceshi-page',
            dataForm: {
                blurry: '',
                page: 0,
                size: this.$constants.page.limit[0],
                sort: '',
            },
            dataForm1: {
                blurry: '',
            },
            bullay: '',
            dataListLoading: false,
            dataList: [],
            exportList: [],
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
        getDataList() {
            this.dataListLoading = true
            api.SiteallCustomer(this.dataForm1).then(res => {
                this.dataList = res
                this.dataList.forEach(item => {
                    const levels = item.levelName.split(' -> ');
                    item.levelName1 = levels[0] || "";
                    // 去掉 levelName2 中的数字  
                    item.levelName2 = levels[1] ? levels[1].replace(/\d+/g, '').trim() : "";
                    item.levelName3 = levels[2] || "";
                });
                // 使用 map 方法和正则表达式提取字符  
                // this.dataList = this.dataList.map(item => {
                //     const match = item.pkAreaclName.match(/(.*?)省|(.+?)区/);
                //     return {
                //         ...item,
                //         pkAreaclName: match ? match[1] || match[2] : item.pkAreaclName // 提取匹配的省或区前面的字符  
                //     };
                // });
                this.dataList = this.dataList.map(item => {
                    // 匹配省、区或市，并包含在结果中  
                    const match = item.pkAreaclName.match(/(.*?)(省|市|区)/);
                    return {
                        ...item,
                        pkAreaclName: match ? `${match[1]}${match[2]}` : item.pkAreaclName // 提取匹配的省、市或区，包含省、市或区字  
                    };
                });

                // 过滤数据  
                this.dataList = this.dataList.filter(item =>
                    item.levelName1.toLowerCase().includes(this.bullay) ||
                    item.levelName2.toLowerCase().includes(this.bullay) ||
                    item.levelName3.toLowerCase().includes(this.bullay) ||
                    item.name.toLowerCase().includes(this.bullay) ||
                    item.def1Name.toLowerCase().includes(this.bullay) ||
                    item.def5Name.toLowerCase().includes(this.bullay) ||
                    item.def3Name.toLowerCase().includes(this.bullay) ||
                    item.def6Name.toLowerCase().includes(this.bullay)

                );
                this.currentData = {
                    ...this.dataList
                };
                this.sizeChangeHandle(this.pageSize);
                console.log(this.dataList)
                this.dataListLoading = false
            })

        },
        exportData() {
            this.$confirm('是否导出表格数据到Excel?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                exportExcel(this.dataList, '框架/客户/站点.xlsx')
                // this.dataListLoading = true
                // api.SiteallCustomer(this.dataForm1).then(res => {
                //     this.exportList = res
                //     this.exportList.forEach(item => {
                //         const levels = item.levelName.split(' -> ');
                //         item.levelName1 = levels[0] || "";
                //         // 去掉 levelName2 中的数字  
                //         item.levelName2 = levels[1] ? levels[1].replace(/\d+/g, '').trim() : "";
                //         item.levelName3 = levels[2] || "";
                //     });
                //     // 使用 map 方法和正则表达式提取字符  
                //     this.dataList = this.dataList.map(item => {
                //         const match = item.pkAreaclName.match(/(.*?)省|(.+?)区/);
                //         return {
                //             ...item,
                //             pkAreaclName: match ? match[1] || match[2] : item.pkAreaclName // 提取匹配的省或区前面的字符  
                //         };
                //     });
                //     // 过滤数据  
                //     this.exportList = this.exportList.filter(item =>
                //         item.levelName1.toLowerCase().includes(this.bullay) ||
                //         item.levelName2.toLowerCase().includes(this.bullay) ||
                //         item.levelName3.toLowerCase().includes(this.bullay) ||
                //         item.name.toLowerCase().includes(this.bullay) ||
                //         item.def1Name.toLowerCase().includes(this.bullay) ||
                //         item.def5Name.toLowerCase().includes(this.bullay) ||
                //         item.def3Name.toLowerCase().includes(this.bullay) ||
                //         item.def6Name.toLowerCase().includes(this.bullay)

                //     );
                //     this.dataListLoading = false
                //     console.log(this.exportList)
                //     // return
                //     exportExcel(this.exportList, '框架/客户/站点.xlsx')
                // })
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