<template>
    <!-- 基于 Element UI 新增和修改弹窗 -->
    <el-dialog :title="!dataForm.id ? '新增-ADD' : '修改-EDITE'" :close-on-click-modal="false"
        :style="{ maxWidth: '90vw', width: '80vw', margin: '0 auto' }" :visible.sync="visible">
        <!-- 新增和创建表单表单 -->
        <el-form :model="dataForm" ref="dataForm" @keyup.enter.native="dataSubmit()" label-width="100px">
            <el-form-item label="省份" prop="sitename">
                <el-select v-model="selectedValue3" filterable placeholder="请选择/可搜索" @change="handleChange3">
                    <el-option v-for="item in chinasf" :key="item.id" :label="item.label" :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="销售区域/省区" prop="id">
                <el-select v-model="selectedValue2" filterable placeholder="请选择/可搜索" @change="handleChange2">
                    <el-option v-for="item in sqList" :key="item.id" :label="item.name" :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="光明销售公司" prop="id">
                <el-select v-model="selectedValue1" filterable placeholder="请选择/可搜索" @change="handleChange1">
                    <el-option v-for="item in brightList" :key="item.id" :label="item.label" :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="工厂供应链">
                <el-select v-model="selectedValue" filterable placeholder="请选择/可搜索" @change="handleChange">
                    <el-option v-for="item in FactoryList" :key="item.id" :label="item.label" :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="是否满产" prop="id">
                <el-input v-model="dataForm.isfull" style="width: 200px;" placeholder="是否满产"></el-input>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="Cancel()">取消</el-button>
            <el-button type="primary" @click="dataSubmit()">确定</el-button>
        </span>
    </el-dialog>
</template>

<script>
import * as api from '@/api/Business/analysis.js'
export default {
    data() {
        return {
            visible: false,
            dictForm: {
                page: 0,
                size: 100,
                dictName: 'factory_status',
            },
            dictForm1: {
                page: 0,
                size: 100,
                dictName: 'bright_sales',
            },
            dictForm2: {
                page: 0,
                size: 100,
                dictName: 'china_provinces',
            },
            dataForm: {
                id: 0,
                sqname: '',
                sqid: '',
                sname: '',
                salesorgname: '',
                isfull: '',
                factoryname: ''
            },
            Judgment: '',
            FactoryList: [],
            brightList: [],
            sqList: [],
            chinasf: [],
            selectedLabel: '',//工厂
            selectedValue: '',//工厂
            selectedLabel1: '',//光明
            selectedValue1: '',//光明
            selectedLabel2: '',//省区
            selectedValue2: '',//省区
            selectedLabel3: '',//中国行政省份
            selectedValue3: '',//中国行政省份


        }
    },
    mounted() {
        this.getFactoryList()
        // this.getDataList()
    },
    methods: {
        //工厂字典和光明销售公司字典和省区获取
        getFactoryList() {
            //工厂
            api.getdictDetailAPI(this.dictForm).then(res => {
                this.FactoryList = res.content
                console.log(this.FactoryList)
            })
            //光明销售公司
            api.getdictDetailAPI(this.dictForm1).then(res => {
                this.brightList = res.content
                console.log(this.brightList)
            })
            //省区
            api.gettracksqAPI().then(res => {
                this.sqList = res
                console.log(this.sqList)
            })
            //中国省份
            api.getdictDetailAPI(this.dictForm2).then(res => {
                this.chinasf = res.content
                console.log(this.chinasf)
            })
        },
        //工厂字典
        handleChange(value) {
            const selectedItem = this.FactoryList.find(item => item.id === value);
            this.selectedLabel = selectedItem ? selectedItem.label : '';
            this.selectedValue = value;
            this.dataForm.factoryname = this.selectedLabel
            console.log('Selected value:', this.selectedValue);
            console.log('Selected label:', this.selectedLabel);
        },
        //光明销售公司字典
        handleChange1(value) {
            const selectedItem = this.brightList.find(item => item.id === value);
            this.selectedLabel1 = selectedItem ? selectedItem.label : '';
            this.selectedValue1 = value;
            this.dataForm.salesorgname = this.selectedLabel1
            console.log('Selected value:', this.selectedValue1);
            console.log('Selected label:', this.selectedLabel1);
        },
        //中国省份
        handleChange3(value) {
            const selectedItem = this.chinasf.find(item => item.id === value);
            this.selectedLabel3 = selectedItem ? selectedItem.label : '';
            this.selectedValue3 = value;
            this.dataForm.sname = this.selectedLabel3
            console.log('Selected value:', this.selectedValue3);
            console.log('Selected label:', this.selectedLabel3);
        },
        //省区
        handleChange2(value) {
            const selectedItem = this.sqList.find(item => item.id === value);
            this.selectedLabel2 = selectedItem ? selectedItem.name : '';
            this.selectedValue2 = value;
            this.dataForm.sqid = this.selectedValue2
            this.dataForm.sqname = this.selectedLabel2
            console.log('Selected value:', this.selectedValue2);
            console.log('Selected label:', this.selectedLabel2);
        },
        init(id, data) {
            this.dataForm.id = id || 0
            console.log(data)
            // 初始化表单验证规则
            this.visible = true
            this.$nextTick(() => {
                if (this.dataForm.id) {
                    this.selectedValue = data.factoryname
                    this.selectedValue1 = data.salesorgname
                    this.selectedValue2 = data.sqname
                    this.selectedValue3 = data.sname
                    this.dataForm.id = data.id
                    this.dataForm.factoryname = data.factoryname
                    this.dataForm.salesorgname = data.salesorgname
                    this.dataForm.sname = data.sname
                    this.dataForm.sqid = data.sqid
                    this.dataForm.sqname = data.sqname
                }
            })
        },
        //取消
        Cancel() {
            this.visible = false
            this.$emit('close')
        },
        // 表单数据提交
        dataSubmit() {
            this.$refs['dataForm'].validate((valid) => {
                if (!this.dataForm.id) {
                    api.getDailyPlanaddAPI(this.dataForm).then(res => {
                        // TODO 保存数据
                        this.$emit('refreshDataList')
                        this.$emit('close')
                        this.$message.success('新增数据成功')
                        this.visible = false
                    })
                } else {
                    api.getDailyPlanupdataAPI(this.dataForm).then(res => {
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
<style scoped></style>