<template>
    <div class='exBill'>
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
        <el-table class="table" max-height="600" ref="table" :data="currentData" v-loading="dataListLoading"
            style="width: 100%;">
            <el-table-column fixed :show-overflow-tooltip="true" align="center" prop="levelName1" label="战区" />
            <el-table-column fixed :show-overflow-tooltip="true" align="center" prop="levelName2" label="销售区域" />
            <el-table-column fixed :show-overflow-tooltip="true" align="center" width="120" prop="levelName3"
                label="分公司/办事处" />
            <el-table-column fixed :show-overflow-tooltip="true" align="center" width="200" prop="cname"
                label="客户名称 " />
            <el-table-column fixed :show-overflow-tooltip="true" align="center" prop="vouchdate" label="订单日期" />
            <el-table-column fixed :show-overflow-tooltip="true" align="center" width="200" prop="crebateno"
                label="费用单号" />
            <!-- <el-table-column fixed :show-overflow-tooltip="true" align="center" prop="cOrderNo" label="费用额度" /> -->
            <el-table-column :show-overflow-tooltip="true" width="100" v-for="(item, index) in newArray"
                :key="item.itemcode" :prop="item.itemcode" header-align="center" align="center" :label="item.itemname">
            </el-table-column>
        </el-table>
        <el-pagination style="width: 90%; margin: 0 auto; " @size-change="sizeChangeHandle" ref="pagination"
            @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[20, 40, 60, 80, 100, 1000]"
            :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="dataList.length">
        </el-pagination>
    </div>
</template>

<script>
import * as api from '@/api/frame/customer.js'
import {
    exportExcel
} from './ExpensesBilledExpro.js'

export default {
    name: 'exBill-page',
    data() {
        return {
            currentData: [],
            currentPage: 1,
            pageSize: 20,
            totalItems: 0,
            dataListLoading: false,
            dataForm: {
                p_vouchdatestart: '',
                p_vouchdateend: '',
            },
            dataList: [],
            bullay: '',
            newArray: [],
            allnewArray: [],
            codes: [
                {
                    itemname: '战区',
                    itemcode: 'levelName1'
                },
                {
                    itemname: '销售区域/省区',
                    itemcode: 'levelName2'
                },
                {
                    itemname: '分公司/办事处',
                    itemcode: 'levelName3'
                },
                {
                    itemname: '客户名称',
                    itemcode: 'cname'
                },
                {
                    itemname: '订单日期',
                    itemcode: 'vouchdate'
                },
                {
                    itemname: '费用单号',
                    itemcode: 'crebateno'
                }
            ],
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
        //查询数据
        getdataList() {
            this.dataListLoading = true
            api.BipCustcheckApi(this.dataForm).then(res => {
                this.dataList = res
                this.dataList.forEach(item => {
                    this.dataList.forEach(item => {
                        if (item.levelName) {
                            const levels = item.levelName.split(' -> ');
                            item.levelName1 = levels[0] || "";
                            // 去掉 levelName2 中的数字  
                            item.levelName2 = levels[1] ? levels[1].replace(/\d+/g, '').trim() : "";
                            item.levelName3 = levels[2] || "";
                        } else {
                            item.levelName1 = "";
                            item.levelName2 = "";
                            item.levelName3 = "";
                        }
                    });
                    // 变更 dataList，为每个对象添加 itemcode 值作为新字段，值为 nordersubmny  
                    this.dataList = this.dataList.map(item => ({
                        ...item, // 保留其他属性  
                        [item.itemcode]: item.frebatemoney // 使用 itemcode 的值作为新字段名  
                    }));

                    //提取字段，用于动态添加表头
                    this.newArray = this.dataList.map(({ itemcode, itemname }) => ({ itemcode, itemname }));
                    // 使用 Set 进行去重  
                    this.newArray = Array.from(
                        new Map(this.newArray.map(item => [item.itemcode, item])).values()
                    );
                    //导出所需要的表头
                    this.allnewArray = [...this.codes, ...this.newArray];
                });
                this.currentData = {
                    ...this.dataList
                };
                this.sizeChangeHandle(this.pageSize);
                this.dataListLoading = false
            })
        },
        exportData() {
            this.$confirm('是否导出表格数据到Excel?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                exportExcel(this.dataList, this.allnewArray, '费用上账明细.xlsx')

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