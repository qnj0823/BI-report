<template>
    <div class='proStork'>
        <div ref="echarts" style="width: 100%; height: 400px; "></div>

        <el-form :inline="true" style="width: 80%; margin: 0 auto;" :model="dataForm" @submit.native.prevent>
            <el-form-item>
                <el-input v-model="dataForm.blurry" placeholder="产品名称" clearable @keyup.enter.native="searchEnterFun()"
                    ref="searchInput"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button class="filter-item" size="mini" type="success" icon="el-icon-search"
                    @click="getDataList">查询</el-button>
            </el-form-item>
            <el-button size="mini" class="filter-item" type="warning" icon="el-icon-download"
                @click="exportData">导出</el-button>
        </el-form>
        <el-table class="table" ref="table" border v-loading="dataListLoading" :data="dataList"
            style="width: 80%; margin: 0 auto; margin-bottom: 50px;" :span-method="(data) => objectSpanMethod(data, dataList)">
            <el-table-column :show-overflow-tooltip="true" align="center" prop="skudescr1" label="产品名称" />
            <el-table-column :show-overflow-tooltip="true" width="120" align="center" prop="simplename" label="简称" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="lotatt01" label="产生日期" />
            <el-table-column prop="lotatt04" align="center" label="生产批次" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="item" label="单位" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="box" label="库存数量" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="sum" label="库存小计">
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
import * as api from '@/api/frame/customer.js'
import * as echarts from 'echarts';
import { data } from 'vue-echarts';
import {
    exportExcel
} from './proStorkExpro.js'
export default {
    name: 'proStork-page',
    data() {
        return {
            msg: 'proStork-page',
            dataForm: {
                blurry: '',
            },
            dataList: [],
            dataListLoading: false,
            uniqueDataListL: [],
            myChart: null,
        };
    },
    mounted() {
        this.getDataList()
        window.addEventListener('resize', this.onResize); // 处理窗口大小变化
    },
    beforeDestroy() {
        window.removeEventListener('resize', this.onResize);
        if (this.myChart) {
            this.myChart.dispose(); // 清理图表实例  

        }
    },
    methods: {
        exportData() {
            this.$confirm('是否导出表格数据到Excel？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {

                exportExcel(this.dataList, '产品库存表.xlsx')

            })
        },
        objectSpanMethod({
            row,
            column,
            rowIndex,
            columnIndex
        }, items) {
            if (columnIndex === 0) { // 处理第一列
                const currentValue = row[column.property];
                const preRow = items[rowIndex - 1];
                const preValue = preRow ? preRow[column.property] : null;

                if (currentValue === preValue) {
                    return {
                        rowspan: 0,
                        colspan: 0
                    }; // 隐藏当前单元格
                } else {
                    let rowspan = 1;
                    for (let i = rowIndex + 1; i < items.length; i++) {
                        const nextRow = items[i];
                        if (nextRow[column.property] === currentValue) {
                            rowspan++;
                        } else {
                            break;
                        }
                    }
                    return {
                        rowspan,
                        colspan: 1
                    }; // 当前单元格跨越行
                }
            }
            if (columnIndex === 6) { // 处理第一列
                const currentValue = row[column.property];
                const preRow = items[rowIndex - 1];
                const preValue = preRow ? preRow[column.property] : null;

                // 检查当前值是否为空
                if (!currentValue) {
                    return {
                        rowspan: 1, // 保留当前单元格
                        colspan: 1
                    }; // 不合并，但保留单元格
                }

                if (currentValue === preValue) {
                    return {
                        rowspan: 0,
                        colspan: 0
                    }; // 隐藏当前单元格
                } else {
                    let rowspan = 1;
                    for (let i = rowIndex + 1; i < items.length; i++) {
                        const nextRow = items[i];
                        if (nextRow[column.property] === currentValue) {
                            rowspan++;
                        } else {
                            break;
                        }
                    }
                    return {
                        rowspan,
                        colspan: 1
                    }; // 当前单元格跨越行
                }
            }
            if (columnIndex === 1) { // 处理第一列
                const currentValue = row[column.property];
                const preRow = items[rowIndex - 1];
                const preValue = preRow ? preRow[column.property] : null;

                // 检查当前值是否为空
                if (!currentValue) {
                    return {
                        rowspan: 1, // 保留当前单元格
                        colspan: 1
                    }; // 不合并，但保留单元格
                }

                if (currentValue === preValue) {
                    return {
                        rowspan: 0,
                        colspan: 0
                    }; // 隐藏当前单元格
                } else {
                    let rowspan = 1;
                    for (let i = rowIndex + 1; i < items.length; i++) {
                        const nextRow = items[i];
                        if (nextRow[column.property] === currentValue) {
                            rowspan++;
                        } else {
                            break;
                        }
                    }
                    return {
                        rowspan,
                        colspan: 1
                    }; // 当前单元格跨越行
                }
            }
        },

        getDataList() {
            api.ProdStoreDetailsAll(this.dataForm).then(res => {
                this.dataList = res
                this.dataList = this.dataList.map(obj => ({
                    ...obj, // 保留原来的字段  
                    item: "件", // 添加新的字段 item  
                }));
                this.dataList.sort((a, b) => {
                    if (a.simplename === '其它') {
                        return 1; // a 是 '其他系列'，排到后面  
                    }
                    if (b.simplename === '其它') {
                        return -1; // b 是 '其他系列'，将 a 排到前面  
                    }
                    // 正常排序其余的系列  
                    if (a.simplename < b.simplename) {
                        return -1; // a 在 b 之前  
                    }
                    if (a.simplename > b.simplename) {
                        return 1; // a 在 b 之后  
                    }
                    return 0; // 相等  
                });

                const sumMap = new Map();

                // 遍历原数组，将 box 值相加  
                this.dataList.forEach(item => {
                    if (sumMap.has(item.simplename)) {
                        sumMap.set(item.simplename, sumMap.get(item.simplename) + item.box);
                    } else {
                        sumMap.set(item.simplename, item.box);
                    }
                });
                console.log(sumMap,333)
                // 创建修改后的数组  
                this.dataList = this.dataList.map(item => ({
                    ...item, // 保留原对象的字段  
                    sum: sumMap.get(item.simplename) // 添加新字段 sum  
                }));
                this.dataList.forEach(item => {
                    if (item.skudescr1 === "光明噜渴椰子汁1.25L-1x6纸箱") {
                        item.skudescr1 = "光明噜渴椰子汁1.25L（新）-1*6纸箱";
                    }
                });

                this.uniqueDataList = this.dataList.reduce((acc, current) => {
                    const x = acc.find(item => item.simplename === current.simplename);
                    if (!x) {
                        return acc.concat([current]);
                    } else {
                        return acc;
                    }
                }, []);
                this.uniqueDataList.sort((a, b) => b.sum - a.sum); // 从大到小排序  

                console.log(this.uniqueDataList, 999)
                this.drawChart()

            })

        },
        drawChart() {
            const chartDom = this.$refs.echarts;
            this.myChart = echarts.init(chartDom);

            // 准备数据  
            const categories = this.uniqueDataList.map(item => item.simplename);
            const sums = this.uniqueDataList.map(item => item.sum);

            // 图表配置  
            const option = {
                // title: {
                //     text: '产品库存统计',
                // },
                tooltip: {},
                xAxis: {
                    type: 'category',
                    data: categories,
                    axisLabel: {
                        interval: 0, // 设置为 0 以确保所有标签都显示  
                        rotate: 25, // 旋转30度可以防止文本重叠  
                    },
                },
                yAxis: {
                    type: 'value',
                    max: 70000,
                },
                series: [{
                    name: '库存小计',
                    type: 'bar',
                    data: sums,
                    itemStyle: {
                        color: '#42a5f5',
                    },
                    barWidth: '50%', // 调整柱子宽度
                    label: {
                        show: true,
                        position: 'top',
                        z: 10000,
                        offset: [0, -10],
                        textStyle: {
                            color: '#006400', // 字体颜色  
                            textBorderColor: '#ffffff', // 可选：设置边框颜色  
                            textBorderWidth: 2, // 可选：设置边框宽度  
                        },

                    },
                }],
            };

            // 使用刚指定的配置项和数据显示图表  
            this.myChart.setOption(option);

            // myChart.on('click', (params) => {
            //     console.log('点击的横坐标名字:', params.name);

            // });

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
  padding: 0px !important;
}

;

::v-deep th.el-table__cell>.cell {
  padding: 0px !important;
}

;

::v-deep .el-table__header-wrapper {
  font-size: 15px;
}

</style>