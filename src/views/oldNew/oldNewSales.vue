<template>
    <div class='sles'>
        <div ref="chart" style="width:100%; height:500px;"></div>

        <el-form :inline="true" style="width: 55%; margin: 0 auto;">
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
            <el-button size="mini" class="filter-item" type="warning" icon="el-icon-download"
                @click="exportData">导出</el-button>
        </el-form>

        <el-table class="table" ref="table" border :data="dataList" v-loading="dataListLoading"
            style="width: 55%; margin: 0 auto; margin-bottom: 50px;">
            <el-table-column :show-overflow-tooltip="true" align="center" prop="name" label="销售部" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="oldbox" label="老品" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="oldrate" label="老品百分比" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="newbox" label="新品" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="newrate" label="新品百分比" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="otherbox" label="其它品" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="otherrate" label="其它品百分比" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="allbox" label="小计" />
        </el-table>
    </div>
</template>

<script>
import * as api from '@/api/frame/customer.js'
import * as echarts from 'echarts';
import { data } from 'vue-echarts';
import {
    exportExcel
} from './oldNewSalesExpro.js'
export default {
    name: 'sles-page',
    data() {
        return {
            msg: 'sles-page',
            dataForm: {
                p_vouchdatestart: '',
                p_vouchdateend: ''
            },
            dataList: [],
            chartList: [],
            dataListLoading: false
        };
    },
    created() {
        this.calculateDates();
    },
    beforeDestroy() {
        window.removeEventListener('resize', this.onResize);
        if (this.myChart) {
            this.myChart.dispose(); // 清理图表实例  

        }
    },
    mounted() {
        const chartfgs1 = sessionStorage.getItem('chartfgs');
        const datafgs1 = sessionStorage.getItem('dataListfgs');
        const startdate1 = sessionStorage.getItem('startdatefgs');
        const enddate1 = sessionStorage.getItem('enddatefgs');
        if (chartfgs1) {
            const chart1List = JSON.parse(chartfgs1);
            const data1List = JSON.parse(datafgs1);
            this.dataForm.p_vouchdatestart = startdate1
            this.dataForm.p_vouchdateend = enddate1
            this.chartList = chart1List
            this.dataList = data1List
            this.initChart()

        } else {
            this.getDataList()
        }
        window.addEventListener('resize', this.onResize); // 处理窗口大小变化
    },
    methods: {
        exportData() {
            this.$confirm('是否导出表格数据到Excel?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {

                exportExcel(this.dataList, '老/新品销售表.xlsx')

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
        getDataList() {
            sessionStorage.setItem('startdatefgs', this.dataForm.p_vouchdatestart);
            sessionStorage.setItem('enddatefgs', this.dataForm.p_vouchdateend);
            this.dataListLoading = true
            api.newoldproductAll(this.dataForm).then(res => {
                this.dataList = res;

                // 计算合计  
                const total = this.dataList.reduce((acc, item) => {
                    acc.oldbox += parseFloat(item.oldbox) || 0; // 如果 item.oldbox 不存在，取 0  
                    acc.newbox += parseFloat(item.newbox) || 0; // 如果 item.newbox 不存在，取 0  
                    acc.allbox += parseFloat(item.allbox) || 0; // 如果 item.allbox 不存在，取 0  
                    acc.otherbox += parseFloat(item.otherbox) || 0; // 如果 item.otherbox 不存在，取 0  
                    return acc;
                }, {
                    oldbox: 0,
                    newbox: 0,
                    allbox: 0,
                    otherbox: 0,
                });

                // 添加合计对象  
                const summary = {
                    name: '合计',
                    oldbox: total.oldbox.toFixed(0),
                    newbox: total.newbox.toFixed(0),
                    allbox: total.allbox.toFixed(0),
                    otherbox: total.otherbox.toFixed(0),
                };

                // 将合计对象添加到数据数组中  
                this.dataList.push(summary);
                this.dataList.forEach(item => {
                    item.oldbox = parseFloat(item.oldbox).toFixed(0); // 格式化 oldbox   
                    item.newbox = parseFloat(item.newbox) || 0; // 格式化 newbox，若不存在则取 0   
                    item.allbox = parseFloat(item.allbox).toFixed(0); // 格式化 allbox  
                    item.otherbox = parseFloat(item.otherbox).toFixed(0); // 格式化 otherbox  
                });

                this.chartList = this.dataList.filter(item => item.name !== "合计");
                console.log(this.chartList);
                this.dataListLoading = false;
                sessionStorage.setItem('dataListfgs', JSON.stringify(this.dataList));
                sessionStorage.setItem('chartfgs', JSON.stringify(this.chartList));
                this.initChart();
            });

        },
        initChart() {
            const oldboxes = this.chartList.map(item => parseFloat(item.oldbox));
            const newboxes = this.chartList.map(item => parseFloat(item.newbox));
            const oldrates = this.chartList.map(item => item.oldrate);
            const newrates = this.chartList.map(item => item.newrate);
            const allboxes = this.chartList.map(item => parseFloat(item.allbox));
            const otherboxes = this.chartList.map(item => parseFloat(item.otherbox));
            const otherrates = this.chartList.map(item => item.otherrate);
            const names = this.chartList.map(item => item.name);


            // 初始化 ECharts 实例 
            this.myChart = echarts.init(this.$refs.chart);
            const option = {
                // title: {
                //     text: '营销数据'
                // },
                tooltip: {
                    trigger: 'axis',
                },
                legend: {
                    data: ['新品', '老品', '其它', '合计'],
                },
                xAxis: {
                    type: 'category',
                    data: names,

                },
                yAxis: {
                    type: 'value',
                },
                series: [
                    {
                        name: '新品',
                        type: 'bar',
                        data: oldboxes,
                        barWidth: '20%',

                        label: {
                            show: true,
                            position: 'top',
                            formatter: function (params) {
                                const index = params.dataIndex;
                                return oldrates[index]; // 显示 oldrate 
                            },
                            offset: [0, 0],
                        },
                    },
                    {
                        name: '老品',
                        type: 'bar',
                        data: newboxes,
                        barWidth: '20%',
                        offset: [0, -10],
                        label: {
                            show: true,
                            position: 'top',
                            formatter: function (params) {
                                const index = params.dataIndex;
                                return newrates[index]; // 显示 newrate 
                            },
                            // offset: [0, -10],
                        },
                    },
                    {
                        name: '其它',
                        type: 'bar',
                        data: otherboxes,
                        barWidth: '20%',
                        offset: [0, -10],
                        label: {
                            show: true,
                            position: 'top',
                            formatter: function (params) {
                                const index = params.dataIndex;
                                const value = otherboxes[index]; // 获取当前柱子的值 
                                if (value === 0) {
                                    return ''; // 当值为0时，返回空字符串 
                                }
                                return otherrates[index]; // 否则显示 otherrates 
                            },
                            // offset: [0, -10],
                        },
                    },
                    {
                        name: '合计',
                        type: 'line',
                        data: allboxes,
                        yAxisIndex: 0,
                        // 可以设置不同的样式来区分折线图 
                        lineStyle: {
                            color: '#ff4f4f' // 设置折线颜色 
                        },
                        label: {
                            show: true,
                            position: 'top',
                            offset: [0, -20],
                            textStyle: {
                                color: '#006400', // 字体颜色  

                            },

                        },
                    }
                ]
            };

            // 使用刚指定的配置项和数据显示图表。  
            this.myChart.setOption(option);
            this.myChart.on('click', (params) => {
                console.log('点击的横坐标名字:', params.name);
                this.$router.push({
                    path: '/oldNew/fgsOldNewSales',
                    query: {
                        param1: params.name,
                        enddata: this.dataForm.p_vouchdateend,
                        startdate: this.dataForm.p_vouchdatestart
                    }
                });
            });
        },
        onResize() {
            if (this.myChart) {
                this.myChart.resize(); // 处理图表尺寸调整  
            }
        },

    }
};
</script>

<style scoped lang="scss">
::v-deep .table .el-table__cell {
    padding: 10px !important;

}

;

::v-deep th.el-table__cell>.cell {
    padding: 0px !important;
}

;

::v-deep .el-table__header-wrapper {
    font-size: 15px;
    background: #f5f7fa;
}

::v-deep .el-table .el-table__body-wrapper tbody tr:last-child {
    font-size: 15px;
    /* 根据需要设置字体大小 */
    font-weight: 600;
}

::v-deep .el-table th {
    background: #f5f7fa;
}
</style>