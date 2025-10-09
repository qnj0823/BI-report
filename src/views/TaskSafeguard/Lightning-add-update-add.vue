<template>
    <!-- 基于 Element UI 新增和修改弹窗 -->
    <el-dialog :title="!dataForm.id ? '添加-ADD' : '修改-EDITE'" :close-on-click-modal="false" :visible.sync="visible">
      <!-- 新增和创建表单表单 -->
      <el-form :model="dataForm" ref="dataForm" @keyup.enter.native="dataSubmit()" label-width="150px">
        <el-form-item label="组织机构名称" prop="fgsbscName">
          <el-input v-model="dataForm.fgsbscName" placeholder="组织机构名称"></el-input>
        </el-form-item>
        <el-form-item label="组织机构类型" prop="fzr" style="font-weight: 700;">
          <el-input v-model="dataForm.fzr" placeholder="请组织机构类型" style="width: 40%; "></el-input>
          组织机构类型
          <el-select v-model="dataForm.fzrClass" placeholder="请选择类型" style="width: 30%;">
            <el-option label="大区" value="1"> </el-option>
            <el-option label="分子公司" value="2"></el-option>
            <el-option label="站点" value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="总任务" prop="fgsbscName">
          <el-input v-model="dataForm.fgsbscName" placeholder="总任务"></el-input>
        </el-form-item>
        <el-form-item label="目标任务值(本月)" prop="fgsbscName">
          <el-input v-model="dataForm.fgsbscName" placeholder="目标任务值(本月)"></el-input>
        </el-form-item>
        <el-form-item label="目标任务加N天" prop="fgsbscName">
          <el-input v-model="dataForm.fgsbscName" placeholder="目标任务加N天"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="visible = false">取消</el-button>
        <el-button type="primary" @click="dataSubmit()">确定</el-button>
      </span>
    </el-dialog>
  </template>
  
  <script>
    // import * as api from '@/api/inputdimddfgsbscods.js'
    export default {
      data() {
        return {
          visible: false,
          dataForm: {
            id:'',
            orgid:'',
            orgname:'',
            orgtype:'',
            goaldate:'',
            goalvalue:'',
            sumtask:'',
            userid:''
          },
          currentTime: ''
        }
      },
      methods: {
        //时间搓
        getCurrentTime() {
          const now = new Date();
          this.currentTime = now.getTime();
          console.log(this.currentTime)
        },
        init(id) { // 初始化表单验证规则
          this.dataForm.id = id || 0
          this.visible = true
          this.$nextTick(() => {
            this.$refs['dataForm'].resetFields()
            if (this.dataForm.id) {
              api.inputdimddfgsbscodsDetailApi(id).then(res => {
                // this.dataForm = res;
                let modifiedData = {
                  ...res
                };
                // 处理数据
                if (modifiedData.fzrImg) {
                  modifiedData.fzrImg = modifiedData.fzrImg.replace(/http:\/\/127.0.0.1:8080/g, '');
                } else {
                  console.log(123)
                }
                // 打印处理后的数据或执行其他操作
                this.dataForm = modifiedData;
                console.log(77777, this.dataForm);
              })
  
            }
          })
        },
        // 表单数据提交
        dataSubmit() {
          this.$refs['dataForm'].validate((valid) => {
            if (valid) {
              if (this.dataForm.id) {
                api.inputdimddfgsbscodsUpdateApi(this.dataForm).then(res => {
                  // TODO 保存数据
                  this.$emit('refreshDataList')
                  this.$emit('close')
                  this.$message.success('操作成功')
                });
              } else {
                //时间搓
                this.getCurrentTime()
                let number = this.currentTime
                this.dataForm.id = number
                api.InputDimDdFgsbscOdsCreateApi(this.dataForm).then(res => {
                  // TODO 保存数据
                  this.$emit('refreshDataList')
                  this.$emit('close')
                  this.$message.success('操作数据成功')
                });
              }
            }
          })
        }
      }
    }
  </script>
  