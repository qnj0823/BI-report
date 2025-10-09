<template>
  <div class='basicMonthCycle'>
    <el-form :inline="true" style="margin-top: 10px;" :model="dataForm" @submit.native.prevent>
      <el-form-item>
        <el-input v-model="bullay" placeholder="模糊搜索" clearable @keyup.enter.native="searchEnterFun()"
          ref="searchInput"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button class="filter-item" size="mini" type="success" icon="el-icon-search"
          @click="getDataList">查询</el-button>
        <!-- <el-button class="filter-item" size="mini" type="success" icon="el-icon-plus"
          @click="addOrUpdateHandle()">新增分类</el-button>
        <el-button size="mini" class="filter-item" type="warning" icon="el-icon-download"
          @click="exportData">导出</el-button> -->
      </el-form-item>
    </el-form>
    <el-form :inline="true" style="margin-top: 10px;" :model="dataForm" @submit.native.prevent>
      <el-form-item>
        <el-input v-model="dataForm2.file" placeholder="选择文件" readonly></el-input>
        <input type="file" ref="fileInput" style="display: none" @change="handleFileUpload">
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="openFileInput">选择文件</el-button>
        <el-button type="success" @click="uploadFile">导入</el-button>
      </el-form-item>
      <el-form-item>
        <!-- <el-button class="filter-item" size="mini" type="success" @click="addOrUpdateHandle()">新增</el-button> -->
        <!-- <el-button size="mini" class="filter-item" type="warning" icon="el-icon-download"
          @click="DownTemplate">下载模板</el-button> -->
      </el-form-item>
    </el-form>
    <el-table ref="table" v-loading="dataListLoading" :data="currentData" style="width: 100%;">
      <el-table-column :show-overflow-tooltip="true" align="center" prop="dqname" label="战区" />
      <el-table-column prop="companyname" align="center" label="单位体" />
      <el-table-column prop="days" align="center" label="时间(天)" />
      <el-table-column prop="ordernum" align="center" label="单数" />
      <!-- <el-table-column header-align="center" align="center" width="150" label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="addOrUpdateHandle(scope.row.id, scope.row)">修改</el-button>
          <el-button type="text" size="small" @click="deleteHandle(scope.row.id)">删除</el-button>
        </template>
</el-table-column> -->
    </el-table>
    <el-pagination @size-change="sizeChangeHandle" ref="pagination" @current-change="handleCurrentChange"
      :current-page="currentPage" :page-sizes="[20, 40, 60, 80, 100, 1000]" :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper" :total="dataList.length">
    </el-pagination>
  </div>
</template>

<script>
import * as api from '@/api/management/management.js'
export default {
  name: 'basicMonthCycle-page',
  data() {
    return {
      msg: '(管理部)单位体下单周期数据表',
      dataListLoading: false,
      bullay: '',
      dataList:[],
      currentData: [],
      currentPage: 1,
      pageSize: 20,
      totalItems: 0,
      dataForm: {
        page: 0,
        size: 4000,
        sort: '',
      },
      dataForm2: {
        file: '',
      },
    };
  },
  mounted() {
    this.getDataList()
  },
  methods: {
    getDataList() {
      api.APIMonthCycleCHECK(this.dataForm).then(res => {
        this.dataList = res
        // 过滤数据  
        this.dataList = this.dataList.filter(item =>
          (item.dqname && item.dqname.toLowerCase().includes(this.bullay)) ||
          (item.companyname && item.companyname.toLowerCase().includes(this.bullay))
        );
        this.currentData = {
          ...this.dataList
        };
        this.sizeChangeHandle(this.pageSize);
        console.log(res)
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
    //选择文件
    openFileInput() {
      this.$refs.fileInput.click();
    },
    handleFileUpload(event) {
      this.files = event.target.files[0]
      this.dataForm2.file = event.target.files[0].name;
      console.log(this.files, this.dataForm2.file)
    },
    //导入
    uploadFile() {
      this.dataListLoading = true
      if (this.dataForm2.file) {
        let formData = new FormData();
        console.log(this.files)
        formData.append("file", this.files);

        api.APIMonthCycleMPORT(formData).then(res => {
          this.getDataList()
          this.$message.success('导入成功')
          this.dataListLoading = false
        })
          .catch(error => {
            this.dataListLoading = false
            this.$message.error("导入失败");
          });
      } else {
        this.$message.error("请先选择文件");
      }
    },
  }
};
</script>

<style scoped lang="scss"></style>