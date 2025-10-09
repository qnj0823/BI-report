<template>
    <!-- 基于 Element UI 新增和修改弹窗 -->
    <el-dialog :title="!dataForm.id ? '新增-ADD' : '修改-EDITE'" :close-on-click-modal="false" :visible.sync="visible">

        <el-form :inline="true" style="margin-top: 10px;" :model="dataForm1" @submit.native.prevent>
            <el-form-item>
                <el-input v-model="dataForm2.file" placeholder="选择文件" readonly></el-input>
                <input type="file" ref="fileInput" style="display: none" @change="handleFileUpload">
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="openFileInput">选择文件</el-button>
                <el-button type="success" @click="uploadFile">导入</el-button>
            </el-form-item>
        </el-form>
        <el-table :data="this.result">
            <el-table-column :show-overflow-tooltip="true" align="center" prop="name" label="文件名" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="path" label="文件地址" />
            <el-table-column header-align="center" align="center" width="150" label="操作">
                <template slot-scope="scope">
                    <el-button type="text" size="small" @click="deleteHandle(scope.row.id)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <!-- 邮件发送 -->
        <el-form :model="dataForm" :rules="rules" ref=dataFormRef label-width="160px">
            <el-form-item label="发送名称" prop="fgsbscName">
                <el-input v-model="dataForm.receiver" disabled style="width: 100%;" placeholder="发送名称">
                </el-input>
            </el-form-item>
            <el-form-item label="标题" prop="subject">
                <el-select style="width: 25rem;" v-model="dataForm.subject" filterable placeholder="请选择"
                    @change="handlebigChange1">
                    <el-option v-for="item in areaLst" :key="item.index" :label="item.name" :value="item.index" />
                </el-select>
            </el-form-item>
            <el-form-item label="内容" prop="body">
                <el-input v-model="dataForm.body" disabled style="width: 100%;" placeholder="内容">
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
import * as api from '@/api/tools/localStorage.js'
import axios from 'axios';
export default {
    data() {
        return {
            constants: this.$constants,
            visible: false,
            addOrUpdateVisible: false,
            dataForm1: {

            },
            dataForm: {
                receiver: 'yfjt@yufanjtbip.com',
                subject: '',
                body: ''
            },
            areaLst: [
                { index: 1, name: '湖南计划表' },
                { index: 2, name: '湖北计划表' },
                { index: 3, name: '广州计划表' },
                { index: 4, name: '江西计划表' },
                { index: 5, name: '河南计划表' },
                { index: 6, name: '西南计划表' },
                { index: 7, name: '陕西计划表' }],
            selectedPROValue: '',
            selectedPROLable: '',
            dataForm2: {
                file: '',
            },
            rules: {
                subject: [
                    { required: true, message: '请选择标题', trigger: 'change' }
                ],
                body: [
                    { required: true, message: '请输入内容', trigger: 'blur' }
                ]
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
    computed: {

    },
    mounted() {
    },
    methods: {
        handlebigChange1(value) {
            // 创建Date对象
            const now = new Date();

            // 获取各个时间部分
            const year = now.getFullYear();       // 年
            const month = now.getMonth() + 1;     // 月 (0-11，所以要+1)
            const day = now.getDate();            // 日
            const hours = now.getHours();         // 时
            const minutes = now.getMinutes();     // 分
            const seconds = now.getSeconds();     // 秒

            // 格式化为两位数显示
            const formatMonth = month < 10 ? `0${month}` : month;
            const formatDay = day < 10 ? `0${day}` : day;
            const formatHours = hours < 10 ? `0${hours}` : hours;
            const formatMinutes = minutes < 10 ? `0${minutes}` : minutes;
            const formatSeconds = seconds < 10 ? `0${seconds}` : seconds;

            // 组合成完整的时间字符串
            const timeString = `${year}-${formatMonth}-${formatDay} ${formatHours}:${formatMinutes}:${formatSeconds}`;

            
            const selectedProItem = this.areaLst.find(item => item.index === value);
            this.selectedPROLable = selectedProItem.name
            // this.dataForm.subject = selectedProItem.name
            this.dataForm.subject = selectedProItem.name + timeString

        },
        //选择文件
        openFileInput() {
            this.$refs.fileInput.click();
        },
        handleFileUpload(event) {
            this.files = event.target.files[0]
            this.dataForm2.file = event.target.files[0].name;
            console.log(this.files, this.dataForm2.file)
        },
        //导入
        uploadFile() {
            this.dataListLoading = true
            if (this.dataForm2.file) {
                let formData = new FormData();
                console.log(this.files)
                formData.append("file", this.files);
                formData.append('name', this.files.name) // 添加文件名

                api.addup(formData).then(res => {
                    console.log(res, 'res', res.path, res.name)
                    const fullPath = res.path;
                    const shortPath = 'http://bi.yufanjtbip.com:8069' + (fullPath.replace("/home/eladmin", ""));

                    this.result.push({
                        id: this.result.length + 1,
                        path: shortPath,
                        name: res.name
                    });
                    this.dataForm.body = this.result.map(item => item.path).join(',');

                    console.log(this.result)
                    this.$message.success('导入成功')
                    this.dataListLoading = false
                })
                    .catch(error => {
                        this.dataListLoading = false
                        this.$message.error("导入失败");
                    });
            } else {
                this.$message.error("请先选择文件");
            }
        },
        deleteHandle(id) {
            this.result = this.result.filter(item => item.id !== id);
            this.dataForm.body = this.result.map(item => item.path).join(',');
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
        async dataSubmit() {

            try {
                const valid = await this.$refs.dataFormRef.validate();
                if (!valid) {
                    // 验证不通过时直接返回
                    console.log('表单验证失败');
                    return;
                }
                // 判断环境并设置基础URL
                const isDev = process.env.NODE_ENV === 'development';
                console.log(isDev)
                const baseURL = isDev ? 'http://172.16.100.239:9000' : '';

                const response = await axios.post(
                    `${baseURL}/user/py_send_email`,
                    {}, // 请求体（POST data），这里可以留空或传其他数据
                    {
                        params: this.dataForm,
                        headers: {
                            'Accept': 'application/json, text/plain, */*',
                            'Content-Type': 'application/json',
                            // 'Host': '172.16.100.239:9000', // 明确指定Host
                            // 'Origin': 'http://bi.yufanjtbip.com:8059'
                        }
                    }
                );
                console.log("完整响应:", response.data.success);
                this.$emit('refreshDataList')
                this.$emit('close')
                this.$message.success('新增数据成功')
                this.visible = false
                this.addOrUpdateVisible = false

            } catch (err) {
                this.error = err.message || '请求失败';
            } finally {
                this.dataListLoading = false;
                // this.getdataList()
            }
        }
    }
}
</script>