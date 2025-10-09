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
      <el-table-column :show-overflow-tooltip="true" align="center" prop="levelName1" label="战区" />
      <el-table-column :show-overflow-tooltip="true" align="center" prop="levelName2" label="销售区域/省区" />
      <el-table-column :show-overflow-tooltip="true" align="center" prop="levelName3" label="分公司/办事处" />
      <el-table-column :show-overflow-tooltip="true" align="center" prop="custname" label="客户名称 " />
      <el-table-column :show-overflow-tooltip="true" align="center" prop="dsubdate" label="费用上帐日期" />
      <el-table-column prop="main_vbillcode" align="center" label="费用单号" />
      <el-table-column :show-overflow-tooltip="true" align="center" prop="norigarsubmny" label="费用金额" />
      <el-table-column :show-overflow-tooltip="true" align="center" prop="nordersubmny" label="使用金额" />
      <el-table-column :show-overflow-tooltip="true" align="center" prop="nremainmny" label="剩余金额" />
    </el-table>
    <el-pagination style="width: 90%; margin: 0 auto; " @size-change="sizeChangeHandle" ref="pagination"
      @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[20, 40, 60, 80, 100, 1000]"
      :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="dataList.length">
    </el-pagination>
  </div>
</template>

<script>
import {
  exportExcel
} from './ExpenseTableExpro.js'
import * as api from '@/api/Business/analysis.js'
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

        exportExcel(this.dataList, '客户费用汇总表.xlsx')

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
      api.rebaterecordAPI(this.dataForm).then(res => {
        this.dataList = res
        this.dataList.forEach(item => {
          const levels = item.level_name.split(' -> ');
          item.levelName1 = levels[0] || "";
          // 去掉 levelName2 中的数字  
          item.levelName2 = levels[1] ? levels[1].replace(/\d+/g, '').trim() : "";
          item.levelName3 = levels[2] || "";
        });
        this.dataList.forEach(item => {
          // 去除 nremainmny 中的逗号符号  
          const cleanedNremainmny = item.nremainmny ? item.nremainmny.replace(/,/g, '') : '0';

          // 保留两位小数  
          item.norigarsubmny = isNaN(parseFloat(item.norigarsubmny)) ? '0.00' : parseFloat(item.norigarsubmny).toFixed(2);

          item.nremainmny = isNaN(parseFloat(cleanedNremainmny)) ? '0.00' : parseFloat(cleanedNremainmny).toFixed(2);

          item.nordersubmny = isNaN(parseFloat(item.nordersubmny)) ? '0.00' : parseFloat(item.nordersubmny).toFixed(2);
        });

        // 过滤数据  
        this.dataList = this.dataList.filter(item =>
          (item.levelName1 && item.levelName1.toLowerCase().includes(this.bullay)) ||
          (item.levelName2 && item.levelName2.toLowerCase().includes(this.bullay)) ||
          (item.levelName3 && item.levelName3.toLowerCase().includes(this.bullay)) ||
          (item.custname && item.custname.toLowerCase().includes(this.bullay))
        );
        //排序
        // 定义 levelName1 的排序优先级  
        const priority = {
          "营销一部": 1,
          "营销二部": 2,
          "营销三部": 3,
          "营销四部": 4,
          "营销五部": 5,
          "营销六部": 6,
          "营销七部": 7,
          "营销八部": 8,
          "大客户部": 9,
          "营销中心": 10,
        };

        // 排序函数  
        this.dataList.sort((a, b) => {
          // 先根据 priority 确定 levelName1 的顺序  
          const levelComparison = (priority[a.levelName1] || 99) - (priority[b.levelName1] || 99);

          // 如果 levelName1 的优先级相同，则根据 levelName3 排序  
          if (levelComparison === 0) {
            const nameComparison = a.levelName3.localeCompare(b.levelName3);

            // 如果 levelName3 也相同，则根据 dsubdate 从大到小排序  
            if (nameComparison === 0) {
              return new Date(b.dsubdate) - new Date(a.dsubdate);
            }

            // 返回 levelName3 的比较结果  
            return nameComparison;
          }

          // 返回 levelName1 的比较结果  
          return levelComparison;
        });

        // 计算合计，先将字段转换为数字  
        const total = this.dataList.reduce((acc, obj) => {
          acc.norigarsubmny += Number(obj.norigarsubmny);
          acc.nremainmny += Number(obj.nremainmny);
          acc.nordersubmny += Number(obj.nordersubmny);
          return acc;
        }, { norigarsubmny: 0, nremainmny: 0, nordersubmny: 0 });

        // 生成合计对象  
        const result = {
          norigarsubmny: total.norigarsubmny.toFixed(2),
          nremainmny: total.nremainmny.toFixed(2),
          nordersubmny: total.nordersubmny.toFixed(2),
          levelName3: "合计"
        };
        this.dataList.push(result);
        console.log(result)

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

<style scoped lang="scss"></style>