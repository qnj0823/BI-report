<template>
  <div>
    <el-form :inline="true" style="width: 60%; margin: 5px auto;">
      <el-button size="mini" class="filter-item" type="warning" icon="el-icon-download"
        @click="exportData">导出</el-button>
      <el-button class="filter-item" size="mini" type="primary" @click="Enterdetails">站点详情</el-button>
    </el-form>
    <el-table class="table" ref="table" border v-loading="dataListLoading" :data="finalResult"
      style="width: 60%; margin: 0 auto; margin-bottom: 50px;">
      <el-table-column :show-overflow-tooltip="true" align="center" prop="sqname" label="销售区域/省区" />
      <el-table-column :show-overflow-tooltip="true" align="center" prop="ocustomerClass_name" label="分公司办事处" />
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
import {
  exportExcel
} from './proSalesitemfgsExpro.js'
export default {
  name: 'updata-page',
  data() {
    return {
      msg: 'updata-page',
      dataForm: {
        p_orgname: '',
        p_vouchdatestart: '',
        p_vouchdateend: ''
      },
      dataList: [],
      mergedDataList: [],
      finalResult: [],
      dataListLoading: false
    };
  },
  mounted() {
    this.dataForm.p_orgname = this.$route.query.param1;
    this.dataForm.p_vouchdatestart = this.$route.query.startdate;
    this.dataForm.p_vouchdateend = this.$route.query.enddata;
    this.getDataList()
  },
  methods: {
    Enterdetails() {
      this.$router.push({
        path: '/proSalesALL/SalesitemDetails',
        query: {
          param1: this.dataForm.p_orgname,
          enddata: this.dataForm.p_vouchdateend,
          startdate: this.dataForm.p_vouchdatestart
        }
      });
    },
    exportData() {
      this.$confirm('是否导出表格数据到Excel？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {

        exportExcel(this.finalResult, '分子公司产品系列销售表.xlsx')

      })
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

    getDataList() {
      this.dataListLoading = true
      api.productonesellsite(this.dataForm).then(res => {
        this.dataList = res
        this.dataList.forEach(item => {
          if (item.cProductCode == 'HBLK007') {
            item.box = item.box / 40
          }
        })
        //转产品系列
        this.convertBoxFields(this.dataList)
        console.log(this.dataList, ' this.dataList')

        const result = {};
        this.dataList.forEach(item => {
          const key = `${item.sqname}-${item.ocustomerClass_name}`;

          // 如果结果中还没有这个键，初始化一个对象
          if (!result[key]) {
            result[key] = {
              sqname: item.sqname,
              ocustomerClass_name: item.ocustomerClass_name,
              lowbox: 0,
              nowbox: 0,
              Frubox: 0,
              yzzbox: 0,
              yznlbox: 0,
              qtbox: 0,
              sum: 0
            };
          }

          // 将字段值转换为数字并累加
          result[key].lowbox += parseFloat(item.lowbox) || 0;
          result[key].nowbox += parseFloat(item.nowbox) || 0;
          result[key].Frubox += parseFloat(item.Frubox) || 0;
          result[key].yzzbox += parseFloat(item.yzzbox) || 0;
          result[key].yznlbox += parseFloat(item.yznlbox) || 0;
          result[key].qtbox += parseFloat(item.qtbox) || 0;
          // 计算每个对象的总和并保留两位小数  
          result[key].sum = parseFloat((result[key].lowbox + result[key].nowbox + result[key].Frubox +
            result[key].yzzbox + result[key].yznlbox + result[key].qtbox).toFixed(2));

        });

        // 将结果转换为数组
        this.finalResult = Object.values(result);

        // 使用 sort 方法对数组进行排序  
        this.finalResult.sort((a, b) => {
          // 比较 sqname 字段  
          if (a.sqname < b.sqname) {
            return -1; // a 在 b 前面  
          }
          if (a.sqname > b.sqname) {
            return 1; // a 在 b 后面  
          }
          return 0; // 相等  
        });
        // 初始化合计对象
        const total = {
          sqname: '',
          ocustomerClass_name: '合计',
          lowbox: 0,
          nowbox: 0,
          Frubox: 0,
          yzzbox: 0,
          yznlbox: 0,
          qtbox: 0,
          sum: 0
        };

        // 遍历数组，累加字段值
        this.finalResult.forEach(item => {
          total.lowbox += parseFloat(item.lowbox);
          total.nowbox += parseFloat(item.nowbox);
          total.Frubox += parseFloat(item.Frubox);
          total.yzzbox += parseFloat(item.yzzbox);
          total.yznlbox += parseFloat(item.yznlbox);
          total.qtbox += parseFloat(item.qtbox);
          total.sum += parseFloat(item.sum);
        });

        // 将合计对象添加到原数组的最后
        this.finalResult.push(total);

        this.finalResult.forEach(item => {
          item.sqname = item.sqname.replace(/\d+/g, '')
          item.sum = parseFloat(item.sum.toFixed(2))
          item.lowbox = parseFloat(item.lowbox.toFixed(2))
          item.nowbox = parseFloat(item.nowbox.toFixed(2))
          item.Frubox = parseFloat(item.Frubox.toFixed(2))
          item.yzzbox = parseFloat(item.yzzbox.toFixed(2))
          item.yznlbox = parseFloat(item.yznlbox.toFixed(2))
          item.qtbox = parseFloat(item.qtbox.toFixed(2))
        })


        this.dataListLoading = false
        console.log(this.finalResult, ' this.finalResult');
      })
    }
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