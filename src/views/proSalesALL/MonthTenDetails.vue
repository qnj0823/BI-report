<template>
    <div class='tenD'>
        <el-form :inline="true" style="width: 65%; margin: 0 auto;">
            <el-button size="mini" class="filter-item" type="warning" icon="el-icon-download"
                @click="exportData">导出</el-button>
        </el-form>

        <el-table class="table" ref="table" border :data="currentData" v-loading="dataListLoading"
            style="width: 65%; margin: 0 auto; margin-bottom: 50px;">
            <el-table-column :show-overflow-tooltip="true" align="center" prop="ocustomerClass_name" label="单位体" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="cSiteName" label="站点" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="oldbox" label="老品" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="newbox" label="新品" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="otherbox" label="其它" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="box" label="小计" />
        </el-table>
        <el-pagination style="width: 65%; margin: 0 auto; " @size-change="sizeChangeHandle" ref="pagination"
            @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[20, 40, 60, 80, 100, 1000]"
            :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="dataList.length">
        </el-pagination>
    </div>
</template>

<script>
import * as api from '@/api/frame/customer.js'
import {
    exportExcel
} from './MonthTenDetailsExpro.js'
export default {
    name: 'tenD-page',
    data() {
        return {
            dataListLoading: false,
            dataList: [],
            result: [],
            chartList: [],
            dataForm: {
                p_vouchdatestart: '',
                p_vouchdateend: '',
                p_orgname: ''
            },
            dataListLoading: false,
            dataList: [],
            currentData: [],
            currentPage: 1,
            pageSize: 20,
            totalItems: 0,
        };
    },
    mounted() {
        this.dataForm.p_orgname = this.$route.query.param1;
        this.dataForm.p_vouchdatestart = this.$route.query.startdate;
        this.dataForm.p_vouchdateend = this.$route.query.enddata;
        this.getDataList()
    },
    methods: {
        exportData() {
            this.$confirm('是否导出表格数据到Excel？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {

                exportExcel(this.dataList, '前十单位体销量表.xlsx')

            })
        },
        getDataList() {
            this.dataListLoading = true
            api.monthTensite(this.dataForm).then(res => {
                this.dataList = res
                // 指定需要累加的字段
                const fieldsToSum = ['box', 'newbox', 'oldbox', 'otherbox'];

                // 使用 reduce 方法计算合计
                const total = this.dataList.reduce((acc, obj) => {
                    fieldsToSum.forEach(field => {
                        // 确保将字段值转换为数字再进行累加 
                        const currentValue = Number(obj[field]) || 0; // 确保转换为数字 
                        acc[field] = (acc[field] || 0) + currentValue;
                    });
                    return acc;
                }, {});

                // 创建合计对象
                const totalObject = { ocustomerClass_name: "合计", ...total };

                // 将合计对象添加到原数组中
                this.dataList.push(totalObject);

                this.dataList = this.dataList.map(item => {
                    // 创建一个新的对象以保持原始的 name 字段 
                    const newItem = { ocustomerClass_name: item.ocustomerClass_name,cSiteName:item.cSiteName }; // 遍历对象的每个字段 
                    for (const key in item) {
                        if (key !== 'ocustomerClass_name' &&key !== 'cSiteName') { // 排除 name 字段 
                            const numericValue = Number(item[key]); // 转换为数字 //只在转换成功时保留两位小数 
                            newItem[key] = !isNaN(numericValue) ? numericValue.toFixed(0) : ''; // 可以选择默认值 
                        }
                    }
                    return newItem; // 返回新对象
                });
                this.dataListLoading = false
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