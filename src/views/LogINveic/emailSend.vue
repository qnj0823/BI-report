<template>
    <div class='emailSend'>
        <el-form :inline="true" style="width: 100%; margin: 0 auto;">
            <el-form-item>
                <el-date-picker v-model="dataForm.p_vouchdatestart" value-format="yyyy-MM-dd" type="date"
                    placeholder="开始日期" clearable style="width: 100%"></el-date-picker>
            </el-form-item>
            <el-button class="filter-item" size="mini" type="success" icon="el-icon-search"
                @click="getDataList">查询</el-button>
            <el-form-item>
                <el-button type="primary" @click="addOrUpdateHandle()">是否手动</el-button>
            </el-form-item>
        </el-form>
        <el-table class="table" ref="table" border :data="dataList" v-loading="dataListLoading"
            style="width: 100%; margin: 0 auto; margin-bottom: 50px;">
            <el-table-column :show-overflow-tooltip="true" align="center" prop="areaName" label="区域" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="curDate" label="时间" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="runState" label="运行状态" />
            <el-table-column header-align="center" align="center" width="150" label="操作">
                <template slot-scope="scope">
                    <el-button type="text" size="small" @click="deleteHandle(scope.row.id)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <!-- 表单弹窗, 新增数据和修改数据 -->
        <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"
            @close="addOrUpdateVisible = false"></add-or-update>
    </div>
</template>

<script>
import axios from 'axios';
import FileUpload from '../tools/storage/local/CustomUpload.vue'
import * as api from '@/api/tools/localStorage.js'
import * as oapi from '@/api/frame/customer.js'
import AddOrUpdate from './emailSend-add-updata'
export default {
    name: 'emailSend-page',
    components: { FileUpload, AddOrUpdate, },
    data() {
        return {
            msg: 'emailSend-page',
            addOrUpdateVisible: false,
            dataListLoading: false,
            dataList: [],
            
            api,
            dataForm2: {
                file: '',
            },
            dataForm: {
                p_vouchdatestart: ''
            },
            areaForm: {

            }
        };
    },
    created() {
        this.calculateDates();
    },
    mounted() {
        this.getDataList()
    },
    methods: {
        // 新增 / 修改
        addOrUpdateHandle(id, data) {
            this.addOrUpdateVisible = true
            this.$nextTick(() => {
                this.$refs.addOrUpdate.init(id, data)
            })
        },
        //删除
        deleteHandle(id) {
            var ids = id ? [id] : this.dataListSelections.map(item => {
                return item.id
            })
            this.$confirm(`您确定对[ids=${ids.join(',')}]进行[${id ? '删除' : '批量删除'}]操作?`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                console.log('删除', ids);
                oapi.rpaArtificialBilldelAPI(ids).then(res => {
                    // TODO 处理删除
                    this.$emit('refreshDataList')
                    this.$emit('close')
                    this.$message.success('删除成功')
                    this.getDataList()
                })
            })

        },
        getDataList() {
            oapi.rpaArtificialBillAPI().then(res => {
                this.dataList = res
                this.dataList = this.dataList.filter(item => item.curDate === this.dataForm.p_vouchdatestart);
                console.log(res)
            })
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
            this.dataForm.p_vouchdatestart = this.endOfToday;
            this.labelText = `${this.areas}区域到货明细表--截止${this.year}年${this.month}月${this.day}日`;
        },
        // 格式化日期
        formatDate(date) {
            this.year = date.getFullYear();
            this.month = String(date.getMonth() + 1).padStart(2, '0'); // 月份从0开始，所以加1 
            this.day = String(date.getDate()).padStart(2, '0');
            return `${this.year}-${this.month}-${this.day}`;
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
                    console.log(shortPath)
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

        handleSuccess() {
            return api.addup()
        },
        handleUploadSuccess(res) {
            // this.getCycleList()
        },
        async dataSubmit() {

            try {
                const response = await axios.post(
                    'http://172.16.100.239:9000/user/py_send_email',
                    {}, // 请求体（POST data），这里可以留空或传其他数据
                    {
                        params: this.dataForm
                    }
                );
                console.log("完整响应:", response.data.success);

            } catch (err) {
                this.error = err.message || '请求失败';
            } finally {
                this.dataListLoading = false;
                // this.getdataList()
            }
        }
    }
};
</script>

<style scoped lang="scss"></style>