<template>
  <div class='MonthTen'>
    <div ref="chart" style="width:100%; height:400px;"></div>

    <el-form :inline="true" style="width: 55%; margin: 0 auto;">
      <el-form-item>
        <el-date-picker v-model="dataForm.p_vouchdatestart" value-format="yyyy-MM-dd" type="date" placeholder="开始日期"
          clearable style="width: 100%"></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-date-picker v-model="dataForm.p_vouchdateend" value-format="yyyy-MM-dd" type="date" placeholder="结束日期"
          clearable style="width: 100%"></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button class="filter-item" size="mini" type="success" icon="el-icon-search"
          @click="getDataList">查询</el-button>
      </el-form-item>
      <el-button size="mini" class="filter-item" type="warning" icon="el-icon-download"
        @click="exportData">导出</el-button>
    </el-form>


    <el-table class="table" ref="table" border :data="dataList" v-loading="dataListLoading"
      style="width: 55%; margin: 0 auto; margin-bottom: 50px;">
      <el-table-column :show-overflow-tooltip="true" align="center" prop="ocustomerClass_name" label="单位体" />
      <el-table-column :show-overflow-tooltip="true" align="center" prop="oldbox" label="老品" />
      <el-table-column :show-overflow-tooltip="true" align="center" prop="newbox" label="新品" />
      <el-table-column :show-overflow-tooltip="true" align="center" prop="otherbox" label="其它" />
      <el-table-column :show-overflow-tooltip="true" align="center" prop="box" label="小计" />
    </el-table>
  </div>
</template>

<script>
import * as api from '@/api/frame/customer.js'
import * as echarts from 'echarts';
import {
  exportExcel
} from './MonthTenExpro.js'
export default {
  name: 'MonthTen-page',
  data() {
    return {
      msg: 'MonthTen-page',
      dataForm: {
        p_vouchdatestart: '',
        p_vouchdateend: ''
      },
      chartList: [],
      dataList: [],
      dataListLoading: false,

    };
  },
  created() {
    this.calculateDates();
  },
  mounted() {
    this.getDataList()

    window.addEventListener('resize', this.onResize); // 处理窗口大小变化
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.onResize);
    if (this.myChart) {
      this.myChart.dispose(); // 清理图表实例  

    }
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
    exportData() {
      this.$confirm('是否导出表格数据到Excel？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {

        exportExcel(this.dataList, '前十单位体销量表.xlsx')

      })
    },
    getDataList() {
      this.dataListLoading = true
      api.projectteamtopAll(this.dataForm).then(res => {
        this.dataList = res
        // 指定需要累加的字段
        const fieldsToSum = ['box', 'newbox', 'oldbox', 'otherbox'];

        // 使用 reduce 方法计算合计
        const total = this.dataList.reduce((acc, obj) => {
          fieldsToSum.forEach(field => {
            // 确保将字段值转换为数字再进行累加 
            const currentValue = Number(obj[field]) || 0; // 确保转换为数字 
            acc[field] = (acc[field] || 0) + currentValue;
          });
          return acc;
        }, {});

        // 创建合计对象
        const totalObject = { ocustomerClass_name: "合计", ...total };

        // 将合计对象添加到原数组中
        this.dataList.push(totalObject);

        this.dataList = this.dataList.map(item => {
          // 创建一个新的对象以保持原始的 name 字段 
          const newItem = { ocustomerClass_name: item.ocustomerClass_name }; // 遍历对象的每个字段 
          for (const key in item) {
            if (key !== 'ocustomerClass_name') { // 排除 name 字段 
              const numericValue = Number(item[key]); // 转换为数字 //只在转换成功时保留两位小数 
              newItem[key] = !isNaN(numericValue) ? numericValue.toFixed(0) : ''; // 可以选择默认值 
            }
          }
          return newItem; // 返回新对象
        });
        this.dataListLoading = false
        this.initChart()
      })
    },
    initChart() {
      this.chartList = this.dataList.filter(item => item.ocustomerClass_name !== "合计");

      const labels = this.chartList.map(item => item.ocustomerClass_name);//名字
      const oldboxValues = this.chartList.map(item => Number(item.oldbox));//老品
      const newboxValues = this.chartList.map(item => Number(item.newbox));//新品
      const otherboxValues = this.chartList.map(item => Number(item.otherbox));//其它
      const boxValues = this.chartList.map(item => Number(item.box));//小计
      const heji = this.dataList.filter(item => item.ocustomerClass_name == "合计");
      const maxValues = heji.map(item => item.box).join(', ');
      console.log(maxValues)

      // 初始化 ECharts 实例 
      this.myChart = echarts.init(this.$refs.chart);

      const option = {
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: ['老品', '新品', '其它', '总计']
        },
        xAxis: {
          type: 'category',
          data: labels
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            name: '老品',
            type: 'bar',
            data: oldboxValues, // 转换为数字数组 color: '#FF6384',  
            label: {
              show: true,
              position: 'top',
              formatter: (params) => {
              const value = Number(oldboxValues[params.dataIndex]);
              // 转换为数字 
              const sumValue = Number(boxValues[params.dataIndex]); // 获取对应的 sumName 并转换为数字 
              const percentage = sumValue ? ((value / sumValue) * 100).toFixed(2) : 0; //计算百分比并保留两位小数 
              return value ? `${percentage}%` : ''; // 显示值和百分比
            },
              // 
              offset: [0, 0],
            },
          },

          {
            name: '新品',
            type: 'bar',
            data: newboxValues,
            color: '#36A2EB',
            label: {
              show: true,
              position: 'top',
              formatter: (params) => {
              const value = Number(newboxValues[params.dataIndex]);
              // 转换为数字 
              const sumValue = Number(boxValues[params.dataIndex]); // 获取对应的 sumName 并转换为数字 
              const percentage = sumValue ? ((value / sumValue) * 100).toFixed(2) : 0; //计算百分比并保留两位小数 
              return value ? `${percentage}%` : ''; // 显示值和百分比
            },
              // 
              offset: [0, 0],
            },
          },
          {
            name: '其它',
            type: 'bar',
            data: otherboxValues,
            color: '#4BC0C0',
            label: {
              show: true,
              position: 'top',
              formatter: (params) => {
              const value = Number(otherboxValues[params.dataIndex]);
              // 转换为数字 
              const sumValue = Number(boxValues[params.dataIndex]); // 获取对应的 sumName 并转换为数字 
              const percentage = sumValue ? ((value / sumValue) * 100).toFixed(2) : 0; //计算百分比并保留两位小数 
              return value ? `${percentage}%` : ''; // 显示值和百分比
            },
              // formatter: function (params) {
              //   const index = params.dataIndex;

              //   // 将对应索引的值转换为数字 
              //   const otherValue = parseFloat(otherboxValues[index]);
              //   const maxValue = parseFloat(maxValues);

              //   //计算百分比，并格式化为字符串 
              //   const percentage = ((otherValue / maxValue) * 100).toFixed(3) + '%';
              //   return percentage; // 返回格式化后的百分比 
              // },
              // 
              offset: [0, -5],
            },
          },
          {
            name: '总计',
            type: 'line',
            data: boxValues,
            color: '#9966FF',
            label: {
              show: true,
              position: 'top',
              offset: [0, -10],
              textStyle: {
                color: '#006400', // 字体颜色  

              },

            },
          }
        ]
      };
      // 使用刚指定的配置项和数据显示图表 
      this.myChart.setOption(option);
      this.myChart.on('click', (params) => {
        console.log('点击的横坐标名字:', params.name);
        this.$router.push({
          path: '/proSalesALL/MonthTenDetails',
          query: {
            param1: params.name,
            enddata: this.dataForm.p_vouchdateend,
            startdate: this.dataForm.p_vouchdatestart
          }
        });

      });
    },
    onResize() {
      if (this.myChart) {
        this.myChart.resize(); // 处理图表尺寸调整  
      }
    },
  }
};
</script>

<style scoped lang="scss">
::v-deep .table .el-table__cell {
  padding: 2px !important;

}

;

::v-deep th.el-table__cell>.cell {
  padding: 0px !important;
}

;

::v-deep .el-table__header-wrapper {
  font-size: 13px;
  background: #f5f7fa;
}

::v-deep .el-table .el-table__body-wrapper tbody tr:last-child {
  font-size: 15px;
  /* 根据需要设置字体大小 */
  font-weight: 600;
}

::v-deep .el-table th {
  background: #f5f7fa;
}
</style>