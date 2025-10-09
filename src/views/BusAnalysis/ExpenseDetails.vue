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
          @click="handleClick">查询</el-button>
      </el-form-item>
      <el-button size="mini" class="filter-item" type="warning" icon="el-icon-download" @click="exportData">导出</el-button>
    </el-form>
    <div style="width: 95%; margin: 0 auto;">
      <el-button class="filter-item" size="mini" :type="activeButton === 'header' ? 'primary' : 'success'"
        @click="handleButtonClick('header')">表头</el-button>
      <el-button class="filter-item" size="mini" :type="activeButton === 'headerDetail' ? 'primary' : 'success'"
        @click="handleButtonClick('headerDetail')">表头+明细</el-button>
    </div>
    <div v-if="tableshow">
      <el-table class="table" ref="table" max-height="600" v-loading="dataListLoading" :data="currentData1"
        style="width: 100%;">
        <el-table-column :show-overflow-tooltip="true" fixed align="center" width="80" prop="levelName1" label="战区" />
        <el-table-column :show-overflow-tooltip="true" fixed align="center" width="80" prop="levelName2" label="销售区域" />
        <el-table-column :show-overflow-tooltip="true" fixed align="center" prop="levelName3" label="分公司/办事处" />
        <el-table-column :show-overflow-tooltip="true" fixed align="center" prop="custname" label="客户名称 " />
        <el-table-column fixed align="center" prop="startdata" width="100" label="开始日期" />
        <el-table-column fixed prop="enddata" align="center" width="100" label="截至日期" />
        <el-table-column fixed :show-overflow-tooltip="true" align="center" width="110" prop="norigarsubmnys"
          label="费用总金额" />
        <el-table-column fixed :show-overflow-tooltip="true" align="center" width="110" prop="nordersubmnys"
          label="使用总金额" />
        <el-table-column fixed :show-overflow-tooltip="true" align="center" prop="left" label="剩余总金额" />
        <el-table-column :show-overflow-tooltip="true" width="100" v-for="(item, index) in newArray1" :key="item.itemcode"
          :prop="item.itemcode" header-align="center" align="center" :label="item.itemname">
        </el-table-column>
      </el-table>
      <el-pagination style="width: 90%; margin: 0 auto; " @size-change="sizeChangeHandle1" ref="pagination"
        @current-change="handleCurrentChange1" :current-page="currentPage1" :page-sizes="[20, 40, 60, 80, 100, 1000]"
        :page-size="pageSize1" layout="total, sizes, prev, pager, next, jumper" :total="dataList1.length">
      </el-pagination>
    </div>
    <div v-else>
      <el-table class="table" max-height="600" ref="table" v-loading="dataListLoading" :data="currentData"
        style="width: 100%;">
        <el-table-column fixed :show-overflow-tooltip="true" align="center" width="80" prop="levelName1" label="战区" />
        <el-table-column fixed :show-overflow-tooltip="true" align="center" width="80" prop="levelName2" label="销售区域" />
        <el-table-column fixed :show-overflow-tooltip="true" align="center" prop="levelName3" label="分公司/办事处" />
        <el-table-column fixed :show-overflow-tooltip="true" align="center" prop="cName" label="客户名称 " />
        <el-table-column fixed :show-overflow-tooltip="true" align="center" prop="cSiteName" label="站点" />
        <el-table-column fixed prop="vouchdate" width="100" align="center" label="订单日期" />
        <el-table-column fixed :show-overflow-tooltip="true" align="center" width="170" prop="vsrccode" label="BIP订单号" />
        <el-table-column fixed :show-overflow-tooltip="true" align="center" width="170" prop="cOrderNo" label="NCC订单号" />
        <el-table-column fixed :show-overflow-tooltip="true" align="center" prop="box" label="订单数量" />
        <el-table-column fixed :show-overflow-tooltip="true" align="center" width="170" prop="main_vbillcode"
          label="费用单号" />
        <el-table-column fixed :show-overflow-tooltip="true" align="center" prop="sums" label="本单使用金额" />
        <el-table-column :show-overflow-tooltip="true" width="100" v-for="(item, index) in newArray" :key="item.itemcode"
          :prop="item.itemcode" header-align="center" align="center" :label="item.itemname">
        </el-table-column>
      </el-table>
      <el-pagination style="width: 90%; margin: 0 auto; " @size-change="sizeChangeHandle" ref="pagination"
        @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[20, 40, 60, 80, 100, 1000]"
        :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="dataList.length">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import * as api from '@/api/Business/analysis.js'
import {
  exportExcel
} from './ExpenseDetailsExpro.js'
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
      dataForm1: {
        p_vouchdateend: '',
        p_vouchdatestart: '',
        p_orgname: ''
      },
      bullay: '',
      check: '1',
      dataList: [],//从表
      dataList1: [],//主表
      tableListmain: [],
      dataListsum: [],
      tableshow: true,

      currentData: [],
      currentPage: 1,
      pageSize: 20,
      totalItems: 0,

      currentData1: [],
      currentPage1: 1,
      pageSize1: 20,
      totalItems1: 0,

      newArray: [],
      newArray1: [],
      allnewArray: [],//表体
      allnewArray1: [],//表头
      dataListLoading: false,
      activeButton: 'header',
      codes: [
        {
          itemname: '战区',
          itemcode: 'levelName1'
        },
        {
          itemname: '销售区域/省区',
          itemcode: 'levelName2'
        },
        {
          itemname: '分公司/办事处',
          itemcode: 'levelName3'
        },
        {
          itemname: '客户名称',
          itemcode: 'cName'
        },
        {
          itemname: '站点',
          itemcode: 'cSiteName'
        },
        {
          itemname: '订单日期',
          itemcode: 'vouchdate'
        },
        {
          itemname: 'BIP订单号',
          itemcode: 'vsrccode'
        },
        {
          itemname: 'NCC订单号',
          itemcode: 'cOrderNo'
        },
        {
          itemname: '订单数量',
          itemcode: 'box'
        },
        {
          itemname: '费用单号',
          itemcode: 'main_vbillcode'
        },
        {
          itemname: '本单使用金额',
          itemcode: 'nordersubmny'
        }
      ],
      codes1: [
        {
          itemname: '战区',
          itemcode: 'levelName1'
        },
        {
          itemname: '销售区域/省区',
          itemcode: 'levelName2'
        },
        {
          itemname: '分公司/办事处',
          itemcode: 'levelName3'
        },
        {
          itemname: '客户名称',
          itemcode: 'custname'
        },

        {
          itemname: '开始日期',
          itemcode: 'startdata'
        },
        {
          itemname: '截至日期',
          itemcode: 'enddata'
        },
        {
          itemname: '费用总金额',
          itemcode: 'norigarsubmnys'
        },
        {
          itemname: '使用总金额',
          itemcode: 'nordersubmnys'
        },
        {
          itemname: '剩余总金额',
          itemcode: 'left'
        },
      ]

    };
  },
  created() {
    this.calculateDates();
  },
  mounted() {
    this.getdataList1main()
    this.getdataList()
  },
  methods: {
    handleButtonClick(buttonType) {
      if (buttonType === 'header') {
        this.activeButton = 'header'; // 如果点击表头按钮，设置activeButton 为 'header'  
        this.getdataList1main(); // 可以调用相应的方法  
      } else if (buttonType === 'headerDetail') {
        this.activeButton = 'headerDetail'; // 点击表头+明细按钮  
        this.getdataListdet(); // 处理表头+明细的逻辑  
      }
    },
    handleClick() {
      this.getdataList1();
      this.getdataList();

    },
    exportData() {
      this.$confirm('是否导出表格数据到Excel?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {

        exportExcel(this.dataList, this.dataList1, this.allnewArray, this.allnewArray1, '客户费用明细表.xlsx')

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
      // 原始日期  
      const originalDate = new Date(this.dataForm.p_vouchdatestart);

      // 提前 3 个月  
      originalDate.setMonth(originalDate.getMonth() - 3);

      // 格式化日期为 YYYY-MM-DD  
      const year = originalDate.getFullYear();
      const month = String(originalDate.getMonth() + 1).padStart(2, '0'); // 月份从0开始，所以加1  
      const day = String(originalDate.getDate()).padStart(2, '0');

      const newDate = `${year}-${month}-${day}`;

      console.log(newDate); // 输出：2024-09-01  
      this.dataForm1.p_vouchdatestart = newDate
      this.dataForm1.p_vouchdateend = this.dataForm.p_vouchdateend
    },
    formatDate(date) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0'); // 月份从0开始，所以加1 
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    },
    getdataList1main() {
      this.check = 1
      this.tableshow = true
      this.getdataList1()
    },
    getdataList1() {
      this.dataListLoading = true
      Promise.all([
        api.rebaterecordAPI(this.dataForm1),
        api.recorddetailsAPI(this.dataForm)
      ]).then(([rebateResponse, detailsResponse]) => {
        // 处理第一个 API 的响应  
        this.dataListsum = rebateResponse;
        console.log(this.dataListsum, 225566)
        //这种方法有问题
        // this.dataListsum.forEach(item => {
        //   const levels = item.level_name.split('->');
        //   item.levelName1 = levels[0] || "";
        //   // 去掉 levelName2 中的数字  
        //   item.levelName2 = levels[1] ? levels[1].replace(/\d+/g, '').trim() : "";
        //   item.levelName3 = levels[2] || "";
        // });
        this.dataListsum.forEach(item => {
          // 确保 item.level_name 存在并且是一个有效的字符串  
          if (typeof item.level_name === 'string' && item.level_name.includes('->')) {
            const levels = item.level_name.split('->');
            item.levelName1 = levels[0] || "";
            // 去掉 levelName2 中的数字  
            item.levelName2 = levels[1] ? levels[1].replace(/\d+/g, '').trim() : "";
            item.levelName3 = levels[2] || "";
          } else {
            // 如果 level_name 不存在或者不包含 '->'，初始化 levelName 属性  
            item.levelName1 = "";
            item.levelName2 = "";
            item.levelName3 = "";
          }
        });

        this.dataListsum.forEach(item => {
          // 去除 nremainmny 中的逗号符号  
          const cleanedNremainmny = item.nremainmny ? item.nremainmny.replace(/,/g, '') : '0';

          // 保留两位小数  
          item.norigarsubmny = isNaN(parseFloat(item.norigarsubmny)) ? '0.00' : parseFloat(item.norigarsubmny).toFixed(2);
          item.nremainmny = isNaN(parseFloat(cleanedNremainmny)) ? '0.00' : parseFloat(cleanedNremainmny).toFixed(2);
          item.nordersubmny = isNaN(parseFloat(item.nordersubmny)) ? '0.00' : parseFloat(item.nordersubmny).toFixed(2);
        });

        this.dataListsum = this.dataListsum.reduce((acc, item) => {
          const existingCustomer = acc.find(obj => obj.custname === item.custname);
          if (existingCustomer) {
            existingCustomer.norigarsubmnys += parseFloat(item.norigarsubmny) || 0;
            existingCustomer.nordersubmnys += parseFloat(item.nordersubmny) || 0;
          } else {
            acc.push({
              custname: item.custname,
              norigarsubmnys: parseFloat(item.norigarsubmny) || 0,
              nordersubmnys: parseFloat(item.nordersubmny) || 0,
              ...item
            });
          }
          return acc;
        }, []);

        // 处理第二个 API 的响应  
        this.tableListmain = detailsResponse;
        console.log(this.tableListmain, 115522655)
        this.tableListmain.forEach(item => {
          const levels = item.level_name.split(' -> ');
          item.levelName1 = levels[0] || "";
          item.levelName2 = levels[1] ? levels[1].replace(/\d+/g, '').trim() : "";
          item.levelName3 = levels[2] || "";
        });
        this.tableListmain.forEach(item => {
          if (!item.itemcode && !item.itemname) {
            item.itemname = '其他';
            item.itemcode = 'fyxm24_fyxm_8888HX';
          }
        });
        console.log(this.tableListmain, 'tableListmain')
        // 添加开始时间和结束时间  
        this.tableListmain.forEach(item => {
          item.startdata = this.dataForm.p_vouchdatestart; // 添加 startdata 字段  
          item.enddata = this.dataForm.p_vouchdateend;     // 添加 enddata 字段  
        });


        // 变更 tableListmain，为每个对象添加 itemcode 值作为新字段，值为 nordersubmny  
        this.tableListmain = this.tableListmain.map(item => ({
          ...item, // 保留其他属性  
          [item.itemcode]: item.nordersubmny // 使用 itemcode 的值作为新字段名  
        }));

        //提取字段，用于动态添加表头
        this.newArray1 = this.tableListmain.map(({ itemcode, itemname }) => ({ itemcode, itemname }));
        // 使用 Set 进行去重  
        this.newArray1 = Array.from(
          new Map(this.newArray1.map(item => [item.itemcode, item])).values()
        );

        //导出所需要的表头
        this.allnewArray1 = [...this.codes1, ...this.newArray1];
        // console.log(this.allnewArray1)
        // 根据cName相同合并相加  
        const mergedData = this.tableListmain.reduce((acc, item) => {
          const existing = acc.find(obj => obj.cName === item.cName);
          if (existing) {
            for (const key in item) {
              if (
                key !== 'levelName1' &&
                key !== 'levelName2' &&
                key !== 'levelName3' &&
                key !== 'cName' &&
                key !== 'startdata' &&
                key !== 'vouchdate' &&
                key !== 'main_vbillcode' &&
                key !== 'ocustomerClass_id' &&
                key !== 'vsrccode' &&
                key !== 'enddata' &&
                key !== 'nordersubmny'
              ) {
                const newValue = parseFloat(item[key]);
                if (!isNaN(newValue)) {
                  existing[key] = (parseFloat(existing[key]) || 0) + newValue; // 累加数字  
                  existing[key] = existing[key].toFixed(2); // 保留两位小数  
                }
              }
            }
          } else {
            acc.push({ ...item }); // 使用扩展运算符添加新对象  
          }
          return acc;
        }, []);
        // 打印合并后的数据  
        console.log(mergedData, 155252);
        //pipei
        const excludeFields = ['box', 'cName', 'cOrderNo', 'cSiteName', 'itemcode', 'itemname', 'levelName1', 'levelName2', 'levelName3', 'level_name', 'main_vbillcode', 'nordersubmny', 'ocustomerClass_id', 'vsrccode', 'vouchdate'];

        mergedData.forEach(item => {
          // 找到dataListsum中匹配的对象  
          const matchingItem = this.dataListsum.find(sumItem => sumItem.custname === item.cName);

          // 如果找到匹配项  
          if (matchingItem) {
            // 遍历item的所有属性  
            Object.keys(item).forEach(key => {
              // 如果该字段不在排除的字段列表中，则添加到匹配的sumItem中  
              if (!excludeFields.includes(key)) {
                matchingItem[key] = item[key];
              }
            });
          }
        });

        // 将this.dataListsum赋值给this.dataList1  
        this.dataList1 = this.dataListsum;
        // 创建一个新数组，包含原对象并添加 left 字段，保留两位小数  
        this.dataList1 = this.dataList1.map(item => {
          // 将 origarsubmny 和 nordersubmny 转为数字并保留两位小数  
          const norigarsubmnys = parseFloat(item.norigarsubmnys).toFixed(2);
          const nordersubmnys = parseFloat(item.nordersubmnys).toFixed(2);

          // 计算 left 值并保留两位小数  
          const leftValue = (parseFloat(norigarsubmnys) - parseFloat(nordersubmnys)).toFixed(2);

          // 返回一个新的对象，包含原有字段，加上 left 字段  
          return {
            ...item, // 拷贝原对象的所有字段  
            norigarsubmnys: parseFloat(norigarsubmnys).toFixed(2), // 确保还是数字  
            nordersubmnys: parseFloat(nordersubmnys).toFixed(2), // 确保还是数字  
            left: parseFloat(leftValue).toFixed(2) // 添加新的 left 字段，确保还是数字  
          };
        });
        // 使用 filter 来选择有 startdata 和 enddata 的对象  
        this.dataList1 = this.dataList1.filter(item => item.startdata && item.enddata);
        // 过滤数据  
        this.dataList1 = this.dataList1.filter(item =>
          (item.levelName1 && item.levelName1.toLowerCase().includes(this.bullay)) ||
          (item.levelName2 && item.levelName2.toLowerCase().includes(this.bullay)) ||
          (item.levelName3 && item.levelName3.toLowerCase().includes(this.bullay)) ||
          (item.custname && item.custname.toLowerCase().includes(this.bullay))
        );
        this.dataList1.forEach(obj => {
          // 计算除指定字段以外的所有字段的数字总和  
          const excludedFields = [
            "cordercustid", "custname", "dsubdate", "enddata", "left",
            "levelName1", "levelName2", "levelName3", "level_name",
            "main_vbillcode", "nordersubmny", "norigarsubmny", "nordersubmnys",
            "norigarsubmnys", "nremainmny", "startdata"
          ];

          let sum = 0;
          for (let key in obj) {
            if (!excludedFields.includes(key)) {
              const value = Number(obj[key]);
              if (!isNaN(value)) {
                sum += value; // 累加数值  
              }
            }
          }

          // 更新 fields  
          obj.nordersubmnys = sum.toFixed(2); // 将计算的总和赋值给 nordersubmnys  
        });
        // 遍历 dataList1 计算 left  
        this.dataList1.forEach(item => {
          // 转换为数字并计算 left 并赋值  
          item.left = (Number(item.norigarsubmnys) - Number(item.nordersubmnys)).toFixed(2);
          // 或者可以使用一元加号  
          // item.left = +item.norigarsubmnys - +item.nordersubmnys;  
        });


        console.log(this.dataList1, 'dataList1')
        this.currentData1 = {
          ...this.dataList1
        };
        console.log(this.dataList1, 'zuizhong');
        this.sizeChangeHandle1(this.pageSize1);

        this.dataListLoading = false;
      }).catch(error => {
        console.error("获取数据时出错:", error);
        this.dataListLoading = false; // 确保在出错时重置加载状态  
      });
    },
    getdataListdet() {
      this.check = 2
      this.tableshow = false
      this.getdataList()
    },
    //表头+明细
    getdataList() {
      this.dataListLoading = true
      api.recorddetailsAPI(this.dataForm).then(res => {
        this.dataList = res
        this.dataList.forEach(item => {
          const levels = item.level_name.split(' -> ');
          item.levelName1 = levels[0] || "";
          // 去掉 levelName2 中的数字  
          item.levelName2 = levels[1] ? levels[1].replace(/\d+/g, '').trim() : "";
          item.levelName3 = levels[2] || "";
        });
        this.dataList.forEach(item => {
          if (!item.itemcode && !item.itemname) {
            item.itemname = '其他';
            item.itemcode = 'fyxm24_fyxm_8888HX';
          }
        });


        const result = this.dataList.reduce((acc, item) => {
          // 创建一个唯一的键，以便进行合并  
          const key = `${item.vsrccode}-${item.cOrderNo}-${item.main_vbillcode}`;

          // Check if the accumulated object already contains this key  
          if (!acc[key]) {
            // 如果没有，初始化这个键的对象并复制其它字段  
            acc[key] = {
              ...item, // 保留当前项的所有字段  
              sums: Number(item.nordersubmny) || 0 // 初始化 sums 为当前项的 nordersubmny（转为数字）  
            };
          } else {
            // 如果已经存在，累加 sums，将 nordersubmny 转为数字  
            acc[key].sums += Number(item.nordersubmny) || 0; // 确保相加时也是数字  
          }

          return acc;
        }, {});

        // 将结果转换为数组  
        const summedDataList = Object.values(result);

        // 清空原数组  
        this.dataList.length = 0;

        // 将合并后的数据放回原数组  
        this.dataList.push(...summedDataList);

        console.log(this.dataList, 112233);


        // 变更 dataList，为每个对象添加 itemcode 值作为新字段，值为 nordersubmny  
        this.dataList = this.dataList.map(item => ({
          ...item, // 保留其他属性  
          [item.itemcode]: item.nordersubmny // 使用 itemcode 的值作为新字段名  
        }));

        //提取字段，用于动态添加表头
        this.newArray = this.dataList.map(({ itemcode, itemname }) => ({ itemcode, itemname }));
        // 使用 Set 进行去重  
        this.newArray = Array.from(
          new Map(this.newArray.map(item => [item.itemcode, item])).values()
        );
        //导出所需要的表头
        this.allnewArray = [...this.codes, ...this.newArray];

        // 过滤数据  
        this.dataList = this.dataList.filter(item =>
          (item.levelName1 && item.levelName1.toLowerCase().includes(this.bullay)) ||
          (item.levelName2 && item.levelName2.toLowerCase().includes(this.bullay)) ||
          (item.levelName3 && item.levelName3.toLowerCase().includes(this.bullay)) ||
          (item.cName && item.cName.toLowerCase().includes(this.bullay)) ||
          (item.cSiteName && item.cSiteName.toLowerCase().includes(this.bullay))
        );
        console.log(this.dataList, 222222)

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
    // 每页数
    sizeChangeHandle1(val) {
      this.pageSize1 = val;
      this.currentPage1 = 1;
      this.currentData1 = this.dataList1.slice((this.currentPage1 - 1) * this.pageSize1, this.currentPage1 * this
        .pageSize1);
    },
    // 当前页
    handleCurrentChange1(val) {
      console.log(val)
      this.currentPage1 = val;
      this.currentData1 = this.dataList1.slice((val - 1) * this.pageSize1, val * this.pageSize1);
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
  font-size: 12px;
  background: #f5f7fa;
}


::v-deep .el-table th {
  background: #f5f7fa;
}
</style>