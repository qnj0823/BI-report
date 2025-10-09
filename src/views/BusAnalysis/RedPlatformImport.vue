<template>
  <div class='red'>
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
        <el-button size="mini" class="filter-item" type="warning" icon="el-icon-download"
          @click="exportData">下载模板</el-button>
      </el-form-item>
    </el-form>
    <el-table ref="table" v-loading="dataListLoading" :data="currentData" style="width: 100%;">
      <el-table-column :show-overflow-tooltip="true" align="center" prop="companyName" label="营业执照" />
      <el-table-column :show-overflow-tooltip="true" width="140" align="center" prop="redName" label="雨帆红平台名称" />
      <el-table-column :show-overflow-tooltip="true" align="center" prop="siteName" label="客户站点" />
      <el-table-column :show-overflow-tooltip="true" width="100" v-for="(item, index) in newArray"
        :key="item.productCode" :prop="item.productCode" header-align="center" align="center" :label="item.productName">
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
} from './RedPlatformImportExpro.js'
import { data } from 'vue-echarts';
export default {
  name: 'red-page',
  data() {
    return {
      msg: 'red-page',
      dataList: [],
      exportList: [],
      newArray: [],
      currentData: [],
      currentPage: 1,
      pageSize: 20,
      totalItems: 0,
      dataForm: {
        page: 0,
        size: 1000
      },
      dataForm2: {
        file: '',
      },
      dataListLoading: false,
    };
  },
  mounted() {
    this.getdataList()
  },
  methods: {
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

        api.RedimportorderdataAPi(formData).then(res => {
          this.$message.success('导入成功')
          this.dataListLoading = false
          this.getdataList()
        })
          .catch(error => {
            this.dataListLoading = false
            this.$message.error("导入失败");
          });
      } else {
        this.$message.error("请先选择文件");
      }
    },
    exportData() {
      this.$confirm('是否导出表格数据到Excel?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        exportExcel(this.exportList, '红平台导入表.xlsx')

      })
    },
    getdataList() {
      this.dataListLoading = true
      api.trackRedPlatformAPI(this.dataForm).then(res => {
        this.dataList = res.content
        // 变更 dataList，为每个对象添加 itemcode 值作为新字段，值为 nordersubmny  
        this.dataList = this.dataList.map(item => ({
          ...item, // 保留其他属性  
          [item.productCode]: item.productValue // 使用 itemcode 的值作为新字段名  
        }));
        //提取字段，用于动态添加表头
        this.newArray = this.dataList.map(({ productCode, productName }) => ({ productCode, productName }));
        // 使用 Set 进行去重  
        this.newArray = Array.from(
          new Map(this.newArray.map(item => [item.productCode, item])).values()
        );
        //合并站点相同的对象
        const mergedData = {};
        this.dataList.forEach(item => {
          const key = item.siteName;
          if (!mergedData[key]) {
            // 如果没有这个 siteName 的对象，初始化第一个对象  
            mergedData[key] = { ...item };
          } else {
            // 存在相同 siteName 的对象，合并字段  
            for (let field in item) {
              // console.log(field)
              if (!['companyName', 'id', 'productCode', 'productName', 'productValue', 'redName', 'siteId', 'siteName', 'userId'].includes(field)) {
                mergedData[key][field] = item[field]; // 合并非指定字段  
              }
            }
          }
        });

        // 将合并后的对象转换为数组  
        this.dataList = Object.values(mergedData);
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