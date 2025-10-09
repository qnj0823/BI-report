<template>
    <div class='exDetils'>
        <el-form :inline="true" style="width: 95%; margin: 0 auto;">
            <el-form-item>
                <el-date-picker v-model="dataForm.p_vouchdatestart" value-format="yyyy-MM-dd" type="date"
                    placeholder="开始日期" clearable style="width: 100%"></el-date-picker>
            </el-form-item>
            <el-form-item>
                <el-date-picker v-model="dataForm.p_vouchdateend" value-format="yyyy-MM-dd" type="date"
                    placeholder="结束日期" clearable style="width: 100%"></el-date-picker>
            </el-form-item>
            <el-form-item>
                <el-input v-model="bullay" placeholder="模糊搜索" clearable @keyup.enter.native="searchEnterFun()"
                    ref="searchInput"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button class="filter-item" size="mini" type="success" icon="el-icon-search"
                    @click="handleClick">查询</el-button>
            </el-form-item>
            <el-button size="mini" class="filter-item" type="warning" icon="el-icon-download"
                @click="exportData">导出</el-button>
        </el-form>
        <div style="width: 95%; margin: 0 auto;">
            <el-button class="filter-item" size="mini" :type="activeButton === 'header' ? 'primary' : 'success'"
                @click="handleButtonClick('header')">表头</el-button>
            <el-button class="filter-item" size="mini" :type="activeButton === 'headerDetail' ? 'primary' : 'success'"
                @click="handleButtonClick('headerDetail')">表头+明细</el-button>
        </div>
        <div v-if="tableshow">
            <el-table ref="table" v-loading="dataListLoading" :data="currentData" style="width: 100%;">
                <el-table-column :show-overflow-tooltip="true" align="center" prop="levelName1" label="战区" />
                <el-table-column :show-overflow-tooltip="true" align="center" prop="levelName2" label="销售区域/省区" />
                <el-table-column :show-overflow-tooltip="true" align="center" prop="levelName3" label="分公司/办事处" />
                <el-table-column :show-overflow-tooltip="true" align="center" prop="cName" label="客户名称 " />
                <el-table-column :show-overflow-tooltip="true" align="center" prop="boxs" label="数量" />
            </el-table>
            <el-pagination style="width: 90%; margin: 0 auto; " @size-change="sizeChangeHandle" ref="pagination"
                @current-change="handleCurrentChange" :current-page="currentPage"
                :page-sizes="[20, 40, 60, 80, 100, 1000]" :page-size="pageSize"
                layout="total, sizes, prev, pager, next, jumper" :total="dataList.length">
            </el-pagination>
        </div>
        <div v-else>
            <el-table ref="table" v-loading="dataListLoading" :data="currentData1" style="width: 100%;">
                <el-table-column :show-overflow-tooltip="true" align="center" prop="levelName1" label="战区" />
                <el-table-column :show-overflow-tooltip="true" align="center" prop="levelName2" label="销售区域/省区" />
                <el-table-column :show-overflow-tooltip="true" align="center" prop="levelName3" label="分公司/办事处" />
                <el-table-column :show-overflow-tooltip="true" align="center" prop="cName" label="客户名称 " />
                <el-table-column :show-overflow-tooltip="true" align="center" prop="cProductName" label="产品名称" />
                <el-table-column :show-overflow-tooltip="true" align="center" prop="box" label="数量" />
            </el-table>
            <el-pagination style="width: 90%; margin: 0 auto; " @size-change="sizeChangeHandle1" ref="pagination"
                @current-change="handleCurrentChange1" :current-page="currentPage1"
                :page-sizes="[20, 40, 60, 80, 100, 1000]" :page-size="pageSize1"
                layout="total, sizes, prev, pager, next, jumper" :total="dataListdet.length">
            </el-pagination>
        </div>
    </div>
</template>

<script>
import {
    exportExcel
} from './GiftFeeExpro.js'
import * as api from '@/api/Business/analysis.js'
export default {
    name: 'exDetils-page',
    data() {
        return {
            msg: 'exDetils-page',
            dataForm: {
                p_vouchdateend: '',
                p_vouchdatestart: '',
                p_orgname: ''
            },
            check: '1',
            tableshow: true,
            dataListLoading: false,
            bullay: '',
            dataList: [],
            dataListdet: [],
            currentData: [],
            currentPage: 1,
            pageSize: 20,
            totalItems: 0,
            currentData1: [],
            currentPage1: 1,
            pageSize1: 20,
            totalItems1: 0,
            activeButton: 'header'

        };
    },
    created() {
        this.calculateDates();
    },
    mounted() {
        this.getdataListmain()
        this.getdataList1()
    },
    methods: {
        handleButtonClick(buttonType) {
            if (buttonType === 'header') {
                this.activeButton = 'header'; // 如果点击表头按钮，设置activeButton 为 'header'  
                this.getdataListmain(); // 可以调用相应的方法  
            } else if (buttonType === 'headerDetail') {
                this.activeButton = 'headerDetail'; // 点击表头+明细按钮  
                this.getdataListdet(); // 处理表头+明细的逻辑  
            }
        },
        handleClick() {
            this.getdataList();
            this.getdataList1();

        },
        exportData() {
            this.$confirm('是否导出表格数据到Excel?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                exportExcel(this.dataList, this.dataListdet, '赠品数量汇总表.xlsx')
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
            this.dataForm.p_vouchdatestart = this.startOfMonth
            this.dataForm.p_vouchdateend = this.endOfToday
        },
        formatDate(date) {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0'); // 月份从0开始，所以加1 
            const day = String(date.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
        },
        getdataListmain() {
            this.check = 1
            this.tableshow = true
            this.getdataList()
        },
        getdataList() {
            this.dataListLoading = true
            api.ordergiftAPI(this.dataForm).then(res => {
                this.dataList = res
                this.dataList.forEach(item => {
                    const levels = item.level_name.split(' -> ');
                    item.levelName1 = levels[0] || "";
                    // 去掉 levelName2 中的数字  
                    item.levelName2 = levels[1] ? levels[1].replace(/\d+/g, '').trim() : "";
                    item.levelName3 = levels[2] || "";
                });
                this.dataList = Object.values(this.dataList.reduce((acc, { iAgentId, box, ...rest }) => {
                    const boxValue = Number(box); // 将box值转换为数字  
                    if (!acc[iAgentId]) {
                        acc[iAgentId] = { iAgentId, boxs: 0, ...rest }; // 保留其他字段  
                    }
                    acc[iAgentId].boxs += boxValue; // 累加boxs  
                    return acc;
                }, {}));

                // 过滤数据  
                this.dataList = this.dataList.filter(item =>
                    (item.levelName1 && item.levelName1.toLowerCase().includes(this.bullay)) ||
                    (item.levelName2 && item.levelName2.toLowerCase().includes(this.bullay)) ||
                    (item.levelName3 && item.levelName3.toLowerCase().includes(this.bullay)) ||
                    (item.cName && item.cName.toLowerCase().includes(this.bullay))
                );

                console.log(this.dataList);

                this.currentData = {
                    ...this.dataList
                };
                this.sizeChangeHandle(this.pageSize);
                this.dataListLoading = false

            })
        },
        getdataListdet() {
            this.check = 2
            this.tableshow = false
            this.getdataList1()
        },
        getdataList1() {
            this.dataListLoading = true
            api.ordergiftAPI(this.dataForm).then(res => {
                this.dataListdet = res
                this.dataListdet.forEach(item => {
                    const levels = item.level_name.split(' -> ');
                    item.levelName1 = levels[0] || "";
                    // 去掉 levelName2 中的数字  
                    item.levelName2 = levels[1] ? levels[1].replace(/\d+/g, '').trim() : "";
                    item.levelName3 = levels[2] || "";
                });
                // 定义 levelName1 的排序优先级  排序
                const priority = {
                    "营销一部": 1,
                    "营销二部": 2,
                    "营销三部": 3,
                    "营销四部": 4,
                    "营销五部": 5,
                    "营销六部": 6,
                    "营销七部": 7,
                    "营销八部": 8,
                    "大客户部": 9,
                    "营销中心": 10,
                };
                // 在排序之前，确保 box 字段保留两位小数  
                this.dataListdet.forEach(item => {
                    item.box = Number(item.box).toFixed(0); // 保留两位小数  

                });

                // 排序函数  
                this.dataListdet.sort((a, b) => {
                    // 先根据 levelName1 的优先级排序  
                    const level1Comparison = (priority[a.levelName1] || 99) - (priority[b.levelName1] || 99);

                    // 如果 levelName1 的优先级相同，则根据 levelName2 进行排序  
                    if (level1Comparison === 0) {
                        const level2Comparison = a.levelName2.localeCompare(b.levelName2);

                        // 如果 levelName2 也相同，则根据 levelName3 进行排序  
                        if (level2Comparison === 0) {
                            return a.levelName3.localeCompare(b.levelName3);
                        }

                        // 返回 levelName2 的比较结果  
                        return level2Comparison;
                    }

                    // 返回 levelName1 的比较结果  
                    return level1Comparison;
                });

                console.log(this.dataListdet);
                // 过滤数据  
                this.dataListdet = this.dataListdet.filter(item =>
                    (item.levelName1 && item.levelName1.toLowerCase().includes(this.bullay)) ||
                    (item.levelName2 && item.levelName2.toLowerCase().includes(this.bullay)) ||
                    (item.levelName3 && item.levelName3.toLowerCase().includes(this.bullay)) ||
                    (item.cName && item.cName.toLowerCase().includes(this.bullay))
                );
                this.currentData1 = {
                    ...this.dataListdet
                };
                this.sizeChangeHandle1(this.pageSize1);
                this.dataListLoading = false

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
        // 每页数
        sizeChangeHandle1(val) {
            this.pageSize1 = val;
            this.currentPage1 = 1;
            this.currentData1 = this.dataListdet.slice((this.currentPage1 - 1) * this.pageSize1, this.currentPage1 * this
                .pageSize);
        },
        // 当前页
        handleCurrentChange1(val) {
            console.log(val)
            this.currentPage1 = val;
            this.currentData1 = this.dataListdet.slice((val - 1) * this.pageSize1, val * this.pageSize1);
        },
    }
};
</script>

<style scoped lang="scss"></style>