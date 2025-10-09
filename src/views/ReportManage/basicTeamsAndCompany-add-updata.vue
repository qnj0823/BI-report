<template>
    <!-- 基于 Element UI 新增和修改弹窗 -->
    <el-dialog :title="!dataForm.id ? '新增-ADD' : '修改-EDITE'" :close-on-click-modal="false" :visible.sync="visible">
        <!-- 新增和创建表单表单 -->
        <el-form :model="dataForm" ref="dataForm" @keyup.enter.native="dataSubmit()" label-width="160px">
            <el-form-item label="班组" prop="fgsbscName">
                <el-input v-model="dataForm.teamsno"  style="width: 25rem;" placeholder="班组">
                </el-input>
            </el-form-item>
            <el-form-item label="班组负责人" prop="fgsbscName">
                <el-input v-model="dataForm.teamsperson"  style="width: 25rem;" placeholder="班组负责人">
                </el-input>
            </el-form-item>
            <el-form-item label="单位体" prop="fgsbscName">
                <el-input v-model="dataForm.companyname" style="width: 25rem;" placeholder="单位体">
                </el-input>
            </el-form-item>
            <el-form-item label="负责人" prop="fgsbscName">
                <el-input v-model="dataForm.companyperson" style="width: 25rem;" placeholder="负责人">
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
                companyname:'',
                months: '',
                yezizhimonthgoal: '',
                othermonthgoal: '',
            },
            currentMonth:'',
            selectedbigValue: '',
            selectedbigLable: '',
            FactoryList: ''

        }
    },

    mounted() {
        this.getDataList()
        this.getMouth()
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
        getMouth(){
            this.currentMonth = new Date().getMonth() + 1; 
            console.log( this.currentMonth,666666666)
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
                    this.dataForm.months = this.currentMonth
                    oapi.APITeamsAndADD(this.dataForm).then(res => {
                        // TODO 保存数据
                        this.$emit('refreshDataList')
                        this.$emit('close')
                        this.$message.success('新增数据成功')
                        this.visible = false
                    });
                } else {
                    this.dataForm.months = this.currentMonth
                    oapi.APITeamsAndEDIT(this.dataForm).then(res => {
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