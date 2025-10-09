<template>
  <div class='profile'>
    <el-form :inline="true" style="margin-top: 10px;" :model="dataForm1" @submit.native.prevent>
      <el-form-item>
        <el-input v-model="bullay" placeholder="模糊查询" clearable @keyup.enter.native="searchEnterFun()"
          ref="searchInput"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button class="filter-item" size="mini" type="success" icon="el-icon-search"
          @click="getDataList">查询</el-button>
        <el-button size="mini" class="filter-item" type="warning" icon="el-icon-download"
          @click="exportData">导出</el-button>
      </el-form-item>
    </el-form>
    <el-table class="table" ref="table" v-loading="dataListLoading" :data="currentData" style="width: 100%;">
      <el-table-column :show-overflow-tooltip="true" align="center" prop="pkCustclassName" label="分公司/办事处" />
      <el-table-column :show-overflow-tooltip="true" align="center" prop="name" label="客户名称" />
      <el-table-column prop="def1Name" align="center" label="客户站点" />
      <el-table-column :show-overflow-tooltip="true" align="center" prop="def5Name" label="销量区域/省区" />
      <el-table-column :show-overflow-tooltip="true" align="center" prop="def3Name" label="物流站点" />
      <el-table-column :show-overflow-tooltip="true" align="center" prop="def6Name" label="光明站点">
      </el-table-column>
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
} from './basicinformExpro.js'
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
        this.dataList = this.dataList.filter(item =>
          (item.pkCustclassName && item.pkCustclassName.toLowerCase().includes(this.bullay)) ||
          (item.name && item.name.toLowerCase().includes(this.bullay)) ||
          (item.def1Name && item.def1Name.toLowerCase().includes(this.bullay))||
          (item.def5Name && item.def5Name.toLowerCase().includes(this.bullay))||
          (item.def3Name && item.def3Name.toLowerCase().includes(this.bullay))||
          (item.def6Name && item.def6Name.toLowerCase().includes(this.bullay))
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
      this.$confirm('是否导出表格数据到Excel？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // this.dataListLoading = true
        exportExcel(this.dataList, '客户/站点.xlsx')
        // api.SiteallCustomer(this.dataForm1).then(res => {
        //   this.exportList = res
        //   this.dataListLoading = false
        //   console.log(this.exportList)
        //   // return
        //   exportExcel(this.exportList, '客户/站点.xlsx')
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