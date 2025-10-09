<template>
  <div class='pursue'>

    <div>
      <!-- <iframe src="http://bi.yufanjtbip.com:50401/dv/bbc3e2d881928fc7d97e/?DG_SAFE_SESSION=1"
        style="width:100%;height:800px;border:0;"></iframe> -->
      <div id="stacked-bar-chart" style="width: 100%; height: 400px;"></div>


      <el-form :inline="true" style="width: 90%; margin: 0 auto; display: flex; justify-content: space-between;"
        :model="dataForm" @submit.native.prevent>
        <el-form-item>
          <el-form-item>
            <el-date-picker v-model="dataForm.p_vouchdatecur" value-format="yyyy-MM-dd" type="date" placeholder="选择日期"
              clearable style="width: 100%"></el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button class="filter-item" size="mini" type="success" icon="el-icon-search"
              @click="checkDataList">查询</el-button>
            <el-button size="mini" class="filter-item" type="warning" icon="el-icon-download"
              @click="exportData">导出</el-button>
            <el-button size="mini" class="filter-item" type="primary" icon="el-icon-sort" @click="outDataList">{{
              buttonTextout }}</el-button>
          </el-form-item>
        </el-form-item>
        <el-form-item>
          <el-button size="mini" class="filter-item" type="primary" icon="el-icon-sort" @click="setDataList">{{
            buttonText }}</el-button>
        </el-form-item>
      </el-form>

      <el-table class="table" ref="table" v-loading="dataListLoading" :data="dataList"
        style=" width: 90%; margin: 0 auto; margin-bottom: 50px;">
        <el-table-column :show-overflow-tooltip="true" align="center" prop="ocustomerClass_name" label="项目组" />
        <el-table-column :show-overflow-tooltip="true" align="center" prop="goalvalue" label="本月挑战目标" />
        <el-table-column :show-overflow-tooltip="true" width="110" align="center" prop="sumallorder_today"
          label="今日报单（全品）" />
        <el-table-column :show-overflow-tooltip="true" :label="getTotalTarget()" align="center">
          <el-table-column :show-overflow-tooltip="true" align="center" prop="sumlooknumLeiji" label="老品">
            <el-table-column :show-overflow-tooltip="true" width="120" align="center" prop="sumLookLowNum_leiji"
              label="低温系列+330/310">
            </el-table-column>
            <el-table-column :show-overflow-tooltip="true" align="center" prop="sumyuanweinumLeiji" label="同比增幅">
            </el-table-column>
          </el-table-column>
          <el-table-column :show-overflow-tooltip="true" align="center" label="新品（标准件）">
            <el-table-column :show-overflow-tooltip="true" align="center" prop="sumLookNormalNum_leiji" label="常温系列">
            </el-table-column>
            <el-table-column :show-overflow-tooltip="true" align="center" prop="sumYeZiNum_leiji" label="1L椰子牛乳">
            </el-table-column>
            <el-table-column :show-overflow-tooltip="true" align="center" prop="sumYeZiZhi_leiji" label="椰子汁系列">
            </el-table-column>
            <el-table-column :show-overflow-tooltip="true" align="center" prop="sumGuoZhiNum_leiji" label="果汁系列">
            </el-table-column>
          </el-table-column>
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" align="center" width="120" prop="sum_leiji_all"
          :label="getTotalTarget1()" />
        <el-table-column :show-overflow-tooltip="true" align="center" prop="completion_rate" label="全品完成率" />
        <el-table-column :show-overflow-tooltip="true" align="center" prop="" label="全品累计增幅" />
      </el-table>
    </div>
  </div>
</template>

<script>

import * as api from '@/api/sales/salesAll.js'
import {
  exportExcel
} from './SalesPursueExpro.js'
import * as echarts from 'echarts';
import { data } from 'vue-echarts';
export default {
  name: 'pursue-page',
  data() {
    return {
      msg: 'pursue-page',
      dataForm: {
        p_vouchdatecur: '',
        type: ''
      },
      buttonText: '标准件转换',
      buttonTextout: '出库数据取值',
      myChart: null,
      option: null,
      dataList: [],
      categories1: [],
      dataList1: [],
      dataListLoading: false,
      setshow: false,
      positiveLookNormalNum: [],
      negativeLookNormalNum: []
    };
  },
  created() {
    this.getCurrentDate()
  },
  mounted() {
    // this.getDataList()
    const data = sessionStorage.getItem('dataList');
    const startdate = sessionStorage.getItem('dataList1');
    const enddate = sessionStorage.getItem('categories1');
    const typedata = sessionStorage.getItem('type');
    if (typedata == '') {
      const dataList = JSON.parse(data);
      const enddate1 = JSON.parse(enddate);
      const startdate1 = JSON.parse(startdate);
      this.dataList = dataList
      this.dataList1 = startdate1
      this.buttonText = '标准件转换'
      this.buttonTextout = '出库数据取值'
      // sessionStorage.removeItem('buttonouttype'); // 这行代码会清除缓存 
      this.initChart(enddate1);
    } else if (typedata == '1') {
      const dataList = JSON.parse(data);
      const enddate1 = JSON.parse(enddate);
      const startdate1 = JSON.parse(startdate);
      this.dataList = dataList
      this.dataList1 = startdate1
      this.buttonText = '取消转换标准件'
      this.buttonTextout = '出库数据取值'
      // sessionStorage.removeItem('buttonouttype'); // 这行代码会清除缓存 
      this.initChart(enddate1);
    } else if (typedata == '2') {
      const dataList = JSON.parse(data);
      const enddate1 = JSON.parse(enddate);
      const startdate1 = JSON.parse(startdate);
      this.dataList = dataList
      this.dataList1 = startdate1
      this.buttonText = '标准件转换'
      this.buttonTextout = '取消出库数据取值'
      // sessionStorage.removeItem('buttonouttype'); // 这行代码会清除缓存 
      this.initChart(enddate1);
    } else if (typedata == '3') {
      const dataList = JSON.parse(data);
      const enddate1 = JSON.parse(enddate);
      const startdate1 = JSON.parse(startdate);
      this.dataList = dataList
      this.dataList1 = startdate1
      this.buttonText = '取消标准件转换'
      this.buttonTextout = '取消出库数据取值'
      // sessionStorage.removeItem('buttonouttype'); // 这行代码会清除缓存 
      this.initChart(enddate1);
    } else {
      this.getDataList()
    }
    // if (data) {
    //   const dataList = JSON.parse(data);
    //   const enddate1 = JSON.parse(enddate);
    //   const startdate1 = JSON.parse(startdate);
    //   this.dataList = dataList
    //   this.dataList1 = startdate1
    //   // sessionStorage.removeItem('buttonouttype'); // 这行代码会清除缓存 
    //   this.initChart(enddate1);
    // } else {
    //   this.getDataList()
    // }

    window.addEventListener('resize', this.onResize); // 处理窗口大小变化
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.onResize);
    if (this.myChart) {
      this.myChart.dispose(); // 清理图表实例  

    }
  },
  methods: {
    //正数提取
    extractNegativesAndReplaceWithZero(arr) {
      const negatives = []; // 存放负数的数组  

      for (let i = 0; i < arr.length; i++) {
        if (arr[i] < 0) {
          negatives.push(arr[i]); // 记录负数  
          arr[i] = 0; // 将原数组中的负数替换为0  
        }
      }

      return { negatives, modifiedArray: arr }; // 返回负数数组和修改后的原数组  
    },
    //负数提取
    extractNegativesAndReplaceWithplural(arr) {
      const negatives = new Array(arr.length).fill(0); // 新数组，同样长度，初始为0  

      for (let i = 0; i < arr.length; i++) {
        if (arr[i] < 0) {
          negatives[i] = arr[i]; // 在对应位置存放负数  
        } else {
          arr[i] = 0; // 将原数组中的非负数替换为0  
        }
      }

      return { negatives, modifiedArray: arr }; // 返回负数数组和修改后的原数组  
    },

    initChart(value) {
      const chartDom = document.getElementById('stacked-bar-chart');
      this.myChart = echarts.init(chartDom);

      // 随机生成数据  
      const categories = value;
      const seriesData = [
        { name: '新品', data: this.generateRandomData(categories.length) },
        { name: '老品', data: this.generateRandomData(categories.length) },
        { name: '差额', data: this.generateRandomData(categories.length) },
        { name: '超额完成数量', data: this.generateRandomData(categories.length) },
      ];
      const goalValues = this.dataList1.map(item => parseFloat(item.sumLookLowNum_leiji)); // 目标值  
      const completionRate = this.dataList1.map(item => parseFloat(item.completion_rate));
      const sumAllOrderToday = this.dataList1.map(item => {
        return parseFloat(item.sumLookNormalNum_leiji || 0) +
          parseFloat(item.sumYeZiNum_leiji || 0) +
          parseFloat(item.sumyuanweinumLeiji || 0) +
          parseFloat(item.sumGuoZhiNum_leiji || 0) +
          parseFloat(item.sumYeZiZhi_leiji || 0);
      });
      // 获取目标值和今日订单量  
      const sumGuoZhiNum = this.dataList1.map(item => parseFloat(item.goalvalue)); // 目标值  
      const sumLookLowNum = this.dataList1.map(item => parseFloat(item.sum_leiji_all)); // 今日订单量   

      // 计算未完成数量  
      const sumLookNormalNum = sumGuoZhiNum.map((goal, index) => goal - sumLookLowNum[index]);
      //正数
      const result = this.extractNegativesAndReplaceWithZero([...sumLookNormalNum]);
      //负数
      const result1 = this.extractNegativesAndReplaceWithplural([...sumLookNormalNum])
      //获取正数
      this.positiveLookNormalNum = result.modifiedArray;
      //获取负数
      this.negativeLookNormalNum = result1.modifiedArray

      this.negativeLookNormalNum = this.negativeLookNormalNum.map(num => Math.abs(num));
      console.log(this.positiveLookNormalNum, this.negativeLookNormalNum)



      this.option = {
        // title: {
        //   text: '堆叠柱状图示例',
        // },
        tooltip: {
          trigger: 'axis',
          formatter: function (params) {
            let tooltipContent = `${params[0].name}<br/>`; // 获取x轴名称 
            params.forEach(param => {
              tooltipContent += `  
                <span style="display: inline-block; width: 10px; height: 10px; background-color: ${param.color}; margin-right: 5px;"></span>  
                ${param.seriesName}: ${param.data}<br/>`; // 添加每个系列的值，并设置颜色  
            });
            const goalValue = sumGuoZhiNum[params[0].dataIndex] || 0; // 获取目标值  
            tooltipContent += `目标值: ${goalValue}<br/>`; // 显示目标值  

            return tooltipContent;
          }
        },
        legend: {
          data: seriesData.map(item => item.name),
          top: '5%',
        },
        grid: {
          left: '10%', // 左侧留白  
          right: '10%', // 右侧留白  
          top: '15%', // 顶部留白  
          bottom: '15%', // 底部留白  
        },
        xAxis: {
          type: 'category',
          data: categories,
          axisLabel: {
            interval: 0, // 设置为 0 以确保所有标签都显示  
            rotate: 20, // 旋转30度可以防止文本重叠  
          },
        },
        yAxis: {
          type: 'value',

        },
        series: [
          {
            name: '新品',
            type: 'bar',
            stack: '总量',
            data: sumAllOrderToday,
            emphasis: {
              focus: 'series'
            },
            itemStyle: {
              color: '#1f77b4', // 目标值颜色  
            },
            barWidth: '40%', // 调整柱子宽度
            barGap: '-100%',

          },
          {
            name: '老品',
            type: 'bar',
            stack: '总量',
            data: goalValues,
            emphasis: {
              focus: 'series'
            },
            itemStyle: {
              color: 'rgba(255, 165, 0, 0.8)', // 今日订单量颜色  
            },
            barWidth: '20%', // 调整柱子宽度
            barGap: '-100%'
          },
          {
            name: '超额完成数量',
            type: 'bar',
            stack: '总量',
            data: this.negativeLookNormalNum,
            emphasis: {
              focus: 'series'
            },
            itemStyle: {
              color: '#ccccfc', // 今日订单量颜色  
            },
            barWidth: '20%', // 调整柱子宽度

          },
          {
            name: '差额',
            type: 'bar',
            stack: '总量',
            data: this.positiveLookNormalNum,
            emphasis: {
              focus: 'series'
            },
            itemStyle: {
              color: '#ff5733',
            },
            barWidth: '20%', // 调整柱子宽度
            label: {
              show: true,
              position: 'top',
              z: 10000,
              offset: [0, -10],
              formatter: (params) => completionRate[params.dataIndex] ? completionRate[params.dataIndex].toFixed(2) + '%' : '',
              textStyle: {
                color: '#006400', // 字体颜色  
                textBorderColor: '#ffffff', // 可选：设置边框颜色  
                textBorderWidth: 2, // 可选：设置边框宽度  
              },

            },
          },

        ],
      };

      this.myChart.setOption(this.option);
    },

    generateRandomData(length) {
      return Array.from({ length }, () => Math.floor(Math.random() * 10) + 1);
    },

    onResize() {
      if (this.myChart) {
        this.myChart.resize(); // 处理图表尺寸调整  
      }
    },


    getTotalTarget() {
      // 从字符串中创建一个 Date 对象  
      const date = new Date(this.dataForm.p_vouchdatecur);
      // 获取月份（注意：月份从0开始，因此需要加1）  
      const month = date.getMonth() + 1; // 结果是 4  
      return `${month}月累计报单`;
    },
    getTotalTarget1() {
      // 从字符串中创建一个 Date 对象  
      const date = new Date(this.dataForm.p_vouchdatecur);
      // 获取月份（注意：月份从0开始，因此需要加1）  
      const month = date.getMonth() + 1; // 结果是 4  
      return `${month}月累计报单(全品)`;
    },
    //获取初始时间
    getCurrentDate() {
      const date = new Date();
      const year = date.getFullYear();
      let startmonth = String(date.getMonth() + 1).padStart(2, '0'); // 月份从0开始，需要加1
      let startday = String(date.getDate()).padStart(2, '0');
      let currentDate = `${year}-${startmonth}-${startday}`;
      this.dataForm.p_vouchdatecur = currentDate
      console.log(currentDate)
    },
    //标准件转换
    setDataList() {
      this.buttonText = this.buttonText === '标准件转换' ? '取消转换标准件' : '标准件转换';
      if (this.buttonTextout === '取消出库数据取值') {
        if (this.buttonText === '取消转换标准件') {
          this.dataForm.type = 3
          this.getDataList()
        } else {
          this.dataForm.type = 2
          this.getDataList()
        }

      } else if (this.buttonTextout === '出库数据取值') {
        if (this.buttonText === '取消转换标准件') {
          this.dataForm.type = 1
          this.getDataList()
        } else {
          this.dataForm.type = ''
          this.getDataList()
        }
      }
    },
    //出库数据取值
    outDataList() {
      this.buttonTextout = this.buttonTextout === '出库数据取值' ? '取消出库数据取值' : '出库数据取值';
      if (this.buttonTextout === '取消出库数据取值') {
        if (this.buttonText === '取消转换标准件') {
          this.dataForm.type = 3
          this.getDataList()
        } else {
          this.dataForm.type = 2
          this.getDataList()
        }
      } else {
        if (this.buttonText === '取消转换标准件') {
          this.dataForm.type = 1
          this.getDataList()
        } else {
          this.dataForm.type = ''
          this.getDataList()
        }
      }
    },
    //查询
    checkDataList() {
      if (this.buttonTextout === '取消出库数据取值') {
        if (this.buttonText === '取消转换标准件') {
          this.dataForm.type = 3
          this.getDataList()
        } else {
          this.dataForm.type = 2
          this.getDataList()
        }

      } else if (this.buttonTextout === '出库数据取值') {
        if (this.buttonText === '取消转换标准件') {
          this.dataForm.type = 1
          this.getDataList()
        } else {
          this.dataForm.type = ''
          this.getDataList()
        }
      }
    },

    getDataList() {
      this.dataListLoading = true
      console.log(this.dataForm.type, 'type')

      sessionStorage.setItem('type', JSON.stringify(this.dataForm.type));
      api.BdprojectTeamall(this.dataForm).then(res => {
        this.dataList = res
        this.dataList = this.dataList.map(item => {
          return {
            sumGuoZhiNum_leiji: parseFloat(item.sumGuoZhiNum_leiji).toFixed(0),
            sumLookLowNum_leiji: parseFloat(item.sumLookLowNum_leiji).toFixed(0),
            sumLookNormalNum_leiji: parseFloat(item.sumLookNormalNum_leiji).toFixed(0),
            sumYeZiNum_leiji: parseFloat(item.sumYeZiNum_leiji).toFixed(0),
            sum_leiji_all: parseFloat(item.sum_leiji_all).toFixed(0),
            sumallorder_today: parseFloat(item.sumallorder_today).toFixed(0),
            ocustomerClass_name: item.ocustomerClass_name,
            goalvalue: item.goalvalue,
            completion_rate: item.completion_rate === '∞%' ? '0.00%' : item.completion_rate,
            sumYeZiZhi_leiji: parseFloat(item.sumYeZiZhi_leiji).toFixed(0),
          };
        });

        this.dataList.forEach(item => {
          item.ocustomerClass_name = item.ocustomerClass_name.replace(/\d+/g, '').trim();
        });
        this.dataList.forEach(item => {
          // 检查 goalvalue 和 sum_leiji_all 是否都是 0  
          if (parseFloat(item.goalvalue) === 0 && parseFloat(item.sum_leiji_all) === 0) {
            item.completion_rate = '0.00%';
          }
          //  else {
          //   // 计算 completion_rate  
          //   // 这里可以根据需求按实际逻辑计算 completion_rate，如果有需要  
          //   // 举个例子：将满足条件的 completion_rate 设置为一个计算值  
          //   let completion = (parseFloat(item.sum_leiji_all) / parseFloat(item.goalvalue)) * 100;
          //   item.completion_rate = `${completion.toFixed(2)}%`;
          // }
        });
        // 如果要按降序排序，可以反转比较：  
        this.dataList = this.dataList.sort((a, b) => {
          const goalValueA = parseFloat(a.goalvalue);
          const goalValueB = parseFloat(b.goalvalue);

          // Check if goalvalue is non-zero  
          const isGoalValueANonZero = goalValueA !== 0;
          const isGoalValueBNonZero = goalValueB !== 0;

          // First, prioritize non-zero goalvalues  
          if (isGoalValueANonZero && !isGoalValueBNonZero) return -1; // a comes first  
          if (!isGoalValueANonZero && isGoalValueBNonZero) return 1; // b comes first  

          // If both or neither have non-zero goalvalue, sort by completion_rate  
          const rateA = parseFloat(a.completion_rate) / 100;
          const rateB = parseFloat(b.completion_rate) / 100;

          return rateB - rateA; // Descending order  
        });
        // 计算合计  
        const total = this.dataList.reduce((acc, item) => {
          acc.sumGuoZhiNum_leiji += parseFloat(item.sumGuoZhiNum_leiji);
          acc.sumLookLowNum_leiji += parseFloat(item.sumLookLowNum_leiji);
          acc.sumLookNormalNum_leiji += parseFloat(item.sumLookNormalNum_leiji);
          acc.sumYeZiNum_leiji += parseFloat(item.sumYeZiNum_leiji);
          acc.sum_leiji_all += parseFloat(item.sum_leiji_all);
          acc.sumallorder_today += parseFloat(item.sumallorder_today);
          acc.goalvalue += parseFloat(item.goalvalue) || 0;
          acc.sumYeZiZhi_leiji += parseFloat(item.sumYeZiZhi_leiji);
          return acc;
        }, {
          sumGuoZhiNum_leiji: 0,
          sumLookLowNum_leiji: 0,
          sumLookNormalNum_leiji: 0,
          sumYeZiNum_leiji: 0,
          sum_leiji_all: 0,
          sumallorder_today: 0,
          goalvalue: 0,
          sumYeZiZhi_leiji: 0
        });

        // 添加合计对象  
        const summary = {
          ocustomerClass_name: '合计',
          sumGuoZhiNum_leiji: total.sumGuoZhiNum_leiji.toFixed(0),
          sumLookLowNum_leiji: total.sumLookLowNum_leiji.toFixed(0),
          sumLookNormalNum_leiji: total.sumLookNormalNum_leiji.toFixed(0),
          sumYeZiNum_leiji: total.sumYeZiNum_leiji.toFixed(0),
          sum_leiji_all: total.sum_leiji_all.toFixed(0),
          sumallorder_today: total.sumallorder_today.toFixed(0),
          goalvalue: total.goalvalue.toFixed(0),
          sumYeZiZhi_leiji: total.sumYeZiZhi_leiji.toFixed(0),
          completion_rate: (total.goalvalue === 0 || isNaN((total.sum_leiji_all / total.goalvalue) * 100))
            ? '0.00%'
            : ((total.sum_leiji_all / total.goalvalue) * 100).toFixed(2) + '%'

        };

        // 将合计对象添加到数据数组中  
        this.dataList.push(summary);

        this.categories1 = this.dataList
          .filter(item => item.ocustomerClass_name !== '合计') // 先过滤掉 "合计"  
          .map(item => item.ocustomerClass_name); // 然后提取 ocustomerClass_name  
        this.dataList1 = this.dataList

          .filter(item => item.ocustomerClass_name !== '合计') // 先过滤掉 "合计" 
        console.log(this.dataList1, 5555666)
        sessionStorage.setItem('dataList', JSON.stringify(this.dataList));
        sessionStorage.setItem('dataList1', JSON.stringify(this.dataList1));
        sessionStorage.setItem('categories1', JSON.stringify(this.categories1));
        console.log(this.categories1)
        this.initChart(this.categories1);
        this.dataListLoading = false
        this.dataForm.type = ''
      })

    },
    exportData() {
      this.$confirm('是否导出表格数据到Excel?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        exportExcel(this.dataList, '目标销量表.xlsx')
        // this.dataListLoading = true
        // api.BdallCustomer(this.dataForm1).then(res => {
        //   this.exportList = res
        //   this.exportList.forEach(item => {
        //     const levels = item.levelName.split(' -> ');
        //     item.levelName1 = levels[0] || "";
        //     // 去掉 levelName2 中的数字  
        //     item.levelName2 = levels[1] ? levels[1].replace(/\d+/g, '').trim() : "";
        //     item.levelName3 = levels[2] || "";
        //     this.dataListLoading = false
        //   });
        //   console.log(this.exportList)
        //   // return
        //   exportExcel(this.exportList, '业务框架/客户表.xlsx')
        // })
      })
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
</style>
