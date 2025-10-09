<template>

    <div class='rate'>
        <div style="display: flex; flex-wrap: wrap;">
            <div ref="chart" style="width:20%; height:300px;"></div>
            <div ref="chart1" style="width:20%; height:300px;"></div>
            <div ref="chart2" style="width:20%; height:300px;"></div>
            <div ref="chart3" style="width:20%; height:300px;"></div>
            <div ref="chart4" style="width:20%; height:300px;"></div>
            <div ref="chart5" style="width:20%; height:300px;"></div>
            <div ref="chart6" style="width:20%; height:300px;"></div>
            <div ref="chart7" style="width:20%; height:300px;"></div>
            <div ref="chart8" style="width:20%; height:300px;"></div>
            <div ref="chart9" style="width:20%; height:300px;"></div>
        </div>


        <el-form :inline="true" style="width: 90%; margin: 0 auto;">
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
                    @click="getDataListall">查询</el-button>
            </el-form-item>
            <el-button size="mini" class="filter-item" type="warning" icon="el-icon-download"
                @click="exportData">导出</el-button>
            <el-button class="filter-item" size="mini" type="primary" @click="Enterdetails">站点详情</el-button>
        </el-form>

        <el-table class="table" ref="table" border :data="mergedDataListall" v-loading="dataListLoading"
            style="width: 90%; margin: 0 auto; margin-bottom: 50px;">
            <el-table-column :show-overflow-tooltip="true" align="center" prop="orgname" label="战区" />
            <el-table-column :show-overflow-tooltip="true" align="center" label="今日数据">
                <el-table-column :show-overflow-tooltip="true" align="center" prop="lowSeriesday" label="低温系列" />
                <el-table-column :show-overflow-tooltip="true" align="center" prop="NorSeriesday" label="常温系列" />
                <el-table-column :show-overflow-tooltip="true" align="center" prop="FruitSeriesday" label="果汁系列" />
                <el-table-column :show-overflow-tooltip="true" align="center" width="100" prop="YzSeriesday"
                    label="椰子牛乳系列" />
                <el-table-column :show-overflow-tooltip="true" align="center" width="100" prop="YzzSeriesday"
                    label="椰子汁系列" />
                <el-table-column :show-overflow-tooltip="true" align="center" width="100" prop="QtSeriesday"
                    label="其它" />
                <el-table-column prop="sumday" align="center" label="今日报单" />
            </el-table-column>
            <el-table-column :show-overflow-tooltip="true" align="center" label="累计数据">
                <el-table-column :show-overflow-tooltip="true" align="center" prop="lowSeries" label="低温系列" />
                <el-table-column :show-overflow-tooltip="true" align="center" prop="NorSeries" label="常温系列" />
                <el-table-column :show-overflow-tooltip="true" align="center" prop="FruitSeries" label="果汁系列" />
                <el-table-column :show-overflow-tooltip="true" align="center" width="100" prop="YzSeries"
                    label="椰子牛乳系列" />
                <el-table-column :show-overflow-tooltip="true" align="center" width="100" prop="YzzSeries"
                    label="椰子汁系列" />
                <el-table-column :show-overflow-tooltip="true" align="center" width="100" prop="QtSeries" label="其它" />
                <el-table-column prop="sum" align="center" label="累计报单" />
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
} from './SalesRateitemExpro.js'
export default {
    name: 'rate-page',
    data() {
        return {
            dataForm: {
                p_vouchdatestart: '',
                p_vouchdateend: ''
            },
            dataForm1: {
                p_vouchdatestart: '',
                p_vouchdateend: ''
            },
            dataListLoading: false,
            dataList: [],
            result: [],
            chartList: [],
            mergedDataList: [],

            dataListday: [],
            chartListday: [],
            resultday: [],
            mergedDataListday: [],
            mergedDataListall: []
        };
    },
    created() {
        this.calculateDates();
    },
    mounted() {
        this.getDataListall()
    },
    methods: {
        Enterdetails() {
            this.$router.push({
                path: '/proSalesALL/SalesRateDetails',
                query: {
                    param1: '',
                    enddata: this.dataForm.p_vouchdateend,
                    startdate: this.dataForm.p_vouchdatestart
                }
            });
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
        exportData() {
            this.$confirm('是否导出表格数据到Excel?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {

                exportExcel(this.mergedDataListall, '销量进度更进表.xlsx')

            })
        },
        getDataListall() {
            this.getDataListday()
        },

        getDataListday() {
            this.dataForm1.p_vouchdatestart = this.endOfToday
            this.dataForm1.p_vouchdateend = this.endOfToday
            this.chartListday = []
            this.dataListLoading = true
            api.vProductXiDqAll1(this.dataForm1).then(res => {
                this.dataListday = res
                // this.dataListday = this.dataListday.filter(item => item.productClassPname !== '其它');

                const sumMap = new Map();
                // 遍历原数组，将 box 值相加  
                this.dataListday.forEach(item => {
                    if (sumMap.has(item.orgname)) {
                        sumMap.set(item.orgname, sumMap.get(item.orgname) + item.box);
                    } else {
                        sumMap.set(item.orgname, item.box);
                    }
                });
                // 创建修改后的数组  
                this.dataListday = this.dataListday.map(item => ({
                    ...item, // 保留原对象的字段  
                    sum: sumMap.get(item.orgname) // 添加新字段 sum  
                }));
                this.dataListLoading = false




                const currData = this.dataListday.map(item => {
                    // 确定新的属性名 
                    let newFieldName;
                    switch (item.productClassPname) {
                        case "低温系列":
                            newFieldName = "lowSeriesday";
                            break;
                        case "常温系列":
                            newFieldName = "NorSeriesday";
                            break;
                        case "果汁系列":
                            newFieldName = "FruitSeriesday";
                            break;
                        case "椰子牛乳系列":
                            newFieldName = "YzSeriesday";
                            break;
                        case "椰子汁系列":
                            newFieldName = "YzzSeriesday";
                            break;
                        case "其它":
                            newFieldName = "QtSeriesday";
                            break;
                        default:
                            newFieldName = "boxday"; // 如果没有匹配的项，保持原字段名 
                    }

                    // 创建一个新的对象，使用新字段名并保留原 box 值 
                    return {
                        [newFieldName]: item.box, // 使用动态属性名 
                        orgname: item.orgname,
                        productClassPname: item.productClassPname,
                        sumday: item.sum
                    };
                });
                // console.log(currData, 122233)

                this.mergedDataListday = currData.reduce((acc, item) => {
                    // 查找已存在的对象
                    let existingOrg = acc.find(org => org.orgname === item.orgname);

                    if (existingOrg) {
                        // 如果找到了，合并当前对象的字段 
                        Object.assign(existingOrg, item); // 将 item 的字段合并到 
                        existingOrg
                    } else {
                        // 如果没有找到，将当前对象添加到数组 
                        acc.push({ ...item }); // 使用展开运算符复制当前对象 
                    }

                    return acc; // 返回累加器
                }, []);
                this.mergedDataListday = this.mergedDataListday.map(item => {
                    // 检查 orgname 是否为 "合计"  
                    if (item.orgname === "合计") {
                        return {
                            ...item,
                            sumday: item.boxday, // 将 box 的值赋给 
                            box: undefined // 删除原来的 box 字段 
                        };
                    }
                    return item; // 返回原对象
                });


                // 指定需要累加的字段
                const fieldsToSum = ['FruitSeriesday', 'NorSeriesday', 'QtSeriesday', 'YzSeriesday', 'YzzSeriesday', 'lowSeriesday', 'sumday'];

                // 使用 reduce 方法计算合计
                const total = this.mergedDataListday.reduce((acc, obj) => {
                    fieldsToSum.forEach(field => {
                        acc[field] = (acc[field] || 0) + (obj[field] || 0);
                    });
                    return acc;
                }, {});

                // 创建合计对象
                const totalObject = { orgname: "合计", ...total };

                // 将合计对象添加到原数组中
                this.mergedDataListday.push(totalObject);


                //预设的分类数据
                const data = ['低温系列', '常温系列', '果汁系列', '椰子牛乳系列', '椰子汁系列', '其它'];

                // 根据 orgname 分组
                const groupedData = {};
                this.dataList.forEach(item => {
                    if (!groupedData[item.orgname]) {
                        groupedData[item.orgname] = []; // 初始化为空数组 
                    }
                    groupedData[item.orgname].push(item); // 添加对象到对应的组
                });
                // console.log( 'groupedData', groupedData)


                // 检查每组，并添加缺失的分类
                for (const orgname in groupedData) {
                    const items = groupedData[orgname];
                    // 提取现有的 productClassPname 
                    const existingPnames = new Set(items.map(item => item.productClassPname));

                    // 将原有数据添加到 this.chartList 中 
                    this.chartList.push(...items);

                    // 检查 data 中每个分类是否存在 
                    data.forEach(pname => {
                        if (!existingPnames.has(pname)) {
                            // 如果不存在，新增一个对象，box 为0，其余字段相同 
                            this.chartListday.push({ productClassPname: pname, box: 0, orgname: orgname });
                        }
                    });
                }


                // 输出结果
                console.log(this.mergedDataListday, 'day999');
                this.getDataList()

            })
        },

        getDataList() {
            this.chartList = []
            this.dataListLoading = true
            api.vProductXiDqAll1(this.dataForm).then(res => {
                this.dataList = res
                // this.dataList = this.dataList.filter(item => item.productClassPname !== '其它');
                const sumMap = new Map();
                // 遍历原数组，将 box 值相加  
                this.dataList.forEach(item => {
                    if (sumMap.has(item.orgname)) {
                        sumMap.set(item.orgname, sumMap.get(item.orgname) + item.box);
                    } else {
                        sumMap.set(item.orgname, item.box);
                    }
                });
                // 创建修改后的数组  
                this.dataList = this.dataList.map(item => ({
                    ...item, // 保留原对象的字段  
                    sum: sumMap.get(item.orgname) // 添加新字段 sum  
                }));
                this.dataListLoading = false

                // console.log(this.dataList, 122233)


                const currData = this.dataList.map(item => {
                    // 确定新的属性名 
                    let newFieldName;
                    switch (item.productClassPname) {
                        case "低温系列":
                            newFieldName = "lowSeries";
                            break;
                        case "常温系列":
                            newFieldName = "NorSeries";
                            break;
                        case "果汁系列":
                            newFieldName = "FruitSeries";
                            break;
                        case "椰子牛乳系列":
                            newFieldName = "YzSeries";
                            break;
                        case "椰子汁系列":
                            newFieldName = "YzzSeries";
                            break;
                        case "其它":
                            newFieldName = "QtSeries";
                            break;
                        default:
                            newFieldName = "box"; // 如果没有匹配的项，保持原字段名 
                    }

                    // 创建一个新的对象，使用新字段名并保留原 box 值 
                    return {
                        [newFieldName]: item.box, // 使用动态属性名 
                        orgname: item.orgname,
                        productClassPname: item.productClassPname,
                        sum: item.sum
                    };
                });

                this.mergedDataList = currData.reduce((acc, item) => {
                    // 查找已存在的对象
                    let existingOrg = acc.find(org => org.orgname === item.orgname);

                    if (existingOrg) {
                        // 如果找到了，合并当前对象的字段 
                        Object.assign(existingOrg, item); // 将 item 的字段合并到 
                        existingOrg
                    } else {
                        // 如果没有找到，将当前对象添加到数组 
                        acc.push({ ...item }); // 使用展开运算符复制当前对象 
                    }

                    return acc; // 返回累加器
                }, []);
                this.mergedDataList = this.mergedDataList.map(item => {
                    // 检查 orgname 是否为 "合计"  
                    if (item.orgname === "合计") {
                        return {
                            ...item,
                            sum: item.box, // 将 box 的值赋给 
                            box: undefined // 删除原来的 box 字段 
                        };
                    }
                    return item; // 返回原对象
                });

                // 指定需要累加的字段
                const fieldsToSum = ['FruitSeries', 'NorSeries', 'QtSeries', 'YzSeries', 'YzzSeries', 'lowSeries', 'sum'];

                // 使用 reduce 方法计算合计
                const total = this.mergedDataList.reduce((acc, obj) => {
                    fieldsToSum.forEach(field => {
                        acc[field] = (acc[field] || 0) + (obj[field] || 0);
                    });
                    return acc;
                }, {});

                // 创建合计对象
                const totalObject = { orgname: "合计", ...total };

                // 将合计对象添加到原数组中
                this.mergedDataList.push(totalObject);


                //预设的分类数据
                const data = ['低温系列', '常温系列', '果汁系列', '椰子牛乳系列', '椰子汁系列', '其它'];

                // 根据 orgname 分组
                const groupedData = {};
                this.dataList.forEach(item => {
                    if (!groupedData[item.orgname]) {
                        groupedData[item.orgname] = []; // 初始化为空数组 
                    }
                    groupedData[item.orgname].push(item); // 添加对象到对应的组
                });
                // console.log( 'groupedData', groupedData)


                // 检查每组，并添加缺失的分类
                for (const orgname in groupedData) {
                    const items = groupedData[orgname];
                    // console.log('titems', items);
                    // 提取现有的 productClassPname 
                    const existingPnames = new Set(items.map(item => item.productClassPname));

                    // 将原有数据添加到 this.chartList 中 
                    this.chartList.push(...items);

                    // 检查 data 中每个分类是否存在 
                    data.forEach(pname => {
                        if (!existingPnames.has(pname)) {
                            // 如果不存在，新增一个对象，box 为0，其余字段相同 
                            this.chartList.push({ productClassPname: pname, box: 0, orgname: orgname });
                        }
                    });
                }
                // 使用 reduce 合并数组
                this.mergedDataListall = this.mergedDataListday.map(item2 => {
                    const matchingItem = this.mergedDataList.find(item1 => item1.orgname === item2.orgname);
                    return {
                        ...item2,
                        ...(matchingItem || {}) // 如果找到匹配项则合并，不找到则不合并 
                    };
                });

                //处理 array1 中未在 array2 中出现的对象
                this.mergedDataList.forEach(item1 => {
                    if (!this.mergedDataListday.some(item2 => item2.orgname === item1.orgname)) {
                        this.mergedDataListall.push(item1);
                    }
                });
                this.mergedDataListall = this.mergedDataListall.filter(item => item.orgname !== "合计").concat(this.mergedDataListall.filter(item => item.orgname === "合计"));
                // // 输出结果
                // const levelOrder = [
                //     '',
                //     '营销一部',
                //     '营销二部',
                //     '营销三部',
                //     '营销四部',
                //     '营销五部',
                //     '营销六部',
                //     '营销七部',
                //     '营销八部',
                //     '大客户部'
                // ];

                // // 创建一个映射表，将 orgname 对应到其在 levelOrder 中的索引  
                // const orderMap = {};
                // levelOrder.forEach((name, index) => {
                //     orderMap[name] = index;
                // });

                // // 按照 levelOrder 的顺序对组织进行排序  
                // this.mergedDataListall.sort((a, b) => {
                //     return (orderMap[a.orgname] || Infinity) - (orderMap[b.orgname] || Infinity);
                // });



                console.log(this.mergedDataListall, 'mergedDataListall');
                this.initChart()
                this.initChart1()
                this.initChart2()
                this.initChart3()
                this.initChart4()
                this.initChart5()
                this.initChart6()
                this.initChart7()
                this.initChart8()
                this.initChart9()


            })
        },
        initChart9() {

            const orgNames = [...new Set(this.mergedDataListall.filter(item => item.orgname !== '合计').map(item => item.orgname))];

            const sumNames = [...new Set(this.mergedDataListall.filter(item => item.orgname !== '合计').map(item => item.sum))];

            const dayNames = [...new Set(this.mergedDataListall.filter(item => item.orgname !== '合计').map(item => item.sumday))];

            // 初始化 ECharts 实例 
            this.myChart = echarts.init(this.$refs.chart9);
            // 配置项 
            const option = {
                tooltip: {},
                legend: {
                    data: ['今日数据', '累计数据']
                },
                xAxis: {
                    type: 'category',
                    data: sumNames[6],
                    axisLine: {
                        show: false //关闭 x轴的主轴线 
                    },
                    splitLine: {
                        show: false //关闭 x轴的分隔线 
                    }
                },
                yAxis: {
                    type: 'value',
                    axisLine: {
                        show: false //关闭 x轴的主轴线 
                    },
                    splitLine: {
                        show: false //关闭 x轴的分隔线 
                    }
                },
                series: [
                    {
                        type: 'gauge',
                        min: 0,
                        max: 800000,
                        axisLabel: {
                            fontSize: 8,
                        },
                        anchor: {
                            show: true,
                            showAbove: true,
                            size: 18,
                            itemStyle: {
                                color: '#FAC858'
                            }
                        },
                        pointer: {
                            icon: 'path://M2.9,0.7L2.9,0.7c1.4,0,2.6,1.2,2.6,2.6v115c0,1.4-1.2,2.6-2.6,2.6l0,0c-1.4,0-2.6-1.2-2.6-2.6V3.3C0.3,1.9,1.4,0.7,2.9,0.7z',
                            width: 8,
                            length: '80%',
                            offsetCenter: [0, '8%']
                        },
                        progress: {
                            show: true,
                            overlap: true,
                            roundCap: true
                        },
                        axisLine: {
                            roundCap: true
                        },
                        title: {
                            fontSize: 8,
                            offsetCenter: ['-30%', '95%'],
                            formatter: orgNames[9]
                        },
                        detail: {
                            width: 20,
                            height: 14,
                            fontSize: 8,
                            color: '#fff',
                            backgroundColor: 'inherit',
                            offsetCenter: ['-30%', '75%'],
                            borderRadius: 3,
                            formatter: '{value}'
                        },
                        data: [
                            {
                                value: sumNames[9] || 0,
                                name: '累计数据'
                            }
                        ]
                    },
                    {
                        type: 'gauge',
                        min: 0,
                        max: 800000,
                        axisLabel: {
                            fontSize: 8,
                        },
                        anchor: {
                            show: true,
                            showAbove: true,
                            size: 18,
                            itemStyle: {
                                color: '#FF6F61'
                            }
                        },
                        pointer: {
                            icon: 'path://M2.9,0.7L2.9,0.7c1.4,0,2.6,1.2,2.6,2.6v115c0,1.4-1.2,2.6-2.6,2.6l0,0c-1.4,0-2.6-1.2-2.6-2.6V3.3C0.3,1.9,1.4,0.7,2.9,0.7z',
                            width: 8,
                            length: '80%',
                            offsetCenter: [0, '-8%']
                        },
                        progress: {
                            show: true,
                            overlap: true,
                            roundCap: true
                        },
                        axisLine: {
                            roundCap: true
                        },
                        title: {
                            fontSize: 8,
                            offsetCenter: ['30%', '95%'],
                            formatter: '当月累计'
                        },
                        detail: {
                            width: 20,
                            height: 14,
                            fontSize: 8,
                            color: '#fff',
                            backgroundColor: 'inherit',
                            borderRadius: 3,
                            formatter: '{value}',
                            offsetCenter: ['30%', '75%'],
                        },
                        data: [
                            {
                                value: dayNames[9] || 0,
                                name: '今日数据'
                            }
                        ]
                    }
                ],

                graphic: [
                    {
                        type: 'text',
                        left: 'center',
                        top: '90%', // 可以根据需要调整位置 
                        name: orgNames[9],
                        style: {
                            text: orgNames[9], // 显示 orgNames[5]  
                            textAlign: 'center',
                            fill: '#0EA06F', // 文本颜色 
                            font: '16px Microsoft YaHei' // 字体样式 
                        },
                        onclick: function () {
                            console.log(orgNames[9]); // 打印 orgNames[4]  
                        }
                    }
                ],
            };

            // 使用刚指定的配置项和数据显示图表 
            this.myChart.setOption(option);
            // this.myChart.on('click', (params) => {
            //     console.log('点击的横坐标名字:', params);
            this.myChart.on('click', (params) => {
                console.log('点击的横坐标名字:', params.name);
                this.$router.push({
                    path: '/proSalesALL/SalesRatefgs',
                    query: {
                        param1: params.name,
                        enddata: this.dataForm.p_vouchdateend,
                        startdate: this.dataForm.p_vouchdatestart
                    }
                });



            });




            // });


        },
        initChart8() {

            const orgNames = [...new Set(this.mergedDataListall.filter(item => item.orgname !== '合计').map(item => item.orgname))];

            const sumNames = [...new Set(this.mergedDataListall.filter(item => item.orgname !== '合计').map(item => item.sum))];

            const dayNames = [...new Set(this.mergedDataListall.filter(item => item.orgname !== '合计').map(item => item.sumday))];

            // 初始化 ECharts 实例 
            this.myChart = echarts.init(this.$refs.chart8);
            // 配置项 
            const option = {
                tooltip: {},
                legend: {
                    data: ['今日数据', '累计数据']
                },
                xAxis: {
                    type: 'category',
                    data: sumNames[6],
                    axisLine: {
                        show: false //关闭 x轴的主轴线 
                    },
                    splitLine: {
                        show: false //关闭 x轴的分隔线 
                    }
                },
                yAxis: {
                    type: 'value',
                    axisLine: {
                        show: false //关闭 x轴的主轴线 
                    },
                    splitLine: {
                        show: false //关闭 x轴的分隔线 
                    }
                },
                series: [
                    {
                        type: 'gauge',
                        min: 0,
                        max: 800000,
                        axisLabel: {
                            fontSize: 8,
                        },
                        anchor: {
                            show: true,
                            showAbove: true,
                            size: 18,
                            itemStyle: {
                                color: '#FAC858'
                            }
                        },
                        pointer: {
                            icon: 'path://M2.9,0.7L2.9,0.7c1.4,0,2.6,1.2,2.6,2.6v115c0,1.4-1.2,2.6-2.6,2.6l0,0c-1.4,0-2.6-1.2-2.6-2.6V3.3C0.3,1.9,1.4,0.7,2.9,0.7z',
                            width: 8,
                            length: '80%',
                            offsetCenter: [0, '8%']
                        },
                        progress: {
                            show: true,
                            overlap: true,
                            roundCap: true
                        },
                        axisLine: {
                            roundCap: true
                        },
                        title: {
                            fontSize: 8,
                            offsetCenter: ['-30%', '95%'],
                            formatter: orgNames[8]
                        },
                        detail: {
                            width: 20,
                            height: 14,
                            fontSize: 8,
                            color: '#fff',
                            backgroundColor: 'inherit',
                            offsetCenter: ['-30%', '75%'],
                            borderRadius: 3,
                            formatter: '{value}'
                        },
                        data: [
                            {
                                value: sumNames[8] || 0,
                                name: '累计数据'
                            }
                        ]
                    },
                    {
                        type: 'gauge',
                        min: 0,
                        max: 800000,
                        axisLabel: {
                            fontSize: 8,
                        },
                        anchor: {
                            show: true,
                            showAbove: true,
                            size: 18,
                            itemStyle: {
                                color: '#FF6F61'
                            }
                        },
                        pointer: {
                            icon: 'path://M2.9,0.7L2.9,0.7c1.4,0,2.6,1.2,2.6,2.6v115c0,1.4-1.2,2.6-2.6,2.6l0,0c-1.4,0-2.6-1.2-2.6-2.6V3.3C0.3,1.9,1.4,0.7,2.9,0.7z',
                            width: 8,
                            length: '80%',
                            offsetCenter: [0, '-8%']
                        },
                        progress: {
                            show: true,
                            overlap: true,
                            roundCap: true
                        },
                        axisLine: {
                            roundCap: true
                        },
                        title: {
                            fontSize: 8,
                            offsetCenter: ['30%', '95%'],
                            formatter: '当月累计'
                        },
                        detail: {
                            width: 20,
                            height: 14,
                            fontSize: 8,
                            color: '#fff',
                            backgroundColor: 'inherit',
                            borderRadius: 3,
                            formatter: '{value}',
                            offsetCenter: ['30%', '75%'],
                        },
                        data: [
                            {
                                value: dayNames[8] || 0,
                                name: '今日数据'
                            }
                        ]
                    }
                ],

                graphic: [
                    {
                        type: 'text',
                        left: 'center',
                        top: '90%', // 可以根据需要调整位置 
                        name: orgNames[8],
                        style: {
                            text: orgNames[8], // 显示 orgNames[5]  
                            textAlign: 'center',
                            fill: '#0EA06F', // 文本颜色 
                            font: '16px Microsoft YaHei' // 字体样式 
                        },
                        onclick: function () {
                            console.log(orgNames[8]); // 打印 orgNames[4]  
                        }
                    }
                ],
            };

            // 使用刚指定的配置项和数据显示图表 
            this.myChart.setOption(option);
            // this.myChart.on('click', (params) => {
            //     console.log('点击的横坐标名字:', params);
            this.myChart.on('click', (params) => {
                console.log('点击的横坐标名字:', params.name);
                this.$router.push({
                    path: '/proSalesALL/SalesRatefgs',
                    query: {
                        param1: params.name,
                        enddata: this.dataForm.p_vouchdateend,
                        startdate: this.dataForm.p_vouchdatestart
                    }
                });



            });




            // });


        },

        initChart7() {

            const orgNames = [...new Set(this.mergedDataListall.filter(item => item.orgname !== '合计').map(item => item.orgname))];

            const sumNames = [...new Set(this.mergedDataListall.filter(item => item.orgname !== '合计').map(item => item.sum))];

            const dayNames = [...new Set(this.mergedDataListall.filter(item => item.orgname !== '合计').map(item => item.sumday))];

            // 初始化 ECharts 实例 
            this.myChart = echarts.init(this.$refs.chart7);
            // 配置项 
            const option = {
                tooltip: {},
                legend: {
                    data: ['今日数据', '累计数据']
                },
                xAxis: {
                    type: 'category',
                    data: sumNames[6],
                    axisLine: {
                        show: false //关闭 x轴的主轴线 
                    },
                    splitLine: {
                        show: false //关闭 x轴的分隔线 
                    }
                },
                yAxis: {
                    type: 'value',
                    axisLine: {
                        show: false //关闭 x轴的主轴线 
                    },
                    splitLine: {
                        show: false //关闭 x轴的分隔线 
                    }
                },
                series: [
                    {
                        type: 'gauge',
                        min: 0,
                        max: 800000,
                        axisLabel: {
                            fontSize: 8,
                        },
                        anchor: {
                            show: true,
                            showAbove: true,
                            size: 18,
                            itemStyle: {
                                color: '#FAC858'
                            }
                        },
                        pointer: {
                            icon: 'path://M2.9,0.7L2.9,0.7c1.4,0,2.6,1.2,2.6,2.6v115c0,1.4-1.2,2.6-2.6,2.6l0,0c-1.4,0-2.6-1.2-2.6-2.6V3.3C0.3,1.9,1.4,0.7,2.9,0.7z',
                            width: 8,
                            length: '80%',
                            offsetCenter: [0, '8%']
                        },
                        progress: {
                            show: true,
                            overlap: true,
                            roundCap: true
                        },
                        axisLine: {
                            roundCap: true
                        },
                        title: {
                            fontSize: 8,
                            offsetCenter: ['-30%', '95%'],
                            formatter: orgNames[7]
                        },
                        detail: {
                            width: 20,
                            height: 14,
                            fontSize: 8,
                            color: '#fff',
                            backgroundColor: 'inherit',
                            offsetCenter: ['-30%', '75%'],
                            borderRadius: 3,
                            formatter: '{value}'
                        },
                        data: [
                            {
                                value: sumNames[7] || 0,
                                name: '累计数据'
                            }
                        ]
                    },
                    {
                        type: 'gauge',
                        min: 0,
                        max: 800000,
                        axisLabel: {
                            fontSize: 8,
                        },
                        anchor: {
                            show: true,
                            showAbove: true,
                            size: 18,
                            itemStyle: {
                                color: '#FF6F61'
                            }
                        },
                        pointer: {
                            icon: 'path://M2.9,0.7L2.9,0.7c1.4,0,2.6,1.2,2.6,2.6v115c0,1.4-1.2,2.6-2.6,2.6l0,0c-1.4,0-2.6-1.2-2.6-2.6V3.3C0.3,1.9,1.4,0.7,2.9,0.7z',
                            width: 8,
                            length: '80%',
                            offsetCenter: [0, '-8%']
                        },
                        progress: {
                            show: true,
                            overlap: true,
                            roundCap: true
                        },
                        axisLine: {
                            roundCap: true
                        },
                        title: {
                            fontSize: 8,
                            offsetCenter: ['30%', '95%'],
                            formatter: '当月累计'
                        },
                        detail: {
                            width: 20,
                            height: 14,
                            fontSize: 8,
                            color: '#fff',
                            backgroundColor: 'inherit',
                            borderRadius: 3,
                            formatter: '{value}',
                            offsetCenter: ['30%', '75%'],
                        },
                        data: [
                            {
                                value: dayNames[7] || 0,
                                name: '今日数据'
                            }
                        ]
                    }
                ],

                graphic: [
                    {
                        type: 'text',
                        left: 'center',
                        top: '90%', // 可以根据需要调整位置 
                        name: orgNames[7],
                        style: {
                            text: orgNames[7], // 显示 orgNames[5]  
                            textAlign: 'center',
                            fill: '#0EA06F', // 文本颜色 
                            font: '16px Microsoft YaHei' // 字体样式 
                        },
                        onclick: function () {
                            console.log(orgNames[7]); // 打印 orgNames[4]  
                        }
                    }
                ],
            };

            // 使用刚指定的配置项和数据显示图表 
            this.myChart.setOption(option);
            // this.myChart.on('click', (params) => {
            //     console.log('点击的横坐标名字:', params);
            this.myChart.on('click', (params) => {
                console.log('点击的横坐标名字:', params.name);
                this.$router.push({
                    path: '/proSalesALL/SalesRatefgs',
                    query: {
                        param1: params.name,
                        enddata: this.dataForm.p_vouchdateend,
                        startdate: this.dataForm.p_vouchdatestart
                    }
                });



            });




            // });


        },
        initChart6() {

            const orgNames = [...new Set(this.mergedDataListall.filter(item => item.orgname !== '合计').map(item => item.orgname))];

            const sumNames = [...new Set(this.mergedDataListall.filter(item => item.orgname !== '合计').map(item => item.sum))];

            const dayNames = [...new Set(this.mergedDataListall.filter(item => item.orgname !== '合计').map(item => item.sumday))];

            // 初始化 ECharts 实例 
            this.myChart = echarts.init(this.$refs.chart6);
            // 配置项 
            const option = {
                tooltip: {},
                legend: {
                    data: ['今日数据', '累计数据']
                },
                xAxis: {
                    type: 'category',
                    data: sumNames[6],
                    axisLine: {
                        show: false //关闭 x轴的主轴线 
                    },
                    splitLine: {
                        show: false //关闭 x轴的分隔线 
                    }
                },
                yAxis: {
                    type: 'value',
                    axisLine: {
                        show: false //关闭 x轴的主轴线 
                    },
                    splitLine: {
                        show: false //关闭 x轴的分隔线 
                    }
                },
                series: [
                    {
                        type: 'gauge',
                        min: 0,
                        max: 800000,
                        axisLabel: {
                            fontSize: 8,
                        },
                        anchor: {
                            show: true,
                            showAbove: true,
                            size: 18,
                            itemStyle: {
                                color: '#FAC858'
                            }
                        },
                        pointer: {
                            icon: 'path://M2.9,0.7L2.9,0.7c1.4,0,2.6,1.2,2.6,2.6v115c0,1.4-1.2,2.6-2.6,2.6l0,0c-1.4,0-2.6-1.2-2.6-2.6V3.3C0.3,1.9,1.4,0.7,2.9,0.7z',
                            width: 8,
                            length: '80%',
                            offsetCenter: [0, '8%']
                        },
                        progress: {
                            show: true,
                            overlap: true,
                            roundCap: true
                        },
                        axisLine: {
                            roundCap: true
                        },
                        title: {
                            fontSize: 8,
                            offsetCenter: ['-30%', '95%'],
                            formatter: orgNames[6]
                        },
                        detail: {
                            width: 20,
                            height: 14,
                            fontSize: 8,
                            color: '#fff',
                            backgroundColor: 'inherit',
                            offsetCenter: ['-30%', '75%'],
                            borderRadius: 3,
                            formatter: '{value}'
                        },
                        data: [
                            {
                                value: sumNames[6] || 0,
                                name: '累计数据'
                            }
                        ]
                    },
                    {
                        type: 'gauge',
                        min: 0,
                        max: 800000,
                        axisLabel: {
                            fontSize: 8,
                        },
                        anchor: {
                            show: true,
                            showAbove: true,
                            size: 18,
                            itemStyle: {
                                color: '#FF6F61'
                            }
                        },
                        pointer: {
                            icon: 'path://M2.9,0.7L2.9,0.7c1.4,0,2.6,1.2,2.6,2.6v115c0,1.4-1.2,2.6-2.6,2.6l0,0c-1.4,0-2.6-1.2-2.6-2.6V3.3C0.3,1.9,1.4,0.7,2.9,0.7z',
                            width: 8,
                            length: '80%',
                            offsetCenter: [0, '-8%']
                        },
                        progress: {
                            show: true,
                            overlap: true,
                            roundCap: true
                        },
                        axisLine: {
                            roundCap: true
                        },
                        title: {
                            fontSize: 8,
                            offsetCenter: ['30%', '95%'],
                            formatter: '当月累计'
                        },
                        detail: {
                            width: 20,
                            height: 14,
                            fontSize: 8,
                            color: '#fff',
                            backgroundColor: 'inherit',
                            borderRadius: 3,
                            formatter: '{value}',
                            offsetCenter: ['30%', '75%'],
                        },
                        data: [
                            {
                                value: dayNames[6] || 0,
                                name: '今日数据'
                            }
                        ]
                    }
                ],

                graphic: [
                    {
                        type: 'text',
                        left: 'center',
                        top: '90%', // 可以根据需要调整位置 
                        name: orgNames[6],
                        style: {
                            text: orgNames[6], // 显示 orgNames[5]  
                            textAlign: 'center',
                            fill: '#0EA06F', // 文本颜色 
                            font: '16px Microsoft YaHei' // 字体样式 
                        },
                        onclick: function () {
                            console.log(orgNames[6]); // 打印 orgNames[4]  
                        }
                    }
                ],
            };

            // 使用刚指定的配置项和数据显示图表 
            this.myChart.setOption(option);
            // this.myChart.on('click', (params) => {
            //     console.log('点击的横坐标名字:', params);
            this.myChart.on('click', (params) => {
                console.log('点击的横坐标名字:', params.name);
                this.$router.push({
                    path: '/proSalesALL/SalesRatefgs',
                    query: {
                        param1: params.name,
                        enddata: this.dataForm.p_vouchdateend,
                        startdate: this.dataForm.p_vouchdatestart
                    }
                });



            });




            // });


        },
        initChart5() {

            const orgNames = [...new Set(this.mergedDataListall.filter(item => item.orgname !== '合计').map(item => item.orgname))];

            const sumNames = [...new Set(this.mergedDataListall.filter(item => item.orgname !== '合计').map(item => item.sum))];

            const dayNames = [...new Set(this.mergedDataListall.filter(item => item.orgname !== '合计').map(item => item.sumday))];

            // 初始化 ECharts 实例 
            this.myChart = echarts.init(this.$refs.chart5);
            // 配置项 
            const option = {
                tooltip: {},
                legend: {
                    data: ['今日数据', '累计数据']
                },
                xAxis: {
                    type: 'category',
                    data: sumNames[5],
                    axisLine: {
                        show: false //关闭 x轴的主轴线 
                    },
                    splitLine: {
                        show: false //关闭 x轴的分隔线 
                    }
                },
                yAxis: {
                    type: 'value',
                    axisLine: {
                        show: false //关闭 x轴的主轴线 
                    },
                    splitLine: {
                        show: false //关闭 x轴的分隔线 
                    }
                },
                series: [
                    {
                        type: 'gauge',
                        min: 0,
                        max: 800000,
                        axisLabel: {
                            fontSize: 8,
                        },
                        anchor: {
                            show: true,
                            showAbove: true,
                            size: 18,
                            itemStyle: {
                                color: '#FAC858'
                            }
                        },
                        pointer: {
                            icon: 'path://M2.9,0.7L2.9,0.7c1.4,0,2.6,1.2,2.6,2.6v115c0,1.4-1.2,2.6-2.6,2.6l0,0c-1.4,0-2.6-1.2-2.6-2.6V3.3C0.3,1.9,1.4,0.7,2.9,0.7z',
                            width: 8,
                            length: '80%',
                            offsetCenter: [0, '8%']
                        },
                        progress: {
                            show: true,
                            overlap: true,
                            roundCap: true
                        },
                        axisLine: {
                            roundCap: true
                        },
                        title: {
                            fontSize: 8,
                            offsetCenter: ['-30%', '95%'],
                            formatter: orgNames[5]
                        },
                        detail: {
                            width: 20,
                            height: 14,
                            fontSize: 8,
                            color: '#fff',
                            backgroundColor: 'inherit',
                            offsetCenter: ['-30%', '75%'],
                            borderRadius: 3,
                            formatter: '{value}'
                        },
                        data: [
                            {
                                value: sumNames[5] || 0,
                                name: '累计数据'
                            }
                        ]
                    },
                    {
                        type: 'gauge',
                        min: 0,
                        max: 800000,
                        axisLabel: {
                            fontSize: 8,
                        },
                        anchor: {
                            show: true,
                            showAbove: true,
                            size: 18,
                            itemStyle: {
                                color: '#FF6F61'
                            }
                        },
                        pointer: {
                            icon: 'path://M2.9,0.7L2.9,0.7c1.4,0,2.6,1.2,2.6,2.6v115c0,1.4-1.2,2.6-2.6,2.6l0,0c-1.4,0-2.6-1.2-2.6-2.6V3.3C0.3,1.9,1.4,0.7,2.9,0.7z',
                            width: 8,
                            length: '80%',
                            offsetCenter: [0, '-8%']
                        },
                        progress: {
                            show: true,
                            overlap: true,
                            roundCap: true
                        },
                        axisLine: {
                            roundCap: true
                        },
                        title: {
                            fontSize: 8,
                            offsetCenter: ['30%', '95%'],
                            formatter: '当月累计'
                        },
                        detail: {
                            width: 20,
                            height: 14,
                            fontSize: 8,
                            color: '#fff',
                            backgroundColor: 'inherit',
                            borderRadius: 3,
                            formatter: '{value}',
                            offsetCenter: ['30%', '75%'],
                        },
                        data: [
                            {
                                value: dayNames[5] || 0,
                                name: '今日数据'
                            }
                        ]
                    }
                ],

                graphic: [
                    {
                        type: 'text',
                        left: 'center',
                        top: '90%', // 可以根据需要调整位置 
                        name: orgNames[5],
                        style: {
                            text: orgNames[5], // 显示 orgNames[5]  
                            textAlign: 'center',
                            fill: '#0EA06F', // 文本颜色 
                            font: '16px Microsoft YaHei' // 字体样式 
                        },
                        onclick: function () {
                            console.log(orgNames[5]); // 打印 orgNames[4]  
                        }
                    }
                ],
            };

            // 使用刚指定的配置项和数据显示图表 
            this.myChart.setOption(option);
            // this.myChart.on('click', (params) => {
            //     console.log('点击的横坐标名字:', params);
            this.myChart.on('click', (params) => {
                console.log('点击的横坐标名字:', params.name);
                this.$router.push({
                    path: '/proSalesALL/SalesRatefgs',
                    query: {
                        param1: params.name,
                        enddata: this.dataForm.p_vouchdateend,
                        startdate: this.dataForm.p_vouchdatestart
                    }
                });



            });




            // });


        },
        initChart4() {

            const orgNames = [...new Set(this.mergedDataListall.filter(item => item.orgname !== '合计').map(item => item.orgname))];

            const sumNames = [...new Set(this.mergedDataListall.filter(item => item.orgname !== '合计').map(item => item.sum))];

            const dayNames = [...new Set(this.mergedDataListall.filter(item => item.orgname !== '合计').map(item => item.sumday))];


            console.log(orgNames, sumNames, dayNames)


            // 初始化 ECharts 实例 
            this.myChart = echarts.init(this.$refs.chart4);
            // 配置项 
            const option = {
                tooltip: {},
                legend: {
                    data: ['今日数据', '日总']
                },
                xAxis: {
                    type: 'category',
                    data: sumNames[4],
                    axisLine: {
                        show: false //关闭 x轴的主轴线 
                    },
                    splitLine: {
                        show: false //关闭 x轴的分隔线 
                    }
                },
                yAxis: {
                    type: 'value',
                    axisLine: {
                        show: false //关闭 x轴的主轴线 
                    },
                    splitLine: {
                        show: false //关闭 x轴的分隔线 
                    }
                },
                series: [
                    {
                        type: 'gauge',
                        min: 0,
                        max: 800000,
                        axisLabel: {
                            fontSize: 8,
                        },
                        anchor: {
                            show: true,
                            showAbove: true,
                            size: 18,
                            itemStyle: {
                                color: '#FAC858'
                            }
                        },
                        pointer: {
                            icon: 'path://M2.9,0.7L2.9,0.7c1.4,0,2.6,1.2,2.6,2.6v115c0,1.4-1.2,2.6-2.6,2.6l0,0c-1.4,0-2.6-1.2-2.6-2.6V3.3C0.3,1.9,1.4,0.7,2.9,0.7z',
                            width: 8,
                            length: '80%',
                            offsetCenter: [0, '8%']
                        },
                        progress: {
                            show: true,
                            overlap: true,
                            roundCap: true
                        },
                        axisLine: {
                            roundCap: true
                        },
                        title: {
                            fontSize: 8,
                            offsetCenter: ['-30%', '95%'],
                            formatter: orgNames[4]
                        },
                        detail: {
                            width: 20,
                            height: 14,
                            fontSize: 8,
                            color: '#fff',
                            backgroundColor: 'inherit',
                            offsetCenter: ['-30%', '75%'],
                            borderRadius: 3,
                            formatter: '{value}'
                        },
                        data: [
                            {
                                value: sumNames[4] || 0,
                                name: '累计数据'
                            }
                        ]
                    },
                    {
                        type: 'gauge',
                        min: 0,
                        max: 800000,
                        axisLabel: {
                            fontSize: 8,
                        },
                        anchor: {
                            show: true,
                            showAbove: true,
                            size: 18,
                            itemStyle: {
                                color: '#FF6F61'
                            }
                        },
                        pointer: {
                            icon: 'path://M2.9,0.7L2.9,0.7c1.4,0,2.6,1.2,2.6,2.6v115c0,1.4-1.2,2.6-2.6,2.6l0,0c-1.4,0-2.6-1.2-2.6-2.6V3.3C0.3,1.9,1.4,0.7,2.9,0.7z',
                            width: 8,
                            length: '80%',
                            offsetCenter: [0, '-8%']
                        },
                        progress: {
                            show: true,
                            overlap: true,
                            roundCap: true
                        },
                        axisLine: {
                            roundCap: true
                        },
                        title: {
                            fontSize: 8,
                            offsetCenter: ['30%', '95%'],
                            formatter: '当月累计'
                        },
                        detail: {
                            width: 20,
                            height: 14,
                            fontSize: 8,
                            color: '#fff',
                            backgroundColor: 'inherit',
                            borderRadius: 3,
                            formatter: '{value}',
                            offsetCenter: ['30%', '75%'],
                        },
                        data: [
                            {
                                value: dayNames[4] || 0,
                                name: '今日数据'
                            }
                        ]
                    }
                ],

                graphic: [
                    {
                        type: 'text',
                        left: 'center',
                        top: '90%', // 可以根据需要调整位置 
                        name: orgNames[4],
                        style: {
                            text: orgNames[4], // 显示 orgNames[5]  
                            textAlign: 'center',
                            fill: '#0EA06F', // 文本颜色 
                            font: '16px Microsoft YaHei' // 字体样式 
                        },
                        onclick: function () {
                            console.log(orgNames[4]); // 打印 orgNames[4]  
                        }
                    }
                ],
            };

            // 使用刚指定的配置项和数据显示图表 
            this.myChart.setOption(option);
            this.myChart.on('click', (params) => {
                console.log('点击的横坐标名字:', params.name);
                this.$router.push({
                    path: '/proSalesALL/SalesRatefgs',
                    query: {
                        param1: params.name,
                        enddata: this.dataForm.p_vouchdateend,
                        startdate: this.dataForm.p_vouchdatestart
                    }
                });



            });


        },
        initChart3() {

            const orgNames = [...new Set(this.mergedDataListall.filter(item => item.orgname !== '合计').map(item => item.orgname))];

            const sumNames = [...new Set(this.mergedDataListall.filter(item => item.orgname !== '合计').map(item => item.sum))];

            const dayNames = [...new Set(this.mergedDataListall.filter(item => item.orgname !== '合计').map(item => item.sumday))];


            // console.log(orgNames[0], sumNames[0], dayNames[0])


            // 初始化 ECharts 实例 
            this.myChart = echarts.init(this.$refs.chart3);
            // 配置项 
            const option = {
                tooltip: {},
                legend: {
                    data: ['今日数据', '日总']
                },
                xAxis: {
                    type: 'category',
                    data: sumNames[3],
                    axisLine: {
                        show: false //关闭 x轴的主轴线 
                    },
                    splitLine: {
                        show: false //关闭 x轴的分隔线 
                    }
                },
                yAxis: {
                    type: 'value',
                    axisLine: {
                        show: false //关闭 x轴的主轴线 
                    },
                    splitLine: {
                        show: false //关闭 x轴的分隔线 
                    }
                },
                series: [
                    {
                        type: 'gauge',
                        min: 0,
                        max: 800000,
                        axisLabel: {
                            fontSize: 8,
                        },
                        anchor: {
                            show: true,
                            showAbove: true,
                            size: 18,
                            itemStyle: {
                                color: '#FAC858'
                            }
                        },
                        pointer: {
                            icon: 'path://M2.9,0.7L2.9,0.7c1.4,0,2.6,1.2,2.6,2.6v115c0,1.4-1.2,2.6-2.6,2.6l0,0c-1.4,0-2.6-1.2-2.6-2.6V3.3C0.3,1.9,1.4,0.7,2.9,0.7z',
                            width: 8,
                            length: '80%',
                            offsetCenter: [0, '8%']
                        },
                        progress: {
                            show: true,
                            overlap: true,
                            roundCap: true
                        },
                        axisLine: {
                            roundCap: true
                        },
                        title: {
                            fontSize: 8,
                            offsetCenter: ['-30%', '95%'],
                            formatter: orgNames[3]
                        },
                        detail: {
                            width: 20,
                            height: 14,
                            fontSize: 8,
                            color: '#fff',
                            backgroundColor: 'inherit',
                            offsetCenter: ['-30%', '75%'],
                            borderRadius: 3,
                            formatter: '{value}'
                        },
                        data: [
                            {
                                value: sumNames[3] || 0,
                                name: '累计数据'
                            }
                        ]
                    },
                    {
                        type: 'gauge',
                        min: 0,
                        max: 800000,
                        axisLabel: {
                            fontSize: 8,
                        },
                        anchor: {
                            show: true,
                            showAbove: true,
                            size: 18,
                            itemStyle: {
                                color: '#FF6F61'
                            }
                        },
                        pointer: {
                            icon: 'path://M2.9,0.7L2.9,0.7c1.4,0,2.6,1.2,2.6,2.6v115c0,1.4-1.2,2.6-2.6,2.6l0,0c-1.4,0-2.6-1.2-2.6-2.6V3.3C0.3,1.9,1.4,0.7,2.9,0.7z',
                            width: 8,
                            length: '80%',
                            offsetCenter: [0, '-8%']
                        },
                        progress: {
                            show: true,
                            overlap: true,
                            roundCap: true
                        },
                        axisLine: {
                            roundCap: true
                        },
                        title: {
                            fontSize: 8,
                            offsetCenter: ['30%', '95%'],
                            formatter: '当月累计'
                        },
                        detail: {
                            width: 20,
                            height: 14,
                            fontSize: 8,
                            color: '#fff',
                            backgroundColor: 'inherit',
                            borderRadius: 3,
                            formatter: '{value}',
                            offsetCenter: ['30%', '75%'],
                        },
                        data: [
                            {
                                value: dayNames[3] || 0,
                                name: '今日数据'
                            }
                        ]
                    }
                ],

                graphic: [
                    {
                        type: 'text',
                        left: 'center',
                        top: '90%', // 可以根据需要调整位置 
                        name: orgNames[3],
                        style: {
                            text: orgNames[3], // 显示 orgNames[5]  
                            textAlign: 'center',
                            fill: '#0EA06F', // 文本颜色 
                            font: '16px Microsoft YaHei' // 字体样式 
                        },
                        onclick: function () {
                            console.log(orgNames[3]); // 打印 orgNames[4]  
                        }
                    }
                ],
            };

            // 使用刚指定的配置项和数据显示图表 
            this.myChart.setOption(option);
            this.myChart.on('click', (params) => {
                console.log('点击的横坐标名字:', params.name);
                this.$router.push({
                    path: '/proSalesALL/SalesRatefgs',
                    query: {
                        param1: params.name,
                        enddata: this.dataForm.p_vouchdateend,
                        startdate: this.dataForm.p_vouchdatestart
                    }
                });



            });


        },
        initChart2() {

            const orgNames = [...new Set(this.mergedDataListall.filter(item => item.orgname !== '合计').map(item => item.orgname))];

            const sumNames = [...new Set(this.mergedDataListall.filter(item => item.orgname !== '合计').map(item => item.sum))];

            const dayNames = [...new Set(this.mergedDataListall.filter(item => item.orgname !== '合计').map(item => item.sumday))];


            // console.log(orgNames[0], sumNames[0], dayNames[0])


            // 初始化 ECharts 实例 
            this.myChart = echarts.init(this.$refs.chart2);
            // 配置项 
            const option = {
                tooltip: {},
                legend: {
                    data: ['今日数据', '日总']
                },
                xAxis: {
                    type: 'category',
                    data: sumNames[2],
                    axisLine: {
                        show: false //关闭 x轴的主轴线 
                    },
                    splitLine: {
                        show: false //关闭 x轴的分隔线 
                    }
                },
                yAxis: {
                    type: 'value',
                    axisLine: {
                        show: false //关闭 x轴的主轴线 
                    },
                    splitLine: {
                        show: false //关闭 x轴的分隔线 
                    }
                },
                series: [
                    {
                        type: 'gauge',
                        min: 0,
                        max: 800000,
                        axisLabel: {
                            fontSize: 8,
                        },
                        anchor: {
                            show: true,
                            showAbove: true,
                            size: 18,
                            itemStyle: {
                                color: '#FAC858'
                            }
                        },
                        pointer: {
                            icon: 'path://M2.9,0.7L2.9,0.7c1.4,0,2.6,1.2,2.6,2.6v115c0,1.4-1.2,2.6-2.6,2.6l0,0c-1.4,0-2.6-1.2-2.6-2.6V3.3C0.3,1.9,1.4,0.7,2.9,0.7z',
                            width: 8,
                            length: '80%',
                            offsetCenter: [0, '8%']
                        },
                        progress: {
                            show: true,
                            overlap: true,
                            roundCap: true
                        },
                        axisLine: {
                            roundCap: true
                        },
                        title: {
                            fontSize: 8,
                            offsetCenter: ['-30%', '95%'],
                            formatter: orgNames[2]
                        },
                        detail: {
                            width: 20,
                            height: 14,
                            fontSize: 8,
                            color: '#fff',
                            backgroundColor: 'inherit',
                            offsetCenter: ['-30%', '75%'],
                            borderRadius: 3,
                            formatter: '{value}'
                        },
                        data: [
                            {
                                value: sumNames[2] || 0,
                                name: '累计数据'
                            }
                        ]
                    },
                    {
                        type: 'gauge',
                        min: 0,
                        max: 800000,
                        axisLabel: {
                            fontSize: 8,
                        },
                        anchor: {
                            show: true,
                            showAbove: true,
                            size: 18,
                            itemStyle: {
                                color: '#FF6F61'
                            }
                        },
                        pointer: {
                            icon: 'path://M2.9,0.7L2.9,0.7c1.4,0,2.6,1.2,2.6,2.6v115c0,1.4-1.2,2.6-2.6,2.6l0,0c-1.4,0-2.6-1.2-2.6-2.6V3.3C0.3,1.9,1.4,0.7,2.9,0.7z',
                            width: 8,
                            length: '80%',
                            offsetCenter: [0, '-8%']
                        },
                        progress: {
                            show: true,
                            overlap: true,
                            roundCap: true
                        },
                        axisLine: {
                            roundCap: true
                        },
                        title: {
                            fontSize: 8,
                            offsetCenter: ['30%', '95%'],
                            formatter: '当月累计'
                        },
                        detail: {
                            width: 20,
                            height: 14,
                            fontSize: 8,
                            color: '#fff',
                            backgroundColor: 'inherit',
                            borderRadius: 3,
                            formatter: '{value}',
                            offsetCenter: ['30%', '75%'],
                        },
                        data: [
                            {
                                value: dayNames[2] || 0,
                                name: '今日数据'
                            }
                        ]
                    }
                ],

                graphic: [
                    {
                        type: 'text',
                        left: 'center',
                        top: '90%', // 可以根据需要调整位置 
                        name: orgNames[2],
                        style: {
                            text: orgNames[2], // 显示 orgNames[5]  
                            textAlign: 'center',
                            fill: '#0EA06F', // 文本颜色 
                            font: '16px Microsoft YaHei' // 字体样式 
                        },
                        onclick: function () {
                            console.log(orgNames[2]); // 打印 orgNames[4]  
                        }
                    }
                ],
            };

            // 使用刚指定的配置项和数据显示图表 
            this.myChart.setOption(option);
            this.myChart.on('click', (params) => {
                console.log('点击的横坐标名字:', params.name);
                this.$router.push({
                    path: '/proSalesALL/SalesRatefgs',
                    query: {
                        param1: params.name,
                        enddata: this.dataForm.p_vouchdateend,
                        startdate: this.dataForm.p_vouchdatestart
                    }
                });



            });


        },
        initChart1() {

            const orgNames = [...new Set(this.mergedDataListall.filter(item => item.orgname !== '合计').map(item => item.orgname))];

            const sumNames = [...new Set(this.mergedDataListall.filter(item => item.orgname !== '合计').map(item => item.sum))];

            const dayNames = [...new Set(this.mergedDataListall.filter(item => item.orgname !== '合计').map(item => item.sumday))];


            // console.log(orgNames[0], sumNames[0], dayNames[0])


            // 初始化 ECharts 实例 
            this.myChart = echarts.init(this.$refs.chart1);
            // 配置项 
            const option = {
                tooltip: {},
                legend: {
                    data: ['今日数据', '日总']
                },
                xAxis: {
                    type: 'category',
                    data: sumNames[1],
                    axisLine: {
                        show: false //关闭 x轴的主轴线 
                    },
                    splitLine: {
                        show: false //关闭 x轴的分隔线 
                    }
                },
                yAxis: {
                    type: 'value',
                    axisLine: {
                        show: false //关闭 x轴的主轴线 
                    },
                    splitLine: {
                        show: false //关闭 x轴的分隔线 
                    }
                },
                series: [
                    {
                        type: 'gauge',
                        min: 0,
                        max: 800000,
                        axisLabel: {
                            fontSize: 8,
                        },
                        anchor: {
                            show: true,
                            showAbove: true,
                            size: 18,
                            itemStyle: {
                                color: '#FAC858'
                            }
                        },
                        pointer: {
                            icon: 'path://M2.9,0.7L2.9,0.7c1.4,0,2.6,1.2,2.6,2.6v115c0,1.4-1.2,2.6-2.6,2.6l0,0c-1.4,0-2.6-1.2-2.6-2.6V3.3C0.3,1.9,1.4,0.7,2.9,0.7z',
                            width: 8,
                            length: '80%',
                            offsetCenter: [0, '8%']
                        },
                        progress: {
                            show: true,
                            overlap: true,
                            roundCap: true
                        },
                        axisLine: {
                            roundCap: true
                        },
                        title: {
                            fontSize: 8,
                            offsetCenter: ['-30%', '95%'],
                            formatter: orgNames[1]
                        },
                        detail: {
                            width: 20,
                            height: 14,
                            fontSize: 8,
                            color: '#fff',
                            backgroundColor: 'inherit',
                            offsetCenter: ['-30%', '75%'],
                            borderRadius: 3,
                            formatter: '{value}'
                        },
                        data: [
                            {
                                value: sumNames[1] || 0,
                                name: '累计数据'
                            }
                        ]
                    },
                    {
                        type: 'gauge',
                        min: 0,
                        max: 800000,
                        axisLabel: {
                            fontSize: 8,
                        },
                        anchor: {
                            show: true,
                            showAbove: true,
                            size: 18,
                            itemStyle: {
                                color: '#FF6F61'
                            }
                        },
                        pointer: {
                            icon: 'path://M2.9,0.7L2.9,0.7c1.4,0,2.6,1.2,2.6,2.6v115c0,1.4-1.2,2.6-2.6,2.6l0,0c-1.4,0-2.6-1.2-2.6-2.6V3.3C0.3,1.9,1.4,0.7,2.9,0.7z',
                            width: 8,
                            length: '80%',
                            offsetCenter: [0, '-8%']
                        },
                        progress: {
                            show: true,
                            overlap: true,
                            roundCap: true
                        },
                        axisLine: {
                            roundCap: true
                        },
                        title: {
                            fontSize: 8,
                            offsetCenter: ['30%', '95%'],
                            formatter: '当月累计'
                        },
                        detail: {
                            width: 20,
                            height: 14,
                            fontSize: 8,
                            color: '#fff',
                            backgroundColor: 'inherit',
                            borderRadius: 3,
                            formatter: '{value}',
                            offsetCenter: ['30%', '75%'],
                        },
                        data: [
                            {
                                value: dayNames[1] || 0,
                                name: '今日数据'
                            }
                        ]
                    }
                ],

                graphic: [
                    {
                        type: 'text',
                        left: 'center',
                        top: '90%', // 可以根据需要调整位置 
                        name: orgNames[1],
                        style: {
                            text: orgNames[1], // 显示 orgNames[5]  
                            textAlign: 'center',
                            fill: '#0EA06F', // 文本颜色 
                            font: '16px Microsoft YaHei' // 字体样式 
                        },
                        onclick: function () {
                            console.log(orgNames[1]); // 打印 orgNames[4]  
                        }
                    }
                ],
            };

            // 使用刚指定的配置项和数据显示图表 
            this.myChart.setOption(option);
            this.myChart.on('click', (params) => {
                console.log('点击的横坐标名字:', params.name);
                this.$router.push({
                    path: '/proSalesALL/SalesRatefgs',
                    query: {
                        param1: params.name,
                        enddata: this.dataForm.p_vouchdateend,
                        startdate: this.dataForm.p_vouchdatestart
                    }
                });



            });


        },
        initChart() {

            const orgNames = [...new Set(this.mergedDataListall.filter(item => item.orgname !== '合计').map(item => item.orgname))];

            const sumNames = [...new Set(this.mergedDataListall.filter(item => item.orgname !== '合计').map(item => item.sum))];

            const dayNames = [...new Set(this.mergedDataListall.filter(item => item.orgname !== '合计').map(item => item.sumday))];


            // console.log(orgNames[0], sumNames[0], dayNames[0])


            // 初始化 ECharts 实例 
            this.myChart = echarts.init(this.$refs.chart);
            // 配置项 
            const option = {
                tooltip: {},
                legend: {
                    data: ['今日数据', '日总']
                },
                xAxis: {
                    type: 'category',
                    data: sumNames[0],
                    axisLine: {
                        show: false //关闭 x轴的主轴线 
                    },
                    splitLine: {
                        show: false //关闭 x轴的分隔线 
                    }
                },
                yAxis: {
                    type: 'value',
                    axisLine: {
                        show: false //关闭 x轴的主轴线 
                    },
                    splitLine: {
                        show: false //关闭 x轴的分隔线 
                    }
                },
                series: [
                    {
                        type: 'gauge',
                        min: 0,
                        max: 800000,
                        axisLabel: {
                            fontSize: 8,
                        },
                        anchor: {
                            show: true,
                            showAbove: true,
                            size: 18,
                            itemStyle: {
                                color: '#FAC858'
                            }
                        },
                        pointer: {
                            icon: 'path://M2.9,0.7L2.9,0.7c1.4,0,2.6,1.2,2.6,2.6v115c0,1.4-1.2,2.6-2.6,2.6l0,0c-1.4,0-2.6-1.2-2.6-2.6V3.3C0.3,1.9,1.4,0.7,2.9,0.7z',
                            width: 8,
                            length: '80%',
                            offsetCenter: [0, '8%']
                        },
                        progress: {
                            show: true,
                            overlap: true,
                            roundCap: true
                        },
                        axisLine: {
                            roundCap: true
                        },
                        title: {
                            fontSize: 8,
                            offsetCenter: ['-30%', '95%'],
                            formatter: orgNames[0]
                        },
                        detail: {
                            width: 20,
                            height: 14,
                            fontSize: 8,
                            color: '#fff',
                            backgroundColor: 'inherit',
                            offsetCenter: ['-30%', '75%'],
                            borderRadius: 3,
                            formatter: '{value}'
                        },
                        data: [
                            {
                                value: sumNames[0] || 0,
                                name: '累计数据'
                            }
                        ]
                    },
                    {
                        type: 'gauge',
                        min: 0,
                        max: 800000,
                        axisLabel: {
                            fontSize: 8,
                        },
                        anchor: {
                            show: true,
                            showAbove: true,
                            size: 18,
                            itemStyle: {
                                color: '#FF6F61'
                            }
                        },
                        pointer: {
                            icon: 'path://M2.9,0.7L2.9,0.7c1.4,0,2.6,1.2,2.6,2.6v115c0,1.4-1.2,2.6-2.6,2.6l0,0c-1.4,0-2.6-1.2-2.6-2.6V3.3C0.3,1.9,1.4,0.7,2.9,0.7z',
                            width: 8,
                            length: '80%',
                            offsetCenter: [0, '-8%']
                        },
                        progress: {
                            show: true,
                            overlap: true,
                            roundCap: true
                        },
                        axisLine: {
                            roundCap: true
                        },
                        title: {
                            fontSize: 8,
                            offsetCenter: ['30%', '95%'],
                            formatter: '当月累计'
                        },
                        detail: {
                            width: 20,
                            height: 14,
                            fontSize: 8,
                            color: '#fff',
                            backgroundColor: 'inherit',
                            borderRadius: 3,
                            formatter: '{value}',
                            offsetCenter: ['30%', '75%'],
                        },
                        data: [
                            {
                                value: dayNames[0] || 0,
                                name: orgNames[0]
                            }
                        ]
                    }
                ],

                graphic: [
                    {
                        type: 'text',
                        left: 'center',
                        top: '90%', // 可以根据需要调整位置 
                        name: orgNames[0],
                        style: {
                            text: orgNames[0], // 显示 orgNames[5]  
                            textAlign: 'center',
                            fill: '#0EA06F', // 文本颜色 
                            font: '16px Microsoft YaHei' // 字体样式 
                        },
                    }
                ],
            };

            // 使用刚指定的配置项和数据显示图表 
            this.myChart.setOption(option);
            this.myChart.on('click', (params) => {
                console.log('点击的横坐标名字:', params.name);
                this.$router.push({
                    path: '/proSalesALL/SalesRatefgs',
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
    padding: 2px !important;

}

;

::v-deep th.el-table__cell>.cell {
    padding: 0px !important;
}

;

::v-deep .el-table__header-wrapper {
    font-size: 13px;
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