<template>
    <!-- 基于 Element UI 新增和修改弹窗 -->
    <el-dialog title="选择需要导入的类型" :close-on-click-modal="false" :visible.sync="visible">
        <el-form ref="dataForm" @keyup.enter.native="dataSubmit()" label-width="160px">
            <!-- 点击按钮时，通过 $emit 触发自定义事件，并传递值 -->
            <el-button @click="handleType('覆盖')">导入覆盖</el-button>
            <el-button @click="handleType('追加')">导入追加</el-button>
        </el-form>
        <!-- <span slot="footer" class="dialog-footer">
            <el-button @click="Cancel()">取消</el-button>
            <el-button type="primary" @click="dataSubmit()">确定</el-button>
        </span> -->
    </el-dialog>
</template>

<script>
import * as api from '@/api/frame/customer.js'

export default {
    data() {
        return {
            visible: false,
            addOrUpdateVisible: false,
            areas:''
        }
    },
    computed: {},
    mounted() {
    },
    methods: {

        // 处理按钮点击，传递类型值给父组件
        handleType(type) {
            // 触发自定义事件（例如叫 "select-type"），并携带类型值
            this.$emit('select-type', type);
            this.$emit('area-type',this.areas)
            // 可选：如果需要点击后关闭弹窗，可以加上
            this.visible = false;
        },

        //取消
        Cancel() {
            this.visible = false
            this.$emit('close')
            this.$emit('refreshDataList')
        },

        init(area) { // 初始化表单验证规则
            this.areas = area
            this.visible = true
        },
        // 表单数据提交
        dataSubmit() {
            this.$refs['dataForm'].validate((valid) => {
                // api.wlFacteproaddApi(this.dataForm).then(res => {
                //     // TODO 保存数据
                //     this.$emit('refreshDataList')
                //     this.$emit('close')
                //     this.$message.success('新增数据成功')
                //     this.visible = false
                // });
            })
        }
    }
}
</script>