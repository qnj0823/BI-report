<template>
  <div class='salesitem'>
    <div ref="chart" style="width:100%; height:500px;"></div>

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


    <el-table class="table" ref="table" border v-loading="dataListLoading" :data="mergedDataList"
      style="width: 55%; margin: 0 auto; margin-bottom: 50px;">
      <el-table-column :show-overflow-tooltip="true" align="center" prop="orgname" label="销售部" />
      <!-- <el-table-column :show-overflow-tooltip="true" align="center" prop="productClassPname" label="产品系列" /> -->
      <el-table-column :show-overflow-tooltip="true" align="center" prop="lowSeries" label="低温系列" />
      <el-table-column :show-overflow-tooltip="true" align="center" prop="NorSeries" label="常温系列" />
      <el-table-column :show-overflow-tooltip="true" align="center" prop="FruitSeries" label="果汁系列" />
      <el-table-column :show-overflow-tooltip="true" align="center" width="100" prop="YzSeries" label="椰子牛乳系列" />
      <el-table-column :show-overflow-tooltip="true" align="center" width="100" prop="YzzSeries" label="椰子汁系列" />
      <el-table-column :show-overflow-tooltip="true" align="center" prop="QtSeries" label="其它" />
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
      mergedDataList: []
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
      this.mergedDataList = merged1List
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

        exportExcel(this.mergedDataList, '产品系列销售表.xlsx')

      })
    },



    sumBoxes(array) {
      //计算 box 字段的总和 
      const sum = array.reduce((accumulator, current) => accumulator + current.box, 0);
      // 创建一个新对象并存储总和
      const result = { box: sum, orgname: '合计' };
      // 将新对象推入数组 
      array.push(result);
      return array;
    },

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



    getDataList() {
      this.chartList = []
      this.dataListLoading = true
      console.log(this.dataForm.p_vouchdatestart,this.dataForm.p_vouchdateend)
      sessionStorage.setItem('startdateitem', this.dataForm.p_vouchdatestart);
      sessionStorage.setItem('enddateitem', this.dataForm.p_vouchdateend);
      api.vProductXiDqAll(this.dataForm).then(res => {
        this.dataList = res
        const sumMap = new Map();
        // 遍历原数组，将 box 值相加  
        this.dataList.forEach(item => {
          if (sumMap.has(item.orgname)) {
            sumMap.set(item.orgname, sumMap.get(item.orgname) + item.box);
          } else {
            sumMap.set(item.orgname, item.box);
          }
        });
        // 创建修改后的数组  
        this.dataList = this.dataList.map(item => ({
          ...item, // 保留原对象的字段  
          sum: sumMap.get(item.orgname) // 添加新字段 sum  
        }));
        this.dataListLoading = false

        console.log(this.dataList, 122233)


        const currData = this.dataList.map(item => {
          // 确定新的属性名 
          let newFieldName;
          switch (item.productClassPname) {
            case "低温系列":
              newFieldName = "lowSeries";
              break;
            case "常温系列":
              newFieldName = "NorSeries";
              break;
            case "果汁系列":
              newFieldName = "FruitSeries";
              break;
            case "椰子牛乳系列":
              newFieldName = "YzSeries";
              break;
            case "椰子汁系列":
              newFieldName = "YzzSeries";
              break;
            case "其它":
              newFieldName = "QtSeries";
              break;
            default:
              newFieldName = "box"; // 如果没有匹配的项，保持原字段名 
          }

          // 创建一个新的对象，使用新字段名并保留原 box 值 
          return {
            [newFieldName]: item.box, // 使用动态属性名 
            orgname: item.orgname,
            productClassPname: item.productClassPname,
            sum: item.sum
          };
        });

        this.mergedDataList = currData.reduce((acc, item) => {
          // 查找已存在的对象
          let existingOrg = acc.find(org => org.orgname === item.orgname);

          if (existingOrg) {
            // 如果找到了，合并当前对象的字段 
            Object.assign(existingOrg, item); // 将 item 的字段合并到 
            existingOrg
          } else {
            // 如果没有找到，将当前对象添加到数组 
            acc.push({ ...item }); // 使用展开运算符复制当前对象 
          }

          return acc; // 返回累加器
        }, []);
        this.mergedDataList = this.mergedDataList.map(item => {
          // 检查 orgname 是否为 "合计"  
          if (item.orgname === "合计") {
            return {
              ...item,
              sum: item.box, // 将 box 的值赋给 
              box: undefined // 删除原来的 box 字段 
            };
          }
          return item; // 返回原对象
        });

        // 指定需要累加的字段
        const fieldsToSum = ['FruitSeries', 'NorSeries', 'QtSeries', 'YzSeries', 'YzzSeries', 'lowSeries','sum'];

        // 使用 reduce 方法计算合计
        const total = this.mergedDataList.reduce((acc, obj) => {
          fieldsToSum.forEach(field => {
            acc[field] = (acc[field] || 0) + (obj[field] || 0);
          });
          return acc;
        }, {});

        // 创建合计对象
        const totalObject = { orgname: "合计", ...total };

        // 将合计对象添加到原数组中
        this.mergedDataList.push(totalObject);


        console.log(this.mergedDataList, 99999);
        sessionStorage.setItem('merged', JSON.stringify(this.mergedDataList));
        sessionStorage.setItem('data', JSON.stringify(this.dataList));


        console.log(1122222, this.dataList)

        //预设的分类数据
        const data = ['低温系列', '常温系列', '果汁系列', '椰子牛乳系列', '椰子汁系列', '其它'];

        // 根据 orgname 分组
        const groupedData = {};
        this.dataList.forEach(item => {
          if (!groupedData[item.orgname]) {
            groupedData[item.orgname] = []; // 初始化为空数组 
          }
          groupedData[item.orgname].push(item); // 添加对象到对应的组
        });
        // console.log( 'groupedData', groupedData)


        // 检查每组，并添加缺失的分类
        for (const orgname in groupedData) {
          const items = groupedData[orgname];
          console.log('titems', items);
          // 提取现有的 productClassPname 
          const existingPnames = new Set(items.map(item => item.productClassPname));

          // 将原有数据添加到 this.chartList 中 
          this.chartList.push(...items);

          // 检查 data 中每个分类是否存在 
          data.forEach(pname => {
            if (!existingPnames.has(pname)) {
              // 如果不存在，新增一个对象，box 为0，其余字段相同 
              this.chartList.push({ productClassPname: pname, box: 0, orgname: orgname });
            }
          });
        }


        // 输出结果
        console.log(1111111, this.dataList)
        console.log(this.chartList, 6666666);
        sessionStorage.setItem('chart', JSON.stringify(this.chartList));

        this.initChart()

      })
    },
    initChart() {
      //横坐标
      const orgNames = [...new Set(this.chartList.filter(item => item.orgname !== '合计').map(item => item.orgname))];
      //合计
      const sumNames = [...new Set(this.dataList.filter(item => item.orgname !== '合计').map(item => item.sum))];
      //总计
      const boxNames = [...new Set(this.dataList.filter(item => item.orgname === '合计').map(item => item.sum))];

      const lowTempBoxes = this.chartList.filter(item => item.productClassPname === '低温系列') //过滤低温系列 
        .map(item => item.box); // 提取 box 值// 如果没有低温系列的对象，返回0；否则返回 box 值数组
      console.log(lowTempBoxes, 1);

      const OrdTempBoxes = this.chartList.filter(item => item.productClassPname === '常温系列') //过滤低温系列 
        .map(item => item.box); // 提取 box 值// 如果没有低温系列的对象，返回0；否则返回 box 值数组
      console.log(OrdTempBoxes, 2);

      const FruTempBoxes = this.chartList.filter(item => item.productClassPname === '果汁系列') //过滤低温系列 
        .map(item => item.box); // 提取 box 值// 如果没有低温系列的对象，返回0；否则返回 box 值数组
      console.log(FruTempBoxes, 3);

      const YzTempBoxes = this.chartList.filter(item => item.productClassPname === '椰子牛乳系列') //过滤低温系列 
        .map(item => item.box); // 提取 box 值// 如果没有低温系列的对象，返回0；否则返回 box 值数组
      console.log(YzTempBoxes, 4);

      const QtTempBoxes = this.chartList.filter(item => item.productClassPname === '其它') //过滤低温系列 
        .map(item => item.box); // 提取 box 值// 如果没有低温系列的对象，返回0；否则返回 box 值数组
      console.log(QtTempBoxes, 5);

      const YzzTempBoxes = this.chartList.filter(item => item.productClassPname === '椰子汁系列') //过滤低温系列 
        .map(item => item.box); // 提取 box 值// 如果没有低温系列的对象，返回0；否则返回 box 值数组
      console.log(QtTempBoxes, 6);



      // 初始化 ECharts 实例 
      this.myChart = echarts.init(this.$refs.chart);
      const option = {
        // title: {
        //   text: '各战区产品销售数量',
        // },
        tooltip: {},
        legend: {
          data: this.dataList[0].productClassPnames,
        },
        xAxis: {
          type: 'category',
          data: orgNames,
        },
        yAxis: {},
        series: [{
          name: '低温系列',
          type: 'bar',
          data: lowTempBoxes,
          barWidth: '10%',
          barGap: '60%',
          // barCategoryGap: '30%',
          emphasis: {
            focus: 'series'
          },
          label: {
            position: 'top',
            z: 10000,
            formatter: (params) => {
              const value = Number(lowTempBoxes[params.dataIndex]);
              // 转换为数字 
              const sumValue = Number(sumNames[params.dataIndex]); // 获取对应的 sumName 并转换为数字 
              const percentage = sumValue ? ((value / sumValue) * 100).toFixed(2) : 0; //计算百分比并保留两位小数 
              return value ? `${percentage}%` : ''; // 显示值和百分比
            },
            offset: [0, -5],
            show: true,

          },

        },
        {
          name: '常温系列',
          type: 'bar',
          data: OrdTempBoxes,
          barWidth: '10%',
          barGap: '70%',
          emphasis: {
            focus: 'series'
          },
          label: {
            show: true,
            position: 'top',
            z: 10000,
            formatter: (params) => {
              const value = Number(OrdTempBoxes[params.dataIndex]);
              // 转换为数字 
              const sumValue = Number(sumNames[params.dataIndex]); // 获取对应的 sumName 并转换为数字 
              const percentage = sumValue ? ((value / sumValue) * 100).toFixed(2) : 0; //计算百分比并保留两位小数 
              return value ? `${percentage}%` : ''; // 显示值和百分比
            },
            offset: [0, 2],
          },

        },
        {
          name: '果汁系列',
          type: 'bar',
          data: FruTempBoxes,
          barWidth: '10%',
          barGap: '60%',
          emphasis: {
            focus: 'series'
          },
          label: {
            show: true,
            position: 'top',
            z: 10000,

            formatter: (params) => {
              const value = Number(FruTempBoxes[params.dataIndex]);
              // 转换为数字 
              const sumValue = Number(sumNames[params.dataIndex]); // 获取对应的 sumName 并转换为数字 
              const percentage = sumValue ? ((value / sumValue) * 100).toFixed(2) : 0; //计算百分比并保留两位小数 
              return value ? `${percentage}%` : ''; // 显示值和百分比
            },
            offset: [0, 3],
          },

        },
        {
          name: '椰子牛乳系列',
          type: 'bar',
          data: YzTempBoxes,
          barWidth: '10%',
          barGap: '75%',
          emphasis: {
            focus: 'series'
          },
          label: {
            show: true,
            position: 'top',
            z: 10000,
            formatter: (params) => {
              const value = Number(YzTempBoxes[params.dataIndex]);
              // 转换为数字 
              const sumValue = Number(sumNames[params.dataIndex]); // 获取对应的 sumName 并转换为数字 
              const percentage = sumValue ? ((value / sumValue) * 100).toFixed(2) : 0; //计算百分比并保留两位小数 
              return value ? `${percentage}%` : ''; // 显示值和百分比
            },
            offset: [0, -10],
          },

        },
        {
          name: '椰子汁系列',
          type: 'bar',
          data: YzzTempBoxes,
          barWidth: '10%',
          barGap: '75%',
          emphasis: {
            focus: 'series'
          },
          label: {
            show: true,
            position: 'top',
            z: 10000,
            formatter: (params) => {
              const value = Number(YzzTempBoxes[params.dataIndex]);
              // 转换为数字 
              const sumValue = Number(sumNames[params.dataIndex]); // 获取对应的 sumName 并转换为数字 
              const percentage = sumValue ? ((value / sumValue) * 100).toFixed(2) : 0; //计算百分比并保留两位小数 
              return value ? `${percentage}%` : ''; // 显示值和百分比
            },
            offset: [0, -10],
          },

        },
        {
          name: '其它',
          type: 'bar',
          data: QtTempBoxes,
          barWidth: '10%',
          barGap: '75%',
          emphasis: {
            focus: 'series'
          },
          label: {
            show: true,
            position: 'top',
            z: 10000,
            formatter: (params) => {
              const value = Number(QtTempBoxes[params.dataIndex]);
              // 转换为数字 
              const sumValue = Number(sumNames[params.dataIndex]); // 获取对应的 sumName 并转换为数字 
              const percentage = sumValue ? ((value / sumValue) * 100).toFixed(2) : 0; //计算百分比并保留两位小数 
              return value ? `${percentage}%` : ''; // 显示值和百分比
            },
            offset: [0, 5],
          },

        },
        {
          name: '小计',
          type: 'line', // 设置为折线图 
          data: sumNames, // 设置为 sumNames 的数据 
          emphasis: {
            focus: 'series'
          },
          label: {
            show: true,
            position: 'top',
            offset: [0, -20],
            textStyle: {
              color: '#006400', // 字体颜色  

            },

          },
          // 可选：在折线图上设置额外样式，例如：  
          lineStyle: {
            color: 'red', // 折线颜色 
            width: 2 // 折线宽度 
          },
          symbol: 'circle', // 折线图标的形状 
          symbolSize: 8, // 折线图标的大小 
        }
        ],
      };

      // 使用刚指定的配置项和数据显示图表 
      this.myChart.setOption(option);
      this.myChart.on('click', (params) => {
        console.log('点击的横坐标名字:', params.name);
        this.$router.push({
          path: '/ProSales/proSalesitemfgs',
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
  padding: 10px !important;

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