<template>
    <!-- 基于 Element UI 新增和修改弹窗 -->
    <el-dialog :title="!dataForm.id ? '新增-ADD' : '修改-EDITE'" :close-on-click-modal="false" :visible.sync="visible">
        <!-- 新增和创建表单表单 -->
        <el-form :model="dataForm" ref="dataForm" @keyup.enter.native="dataSubmit()" label-width="160px">
            <el-form-item label="区域" prop="areaName">
                <el-input v-model="dataForm.areaName" style="width: 25rem;" placeholder="区域">
                </el-input>
            </el-form-item>
            <el-form-item label="站点code" prop="wlSiteCode">
                <el-input v-model="dataForm.wlSiteCode" style="width: 25rem;" placeholder="站点code">
                </el-input>
            </el-form-item>
            <el-form-item label="站点名称" prop="wlSiteName">
                <el-input v-model="dataForm.wlSiteName" style="width: 25rem;" placeholder="站点名称">
                </el-input>
            </el-form-item>
            <el-form-item label="产品编码" prop="factoryProductCode">
                <el-input v-model="dataForm.factoryProductCode" style="width: 25rem;" placeholder="产品编码">
                </el-input>
            </el-form-item>
            <el-form-item label="产品名称" prop="factoryProductName">
                <el-input v-model="dataForm.factoryProductName" style="width: 25rem;" placeholder="产品名称">
                </el-input>
            </el-form-item>
            <el-form-item label="到货周期" prop="days">
                <el-input v-model="dataForm.days" style="width: 25rem;" placeholder="到货周期">
                </el-input>
            </el-form-item>
            <el-form-item label="sheets编号" prop="sheets">
                <el-input v-model="dataForm.sheets" style="width: 25rem;" placeholder="sheets编号">
                </el-input>
            </el-form-item>
            <el-form-item label="运行时间" prop="dates">
                <el-date-picker v-model="dataForm.dates" type="date" style="width: 25rem;" placeholder="选择运行时间"
                    format="yyyy-MM-dd" value-format="yyyy-MM-dd"></el-date-picker>
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
                address: '',
                areaName: '',
                contacts: '',
                tel: '',
                wlSiteName: ''

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
                    api.WLSetOtheraddAPI(this.dataForm).then(res => {
                        // TODO 保存数据
                        this.$emit('refreshDataList')
                        this.$emit('close')
                        this.$message.success('新增数据成功')
                        // this.visible = false
                    });
                } else {
                    api.WLSetOtherputAPI(this.dataForm).then(res => {
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