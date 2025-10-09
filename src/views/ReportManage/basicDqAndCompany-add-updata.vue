<template>
    <!-- 基于 Element UI 新增和修改弹窗 -->
    <el-dialog :title="!dataForm.id ? '新增-ADD' : '修改-EDITE'" :close-on-click-modal="false" :visible.sync="visible">
        <!-- 新增和创建表单表单 -->
        <el-form :model="dataForm" ref="dataForm" @keyup.enter.native="dataSubmit()" label-width="160px">
            <el-form-item label="战区" prop="fgsbscName">
                <el-input v-model="dataForm.dqname"  style="width: 25rem;" placeholder="战区">
                </el-input>
            </el-form-item>
            <el-form-item label="战区负责人" prop="fgsbscName">
                <el-input v-model="dataForm.dqperson"  style="width: 25rem;" placeholder="战区负责人">
                </el-input>
            </el-form-item>
            <el-form-item label="单位体" prop="fgsbscName">
                <el-input v-model="dataForm.companyname" style="width: 25rem;" placeholder="单位体">
                </el-input>
            </el-form-item>
            <el-form-item label="单位体负责人" prop="fgsbscName">
                <el-input v-model="dataForm.companyperson" style="width: 25rem;" placeholder="单位体负责人">
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
                dqname: '',
                dqperson:'',
                companyname: '',
                companyperson: '',
            },
            selectedbigValue: '',
            selectedbigLable: '',
            FactoryList: ''
        }
    },

    mounted() {
        this.getDataList()
    },
    methods: {
        getDataList() {
            api.BdallCustomer(this.dataForm).then(res => {
                this.FactoryList = res
                this.FactoryList.forEach(item => {
                    const levels = item.levelName.split(' -> ');
                    item.levelName1 = levels[0] || "";
                    // 去掉 levelName2 中的数字  
                    item.levelName2 = levels[1] || "";
                    item.levelName3 = levels[2] || "";
                });
                // 去重
                const map = new Map();
                this.FactoryList.forEach(item => {
                    if (!map.has(item.levelName2)) {
                        map.set(item.levelName2, item);
                    }
                });
                this.FactoryList = Array.from(map.values());
                this.FactoryList = this.FactoryList.map((item, index) => {
                    // 为每个对象添加 id 字段，值为 index + 1
                    return {
                        ...item, // 保留原有属性
                        id: index + 1 // 添加 id 字段，从 1 开始
                    };
                });
                console.log(this.FactoryList)
            })
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
                    oapi.APIDqAndCompanyADD(this.dataForm).then(res => {
                        // TODO 保存数据
                        this.$emit('refreshDataList')
                        this.$emit('close')
                        this.$message.success('新增数据成功')
                        this.visible = false
                    });
                } else {
                    oapi.APIDqAndCompanyEDIT(this.dataForm).then(res => {
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