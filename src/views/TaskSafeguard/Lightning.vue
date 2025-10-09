<template>
  <div class='target'>
    <el-form :inline="true" style="margin-top: 10px;" :model="dataForm" @submit.native.prevent>
      <el-form-item>
        <el-input v-model="dataForm2.file" placeholder="选择文件" readonly></el-input>
        <input type="file" ref="fileInput" style="display: none" @change="handleFileUpload">
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="openFileInput">选择文件</el-button>
        <el-button type="success" @click="uploadFile">导入</el-button>
      </el-form-item>

      <el-form-item>
        <!-- <el-button class="filter-item" size="mini" type="success" icon="el-icon-plus"
          @click="addOrUpdateHandle()">新增</el-button> -->
        <el-button size="mini" class="filter-item" type="warning" icon="el-icon-download"
          @click="exportData">下载模板</el-button>
      </el-form-item>
    </el-form>
    <!-- <Local ref="local" /> -->
    <el-table ref="table" v-loading="dataListLoading" :data="exportList" style="width: 100%;">
      <el-table-column :show-overflow-tooltip="true" align="center" prop="levelName1" label="战区" />
      <el-table-column :show-overflow-tooltip="true" align="center" prop="levelName2" label="销售区域/省区" />
      <el-table-column :show-overflow-tooltip="true" align="left" prop="levelName3" label="分公司/办事处" />
      <el-table-column :show-overflow-tooltip="true" align="center" prop="sumtask" label="任务合计" />
      <el-table-column :show-overflow-tooltip="true" align="center" prop="yearmonth1" label="一月" />
      <el-table-column :show-overflow-tooltip="true" align="center" prop="yearmonth2" label="二月" />
      <el-table-column :show-overflow-tooltip="true" align="center" prop="yearmonth3" label="三月" />
      <el-table-column :show-overflow-tooltip="true" align="center" prop="yearmonth4" label="四月" />
      <el-table-column :show-overflow-tooltip="true" align="center" prop="yearmonth5" label="五月" />
      <el-table-column :show-overflow-tooltip="true" align="center" prop="yearmonth6" label="六月" />
      <el-table-column :show-overflow-tooltip="true" align="center" prop="yearmonth7" label="七月" />
      <el-table-column :show-overflow-tooltip="true" align="center" prop="yearmonth8" label="八月" />
      <el-table-column :show-overflow-tooltip="true" align="center" prop="yearmonth9" label="九月" />
      <el-table-column :show-overflow-tooltip="true" align="center" prop="yearmonth10" label="十月" />
      <el-table-column :show-overflow-tooltip="true" align="center" prop="yearmonth11" label="十一月" />
      <el-table-column :show-overflow-tooltip="true" align="center" prop="yearmonth12" label="十二月" />
      <!-- <el-table-column header-align="center" align="center" width="220" label="操作">
        <template slot-scope="scope">
            <el-button class="filter-item" size="mini" type="success" icon="el-icon-search"
            @click="getDataList">修改</el-button>
          <el-button size="mini" class="filter-item" type="warning" icon="el-icon-download"
            @click="exportData">删除</el-button>
        </template>
</el-table-column> -->
    </el-table>
    <!-- 表单弹窗, 新增数据和修改数据 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @close="addOrUpdateVisible = false"
      @refreshDataList="getDataList"></add-or-update>
  </div>
</template>

<script>
import * as api from '@/api/sales/salesAll.js'
import * as oapi from '@/api/frame/customer.js'
import Local from '../tools/storage/local/Upload'
import AddOrUpdate from './Lightning-add-update-add'
import {
  exportExcel
} from './LightningExpro.js'
export default {
  name: 'target-page',
  components: {
    AddOrUpdate,
    Local,
  },
  data() {
    return {
      constants: this.$constants,
      dataForm: {
        page: 0,
        size: 200,
        sort: '',
      },
      dataForm1: {
        blurry: '',
      },
      dataForm2: {
        file: '',
      },
      files: '',
      dataList: [],
      exportList: [],
      addOrUpdateVisible: false,
      dataListLoading: false
    };
  },
  mounted() {
    this.getDataList()
  },
  methods: {

    getDataList() {
      api.BdMonthGoal(this.dataForm).then(res => {
        this.dataList = res
        console.log(this.dataList, 999)
        // this.dataListLoading = false


        oapi.BdallCustomer(this.dataForm1).then(res => {
          this.exportList = res
          this.exportList.forEach(item => {
            const levels = item.levelName.split(' -> ');
            item.levelName1 = levels[0] || "";
            // 去掉 levelName2 中的数字  
            item.levelName2 = levels[1] ? levels[1].replace(/\d+/g, '').trim() : "";
            item.levelName3 = levels[2] || "";
            this.dataListLoading = false
          });
          this.exportList = Array.from(
            new Map(this.exportList.map(item => [item.levelName3, item])).values()
          );
          console.log(this.exportList)

          // 合并函数  
          this.exportList.forEach(exportItem => {
            // 找到匹配的dataList项  
            const matchingData = this.dataList.content.find(dataItem => dataItem.orgsqname === exportItem.levelName3);

            if (matchingData) {
              // 将dataList的其他字段合并到exportList项中  
              Object.assign(exportItem, matchingData);
            }

          });
          console.log(this.exportList,666);  
        })

      })

    },
    //选择文件
    openFileInput() {
      this.$refs.fileInput.click();
    },
    handleFileUpload(event) {
      this.files = event.target.files[0]
      this.dataForm2.file = event.target.files[0].name;
      console.log(this.files, this.dataForm2.file)
    },

    //导入
    uploadFile() {
      this.dataListLoading = true
      if (this.dataForm2.file) {
        let formData = new FormData();
        console.log(this.files)
        formData.append("file", this.files);

        api.importorderdataAPi(formData).then(res => {
          this.$message.success('导入成功')
          this.dataListLoading = false
        })
          .catch(error => {
            this.dataListLoading = false
            this.$message.error("导入失败");
          });
      } else {
        this.$message.error("请先选择文件");
      }
    },


    formatfzrClass(row) {
      return row.orgtype === '1' ? '大区' :
        row.orgtype === '2' ? '分子公司' :
          row.orgtype === '3' ? '站点' : undefined; // 可选处理: 默认返回值  
    },
    // 新增 / 修改
    addOrUpdateHandle(id) {
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(id)
      })
    },

    exportData() {
      this.$confirm('是否下载模板？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.dataListLoading = true
        oapi.BdallCustomer(this.dataForm1).then(res => {
          this.exportList = res
          this.exportList.forEach(item => {
            const levels = item.levelName.split(' -> ');
            item.levelName1 = levels[0] || "";
            // 去掉 levelName2 中的数字  
            item.levelName2 = levels[1] ? levels[1].replace(/\d+/g, '').trim() : "";
            item.levelName3 = levels[2] || "";
            this.dataListLoading = false
          });
          this.exportList = Array.from(
            new Map(this.exportList.map(item => [item.levelName3, item])).values()
          );
          console.log(this.exportList)
          exportExcel(this.exportList, '目标模板.xlsx')
        })
      })
    },

  }
};
</script>

<style scoped lang="scss"></style>