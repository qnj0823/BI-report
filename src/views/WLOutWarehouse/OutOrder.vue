<template>
    <div class='outorder'>
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
                    @click="proDataList">查询</el-button>
            </el-form-item>
            <!-- <el-button size="mini" class="filter-item" type="warning" icon="el-icon-download"
                @click="exportData">导出</el-button> -->
            <el-button size="mini" class="filter-item" type="primary" @click="allSubmit">选中提交</el-button>

            <el-button size="mini" class="filter-item" type="primary" @click="OutWarehouse">已提交</el-button>
            <!-- <el-button size="mini" class="filter-item" type="primary">未出库</el-button> -->
        </el-form>

        <el-table class="table" ref="multipleTable" border :data="currentData" v-loading="dataListLoading"
            style="width: 100%; margin: 0 auto; margin-bottom: 50px;" @selection-change="handleSelectionChange">
            <el-table-column  :selectable="(row) => !(row.orderoutNumber=='合计') && !(row.orderoutNumber=='小计')"   :show-overflow-tooltip="true" type="selection" width="55" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="totalDate" label="订单时间" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="pk_custclass_name" label="单位体" />
            <el-table-column :show-overflow-tooltip="true" align="center" width="190" prop="orderoutNumber"
                label="订单号" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="areacl_name" label="省区" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="cuName" width="190" label="客户名称" />
            <!-- <el-table-column :show-overflow-tooltip="true" align="center" prop="pNo" width="150" label="产品编码">
                <template #default="{ row }">
                    <div style="white-space: normal;">
                        <div v-for="(product, index) in row.pNo" :key="index"
                            style="margin-bottom: 4px; line-height: 1.5;">
                            {{ product.trim() }}
                        </div>
                    </div>
                </template>
           </el-table-column> -->
            <el-table-column align="center" width="330" prop="pname" label="产品名称">
                <template #default="{ row }">
                    <div style="white-space: normal;">
                        <!-- 直接遍历 pname 数组（不再需要 split('--')） -->
                        <div v-for="(product, index) in row.pname" :key="index"
                            style="margin-bottom: 4px; line-height: 1.5;">
                            {{ product.trim() }}
                        </div>
                    </div>
                </template>
            </el-table-column>
            <el-table-column align="center" prop="midCount" width="90" label="订单数">
                <template #default="{ row }">
                    <div style="white-space: normal;">
                        <!-- 直接遍历 midCount 数组（不再需要 split('--')） -->
                        <div v-for="(product, index) in row.midCount" :key="index"
                            style="margin-bottom: 4px; line-height: 1.5;">
                            {{ product.trim() }}
                        </div>
                    </div>
                </template>
            </el-table-column>
            <el-table-column align="center" prop="midUnit" width="90" label="单位" />
            <el-table-column align="center" prop="creceiver" width="90" label="联系人" />
            <el-table-column align="center" prop="ireceiveaddress" width="180" label="收货地址" />

            <el-table-column v-if="shouldPassData" header-align="center" align="center" width="150" label="操作">
                <template slot-scope="scope">
                    <el-button type="text"  v-if="!(scope.row.orderoutNumber=='合计') && !(scope.row.orderoutNumber=='小计')" size="small" :disabled="isRowSelected(scope.row)"
                        @click="addOrUpdateHandle(scope.row.orderoutNumber, scope.row)">提交工厂</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination style="width: 90%; margin: 0 auto; " @size-change="sizeChangeHandle" ref="pagination"
            @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[20, 40, 60, 80, 100, 1000]"
            :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="dataList.length">
        </el-pagination>
        <!-- <ChildComponent ref="addupdata" v-if="shouldPassData" :startDate="dataForm.p_vouchdatestart" :endDate="dataForm.p_vouchdateend"  /> -->
    </div>
</template>

<script>
import * as api from '@/api/WLOutWarehouseAPI/WLOutWarehouse.js'
import ChildComponent from './outWarehouse.vue';
import axios from 'axios';
import {
    exportExcel
} from './OutOrderExpro.js'
export default {
    components: {
        ChildComponent
    },
    name: 'outorder-page',
    data() {
        return {
            msg: 'outorder-page',
            dataForm: {
                p_vouchdatestart: '',
                p_vouchdateend: ''
            },
            dataForm1: {
                page: 0,
                size: 500,
                sort: '',
            },
            orderForm: {
                orderout_number: ''
            },
            ptsForm: {
                id: '',
                orderoutMainNumber: '',
                orderoutNumber: '',
                busType: '1',
            },
            bullay: '',
            dataListLoading: false,
            dataList: [],
            proList: [],
            orderList: [],
            currentData: [],
            currentPage: 1,
            pageSize: 20,
            totalItems: 0,
            exportList: [],
            corderno: '',
            selectedRowsEX: [],
            shouldPassData: true, // 控制是否传递数据
        };
    },
    created() {
        this.calculateDates();
    },
    mounted() {
        this.proDataList()
    },
    methods: {
        handleSelectionChange(val) {
            this.selectedRowsEX = val;
            console.log('选中的行:', this.selectedRowsEX)
        },
        // 检查行是否被选中
        isRowSelected(row) {
            console.log(row.orderoutNumber, "row")
            return this.selectedRowsEX.some(selectedRow =>
                selectedRow.orderoutNumber === row.orderoutNumber
            );
        },
        //获取时间戳
        getCompactDateTime(date = new Date(), includeMs = true) {
            const pad = (num, length) => String(num).padStart(length, '0');

            const year = date.getFullYear();
            const month = pad(date.getMonth() + 1, 2);
            const day = pad(date.getDate(), 2);
            const hours = pad(date.getHours(), 2);
            const minutes = pad(date.getMinutes(), 2);
            const seconds = pad(date.getSeconds(), 2);

            let result = `YFRY-${year}-${month}${day}-${hours}${minutes}${seconds}`;

            // if (includeMs) {
            //     const milliseconds = pad(date.getMilliseconds(), 3);
            //     result += milliseconds;
            // }

            return result;
        },
        //推出库按钮
        addOrUpdateHandle(id, data) {
            this.$confirm('是否完成提交工厂?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.dataListLoading = true
                let Main1ID = this.getCompactDateTime()
                this.orderForm.orderout_number = data.orderoutNumber
                this.orderForm.orderout_main_number = Main1ID;
                //出库
                api.pullOrderPtsApi(this.orderForm).then(res => {
                    this.getDataList()
                })
                //发货NCC推订单到BI,BI审核后推PTS,

                this.ptsForm.orderoutNumber = data.orderoutNumber;
                this.ptsForm.orderoutMainNumber = Main1ID
                api.APIptsnccSendADD(this.ptsForm).then(res => {
                    this.$message.success('已成功提交工厂')
                    this.getDataList()
                    this.dataListLoading = false
                })
            })
        },
        //选中推出
        async allSubmit() {
            this.dataListLoading = true
            let selectedRows = this.$refs.multipleTable.selection;
            let MainID = this.getCompactDateTime()
            if (selectedRows.length) {
                // 第一步：循环调用 APIptsnccSendADD 接口   发货推送订单数据到PTS  NCC推订单到BI,BI审核后推PTS   
                try {
                    // 顺序处理每个订单
                    for (const item of selectedRows) {
                        this.ptsForm.orderoutNumber = item.orderoutNumber;
                        this.ptsForm.orderoutMainNumber = MainID

                        // 调用接口
                        await api.APIptsnccSendADD(this.ptsForm);

                        // 如果需要可以添加延迟
                        // await new Promise(resolve => setTimeout(resolve, 500));
                    }

                    // 第二步：循环调用 pullOrderPtsApi 接口 出库推送订单数据到PTS
                    for (const item of selectedRows) {
                        // 假设 orderForm 需要设置相关参数
                        this.orderForm.orderout_number = item.orderoutNumber;
                        this.orderForm.orderout_main_number = MainID;

                        // 调用第二个接口
                        await api.pullOrderPtsApi(this.orderForm);

                        // this.$message.success(`订单 ${item.orderoutNumber} 已成功提交工厂`);

                        // 如果需要可以添加延迟
                        // await new Promise(resolve => setTimeout(resolve, 500));
                    }

                    // 所有订单处理完成后显示成功提示
                    this.$message.success('提交成功');
                    this.getDataList()
                    this.dataListLoading = false
                } catch (error) {
                    // 错误处理
                    this.$message.error(`提交成功: ${error.message || '未知错误'}`);
                }
                console.log(MainID)
                console.log(selectedRows)
            } else {
                this.dataListLoading = false
                this.$message.error('请勾选单号');
            }


        },
        //已出库
        OutWarehouse() {
            this.shouldPassData = false;
            this.dataListLoading = true;
            this.orderList = [];
            this.dataList = [];
            this.exportList = []
            api.ptsNccOrderStopApi(this.dataForm).then(res => {
                this.orderList = res
                console.log(this.orderList)
                this.dataList = this.orderList
                this.dataList = this.dataList.filter(item => item.pname !== '吸管');
                // 过滤数据  
                this.dataList = this.dataList.filter(item =>
                    (item.orderoutNumber && item.orderoutNumber.includes(this.bullay)) ||
                    (item.cname && item.cname.includes(this.bullay)) ||
                    (item.pname && item.pname.includes(this.bullay)) ||
                    (item.areacl_name && item.areacl_name.includes(this.bullay)) ||
                    (item.cuName && item.cuName.includes(this.bullay)) ||
                    (item.pk_custclass_name && item.pk_custclass_name.includes(this.bullay))
                );
                this.exportList = [
                    ...this.dataList
                ]

                // 1. 按 orderoutNumber 分组，并保留其他字段（取第一个匹配项的字段）
                const grouped = this.dataList.reduce((acc, obj) => {
                    const key = obj.orderoutNumber;
                    if (!acc[key]) {
                        acc[key] = { ...obj }; // 复制第一个对象的其他字段
                        acc[key].pname = [obj.pname]; // 直接存储为数组
                        acc[key].pNo = [obj.pNo];
                        acc[key].midCount = [obj.midCount];
                    } else {
                        acc[key].pname.push(obj.pname); // 追加到数组
                        acc[key].pNo.push(obj.pNo);
                        acc[key].midCount.push(obj.midCount);
                    }
                    return acc;
                }, {});

                // 2. 直接保留合并后的字段为数组（不进行 join）
                this.dataList = Object.values(grouped).map(item => {
                    return {
                        ...item, // 保留其他字段
                        pname: item.pname, // 已经是数组，无需 join
                        pNo: item.pNo,
                        midCount: item.midCount
                    };
                });

                console.log(this.dataList)
                this.currentData = {
                    ...this.dataList
                };

                this.sizeChangeHandle(this.pageSize);
                this.dataListLoading = false
            })

        },
        //返回全部(ncc推pts订单出库)
        getDataList() {
            this.orderList = [];
            this.dataList = [];
            this.exportList = []
            this.shouldPassData = true;
            api.ptsNccOrderApi(this.dataForm).then(res => {
                this.orderList = res
                //计算全部合计
                let newDate = this.calculateTotal(this.orderList)
                this.dataList = this.orderList
                this.dataList = this.dataList.filter(item => item.pname !== '吸管');
                // 过滤数据  
                this.dataList = this.dataList.filter(item =>
                    (item.orderoutNumber && item.orderoutNumber.includes(this.bullay)) ||
                    (item.cname && item.cname.includes(this.bullay)) ||
                    (item.pname && item.pname.includes(this.bullay)) ||
                    (item.areacl_name && item.areacl_name.includes(this.bullay)) ||
                    (item.cuName && item.cuName.includes(this.bullay)) ||
                    (item.pk_custclass_name && item.pk_custclass_name.includes(this.bullay))
                );
                let newDateMin = this.calculateTotalmin(this.dataList)
                
                this.exportList = [
                    ...this.dataList
                ]


                // 1. 按 orderoutNumber 分组，并保留其他字段（取第一个匹配项的字段）
                const grouped = this.dataList.reduce((acc, obj) => {
                    const key = obj.orderoutNumber;
                    if (!acc[key]) {
                        acc[key] = { ...obj }; // 复制第一个对象的其他字段
                        acc[key].pname = [obj.pname]; // 直接存储为数组
                        acc[key].pNo = [obj.pNo];
                        acc[key].midCount = [obj.midCount];
                    } else {
                        acc[key].pname.push(obj.pname); // 追加到数组
                        acc[key].pNo.push(obj.pNo);
                        acc[key].midCount.push(obj.midCount);
                    }
                    return acc;
                }, {});

                // 2. 直接保留合并后的字段为数组（不进行 join）
                this.dataList = Object.values(grouped).map(item => {
                    return {
                        ...item, // 保留其他字段
                        pname: item.pname, // 已经是数组，无需 join
                        pNo: item.pNo,
                        midCount: item.midCount
                    };
                });
                this.dataList = this.dataList.map(item => {
                    // 检查 totalDate 是否存在
                    if (item.totalDate) {
                        // 分割字符串，只取日期部分
                        const dateOnly = item.totalDate.split(' ')[0];
                        return {
                            ...item,  // 保留其他所有字段
                            totalDate: dateOnly  // 更新 totalDate 字段
                        };
                    }
                    return item;  // 如果没有 totalDate 字段，返回原对象
                });
                this.dataList.push(newDateMin)
                this.dataList.push(newDate);
                console.log(this.dataList, 'dataList')
                this.currentData = {
                    ...this.dataList
                };

                this.sizeChangeHandle(this.pageSize);
                this.dataListLoading = false
            })
        },

        //计算小计
        calculateTotalmin(data) {
            // 计算 midCount 总和（自动处理字符串、忽略无效值）
            const totalMidCount = data.reduce((sum, item) => {
                const value = item.midCount;
                if (value == null || value === "") return sum; // 跳过 null/undefined/空字符串
                const num = Number(value); // 自动转换字符串数字
                return isNaN(num) ? sum : sum + num;
            }, 0);

            // 生成合计对象
            return {
                orderoutNumber: "小计",
                midUnit:'箱',
                midCount: [parseFloat(totalMidCount.toFixed(2)).toString()] // 保留2位小数
            };
        },

        //计算合计
        calculateTotal(data) {
            // 计算 midCount 总和（自动处理字符串、忽略无效值）
            const totalMidCount = data.reduce((sum, item) => {
                const value = item.midCount;
                if (value == null || value === "") return sum; // 跳过 null/undefined/空字符串
                const num = Number(value); // 自动转换字符串数字
                return isNaN(num) ? sum : sum + num;
            }, 0);

            // 生成合计对象
            return {
                orderoutNumber: "合计",
                midUnit:'箱',
                midCount: [parseFloat(totalMidCount.toFixed(2)).toString()] // 保留2位小数
            };
        },

        proDataList() {
            console.log(this.getCompactDateTime())
            this.dataListLoading = true
            api.TtrackProductAdd(this.dataForm1).then(res => {
                this.proList = res.content
                // this.proList = this.proList.filter(item => item.productClassPname == '常温系列');
                this.getDataList()
            })
        },
        exportData() {
            this.$confirm('是否导出表格数据到Excel?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {

                exportExcel(this.exportList, '出库订单.xlsx')

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