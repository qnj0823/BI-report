<template>
  <div class='nain'>
    <div class="container" style="display: flex; justify-content: flex-end; align-items: flex-start; width: 100%;">
      <el-form :inline="true" style="margin: 2px;">
        <el-button size="mini" class="filter-item" type="success" @click="getALLlist('1')">修改分子公司负责人</el-button>
        <el-button size="mini" class="filter-item" type="success" @click="getALLlist('2')">修改是否直营</el-button>
        <!-- <el-button size="mini" class="filter-item" type="success" @click="getALLlist('3')">修改区域GDP人口</el-button>   -->
      </el-form>
    </div>
    <el-form :inline="true" style="width:100%; margin: 0 auto;">
      <el-form-item>
        <el-input v-model="bullay" placeholder="模糊搜索" clearable @keyup.enter.native="searchEnterFun()"
          ref="searchInput"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button class="filter-item" size="mini" type="success" icon="el-icon-search"
          @click="getDataList">查询</el-button>
      </el-form-item>
    </el-form>
    <fzradd v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"
      @close="addOrUpdateVisible = false"></fzradd>
    <el-table ref="table" v-loading="dataListLoading" :data="currentData" style="width: 100%;">
      <el-table-column :show-overflow-tooltip="true" align="center" prop="levelName1" label="战区" />
      <el-table-column :show-overflow-tooltip="true" align="center" prop="levelName2" label="销售区域" />
      <el-table-column :show-overflow-tooltip="true" align="center" prop="pkCustclassName" label="分公司/办事处" />
      <el-table-column :show-overflow-tooltip="true" align="center" prop="fzr" label="负责人" />
      <el-table-column :show-overflow-tooltip="true" align="center" prop="name" label="客户名称" />
      <el-table-column prop="def1Name" align="center" label="客户站点" />
      <el-table-column :show-overflow-tooltip="true" align="center" prop="def5Name" label="销量区域" />
      <el-table-column :show-overflow-tooltip="true" align="center" prop="isDirectlyName" label="是否直营" />
      <el-table-column :show-overflow-tooltip="true" align="center" prop="def17Name" label="所属性质" />
    </el-table>
    <el-pagination @size-change="sizeChangeHandle" ref="pagination" @current-change="handleCurrentChange"
      :current-page="currentPage" :page-sizes="[20, 40, 60, 80, 100, 1000]" :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper" :total="dataList.length">
    </el-pagination>
  </div>
</template>

<script>
import fzradd from './custmain-add-updata'
import * as api from '@/api/frame/customer.js'
export default {
  name: 'nain-page',
  components: {
    fzradd
  },
  data() {
    return {
      msg: 'nain-page',
      dataListLoading: false,
      addOrUpdateVisible: false,
      dataForm: {
        blurry: '',
        page: 0,
        size: this.$constants.page.limit[0],
        sort: '',
      },
      bullay: '',
      dataFormfgslist: {
        page: 0,
        size: 200
      },
      dataFormzdlist: {
        page: 0,
        size: 5000
      },
      zdList: [],
      fgsList: [],
      dataList: [],
      currentData: [],
      currentPage: 1,
      pageSize: 20,
      totalItems: 0,
    };
  },
  mounted() {
    this.getDataList()

  },
  methods: {
    async getfgsList() {
      try {
        // 使用 Promise.all 来并行执行两个 API 请求  
        const [fgsResponse, zdResponse] = await Promise.all([
          api.CompanyTablelist(this.dataFormfgslist),
          api.zdTablelist(this.dataFormzdlist)
        ]);

        // 处理 fgsList  
        this.fgsList = fgsResponse.content;
        console.log(999, this.fgsList); // 调试输出  

        // 处理 dataList，将 fzr 添加到合适的对象中  
        this.dataList.forEach(data => {
          // 查找与 data.pK_CUSTCLASS 匹配的公司 ID  
          const matchedFzr = this.fgsList.filter(fg => fg.companyid === data.pK_CUSTCLASS);

          // 如果找到匹配的项，则添加所有的 fzr 到对应的 data 对象  
          if (matchedFzr.length > 0) {
            // 在 dataList 对象中新建一个 fzr 数组，用于存储所有匹配的 fzr  
            data.fzr = matchedFzr.map(fg => fg.fzr); // 使用 map 方法简化添加过程  
          }
        });

        // 处理 zdList  
        this.zdList = zdResponse.content;
        console.log(1999, this.zdList); // 调试输出 

        // 处理 dataList，将 gdp 添加到合适的对象中  
        this.dataList.forEach(data => {
          // 查找与 data.pK_CUSTCLASS 匹配的公司 ID  
          const matchedFzr = this.zdList.filter(fg => fg.siteid === data.dEF1);

          // 如果找到匹配的项，则添加所有的 fzr 到对应的 data 对象  
          if (matchedFzr.length > 0) {
            // 在 dataList 对象中新建一个 fzr 数组，用于存储所有匹配的 fzr  
            data.isDirectlyName = matchedFzr.map(fg => fg.isDirectlyName); // 使用 map 方法简化添加过程  
          }
        });
        // 过滤数据  
        this.dataList = this.dataList.filter(item =>
          (item.levelName1 && item.levelName1.toLowerCase().includes(this.bullay)) ||
          (item.levelName2 && item.levelName2.toLowerCase().includes(this.bullay)) ||
          (item.pkCustclassName && item.pkCustclassName.toLowerCase().includes(this.bullay)) ||
          (item.name && item.name.toLowerCase().includes(this.bullay))||
          (item.def1Name && item.def1Name.toLowerCase().includes(this.bullay))||
          (item.def5Name && item.def5Name.toLowerCase().includes(this.bullay))
        );


        this.currentData = {
          ...this.dataList
        };
        this.sizeChangeHandle(this.pageSize);
        this.dataListLoading = false
      } catch (error) {
        console.error('Error fetching data:', error);
        // 可以根据需要处理错误  
      }
    },
    getDataList() {
      this.dataListLoading = true
      api.SiteallCustomer(this.dataForm).then(res => {
        this.dataList = res
        this.dataList.forEach(item => {
          const levels = item.levelName.split(' -> ');
          item.levelName1 = levels[0] || "";
          // 去掉 levelName2 中的数字  
          item.levelName2 = levels[1] ? levels[1].replace(/\d+/g, '').trim() : "";
          item.levelName3 = levels[2] || "";
        });

        this.getfgsList()

        console.log(this.dataList)

      })

    },
    getALLlist(id) {
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(id)
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