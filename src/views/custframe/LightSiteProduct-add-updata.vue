<template>
    <!-- 基于 Element UI 新增和修改弹窗 -->
    <el-dialog :title="!dataForm.id ? '新增-ADD' : '修改-EDITE'" :close-on-click-modal="false" :visible.sync="visible">
        <!-- 新增和创建表单表单 -->
        <el-form :model="dataForm" ref="dataForm" @keyup.enter.native="dataSubmit()" label-width="160px">
            <el-form-item label="序号" prop="fgsbscName">
                <el-input v-model="dataForm.orderid" style="width: 100%;" placeholder="序号">
                </el-input>
            </el-form-item>
            <el-form-item label="工厂产品名称" prop="name">
                <el-input v-model="dataForm.name" style="width: 100%;" placeholder="产品名称">
                </el-input>
            </el-form-item>
            <el-form-item label="箱规格" prop="model">
                <el-input v-model="dataForm.model" style="width: 100%;" placeholder="箱规格">
                </el-input>
            </el-form-item>
            <el-form-item label="工厂" prop="factory">
                <el-input v-model="dataForm.factory" style="width: 100%;" placeholder="工厂">
                </el-input>
            </el-form-item>
            <el-form-item label="工厂产品简称" prop="simplename">
                <el-input v-model="dataForm.simplename" style="width: 100%;" placeholder="产品简称">
                </el-input>
            </el-form-item>
            <el-form-item label="工厂产品编码/备注" prop="code">
                <el-input v-model="dataForm.code" style="width: 100%;" placeholder="产品编码/备注">
                </el-input>
            </el-form-item>
            <el-form-item label="区域" prop="areaname">
                <el-input v-model="dataForm.areaname" style="width: 100%;" placeholder="区域">
                </el-input>
            </el-form-item>
            <el-form-item label="集团产品名称" prop="materialname">
                <el-select style="width: 25rem; " v-model="selectedPROValue" filterable placeholder="请选择"
                    @change="handlebigChange1">
                    <el-option v-for="item in exportList" :key="item.id" :label="item.name" :value="item.id" />
                </el-select>
            </el-form-item>
            <el-form-item label="集团产品编码" prop="materialcode">
                <el-input v-model="dataForm.materialcode" disabled style="width: 100%;" placeholder="集团产品编码">
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
            exportList: [],
            addOrUpdateVisible: false,
            dataForm2: {
                page: 0,
                size: 500,
                sort: '',
            },
            selectedPROValue: '',
            selectedPROLable:'',
            dataForm: {
                id: 0,
                factory: '',
                factorycode: '',
                materialcode: '',
                materialname: '',
                model: '',
                name: '',
                orderid: '',
                areaname: '',
                simplename: '',
                code: '',
            }
        }
    },
    computed: {

    },
    mounted() {
        this.getCliqProd()
    },
    methods: {
        //集团产品
        getCliqProd() {
            api.TtrackProductAdd(this.dataForm2).then(res => {
                this.exportList = res.content
                console.log(this.exportList)
            })

        },
        handlebigChange1(value) {
            const selectedProItem = this.exportList.find(item => item.id === value);
            this.selectedPROLable = selectedProItem.name
            this.dataForm.materialname = this.selectedPROLable
            this.dataForm.materialcode = selectedProItem.code
        },
        //取消
        Cancel() {
            this.visible = false
            this.$emit('close')
            this.$emit('refreshDataList')
        },

        init(id, data) { // 初始化表单验证规则
            this.dataForm.id = id || ''
            this.visible = true
            this.$nextTick(() => {
                if (this.dataForm.id) {
                    this.selectedPROValue = data.materialname
                    this.dataForm.materialname = data.materialname
                    this.dataForm.materialcode = data.materialcode
                    this.dataForm = data

                }
            })

        },
        // 表单数据提交
        dataSubmit() {
            this.$refs['dataForm'].validate((valid) => {
                if (!this.dataForm.id) {
                    api.BDMaterialFactoryaddApi(this.dataForm).then(res => {
                        // TODO 保存数据
                        this.$emit('refreshDataList')
                        this.$emit('close')
                        this.$message.success('新增数据成功')
                        this.visible = false
                    });
                } else {
                    api.BDMaterialFactoryupallApi(this.dataForm).then(res => {
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