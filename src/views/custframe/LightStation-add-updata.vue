<template>
    <!-- 基于 Element UI 新增和修改弹窗 -->
    <el-dialog :title="!dataForm.id ? '新增-ADD' : '修改-EDITE'" :close-on-click-modal="false" :visible.sync="visible">
        <!-- 新增和创建表单表单 -->
        <el-form :model="dataForm" ref="dataForm" @keyup.enter.native="dataSubmit()" label-width="160px">
            <el-form-item label="区域">
                <el-input v-model="dataForm.areaName" style="width: 100%;" placeholder="区域">
                </el-input>
            </el-form-item>
            <el-form-item label="线路编码">
                <el-input v-model="dataForm.linecode" style="width: 100%;" placeholder="线路编码">
                </el-input>
            </el-form-item>
            <el-form-item label="线路名称" prop="linename">
                <el-input v-model="dataForm.linename" style="width: 100%;" placeholder="线路名称">
                </el-input>
            </el-form-item>
            <el-form-item label="站点编码" prop="sitecode">
                <el-input v-model="dataForm.sitecode" style="width: 100%;" placeholder="站点编码">
                </el-input>
            </el-form-item>
            <el-form-item label="站点名称" prop="sitename">
                <el-input v-model="dataForm.sitename" style="width: 100%;" placeholder="站点名称">
                </el-input>
            </el-form-item>
            <el-form-item label="单号/双号" prop="type">
                <el-select v-model="dataForm.type" style="width: 100%;" placeholder="请选择">
                    <el-option label="单号" value="1" />
                    <el-option label="双号" value="2" />
                </el-select>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="Cancel()">取消</el-button>
            <el-button type="primary" @click="dataSubmit()">确定</el-button>
        </span>
    </el-dialog>
</template>

<script>
import * as api from '@/api/frame/customer.js'

export default {
    data() {
        return {
            constants: this.$constants,
            visible: false,
            selectedPROValue: '',
            dataForm: {
                id: '',
                areaName: '',
                linecode: '',
                linename: '',
                sitecode: '',
                sitename: '',
                type: '',
            }
        }
    },
    computed: {

    },
    mounted() {

    },
    methods: {

        //取消
        Cancel() {
            this.visible = false
            this.$emit('close')
            this.$emit('refreshDataList')
        },

        init(id, data) { // 初始化表单验证规则
            console.log(data)
            this.dataForm.id = id || ''
            this.visible = true
            this.$nextTick(() => {
                if (this.dataForm.id) {
                    this.dataForm = data
                }
            })

        },
        // 表单数据提交
        dataSubmit() {
            this.$refs['dataForm'].validate((valid) => {
                if (!this.dataForm.id) {
                    api.wlDeliveryLineaddAPI(this.dataForm).then(res => {
                        // TODO 保存数据
                        this.$emit('refreshDataList')
                        this.$emit('close')
                        this.$message.success('新增数据成功')
                        this.visible = false
                    });
                } else {
                    api.wlDeliveryLineputAPI(this.dataForm).then(res => {
                        // TODO 保存数据
                        this.$emit('refreshDataList')
                        this.$emit('close')
                        this.$message.success('修改数据成功')
                        this.visible = false
                    })
                }
            })
        }
    }
}
</script>