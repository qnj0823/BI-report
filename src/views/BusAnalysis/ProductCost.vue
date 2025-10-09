<template>
    <div class='product'>
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
            <el-table-column fixed :show-overflow-tooltip="true" align="center" width="80" prop="levelName1"
                label="战区" />
            <el-table-column fixed :show-overflow-tooltip="true" align="center" width="80" prop="levelName2"
                label="销售区域/省区" />
            <el-table-column fixed :show-overflow-tooltip="true" align="center" prop="levelName3" label="分公司/办事处" />
            <el-table-column fixed :show-overflow-tooltip="true" width="150" align="center" prop="cName" label="客户名称 " />
            <el-table-column fixed :show-overflow-tooltip="true" width="150" align="center" prop="cSiteName" label="站点" />
            <el-table-column fixed prop="cProductName" width="170" align="center" label="产品名称" />
            <el-table-column fixed :show-overflow-tooltip="true" align="center" prop="box" label="订单数量" />
            <el-table-column fixed :show-overflow-tooltip="true" align="center" width="170" prop="cRebateNo"
                label="费用单号" />
                <el-table-column fixed :show-overflow-tooltip="true" align="center" width="170" prop="cOrderNo"
                label="BIP单号" />
            <!-- <el-table-column fixed :show-overflow-tooltip="true" align="center" prop="sums" label="本单使用金额" /> -->
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
import * as api from '@/api/Business/analysis.js'
import {
  exportExcel
} from './ProductCostExpro.js'
export default {
    name: 'product-page',
    data() {
        return {
            dataForm: {
                p_vouchdateend: '',
                p_vouchdatestart: '',
                p_orgname: ''
            },
            dataListLoading: false,
            bullay: '',
            dataList: [],
            currentData: [],
            currentPage: 1,
            pageSize: 20,
            totalItems: 0,
            newArray: [],
            allnewArray: [],
            codes: [
        {
          itemname: '战区',
          itemcode: 'levelName1'
        },
        {
          itemname: '销售区域',
          itemcode: 'levelName2'
        },
        {
          itemname: '分公司/办事处',
          itemcode: 'levelName3'
        },
        {
          itemname: '客户名称',
          itemcode: 'cName'
        },
        {
          itemname: '站点',
          itemcode: 'cSiteName'
        },
        
        {
          itemname: '产品名称',
          itemcode: 'cProductName'
        },
        {
          itemname: '订单数量',
          itemcode: 'box'
        },
        {
          itemname: '费用单号',
          itemcode: 'cRebateNo'
        },
        {
          itemname: 'BIP单号',
          itemcode: 'cOrderNo'
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
        exportData() {
      this.$confirm('是否导出表格数据到Excel?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {

        exportExcel(this.dataList, this.allnewArray,  '产品费用明细表.xlsx')

      })
    },
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
        getdataList() {
            this.dataListLoading = true
            api.productmoneyAPI(this.dataForm).then(res => {
                this.dataList = res
                this.dataList.forEach(item => {
                    const levels = item.level_name.split(' -> ');
                    item.levelName1 = levels[0] || "";
                    // 去掉 levelName2 中的数字  
                    item.levelName2 = levels[1] ? levels[1].replace(/\d+/g, '').trim() : "";
                    item.levelName3 = levels[2] || "";
                });
                this.dataList.forEach(item => {
                    if (!item.itemcode && !item.itemname) {
                        item.itemname = '其他';
                        item.itemcode = 'fyxm24_fyxm_8888HX';
                    }
                });
                this.dataList.forEach(item => {
                    // 保留两位小数  
                    item.fOrderRebateMoney = isNaN(parseFloat(item.fOrderRebateMoney)) ? '0.00' : parseFloat(item.fOrderRebateMoney).toFixed(2);
                    item.box = isNaN(parseFloat(item.box)) ? '0.00' : parseFloat(item.box).toFixed(2);
                });
                // 变更 dataList，为每个对象添加 itemcode 值作为新字段，值为 fOrderRebateMoney  
                this.dataList = this.dataList.map(item => ({
                    ...item, // 保留其他属性  
                    [item.itemcode]: item.fOrderRebateMoney // 使用 itemcode 的值作为新字段名  
                }));

                //提取字段，用于动态添加表头
                this.newArray = this.dataList.map(({ itemcode, itemname }) => ({ itemcode, itemname }));
                // 使用 Set 进行去重  
                this.newArray = Array.from(
                    new Map(this.newArray.map(item => [item.itemcode, item])).values()
                );
                //导出所需要的表头
                this.allnewArray = [...this.codes, ...this.newArray];
                // 过滤数据  
                this.dataList = this.dataList.filter(item =>
                    (item.levelName1 && item.levelName1.toLowerCase().includes(this.bullay)) ||
                    (item.levelName2 && item.levelName2.toLowerCase().includes(this.bullay)) ||
                    (item.levelName3 && item.levelName3.toLowerCase().includes(this.bullay)) ||
                    (item.cName && item.cName.toLowerCase().includes(this.bullay)) ||
                    (item.cSiteName && item.cSiteName.toLowerCase().includes(this.bullay))
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
    }
};
</script>

<style scoped lang="scss"></style>