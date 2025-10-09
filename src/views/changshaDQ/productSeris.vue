<template>
  <div>
    <div ref="chart" style="width:100%; height:400px;"></div>
    <el-form :inline="true" style="width: 60%; margin: 5px auto;">
      <el-button size="mini" class="filter-item" type="warning" icon="el-icon-download"
        @click="exportData">导出</el-button>
      <el-button class="filter-item" size="mini" type="primary" @click="Enterdetails">站点详情</el-button>
    </el-form>
    <el-table class="table" ref="table" border v-loading="dataListLoading" :data="mergedDataList"
      style="width: 60%; margin: 0 auto; margin-bottom: 50px;">
      <el-table-column :show-overflow-tooltip="true" align="center" prop="sqname" label="销售区域" />
      <el-table-column :show-overflow-tooltip="true" align="center" prop="ocustomerclassName" label="分公司办事处" />
      <el-table-column :show-overflow-tooltip="true" align="center" prop="lowSeries" label="低温系列" />
      <el-table-column :show-overflow-tooltip="true" align="center" prop="NorSeries" label="常温系列" />
      <el-table-column :show-overflow-tooltip="true" align="center" prop="FruitSeries" label="果汁系列" />
      <el-table-column :show-overflow-tooltip="true" align="center" prop="YzSeries" label="椰子牛乳系列" />
      <el-table-column :show-overflow-tooltip="true" align="center" prop="YzzSeries" label="椰子汁系列" />
      <el-table-column :show-overflow-tooltip="true" align="center" prop="QtSeries" label="其它" />
      <el-table-column prop="sum" align="center" label="小计" />
    </el-table>
  </div>
</template>

<script>
import * as api from '@/api/frame/customer.js'
import * as echarts from 'echarts';
import {
  exportExcel
} from './productSerisExpro.js'
export default {
  props: {
    startTime1: {
      type: String,
      required: true
    },
    endTime1: {
      type: String,
      required: true
    },
    message1: {
      type: String,
      required: true
    },
    message2: {
      type: String,
      required: true
    }
  },
  name: 'updata-page',
  data() {
    return {
      msg: 'updata-page',
      chartList: [],
      dataForm: {
        p_orgname: '',
        p_vouchdatestart: '',
        p_vouchdateend: ''
      },
      dataList: [],
      mergedDataList: [],
      dataListLoading: false
    };
  },
  mounted() {
    //   this.getDataList()
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
        path: '/changshaDQ/SQproduct',
        query: {
          param1: this.message2,
          enddata: this.dataForm.p_vouchdateend,
          startdate: this.dataForm.p_vouchdatestart
        }
      });
    },
    sumBoxes(array) {
      //计算 box 字段的总和 
      const sum = array.reduce((accumulator, current) => accumulator + current.box, 0);
      // 创建一个新对象并存储总和
      const result = { box: sum, ocustomerclassName: '合计' };
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
    exportData() {
      this.$confirm('是否导出表格数据到Excel？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {

        exportExcel(this.mergedDataList, '分子公司产品系列销售表.xlsx')

      })
    },

    getDataList() {
      this.dataListLoading = true
      this.dataForm.p_orgname = this.message1;
      this.dataForm.p_vouchdatestart = this.startTime1;
      this.dataForm.p_vouchdateend = this.endTime1;
      api.vProductXiCompanyAll(this.dataForm).then(res => {
        console.log(res, 'res')
        this.dataList = res
        this.dataList = this.dataList.filter(item => item.sqname === this.message2);
        const sumMap = new Map();
        // 遍历原数组，将 box 值相加  
        this.dataList.forEach(item => {
          if (sumMap.has(item.ocustomerclassName)) {
            sumMap.set(item.ocustomerclassName, sumMap.get(item.ocustomerclassName) + item.box);
          } else {
            sumMap.set(item.ocustomerclassName, item.box);
          }
        });
        // 创建修改后的数组  
        this.dataList = this.dataList.map(item => ({
          ...item, // 保留原对象的字段  
          sum: sumMap.get(item.ocustomerclassName) // 添加新字段 sum  
        }));
        this.dataListLoading = false
        this.dataList = this.sumBoxes(this.dataList);

        console.log(this.dataList, 11122)
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
            sqname: item.sqname,
            ocustomerclassName: item.ocustomerclassName,
            productClassPname: item.productClassPname,
            sum: item.sum
          };
        });

        this.mergedDataList = currData.reduce((acc, item) => {
          // 查找已存在的对象
          let existingOrg = acc.find(org => org.ocustomerclassName === item.ocustomerclassName);

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
          if (item.ocustomerclassName === "合计") {
            return {
              ...item,
              sum: item.box, // 将 box 的值赋给 
              box: undefined // 删除原来的 box 字段 
            };
          }
          return item; // 返回原对象
        });
        // 初始化总和变量
        let totalLowSeries = 0;
        let totalNorSeries = 0;
        let totalFruitSeries = 0;
        let totalYzSeries = 0;
        let totalQtSeries = 0;
        let totalYzzSeries = 0;

        // 遍历数据汇总
        this.mergedDataList.forEach(item => {
          totalLowSeries += item.lowSeries || 0;
          totalNorSeries += item.NorSeries || 0; // 确保值存在
          totalFruitSeries += item.FruitSeries || 0;
          totalYzSeries += item.YzSeries || 0;
          totalYzzSeries += item.YzzSeries || 0;
          totalQtSeries += item.QtSeries || 0;

        });

        // 将总和放入合计对象中
        const totalObject = this.mergedDataList.find(item => item.ocustomerclassName == "合计");
        if (totalObject) {
          totalObject.lowSeries = totalLowSeries;
          totalObject.NorSeries = totalNorSeries;
          totalObject.FruitSeries = totalFruitSeries;
          totalObject.YzSeries = totalYzSeries;
          totalObject.YzzSeries = totalYzzSeries;
          totalObject.QtSeries = totalQtSeries;

        }

        //预设的分类数据
        const data = ['低温系列', '常温系列', '果汁系列', '椰子牛乳系列', '椰子汁系列', '其它'];

        // 根据 ocustomerclassName 分组
        const groupedData = {};
        this.dataList.forEach(item => {
          if (!groupedData[item.ocustomerclassName]) {
            groupedData[item.ocustomerclassName] = []; // 初始化为空数组 
          }
          groupedData[item.ocustomerclassName].push(item); // 添加对象到对应的组
        });
        // console.log( 'groupedData', groupedData)


        // 检查每组，并添加缺失的分类
        for (const ocustomerclassName in groupedData) {
          const items = groupedData[ocustomerclassName];
          console.log('titems', items);
          // 提取现有的 productClassPname 
          const existingPnames = new Set(items.map(item => item.productClassPname));

          // 将原有数据添加到 this.chartList 中 
          this.chartList.push(...items);

          // 检查 data 中每个分类是否存在 
          data.forEach(pname => {
            if (!existingPnames.has(pname)) {
              // 如果不存在，新增一个对象，box 为0，其余字段相同 
              this.chartList.push({ productClassPname: pname, box: 0, ocustomerclassName: ocustomerclassName });
            }
          });
        }

        this.initChart()
        console.log(this.mergedDataList, 99999);

      })
    },
    initChart() {
      //横坐标
      const orgNames = [...new Set(this.chartList.filter(item => item.ocustomerclassName !== '合计').map(item => item.ocustomerclassName))];
      //合计
      const sumNames = [...new Set(this.dataList.filter(item => item.ocustomerclassName !== '合计').map(item => item.sum))];
      //总计
      const boxNames = [...new Set(this.dataList.filter(item => item.ocustomerclassName === '合计').map(item => item.sum))];

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
            fontSize: 10,
            formatter: (params) => {
              const value = Number(lowTempBoxes[params.dataIndex]);
              // 转换为数字 
              const sumValue = Number(sumNames[params.dataIndex]); // 获取对应的 sumName 并转换为数字 
              const percentage = sumValue ? ((value / sumValue) * 100).toFixed(2) : 0; //计算百分比并保留两位小数 
              return value ? `${percentage}%` : ''; // 显示值和百分比
            },
            offset: [0, -10],
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
            fontSize: 10,
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
            fontSize: 10,
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
            fontSize: 10,
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
            fontSize: 10,
            formatter: (params) => {
              const value = Number(YzzTempBoxes[params.dataIndex]);
              // 转换为数字 
              const sumValue = Number(sumNames[params.dataIndex]); // 获取对应的 sumName 并转换为数字 
              const percentage = sumValue ? ((value / sumValue) * 100).toFixed(2) : 0; //计算百分比并保留两位小数 
              return value ? `${percentage}%` : ''; // 显示值和百分比
            },
            offset: [0, -2],
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
            fontSize: 10,
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
            offset: [0, -10],
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
  font-size: 15px;
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