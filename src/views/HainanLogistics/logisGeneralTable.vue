<template>
    <div class='logisGeneralTable'>
        <el-form :inline="true" style="margin-top: 10px;" @submit.native.prevent>
            <el-form-item>
                <el-date-picker v-model="dataForm.startDate" value-format="yyyy-MM-dd" type="date" placeholder="开始日期"
                    clearable style="width: 100%"></el-date-picker>
            </el-form-item>
            <el-form-item>
                <el-date-picker v-model="dataForm.endDate" value-format="yyyy-MM-dd" type="date" placeholder="截止日期"
                    clearable style="width: 100%"></el-date-picker>
            </el-form-item>
            <el-form-item>
                <el-form-item>
                    <el-input v-model="bullay" placeholder="模糊搜索" clearable @keyup.enter.native="searchEnterFun()"
                        ref="searchInput"></el-input>
                </el-form-item>
                <el-button class="filter-item" size="mini" type="success" icon="el-icon-search"
                    @click="getDataList">查询</el-button>
            </el-form-item>
        </el-form>
        <el-table ref="table" v-loading="dataListLoading" :data="dataList" style="width: 100%;">
            <el-table-column  type="index" :show-overflow-tooltip="true" align="center" label="序号" />
            <el-table-column :show-overflow-tooltip="true" prop="orgLevel1" align="center" label="一级组织" />
            <el-table-column :show-overflow-tooltip="true" prop="orgLevel2" align="center" label="二级组织" />
            <el-table-column align="center" label="本月目标">
                <el-table-column prop="weightFromAmbient" align="center" label="吨位目标" />
                <el-table-column prop="weightFromAmbientcar" align="center" label="车数目标">
                </el-table-column>
                <!-- <el-table-column prop="completeQty" align="center" label="车数目标">
                    <template #default="scope">
                        {{ (scope.row.weightFromAmbient || 0) / 32 }}
                    </template>
                </el-table-column> -->
            </el-table-column>
            <el-table-column align="center" label="已发货情况">
                <el-table-column prop="weightFromNcc" align="center" label="已发吨位数" />
                <el-table-column prop="weightFromNcccar" align="center" label="已发车数">
                </el-table-column>
            </el-table-column>
            <el-table-column align="center" label="差异数">
                <el-table-column prop="weightdiff" align="center" label="吨位差异" />
                <el-table-column prop="weightdiffcar" align="center" label="车数差异" />
            </el-table-column>
            <el-table-column align="center" label="完成率">
                <el-table-column prop="weightFromNccRate" align="center" label="吨位完成率" />
                <el-table-column prop="weightFromNcccarRate" align="center" label="车数完成率" />
            </el-table-column>
            <el-table-column :show-overflow-tooltip="true" prop="vouchdate" align="center" label="备注" />
        </el-table>
        <!-- <el-pagination style="width: 90%; margin: 0 auto; " @size-change="sizeChangeHandle" ref="pagination"
            @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[20, 40, 60, 80, 100, 1000]"
            :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="dataList.length">
        </el-pagination> -->
    </div>
</template>

<script>
import * as api from '@/api/WLOutWarehouseAPI/WLOutWarehouse.js'
export default {
    name: 'logisGeneralTable-page',
    data() {
        return {
            msg: 'logisGeneralTable-page',
            dataForm: {
                startDate: '',
                endDate: ''
            },
            dataList: [],
            bullay: '',
            currentData: [],
            currentPage: 1,
            pageSize: 20,
            totalItems: 0,
            dataListLoading: false,
        };
    },
    created() {
        this.calculateDates();
    },
    mounted() {
        this.getDataList()
    },
    methods: {
        getDataList() {
            this.dataListLoading = true
            api.APIptsNccOrderCarsummar(this.dataForm).then(res => {
                this.dataList = res
                // 处理数组生成新字段
                const newDataList = this.dataList.map(item => {
                    // 兜底防止空值NaN
                    const ambient = item.weightFromAmbient || 0
                    const ncc = item.weightFromNcc || 0

                    const weightFromAmbientcar = Number((ambient / 32).toFixed(2))
                    const weightFromNcccar = Number((ncc / 32).toFixed(2))
                    const weightdiff = Number((ambient - ncc).toFixed(2))
                    const weightdiffcar = Number((weightFromAmbientcar - weightFromNcccar).toFixed(2))

                    // 原百分比
                    let weightFromNccRate = 0
                    if (ambient !== 0) {
                        weightFromNccRate = Number(((ncc / ambient) * 100).toFixed(2))
                    }

                    // 车数百分比：weightFromNcccar / weightFromAmbientcar * 100，防止分母为0
                    let weightFromNcccarRate = 0
                    if (weightFromAmbientcar !== 0) {
                        weightFromNcccarRate = Number(((weightFromNcccar / weightFromAmbientcar) * 100).toFixed(2))
                    }

                    return {
                        ...item, // 保留原有所有字段
                        weightFromAmbientcar,
                        weightFromNcccar,
                        weightdiff,
                        weightdiffcar,
                        weightFromNccRate,
                        weightFromNcccarRate
                    }
                })

                // 赋值回列表
                this.dataList = newDataList
                this.dataList = this.dataList.filter(item =>
                    (item.orgLevel1 && item.orgLevel1.includes(this.bullay)) ||
                    (item.orgLevel2 && item.orgLevel2.includes(this.bullay))

                );
                console.log(this.dataList, 'this.dataList')
                this.dataListLoading = false
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

            // 当月最后一天
            const lastDayOfMonthDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);
            this.endOfMonth = this.formatDate(lastDayOfMonthDate);

            this.dataForm.startDate = this.startOfMonth;
            this.dataForm.endDate = this.endOfMonth;
        },
        // 格式化日期
        formatDate(date) {
            this.year = date.getFullYear();
            this.month = String(date.getMonth() + 1).padStart(2, '0'); // 月份从0开始，所以加1 
            this.day = String(date.getDate()).padStart(2, '0');
            return `${this.year}-${this.month}-${this.day}`;
        },
    }
};
</script>

<style scoped lang="scss"></style>