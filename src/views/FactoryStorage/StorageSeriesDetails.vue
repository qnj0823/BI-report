<template>
    <div class='StorageDetailss'>
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
                    @click="getUsername">查询</el-button>
            </el-form-item>
            <el-button size="mini" class="filter-item" type="warning" icon="el-icon-download"
                @click="exportData">导出</el-button>
        </el-form>
        <el-table border ref="table" v-loading="dataListLoading" :data="currentData" style="width: 100%;">
            <el-table-column :show-overflow-tooltip="true" align="center" prop="pkAreaclName" label="省份" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="levelName2" label="销售区域" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="levelName3" label="分公司/办事处" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="cust_name" label="客户名称" />
            <el-table-column :show-overflow-tooltip="true" align="center" width="150" prop="username" label="PTS帐号" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="cu_name" label="站点名称" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="po_date" label="日期" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="normal_order_count" label="常温订单数" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="normal_in_count" label="常温入库数" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="normal_unin_count" label="常温未入库数" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="cold_order_count" label="低温订单数" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="cold_in_count" label="低温入库数" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="cold_unin_count" label="低温未入库数" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="total_order_count" label="订单数汇总" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="total_in_count" label="入库数汇总" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="total_unin_count" label="未入库数汇总" />
        </el-table>
        <el-pagination style="width: 80%; margin: 0 auto; " @size-change="sizeChangeHandle" ref="pagination"
            @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[20, 40, 60, 80, 100, 1000]"
            :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="dataList.length">
        </el-pagination>
    </div>
</template>

<script>
import * as api from '@/api/WLOutWarehouseAPI/WLOutWarehouse.js'
import * as api1 from '@/api/factory/PutStorage.js'
import * as oapi from '@/api/frame/customer.js'
import {
    exportExcel
} from './StorageSeriesDetailsExpor.js'
export default {
    name: 'StorageDetails-page',
    data() {
        return {
            msg: 'StorageDetails-page',
            dataForm: {
                p_vouchdatestart: '',
                p_vouchdateend: ''
            },
            dataList: [],
            bullay: '',
            dataListLoading: false,
            currentData: [],
            currentPage: 1,
            pageSize: 20,
            totalItems: 0,
            userList: []
        };
    },
    created() {
        this.calculateDates();
    },
    mounted() {
        console.log(this.$route.query.name)
        this.bullay = this.$route.query.name ? this.$route.query.name : ''
        this.dataForm.p_vouchdatestart = this.$route.query.startDate ? this.$route.query.startDate : this.dataForm.p_vouchdatestart
        this.dataForm.p_vouchdateend = this.$route.query.endDate ? this.$route.query.endDate : this.dataForm.p_vouchdateend

        this.getUsername()
    },
    methods: {
        getUsername() {
            api1.LevelAccountone().then(res => {
                this.userList = res
                this.getsqList()
                console.log(this.userList, 'this.userList')
            })
        },
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
                console.log(this.sqList,'sqList')
                this.getDataList()
            })
        },
        getDataList() {
            this.dataListLoading = true
            api.APIptsinoutdetailstotal(this.dataForm).then(res => {
                this.dataList = res
                
                this.dataList = this.dataList.filter(item => item.cu_name !== "正式测试");
                this.dataList.forEach(item => {
                    const levels = item.level_name.split(' -> ');
                    item.levelName1 = levels[0] || "";
                    // 去掉 levelName2 中的数字  
                    item.levelName2 = levels[1] ? levels[1].replace(/\d+/g, '').trim() : "";
                    item.levelName3 = levels[2] || "";

                });
                console.log(this.dataList,'this.dataList')
                // 过滤数据  
                this.dataList = this.dataList.filter(item =>
                    (item.username && item.username.includes(this.bullay)) ||
                    (item.levelName1 && item.levelName1.includes(this.bullay)) ||
                    (item.levelName2 && item.levelName2.includes(this.bullay)) ||
                    (item.levelName3 && item.levelName3.includes(this.bullay)) ||
                    (item.cust_name && item.cust_name.includes(this.bullay)) ||
                    (item.cu_name && item.cu_name.includes(this.bullay))
                );
                this.dataList = this.groupByCuName(this.dataList);
                this.dataList = this.groupAndSum(this.dataList) //合计
                this.dataList = this.addNotYetField(this.dataList);
                this.dataList = this.dataList.map(obj => ({
                    ...obj,
                    total_count: isNaN(parseFloat(obj.total_count)) ? "0" : parseFloat(obj.total_count).toFixed(0),
                    mqty: isNaN(parseFloat(obj.mqty)) ? "0" : parseFloat(obj.mqty).toFixed(0),
                    not_yet: isNaN(parseFloat(obj.not_yet)) ? "0" : parseFloat(obj.not_yet).toFixed(0)
                }));
                // 1. 先构建 cuName -> username 的 Map
                const userMap = new Map();
                this.userList.forEach(user => {
                    userMap.set(user.cuName, user.username);
                });

                // 2. 遍历 dataList 并直接查 Map，避免重复查找
                this.dataList.forEach(dataItem => {
                    if (userMap.has(dataItem.cu_name)) {
                        dataItem.username = userMap.get(dataItem.cu_name);
                    }
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
                console.log(this.dataList)
                this.currentData = {
                    ...this.dataList
                };
                this.dataListLoading = false
                this.sizeChangeHandle(this.pageSize);
            })
        },


        addNotYetField(data) {
            return data.map(item => ({
                ...item, // 保留原对象的所有字段
                not_yet: (Number(item.mqty) || 0) - (Number(item.total_count) || 0) // 计算 not_yet 
            }));
        },
        groupByCuName(array) {
            return array.sort((a, b) => a.cu_name.localeCompare(b.cu_name));
        },
        
        groupAndSum(data) {
            // 1. 使用 reduce 进行分组
            const grouped = data.reduce((acc, item) => {
                const key = `${item.levelName1}|${item.levelName2}|${item.levelName3}|${item.cu_name}|${item.username}|${item.cust_name}`;

                if (!acc[key]) {
                    acc[key] = {
                        levelName1: item.levelName1,
                        levelName2: item.levelName2,
                        levelName3: item.levelName3,
                        cu_name: item.cu_name,
                        username: item.username,
                        cust_name: item.cust_name,
                        items: [],
                        normal_order_count: 0,
                        normal_in_count: 0,
                        normal_unin_count: 0,
                        cold_order_count: 0,
                        cold_in_count: 0,
                        cold_unin_count: 0,
                        total_order_count: 0,
                        total_in_count: 0,
                        total_unin_count: 0
                    };
                }

                // 累加 total_count 和 mqty（确保 mqty 是数字）
                acc[key].normal_order_count += Number(item.normal_order_count) || 0;
                acc[key].normal_in_count += Number(item.normal_in_count) || 0;
                acc[key].normal_unin_count += Number(item.normal_unin_count) || 0;
                acc[key].cold_order_count += Number(item.cold_order_count) || 0;
                acc[key].cold_in_count += Number(item.cold_in_count) || 0;
                acc[key].cold_unin_count += Number(item.cold_unin_count) || 0;
                acc[key].total_order_count += Number(item.total_order_count) || 0;
                acc[key].total_in_count += Number(item.total_in_count) || 0;
                acc[key].total_unin_count += Number(item.total_unin_count) || 0;
                acc[key].items.push(item);

                return acc;
            }, {});

            // 2. 转换为数组，并在每组后面插入合计行
            const result = Object.values(grouped).flatMap(group => [
                ...group.items, // 原始数据
                { // 合计行
                    levelName1: group.levelName1,
                    levelName2: group.levelName2,
                    levelName3: group.levelName3,
                    cu_name: group.cu_name,
                    username: group.username,
                    cust_name: group.cust_name,
                    normal_order_count: group.normal_order_count.toString(),
                    normal_in_count: group.normal_in_count.toString(),
                    normal_unin_count: group.normal_unin_count.toString(),
                    cold_order_count: group.cold_order_count.toString(),
                    cold_in_count: group.cold_in_count.toString(),
                    cold_unin_count: group.cold_unin_count.toString(),
                    total_order_count: group.total_order_count.toString(),
                    total_in_count: group.total_in_count.toString(),
                    total_unin_count: group.total_unin_count.toString(),
                    po_date: "合计",
                    pname: "合计"
                }
            ]);

            return result;
        },

        exportData() {
            this.$confirm('是否导出表格数据到Excel?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {

                exportExcel(this.dataList, '入库统计表.xlsx')

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