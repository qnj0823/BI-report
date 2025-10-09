<template>
  <el-form :inline="true" style="margin-top: 10px;" :model="formData" @submit.native.prevent>
    <el-form-item>
      <el-input v-model="formData.fileName" :placeholder="placeholder" readonly></el-input>
      <input type="file" ref="fileInput" style="display: none" @change="handleFileChange" :accept="accept">
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="openFileInput">选择文件</el-button>
      <el-button type="success" @click="handleUpload" :loading="loading">{{ uploadText }}</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  name: 'FileUpload',
  props: {
    // 上传API函数
    uploadApi: {
      type: Function,
      required: true
    },
    // 上传成功后的回调函数
    successCallback: {
      type: Function,
      default: () => { }
    },
    // 上传按钮文字
    uploadText: {
      type: String,
      default: '导入'
    },
    // 输入框占位文字
    placeholder: {
      type: String,
      default: '选择文件'
    },
    // 可接受的文件类型
    accept: {
      type: String,
      default: ''
    },
    // 上传后是否自动清空文件
    autoClear: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      formData: {
        fileName: '',
        file: null
      },
      loading: false
    }
  },
  methods: {
    // 打开文件选择对话框
    openFileInput() {
      this.$refs.fileInput.click()
      console.log(this.uploadApi)
    },

    // 处理文件选择变化
    handleFileChange(event) {
      if (event.target.files.length > 0) {
        this.formData.file = event.target.files[0]
        this.formData.fileName = event.target.files[0].name
        this.$emit('file-selected', this.formData.file)
      }
    },

    // 处理文件上传
    async handleUpload() {
      if (!this.formData.file) {
        this.$message.error('请先选择文件')
        return
      }
      this.loading = true

      try {
        const formData = new FormData()
        formData.append('file', this.formData.file)
        formData.append('name', this.formData.fileName) // 添加文件名
        const res = await this.uploadApi(formData)
        console.log(res)
        this.$message.success('导入成功')
        this.$emit('upload-success', res)

        // 执行成功回调
        if (this.successCallback) {
          await this.successCallback(res)
        }
        console.log(this.successCallback)
        // 上传后自动清空
        if (this.autoClear) {
          this.clearFile()
        }
      } catch (error) {
        this.$message.error('导入失败')
        this.$emit('upload-error', error)
      } finally {
        this.loading = false
      }
    },

    // 清空已选文件
    clearFile() {
      this.formData.fileName = ''
      this.formData.file = null
      this.$refs.fileInput.value = ''
    }
  }
}
</script>

