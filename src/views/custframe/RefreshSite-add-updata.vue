<template>
    <!-- 基于 Element UI 新增和修改弹窗 -->
    <el-dialog :title="!dataForm.id ? '新增-ADD' : '修改-EDITE'" :close-on-click-modal="false" :visible.sync="visible">
        <!-- 新增和创建表单表单 -->
        <el-form :model="dataForm" ref="dataForm" @keyup.enter.native="dataSubmit()" label-width="160px">
            <el-form-item label="序号">
                <el-input v-model="dataForm.orderid" style="width: 100%;" placeholder="序号">
                </el-input>
            </el-form-item>
            <el-form-item label="区域">
                <el-input v-model="dataForm.areaname" style="width: 100%;" placeholder="区域">
                </el-input>
            </el-form-item>
            <el-form-item label="光明物流站点编码" prop="sitecode">
                <el-input v-model="dataForm.sitecode" style="width: 100%;" placeholder="光明物流站点编码">
                </el-input>
            </el-form-item>
            <el-form-item label="光明物流站点编码(清新活力)" prop="othercode">
                <el-input v-model="dataForm.othercode" style="width: 100%;" placeholder="光明物流站点编码(清新活力)">
                </el-input>
            </el-form-item>
            <el-form-item label="光明物流站点名称" prop="sitename">
                <el-input v-model="dataForm.sitename" style="width: 100%;" placeholder="光明物流站点名称">
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
                size: 5000,
                sort: '',
            },
            selectedPROValue: '',
            selectedPROLable:'',
            dataForm: {
                id: 0,
                areaname: '',
                orderid: '',
                othercode: '',
                sitecode: '',
                sitename: '',
            }
        }
    },
    computed: {

    },
    mounted() {
        this.getCliqProd()
    },
    methods: {
        //光明物流站点
        getCliqProd() {
            api.BDSiteFactorycheckApi(this.dataForm2).then(res => {
                this.exportList = res.content
                console.log(this.exportList,'this.exportList')
            })

        },
        handlebigChange1(value) {
            const selectedProItem = this.exportList.find(item => item.id === value);
            this.selectedPROLable = selectedProItem.sitename
            this.dataForm.sitename = selectedProItem.sitename
            this.dataForm.sitecode = selectedProItem.sitecode
            
        },
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
                    this.selectedPROValue = data.sitename
                    this.dataForm.sitename = data.sitename
                    this.dataForm.sitecode = data.sitecode
                    this.dataForm = data

                }
            })

        },
        // 表单数据提交
        dataSubmit() {
            this.$refs['dataForm'].validate((valid) => {
                if (!this.dataForm.id) {
                    api.bdSiteaddAPI(this.dataForm).then(res => {
                        // TODO 保存数据
                        this.$emit('refreshDataList')
                        this.$emit('close')
                        this.$message.success('新增数据成功')
                        this.visible = false
                    });
                } else {
                    api.bdSiteputAPI(this.dataForm).then(res => {
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