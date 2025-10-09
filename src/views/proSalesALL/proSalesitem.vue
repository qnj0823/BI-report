<template>
  <div class='salesitem'>

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
      <el-button class="filter-item" size="mini" type="primary" @click="Enterdetails">站点详情</el-button>
    </el-form>


    <el-table class="table" ref="table" border v-loading="dataListLoading" :data="summedArray"
      style="width: 55%; margin: 0 auto; margin-bottom: 50px;">
      <el-table-column :show-overflow-tooltip="true" align="center" prop="nAME" label="销售部" />
      <!-- <el-table-column :show-overflow-tooltip="true" align="center" prop="productClassPname" label="产品系列" /> -->
      <el-table-column :show-overflow-tooltip="true" align="center" prop="lowbox" label="低温系列" />
      <el-table-column :show-overflow-tooltip="true" align="center" prop="nowbox" label="常温系列" />
      <el-table-column :show-overflow-tooltip="true" align="center" prop="Frubox" label="果汁系列" />
      <el-table-column :show-overflow-tooltip="true" align="center" width="100" prop="yznlbox" label="椰子牛乳系列" />
      <el-table-column :show-overflow-tooltip="true" align="center" width="100" prop="yzzbox" label="椰子汁系列" />
      <el-table-column :show-overflow-tooltip="true" align="center" prop="qtbox" label="其它" />
      <el-table-column prop="sum" align="center" label="小计" />
    </el-table>
  </div>
</template>

<script>
import * as api from '@/api/frame/customer.js'
import * as echarts from 'echarts';
import { data } from 'vue-echarts';
import {
  exportExcel
} from './proSalesitemExpro.js'
export default {
  name: 'salesitem-page',
  data() {
    return {
      msg: 'salesitem-page',
      dataListLoading: false,
      dataList: [],
      result: [],
      chartList: [],
      dataForm: {
        p_vouchdatestart: '',
        p_vouchdateend: ''
      },
      startOfMonth: '',
      endOfToday: '',
      mergedDataList: [],
      summedArray: []
    };
  },
  created() {
    this.calculateDates();
  },
  mounted() {
    const chart1 = sessionStorage.getItem('chart');
    const merged1 = sessionStorage.getItem('merged');
    const data1 = sessionStorage.getItem('data');
    const startdate = sessionStorage.getItem('startdateitem');
    const enddate = sessionStorage.getItem('enddateitem');
    if (chart1) {
      const chart1List = JSON.parse(chart1);
      const merged1List = JSON.parse(merged1);
      const data1List = JSON.parse(data1);
      this.dataForm.p_vouchdatestart = startdate
      this.dataForm.p_vouchdateend = enddate
      this.summedArray = merged1List
      this.chartList = chart1List
      this.dataList = data1List
      this.initChart()

    } else {
      this.getDataList()
    }


    window.addEventListener('resize', this.onResize); // 处理窗口大小变化
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.onResize);
    if (this.myChart) {
      this.myChart.dispose(); // 清理图表实例  

    }
  },
  methods: {
    Enterdetails() {
      this.$router.push({
        path: '/proSalesALL/SalesitemDetails',
        query: {
          param1: '',
          enddata: this.dataForm.p_vouchdateend,
          startdate: this.dataForm.p_vouchdatestart
        }
      });
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


    exportData() {
      this.$confirm('是否导出表格数据到Excel?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {

        exportExcel(this.summedArray, '产品系列销售表.xlsx')

      })
    },



    // sumBoxes(array) {
    //   //计算 box 字段的总和 
    //   const sum = array.reduce((accumulator, current) => accumulator + current.box, 0);
    //   // 创建一个新对象并存储总和
    //   const result = { box: sum, orgname: '合计' };
    //   // 将新对象推入数组 
    //   array.push(result);
    //   return array;
    // },

    objectSpanMethod({
      row,
      column,
      rowIndex,
      columnIndex
    }, items) {
      if (columnIndex === 0) { // 处理第一列
        const currentValue = row[column.property];
        const preRow = items[rowIndex - 1];
        const preValue = preRow ? preRow[column.property] : null;

        if (currentValue === preValue) {
          return {
            rowspan: 0,
            colspan: 0
          }; // 隐藏当前单元格
        } else {
          let rowspan = 1;
          for (let i = rowIndex + 1; i < items.length; i++) {
            const nextRow = items[i];
            if (nextRow[column.property] === currentValue) {
              rowspan++;
            } else {
              break;
            }
          }
          return {
            rowspan,
            colspan: 1
          }; // 当前单元格跨越行
        }
      }
      if (columnIndex === 3) { // 处理第一列
        const currentValue = row[column.property];
        const preRow = items[rowIndex - 1];
        const preValue = preRow ? preRow[column.property] : null;

        // 检查当前值是否为空
        if (!currentValue) {
          return {
            rowspan: 1, // 保留当前单元格
            colspan: 1
          }; // 不合并，但保留单元格
        }

        if (currentValue === preValue) {
          return {
            rowspan: 0,
            colspan: 0
          }; // 隐藏当前单元格
        } else {
          let rowspan = 1;
          for (let i = rowIndex + 1; i < items.length; i++) {
            const nextRow = items[i];
            if (nextRow[column.property] === currentValue) {
              rowspan++;
            } else {
              break;
            }
          }
          return {
            rowspan,
            colspan: 1
          }; // 当前单元格跨越行
        }
      }
    },
    convertBoxFields(dataList) {
      dataList.forEach(item => {
        // 检查 product_class_pname 字段并进行相应修改  
        if (typeof item.product_class_pname === 'string') {
          if (item.product_class_pname.includes('低温系列')) {
            item.lowbox = Number(item.box).toFixed(2); // 将 box 转换为数字并赋值给 oldbox  
            delete item.box; // 删除原来的 box 字段  
          } else if (item.product_class_pname.includes('常温系列')) {
            item.nowbox = Number(item.box).toFixed(2); // 将 box 转换为数字并赋值给 newbox  
            delete item.box; // 删除原来的 box 字段  
          } else if (item.product_class_pname.includes('果汁系列')) {
            item.Frubox = Number(item.box).toFixed(2); // 将 box 转换为数字并赋值给 newbox  
            delete item.box; // 删除原来的 box 字段  
          } else if (item.product_class_pname.includes('椰子汁系列')) {
            item.yzzbox = Number(item.box).toFixed(2); // 将 box 转换为数字并赋值给 newbox  
            delete item.box; // 删除原来的 box 字段  
          } else if (item.product_class_pname.includes('椰子牛乳系列')) {
            item.yznlbox = Number(item.box).toFixed(2); // 将 box 转换为数字并赋值给 newbox  
            delete item.box; // 删除原来的 box 字段  
          } else if (item.product_class_pname.includes('其它')) {
            item.qtbox = Number(item.box).toFixed(2); // 将 box 转换为数字并赋值给 newbox  
            delete item.box; // 删除原来的 box 字段  
          }
        }
      });
    },
    sumBoxes(dataArray) {
      const result = Object.values(
        dataArray.reduce((acc, obj) => {
          const { nAME } = obj;

          // 如果 acc 中没有 nAME，初始化  
          if (!acc[nAME]) {
            acc[nAME] = {
              nAME,
              lowbox: 0,
              nowbox: 0,
              Frubox: 0,
              yzzbox: 0,
              yznlbox: 0,
              qtbox: 0,
              sum: 0
            };
          }

          // 转为数字并累加各个字段的值，缺失字段视为0  
          acc[nAME].lowbox += parseFloat(obj.lowbox) || 0;
          acc[nAME].nowbox += parseFloat(obj.nowbox) || 0;
          acc[nAME].Frubox += parseFloat(obj.Frubox) || 0;
          acc[nAME].yzzbox += parseFloat(obj.yzzbox) || 0;
          acc[nAME].yznlbox += parseFloat(obj.yznlbox) || 0;
          acc[nAME].qtbox += parseFloat(obj.qtbox) || 0;

          // 计算每个对象的总和并保留两位小数  
          acc[nAME].sum = parseFloat((acc[nAME].lowbox + acc[nAME].nowbox + acc[nAME].Frubox +
            acc[nAME].yzzbox + acc[nAME].yznlbox + acc[nAME].qtbox).toFixed(2));

          return acc;
        }, {})
      );

      // 计算合计对象  
      const totalObject = {
        nAME: '合计',
        lowbox: parseFloat(result.reduce((sum, obj) => sum + obj.lowbox, 0).toFixed(2)),
        nowbox: parseFloat(result.reduce((sum, obj) => sum + obj.nowbox, 0).toFixed(2)),
        Frubox: parseFloat(result.reduce((sum, obj) => sum + obj.Frubox, 0).toFixed(2)),
        yzzbox: parseFloat(result.reduce((sum, obj) => sum + obj.yzzbox, 0).toFixed(2)),
        yznlbox: parseFloat(result.reduce((sum, obj) => sum + obj.yznlbox, 0).toFixed(2)),
        qtbox: parseFloat(result.reduce((sum, obj) => sum + obj.qtbox, 0).toFixed(2)),
        sum: 0 // 先初始化 sum，后面会进行计算  
      };

      // 计算合计的 sum 值并保留两位小数  
      totalObject.sum = parseFloat(
        (totalObject.lowbox + totalObject.nowbox + totalObject.Frubox +
          totalObject.yzzbox + totalObject.yznlbox + totalObject.qtbox).toFixed(2)
      );

      // 添加合计对象到原数组最后  
      result.push(totalObject);

      return result;
    },



    getDataList() {
      this.chartList = []
      this.dataListLoading = true
      console.log(this.dataForm.p_vouchdatestart, this.dataForm.p_vouchdateend)
      sessionStorage.setItem('startdateitem', this.dataForm.p_vouchdatestart);
      sessionStorage.setItem('enddateitem', this.dataForm.p_vouchdateend);
      api.productonesellsite(this.dataForm).then(res => {
        this.dataList = res
        this.dataList.forEach(item => {
          if (item.cProductCode == 'HBLK007') {
            item.box = item.box / 40
          }
        })
        this.convertBoxFields(this.dataList)
        console.log(this.dataList, 'this.dataList')

        this.summedArray = this.sumBoxes(this.dataList);

        this.summedArray.forEach(item => {

          item.lowbox = item.lowbox.toFixed(2)
          item.nowbox = item.nowbox.toFixed(2)
          item.Frubox = item.Frubox.toFixed(2)
          item.yzzbox = item.yzzbox.toFixed(2)
          item.yznlbox = item.yznlbox.toFixed(2)
          item.qtbox = item.qtbox.toFixed(2)
          item.sum = item.sum.toFixed(2)
        });

        this.dataListLoading = false


        sessionStorage.setItem('merged', JSON.stringify(this.summedArray));
        // sessionStorage.setItem('data', JSON.stringify(this.dataList));
        console.log(this.summedArray, 'this.summedArray')



        this.initChart(this.summedArray)

      })
    },
    initChart(data) {
      console.log(data, 'data')
      //横坐标
      const orgNames = data.filter(item => item.nAME !== '合计');
      const sumNames = data.filter(item => item.nAME == '合计')
      console.log(orgNames)
      const names = orgNames.map(item => item.nAME);
      const lowboxData = orgNames.map(item => item.lowbox);
      const nowboxData = orgNames.map(item => item.nowbox);
      const FruboxData = orgNames.map(item => item.Frubox);
      const yzzboxData = orgNames.map(item => item.yzzbox);
      const yznlboxData = orgNames.map(item => item.yznlbox);
      const qtboxData = orgNames.map(item => item.qtbox);




      // 初始化 ECharts 实例 
      this.myChart = echarts.init(this.$refs.chart);
      const option = {
        // title: {
        //   text: '各战区产品销售数量',
        // },
        tooltip: {},
        legend: {
          data: ['低温系列', '常温系列', '果汁系列', '椰子牛乳系列', '椰子汁系列', '其它'],
        },
        xAxis: {
          type: 'category',
          data: names,
        },
        yAxis: {
        },
        series: [{
          name: '低温系列',
          type: 'bar',
          data: lowboxData,
          barWidth: '10%',
          barGap: '60%',
          // barCategoryGap: '30%',
          emphasis: {
            focus: 'series'
          },
          // label: {
          //   position: 'top',
          //   z: 10000,
          //   fontSize: 10,
          //   formatter: (params) => {
          //     const value = Number(lowboxData[params.dataIndex]);
          //     // 转换为数字 
          //     const sumValue = Number(sumNames[params.dataIndex]); // 获取对应的 sumName 并转换为数字 
          //     const percentage = sumValue ? ((value / sumValue) * 100).toFixed(2) : 0; //计算百分比并保留两位小数 
          //     return value ? `${percentage}%` : ''; // 显示值和百分比
          //   },
          //   offset: [0, -10],
          //   show: true,

          // },

        },
        {
          name: '常温系列',
          type: 'bar',
          data: nowboxData,
          barWidth: '10%',
          barGap: '70%',
          emphasis: {
            focus: 'series'
          },
          // label: {
          //   show: true,
          //   position: 'top',
          //   z: 10000,
          //   fontSize: 10,
          //   formatter: (params) => {
          //     const value = Number(nowboxData[params.dataIndex]);
          //     // 转换为数字 
          //     const sumValue = Number(sumNames[params.dataIndex]); // 获取对应的 sumName 并转换为数字 
          //     const percentage = sumValue ? ((value / sumValue) * 100).toFixed(2) : 0; //计算百分比并保留两位小数 
          //     return value ? `${percentage}%` : ''; // 显示值和百分比
          //   },
          //   offset: [0, 2],
          // },

        },
        {
          name: '果汁系列',
          type: 'bar',
          data: FruboxData,
          barWidth: '10%',
          barGap: '60%',
          emphasis: {
            focus: 'series'
          },
          // label: {
          //   show: true,
          //   position: 'top',
          //   z: 10000,
          //   fontSize: 10,
          //   formatter: (params) => {
          //     const value = Number(FruboxData[params.dataIndex]);
          //     // 转换为数字 
          //     const sumValue = Number(sumNames[params.dataIndex]); // 获取对应的 sumName 并转换为数字 
          //     const percentage = sumValue ? ((value / sumValue) * 100).toFixed(2) : 0; //计算百分比并保留两位小数 
          //     return value ? `${percentage}%` : ''; // 显示值和百分比
          //   },
          //   offset: [0, 3],
          // },

        },
        {
          name: '椰子牛乳系列',
          type: 'bar',
          data: yznlboxData,
          barWidth: '10%',
          barGap: '75%',
          emphasis: {
            focus: 'series'
          },
          // label: {
          //   show: true,
          //   position: 'top',
          //   z: 10000,
          //   fontSize: 10,
          //   formatter: (params) => {
          //     const value = Number(yznlboxData[params.dataIndex]);
          //     // 转换为数字 
          //     const sumValue = Number(sumNames[params.dataIndex]); // 获取对应的 sumName 并转换为数字 
          //     const percentage = sumValue ? ((value / sumValue) * 100).toFixed(2) : 0; //计算百分比并保留两位小数 
          //     return value ? `${percentage}%` : ''; // 显示值和百分比
          //   },
          //   offset: [0, -10],
          // },

        },
        {
          name: '椰子汁系列',
          type: 'bar',
          data: yzzboxData,
          barWidth: '10%',
          barGap: '75%',
          emphasis: {
            focus: 'series'
          },
          // label: {
          //   show: true,
          //   position: 'top',
          //   z: 10000,
          //   fontSize: 10,
          //   formatter: (params) => {
          //     const value = Number(yzzboxData[params.dataIndex]);
          //     // 转换为数字 
          //     const sumValue = Number(sumNames[params.dataIndex]); // 获取对应的 sumName 并转换为数字 
          //     const percentage = sumValue ? ((value / sumValue) * 100).toFixed(2) : 0; //计算百分比并保留两位小数 
          //     return value ? `${percentage}%` : ''; // 显示值和百分比
          //   },
          //   offset: [0, -2],
          // },

        },
        {
          name: '其它',
          type: 'bar',
          data: qtboxData,
          barWidth: '10%',
          barGap: '75%',
          emphasis: {
            focus: 'series'
          },
          // label: {
          //   show: true,
          //   position: 'top',
          //   z: 10000,
          //   fontSize: 10,
          //   formatter: (params) => {
          //     const value = Number(qtboxData[params.dataIndex]);
          //     // 转换为数字 
          //     const sumValue = Number(sumNames[params.dataIndex]); // 获取对应的 sumName 并转换为数字 
          //     const percentage = sumValue ? ((value / sumValue) * 100).toFixed(2) : 0; //计算百分比并保留两位小数 
          //     return value ? `${percentage}%` : ''; // 显示值和百分比
          //   },
          //   offset: [0, 5],
          // },

        },
          // {
          //   name: '小计',
          //   type: 'line', // 设置为折线图 
          //   data: sumNames, // 设置为 sumNames 的数据 
          //   emphasis: {
          //     focus: 'series'
          //   },
          //   label: {
          //     show: true,
          //     position: 'top',
          //     offset: [0, -10],
          //     textStyle: {
          //       color: '#006400', // 字体颜色  

          //     },

          //   },
          //   // 可选：在折线图上设置额外样式，例如：  
          //   lineStyle: {
          //     color: 'red', // 折线颜色 
          //     width: 2 // 折线宽度 
          //   },
          //   symbol: 'circle', // 折线图标的形状 
          //   symbolSize: 8, // 折线图标的大小 
          // }
        ],
      };

      // 使用刚指定的配置项和数据显示图表 
      this.myChart.setOption(option);
      this.myChart.on('click', (params) => {
        console.log('点击的横坐标名字:', params.name);
        this.$router.push({
          path: '/proSalesALL/proSalesitemfgs',
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
  padding: 0px !important;

}

;

::v-deep th.el-table__cell>.cell {
  padding: 0px !important;
}

;

::v-deep .el-table__header-wrapper {
  font-size: 14px;
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