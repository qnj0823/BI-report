<template>
  <div class='returns'>
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
    <el-table max-height="780" :row-style="{ height: '5px' }" border :data="this.items" v-loading="dataListLoading"
      :cell-style="{ padding: '3px 0' }" class="table">
      <el-table-column align="center" prop="sort" width="80" label="序号"></el-table-column>
      <el-table-column prop="returnGoodsDate" header-align="center" align="center" label="退货日期">
        <template slot-scope="scope">
          <el-date-picker v-model="scope.row.returnGoodsDate" value-format="yyyy-MM-dd" type="date" placeholder="退货日期"
            clearable style="width: 100%"></el-date-picker>
        </template>
      </el-table-column>
      <el-table-column prop="saleOrg" header-align="center" width="305" align="center" label="销售组织">
        <template slot-scope="scope">
          <!-- <el-input v-model="scope.row.saleOrg"></el-input> -->
          <el-select style="width: 18rem; " v-model="scope.row.saleOrg" filterable placeholder="请选择">
            <el-option v-for="item in exportList" :key="item.id" :label="item.salse" :value="item.id" />
          </el-select>
        </template>
      </el-table-column>
      <el-table-column prop="orderNum" header-align="center" align="center" label="出库单号">
        <template slot-scope="scope">
          <el-input v-model="scope.row.orderNum"></el-input>
        </template>
      </el-table-column>
     
      <el-table-column prop="custName" header-align="center" align="center" label="登记人名称">
        <template slot-scope="scope">
          <el-input v-model="scope.row.custName"></el-input>
        </template>
      </el-table-column>
       <el-table-column prop="custCode" header-align="center" align="center" label="退货客户编码">
        <template slot-scope="scope">
          <el-input v-model="scope.row.custCode"></el-input>
        </template>
      </el-table-column>
      <el-table-column prop="productCode" header-align="center" align="center" label="退货产品编码">
        <template slot-scope="scope">
          <el-input v-model="scope.row.productCode"></el-input>
        </template>
      </el-table-column>
      <!-- <el-table-column prop="productName" header-align="center" align="center" label="退货产品名称">
        <template slot-scope="scope">
          <el-input v-model="scope.row.productName"></el-input>
        </template>
      </el-table-column> -->
      <el-table-column prop="productNum" header-align="center" align="center" label="退货数量">
        <template slot-scope="scope">
          <el-input v-model="scope.row.productNum"></el-input>
        </template>
      </el-table-column>
      <el-table-column header-align="center" align="center" width="80" label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="certain(scope.row)">确定</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-divider></el-divider>

    <el-table ref="table" v-loading="dataListLoading" :data="dataList" style="width: 100%; margin-top: 20px;">
      <el-table-column :show-overflow-tooltip="true" align="center" prop="returnGoodsDate" label="退货日期">
        <template #default="scope">
          <el-date-picker v-if="scope.row.isEditing" v-model="scope.row.returnGoodsDate" value-format="yyyy-MM-dd"
            type="date" placeholder="退货日期" clearable style="width: 100%"></el-date-picker>
          <span v-else>{{ scope.row.returnGoodsDate }}</span>
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" align="center" width="305" prop="saleOrg" label="销售组织">
        <template #default="scope">
          <!-- <el-input v-if="scope.row.isEditing" v-model="scope.row.saleOrg" placeholder="销售组织"></el-input> -->
          <el-select v-if="scope.row.isEditing" style="width: 18rem; " v-model="scope.row.saleOrg" filterable
            placeholder="请选择">
            <el-option v-for="item in exportList" :key="item.id" :label="item.salse" :value="item.id" />
          </el-select>
          <span v-else>{{ scope.row.saleOrg }}</span>
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" width="250" align="center" prop="orderNum" label="出库单号">
        <template #default="scope">
          <el-input v-if="scope.row.isEditing" v-model="scope.row.orderNum" placeholder="出库单号"></el-input>
          <span v-else>{{ scope.row.orderNum }}</span>
        </template>
      </el-table-column>
      
      <el-table-column :show-overflow-tooltip="true" align="center" prop="custName" label="登记人名称">
        <template #default="scope">
          <el-input v-if="scope.row.isEditing" v-model="scope.row.custName" placeholder="登记人名称"></el-input>
          <span v-else>{{ scope.row.custName }}</span>
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" align="center" prop="custCode" label="退货客户编码">
        <template #default="scope">
          <el-input v-if="scope.row.isEditing" v-model="scope.row.custCode" placeholder="退货客户编码"></el-input>
          <span v-else>{{ scope.row.custCode }}</span>
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" align="center" prop="productCode" label="退货产品编码">
        <template #default="scope">
          <el-input v-if="scope.row.isEditing" v-model="scope.row.productCode" placeholder="退货产品编码"></el-input>
          <span v-else>{{ scope.row.productCode }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column :show-overflow-tooltip="true" align="center" prop="productName" label="退货产品名称">
        <template #default="scope">
          <el-input v-if="scope.row.isEditing" v-model="scope.row.productName" placeholder="退货产品名称"></el-input>
          <span v-else>{{ scope.row.productName }}</span>
        </template>
      </el-table-column> -->
      <el-table-column :show-overflow-tooltip="true" align="center" prop="productNum" label="退货数量">
        <template #default="scope">
          <el-input v-if="scope.row.isEditing" v-model="scope.row.productNum" placeholder="退货数量"></el-input>
          <span v-else>{{ scope.row.productNum }}</span>
        </template>
      </el-table-column>
      <el-table-column header-align="center" align="center" width="150" label="操作">
        <template slot-scope="scope">

          <el-button v-if="scope.row.isEditing" type="text" size="small"
            @click="oumionu(scope.row.id, scope.row)">保存</el-button>
          <el-button v-else type="text" size="small" @click="addOrUpdateHandle(scope.row.id, scope.row)">修改</el-button>

          <el-button type="text" size="small" @click="deleteHandle(scope.row.id)">删除</el-button>
        </template>
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
  mapGetters,
} from 'vuex'
import {
  exportExcel
} from './SalesReturnsExpro.js'
export default {
  name: 'returns-page',
  data() {
    return {
      msg: 'returns-page',
      dataListLoading: false,
      bullay: '',
      disable: true,
      dataList: [],
      currentData: [],
      currentPage: 1,
      pageSize: 20,
      totalItems: 0,
      items: [],
      createman:'',
      selectedPROValue: '',
      dataForm: {
        p_vouchdatestart: '',
        p_vouchdateend: ''
      },
      exportList: [{
        id: "湖南雨帆噜渴乳业股份有限公司",
        salse: '湖南雨帆噜渴乳业股份有限公司'
      },
      {
        id: "海南雨帆之家餐饮供应链管理有限公司",
        salse: '海南雨帆之家餐饮供应链管理有限公司'
      },
      {
        id: "雨帆食品集团股份有限公司",
        salse: '雨帆食品集团股份有限公司'
      },
      {
        id: "南京滋滋香食品有限公司",
        salse: '南京滋滋香食品有限公司'
      }]
    };
  },
  computed: {
    ...mapGetters(['userid', 'name'])
  },
  created() {
    this.calculateDates();
  },
  mounted() {
    this.initializeData();
    this.getdataList()
    if (this.name != '') {
      sessionStorage.setItem('name', this.name);
    }
    this.createman = sessionStorage.getItem('name');
    console.log( this.createman)
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
    // handlebigChange(value) {
    //   const selectedProItem = this.exportList.find(item => item.id === value);
    // },
    initializeData() {
      for (let i = 1; i <= 1; i++) {
        this.items.push({
          sort: i,
        });
      }
    },
    //确定按钮
    certain(value) {
      console.log(value, 'value')
      if (value.id) {
        api.trackReturnGoodsedit(value).then(res => {
          this.$message.success('修改数据成功')
          this.getdataList()
          this.items = [{
            sort: 1,
          }]
        })
      } else {
        api.trackReturnGoodsadd(value).then(res => {

          this.$message.success('新增数据成功')
          this.getdataList()
          this.items = [{
            sort: 1,
          }]
        })
      }
    },
    //修改
    addOrUpdateHandle(id, row) {
      if (this.disable) {
        row.isEditing = !row.isEditing;
        this.disable = !this.disable
      } else {
        this.currentData.forEach(item => {
          if (item.isEditing == true) {
            this.$confirm('请先保存当前编辑的内容', {
              confirmButtonText: '确定',
              type: 'warning'
            })
          }
        })
      }

      // // 先将所有行设置为不可编辑
      // this.currentData.forEach(item => {
      //   if (item !== row) {
      //     item.isEditing = false;
      //   }
      // });
      // row.isEditing = !row.isEditing;
    },
    oumionu(id, row) {
      // 先将所有行设置为不可编辑
      this.currentData.forEach(item => {
        if (item !== row) {
          item.isEditing = false;
        }
      });
      row.isEditing = !row.isEditing;
      api.trackReturnGoodsedit(row).then(res => {
        this.$emit('refreshDataList')
        this.$emit('close')
        this.$message.success('修改数据成功')
        this.disable = !this.disable
        this.getdataList()

      })
    },
    deleteHandle(id) {
      var ids = id ? [id] : this.dataListSelections.map(item => {
        return item.id
      })
      this.$confirm(`您确定对[ids=${ids.join(',')}]进行[${id ? '删除' : '批量删除'}]操作?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        console.log('删除', ids);
        api.trackReturnGoodsdel(ids).then(res => {
          // TODO 处理删除
          this.$emit('refreshDataList')
          this.$emit('close')
          this.$message.success('删除成功')
          this.getdataList()
        })
      })

    },

    getdataList() {
      api.trackReturnGoodscheck(this.dataForm).then(res => {
        this.dataList = res
        this.dataList = this.dataList.map(obj => ({
          ...obj,
          isEditing: false
        }));
        this.dataList = this.dataList.filter(item => {
          // 将查询关键字转换为小写
          const keyword = this.bullay.toLowerCase();

          // 检查每个字段是否包含关键字（支持数字和文本）
          return (
            (item.saleOrg && item.saleOrg.toString().toLowerCase().includes(keyword)) ||
            (item.orderNum && item.orderNum.toString().toLowerCase().includes(keyword)) ||
            (item.custCode && item.custCode.toString().toLowerCase().includes(keyword)) ||
            (item.custName && item.custName.toString().toLowerCase().includes(keyword)) ||
            (item.productCode && item.productCode.toString().toLowerCase().includes(keyword)) ||
            (item.productName && item.productName.toString().toLowerCase().includes(keyword))
          );
        });
        this.currentData = {
          ...this.dataList
        };
        this.sizeChangeHandle(this.pageSize);
        console.log(this.dataList, 'dataList')
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
    exportData() {
      this.$confirm('是否导出表格数据到Excel?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        exportExcel(this.dataList, '销售退货明细登记表.xlsx')
      })
    },
  }
};
</script>

<style scoped lang="scss"></style>