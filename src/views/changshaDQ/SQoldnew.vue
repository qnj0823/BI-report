<template>
    <div class='old'>
        <el-form :inline="true" style="width: 75%; margin: 5px auto;">
            <el-button size="mini" class="filter-item" type="warning" icon="el-icon-download"
                @click="exportData">导出</el-button>
        </el-form>
        <el-table class="table" ref="table" border v-loading="dataListLoading" :data="currentData"
            style="width: 75%; margin: 0 auto; margin-bottom: 50px;">
            <el-table-column :show-overflow-tooltip="true" align="center" prop="sqname" label="销售区域/省区" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="sonname" label="分公司办事处" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="csitename" label="站点" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="oldbox" label="老品" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="oldrate" label="老品百分比" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="newbox" label="新品" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="newrate" label="新品百分比" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="otherbox" label="其它品" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="otherrate" label="其它品百分比" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="allbox" label="小计" />
        </el-table>
        <el-pagination style="width: 75%; margin: 0 auto; " @size-change="sizeChangeHandle" ref="pagination"
            @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[20, 40, 60, 80, 100, 1000]"
            :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="dataList.length">
        </el-pagination>
    </div>
</template>

<script>
import * as api from '@/api/frame/customer.js'
import {
    exportExcel
} from './SQoldnewExpro.js'
export default {
    name: 'old-page',
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
            rudepts: '',
            rujobs: ''
        };
    },
    mounted() {
        this.rujobs = this.$route.query.param1;
        this.dataForm.p_vouchdatestart = this.$route.query.startdate;
        this.dataForm.p_vouchdateend = this.$route.query.enddata;
        this.getDataList()
    },
    methods: {
        exportData() {
            this.$confirm('是否导出表格数据到Excel?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {

                exportExcel(this.dataList, '销售区域老/新品销量-站点.xlsx')

            })
        },
        getDataList() {
            this.dataListLoading = true
            api.newoldproductsite(this.dataForm).then(res => {
                this.dataList = res
                this.dataList.forEach(item => {
                    if (item.sqname) { // 检查 sqname 是否存在且非空  
                        item.sqname = item.sqname.replace(/\d+/g, '').trim(); // 替换数字并去除空格  
                    }
                });
                this.dataList = this.dataList.filter(item => item.sqname ===  this.rujobs);
                console.log(this.dataList, 'this.dataList')
                // 计算合计  
                const total = this.dataList.reduce((acc, item) => {
                    acc.oldbox += parseFloat(item.oldbox);
                    acc.newbox += parseFloat(item.newbox);
                    acc.allbox += parseFloat(item.allbox);
                    acc.otherbox += parseFloat(item.otherbox);
                    return acc;
                }, {
                    oldbox: 0,
                    newbox: 0,
                    allbox: 0,
                    otherbox: 0,
                });

                // 添加合计对象  
                const summary = {
                    sonname: '合计',
                    oldbox: total.oldbox.toFixed(0),
                    newbox: total.newbox.toFixed(0),
                    allbox: total.allbox.toFixed(0),
                    otherbox: total.otherbox.toFixed(0),
                };

                // 将合计对象添加到数据数组中  
                this.dataList.push(summary);
                this.dataList.forEach(item => {
                    item.oldbox = parseFloat(item.oldbox).toFixed(0); // 格式化 oldbox 
                    item.newbox = parseFloat(item.newbox).toFixed(0); // 格式化 newbox 
                    item.allbox = parseFloat(item.allbox).toFixed(0); // 格式化 allbox
                    item.otherbox = parseFloat(item.otherbox).toFixed(0) || 0; // 格式化 allbox
                });


                this.currentData = {
                    ...this.dataList
                };
                // 按照 sonname、sqname 和 cSiteName 排序  
                this.dataList.sort((a, b) => {
                    // 处理比较时确保处理了空值情况  
                    const classNameA = a.sonname || ''; // 默认值为空字符串  
                    const classNameB = b.sonname || ''; // 默认值为空字符串  
                    const nameA = a.sqname || ''; // 默认值为空字符串  
                    const nameB = b.sqname || ''; // 默认值为空字符串  

                    // 如果 cSiteName 是 "合计"，则确保其排到最后  
                    if (a.sonname === "合计") return 1;
                    if (b.sonname === "合计") return -1;

                    // 首先比较 sonname 
                    const classComparison = classNameA.localeCompare(classNameB);

                    // 如果 sonname 相同，则比较 sqname  
                    if (classComparison === 0) {
                        return nameA.localeCompare(nameB); // 次级排序  
                    }

                    return classComparison; // 返回 sonname 的比较结果  
                });

                this.dataListLoading = false;
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