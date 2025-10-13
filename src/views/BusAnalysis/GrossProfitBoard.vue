<template>
    <div class='GrossProfitBoard'>
        <el-form :inline="true" style="width: 95%; margin: 0 auto;">
            <el-form-item>
                <el-date-picker v-model="dataForm.queryDate" value-format="yyyy-MM-dd" type="date" placeholder="结束日期"
                    clearable style="width: 100%"></el-date-picker>
            </el-form-item>
            <el-form-item>
                <el-input v-model="bullay" placeholder="模糊搜索" clearable @keyup.enter.native="searchEnterFun()"
                    ref="searchInput"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button class="filter-item" size="mini" type="success" icon="el-icon-search"
                    @click="getDateList">查询</el-button>
            </el-form-item>
            <el-button size="mini" class="filter-item" type="warning" icon="el-icon-download"
                @click="exportData">导出</el-button>
        </el-form>
        <el-table ref="table" v-loading="dataListLoading" :data="dataList" style="width: 100%;">
            <el-table-column :show-overflow-tooltip="true" width="180" align="center" prop="custclass_name" label="单位体" />
            <el-table-column :show-overflow-tooltip="true" width="180" align="center" prop="customer_name"
                label="客户名称" />
            <el-table-column :show-overflow-tooltip="true" width="100" align="center" prop="result" label="毛利额" />
            <el-table-column :show-overflow-tooltip="true" width="100" align="center" prop="grossProfitMargin"
                label="毛利率" />
        </el-table>
    </div>
</template>

<script>
import axios from 'axios';
import {
    exportExcel
} from './GrossProfitBoardExpro.js'
export default {
    name: 'GrossProfitBoard-page',
    data() {
        return {
            msg: 'GrossProfitBoard-page',
            dataForm: {
                queryDate: ''
            },
            dataListLoading: false,
            dataList: [],
            currentData: [],
            bullay: '',
        };
    },
    mounted() {
        this.getDateList()
    },
    created() {
        this.calculateDates();
    },
    methods: {


        async getDateList() {
            const isDev = process.env.NODE_ENV === 'development';
            const baseURL = isDev ? 'http://153.0.158.115:8180' : '';
            const response = await axios.get(
                `${baseURL}/uapws/rest/wms/getGrossProfitMargin?queryDate=${this.dataForm.queryDate}`,

            );
            if (response.data.restCode == 200) {
                this.dataList = response.data.data[0].currDetailList
                this.dataList = this.dataList.map(item => {
                    return {
                        ...item,
                        grossProfitMargin: item.grossProfitMargin + '%'
                    };
                });
                this.dataList = this.dataList.filter(item =>
                    (item.custclass_name && item.custclass_name.includes(this.bullay)) ||
                    (item.customer_name && item.customer_name.includes(this.bullay))  
                );
                console.log(this.dataList)

            } else {
                // alert(response.data.msg)
                this.$message.warning(response.data.msg)
            }
            console.log(response)
        },
        exportData() {
            this.$confirm('是否导出表格数据到Excel?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                exportExcel(this.dataList, '毛利率总表.xlsx')

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
            this.dataForm.queryDate = this.endOfToday
            // this.dataForm.queryDate = this.startOfMonth
            console.log(this.dataForm.queryDate, 'this.dataForm.queryDate')

        },
        formatDate(date) {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0'); // 月份从0开始，所以加1 
            const day = String(date.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
        },
    }
};
</script>

<style scoped lang="scss"></style>