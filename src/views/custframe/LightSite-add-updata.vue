<template>
    <!-- 基于 Element UI 新增和修改弹窗 -->
    <el-dialog :title="!dataForm.id ? '新增-ADD' : '修改-EDITE'" :close-on-click-modal="false" :visible.sync="visible">
        <!-- 新增和创建表单表单 -->
        <el-form :model="dataForm" ref="dataForm" @keyup.enter.native="dataSubmit()" label-width="160px">                  
                    <el-form-item label="序号" prop="fgsbscName">
                        <el-input v-model="dataForm.orderid" style="width: 100%;"  placeholder="序号">
                        </el-input>
                    </el-form-item>
                    <el-form-item label="销售区域" prop="fgsbscName">
                        <el-input v-model="dataForm.areaname" style="width: 100%;"  placeholder="销售区域">
                        </el-input>
                    </el-form-item>
                    <el-form-item label="光明站点code" prop="fgsbscName">
                        <el-input v-model="dataForm.sitecode" style="width: 100%;"  placeholder="光明站点code">
                        </el-input>
                    </el-form-item>
                    <el-form-item label="光明站点" prop="fgsbscName">
                        <el-input v-model="dataForm.sitename" style="width: 100%;"  placeholder="光明站点">
                        </el-input>
                    </el-form-item>
                    <el-form-item label="仓库" prop="fgsbscName">
                        <el-input v-model="dataForm.store" style="width: 100%;"  placeholder="光明站点">
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
            dataForm:{
                id:0,
                orderid:'',
                areaname:'',
                sitecode:'',
                sitename:''

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
            this.dataForm.id = id || 0
            this.visible = true
            this.$nextTick(() => {
                if (this.dataForm.id) {
                    this.dataForm=data
                   
                }
            })
            
        },



        // 表单数据提交
        dataSubmit() {
            this.$refs['dataForm'].validate((valid) => {
                if (!this.dataForm.id) {
                    api.BDSiteFactoryaddApi(this.dataForm).then(res => {
                        // TODO 保存数据
                        this.$emit('refreshDataList')
                        this.$emit('close')
                        this.$message.success('新增数据成功')
                        this.visible = false
                    });
                } else {
                    api.BDSiteFactoryupallApi(this.dataForm).then(res => {
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