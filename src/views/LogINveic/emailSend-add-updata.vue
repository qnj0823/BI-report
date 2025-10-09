<template>
    <!-- 基于 Element UI 新增和修改弹窗 -->
    <el-dialog :title="!dataForm.id ? '新增-ADD' : '修改-EDITE'" :close-on-click-modal="false" :visible.sync="visible">

        <!-- 新增和创建表单表单 -->
        <el-form :model="dataForm" label-width="160px">
            <el-form-item label="区域" prop="fgsbscName">
                <el-select style="width: 25rem;" v-model="selectedPROValue" filterable placeholder="请选择"
                    @change="handlebigChange1">
                    <el-option v-for="item in areaLst" :key="item.index" :label="item.name" :value="item.index" />
                </el-select>
            </el-form-item>
            <el-form-item label="日期" prop="linename">
                <el-input v-model="dataForm.curDate" disabled style="width: 100%;" placeholder="日期">
                </el-input>
            </el-form-item>
            <el-form-item label="运行状态" prop="linename">
                <el-input v-model="dataForm.runState" disabled style="width: 100%;" placeholder="运行状态">
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
            areaLst: [
                { index: 1, name: '湖南' },
                { index: 2, name: '湖北' },
                { index: 3, name: '广州' },
                { index: 4, name: '江西' },
                { index: 5, name: '河南' },
                { index: 6, name: '西南' },
                { index: 7, name: '陕西' }],
            selectedPROValue: '',
            selectedPROLable: '',
            dataForm: {
                areaName: '',
                curDate: '',
                runState: '停止'
            },
            dataForm2: {
                file: '',
            },
            // dataForm: {
            //     id: 0,
            //     areaName: '',
            //     linename: '',
            //     sitecode: '',
            //     sitename: '',
            //     type: ''
            // },
            result: []
        }
    },
    created() {
        this.calculateDates();
    },
    computed: {

    },
    mounted() {
    },
    methods: {
        handlebigChange1(value) {
            const selectedProItem = this.areaLst.find(item => item.index === value);
            this.selectedPROLable = selectedProItem.name
            this.dataForm.areaName = selectedProItem.name
           
        },
        // 获取今年的日期数据
        calculateDates() {
            const today = new Date();

            // 获取当前月份的月初时间 
            const startOfMonthDate = new Date(today.getFullYear(), today.getMonth(), 1);
            this.startOfMonth = this.formatDate(startOfMonthDate);

            // 获取截至今天的时间 
            this.endOfToday = this.formatDate(today);

            // this.dataForm.p_vouchdatestart = this.startOfMonth;
            this.dataForm.curDate = this.endOfToday;
            this.labelText = `${this.areas}区域到货明细表--截止${this.year}年${this.month}月${this.day}日`;
        },
        // 格式化日期
        formatDate(date) {
            this.year = date.getFullYear();
            this.month = String(date.getMonth() + 1).padStart(2, '0'); // 月份从0开始，所以加1 
            this.day = String(date.getDate()).padStart(2, '0');
            return `${this.year}-${this.month}-${this.day}`;
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

                }
            })

        },

        // 表单数据提交
        dataSubmit() {
            if (!this.dataForm.id) {
                api.rpaArtificialBilladdAPI(this.dataForm).then(res => {
                    // TODO 保存数据
                    this.$emit('refreshDataList')
                    this.$emit('close')
                    this.$message.success('新增数据成功')
                    this.visible = false
                });
            } else {
                // api.wlDeliveryLineputAPI(this.dataForm).then(res => {
                //     // TODO 保存数据
                //     this.$emit('refreshDataList')
                //     this.$emit('close')
                //     this.$message.success('修改数据成功')
                //     this.visible = false
                // })
            }

        }
    }
}
</script>