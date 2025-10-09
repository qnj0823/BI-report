<template>
    <!-- 基于 Element UI 新增和修改弹窗 -->
    <el-dialog :title="!dataForm.id ? '新增-ADD' : '修改-EDITE'" :close-on-click-modal="false" :visible.sync="visible">
        <!-- 新增和创建表单表单 -->
        <el-form :model="dataForm" ref="ruleForm" :rules="rules" @keyup.enter.native="dataSubmit()" label-width="160px">
            <el-form-item label="销售组织名称" prop="orgname">
                <el-select v-model="selectedValue" filterable style="width: 18rem; " placeholder="请选择/可搜索"
                    @change="handleChange">
                    <el-option v-for="item in orgnameList" :key="item.orgcode" :label="item.orgname"
                        :value="item.orgname">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="销售组织名称编码" prop="orgcode">
                <el-input v-model="dataForm.orgcode" :disabled="true" style="width: 18rem;" placeholder="销售组织名称编码">
                </el-input>
            </el-form-item>
            <el-form-item label="客户名称" prop="custname">
                <el-select v-model="selectedValue1" filterable style="width: 18rem;" placeholder="请选择/可搜索"
                    @change="handleChange1">
                    <el-option v-for="item in custnameList" :key="item.ccode" :label="item.cname" :value="item.cname">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="客户编码" prop="custcode">
                <el-input v-model="dataForm.custcode" :disabled="true" style="width: 18rem;" placeholder="客户编码">
                </el-input>
            </el-form-item>
            <el-form-item label="客户类型" prop="custtype">
                <el-select v-model="selectedValue3" style="width: 18rem;" placeholder="请选择" @change="handleChange3">
                    <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="产品名称" prop="productname">
                <el-select v-model="selectedValue2" filterable :style="{ width: '18rem', color: 'red !important' }"
                    placeholder="请选择/可搜索" @change="handleChange2">
                    <el-option v-for="item in productList" :key="item.pcode" :label="item.pname" :value="item.pname">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="产品编码" prop="productcode">
                <el-input v-model="dataForm.productcode" :disabled="true" style="width: 18rem; color: red;"
                    placeholder="产品编码">
                </el-input>
            </el-form-item>
            <el-form-item label="报单周期" prop="days">
                <el-input v-model="dataForm.days" style="width: 18rem;" placeholder="报单周期">
                </el-input>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="Cancel()">取消</el-button>
            <el-button type="primary" @click="dataSubmit('ruleForm')">确定</el-button>
        </span>
    </el-dialog>
</template>

<script>
import axios from 'axios';
import * as api from '@/api/frame/customer.js'
export default {
    data() {
        return {
            constants: this.$constants,
            visible: false,
            dataList: [],
            orgnameList: [],
            custnameList: [],
            productList: [],
            selectedValue: '',//销售组织 
            selectedLabel: '',//销售组织 
            selectedValue1: '',//客户名称
            selectedLabel1: '',//客户名称
            selectedValue2: '',//产品名称
            selectedLabel2: '',//产品名称
            selectedValue3: '',
            dataForm: {
                id: 0,
                custcode: '',//客户编码
                custid: '',//客户主键
                custname: '',//客户名称
                custtype: '',//客户类型(0单号客户、1双号客户、2单双客户)
                days: '',//报单周期
                orgcode: '',//销售组织编码
                orgname: '',//销售组织名称
                productcode: '',//产品编码
                productname: '',//产品名称 
            },
            options: [{
                value: '0',
                label: '单号客户'
            }, {
                value: '1',
                label: '双号客户'
            }, {
                value: '2',
                label: '单双客户'
            }],
            ruleForm: {
                orgname: '',
                custname: '',
                custtype: '',
                productname: '',
                days: '',
            },
            rules: {
                orgname: [
                    { required: true, message: '请输入销售组织名称', trigger: 'blur' }
                ],
                custname: [
                    { required: true, message: '请选择客户名称', trigger: 'blur' }
                ],
                custtype: [
                    { required: true, message: '请客户类型', trigger: 'blur' }
                ],
                productname: [
                    { required: true, message: '请选择产品名称', trigger: 'blur' }
                ],
                days: [
                    { required: true, message: '请输入周期', trigger: 'change' }
                ],
            }
            // value: ''
        }
    },

    mounted() {
        this.getDateList()
    },
    watch: {
        //判断，销售组织是否改变。改变则把客户的数据清除
        selectedValue(newVal, oldVal) {
            console.log(newVal, 'newVal', oldVal)
            if (oldVal && newVal != oldVal) {
                this.selectedValue1 = ''
                this.selectedLabel1 = ''
                this.dataForm.custname = ''
                this.dataForm.custcode = ''
                this.selectedValue2 = ''
                this.selectedLabel2 = ''
                this.dataForm.productname = ''
                this.dataForm.productcode = ''
                this.selectedValue3 = ''
                this.dataForm.custtype = ''
            }
        },
        selectedValue1(newVal, oldVal) {
            if (oldVal && newVal != oldVal) {
                this.selectedValue2 = ''
                this.selectedLabel2 = ''
                this.dataForm.productname = ''
                this.dataForm.productcode = ''
                this.selectedValue3 = ''
                this.dataForm.custtype = ''
            }
        }
    },
    methods: {
        async getDateList() {
            this.error = null;
            try {
                const response = await axios.get(
                    'http://172.16.100.241:8077/api/trackBipJgdDetailHz/all',
                );
                this.dataList = response.data;
                //通过销售组织编码去重
                this.orgnameList = [
                    ...new Map(this.dataList.map(item => [item.orgcode, item])).values()
                ];
                console.log(this.dataList, 'dataList')
                console.log(this.orgnameList, 'orgnameList')
            } catch (err) {
                this.error = err.message || '请求失败';
            } finally {
                this.loading = false;
            }
        },
        //销售组织
        handleChange(value) {
            const selectedItem = this.orgnameList.find(item => item.orgname === value);
            this.selectedLabel = selectedItem ? selectedItem.orgcode : '';
            this.selectedValue = value;
            console.log(this.orgnameList, '666666')
            this.dataForm.orgname = this.selectedValue
            this.dataForm.orgcode = this.selectedLabel
            //通过销售组织编码取出原数组里面对应的客户数组
            const result = this.dataList.filter(item => item.orgcode === this.selectedLabel);
            this.custnameList = [
                ...new Map(result.map(item => [item.ccode, item])).values()
            ];
            console.log('Selected value:', this.selectedValue);
            console.log('Selected label:', this.selectedLabel);
        },
        //客户名称
        handleChange1(value) {
            const selectedItem = this.custnameList.find(item => item.cname === value);
            this.selectedLabel1 = selectedItem ? selectedItem.ccode : '';
            this.selectedValue1 = value;
            this.dataForm.custname = this.selectedValue1
            this.dataForm.custcode = this.selectedLabel1
            //通过客户编码取出原数组里面对应的相应客户产品数组
            const result1 = this.dataList.filter(item => item.ccode === this.selectedLabel1);
            this.productList = [
                ...new Map(result1.map(item => [item.pcode, item])).values()
            ];

            console.log('Selected value:', this.selectedValue1);
            console.log('Selected label:', this.selectedLabel1);
        },
        //产品名称
        handleChange2(value) {
            const selectedItem = this.productList.find(item => item.pname === value);
            this.selectedLabel2 = selectedItem ? selectedItem.pcode : '';
            this.selectedValue2 = value;
            this.dataForm.productname = this.selectedValue2
            this.dataForm.productcode = this.selectedLabel2
            console.log('Selected value:', this.selectedValue2);
            console.log('Selected label:', this.selectedLabel2);
        },
        //客户类型
        handleChange3(value) {
            this.dataForm.custtype = value
            console.log(value, 'value')

        },
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
                    this.dataForm = data
                    console.log(this.dataForm)
                    this.selectedValue = data.orgname
                    this.selectedValue1 = data.custname
                    this.selectedValue3 = data.custtype
                    this.selectedValue2 = data.productname
                    this.getDateList()
                    setTimeout(() => {
                        this.handleChange(this.selectedValue)
                        this.handleChange1(this.selectedValue1)
                    }, 1000);

                }

            })
        },

        // 表单数据提交
        dataSubmit(formName) {
            this.$refs[formName].validate((valid) => {
                console.log(valid,'valid')
                if (valid) {
                    this.submitFormData();
                } else {
                    // 表单验证失败
                    console.log('表单验证失败，请检查输入');
                    return false;
                }

            })
        },
        submitFormData() {
            if (!this.dataForm.id) {
                api.OrderCycleSetaddAPI(this.dataForm).then(res => {
                    // TODO 保存数据
                    this.$emit('refreshDataList')
                    this.$emit('close')
                    this.$message.success('新增数据成功')
                    this.visible = false
                });
            } else {
                api.OrderCycleSetputAPI(this.dataForm).then(res => {
                    // TODO 保存数据
                    this.$emit('refreshDataList')
                    this.$emit('close')
                    this.$message.success('修改数据成功')
                    this.visible = false
                })
            }
        }
    }
}
</script>