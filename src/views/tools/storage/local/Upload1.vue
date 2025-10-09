<template>
  <div class="app-container" style="padding: 8px;">
    <!--工具栏-->
    <div class="head-container">
      <el-button slot="left" v-permission="['admin', 'storage:add']" class="filter-item" size="mini" type="primary"
        icon="el-icon-upload" @click="crud.toAdd">上传
      </el-button>
    </div>
    <!--表单组件-->
    <el-dialog append-to-body :close-on-click-modal="false" :before-close="crud.cancelCU"
      :visible.sync="crud.status.cu > 0" :title="crud.status.addup ? '文件上传' : '编辑文件'" width="500px">
      <el-form ref="form" :model="form" size="small" label-width="80px">
        <el-form-item label="文件名">
          <el-input v-model="form.name" style="width: 370px;" />
        </el-form-item>
        <!--   上传文件   -->
        <el-form-item v-if="crud.status.add" label="上传">
          <el-upload ref="upload" :limit="1" :before-upload="beforeUpload" :auto-upload="false" :headers="headers"
            :on-success="handleSuccess" :on-error="handleError" :action="fileUploadApi + '?name=' + form.name">
            <div class="eladmin-upload"><i class="el-icon-upload" /> 添加文件</div>
            <div slot="tip" class="el-upload__tip">可上传任意格式文件,且不超过100M</div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="text" @click="crud.cancelCU">取消</el-button>
        <el-button v-if="crud.status.add" :loading="loading" type="primary" @click="upload">确认</el-button>
        <el-button v-else :loading="crud.status.cu === 2" type="primary" @click="crud.submitCU">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getToken } from '@/utils/auth'
import crudFile from '@/api/tools/localStorage'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import pagination from '@crud/Pagination'
import DateRangePicker from '@/components/DateRangePicker'
import * as api from '@/api/Business/analysis.js'


const defaultForm = { id: null, name: '' }
export default {
  components: { pagination, crudOperation, rrOperation, DateRangePicker },
  cruds() {
    return CRUD({ title: '文件', url: 'api/localStorage', crudMethod: { ...crudFile } })
  },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  data() {
    return {
      delAllLoading: false,
      loading: false,
      currentTime: '',
      usernames: '',
      dataForm: {
        fileaddress: '',
        id: '',
        type: '0',
        userid: ''
      },
      form: {
        name: '',
        uploadedFile: null // 新增字段来存储上传的文件  
      },
      headers: { 'Authorization': getToken() },
      permission: {
        edit: ['admin', 'storage:edit'],
        del: ['admin', 'storage:del']
      }
    }
  },
  computed: {
    ...mapGetters([
      'baseApi',
      'fileUploadApi',
      'username',
      'id'
    ])
  },
  created() {
    this.crud.optShow.addup = false
  },
  mounted() {
    if (this.username != '') {
      sessionStorage.setItem('username', this.username);
    }
    this.usernames = sessionStorage.getItem('username');
  },
  methods: {
    // 上传文件
    upload() {
      this.$refs.upload.submit()
    },
    beforeUpload(file) {
      let isLt2M = true
      isLt2M = file.size / 1024 / 1024 < 100
      if (!isLt2M) {
        this.loading = false
        this.$message.error('上传文件大小不能超过 100MB!')
      }
      this.form.name = file.name
      return isLt2M
    },
    formatCurrentDate() {
      const now = new Date(); // 获取当前时间  

      const pad = (num) => (num < 10 ? '0' + num : num); // 补零函数  

      const year = now.getFullYear();
      const month = pad(now.getMonth() + 1); // 月份从0开始，所以要加1  
      const day = pad(now.getDate());
      const hours = pad(now.getHours());
      const minutes = pad(now.getMinutes());
      const seconds = pad(now.getSeconds());

      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`; // 格式化为 'YYYY-MM-DD HH:mm:ss'  
    },

    handleSuccess(response, file, fileList) {
      this.crud.notify('上传成功', CRUD.NOTIFICATION_TYPE.SUCCESS)
      this.$emit('file', file.raw);
      this.$refs.upload.clearFiles()
      this.crud.status.addup = CRUD.STATUS.NORMAL
      this.crud.resetForm()
      this.crud.toQuery()
      // sessionStorage.setItem('file', file.raw);
      // this.$emit('londing');
      // let formData = new FormData();
      // formData.append("file", file.raw);
      // api.reportOrderTemplateAPi(formData).then(res => {
      //   this.$message.success('上传成功')

      //   this.$emit('getDataList');

      // })

      setTimeout(() => {
        const filteredAndSortedObject = this.crud.data
          .filter(item => item.createBy === this.usernames) // 过滤符合 createBy 的对象  
          .sort((a, b) => {
            // 将 createTime 转换为 Date 对象进行比较  
            const dateA = new Date(a.createTime.replace(' ', 'T') + 'Z'); // 转换为 Date 对象  
            const dateB = new Date(b.createTime.replace(' ', 'T') + 'Z'); // 转换为 Date 对象  
            return dateA - dateB; // 倒序排序  
          })
          .pop(); // 取第一个对象  
        this.dataForm.fileaddress = 'http://bi.yufanjtbip.com:8069/file/文档/' + filteredAndSortedObject.realName
        console.log(this.dataForm.fileaddress)
        api.reportUserFileAPI(this.dataForm).then(res => {

        })

      }, 500); // 1000 毫秒 = 1 秒  

    },
    // 监听上传失败
    handleError(e, file, fileList) {
      const msg = JSON.parse(e.message)
      this.$notify({
        title: msg.message,
        type: 'error',
        duration: 2500
      })
      this.loading = false
    }
  }
}
</script>

<style scoped>
::v-deep .el-image__error,
.el-image__placeholder {
  background: none;
}

::v-deep .el-image-viewer__wrapper {
  top: 55px;
}
</style>
