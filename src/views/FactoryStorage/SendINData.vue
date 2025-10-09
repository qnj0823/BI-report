<template>
    <div class='sendINdata'>
        <el-form :inline="true">
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
                    @click="getsqList">查询</el-button>
            </el-form-item>
            <el-button size="mini" class="filter-item" type="warning" icon="el-icon-download"
                @click="exportData">导出</el-button>
        </el-form>
        <el-table class="table" ref="table" :data="currentData" border v-loading="dataListLoading"
            style="width: 95%; margin: 0 auto; margin-bottom: 50px;">
            <el-table-column :show-overflow-tooltip="true" align="center" prop="pkAreaclName" label="省份" />
            <el-table-column :show-overflow-tooltip="true" align="center"  prop="cu_name" label="站点名称" />
            <el-table-column :show-overflow-tooltip="true" align="center" width="300" prop="pname" label="产品名称" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="total_count" label="订单数" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="mqty" label="入库数" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="rate" label="入库百分比" />
        </el-table>
        <el-pagination style="width: 80%; margin: 0 auto; " @size-change="sizeChangeHandle" ref="pagination"
            @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[20, 40, 60, 80, 100, 1000]"
            :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="dataList.length">
        </el-pagination>
    </div>
</template>

<script>
import * as oapi from '@/api/frame/customer.js'
import * as api from '@/api/WLOutWarehouseAPI/WLOutWarehouse.js'
import {
    exportExcel
} from './SendINDataExpor.js'
export default {
    name: 'sendINdata-page',
    data() {
        return {
            msg: 'sendINdata-page',
            dataForm: {
                p_vouchdatestart: '',
                p_vouchdateend: ''
            },
            bullay: '',
            dataListLoading: false,
            dataList: [],
            sqList: [],
            currentData: [],
            currentPage: 1,
            pageSize: 20,
            totalItems: 0,
        };
    },
    created() {
        this.calculateDates();
    },
    mounted() {
        this.getsqList()
    },
    methods: {
        getsqList() {
            this.dataListLoading = true
            oapi.SiteallCustomer(this.dataForm1).then(res => {
                this.sqList = res
                this.sqList.forEach(item => {
                    const levels = item.levelName.split(' -> ');
                    item.levelName1 = levels[0] || "";
                    // 去掉 levelName2 中的数字  
                    item.levelName2 = levels[1] ? levels[1].replace(/\d+/g, '').trim() : "";
                    item.levelName3 = levels[2] || "";
                });
                this.sqList = this.sqList.map(item => {
                    // 匹配省、区或市，并包含在结果中  
                    const match = item.pkAreaclName.match(/(.*?)(省|市|区)/);
                    return {
                        ...item,
                        pkAreaclName: match ? `${match[1]}${match[2]}` : item.pkAreaclName // 提取匹配的省、市或区，包含省、市或区字  
                    };
                });
                console.log(this.sqList, 'sqList')
                this.getDataList()
            })
        },
        getDataList() {
            api.APIptsinoutdetails(this.dataForm).then(res => {
                this.dataList = res
                this.dataList = this.dataList.filter(item => item.cu_name !== "正式测试");
                this.dataList.forEach(item => {
                    const levels = item.level_name.split(' -> ');
                    item.levelName1 = levels[0] || "";
                    // 去掉 levelName2 中的数字  
                    item.levelName2 = levels[1] ? levels[1].replace(/\d+/g, '').trim() : "";
                    item.levelName3 = levels[2] || "";

                });
                //省份匹配添加
                this.dataList.forEach(dataItem => {
                    const matchingSqItem = this.sqList.find(sqItem => sqItem.levelName2 == dataItem.levelName2);
                    if (matchingSqItem) {
                        // 如果找到匹配项，将 pkAreaclName 添加到 dataList 的对应对象中
                        // 你可以选择直接赋值或创建一个新字段，这里假设添加到新字段 sqPkAreaclName
                        dataItem.pkAreaclName = matchingSqItem.pkAreaclName;

                        // 或者如果你想直接修改原有字段（如果存在）
                        // dataItem.pkAreaclName = matchingSqItem.pkAreaclName;
                    }
                });
                this.dataList = this.mergeObjects(this.dataList);
                this.dataList.sort((a, b) => a.pkAreaclName.localeCompare(b.pkAreaclName));
                this.dataList = this.processArray(this.dataList)
                // 计算 rate 字段并添加到每个对象中  
                this.dataList.forEach(item => {
                    item.mqty = parseFloat(item.mqty).toFixed(0);
                    item.total_count = parseFloat(item.total_count).toFixed(0);
                    // 检查 total_count 是否为零，以避免除以零的错误  
                    item.rate = item.total_count > 0
                        ? ((item.mqty / item.total_count) * 100).toFixed(2) + '%' // 保留两位小数后加百分号  
                        : '0.00%'; // 如果 total_count 为 0， rate 为 0%  
                });
                this.currentData = {
                    ...this.dataList
                };
                this.dataListLoading = false
                this.sizeChangeHandle(this.pageSize);
            })
        },
        processArray(array) {
            // 1. 创建一个对象来存储每个pkAreaclName的合计值和原始项目
            const grouped = {};

            // 2. 遍历原始数组，计算合计值并分组
            array.forEach(item => {
                const key = item.pkAreaclName;

                if (!grouped[key]) {
                    grouped[key] = {
                        items: [],
                        sum: { mqty: 0, total_count: 0 }
                    };
                }

                // 将当前项目添加到分组中
                grouped[key].items.push(item);

                // 累加mqty和total_count
                grouped[key].sum.mqty += Number(item.mqty) || 0;
                grouped[key].sum.total_count += Number(item.total_count) || 0;
            });

            // 3. 构建结果数组，在每个分组后添加合计项
            const result = [];

            Object.keys(grouped).forEach(key => {
                // 添加原始项目
                result.push(...grouped[key].items);

                // 添加合计项
                result.push({
                    pkAreaclName: `${key}合计`,
                    mqty: grouped[key].sum.mqty,
                    total_count: grouped[key].sum.total_count,
                    isTotal: true // 可选标记，标识这是合计项
                });
            });

            return result;
        },
        exportData() {
            this.$confirm('是否导出表格数据到Excel?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {

                exportExcel(this.dataList, '入库数据发送表.xlsx')

            })
        },
        mergeObjects(array) {
            const result = [];
            const map = new Map();

            array.forEach(obj => {
                const key = `${obj.pkAreaclName}_${obj.p_no}_${obj.cu_name}`;
                if (map.has(key)) {
                    // 如果已存在，则合并total_count和mqty
                    const existingObj = map.get(key);
                    existingObj.total_count = (parseFloat(existingObj.total_count) || 0) + (parseFloat(obj.total_count) || 0);
                    existingObj.mqty = (parseFloat(existingObj.mqty) || 0) + (parseFloat(obj.mqty) || 0);
                } else {
                    // 如果不存在，则创建新对象并添加到Map中
                    const newObj = {
                        ...obj,
                        total_count: parseFloat(obj.total_count) || 0,
                        mqty: parseFloat(obj.mqty) || 0
                    };
                    map.set(key, newObj);
                }
            });

            // 将Map中的值转为数组
            return Array.from(map.values());
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
    }
};
</script>

<style scoped lang="scss"></style>