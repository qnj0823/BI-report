<template>
    <div class='form'>
        <el-form :inline="true" style="margin-top: 10px;" @submit.native.prevent>
            <el-form-item>
                <Local @getDataList="getDataList"   @file="handleFileUploaded" ref="local" />
            </el-form-item>
            <el-form-item style="margin-top: 8px;">
                <!-- <el-button type="success" @click="uploadFile">导入</el-button> -->
                <el-form-item>
                    <el-date-picker value-format="yyyy-MM-dd" v-model="dataForm1.requestdate" type="date"
                        placeholder="选择日期" clearable style="width:100%"></el-date-picker>
                </el-form-item>
                <el-button type="warning" @click="getcalculate()">计算</el-button>
                <el-button type="warning" @click="exportData">导出 Excel</el-button>
            </el-form-item>

        </el-form>
        <el-table :row-style="{ height: '10px' }" :cell-style="{ padding: '5px 0' }"
            :header-cell-style="{ background: '#BD1E21', color: 'white' }" v-loading="dataListLoading" max-height="700"
            class="custom-table" id="exportTable" ref="table" :data="dataList" border style="width: 100%;">
            <el-table-column header-align="center" align="center" label="到货数据">
                <el-table-column prop="sitename" header-align="center" align="center" width="80" label="区域" />
                <el-table-column prop="c" header-align="center" align="center" width="80" label="大LOOK" />
                <el-table-column prop="d" header-align="center" align="center" width="80" label="小LOOK" />
                <el-table-column prop="e" header-align="center" align="center" width="60" label="健能" />
                <el-table-column prop="f" header-align="center" align="center" width="60" label="健爽" />
                <el-table-column prop="g" header-align="center" align="center" width="70" label="LOOK优选" />
                <el-table-column prop="h" header-align="center" align="center" width="65" label="大白桃" />
                <el-table-column prop="i" header-align="center" align="center" width="65" label="小白桃" />
                <el-table-column prop="j" header-align="center" align="center" width="60" label="300姜黄" />
                <el-table-column prop="k" header-align="center" align="center" width="60" label="330椰子" />
                <el-table-column prop="l" header-align="center" align="center" width="60" label="新鲜牧场" />
                <el-table-column prop="m" header-align="center" align="center" width="65" label="大清新" />
                <el-table-column prop="n" header-align="center" align="center" width="65" label="小清新" />
                <el-table-column prop="o" header-align="center" align="center" width="75" label="大清新健爽(橙)" />
                <el-table-column prop="p" header-align="center" align="center" width="75" label="小清新健爽(橙)" />
                <el-table-column prop="q" header-align="center" align="center" width="60" label="大0糖0脂" />
                <el-table-column prop="r" header-align="center" align="center" width="60" label="小0糖0脂" />
                <el-table-column prop="s" header-align="center" align="center" width="110" label="1L椰子牛乳" />
                <el-table-column prop="t" header-align="center" align="center" label="310 椰子" />
                <el-table-column prop="u" header-align="center" align="center" label="1Kg常温Look" />
                <el-table-column prop="v" header-align="center" align="center" label="小原味戴永红" />
                <el-table-column prop="w" header-align="center" align="center" label="小原味绿叶水果" />
                <el-table-column prop="X" header-align="center" align="center" label="300常温" />
                <el-table-column prop="Y" header-align="center" align="center" label="380双柚汁" />
                <el-table-column prop="Z" header-align="center" align="center" label="1.35双柚汁" />
                <el-table-column prop="AA" header-align="center" align="center" label="380橙汁" />
                <el-table-column prop="AB" header-align="center" align="center" label="1.35橙汁" />
                <el-table-column prop="AC" header-align="center" width="100" align="center" label="合计" />
            </el-table-column>
            <el-table-column header-align="center" width="100" align="center" label="其中搭赠数据">
                <el-table-column prop="f24Piece" header-align="center" width="100" align="center" label="330椰子">
                </el-table-column>
                <el-table-column prop="f72Piece" header-align="center" align="center" label="合计">
                </el-table-column>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { data } from 'vue-echarts';
// import Local from './tools/storage/local/Upload.vue'
import Local from '../tools/storage/local/Upload.vue'
import * as api from '@/api/Business/analysis.js'
export default {
    name: 'form-page',
    components: { Local },
    data() {
        return {
            msg: 'form-page',
            dataList: [],
            dataForm2: {
                file: '',
            },
            dataForm: {
                page: 0,
                size: 800,
                userid: ''
            },
            dataForm1: {
                datetype: '',
                requestdate: '',
                sitename: '',
                userid: '',
            },
            dataForm2: {
                datetype: '',
                requestdate: '',
                sitename: '',
                userid: '',
            },
            userids: '',
            files:'',
            dataListLoading: false,
            activeName: 'first',
        };
    },
    created() {
        this.getCurrentDate();
    },
    mounted() {
        if (this.userid != '') {
            sessionStorage.setItem('userid', this.userid);
        }
        this.userids = sessionStorage.getItem('userid');
        this.getDataList()
    },
    computed: {
        ...mapGetters([
            'userid'
        ])
    },
    methods: {
        //获取初始时间
        getCurrentDate() {
            const date = new Date();
            const year = date.getFullYear();
            let startmonth = String(date.getMonth() + 1).padStart(2, '0'); // 月份从0开始，需要加1
            let startday = String(date.getDate()).padStart(2, '0');
            let currentDate = `${year}-${startmonth}-${startday}`;
            this.dataForm1.requestdate = currentDate
        },
        //选择文件
        // openFileInput() {
        //     this.$refs.fileInput.click();
        // },
        // handleFileUpload(event) {
        //     this.files = event.target.files[0]
        //     this.dataForm2.file = event.target.files[0].name;
        //     console.log(this.files, this.dataForm2.file)
        // },
        // handleFileUploaded(file) {
        //     this.dataListLoading = true
        //     this.files = sessionStorage.getItem('file');
        //     let formData = new FormData();
        //     formData.append("file", file.raw);
        //     api.reportOrderTemplateAPi(formData).then(res => {
        //         this.$message.success('上传成功')
        //         this.getDataList()
        //         // this.dataListLoading = false
        //     })
        // },
        // londing() {
        //     this.dataListLoading= true
        //     setTimeout(() => {
        //         this.dataListLoading= false
        //     }, 2000);
        // },
        //导出
        exportData() {
            this.dataListLoading = true
            this.dataForm2.requestdate = this.dataForm1.requestdate
            this.dataForm2.userid = this.userids
            api.exceloutAPi(this.dataForm2).then(res => {
                api.reporgeturllistAPi().then(res => {
                    console.log(res)
                    const newUrl = res[0].fileaddress
                    window.open(newUrl)
                    this.dataListLoading = false
                })

            })

        },
        getcalculate() {
            this.dataListLoading = true
            this.dataForm1.userid = this.userids
            api.gcomputerAPI(this.dataForm1).then(res => {
                this.dataListLoading = false
                this.getDataList()
                this.$message.success('计算成功')
                console.log(this.dataList)
            })

        },
        getDataList() {
            this.dataListLoading = true
            this.dataForm.userid = this.userids
            api.TemplategetAPI(this.dataForm).then(res => {
                this.dataList = res.content

                this.dataListLoading = false
                console.log(this.dataList)
            })
        },
        //导入
        uploadFile() {
            this.dataListLoading = true
            // if (this.dataForm2.file) {
            //     let formData = new FormData();
            //     console.log(this.files)
            //     formData.append("file", this.files);

            //     api.importcompanydataAPi(formData).then(res => {
            //         this.$message.success('导入成功')
            //         this.dataListLoading = false
            //         this.getDataList()
            //     })
            //         .catch(error => {
            //             this.dataListLoading = false
            //             this.$message.error("导入失败");
            //         });
            // } else {
            //     this.$message.error("请先选择文件");
            // }
        },
    }
};
</script>

<style scoped lang="scss"></style>