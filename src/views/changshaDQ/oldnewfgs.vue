<template>
    <div class='oldnew'>
        <div ref="chart" style="width:100%; height:500px;"></div>

        <el-form :inline="true" style="width: 65%; margin: 0 auto;">
            <el-button size="mini" class="filter-item" type="warning" icon="el-icon-download"
                @click="exportData">导出</el-button>
            <el-button class="filter-item" size="mini" type="primary" @click="Enterdetails">站点详情</el-button>
        </el-form>
        <el-table class="table" ref="table" border :data="dataList" v-loading="dataListLoading"
            style="width: 65%; margin: 0 auto; margin-bottom: 50px;">
            <el-table-column :show-overflow-tooltip="true" align="center" prop="iParentName" label="销售区域" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="ocustomerClass_name" label="分公司/办事处" />
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
import * as api from '@/api/DQAPI/dqallApi.js'
import * as echarts from 'echarts';
import {
    exportExcel
} from './oldnewfgsExpro.js'
export default {
    props: {
        startTime: {
            type: String,
            required: true
        },
        endTime: {
            type: String,
            required: true
        },
        message: {
            type: String,
            required: true
        }
    },
    name: 'oldnew-page',
    data() {
        return {
            dataListLoading: false,
            dataList: [],
            chartList: [],
            dataForm: {
                p_vouchdateend: '',
                p_vouchdatestart: '',
                p_orgname: ''
            },
        };
    },
    mounted() {
        this.getdataList()

    },
    beforeDestroy() {
        window.removeEventListener('resize', this.onResize);
        if (this.myChart) {
            this.myChart.dispose(); // 清理图表实例  

        }
    },
    methods: {
        initChart() {
            const oldboxes = this.chartList.map(item => parseFloat(item.oldbox));
            const newboxes = this.chartList.map(item => parseFloat(item.newbox));
            const oldrates = this.chartList.map(item => item.oldrate);
            const newrates = this.chartList.map(item => item.newrate);
            const allboxes = this.chartList.map(item => parseFloat(item.allbox));
            const otherboxes = this.chartList.map(item => parseFloat(item.otherbox));
            const otherrates = this.chartList.map(item => item.otherrate);
            const names = this.chartList.map(item => item.ocustomerClass_name);

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
                        data: newboxes,
                        barWidth: '20%',

                        label: {
                            show: true,
                            position: 'top',
                            formatter: function (params) {
                                const index = params.dataIndex;
                                return newrates[index]; // 显示 oldrate newrates
                            },
                            offset: [0, 0],
                        },
                    },
                    {
                        name: '老品',
                        type: 'bar',
                        data: oldboxes,
                        barWidth: '20%',
                        offset: [0, -10],
                        label: {
                            show: true,
                            position: 'top',
                            formatter: function (params) {
                                const index = params.dataIndex;
                                return oldrates[index]; // 显示 newrate 
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
                    path: '/proSalesALL/fgsOldNewSales',
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


        exportData() {
            this.$confirm('是否导出表格数据到Excel?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {

                exportExcel(this.dataList, '老/新品销售表.xlsx')

            })
        },
        Enterdetails() {
            this.$router.push({
                path: '/changshaDQ/SQoldnew',
                query: {
                    param1: this.message,
                    enddata: this.dataForm.p_vouchdateend,
                    startdate: this.dataForm.p_vouchdatestart
                }
            });
        },
        getdataList() {
            this.dataForm.p_orgname = this.message;
            this.dataForm.p_vouchdatestart = this.startTime;
            this.dataForm.p_vouchdateend = this.endTime;
            this.dataListLoading = true
            api.fgsnewoldApi(this.dataForm).then(res => {
                this.dataList = res
                this.dataList.forEach(item => {
                    if (item.iParentName) { // 检查 iParentName 是否存在且非空  
                        item.iParentName = item.iParentName.replace(/\d+/g, '').trim(); // 替换数字并去除空格  
                        item.oldbox = !isNaN(parseFloat(item.oldbox)) ? parseFloat(item.oldbox).toFixed(0) : '0';
                        item.newbox = !isNaN(parseFloat(item.newbox)) ? parseFloat(item.newbox).toFixed(0) : '0';
                        item.allbox = !isNaN(parseFloat(item.allbox)) ? parseFloat(item.allbox).toFixed(0) : '0';
                        item.otherbox = !isNaN(parseFloat(item.otherbox)) ? parseFloat(item.otherbox).toFixed(0) : '0';
                    }
                });
                // 使用 reduce 方法计算合计  
                const total = this.dataList.reduce((acc, item) => {
                    return {
                        oldbox: acc.oldbox + Number(item.oldbox),  // 强制转换为数字  
                        newbox: acc.newbox + Number(item.newbox),  // 强制转换为数字  
                        otherbox: acc.otherbox + Number(item.otherbox),  // 强制转换为数字  
                        allbox: acc.allbox + Number(item.allbox)   // 强制转换为数字  
                    };
                }, { oldbox: 0, newbox: 0, otherbox: 0, allbox: 0 });

                // 创建合计对象  
                const totalObject = {
                    ocustomerClass_name: "合计",
                    ...total // 使用展开运算符将总计值添加到新对象中  
                };

                // 将合计对象添加到数组末尾  
                this.dataList.push(totalObject);
                this.chartList = this.dataList.filter(item => item.ocustomerClass_name != '合计');
                this.initChart()
                console.log(this.dataList)
                this.dataListLoading = false
            })
        },
    }
};
</script>

<style scoped lang="scss">
::v-deep .table .el-table__cell {
    padding: 2px !important;

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


::v-deep .el-table th {
    background: #f5f7fa;
}
</style>