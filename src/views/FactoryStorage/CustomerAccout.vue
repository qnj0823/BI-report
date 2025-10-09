<template>
    <div class='accout'>
        <el-form :inline="true" style="width: 80%; margin: 10px auto;">
            <el-form-item>
                <el-input v-model="dataForm.blurry" placeholder="模糊查询" clearable @keyup.enter.native="searchEnterFun()"
                    ref="searchInput"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button class="filter-item" size="mini" type="success" icon="el-icon-search"
                    @click="getDataListOne">查询</el-button>
            </el-form-item>
            <!-- <el-form-item>
                <el-button class="filter-item" size="mini" type="success" @click="getDataList1">营销一部</el-button>
                <el-button class="filter-item" size="mini" type="success" @click="getDataList2">营销二部</el-button>
                <el-button class="filter-item" size="mini" type="success" @click="getDataList3">营销三部</el-button>
                <el-button class="filter-item" size="mini" type="success" @click="getDataList4">营销四部</el-button>
                <el-button class="filter-item" size="mini" type="success" @click="getDataList5">营销五部</el-button>
                <el-button class="filter-item" size="mini" type="success" @click="getDataListbig">大客户部</el-button>
            </el-form-item> -->

            <el-button size="mini" class="filter-item" type="warning" icon="el-icon-download"
                @click="exportData">导出</el-button>
        </el-form>

        <el-table class="table" ref="table" border :data="currentData" v-loading="dataListLoading"
            style="width: 80%; margin: 0 auto; margin-bottom: 50px;">
            <el-table-column :show-overflow-tooltip="true" align="center" prop="levelName1" label="战区" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="levelName2" label="销售区域/省区" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="levelName3" label="分公司/办事处" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="custName" label="客户营业执照" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="cuName" label="站点" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="username" label="一级账号" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="twousername" label="下级账号" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="twocuname" label="下级站点" />
        </el-table>
        <el-pagination style="width: 80%; margin: 0 auto; " @size-change="sizeChangeHandle" ref="pagination"
            @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[20, 40, 60, 80, 100, 1000]"
            :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="dataList.length">
        </el-pagination>
    </div>
</template>

<script>
import * as api from '@/api/factory/PutStorage.js'
import * as echarts from 'echarts';
import { data } from 'vue-echarts';
import {
    exportExcel
} from './CustomerAccoutExpor.js'
export default {
    name: 'accout-page',
    data() {
        return {
            msg: 'accout-page',
            dataListLoading: false,
            dataForm: {
                blurry: ''
            },
            dataList: [],
            dataList1: [],
            dataList2: [],
            dataList3: [],
            dataList4: [],
            dataList5: [],
            dataListbig: [],
            currentData: [],
            currentPage: 1,
            pageSize: 20,
            totalItems: 0,

        };
    },
    mounted() {
        const accoutList = sessionStorage.getItem('accout');
        if (accoutList) {
            const accoutList1 = JSON.parse(accoutList);
            this.dataList = accoutList1
            this.currentData = {
                ...this.dataList
            };
            this.sizeChangeHandle(this.pageSize);
        } else {
            this.getDataListOne()
        }


    },
    methods: {
        exportData() {
            this.$confirm('是否导出表格数据到Excel?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {

                exportExcel(this.dataList, '客户站点账号表.xlsx')

            })
        },
        getDataListOne() {
            this.dataListLoading = true
            api.LevelAccountone(this.dataForm).then(res => {
                this.dataList = res
                this.dataList.forEach(item => {
                    const levels = item.levelName.split(' -> ');
                    item.levelName1 = levels[0] || "";
                    // 去掉 levelName2 中的数字  
                    item.levelName2 = levels[1] ? levels[1].replace(/\d+/g, '').trim() : "";
                    item.levelName3 = levels[2] || "";
                });
                // // 定义 levelName1 的自定义顺序  
                const levelOrder = [
                    '营销一部',
                    '营销二部',
                    '营销三部',
                    '营销四部',
                    '营销五部',
                    '营销六部',
                    '营销七部',
                    '营销八部',
                    '大客户部'
                ];

                // 创建一个 mapping 以便于比较  
                const orderMap = {};
                levelOrder.forEach((level, index) => {
                    orderMap[level] = index;
                });

                // 排序  
                this.dataList.sort((a, b) => {
                    // 首先按 levelName1 的自定义顺序排序  
                    const levelComparison = orderMap[a.levelName1] - orderMap[b.levelName1];
                    if (levelComparison !== 0) {
                        return levelComparison;
                    }

                    // 如果 levelName1 相同，按 levelName2 排序  
                    if (a.levelName2 < b.levelName2) {
                        return -1;
                    }
                    if (a.levelName2 > b.levelName2) {
                        return 1;
                    }

                    // 如果 levelName1 和 levelName2 都相同，再按 levelName3 字段排序  
                    if (a.levelName3 < b.levelName3) {
                        return -1;
                    }
                    if (a.levelName3 > b.levelName3) {
                        return 1;
                    }

                    return 0; // 完全相同  
                });

                // 若在 Vue 中，确保视图更新  
                this.dataList = [...this.dataList]; // 触发视图更新  

                console.log(this.dataList);

                this.currentData = {
                    ...this.dataList
                };
                this.dataListLoading = false
                this.sizeChangeHandle(this.pageSize);
                sessionStorage.setItem('accout', JSON.stringify(this.dataList));
                console.log(this.dataList)
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

<style scoped lang="scss">
::v-deep .table .el-table__cell {
    padding: 2px !important;

}

;

::v-deep th.el-table__cell>.cell {
    padding: 0px !important;
}

;

::v-deep .el-table__header-wrapper {
    font-size: 15px;
    background: #f5f7fa;
}


::v-deep .el-table th {
    background: #f5f7fa;
}
</style>