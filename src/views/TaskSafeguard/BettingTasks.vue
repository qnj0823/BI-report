<template>
    <div class='task'>
        <el-form :inline="true" style="margin-top: 10px;" :model="dataForm" @submit.native.prevent>
            <el-form-item>
                <el-input v-model="dataForm2.file" placeholder="选择文件" readonly></el-input>
                <input type="file" ref="fileInput" style="display: none" @change="handleFileUpload">
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="openFileInput">选择文件</el-button>
                <el-button type="success" @click="uploadFile">导入</el-button>
            </el-form-item>

            <el-form-item>
                <!-- <el-button class="filter-item" size="mini" type="success" icon="el-icon-plus"
          @click="addOrUpdateHandle()">新增</el-button> -->
                <el-button size="mini" class="filter-item" type="warning" icon="el-icon-download"
                    @click="exportData">下载模板</el-button>
            </el-form-item>
        </el-form>
        <el-table ref="table" v-loading="dataListLoading" :data="currentData" style="width: 100%;">
            <el-table-column :show-overflow-tooltip="true" align="center" prop="orgdqname" label="战区" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="orgsqname" label="销售区域" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="orgname" label="单位体" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="fzr" label="总经理" />
            <el-table-column :show-overflow-tooltip="true" align="center" label="对赌任务(%)">
                <el-table-column :show-overflow-tooltip="true" align="center" prop="oldproductvalue" label="老品" width="50" />
                <el-table-column :show-overflow-tooltip="true" align="center" prop="yezizhiproductvalue" label="椰子汁" width="50" />
                <el-table-column :show-overflow-tooltip="true" align="center" prop="allproductvalue" label="全品" width="50" />
            </el-table-column>
            <el-table-column :show-overflow-tooltip="true" align="center" label="预算目标(合计)">
                <el-table-column :show-overflow-tooltip="true" align="center" prop="oldgoalvalue" label="老品" width="50" />
                <el-table-column :show-overflow-tooltip="true" align="center" prop="newgoalvalue" label="新品" width="50" />
            </el-table-column>
            <el-table-column :show-overflow-tooltip="true" align="center" label="一月">
                <el-table-column :show-overflow-tooltip="true" align="center" prop="yearmonth1Old" label="老品" width="50" />
                <el-table-column :show-overflow-tooltip="true" align="center" prop="yearmonth1New" label="新品" width="50" />
            </el-table-column>
            <el-table-column :show-overflow-tooltip="true" align="center" label="二月">
                <el-table-column :show-overflow-tooltip="true" align="center" prop="yearmonth2Old" label="老品" width="50" />
                <el-table-column :show-overflow-tooltip="true" align="center" prop="yearmonth2New" label="新品" width="50" />
            </el-table-column>
            <el-table-column :show-overflow-tooltip="true" align="center" label="三月">
                <el-table-column :show-overflow-tooltip="true" align="center" prop="yearmonth3Old" label="老品" width="50" />
                <el-table-column :show-overflow-tooltip="true" align="center" prop="yearmonth3New" label="新品" width="50" />
            </el-table-column>
            <el-table-column :show-overflow-tooltip="true" align="center" label="四月">
                <el-table-column :show-overflow-tooltip="true" align="center" prop="yearmonth4Old" label="老品" width="50" />
                <el-table-column :show-overflow-tooltip="true" align="center" prop="yearmonth4New" label="新品" width="50" />
            </el-table-column>
            <el-table-column :show-overflow-tooltip="true" align="center" label="五月">
                <el-table-column :show-overflow-tooltip="true" align="center" prop="yearmonth5New" label="老品" width="50" />
                <el-table-column :show-overflow-tooltip="true" align="center" prop="yearmonth5Old" label="新品" width="50" />
            </el-table-column>
            <el-table-column :show-overflow-tooltip="true" align="center" label="六月">
                <el-table-column :show-overflow-tooltip="true" align="center" prop="yearmonth6Old" label="老品" width="50" />
                <el-table-column :show-overflow-tooltip="true" align="center" prop="yearmonth6New" label="新品" width="50" />
            </el-table-column>
            <el-table-column :show-overflow-tooltip="true" align="center" label="七月">
                <el-table-column :show-overflow-tooltip="true" align="center" prop="yearmonth7Old" label="老品" width="50" />
                <el-table-column :show-overflow-tooltip="true" align="center" prop="yearmonth7New" label="新品" width="50" />
            </el-table-column>
            <el-table-column :show-overflow-tooltip="true" align="center" label="八月">
                <el-table-column :show-overflow-tooltip="true" align="center" prop="yearmonth8Old" label="老品" width="50" />
                <el-table-column :show-overflow-tooltip="true" align="center" prop="yearmonth8New" label="新品" width="50" />
            </el-table-column>
            <el-table-column :show-overflow-tooltip="true" align="center" label="九月">
                <el-table-column :show-overflow-tooltip="true" align="center" prop="yearmonth9Old" label="老品" width="50" />
                <el-table-column :show-overflow-tooltip="true" align="center" prop="yearmonth9New" label="新品" width="50" />
            </el-table-column>
            <el-table-column :show-overflow-tooltip="true" align="center" label="十月">
                <el-table-column :show-overflow-tooltip="true" align="center" prop="yearmonth10Old" label="老品" width="50" />
                <el-table-column :show-overflow-tooltip="true" align="center" prop="yearmonth10New" label="新品" width="50" />
            </el-table-column>
            <el-table-column :show-overflow-tooltip="true" align="center" label="十一月">
                <el-table-column :show-overflow-tooltip="true" align="center" prop="yearmonth11Old" label="老品" width="50" />
                <el-table-column :show-overflow-tooltip="true" align="center" prop="yearmonth11New" label="新品" width="50" />
            </el-table-column>
            <el-table-column :show-overflow-tooltip="true" align="center" label="十二月">
                <el-table-column :show-overflow-tooltip="true" align="center" prop="yearmonth12Old" label="老品" width="50" />
                <el-table-column :show-overflow-tooltip="true" align="center" prop="yearmonth12New" label="新品" width="50" />
            </el-table-column>
            <!-- <el-table-column header-align="center" align="center" width="220" label="操作">
        <template slot-scope="scope">
            <el-button class="filter-item" size="mini" type="success" icon="el-icon-search"
            @click="getDataList">修改</el-button>
          <el-button size="mini" class="filter-item" type="warning" icon="el-icon-download"
            @click="exportData">删除</el-button>
        </template>
</el-table-column> -->
        </el-table>
        <el-pagination style="width: 90%; margin: 0 auto; " @size-change="sizeChangeHandle" ref="pagination"
            @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[20, 40, 60, 80, 100, 1000]"
            :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="dataList.length">
        </el-pagination>
    </div>
</template>

<script>
import * as api from '@/api/frame/customer.js'
import {
    exportExcel
} from './BettingTasksExpro.js'
export default {
    name: 'task-page',
    data() {
        return {
            msg: 'task-page',
            dataForm: {
                page: 0,
                size: 800,
                sort: '',
            },
            dataForm1: {
                blurry: '',
            },
            dataForm2: {
                file: '',
            },
            dataList: [],
            exportList: [],
            dataListLoading: false,
            currentData: [],
            currentPage: 1,
            pageSize: 20,
            totalItems: 0,
        };
    },
    mounted() {
        this.getDataList()
    },
    methods: {
        //下载模板
        exportData() {
            this.$confirm('是否下载模板？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.dataListLoading = true
                api.BdallCustomer(this.dataForm1).then(res => {
                    this.exportList = res
                    this.exportList.forEach(item => {
                        const levels = item.levelName.split(' -> ');
                        item.levelName1 = levels[0] || "";
                        // 去掉 levelName2 中的数字  
                        item.levelName2 = levels[1] ? levels[1].replace(/\d+/g, '').trim() : "";
                        item.levelName3 = levels[2] || "";
                        this.dataListLoading = false
                    });
                    this.exportList = Array.from(
                        new Map(this.exportList.map(item => [item.levelName3, item])).values()
                    );
                    console.log(this.exportList)
                    exportExcel(this.exportList, '任务导入模板.xlsx')
                })
            })
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

                api.importMonthGoalAPi(formData).then(res => {
                    this.$message.success('导入成功')
                    this.getDataList()
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
        getDataList() {
            api.CompanyTrackcheckApi(this.dataForm).then(res => {
                this.dataList = res.content
                this.currentData = {
                    ...this.dataList
                };
                this.sizeChangeHandle(this.pageSize);
                console.log(this.dataList, 666)
            })
        },
        // 每页数
        sizeChangeHandle(val) {
            this.pageSize = val;
            this.currentPage = 1;
            this.currentData = this.dataList.slice((this.currentPage - 1) * this.pageSize, this.currentPage * this
                .pageSize);
        },
        // 当前页
        handleCurrentChange(val) {
            console.log(val)
            this.currentPage = val;
            this.currentData = this.dataList.slice((val - 1) * this.pageSize, val * this.pageSize);
        },
    }
};
</script>


<style scoped lang="scss">
::v-deep .table .el-table__cell {
    padding: 0px !important;

}

;

::v-deep th.el-table__cell>.cell {
    padding: 0px !important;
}

;

::v-deep .el-table th {
    background: #f5f7fa;
}
</style>