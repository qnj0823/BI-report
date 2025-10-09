<template>
    <!-- 基于 Element UI 新增和修改弹窗 -->
    <el-dialog :title="!dataForm.id ? '新增-ADD' : '修改-EDITE'" :close-on-click-modal="false" :visible.sync="visible">
        <!-- 新增和创建表单表单 -->
        <el-form :model="dataForm" ref="dataForm" @keyup.enter.native="dataSubmit()" label-width="160px">
            <el-form-item label="省区" prop="city">
                <el-input v-model="dataForm.city"  style="width: 25rem;" placeholder="省区">
                </el-input>
            </el-form-item>
            <el-form-item label="群聊名称" prop="groups">
                <el-input v-model="dataForm.groups"  style="width: 25rem;" placeholder="群聊名称">
                </el-input>
            </el-form-item>
            <el-form-item label="状态" prop="status">
                <el-input v-model="dataForm.status" style="width: 25rem;" placeholder="状态">
                </el-input>
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
import * as oapi from '@/api/management/management.js'
export default {
    data() {
        return {
            constants: this.$constants,
            visible: false,
            dataForm: {
                id: 0,
                city: '',
                groups:'',
                status: ''
            },

        }
    },

    mounted() {
        this.getMouth()
    },
    methods: {
        
        getMouth(){
            this.currentMonth = new Date().getMonth() + 1; 
            console.log( this.currentMonth,666666666)
        },
        //取消
        Cancel() {
            this.visible = false
            this.$emit('close')
            this.$emit('refreshDataList')
        },

        init(id, data) { // 初始化表单验证规则
            console.log(data)
            this.dataForm.id = id || 0
            this.visible = true
            this.$nextTick(() => {
                if (this.dataForm.id) {
                    this.dataForm = data
                }

            })
        },
        handlebigChange(value) {
            this.selectedbigLable = this.FactoryList.find(item => item.id === value);
            this.dataForm.dqname = this.selectedbigLable.levelName1
            this.dataForm.sqname = this.selectedbigLable.levelName2
            console.log(this.selectedbigLable)

        },

        // 表单数据提交
        dataSubmit() {
            this.$refs['dataForm'].validate((valid) => {
                if (!this.dataForm.id) {
                    api.RPIWechupsaddAPI(this.dataForm).then(res => {
                        // TODO 保存数据
                        this.$emit('refreshDataList')
                        this.$emit('close')
                        this.$message.success('新增数据成功')
                        this.visible = false
                    });
                } else {
                    api.RPIWechupsputAPI(this.dataForm).then(res => {
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