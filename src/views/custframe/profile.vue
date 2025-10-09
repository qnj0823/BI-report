<template>
  <div class='profile'>
    <!-- <iframe src="http://bi.yufanjtbip.com:50401/cv/a8f2fd7ac1924268f790/?DG_SAFE_SESSION=1"
      style="width:100%;height:100%;border:0;"></iframe> -->
    <el-form :inline="true" style="margin-top: 10px;" :model="dataForm" @submit.native.prevent>
      <el-form-item>
        <el-input v-model="dataForm.blurry" placeholder="战区/销售区域/分公司" clearable @keyup.enter.native="searchEnterFun()"
          ref="searchInput"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button class="filter-item" size="mini" type="success" icon="el-icon-search"
          @click="getDataList">查询</el-button>
        <el-button size="mini" class="filter-item" type="warning" icon="el-icon-download"
          @click="exportData">导出</el-button>
      </el-form-item>
    </el-form>
    <el-table ref="table" v-loading="dataListLoading" :data="dataList.content" style="width: 100%;">
      <el-table-column :show-overflow-tooltip="true" align="center" prop="levelName1" label="战区" />
      <el-table-column :show-overflow-tooltip="true" align="center" prop="levelName2" label="销售区域/省区" />
      <el-table-column prop="levelName3" align="center" label="分公司/办事处" />
      <el-table-column :show-overflow-tooltip="true" align="center" prop="name" label="客户全称" />
      <!-- <el-table-column :show-overflow-tooltip="true" align="center" prop="def17Name" label="所属性质" /> -->
      <el-table-column :show-overflow-tooltip="true" align="center" prop="def18Name" label="客户星级">
      </el-table-column>
    </el-table>
    <el-pagination :current-page="dataForm.page + 1" :page-sizes="constants.page.limit" :layout="constants.page.layout"
      :total="dataList.totalElements" @size-change="sizeChangeHandle" @current-change="currentChangeHandle" />
  </div>
</template>

<script>
import * as api from '@/api/frame/customer.js'
import {
  exportExcel
} from './profileExpro.js'
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
      dataListLoading: false,
      dataList: [],
      exportList: []
    };
  },
  mounted() {
    this.getDataList()
  },
  methods: {
    getDataList() {
      api.BdCustomer(this.dataForm).then(res => {
        this.dataList = res
        this.dataList.content.forEach(item => {
          const levels = item.levelName.split(' -> ');
          item.levelName1 = levels[0] || "";
          // 去掉 levelName2 中的数字  
          item.levelName2 = levels[1] ? levels[1].replace(/\d+/g, '').trim() : "";
          item.levelName3 = levels[2] || "";
        });
        console.log(this.dataList)
        // this.dataListLoading = false
      })

    },
    exportData() {
      this.$confirm('是否导出表格数据到Excel？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.dataListLoading = true
        api.BdallCustomer(this.dataForm1).then(res => {
          this.exportList = res
          this.exportList.forEach(item => {
            const levels = item.levelName.split(' -> ');
            item.levelName1 = levels[0] || "";
            // 去掉 levelName2 中的数字  
            item.levelName2 = levels[1] ? levels[1].replace(/\d+/g, '').trim() : "";
            item.levelName3 = levels[2] || "";
            this.dataListLoading = false
          });
          console.log(this.exportList)
          // return
          exportExcel(this.exportList, '业务框架/客户表.xlsx')
        })
      })
    },
    // 每页数
    sizeChangeHandle(val) {
      this.dataForm.size = val
      this.pageSize = val
      this.pageIndex = 1
      this.getDataList()
    },
    // 当前页
    currentChangeHandle(val) {
      this.pageIndex = val
      this.dataForm.page = val - 1
      this.getDataList()
    },
  }
};
</script>

<style scoped lang="scss">
// .profile {
//   width: 100%;
//   height: 100%;
//   position: absolute;
//   /* 或使用 flexbox */
//   top: 0;
//   left: 0;
// }</style>