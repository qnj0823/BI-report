<template>
  <div class='profile'>
    <!-- <iframe src="http://bi.yufanjtbip.com:50401/cv/a8f2fd7ac1924268f790/?DG_SAFE_SESSION=1"
        style="width:100%;height:100%;border:0;"></iframe> -->
    <el-form :inline="true" style="margin-top: 10px;" :model="dataForm" @submit.native.prevent>
      <el-form-item>
        <el-input v-model="bullay" placeholder="模糊搜索" clearable @keyup.enter.native="searchEnterFun()"
          ref="searchInput"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button class="filter-item" size="mini" type="success" icon="el-icon-search"
          @click="getDataList">查询</el-button>
        <el-button class="filter-item" size="mini" type="success" icon="el-icon-plus"
          @click="addOrUpdateHandle()">新增分类</el-button>
        <el-button size="mini" class="filter-item" type="warning" icon="el-icon-download"
          @click="exportData">导出</el-button>
      </el-form-item>
    </el-form>
    <el-table ref="table" v-loading="dataListLoading" :data="currentData" style="width: 100%;">
      <el-table-column :show-overflow-tooltip="true" align="center" prop="productClassPname" label="大类" />
      <el-table-column :show-overflow-tooltip="true" align="center" prop="productClassName" label="小类" />
      <el-table-column prop="simplename" align="center" label="产品简称" />
      <el-table-column :show-overflow-tooltip="true" align="center" prop="name" label="产品名称" />
      <el-table-column :show-overflow-tooltip="true" align="center" prop="code" label="产品编号" />
      <el-table-column :show-overflow-tooltip="true" align="center" prop="converBox" label="换算单位（箱/盒）">
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" align="center" prop="converBigPiece" label="换算单位（小件/大件）">
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" align="center" prop="attribute" label="属性">
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" align="center" prop="bulkfactor" label="密度系数">
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" align="center" prop="pieceConverValue" label="件换算值(KG)">
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" align="center" prop="def18Name" label="备注">
      </el-table-column>
    </el-table>
    <el-pagination @size-change="sizeChangeHandle" ref="pagination" @current-change="handleCurrentChange"
      :current-page="currentPage" :page-sizes="[20, 40, 60, 80, 100, 1000]" :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper" :total="dataList.content.length">
    </el-pagination>

    <!-- 表单弹窗, 新增数据和修改数据 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @close="addOrUpdateVisible = false"
      @refreshDataList="getDataList"></add-or-update>
  </div>
</template>

<script>
import * as api from '@/api/frame/customer.js'
import AddOrUpdate from './ProductSafe-add-update-add'
import {
  exportExcel
} from './ProductSafeExpro.js'
import { data } from 'vue-echarts';
export default {
  components: {
    AddOrUpdate,
  },
  name: 'ceshi-page',
  data() {
    return {
      constants: this.$constants,
      msg: 'ceshi-page',
      dataForm: {
        page: 0,
        size: this.$constants.page.limit[0],
        sort: '',
      },
      dataForm1: {
        page: 0,
        size: 200,
        sort: '',
      },
      bullay: '',
      filters: ['HNLK005', 'HNLK001', 'HNLK003', 'HNLK002', '1103010007', 'HNLK006', '1101010008', '1101010009', '1101010011', '1101010012'],
      currentData: [],
      currentPage: 1,
      pageSize: 20,
      totalItems: 0,
      dataListLoading: false,
      dataList: [],
      exportList: [],
      addOrUpdateVisible: false,
    };
  },
  mounted() {
    this.getDataList()
  },
  methods: {
    // 新增 / 修改
    addOrUpdateHandle(id) {
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(id)
      })
    },
    getDataList() {
      api.TtrackProductAdd(this.dataForm1).then(res => {
        this.dataList = res
        this.dataList.content.sort((a, b) => {
          if (a.productClassPname === '其它') {
            return 1; // a 是 '其他系列'，排到后面  
          }
          if (b.productClassPname === '其它') {
            return -1; // b 是 '其他系列'，将 a 排到前面  
          }
          // 正常排序其余的系列  
          if (a.productClassPname < b.productClassPname) {
            return -1; // a 在 b 之前  
          }
          if (a.productClassPname > b.productClassPname) {
            return 1; // a 在 b 之后  
          }
          return 0; // 相等  
        });

        this.dataList.content = this.dataList.content.filter(item => !this.filters.includes(item.code));
        // 过滤数据  
        this.dataList.content = this.dataList.content.filter(item =>
          (item.productClassPname && item.productClassPname.toLowerCase().includes(this.bullay)) ||
          (item.productClassName && item.productClassName.toLowerCase().includes(this.bullay)) ||
          (item.simplename && item.simplename.toLowerCase().includes(this.bullay)) ||
          (item.name && item.name.toLowerCase().includes(this.bullay))
        );
        this.currentData = {
          ...this.dataList.content
        };
        this.sizeChangeHandle(this.pageSize);
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
        api.TtrackProductAdd(this.dataForm1).then(res => {
          this.exportList = res
          this.exportList.content = this.exportList.content.filter(item => !this.filters.includes(item.code));
          // this.dataListLoading = false
          exportExcel(this.dataList.content, '产品分类.xlsx')
        })

      })
    },
    // 每页数
    sizeChangeHandle(val) {
      this.pageSize = val;
      this.currentPage = 1;
      this.currentData = this.dataList.content.slice((this.currentPage - 1) * this.pageSize, this.currentPage * this
        .pageSize);
    },
    // 当前页
    handleCurrentChange(val) {
      console.log(val)
      this.currentPage = val;
      this.currentData = this.dataList.content.slice((val - 1) * this.pageSize, val * this.pageSize);
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