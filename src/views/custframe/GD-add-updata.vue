<template>
    <!-- 基于 Element UI 新增和修改弹窗 -->
    <el-dialog :title="!dataForm.id ? '新增-ADD' : '修改-EDITE'" :close-on-click-modal="false" :visible.sync="visible" :before-close="Cancel">
        <!-- 新增和创建表单表单 -->
        <el-form :model="dataForm" :rules="rules" ref="dataForm" @keyup.enter.native="dataSubmit()" label-width="160px">
            <!-- <el-form-item label="区域" prop="sitecode">
                <el-input v-model="dataForm.areaName" style="width: 100%;" placeholder="区域">
                </el-input>
            </el-form-item> -->
            <el-form-item label="光明站点">
                <el-select style="width: 25rem;" v-model="selectedPROValue" filterable placeholder="请选择"
                    @change="handlebigChange1">
                    <el-option v-for="item in exportList" :key="item.id" :label="item.sitename" :value="item.id" />
                </el-select>
            </el-form-item>
            <el-form-item label="到货初始值" prop="initialDate">
                <el-input v-model="dataForm.initialDate" style="width: 100%;" placeholder="到货初始值">
                </el-input>
            </el-form-item>
            <el-form-item label="第几天到货" prop="days">
                <el-input v-model="dataForm.days" style="width: 100%;" placeholder="第几天到货">
                </el-input>
            </el-form-item>
            <el-form-item label="报单日期" prop="orderDate">
                <el-input v-model="dataForm.orderDate" style="width: 100%;" placeholder="报单日期">
                </el-input>
            </el-form-item>
            <el-form-item label="到货日期" prop="arrivalDate">
                <el-input v-model="dataForm.arrivalDate" style="width: 100%;" placeholder="到货日期">
                </el-input>
            </el-form-item>
            <el-form-item label="报单日期1" prop="orderDate1">
                <el-input v-model="dataForm.orderDate1" style="width: 100%;" placeholder="报单日期1">
                </el-input>
            </el-form-item>
            <el-form-item label="到货日期1" prop="arrivalDate1">
                <el-input v-model="dataForm.arrivalDate1" style="width: 100%;" placeholder="到货日期1">
                </el-input>
            </el-form-item>
            <el-form-item label="报单日期2" prop="orderDate2">
                <el-input v-model="dataForm.orderDate2" style="width: 100%;" placeholder="报单日期2">
                </el-input>
            </el-form-item>
            <el-form-item label="到货日期2" prop="arrivalDate2">
                <el-input v-model="dataForm.arrivalDate2" style="width: 100%;" placeholder="到货日期2">
                </el-input>
            </el-form-item>
            <el-form-item label="产品" prop="factoryProductName">
                <el-input v-model="dataForm.factoryProductName" style="width: 100%;" placeholder="产品">
                </el-input>
            </el-form-item>
            <el-form-item label="区域归属" prop="factoryProductName">
                <el-input v-model="dataForm.areaCategory" style="width: 100%;" placeholder="区域归属">
                </el-input>
            </el-form-item>
            <el-form-item label="规则类型" prop="ruleType">
                <!-- <el-input v-model="dataForm.ruleType" style="width: 100%;" placeholder="规则类型">
                </el-input> -->
                <el-select style="width: 25rem;" v-model="selectedPROValueRule" filterable placeholder="请选择"
                    @change="handlebigChangeRule">
                    <el-option v-for="item in ruleTypeList" :key="item.id" :label="item.name" :value="item.id" />
                </el-select>
            </el-form-item>
            <!-- <el-form-item label="编号" prop="sheets">
                <el-input v-model="dataForm.sheets" style="width: 100%;" placeholder="sheet编号">
                </el-input>
            </el-form-item> -->
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
            exportList1:[],
            addOrUpdateVisible: false,
            dataForm2: {
                page: 0,
                size: 8000,
                sort: '',
            },
            dataForm3: {
                page: 1,
                size: 8000
            },
            selectedPROValue: '',
            selectedPROLable: '',
            selectedPROValueRule:'',
            selectedPROLableRule:'',
            dataForm: {
                id: 0,
                wlSiteName:'',
                initialDate: '',
                days: '',
                orderDate: '',
                arrivalDate:'',
                orderDate1:'',
                arrivalDate1:'',
                orderDate2:'',
                arrivalDate2:'',
                factoryProductName:'',
                ruleType:''
            },
            rules: {
                ruleType: [
                    { required: true, message: '请选择规则类型', trigger: 'blur' }
                ],
                wlSiteName: [
                    { required: true, message: '请输入站点名称', trigger: 'change' }
                ],
            },
            ruleTypeList:[
                {
                    id:'1',
                    name:'到货初始值',
                    lable:'init_date_compute'
                },
                {
                    id:'2',
                    name:'原味到货',
                    lable:'fix_product_1'
                },
                {
                    id:'3',
                    name:'新品(含330)到货',
                    lable:'fix_product_2'
                },
                {
                    id:'4',
                    name:'每日到货',
                    lable:'1_everyday'
                },
                {
                    id:'5',
                    name:'固定到货',
                    lable:'2_fix'
                }
            ]
        }
    },
    computed: {},
    mounted() {
        this.getCliqProd()
    },
    methods: {
        //光明物流站点
        getCliqProd() {
            api.BDSiteFactorycheckApi(this.dataForm2).then(res => {
                this.exportList = res.content
                api.BDSiteFactorycheckApi(this.dataForm3).then(res1 => {
                    this.exportList1 = res1.content
                    this.exportList = [...this.exportList, ...this.exportList1]
                    this.exportList = this.exportList.filter(item => item.areaname == '广东')
                console.log(this.exportList, 'this.exportList')
                })
                
            })
        },
        handlebigChange1(value) {
            const selectedProItem = this.exportList.find(item => item.id === value);
            this.selectedPROLable = selectedProItem.sitename
            this.dataForm.wlSiteName = selectedProItem.sitename
            this.dataForm.wlSiteCode = selectedProItem.sitecode
        },
        handlebigChangeRule(value){
            const selectedProItem = this.ruleTypeList.find(item => item.id === value);
            this.selectedPROLableRule = selectedProItem.name
            this.dataForm.ruleType = selectedProItem.lable
            console.log(this.dataForm.ruleType,666622)
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
                    this.selectedPROValue = data.wlSiteName
                    const datalable = this.ruleTypeList.find(item => item.lable == data.ruleType);
                    this.selectedPROValueRule = datalable.name
                    this.dataForm = data
                }
            })
        },
        // 表单数据提交
        dataSubmit() {
            this.$refs['dataForm'].validate((valid) => {
                if (!valid) {
                    // 验证不通过时直接返回
                    console.log('表单验证失败');
                    return;
                }
                if (!this.dataForm.id) {
                    api.wlFacteproaddDGApi(this.dataForm).then(res => {
                        // TODO 保存数据
                        this.$emit('refreshDataList')
                        this.$emit('close')
                        this.$message.success('新增数据成功')
                        this.visible = false
                    });
                } else {
                    api.wlFacteproupdateDGApi(this.dataForm).then(res => {
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