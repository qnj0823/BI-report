<template>
    <!-- 基于 Element UI 新增和修改弹窗 -->
    <el-dialog :title="!dataForm.id ? '新增-ADD' : '修改-EDITE'" :close-on-click-modal="false" :visible.sync="visible">
        <!-- 新增和创建表单表单 -->
        <el-form :model="dataForm" ref="dataForm" @keyup.enter.native="dataSubmit()" label-width="160px">
            <el-form-item label="地区分类 " prop="fgsbscName">
                <el-select style="width: 25rem; " v-model="selectedbigValue" filterable placeholder="请选择"
                    @change="handlebigChange">
                    <el-option v-for="item in result" :key="item.id" :label="item.pkAreaclName" :value="item.id" />
                </el-select>
            </el-form-item>
            <el-form-item label="集团销售产品名称" prop="fgsbscName">
                <el-select style="width: 25rem; " v-model="selectedPROValue" filterable placeholder="请选择"
                    @change="handlebigChange1">
                    <el-option v-for="item in exportList" :key="item.id" :label="item.name" :value="item.id" />
                </el-select>
            </el-form-item>
            <el-form-item label="集团销售产品编号" prop="jtProductCode">
                <el-input v-model="dataForm.jtProductCode" style="width: 25rem;" disabled placeholder="集团销售产品编号">
                </el-input>
            </el-form-item>
            <el-form-item label="规格" prop="fgsbscName">
                <el-input v-model="dataForm.jtSpecifications" style="width: 25rem;" disabled placeholder="规格">
                </el-input>
            </el-form-item>
            <el-form-item label="光明产品名称" prop="fgsbscName">
                <el-select style="width: 25rem; " v-model="selectedLIghtValue" filterable  placeholder="请选择"
                    @change="handlebigChange2">
                    <el-option v-for="item in FactoryList" :key="item.id" :label="item.label" :value="item.value" />
                </el-select>
            </el-form-item>
            <el-form-item label="光明产品简称" prop="fgsbscName">
                <el-input v-model="dataForm.factoryProductSimpleName" style="width: 25rem;"  placeholder="光明产品简称">
                </el-input>
            </el-form-item>
            <el-form-item label="光明产品编号" prop="fgsbscName">
                <el-input v-model="dataForm.factoryProductCode" style="width: 25rem;" disabled placeholder="光明产品编号">
                </el-input>
            </el-form-item>
            <el-form-item label="规格" prop="fgsbscName">
                <el-input v-model="dataForm.factorySpecifications" style="width: 25rem;" disabled placeholder="规格">
                </el-input>
            </el-form-item>
            <el-form-item label="所属光明工厂" prop="fgsbscName">
                <el-select style="width: 25rem; " v-model="selectedLIGValue" filterable  placeholder="请选择"
                    @change="handlebigChange3">
                    <el-option v-for="item in lightList" :key="item.id" :label="item.label" :value="item.value" />
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
import * as oapi from '@/api/DQAPI/dqallApi.js'
import {
    mapGetters,
} from 'vuex'
export default {
    data() {
        return {
            constants: this.$constants,
            visible: false,
            addOrUpdateVisible: false,
            dataForm: {
                id: 0,//主键
                factoryProductCode: "",//光明产品编号(工厂)
                factoryProductName: '',//光明产品名称(工厂)
                factorySpecifications: '',//规格(工厂)
                jtProductCode: "",//光明产品编号(集团)
                jtProductName: '',//光明产品名称(集团)
                jtSpecifications: '',//规格(集团)
                factoryProductSimpleName: '',//	产品简称简称(工厂)
                areaName: '',//地区分类
                factoryName:'',//
            },
            dataForm1: {
                blurry: '',
            },
            dataForm2: {
                page: 0,
                size: 500,
                sort: '',
            },
            dictForm: {
                page: 0,
                size: 1000,
                dictName: 'light_product',
            },
            dictForm1: {
                page: 0,
                size: 1000,
                dictName: 'light_factory',
            },
            lightList: [],
            selectedLIGValue: '',
            selectedLIGLabel: '',

            dataList: [],
            FactoryList:[],
            result: [],
            exportList:[],
            selectedbigValue: '',//地区
            selectedbigLable:'',
            selectedPROValue:'',//集团产品
            selectedPROLable:'',
            selectedLIghtValue:'',
            selectedLIghtLable:''

        }
    },

    mounted() {
        this.getDataList()
        this.getCliqProd()
        this.getFactoryList()
    },
    methods: {
        handlebigChange(value) {
            const selectedAreaItem = this.result.find(item => item.id === value);
            this.dataForm.areaName =  selectedAreaItem.pkAreaclName
        },
        handlebigChange1(value){
            const selectedProItem = this.exportList.find(item => item.id === value);
            this.selectedPROLable = selectedProItem.name
            this.dataForm.jtProductName = this.selectedPROLable
            this.dataForm.jtProductCode = selectedProItem.code
            this.dataForm.jtSpecifications = selectedProItem.converBox
        },
        handlebigChange2(value) {
            const selectedLightItem = this.FactoryList.find(item => item.value === value);
            
            this.selectedminLabel = selectedLightItem.label;
            this.dataForm.factoryProductCode = selectedLightItem.value//光明产品编号
            this.dataForm.factoryProductName = this.selectedminLabel
            this.dataForm.factorySpecifications = selectedLightItem.dictSort
            console.log(this.dataForm)
        },
        handlebigChange3(value) {
            const selecLigItem = this.lightList.find(item => item.value === value);
            this.selectedLIGLabel = selecLigItem.label;
            this.dataForm.factoryName = this.selectedLIGLabel
            console.log(this.selectedLIGLabel)
        },

        //取消
        Cancel() {
            this.visible = false
            this.$emit('close')
            this.$emit('refreshDataList')
        },
        getFactoryList() {
            //光明产品
            oapi.getdictDetailAPI(this.dictForm).then(res => {
                this.FactoryList = res.content
                console.log(this.FactoryList)
            })
             //所属工厂
             oapi.getdictDetailAPI(this.dictForm1).then(res => {
                this.lightList = res.content
                console.log(this.lightList)
            })

        },
        getCliqProd() {
            api.TtrackProductAdd(this.dataForm2).then(res => {
                this.exportList = res.content
                console.log( this.exportList)
            })

        },
        getDataList() {
            this.dataListLoading = true
            api.SiteallCustomer(this.dataForm1).then(res => {
                this.dataList = res
                this.result = this.dataList
                    .filter(item => item.pkAreaclName)  // 过滤掉 pkAreaclName 为空、null 或 undefined 的对象  
                    .map(item => ({
                        ...item,  // 保留其他字段  
                        pkAreaclName: item.pkAreaclName.substring(0, 2) // 仅修改 pkAreaclName 字段  
                    }));

                const seen = new Set();
                this.result = this.result.filter(item => {
                    const duplicate = seen.has(item.pkAreaclName);
                    seen.add(item.pkAreaclName);
                    return !duplicate; // 只有没有看到过的才返回  
                });
                console.log(this.result)
            })

        },
        init(id, data) { // 初始化表单验证规则
            this.dataForm.id = id || 0
            console.log(data,'data')
            this.visible = true
            this.$nextTick(() => {
                this.selectedbigValue = data.areaName
                this.dataForm.areaName = data.areaName
                this.selectedPROValue = data.jtProductName
                this.dataForm.jtProductName = data.jtProductName
                this.dataForm.jtProductCode = data.jtProductCode
                this.dataForm.jtSpecifications = data.jtSpecifications
                this.selectedLIghtValue = data.factoryProductName
                this.dataForm.factoryProductName = data.factoryProductName
                this.dataForm.factoryProductSimpleName = data.factoryProductSimpleName
                this.dataForm.factoryProductCode = data.factoryProductCode
                this.dataForm.factorySpecifications = data.factorySpecifications
                this.selectedLIGValue = data.factoryName
                this.dataForm.factoryName=data.factoryName

            })
        },



        // 表单数据提交
        dataSubmit() {
            this.$refs['dataForm'].validate((valid) => {
                if (!this.dataForm.id) {
                    api.wlProductaFactddApi(this.dataForm).then(res => {
                        // TODO 保存数据
                        this.$emit('refreshDataList')
                        this.$emit('close')
                        this.$message.success('新增数据成功')
                        // this.visible = false
                    });
                } else {
                    api.wlProductaFactupdataApi(this.dataForm).then(res => {
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