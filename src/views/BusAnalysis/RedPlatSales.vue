<template>
    <div class='redsles'>
        <el-form :inline="true" style="width: 95%; margin: 0 auto;">
            <el-form-item>
                <el-date-picker v-model="dataForm.p_vouchdatestart" value-format="yyyy-MM-dd" type="date"
                    placeholder="开始日期" clearable style="width: 100%"></el-date-picker>
            </el-form-item>
            <el-form-item>
                <el-date-picker v-model="dataForm.p_vouchdateend" value-format="yyyy-MM-dd" type="date"
                    placeholder="结束日期" clearable style="width: 100%"></el-date-picker>
            </el-form-item>
            <el-form-item>
                <el-input v-model="bullay" placeholder="模糊搜索" clearable @keyup.enter.native="searchEnterFun()"
                    ref="searchInput"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button class="filter-item" size="mini" type="success" icon="el-icon-search"
                    @click="getdataList">查询</el-button>
            </el-form-item>
            <el-button size="mini" class="filter-item" type="warning" icon="el-icon-download"
                @click="exportData">导出</el-button>
        </el-form>
        <el-table ref="table" v-loading="dataListLoading" :data="currentData" max-height="600" style="width: 100%;">
            <el-table-column :show-overflow-tooltip="true" align="center" width="90" prop="vouchdate" label="单据日期" />
            <el-table-column :show-overflow-tooltip="true" align="center" width="190" prop="salesOrgName"
                label="销售组织" />
            <el-table-column :show-overflow-tooltip="true" align="center" width="200" prop="cOrderNo" label="订单号 " />
            <el-table-column :show-overflow-tooltip="true" align="center" width="130" prop="cName" label="客户" />
            <el-table-column :show-overflow-tooltip="true" align="center" width="130" prop="ocustomerClass_name"
                label="客户分类" />
            <el-table-column :show-overflow-tooltip="true" align="center" width="100" prop="red_name" label="红平台名称" />
            <el-table-column :show-overflow-tooltip="true" align="center" width="130" prop="cSiteName" label="站点名称" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="product_class_name" label="商品分类" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="cProductCode" label="商品编码" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="cProductName" label="商品名称" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="box" width="100" label="订单销售数量" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="cProductAuxUnitName" label="销售单位" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="nqtorigtaxprice" label="含税单价" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="norigdiscount" width="100"
                label="返利分摊金额" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="fPayMoney" width="150" label="订单含税金额" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="costsubs" width="130" label="分摊前金额" />
        </el-table>
        <el-pagination style="width: 90%; margin: 0 auto; " @size-change="sizeChangeHandle" ref="pagination"
            @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[20, 40, 60, 80, 100, 1000]"
            :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="dataList.length">
        </el-pagination>
    </div>
</template>

<script>
import * as api from '@/api/Business/analysis.js'
import {
    exportExcel
} from './RedPlatSalesExpro.js'
import { data } from 'vue-echarts';
export default {
    name: 'redsles-page',
    data() {
        return {
            dataForm: {
                p_vouchdateend: '',
                p_vouchdatestart: '',
                p_orgname: ''
            },
            bullay: '',
            dataListLoading: false,
            dataList: [],
            currentData: [],
            currentPage: 1,
            pageSize: 20,
            totalItems: 0,
        };
    },
    created() {
        this.calculateDates();
    },
    mounted() {
        this.getdataList()
    },
    methods: {
        //获取时间
        calculateDates() {
            const today = new Date();

            // 获取当前月份的月初时间 
            const startOfMonthDate = new Date(today.getFullYear(), today.getMonth(), 1);
            this.startOfMonth = this.formatDate(startOfMonthDate);

            // 获取截至今天的时间 
            this.endOfToday = this.formatDate(today);
            this.dataForm.p_vouchdatestart = this.startOfMonth
            this.dataForm.p_vouchdateend = this.endOfToday
        },
        formatDate(date) {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0'); // 月份从0开始，所以加1 
            const day = String(date.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
        },
        exportData() {
            this.$confirm('是否导出表格数据到Excel?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                exportExcel(this.dataList, '红平台订单统计表.xlsx')

            })
        },
        getdataList() {
            this.dataListLoading = true
            api.redplatformAPI(this.dataForm).then(res => {
                console.log(res)
                this.dataList = res
                this.dataList = this.dataList.map(item => {
                    // 确保参与计算的字段存在，避免除以零和其他潜在错误  
                    const norigdiscount = Number(item.norigdiscount) || 0;//返利分摊金额
                    // 默认为1以防止除以零  
                    const fPayMoney = Number(item.fPayMoney) || 0;//订单含税金额

                    // 计算 costsubs -- 分摊前金额
                    const costsubs = norigdiscount + fPayMoney;


                    // 返回更新后的对象，包括新字段  
                    return {
                        ...item,      // 保留原始字段  
                        costsubs,     // 添加 costsubs 字段  
                    };
                });

                this.dataList.forEach(item => {
                    item.nqtorigtaxprice = Number(item.nqtorigtaxprice).toFixed(2)
                    item.norigdiscount = Number(item.norigdiscount).toFixed(2)
                    item.fPayMoney = Number(item.fPayMoney).toFixed(2)
                    item.costsubs = Number(item.costsubs).toFixed(2)
                });
                this.dataList.sort((a, b) => {
                    // 首先按 vouchdate 排序  
                    const dateComparison = new Date(a.vouchdate) - new Date(b.vouchdate);
                    if (dateComparison !== 0) {
                        return dateComparison; // 如果日期不同，返回日期比较结果  
                    }
                    // 如果日期相同，则按 cOrderNo 排序  
                    return a.cOrderNo.localeCompare(b.cOrderNo);
                });

                this.dataList = this.dataList.filter(item =>
                    (item.salesOrgName && item.salesOrgName.toLowerCase().includes(this.bullay)) ||
                    (item.cName && item.cName.toLowerCase().includes(this.bullay)) ||
                    (item.ocustomerClass_name && item.ocustomerClass_name.toLowerCase().includes(this.bullay)) ||
                    (item.red_name && item.red_name.toLowerCase().includes(this.bullay)) ||
                    (item.cSiteName && item.cSiteName.toLowerCase().includes(this.bullay)) ||
                    (item.product_class_name && item.product_class_name.toLowerCase().includes(this.bullay)) ||
                    (item.cProductName && item.cProductName.toLowerCase().includes(this.bullay))
                );


                // this.dataList = this.dataList.reduce((acc, curr) => {
                //     const { cOrderNo, norigdiscount, fPayMoney, costsubs} = curr;
                //     // 检查当前 cOrderNo 是否已经存在于 accumulator 中  
                //     const existing = acc.find(item => item.cOrderNo === cOrderNo);
                //     if (!existing) {
                //         // 如果累加器中没有此 cOrderNo，直接将当前对象添加到 accumulator  
                //         acc.push({ ...curr }); // 保留所有字段  
                //     } else {
                //         // 如果已存在此 cOrderNo，比较 test01 和 norigdiscount 字段  
                //         if ( existing.norigdiscount === norigdiscount && existing.fPayMoney === fPayMoney && existing.costsubs === costsubs) {
                //             // 如果相等，将当前对象的 test01 和 norigdiscount 设置为 '0.00'  
                //             curr.norigdiscount = '';
                //             curr.fPayMoney = '';
                //             curr.costsubs = '';

                //         }
                //         // else {
                //         //     // 如果不相等，则将当前对象的 test01 和 norigdiscount 设置为 '0.00'  
                //         //     curr.test01 = '';
                //         //     curr.norigdiscount = '';
                //         // }
                //         // 直接添加修改后的当前对象到 accumulator  
                //         acc.push(curr);
                //     }
                //     return acc;
                // }, []);
                this.currentData = {
                    ...this.dataList
                };

                this.sizeChangeHandle(this.pageSize);
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
    font-size: 12px;
    background: #f5f7fa;
}


::v-deep .el-table th {
    background: #f5f7fa;
}
</style>