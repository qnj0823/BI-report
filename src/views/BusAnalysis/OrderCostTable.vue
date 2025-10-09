<template>
  <div class='exDetils'>
    <el-form :inline="true" style="width: 95%; margin: 0 auto;">
      <el-form-item>
        <el-date-picker v-model="dataForm.p_vouchdatestart" value-format="yyyy-MM-dd" type="date" placeholder="开始日期"
          clearable style="width: 100%"></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-date-picker v-model="dataForm.p_vouchdateend" value-format="yyyy-MM-dd" type="date" placeholder="结束日期"
          clearable style="width: 100%"></el-date-picker>
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
    <el-table ref="table" v-loading="dataListLoading" :data="currentData" style="width: 100%;">
      <el-table-column :show-overflow-tooltip="true" align="center" prop="levelName1" width="80" label="战区" />
      <el-table-column :show-overflow-tooltip="true" align="center" prop="levelName2" width="80" label="销售区域" />
      <el-table-column :show-overflow-tooltip="true" align="center" prop="levelName3" label="分公司/办事处" />
      <el-table-column :show-overflow-tooltip="true" align="center" prop="cName" label="客户名称 " />
      <el-table-column :show-overflow-tooltip="true" align="center" prop="cSiteName" label="站点" />
      <el-table-column prop="vouchdate" align="center" label="订单日期" />
      <el-table-column :show-overflow-tooltip="true" align="center" prop="vsrccode" label="BIP订单号" />
      <el-table-column :show-overflow-tooltip="true" align="center" prop="cOrderNo" label="NCC订单号" />
      <el-table-column :show-overflow-tooltip="true" align="center" prop="box" label="订单数量" />
      <el-table-column :show-overflow-tooltip="true" align="center" prop="fSaleCost" label="订单总价" />
      <!-- <el-table-column :show-overflow-tooltip="true" align="center" prop="def17Name" label="采购单号" /> -->
      <el-table-column :show-overflow-tooltip="true" align="center" prop="cost_price" label="采购价总价" />
    </el-table>
    <el-pagination style="width: 90%; margin: 0 auto; " @size-change="sizeChangeHandle" ref="pagination"
      @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[20, 40, 60, 80, 100, 1000]"
      :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="dataList.length">
    </el-pagination>
  </div>
</template>

<script>
import * as api from '@/api/Business/analysis.js'
import { data } from 'vue-echarts';
import {
  exportExcel
} from './OrderCostTableExpro.js'
export default {
  name: 'exDetils-page',
  data() {
    return {
      msg: 'exDetils-page',
      dataForm: {
        p_vouchdateend: '',
        p_vouchdatestart: '',
        p_orgname: ''
      },
      dataListLoading: false,
      dataList: [],
      bullay: '',
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
    exportData() {
      this.$confirm('是否导出表格数据到Excel?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {

        exportExcel(this.dataList, '销售订单与采购成本表.xlsx')

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
      api.ordercostAPI(this.dataForm).then(res => {
        this.dataList = res
        this.dataList.forEach(item => {
          if (item.level_name) {
            const levels = item.level_name.split(' -> ');
            item.levelName1 = levels[0] || "";
            item.levelName2 = levels[1] ? levels[1].replace(/\d+/g, '').trim() : "";
            item.levelName3 = levels[2] || "";
          } else {
            console.warn('item.level_name is undefined', item);
            item.levelName1 = "";
            item.levelName2 = "";
            item.levelName3 = "";
          }
        });
        this.dataList.forEach(item => {
          // 保留两位小数并加上百分号  
          item.box = isNaN(parseFloat(item.box)) ? '0.00' : parseFloat(item.box).toFixed(2);
          item.fSaleCost = isNaN(parseFloat(item.fSaleCost)) ? '0.00' : parseFloat(item.fSaleCost).toFixed(2);
          item.cost_price = isNaN(parseFloat(item.cost_price)) ? '0.00' : parseFloat(item.cost_price).toFixed(2);
        });

        // 过滤数据  
        this.dataList = this.dataList.filter(item =>
          (item.levelName1 && item.levelName1.toLowerCase().includes(this.bullay)) ||
          (item.levelName2 && item.levelName2.toLowerCase().includes(this.bullay)) ||
          (item.levelName3 && item.levelName3.toLowerCase().includes(this.bullay)) ||
          (item.cSiteName && item.cSiteName.toLowerCase().includes(this.bullay))  ||
          (item.cName && item.cName.toLowerCase().includes(this.bullay)) 
        );

        this.currentData = {
          ...this.dataList
        };
        this.sizeChangeHandle(this.pageSize);
        this.dataListLoading = false
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

<style scoped lang="scss"></style>