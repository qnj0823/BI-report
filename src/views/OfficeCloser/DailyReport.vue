<template>
    <div class='DailyReport'>
        <el-form :inline="true" style="width:90%; margin: 0 auto;">
            <div class="test">{{ this.labelText }}</div>
            <el-form-item>
                日期区间：
                <el-form-item>
                    <el-date-picker v-model="dataForm.p_vouchdatestart" value-format="yyyy-MM-dd" type="date"
                        placeholder="开始日期" clearable style="width: 100%"></el-date-picker>
                </el-form-item>
                <el-form-item>
                    <el-date-picker v-model="dataForm.p_vouchdateend" value-format="yyyy-MM-dd" type="date"
                        placeholder="结束日期" clearable style="width: 100%"></el-date-picker>
                </el-form-item>
            </el-form-item>
            <el-form-item>
                当前数据日期：
                <el-form-item>
                    <el-date-picker v-model="dataForm.p_vouchdatecur" value-format="yyyy-MM-dd" type="date"
                        placeholder="开始日期" clearable style="width: 100%"></el-date-picker>
                </el-form-item>
            </el-form-item>
            <el-form-item>
                <el-input v-model="bullay" placeholder="模糊查询" clearable @keyup.enter.native="searchEnterFun()"
                    ref="searchInput"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button class="filter-item" size="mini" type="success" icon="el-icon-search"
                    @click="getDataList">查询</el-button>
            </el-form-item>
            <el-form-item>
                <el-button size="mini" class="filter-item" type="warning" icon="el-icon-download"
                    @click="exportData">导出</el-button>
            </el-form-item>
        </el-form>
        
        <!-- 三个小表格 -->
        <div class="summary-tables-container" style="width: 90%; margin: 20px auto;">
            <div class="summary-tables-row">
                <!-- 区间总增幅表格 -->
                <div class="summary-table">
                    <div class="summary-table-title">区间总增幅</div>
                    <table class="summary-table-content">
                        <tr>
                            <td class="label-cell">去年同区间累积</td>
                            <td class="data-cell"></td>
                        </tr>
                        <tr>
                            <td class="label-cell">今年同区间报单</td>
                            <td class="data-cell"></td>
                        </tr>
                        <tr>
                            <td class="label-cell">区间同比差额</td>
                            <td class="data-cell"></td>
                        </tr>
                        <tr>
                            <td class="label-cell">区间同比完成率</td>
                            <td class="data-cell"></td>
                        </tr>
                    </table>
                </div>

                <!-- 截止今日增幅表格 -->
                <div class="summary-table">
                    <div class="summary-table-title">截止今日增幅</div>
                    <table class="summary-table-content">
                        <tr>
                            <td class="label-cell">截止去年同期累积</td>
                            <td class="data-cell"></td>
                        </tr>
                        <tr>
                            <td class="label-cell">截止今日当期累积</td>
                            <td class="data-cell"></td>
                        </tr>
                        <tr>
                            <td class="label-cell">截止今日同比差额</td>
                            <td class="data-cell"></td>
                        </tr>
                        <tr>
                            <td class="label-cell">截止今日同比完成率</td>
                            <td class="data-cell"></td>
                        </tr>
                    </table>
                </div>

                <!-- 今日增幅表格 -->
                <div class="summary-table">
                    <div class="summary-table-title">今日增幅</div>
                    <table class="summary-table-content">
                        <tr>
                            <td class="label-cell">去年同期</td>
                            <td class="data-cell"></td>
                        </tr>
                        <tr>
                            <td class="label-cell">今日报单</td>
                            <td class="data-cell"></td>
                        </tr>
                        <tr>
                            <td class="label-cell">今日差额</td>
                            <td class="data-cell"></td>
                        </tr>
                        <tr>
                            <td class="label-cell">日完成率</td>
                            <td class="data-cell"></td>
                        </tr>
                    </table>
                </div>
            </div>
        </div>

        <el-table class="table" ref="table" :data="currentData" v-loading="dataListLoading"
            style="width: 90%; margin: 0 auto; margin-bottom: 50px;">
            <el-table-column :show-overflow-tooltip="true" align="center" prop="vouchdate" label="日期" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="cityname" label="城市" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="areaname" label="区域" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="cSiteName" label="客户(站点)" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="lastbox" label="24年10月累积" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="currentbox" label="10月报单累积" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="yearcomplet" label="同比完成率" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="lasttodaybox" label="今日同期" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="todaybox" label="今日报单" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="tadaydifferen" label="今日同期差额" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="yearlate" label="累积同期差额" />
        </el-table>
        <el-pagination @size-change="sizeChangeHandle" ref="pagination" @current-change="handleCurrentChange"
            :current-page="currentPage" :page-sizes="[20, 40, 60, 80, 100, 1000]" :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper" :total="dataListTA.length">
        </el-pagination>

    </div>
</template>

<script>
import * as api from '@/api/frame/customer.js'

import {
    exportExcel
} from './DailyReportExpro.js'
export default {
    name: 'DailyReport-page',
    data() {
        return {
            msg: 'DailyReport-page',
            dataForm: {
                p_vouchdatestart: '',
                p_vouchdateend: '',
                p_vouchdatecur: ''
            },
            dataListLoading: false,
            bullay: '',
            dataList: [],
            dataListTA: [],
            currentData: [],
            currentPage: 1,
            pageSize: 20,
            totalItems: 0,
            labelText: '销售日订单跟进表',

        };
    },
    created() {
        this.calculateCurrentYearDates();
        // this.calculateLastYearDates()
    },
    mounted() {
        this.getDataList()
    },
    methods: {
        getDataList() {
            this.dataListLoading = true
            api.APIdaily_report(this.dataForm).then(res => {
                this.dataList = res
                // 过滤掉provincename为空的对象
                this.dataList = this.dataList.filter(item => {
                    // 处理空字符串、null、undefined以及字段不存在的情况
                    return item.provincename || item.provincename === 0; // 特殊处理0的情况（如果需要）
                    // 若不需要保留0，直接用：return !!item.provincename;
                });
                //
                this.dataListTA = this.processData(this.dataList);
                console.log(this.dataListTA, 'this.dataListTA')
                // 处理数组，同时新增yearcomplet和tadaydifferen字段
                this.dataListTA = this.dataListTA.map(item => {
                    // 处理yearcomplet（百分比）
                    let yearcomplet;
                    if (item.currentbox === 0 || item.lastbox === 0) {
                        yearcomplet = '0%';
                    } else {
                        const ratio = Number(item.currentbox) / Number(item.lastbox); // 显式转数字，避免类型问题
                        yearcomplet = (ratio * 100).toFixed(2) + '%';
                    }

                    // 处理todaybox和lasttodaybox为空的情况（转为0）
                    const todayBoxVal = item.todaybox || 0; // 空值转为0
                    const lastTodayBoxVal = item.lasttodaybox || 0; // 空值转为0
                    // 确保是数字类型（处理可能的字符串数字，如"10"）
                    const todayNum = Number(todayBoxVal);
                    const lastTodayNum = Number(lastTodayBoxVal);

                    // 计算tadaydifferen
                    const tadaydifferen = todayNum - lastTodayNum;

                    return { ...item, yearcomplet, tadaydifferen };
                });

                // 排序逻辑：先按provincename升序，再按vouchdate降序（日期从晚到早）
                this.dataListTA = [...this.dataListTA].sort((a, b) => {
                    // 1. 先按省份升序
                    if (a.provincename !== b.provincename) {
                        return a.provincename.localeCompare(b.provincename);
                    }
                    // 2. 同一省份内，按日期降序（晚的日期在前）
                    return a.vouchdate.localeCompare(b.vouchdate);
                });
                this.dataListTA = this.dataListTA.filter(item =>
                    (item.cityname && item.cityname.toLowerCase().includes(this.bullay)) ||
                    (item.name && item.name.toLowerCase().includes(this.bullay)) ||
                    (item.areaname && item.areaname.toLowerCase().includes(this.bullay)) ||
                    (item.cSiteName && item.cSiteName.toLowerCase().includes(this.bullay)) ||
                    (item.provincename && item.provincename.toLowerCase().includes(this.bullay)) 
                );
                
                this.currentData = {
                    ...this.dataListTA
                };
                this.dataListLoading = false
                this.sizeChangeHandle(this.pageSize);

            })
        },
        exportData() {
            console.log(this.dataForm.p_vouchdatecur);
            this.$confirm('是否导出表格数据到Excel?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                exportExcel(this.dataListTA,this.dataForm.p_vouchdatestart,this.dataForm.p_vouchdateend,this.dataForm.p_vouchdatecur, '销售日订单跟进表.xlsx')
            })
        },
        processData(originalArray) {
            // 工具函数：将空值（null/undefined/''等）转为0，非空值转为数字
            const getNumberValue = (value) => {
                // 判定为空值的情况：null、undefined、空字符串、纯空格字符串
                if (value === null || value === undefined || (typeof value === 'string' && value.trim() === '')) {
                    return 0;
                }
                // 非空值转为数字（兼容数字型、字符串型数字）
                return Number(value);
            };

            // 1. 按cSiteName分组（复制原对象，避免修改原始数据）
            const groups = {};
            originalArray.forEach(item => {
                const siteName = item.cSiteName;
                if (!groups[siteName]) {
                    groups[siteName] = [];
                }
                groups[siteName].push({ ...item });
            });

            // 2. 处理每组：排序 + 计算yearlate（空字段按0处理）
            const dataListTA = [];
            Object.values(groups).forEach(group => {
                // 按vouchdate升序排序（空日期会排在最前，若需特殊处理可补充逻辑）
                group.sort((a, b) => {
                    const dateA = a.vouchdate ? new Date(a.vouchdate) : new Date(0);
                    const dateB = b.vouchdate ? new Date(b.vouchdate) : new Date(0);
                    return dateA - dateB;
                });

                // 计算累加yearlate，空字段通过getNumberValue转为0
                let accumulated = 0;
                group.forEach(item => {
                    const todayboxNum = getNumberValue(item.todaybox);
                    const lasttodayboxNum = getNumberValue(item.lasttodaybox);
                    const currentDiff = todayboxNum - lasttodayboxNum;

                    accumulated += currentDiff; // 直接累加（第一项自然是currentDiff，无需判断索引）
                    item.yearlate = accumulated; // 最终yearlate为数字类型
                });

                dataListTA.push(...group);
            });

            return dataListTA;
        },

        // 每页数
        sizeChangeHandle(val) {
            this.pageSize = val;
            this.currentPage = 1;
            this.currentData = this.dataListTA.slice((this.currentPage - 1) * this.pageSize, this.currentPage * this
                .pageSize);
        },
        // 当前页
        handleCurrentChange(val) {
            console.log(val)
            this.currentPage = val;
            this.currentData = this.dataListTA.slice((val - 1) * this.pageSize, val * this.pageSize);
        },
        // 获取今年的日期数据
        calculateCurrentYearDates() {
            const today = new Date();

            // 获取当前月份的月初时间 
            const startOfMonthDate = new Date(today.getFullYear(), today.getMonth(), 1);
            this.startOfMonth = this.formatDate(startOfMonthDate);

            // 获取截至今天的时间 
            this.endOfToday = this.formatDate(today);

            // 获取当前月份的最后一天（月末）
            const endOfMonthDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);
            this.endOfMonth = this.formatDate(endOfMonthDate);

            this.dataForm.p_vouchdatestart = this.startOfMonth;
            this.dataForm.p_vouchdateend = this.endOfMonth;
            this.dataForm.p_vouchdatecur = this.endOfToday

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

<style scoped lang="scss">
.test {
    font-family: 'Microsoft YaHei', 微软雅黑, sans-serif;
    font-size: 22px;
    text-align: center;
    margin-bottom: 10px;
}

/* 三个小表格的样式 */
.summary-tables-container {
    margin-bottom: 20px;
}

.summary-tables-row {
    display: flex;
    justify-content: space-between;
    gap: 20px;
}

.summary-table {
    flex: 1;
    border: 1px solid #ddd;
    border-radius: 4px;
    overflow: hidden;
    background: #fff;
}

.summary-table-title {
    background: #f5f7fa;
    padding: 8px 12px;
    font-weight: bold;
    text-align: center;
    border-bottom: 1px solid #ddd;
    font-size: 14px;
}

.summary-table-content {
    width: 100%;
    border-collapse: collapse;
    
    tr {
        border-bottom: 1px solid #eee;
        
        &:last-child {
            border-bottom: none;
        }
    }
    
    td {
        padding: 6px 8px;
        font-size: 12px;
        border-right: 1px solid #eee;
        
        &:last-child {
            border-right: none;
        }
    }
    
    .label-cell {
        background: #fafafa;
        font-weight: 500;
        width: 60%;
        text-align: left;
    }
    
    .data-cell {
        background: #fff;
        text-align: right;
        font-weight: normal;
        width: 40%;
    }
}

/* 响应式设计 */
@media (max-width: 768px) {
    .summary-tables-row {
        flex-direction: column;
        gap: 10px;
    }
}
</style>