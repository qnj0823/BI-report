<template>
    <div class='plan'>
        <el-form :inline="true" style="width:75%; margin: 0 auto;">
            <el-form-item>
                <el-date-picker v-model="dataForm.p_vouchdatestart" value-format="yyyy-MM-dd" type="date"
                    placeholder="开始日期" clearable style="width: 100%"></el-date-picker>
            </el-form-item>
            <el-form-item>
                <el-date-picker v-model="dataForm.p_vouchdateend" value-format="yyyy-MM-dd" type="date"
                    placeholder="结束日期" clearable style="width: 100%"></el-date-picker>
            </el-form-item>
            <el-form-item>
                <el-button class="filter-item" size="mini" type="success" icon="el-icon-search"
                    @click="getDataList">查询</el-button>
            </el-form-item>
            <!-- <el-form-item>
               <el-input v-model="bullay" placeholder="模糊搜索" clearable @keyup.enter.native="searchEnterFun()"
                   ref="searchInput"></el-input>
           </el-form-item> -->
            <el-form-item>
                <el-button class="filter-item" size="mini" type="success" icon="el-icon-plus"
                    @click="addOrUpdateHandle()">新增</el-button>
            </el-form-item>
            <el-form-item>
                <el-button size="mini" class="filter-item" type="warning" icon="el-icon-download"
                    @click="exportData">导出</el-button>
            </el-form-item>
        </el-form>
        <el-table class="table" ref="table" :data="dataList" v-loading="dataListLoading"
            style="width: 75%; margin: 0 auto; margin-bottom: 50px;">
            <el-table-column :show-overflow-tooltip="true" align="center" prop="sname" label="销售区域" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="iParentName" label="销售区域" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="box" label="实际订单/件" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="piece" label="实际订单/盒 " />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="salesorgname" label="光明销售公司" />
            <el-table-column :show-overflow-tooltip="true" prop="factoryname" align="center" label="工厂供应链" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="isfull" label="是否满产" />
            <el-table-column header-align="center" align="center" width="150" label="操作">
                <template slot-scope="scope">
                    <el-button type="text" size="small" @click="addOrUpdateHandle(scope.row.id,scope.row)">修改</el-button>
                </template>
            </el-table-column>
        </el-table>
        <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @close="addOrUpdateVisible = false"
            @refreshDataList="getDataList"></add-or-update>
    </div>
</template>

<script>
import AddOrUpdate from './NationalPlanTable-add-updata'
import * as api from '@/api/Business/analysis.js'
import {
    exportExcel
} from './NationalPlanTableExpro.js'
export default {
    components: {
        AddOrUpdate
    },
    name: 'plan-page',
    data() {
        return {
            msg: 'plan-page',
            dataListLoading: false,
            addOrUpdateVisible: false,
            dataList: [],
            editList: [],
            dataForm: {
                p_vouchdatestart: '',
                p_vouchdateend: ''
            },
            editForm: {
                page: 0,
                size: 500,
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
        exportData() {
            this.$confirm('是否导出表格数据到Excel?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {

                exportExcel(this.dataList, 'LOOK每日计划数据表.xlsx')

            })
        },
        //获取时间
        calculateDates() {
            const today = new Date();

            // 获取当前月份的月初时间 
            const startOfMonthDate = new Date(today.getFullYear(), today.getMonth(), 1);
            this.startOfMonth = this.formatDate(startOfMonthDate);

            // 获取截至今天的时间 
            this.endOfToday = this.formatDate(today);
            this.dataForm.p_vouchdatestart = this.endOfToday
            this.dataForm.p_vouchdateend = this.endOfToday
        },
        formatDate(date) {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0'); // 月份从0开始，所以加1 
            const day = String(date.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
        },
        // 新增 / 修改
        addOrUpdateHandle(id,data) {
            this.addOrUpdateVisible = true
            this.$nextTick(() => {
                this.$refs.addOrUpdate.init(id,data)
            })
        },
        getDataList() {
            this.dataListLoading = true
            api.lookdailyplanAPI(this.dataForm).then(res => {
                this.dataList = res
                this.dataList = this.dataList.map(item => {
                    // 使用正则表达式去除数字，并保留字符  
                    return {
                        ...item,
                        iParentName: item.iParentName.replace(/\d+/g, '') // 替换掉所有数字  
                    };
                });
                this.dataListLoading = false
                console.log(this.dataList)
            })
        }
    }
};
</script>

<style scoped lang="scss"></style>