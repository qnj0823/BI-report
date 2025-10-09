<template>
    <!-- 基于 Element UI 新增和修改弹窗 -->
    <el-dialog :title="!dataForm.id ? '新增-ADD' : '修改-EDITE'" :close-on-click-modal="false" :visible.sync="visible">
        <!-- 新增和创建表单表单 -->
        <el-form :model="dataForm" ref="dataForm" @keyup.enter.native="dataSubmit()" label-width="160px">
            <el-form-item label="分公司/办事处" prop="companyname">
                <el-input v-model="dataForm.companyname" style="width: 25rem;" placeholder="分公司/办事处">
                </el-input>
            </el-form-item>
            <el-form-item label="客户名称" prop="custname">
                <el-input v-model="dataForm.custname" style="width: 25rem;" placeholder="客户名称">
                </el-input>
            </el-form-item>
            <el-form-item label="老站点" prop="oldsitename">
                <el-input v-model="dataForm.oldsitename" style="width: 25rem;" placeholder="老站点">
                </el-input>
            </el-form-item>
            <el-form-item label="新站点" prop="newsitename">
                <el-input v-model="dataForm.newsitename" style="width: 25rem;" placeholder="新站点">
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
export default {
    data() {
        return {
            constants: this.$constants,
            visible: false,
            addOrUpdateVisible: false,
            dataForm: {
                id: 0,//主键
                companyname: '',
                custname: '',
                oldsitename: '',
                newsitename: ''
            },

            dataList: [],

        }
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
            console.log(id, data)
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
                    api.NewOldSiteaddAPI(this.dataForm).then(res => {
                        // TODO 保存数据
                        this.$emit('refreshDataList')
                        this.$emit('close')
                        this.$message.success('新增数据成功')
                        // this.visible = false
                    });
                } else {
                    api.NewOldSiteputAPI(this.dataForm).then(res => {
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