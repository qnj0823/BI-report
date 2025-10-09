<template>
    <div>
        <yxbbtn v-if="addOrUpdateVisible" ref="addOrUpdate" @string1Sent="updateString1" @string2Sent="updateString2"
            @close="addOrUpdateVisible = false" @requestBillList="getBIlllist"></yxbbtn>
        <div class="body">
            <div class="head">
                <el-button v-show="btnshow" class="filter-item" size="mini" type="success" icon="el-icon-search"
                    @click="getALLlist" style="position: absolute; z-index: 1000; margin-top: 1%;">选择战区/销售区域</el-button>
                <div class="title">
                    <div class="title-left"></div>
                    <div class="title-value"><label>{{ this.rujobs }}数据看板</label></div>

                    <div class="title-right"></div>
                </div>
            </div>
            <div class="content">
                <div class="layout layout-left-top" id="chartContainer">
                    <div class="panel border-all">
                        <div class="title"><label>业务跟踪</label></div>
                        <div id="yugzmain" class="chart"></div>
                        <div class="border-foot"></div>
                    </div>
                </div>
                <div class="layout layout-left-center" id="chartContainer1">
                    <div class="panel border-all">
                        <div class="title"><label>产品销量</label></div>
                        <div id="sqSINglemian" class="chart"></div>
                        <div class="border-foot"></div>
                    </div>
                </div>
                <div class="layout layout-left-bottom">
                    <div class="panel border-all">
                        <div class="title"><label>常温/果汁/椰子汁销量</label></div>
                        <div id="cwyzzmain"></div>
                        <div class="border-foot"></div>
                    </div>
                </div>
                <div class="layout layout-center-top">
                    <div class="panel border-all">
                        <div class="title"><label>实时订单</label></div>
                        <div ref="map" id="map" class="chart"></div>
                        <div class=" number">
                            <div class="digit">0</div>
                            <div class="digit">0</div>
                            <div class="digit">0</div>
                            <div class="digit">0</div>
                            <div class="digit">0</div>
                            <div class="digit">0</div>
                        </div>
                        <table class="table" id="myTable">
                            <thead>
                                <tr id="headerRow" style="font-size: 8px;color: yellow; text-align: center;">
                                    <!-- 动态表头数据将插入在此 -->
                                </tr>
                            </thead>
                            <tbody id="tableBody" style="font-size: 8px;color: yellow; text-align: center;">
                                <!-- 动态表体数据将插入在此 -->
                            </tbody>
                        </table>
                        <div class="border-foot"></div>
                    </div>
                </div>
                <div class="layout layout-center-bottom">
                    <div class="panel border-all">
                        <div class="title"><label>低温前十排名</label></div>
                        <div id="lowTenmain" class="chart"></div>
                        <div class="border-foot"></div>
                    </div>
                </div>
                <div class="layout layout-right-top">
                    <div class="panel border-all" @click="ddpcbtn()">
                        <div class="title"><label>订单频次数量</label></div>
                        <!--<div id="Orderfreqmain" class="chart"></div>-->
                        <div id="tableContainer" @mouseover="stopScroll" @mouseout="autoScroll">
                            <table class="table1">
                                <thead>
                                    <tr>
                                        <th>分公司/办事处</th>
                                        <th>站点</th>
                                        <th>数量</th>
                                        <th>频次</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="item in rateList">
                                        <td>{{ item.iParentName }}</td>
                                        <td>{{ item.cSiteName }}</td>
                                        <td>{{ item.box }}</td>
                                        <td>{{ item.count }}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div class="border-foot"></div>
                    </div>
                </div>
                <div class="layout layout-right-bottom">
                    <div class="panel border-all">
                        <div class="title"><label>低温后十排名</label></div>
                        <div id="backTenmain" class="chart"></div>
                        <div class="border-foot"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import yxbbtn from './buttonVue'
import * as echarts from 'echarts';
import * as api from '@/api/DQAPI/dqallApi.js'
import {
    mapGetters,
} from 'vuex'
export default {
    components: {
        yxbbtn
    },
    data() {
        return {
            ruid: '',
            rudepts: '',
            rujobs: '',
            rujobs1: '',
            btnshow: false,
            addOrUpdateVisible: false,
            receivedString1: '',//战区
            receivedString2: '',//省区
            rateList: [],
            scrollInterval: null,
            scrollSpeed: 1, // 每次滚动的步长  
            scrollTop: 0, // 当前滚动位置  
            cityList: []
        };
    },
    computed: {
        ...mapGetters(['id', 'dept', 'jobs'])
    },
    mounted() {
        if (this.id != '') {
            sessionStorage.setItem('id', this.id);
        }
        if (this.dept != '') {
            sessionStorage.setItem('Busdept', this.dept);
        }
        this.rudepts = sessionStorage.getItem('Busdept');
        if (this.jobs != '') {
            sessionStorage.setItem('Busjobs', this.jobs);
        }
        this.rujobs = sessionStorage.getItem('Busjobs');

        if (this.rujobs == '全部') {
            this.btnshow = true
            this.rudepts = sessionStorage.getItem('yxb');
            this.rujobs = sessionStorage.getItem('sf');
        }

        // if (this.$route.query.param1) {
        //     this.rudepts = this.$route.query.param1;
        //     this.rujobs = this.$route.query.param2;
        // }


        this.ywgzDQ()
        this.sqsinglefn()
        this.oldnewDQ()
        this.lowtop10()
        this.backtop10()
        this.csdt()
        // this.initMap()
        this.getinitMap()

        this.rateFrequ()// 组件挂载后调用获取数据的函数  
        // this.autoScroll()

    },
    methods: {
        updateString1(string1) {
            this.receivedString1 = string1;
            sessionStorage.setItem('yxb', this.receivedString1);
        },
        updateString2(string2) {
            this.receivedString2 = string2;
            sessionStorage.setItem('sf', this.receivedString2);
        },
        getALLlist() {
            this.addOrUpdateVisible = true
            this.$nextTick(() => {
                this.$refs.addOrUpdate.init()
            })


        },
        getBIlllist() {
            console.log(1122, this.receivedString1, this.receivedString2)
            this.rudepts = this.receivedString1
            this.rujobs = this.receivedString2
            this.ywgzDQ()
            this.sqsinglefn()
            this.oldnewDQ()
            this.lowtop10()
            this.backtop10()
            this.csdt()
            this.initMap()
            this.rateFrequ()// 组件挂载后调用获取数据的函数  
            // this.autoScroll()// 启动自动滚动  
        },
        //业务跟踪
        ywgzDQ() {
            const currentDate1 = new Date();
            const year1 = currentDate1.getFullYear();
            const month1 = String(currentDate1.getMonth() + 1).padStart(2, '0'); // 月份从0开始，所以加1  
            const day1 = String(currentDate1.getDate()).padStart(2, '0');
            const formattedDate1 = `${year1}-${month1}-${day1 - 1}`;
            const today = new Date();
            const startOfMonthDate = new Date(today.getFullYear(), today.getMonth(), 1);

            const year = startOfMonthDate.getFullYear();
            const month = String(startOfMonthDate.getMonth() + 1).padStart(2, '0'); // 月份从0开始，所以加1 
            const day = String(startOfMonthDate.getDate()).padStart(2, '0');
            const startData = `${year}-${month}-${day}`;
            console.log(formattedDate1)

            fetch(
                `http://bi.yufanjtbip.com:8069/api/subcompanyreport/get_pro_product_ncc_order_sq_rate_net?p_orgname=${this.rujobs}&p_vouchdatestart=${startData}&p_vouchdateend=${formattedDate1}`
            )
                .then(response => {
                    if (!response.ok) {
                        throw new Error('网络响应失败');
                    }
                    return response.json(); // 解析 JSON 数据   
                })
                .then(data => {
                    // 数据验证  
                    console.log('获取数据：', data);
                    data.sort((a, b) => {
                        return b.ratio - a.ratio; // 从高到低排序  
                    });
                    data.forEach(item => {
                        item.sqname = item.sqname.replace(/\d+/g, '').trim()
                        item.box = Number(item.box).toFixed(0)
                        item.curbox = Number(item.curbox).toFixed(0)
                        item.goalvalue = Number(item.goalvalue || 0).toFixed(0)
                        item.ratio = Number(item.ratio || 0);
                    })
                    const firstFiveObjects = data.slice(0, 5);
                    console.log(firstFiveObjects)
                    this.drawywgzChart(firstFiveObjects)
                })
                .catch(error => {
                    console.error('请求数据时出现错误:', error);
                });
        },

        // 绘制柱状图  
        drawywgzChart(result) {
            const myChart = echarts.init(document.getElementById('yugzmain'));
            const chartContainer = document.getElementById('chartContainer');

            const companynames = result.map(item => item.companyname);
            const goalvalues = result.map(item => item.goalvalue);
            const boxs = result.map(item => item.box);
            const curboxs = result.map(item => item.curbox);
            const lastboxs = result.map(item => item.lastbox);

            // Modify the ratios array to convert to percentage  
            const ratios = result.map(item => (item.ratio * 100).toFixed(2)); // Convert to percentage and format  

            const option = {
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'cross'
                    },
                    formatter: function (params) {
                        let tooltipHtml = `<strong>${params[0].name}</strong><br/>`;
                        params.forEach(item => {
                            if (item.seriesType === 'bar') {
                                tooltipHtml +=
                                    `${item.seriesName}: ${item.value}<br/>`; // Display bar data  
                            } else if (item.seriesType === 'line') {
                                tooltipHtml += `比例: ${item.value}%<br/>`; // Display percentage  
                            }
                        });
                        return tooltipHtml;
                    }
                },
                legend: {
                    data: ['当月目标', '当月销量', '当天报单', '上月销量', '环比'],
                    itemWidth: 14, // 设置图例项的宽度  
                    itemHeight: 10, // 设置图例项的高度 
                    textStyle: {
                        color: 'yellow',
                        fontSize: 10
                    },
                    // orient: 'horizontal',
                    // right: 20, // 距离右边10像素  
                    top: 10 // 距离上边10像素  
                },
                xAxis: {
                    type: 'category',
                    data: companynames,
                    axisLabel: {
                        interval: 0,
                        rotate: 5,
                        fontSize: 9,
                        color: '#ffffff',
                        fontFamily: 'SimSun',
                        fontWeight: 'lighter',
                        padding: [0, -25, 0, 0]// 上、右、下、左的 padding
                    }
                },
                yAxis: [{
                    type: 'value',

                    position: 'left',
                    axisLabel: {
                        textStyle: {
                            color: '#FFFFFF', // 修改 Y 轴字体颜色 
                            fontSize: 8 // 设置字体大小
                        }
                    }
                },
                {
                    type: 'value',

                    splitLine: {
                        show: false // 不显示网格线  
                    },
                    position: 'right',
                    axisLabel: {
                        textStyle: {
                            color: '#FFFFFF', // 修改 Y 轴字体颜色 
                            fontSize: 8 // 设置字体大小
                        }
                    }

                }
                ],
                series: [{
                    name: '当月目标',
                    type: 'bar',
                    data: goalvalues,
                    barWidth: '15%',
                    itemStyle: {
                        color: '#5793f3'
                    }
                },
                {
                    name: '当月销量',
                    type: 'bar',
                    data: boxs,
                    barWidth: '15%',
                    itemStyle: {
                        color: '#d14a61'
                    }
                },
                {
                    name: '上月销量',
                    type: 'bar',
                    data: lastboxs,
                    barWidth: '15%',
                    itemStyle: {
                        color: '#ff00ff'
                    }
                },
                {
                    name: '当天报单',
                    type: 'bar',
                    data: curboxs,
                    barWidth: '15%',
                    itemStyle: {
                        color: '#00ff00'
                    }
                },
                {
                    name: '环比',
                    type: 'line',
                    data: ratios,
                    label: {
                        show: true,
                        position: 'top',
                        fontSize: 10,
                        textStyle: {
                            color: '#FFFFFF',
                        },
                        formatter: function (params) {
                            return params.value + '%'; // Display as percentage  
                        }
                    },

                    lineStyle: {
                        color: '#675bba'
                    },
                    yAxisIndex: 1
                }
                ]
            };

            myChart.setOption(option);
            // Add responsive functionality  
            myChart.on('click', (params) => {
                console.log('点击的横坐标名字:', params.name);
                // window.open('http://bi.yufanjtbip.com:8059/#/changshaDQ/BusinessTrack')
                this.$router.push({
                    path: '/changshaDQ/BusinessTrack'
                });
            });

            // 使用 ResizeObserver 监听父元素的变化  
            const resizeObserver = new ResizeObserver(() => {
                myChart.resize(); // 调整图表大小  
            });

            // 开始观察父元素的大小变化  
            resizeObserver.observe(chartContainer);
        },
        //产品销量
        sqsinglefn() {
            const currentDate1 = new Date();
            const year1 = currentDate1.getFullYear();
            const month1 = String(currentDate1.getMonth() + 1).padStart(2, '0'); // 月份从0开始，所以加1  
            const day1 = String(currentDate1.getDate()).padStart(2, '0');
            const formattedDate1 = `${year1}-${month1}-${day1}`;
            const today = new Date();
            const startOfMonthDate = new Date(today.getFullYear(), today.getMonth(), 1);

            const year = startOfMonthDate.getFullYear();
            const month = String(startOfMonthDate.getMonth() + 1).padStart(2, '0'); // 月份从0开始，所以加1 
            const day = String(startOfMonthDate.getDate()).padStart(2, '0');
            const startData = `${year}-${month}-${day}`;
            fetch(
                `http://bi.yufanjtbip.com:8069/api/subcompanyreport/get_pro_product_one_sell_index_sq_ncc_net?p_orgname=${this.rujobs}&p_vouchdatestart=${startData}&p_vouchdateend=${formattedDate1}`
            )
                .then(response => {
                    if (!response.ok) {
                        throw new Error('网络响应失败');
                    }
                    return response.json(); //解析 JSON 数据 
                })
                .then(data => {
                    const sqsingle = data;
                    console.log('获取数据：', sqsingle);

                    // 计算box字段的总和，先将box字段转换为数字  
                    const totalBox = sqsingle.reduce((sum, obj) => sum + Number(obj.box), 0);

                    // 定义百分比值，例如10%  
                    const percentage = 0;

                    // 遍历数组，计算新的字段并加入到对象中  
                    const updatedData = sqsingle.map(obj => {
                        // 将box字段转换为数字并保留两位小数  
                        const boxValue = Number(obj.box).toFixed(0);

                        // 计算新的字段  
                        const newValue = (Number(boxValue) / totalBox) + (percentage / 100);

                        // 返回包含保留两位小数的box和带百分号的radio字段  
                        return {
                            ...obj,
                            box: boxValue, // box字段保留两位小数  
                            radio: `${(newValue * 100).toFixed(2)}%` // 新字段radio带百分号  
                        };
                    });

                    const filteredArray = updatedData.filter(item => item.box !== "0");
                    console.log(filteredArray, 999999);
                    filteredArray.sort((a, b) => b.box - a.box);
                    this.drawChart(filteredArray); // 绘制图表  
                })
        },

        // 绘制柱状图  
        drawChart(data) {
            const categories = data.map(item => item.product_class_pname); // 横坐标数据  
            const values = data.map(item => Number(item.box)); // 纵坐标数据  
            const radios = data.map(item => item.radio); // 百分比数据  

            // 基于准备好的dom，初始化echarts实例  
            const myChart = echarts.init(document.getElementById('sqSINglemian'));
            const chartContainer = document.getElementById('chartContainer1');

            // 指定图表的配置项和数据  
            const option = {

                tooltip: {
                    trigger: 'item',
                    formatter: (params) => {
                        return `${params.name}<br/>销量: ${params.value} <br/>占比: ${radios[params.dataIndex]}`;
                    }
                },
                xAxis: {
                    name: '',
                    type: 'category',
                    data: categories, // 横坐标数据 
                    axisLabel: {
                        interval: 0,
                        rotate: 20,
                        fontSize: 9,
                        color: '#ffffff',
                        fontFamily: 'SimSun',
                        fontWeight: 'lighter'
                    }
                },
                yAxis: {
                    type: 'value',
                    axisLabel: {
                        fontSize: 9,
                        color: '#ffffff',
                    },
                    // min: 0, // 设置 y 轴的最小值  
                    // max: 40000, // 设置 y 轴的最大值  
                    interval: 8000 // 设置刻度间隔（例如从0到100，显示5个刻度：0, 25, 50, 75, 100）   
                },
                barWidth: '50%',
                series: [{
                    name: '销量',
                    type: 'bar',
                    data: values, // 纵坐标数据  
                    barWidth: '15%',
                    itemStyle: {
                        color: '#ffb733' // 设置所有柱子的颜色  
                    },
                    label: {
                        show: true,
                        position: 'top',
                        color: 'yellow',
                        fontSize: 9,
                        formatter: (params) => {
                            const percentage = radios[params.dataIndex]; // 获取百分比  
                            return percentage === "0.00%" ? "" : percentage; // 如果是0.00%则返回空字符串，否则返回百分比  
                        }
                    }
                }]
            };

            // 使用制定的配置项和数据显示图表  
            myChart.setOption(option);
            myChart.on('click', (params) => {
                console.log('点击的横坐标名字:', params.name);
                // window.open('http://bi.yufanjtbip.com:8059/#/changshaDQ/SingleSalesDQ')
                this.$router.push({
                    path: '/changshaDQ/SingleSalesDQ'
                });
            });
            // 使用 ResizeObserver 监听父元素的变化  
            const resizeObserver = new ResizeObserver(() => {
                myChart.resize(); // 调整图表大小  
            });

            // 开始观察父元素的大小变化  
            resizeObserver.observe(chartContainer1);
        },
        //常温 -果汁-椰子汁
        oldnewDQ() {
            const currentDate1 = new Date();
            const year1 = currentDate1.getFullYear();
            const month1 = String(currentDate1.getMonth() + 1).padStart(2, '0'); // 月份从0开始，所以加1  
            const day1 = String(currentDate1.getDate()).padStart(2, '0');
            const formattedDate1 = `${year1}-${month1}-${day1 - 1}`;
            const today = new Date();
            const startOfMonthDate = new Date(today.getFullYear(), today.getMonth(), 1);

            const year = startOfMonthDate.getFullYear();
            const month = String(startOfMonthDate.getMonth() + 1).padStart(2, '0'); // 月份从0开始，所以加1 
            const day = String(startOfMonthDate.getDate()).padStart(2, '0');
            const startData = `${year}-${month}-${day}`;
            console.log(formattedDate1)

            fetch(
                `http://bi.yufanjtbip.com:8069/api/report/get_pro_project_team_product_xi_site_ncc_net?p_vouchdatestart=${startData}&p_vouchdateend=${formattedDate1}`
            )
                .then(response => {
                    if (!response.ok) {
                        throw new Error('网络响应失败');
                    }
                    return response.json(); // 解析 JSON 数据   
                })
                .then(data => {
                    // 数据验证  

                    const resut = data.filter(item => item.sqname === this.rujobs);
                    console.log('获取数据：', resut);

                    const categories = ["常温系列", "果汁系列", "椰子汁系列"];
                    const sums = { "常温系列": 0, "果汁系列": 0, "椰子汁系列": 0 };

                    // Sum the box values for the specified categories  
                    for (const item of resut) {
                        if (categories.includes(item.productClassPname)) {
                            sums[item.productClassPname] += item.box || 0; // Ensure to add 0 if box is undefined  
                        }
                    }

                    // Convert the sums object into an array of objects  
                    const resultArray = Object.keys(sums).map(key => ({
                        productClassPname: key,
                        box: sums[key],
                    }));

                    console.log(resultArray);
                    this.drawoldnewChart(resultArray)
                })
                .catch(error => {
                    console.error('请求数据时出现错误:', error);
                });
        },


        // 绘制柱状图  
        drawoldnewChart(data) {
            // 提取 y轴名称和对应的值 
            const names = data.map(item => item.productClassPname);
            const newboxes = data.map(item => item.box);
            //计算总值
            const total = newboxes.reduce((acc, value) => acc + value, 0);

            // 基于准备好的dom，初始化echarts实例  
            const myChart = echarts.init(document.getElementById('cwyzzmain'));

            // 配置图表选项
            const option = {
                tooltip: {
                    trigger: 'item',
                    formatter: '{a} <br/>{b}: {c} '
                },
                xAxis: {
                    type: 'value',
                    axisLabel: {
                        fontSize: 10,
                        color: '#ffffff',
                        fontFamily: 'SimSun',
                        fontWeight: 'lighter'
                    }
                },
                yAxis: {
                    type: 'category',
                    data: names, // 使用排序后的名称 
                    axisLabel: {
                        fontSize: 8,
                        color: '#ffffff',
                        fontFamily: 'SimSun',
                        fontWeight: 'lighter'
                    }
                },
                series: [{
                    name: '箱数',
                    type: 'bar',
                    data: newboxes, // 使用排序后的值 
                    itemStyle: {
                        color: '#32e600', // 今日订单量颜色  
                    },
                    barWidth: '30%',
                    label: {
                        show: true,
                        position: 'top',
                        fontSize: 11,
                        formatter: function (params) {
                            const percentage = (params.value !== 0 && total !== 0)
                                ? ((params.value / total) * 100).toFixed(2)
                                : 0; // If either value is 0, set percentage to 0  

                            return `${params.value}`;
                        },
                        offset: [40, 5],
                        textStyle: {
                            color: 'yellow', // 字体颜色  

                        },
                    },
                }]
            };

            // 使用制定的配置项和数据显示图表  
            myChart.setOption(option);
            myChart.on('click', (params) => {
                console.log('点击的横坐标名字:', params.name);
                // window.open('http://bi.yufanjtbip.com:8059/#/changshaDQ/nomalguozhi')
                this.$router.push({
                    path: '/changshaDQ/nomalguozhi'
                });
            });
            // 添加自适应功能
            // 使用 ResizeObserver 监听父元素的变化  
            const resizeObserver = new ResizeObserver(() => {
                myChart.resize(); // 调整图表大小  
            });

            // 开始观察父元素的大小变化  
            resizeObserver.observe(chartContainer);
        },
        //低温前十排名
        lowtop10() {
            const currentDate1 = new Date();
            const year1 = currentDate1.getFullYear();
            const month1 = String(currentDate1.getMonth() + 1).padStart(2, '0'); // 月份从0开始，所以加1  
            const day1 = String(currentDate1.getDate()).padStart(2, '0');
            const formattedDate1 = `${year1}-${month1}-${day1 - 1}`;
            const today = new Date();
            const startOfMonthDate = new Date(today.getFullYear(), today.getMonth(), 1);

            const year = startOfMonthDate.getFullYear();
            const month = String(startOfMonthDate.getMonth() + 1).padStart(2, '0'); // 月份从0开始，所以加1 
            const day = String(startOfMonthDate.getDate()).padStart(2, '0');
            const startData = `${year}-${month}-${day}`;
            console.log(formattedDate1)

            fetch(
                `http://bi.yufanjtbip.com:8069/api/subcompanyreport/get_pro_sub_company_low_temperature_net?p_orgname=${this.rujobs}&p_vouchdatestart=${startData}&p_vouchdateend=${formattedDate1}`
            )
                .then(response => {
                    if (!response.ok) {
                        throw new Error('网络响应失败');
                    }
                    return response.json(); // 解析 JSON 数据   
                })
                .then(data => {
                    // 数据验证  
                    // console.log('获取数据：', data);
                    const lowList = data
                    lowList.forEach(item => {
                        item.iParentName = item.iParentName.replace(/\d+/g, '').trim()
                        item.box = Number(item.box).toFixed(0)
                    })
                    lowList.sort((a, b) => Number(b.box) - Number(a.box));
                    const topTen = lowList.slice(0, 10);
                    console.log(topTen)
                    this.lowtenChart(topTen)
                })
                .catch(error => {
                    console.error('请求数据时出现错误:', error);
                });
        },


        lowtenChart(data) {
            const names = data.map(item => item.cSiteName);
            const boxs = data.map(item => Number(item.box)); // 确保为数字  

            const myChart = echarts.init(document.getElementById('lowTenmain'));

            const option = {
                tooltip: {
                    trigger: 'axis'
                },
                legend: {
                    data: ['数量'],
                    itemWidth: 14, // 设置图例项的宽度  
                    itemHeight: 10, // 设置图例项的高度 
                    textStyle: {
                        color: 'yellow',
                        fontSize: 10
                    },
                    orient: 'horizontal',
                    right: 10, // 距离右边10像素  
                    top: 10 // 距离上边10像素  
                },
                xAxis: {
                    type: 'category',
                    data: names,

                    axisLabel: {
                        interval: 0,
                        rotate: 30,
                        //padding: [0, -10, 0, 0],
                        fontSize: 10,
                        color: '#ffffff',
                        fontFamily: 'SimSun',
                        fontWeight: 'lighter'
                    }
                },
                yAxis: {
                    type: 'value',
                    axisLabel: {
                        textStyle: {
                            color: '#FFFFFF', // 修改 Y 轴字体颜色 
                            fontSize: 9 // 设置字体大小
                        }
                    }
                },
                series: [{
                    name: '数量',
                    type: 'bar',
                    data: boxs,
                    barWidth: '40%',

                    label: {
                        show: true,
                        position: 'top',
                        fontSize: 8,
                        offset: [0, 0],
                        textStyle: {
                            color: 'yellow',
                        }
                    },
                    emphasis: {
                        focus: 'series'
                    },
                    itemStyle: {
                        color: '#ffa500'
                    }
                }]
            };
            myChart.setOption(option);
            myChart.on('click', (params) => {
                console.log('点击的横坐标名字:', params.name);
                // window.open('http://bi.yufanjtbip.com:8059/#/changshaDQ/LowSiteTop')
                this.$router.push({
                    path: '/changshaDQ/LowSiteTop'
                });
            });
            // 添加自适应功能
            // 使用 ResizeObserver 监听父元素的变化  
            const resizeObserver = new ResizeObserver(() => {
                myChart.resize(); // 调整图表大小  
            });

            // 开始观察父元素的大小变化  
            resizeObserver.observe(chartContainer);
        },
        //低温后十排名
        backtop10() {
            const currentDate1 = new Date();
            const year1 = currentDate1.getFullYear();
            const month1 = String(currentDate1.getMonth() + 1).padStart(2, '0'); // 月份从0开始，所以加1  
            const day1 = String(currentDate1.getDate()).padStart(2, '0');
            const formattedDate1 = `${year1}-${month1}-${day1 - 1}`;
            const today = new Date();
            const startOfMonthDate = new Date(today.getFullYear(), today.getMonth(), 1);

            const year = startOfMonthDate.getFullYear();
            const month = String(startOfMonthDate.getMonth() + 1).padStart(2, '0'); // 月份从0开始，所以加1 
            const day = String(startOfMonthDate.getDate()).padStart(2, '0');
            const startData = `${year}-${month}-${day}`;
            console.log(formattedDate1)

            fetch(
                `http://bi.yufanjtbip.com:8069/api/subcompanyreport/get_pro_sub_company_low_temperature_net?p_orgname=${this.rujobs}&p_vouchdatestart=${startData}&p_vouchdateend=${formattedDate1}`
            )
                .then(response => {
                    if (!response.ok) {
                        throw new Error('网络响应失败');
                    }
                    return response.json(); // 解析 JSON 数据   
                })
                .then(data => {
                    // 数据验证  
                    // console.log('获取数据：', data);
                    const lowList = data
                    lowList.forEach(item => {
                        item.iParentName = item.iParentName.replace(/\d+/g, '').trim()
                        item.box = Number(item.box).toFixed(0)
                    })
                    lowList.sort((a, b) => Number(a.box) - Number(b.box));
                    const topTen = lowList.slice(0, 10);
                    console.log(topTen)
                    this.backtenChart(topTen)
                })
                .catch(error => {
                    console.error('请求数据时出现错误:', error);
                });
        },


        backtenChart(data) {
            const names = data.map(item => item.cSiteName);
            const boxs = data.map(item => Number(item.box)); // 确保为数字  

            const myChart = echarts.init(document.getElementById('backTenmain'));

            const option = {
                tooltip: {
                    trigger: 'axis'
                },
                legend: {
                    data: ['数量'],
                    itemWidth: 14, // 设置图例项的宽度  
                    itemHeight: 10, // 设置图例项的高度 
                    textStyle: {
                        color: 'yellow',
                        fontSize: 10
                    },
                    orient: 'horizontal',
                    right: 10, // 距离右边10像素  
                    top: 10 // 距离上边10像素  
                },
                xAxis: {
                    type: 'category',
                    data: names,
                    axisLabel: {
                        interval: 0,
                        rotate: 30,
                        fontSize: 10,
                        color: '#ffffff',
                        fontFamily: 'SimSun',
                        fontWeight: 'lighter'
                    }
                },
                yAxis: {
                    type: 'value',
                    axisLabel: {
                        textStyle: {
                            color: '#FFFFFF', // 修改 Y 轴字体颜色 
                            fontSize: 9 // 设置字体大小
                        }
                    }
                },
                series: [{
                    name: '数量',
                    type: 'bar',
                    data: boxs,
                    barWidth: '40%',
                    label: {
                        show: true,
                        position: 'top',
                        fontSize: 8,
                        offset: [0, 0],
                        textStyle: {
                            color: 'yellow',
                        }
                    },
                    emphasis: {
                        focus: 'series'
                    },
                    itemStyle: {
                        color: '#62f3d3'
                    }
                }]
            };
            myChart.setOption(option);
            myChart.on('click', (params) => {
                console.log('点击的横坐标名字:', params.name);
                // window.open('http://bi.yufanjtbip.com:8059/#/changshaDQ/LowSiteBack')
                this.$router.push({
                    path: '/changshaDQ/LowSiteBack'
                });
            });
            // 添加自适应功能
            // 使用 ResizeObserver 监听父元素的变化  
            const resizeObserver = new ResizeObserver(() => {
                myChart.resize(); // 调整图表大小  
            });

            // 开始观察父元素的大小变化  
            resizeObserver.observe(chartContainer);
        },
        //地图-实时订单
        csdt() {
            const currentDate1 = new Date();
            const year1 = currentDate1.getFullYear();
            const month1 = String(currentDate1.getMonth() + 1).padStart(2, '0'); // 月份从0开始，所以加1  
            const day1 = String(currentDate1.getDate()).padStart(2, '0');
            const formattedDate1 = `${year1}-${month1}-${day1}`;
            const today = new Date();
            const startOfMonthDate = new Date(today.getFullYear(), today.getMonth(), 1);

            const year = startOfMonthDate.getFullYear();
            const month = String(startOfMonthDate.getMonth() + 1).padStart(2, '0'); // 月份从0开始，所以加1 
            const day = String(startOfMonthDate.getDate()).padStart(2, '0');
            const startData = `${year}-${month}-${day}`;
            console.log(formattedDate1)

            fetch(
                `http://bi.yufanjtbip.com:8069/api/subcompanyreport/get_pro_product_site_bip_order_net?p_orgname=${this.rujobs}&p_vouchdatestart=${formattedDate1}&p_vouchdateend=${formattedDate1}`
            )
                .then(response => {
                    if (!response.ok) {
                        throw new Error('网络响应失败');
                    }
                    return response.json(); // 解析 JSON 数据   
                })
                .then(data => {
                    const csdtList = data

                    // 使用reduce来聚合数据  
                    const result = csdtList.reduce((accumulator, current) => {
                        // 确保将box字段转为数字  
                        const boxValue = Number(current.box); // 或者使用 parseFloat(current.box)  

                        // 查找有没有对应的ocustomerClass_name  
                        const existing = accumulator.find(item => item.ocustomerClass_name === current
                            .ocustomerClass_name);

                        if (existing) {
                            // 如果找到了，就累加box字段  
                            existing.boxs = (existing.boxs || 0) + boxValue;
                        } else {
                            // 如果没有找到，就创建一个新对象，并添加boxs字段  
                            accumulator.push({
                                ocustomerClass_name: current.ocustomerClass_name,
                                boxs: boxValue
                            });
                        }

                        return accumulator;
                    }, []);
                    // 根据boxs字段进行排序，降序排列（从大到小）  
                    result.sort((a, b) => b.boxs - a.boxs);

                    // 计算总和  
                    const totalBoxs = result.reduce((sum, item) => sum + item.boxs, 0);

                    // 创建新对象  
                    const resultnum = {
                        ocustomerClass_name: '总量',
                        boxs: totalBoxs
                    };
                    result.push(resultnum);
                    console.log(result)
                    const digitElements = document.querySelectorAll('.digit');
                    // 清空之前的数据  
                    digitElements.forEach((element) => {
                        element.innerText = '0'; // 更新所有数字为 '0'  
                    });
                    const headerRow1 = document.querySelector('#headerRow');
                    headerRow1.innerHTML = ''; // 清空现有表头  

                    const tableBody1 = document.querySelector('#tableBody');
                    tableBody1.innerHTML = ''; // 清空现有表体  
                    // 找到 ocustomerClass_name 字段为 "总量" 的数据  
                    const all = result.filter(item => item.ocustomerClass_name === '总量');
                    const gdpDigits = all[0].boxs.toString().split('').map(Number);
                    console.log(gdpDigits);
                    // 确保 gdpDigits 数组长度为 7，不足时在前面补 0  
                    while (gdpDigits.length < 6) {
                        gdpDigits.unshift(0);
                    }
                    digitElements.forEach((element) => {
                        element.innerText = '0'; // 更新所有数字为 '总量' 的 gdp 值  
                    });
                    gdpDigits.forEach((digit, index) => {
                        if (digitElements[index]) {
                            digitElements[index].innerText = digit; // 更新数字  
                        }
                    });


                    const newres = result.filter(item => item.ocustomerClass_name !== '总量');
                    console.log(newres);
                    // 插入表头数据
                    const headerRow = document.querySelector('#headerRow');
                    newres.forEach(item => {
                        const th = document.createElement('th');
                        th.textContent = item.ocustomerClass_name; // 使用 city 作为表头  
                        th.style.padding = '0.15vw 0.3vw';
                        headerRow.appendChild(th);
                    });

                    // 插入表体数据  
                    const tableBody = document.querySelector('#tableBody');
                    const row = document.createElement('tr');
                    newres.forEach(item => {
                        const td = document.createElement('td');
                        td.textContent = item.boxs; // 使用 gdp 作为表体  
                        row.appendChild(td);
                    });
                    tableBody.appendChild(row);

                })
                .catch(error => {
                    console.error('请求数据时出现错误:', error);
                });
        },
        //地级市数据
        getinitMap() {
            api.cityTodayApi().then(res => {
                this.cityList = res.map(region => ({
                    name: region.iParentName + '市',  // 将 iqname 改为 name  
                    value: region.box      // 将 box 改为 value  
                }));
                console.log(this.cityList, 99922222)
                this.initMap()
            })



        },
        //长沙市地图
        initMap() {
            if (this.rujobs == '成都市') {
                this.rujobs1 = '成都'

                var myChart = echarts.init(document.getElementById('map'));

                // Fetch the GeoJSON data  
                fetch(`${this.rujobs1}.json?t=${new Date().getTime()}`)
                    .then(response => response.json())
                    .then(geoJson => {
                        echarts.registerMap(this.rujobs1, geoJson);
                        this.setMapOption(myChart);
                    })
                    .catch(error => {
                        console.error('999999', error);
                    });
            } else if (this.rujobs == '长沙市') {
                this.rujobs1 = '长沙'

                var myChart = echarts.init(document.getElementById('map'));

                // Fetch the GeoJSON data  
                fetch(`${this.rujobs1}.json?t=${new Date().getTime()}`)
                    .then(response => response.json())
                    .then(geoJson => {
                        echarts.registerMap(this.rujobs1, geoJson);
                        this.setMapOption(myChart);
                    })
                    .catch(error => {
                        console.error('999999', error);
                    });
            } else if (this.rujobs == '湖南区域' || this.rujobs == '湘黔合资') {
                this.rujobs1 = '湖南'

                var myChart = echarts.init(document.getElementById('map'));

                // Fetch the GeoJSON data  
                fetch(`${this.rujobs1}.json?t=${new Date().getTime()}`)
                    .then(response => response.json())
                    .then(geoJson => {
                        echarts.registerMap(this.rujobs1, geoJson);
                        this.setMapOption(myChart);
                    })
                    .catch(error => {
                        console.error('999999', error);
                    });
            } else if (this.rujobs == '武汉合资') {
                this.rujobs1 = '武汉市'

                var myChart = echarts.init(document.getElementById('map'));

                // Fetch the GeoJSON data  
                fetch(`${this.rujobs1}.json?t=${new Date().getTime()}`)
                    .then(response => response.json())
                    .then(geoJson => {
                        echarts.registerMap(this.rujobs1, geoJson);
                        this.setMapOption(myChart);
                    })
                    .catch(error => {
                        console.error('999999', error);
                    });
            } else if (this.rujobs == '赣南区域' || this.rujobs == '赣北区域') {
                this.rujobs1 = '江西'

                var myChart = echarts.init(document.getElementById('map'));

                // Fetch the GeoJSON data  
                fetch(`${this.rujobs1}.json?t=${new Date().getTime()}`)
                    .then(response => response.json())
                    .then(geoJson => {
                        echarts.registerMap(this.rujobs1, geoJson);
                        this.setMapOption(myChart);
                    })
                    .catch(error => {
                        console.error('999999', error);
                    });
            } else if (this.rujobs == '安徽合资') {
                this.rujobs1 = '安徽'

                var myChart = echarts.init(document.getElementById('map'));

                // Fetch the GeoJSON data  
                fetch(`${this.rujobs1}.json?t=${new Date().getTime()}`)
                    .then(response => response.json())
                    .then(geoJson => {
                        echarts.registerMap(this.rujobs1, geoJson);
                        this.setMapOption(myChart);
                    })
                    .catch(error => {
                        console.error('999999', error);
                    });
            } else if (this.rujobs == '江汉鄂西北区域') {
                this.rujobs1 = '湖北'

                var myChart = echarts.init(document.getElementById('map'));

                // Fetch the GeoJSON data  
                fetch(`${this.rujobs1}.json?t=${new Date().getTime()}`)
                    .then(response => response.json())
                    .then(geoJson => {
                        echarts.registerMap(this.rujobs1, geoJson);
                        this.setMapOption(myChart);
                    })
                    .catch(error => {
                        console.error('999999', error);
                    });
            } else if (this.rujobs == '宜恩合资') {
                this.rujobs1 = '湖北'

                var myChart = echarts.init(document.getElementById('map'));

                // Fetch the GeoJSON data  
                fetch(`${this.rujobs1}.json?t=${new Date().getTime()}`)
                    .then(response => response.json())
                    .then(geoJson => {
                        echarts.registerMap(this.rujobs1, geoJson);
                        this.setMapOption(myChart);
                    })
                    .catch(error => {
                        console.error('999999', error);
                    });
            } else if (this.rujobs == '莞深区域') {
                this.rujobs1 = '广东'

                var myChart = echarts.init(document.getElementById('map'));

                // Fetch the GeoJSON data  
                fetch(`${this.rujobs1}.json?t=${new Date().getTime()}`)
                    .then(response => response.json())
                    .then(geoJson => {
                        echarts.registerMap(this.rujobs1, geoJson);
                        this.setMapOption(myChart);
                    })
                    .catch(error => {
                        console.error('999999', error);
                    });
            } else if (this.rujobs == '粤中区域') {
                this.rujobs1 = '广东'

                var myChart = echarts.init(document.getElementById('map'));

                // Fetch the GeoJSON data  
                fetch(`${this.rujobs1}.json?t=${new Date().getTime()}`)
                    .then(response => response.json())
                    .then(geoJson => {
                        echarts.registerMap(this.rujobs1, geoJson);
                        this.setMapOption(myChart);
                    })
                    .catch(error => {
                        console.error('999999', error);
                    });
            } else if (this.rujobs == '粤西区域') {
                this.rujobs1 = '广东'

                var myChart = echarts.init(document.getElementById('map'));

                // Fetch the GeoJSON data  
                fetch(`${this.rujobs1}.json?t=${new Date().getTime()}`)
                    .then(response => response.json())
                    .then(geoJson => {
                        echarts.registerMap(this.rujobs1, geoJson);
                        this.setMapOption(myChart);
                    })
                    .catch(error => {
                        console.error('999999', error);
                    });
            } else if (this.rujobs == '粤北区域') {
                this.rujobs1 = '广东'

                var myChart = echarts.init(document.getElementById('map'));

                // Fetch the GeoJSON data  
                fetch(`${this.rujobs1}.json?t=${new Date().getTime()}`)
                    .then(response => response.json())
                    .then(geoJson => {
                        echarts.registerMap(this.rujobs1, geoJson);
                        this.setMapOption(myChart);
                    })
                    .catch(error => {
                        console.error('999999', error);
                    });
            } else if (this.rujobs == '桂北区域') {
                this.rujobs1 = '广西壮族自治区'

                var myChart = echarts.init(document.getElementById('map'));

                // Fetch the GeoJSON data  
                fetch(`${this.rujobs1}.json?t=${new Date().getTime()}`)
                    .then(response => response.json())
                    .then(geoJson => {
                        echarts.registerMap(this.rujobs1, geoJson);
                        this.setMapOption(myChart);
                    })
                    .catch(error => {
                        console.error('999999', error);
                    });
            } else if (this.rujobs == '桂南区域') {
                this.rujobs1 = '广西壮族自治区'

                var myChart = echarts.init(document.getElementById('map'));

                // Fetch the GeoJSON data  
                fetch(`${this.rujobs1}.json?t=${new Date().getTime()}`)
                    .then(response => response.json())
                    .then(geoJson => {
                        echarts.registerMap(this.rujobs1, geoJson);
                        this.setMapOption(myChart);
                    })
                    .catch(error => {
                        console.error('999999', error);
                    });
            } else if (this.rujobs == '桂西区域') {
                this.rujobs1 = '广西壮族自治区'

                var myChart = echarts.init(document.getElementById('map'));

                // Fetch the GeoJSON data  
                fetch(`${this.rujobs1}.json?t=${new Date().getTime()}`)
                    .then(response => response.json())
                    .then(geoJson => {
                        echarts.registerMap(this.rujobs1, geoJson);
                        this.setMapOption(myChart);
                    })
                    .catch(error => {
                        console.error('999999', error);
                    });
            } else if (this.rujobs == '关中区域') {
                this.rujobs1 = '新疆维吾尔自治区'

                var myChart = echarts.init(document.getElementById('map'));

                // Fetch the GeoJSON data  
                fetch(`${this.rujobs1}.json?t=${new Date().getTime()}`)
                    .then(response => response.json())
                    .then(geoJson => {
                        echarts.registerMap(this.rujobs1, geoJson);
                        this.setMapOption(myChart);
                    })
                    .catch(error => {
                        console.error('999999', error);
                    });
            } else if (this.rujobs == '华南省平台') {
                this.rujobs1 = '广西壮族自治区'

                var myChart = echarts.init(document.getElementById('map'));

                // Fetch the GeoJSON data  
                fetch(`${this.rujobs1}.json?t=${new Date().getTime()}`)
                    .then(response => response.json())
                    .then(geoJson => {
                        echarts.registerMap(this.rujobs1, geoJson);
                        this.setMapOption(myChart);
                    })
                    .catch(error => {
                        console.error('999999', error);
                    });
            } else if (this.rujobs == '海南区域') {
                this.rujobs1 = '海南'

                var myChart = echarts.init(document.getElementById('map'));

                // Fetch the GeoJSON data  
                fetch(`${this.rujobs1}.json?t=${new Date().getTime()}`)
                    .then(response => response.json())
                    .then(geoJson => {
                        echarts.registerMap(this.rujobs1, geoJson);
                        this.setMapOption(myChart);
                    })
                    .catch(error => {
                        console.error('999999', error);
                    });
            } else if (this.rujobs == '重庆市') {
                this.rujobs1 = '重庆'

                var myChart = echarts.init(document.getElementById('map'));

                // Fetch the GeoJSON data  
                fetch(`${this.rujobs1}.json?t=${new Date().getTime()}`)
                    .then(response => response.json())
                    .then(geoJson => {
                        echarts.registerMap(this.rujobs1, geoJson);
                        this.setMapOption(myChart);
                    })
                    .catch(error => {
                        console.error('999999', error);
                    });
            } else if (this.rujobs == '川南' || this.rujobs == '川北' || this.rujobs == '川西' || this.rujobs == '川东' || this.rujobs == '西南省平台') {
                this.rujobs1 = '四川'

                var myChart = echarts.init(document.getElementById('map'));

                // Fetch the GeoJSON data  
                fetch(`${this.rujobs1}.json?t=${new Date().getTime()}`)
                    .then(response => response.json())
                    .then(geoJson => {
                        echarts.registerMap(this.rujobs1, geoJson);
                        this.setMapOption(myChart);
                    })
                    .catch(error => {
                        console.error('999999', error);
                    });
            } else if (this.rujobs == '贵州省') {
                this.rujobs1 = '贵州'

                var myChart = echarts.init(document.getElementById('map'));

                // Fetch the GeoJSON data  
                fetch(`${this.rujobs1}.json?t=${new Date().getTime()}`)
                    .then(response => response.json())
                    .then(geoJson => {
                        echarts.registerMap(this.rujobs1, geoJson);
                        this.setMapOption(myChart);
                    })
                    .catch(error => {
                        console.error('999999', error);
                    });
            } else if (this.rujobs == '云贵区域') {
                this.rujobs1 = '云贵'

                var myChart = echarts.init(document.getElementById('map'));

                // Fetch the GeoJSON data  
                fetch(`${this.rujobs1}.json?t=${new Date().getTime()}`)
                    .then(response => response.json())
                    .then(geoJson => {
                        echarts.registerMap(this.rujobs1, geoJson);
                        this.setMapOption(myChart);
                    })
                    .catch(error => {
                        console.error('999999', error);
                    });
            } else if (this.rujobs == '福建省直营' || this.rujobs == '闽北区域' || this.rujobs == '闽南区域' || this.rujobs == '闽赣省平台' || this.rujobs == '闽赣省平台') {
                this.rujobs1 = '福建'

                var myChart = echarts.init(document.getElementById('map'));

                // Fetch the GeoJSON data  
                fetch(`${this.rujobs1}.json?t=${new Date().getTime()}`)
                    .then(response => response.json())
                    .then(geoJson => {
                        echarts.registerMap(this.rujobs1, geoJson);
                        this.setMapOption(myChart);
                    })
                    .catch(error => {
                        console.error('999999', error);
                    });
            } else if (this.rujobs == '苏中区域' || this.rujobs == '华东省平台' || this.rujobs == '苏中区域') {
                this.rujobs1 = '江苏'

                var myChart = echarts.init(document.getElementById('map'));

                // Fetch the GeoJSON data  
                fetch(`${this.rujobs1}.json?t=${new Date().getTime()}`)
                    .then(response => response.json())
                    .then(geoJson => {
                        echarts.registerMap(this.rujobs1, geoJson);
                        this.setMapOption(myChart);
                    })
                    .catch(error => {
                        console.error('999999', error);
                    });
            } else if (this.rujobs == '上海市') {
                this.rujobs1 = '上海'

                var myChart = echarts.init(document.getElementById('map'));

                // Fetch the GeoJSON data  
                fetch(`${this.rujobs1}.json?t=${new Date().getTime()}`)
                    .then(response => response.json())
                    .then(geoJson => {
                        echarts.registerMap(this.rujobs1, geoJson);
                        this.setMapOption(myChart);
                    })
                    .catch(error => {
                        console.error('999999', error);
                    });
            } else if (this.rujobs == '浙北区域' || this.rujobs == '浙中区域' || this.rujobs == '浙南区域') {
                this.rujobs1 = '浙江'

                var myChart = echarts.init(document.getElementById('map'));

                // Fetch the GeoJSON data  
                fetch(`${this.rujobs1}.json?t=${new Date().getTime()}`)
                    .then(response => response.json())
                    .then(geoJson => {
                        echarts.registerMap(this.rujobs1, geoJson);
                        this.setMapOption(myChart);
                    })
                    .catch(error => {
                        console.error('999999', error);
                    });
            } else if (this.rujobs == '天津市') {
                this.rujobs1 = '天津'

                var myChart = echarts.init(document.getElementById('map'));

                // Fetch the GeoJSON data  
                fetch(`${this.rujobs1}.json?t=${new Date().getTime()}`)
                    .then(response => response.json())
                    .then(geoJson => {
                        echarts.registerMap(this.rujobs1, geoJson);
                        this.setMapOption(myChart);
                    })
                    .catch(error => {
                        console.error('999999', error);
                    });
            } else if (this.rujobs == '北京市') {
                this.rujobs1 = '北京市'

                var myChart = echarts.init(document.getElementById('map'));

                // Fetch the GeoJSON data  
                fetch(`${this.rujobs1}.json?t=${new Date().getTime()}`)
                    .then(response => response.json())
                    .then(geoJson => {
                        echarts.registerMap(this.rujobs1, geoJson);
                        this.setMapOption(myChart);
                    })
                    .catch(error => {
                        console.error('999999', error);
                    });
            } else if (this.rujobs == '华北省平台') {
                this.rujobs1 = '黑龙江省'

                var myChart = echarts.init(document.getElementById('map'));

                // Fetch the GeoJSON data  
                fetch(`${this.rujobs1}.json?t=${new Date().getTime()}`)
                    .then(response => response.json())
                    .then(geoJson => {
                        echarts.registerMap(this.rujobs1, geoJson);
                        this.setMapOption(myChart);
                    })
                    .catch(error => {
                        console.error('999999', error);
                    });
            } else if (this.rujobs == '豫南区域') {
                this.rujobs1 = '河南'

                var myChart = echarts.init(document.getElementById('map'));

                // Fetch the GeoJSON data  
                fetch(`${this.rujobs1}.json?t=${new Date().getTime()}`)
                    .then(response => response.json())
                    .then(geoJson => {
                        echarts.registerMap(this.rujobs1, geoJson);
                        this.setMapOption(myChart);
                    })
                    .catch(error => {
                        console.error('999999', error);
                    });
            } else if (this.rujobs == '鲁中区域') {
                this.rujobs1 = '山东'

                var myChart = echarts.init(document.getElementById('map'));

                // Fetch the GeoJSON data  
                fetch(`${this.rujobs1}.json?t=${new Date().getTime()}`)
                    .then(response => response.json())
                    .then(geoJson => {
                        echarts.registerMap(this.rujobs1, geoJson);
                        this.setMapOption(myChart);
                    })
                    .catch(error => {
                        console.error('999999', error);
                    });
            } else if (this.rujobs == '鲁西南区域') {
                this.rujobs1 = '山东'

                var myChart = echarts.init(document.getElementById('map'));

                // Fetch the GeoJSON data  
                fetch(`${this.rujobs1}.json?t=${new Date().getTime()}`)
                    .then(response => response.json())
                    .then(geoJson => {
                        echarts.registerMap(this.rujobs1, geoJson);
                        this.setMapOption(myChart);
                    })
                    .catch(error => {
                        console.error('999999', error);
                    });
            } else if (this.rujobs == '京津冀') {
                this.rujobs1 = '河北'

                var myChart = echarts.init(document.getElementById('map'));

                // Fetch the GeoJSON data  
                fetch(`${this.rujobs1}.json?t=${new Date().getTime()}`)
                    .then(response => response.json())
                    .then(geoJson => {
                        echarts.registerMap(this.rujobs1, geoJson);
                        this.setMapOption(myChart);
                    })
                    .catch(error => {
                        console.error('999999', error);
                    });
            } else if (this.rujobs == '晋北区域') {
                this.rujobs1 = '山西'

                var myChart = echarts.init(document.getElementById('map'));

                // Fetch the GeoJSON data  
                fetch(`${this.rujobs1}.json?t=${new Date().getTime()}`)
                    .then(response => response.json())
                    .then(geoJson => {
                        echarts.registerMap(this.rujobs1, geoJson);
                        this.setMapOption(myChart);
                    })
                    .catch(error => {
                        console.error('999999', error);
                    });
            } else if (this.rujobs == '关中区域') {
                this.rujobs1 = '陕西'

                var myChart = echarts.init(document.getElementById('map'));

                // Fetch the GeoJSON data  
                fetch(`${this.rujobs1}.json?t=${new Date().getTime()}`)
                    .then(response => response.json())
                    .then(geoJson => {
                        echarts.registerMap(this.rujobs1, geoJson);
                        this.setMapOption(myChart);
                    })
                    .catch(error => {
                        console.error('999999', error);
                    });
            }
        },
        setMapOption(myChart) {
            const option = {
                tooltip: {
                    trigger: 'item',
                    formatter: '{b}: {c}'
                },
                visualMap: {
                    min: 0,
                    max: 1000,
                    left: 'left',
                    top: 'bottom',
                    text: ['高', '低'],
                    calculable: true,
                    textStyle: {
                        fontSize: 10,
                        color: 'yellow'
                    }
                },
                series: [{
                    name: '数据',
                    type: 'map',
                    map: this.rujobs1,
                    roam: true,
                    zoom: 0.7,
                    label: {
                        // show: true
                    },
                    data: this.cityList
                }]
            };

            myChart.setOption(option);
            // Add responsive resize  
            // 使用 ResizeObserver 监听父元素的变化  
            myChart.on('click', (params) => {
                console.log('点击的横坐标名字:', params.name);
                this.$router.push({
                    path: '/changshaDQ/RealOrders'
                });
            });
            const resizeObserver = new ResizeObserver(() => {
                myChart.resize(); // 调整图表大小  
            });

            // 开始观察父元素的大小变化  
            resizeObserver.observe(chartContainer);
        },
        //订单频次
        rateFrequ() {
            const currentDate = new Date();
            const formattedDate = this.formatDate(currentDate);
            const startOfMonthDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
            const startData = this.formatDate(startOfMonthDate);

            fetch(`http://bi.yufanjtbip.com:8069/api/subcompanyreport/get_pro_product_ncc_order_rate_count_net?p_orgname=${this.rujobs}&p_vouchdatestart=${startData}&p_vouchdateend=${formattedDate}`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('网络响应失败');
                    }
                    return response.json();
                })
                .then(data => {
                    this.rateList = data.map(item => {
                        item.iParentName = item.iParentName.replace(/\d+/g, '').trim();
                        item.box = parseFloat(item.box).toFixed(0);
                        return item;
                    });
                    // 确保在数据加载完成后使用 $nextTick 启动自动滚动  
                    this.$nextTick(() => {
                        this.autoScroll(); // 启动滚动  
                    });

                })
                .catch(error => {
                    console.error('请求数据时出现错误:', error);
                });
        },
        formatDate(date) {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
        },
        autoScroll() {
            const container = this.$el.querySelector('#tableContainer');
            const tableBody = container.querySelector('tbody');
            const scrollHeight = tableBody.scrollHeight; // 表格体的总高度  
            const containerHeight = container.clientHeight; // 容器的高度  

            // 清除之前的滚动定时器  
            clearInterval(this.scrollInterval);

            // 定义自动滚动的函数  
            const scroll = () => {
                this.scrollTop += this.scrollSpeed; // 向下滚动  
                container.scrollTop = this.scrollTop;

                // 如果到达底部，重置滚动位置到顶部  
                if (this.scrollTop + containerHeight >= scrollHeight) {
                    this.scrollTop = 0; // 重置为顶部  
                }
            };

            this.scrollInterval = setInterval(scroll, 50); // 每50毫秒滚动一次  
        },
        stopScroll() {
            clearInterval(this.scrollInterval); // 停止滚动  
        },
        ddpcbtn() {
            this.$router.push({
                path: '/changshaDQ/OrderFrequency'
            });
        }

    }
};
</script>

<style scoped>
.body {
    color: #FFF;
    background: #000c3b;
    margin: 0 0;
    padding: 0 0;
}

.content {
    color: #FFF;
    background: #000c3b;
    margin: 0 0;
    padding: 0 0;
    position: absolute;
    top: 4rem;
    right: 0;
    bottom: 0;
    left: 0;
}

.chart:empty {
    border: 1px dashed;
    box-sizing: border-box;
    -moz-box-sizing: border-box;
    -webkit-box-sizing: border-box;
    opacity: 0.3;
}

.chart:empty::after {
    content: "图表";
    position: absolute;
    top: 50%;
    left: 50%;
    margin-top: -1rem;
    margin-left: -1rem;
}


.fill-parent {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
}

.head {
    height: 4rem;
}

.head .title {
    font-size: 1.8rem;
    text-align: center;
    padding-top: 0.2em;
    box-sizing: border-box;
    -moz-box-sizing: border-box;
    -webkit-box-sizing: border-box;
}

.head .title .title-left {
    background: url(images/title-left.png) no-repeat center center;
    display: inline-block;
    width: 312px;
    height: 48px;
}

.head .title .title-value {
    display: inline-block;
    line-height: 48px;
    vertical-align: top;
    padding-left: 2em;
    padding-right: 2em;
}

.head .title .title-right {
    background: url(images/title-right.png) no-repeat center center;
    display: inline-block;
    width: 312px;
    height: 48px;
}

.layout {
    position: absolute;
    width: 33.33%;
}

.layout-left-top {
    left: 0;
    top: 0;
    height: 33.33%;
}

.layout-left-center {
    left: 0;
    top: 32.33%;
    height: 34.33%;
}

.layout-left-bottom {
    left: 0;
    top: 64.66%;
    height: 35.33%;
}

.layout-center-top {
    top: 0;
    left: 33.33%;
    right: 66.6%;
    height: 50%;
}

.layout-center-bottom {
    top: 50%;
    left: 33.33%;
    right: 66.6%;
    bottom: 0;
}

.layout-right-top {
    top: 0;
    right: 0;
    height: 50%;
}

.layout-right-bottom {
    top: 50%;
    right: 0;
    bottom: 0;
}

.panel {
    position: absolute;
    left: 0.5rem;
    top: 1rem;
    right: 0.5rem;
    bottom: 1em;
    border: 2px solid #032d60;
    -webkit-box-shadow: #07417a 0 0 10px;
    -moz-box-shadow: #07417a 0 0 10px;
    box-shadow: inset 0 0 30px #07417a;
}

.panel.border-left-top:before,
.panel.border-all:before {
    position: absolute;
    width: 1rem;
    height: 1rem;
    content: "";
    border-top: 2px solid #26c6f0;
    border-left: 2px solid #26c6f0;
    left: -1px;
    top: -1px;
}

.panel.border-right-top:after,
.panel.border-all:after {
    position: absolute;
    width: 1rem;
    height: 1rem;
    content: "";
    border-top: 2px solid #26c6f0;
    border-right: 2px solid #26c6f0;
    right: -1px;
    top: -1px;
}

.panel.border-left-bottom .border-foot:before,
.panel.border-all .border-foot:before {
    position: absolute;
    width: 1rem;
    height: 1rem;
    content: "";
    border-bottom: 2px solid #26c6f0;
    border-left: 2px solid #26c6f0;
    left: -1px;
    bottom: -1px;
}

.panel.border-right-bottom .border-foot:after,
.panel.border-all .border-foot:after {
    position: absolute;
    width: 1rem;
    height: 1rem;
    content: "";
    border-bottom: 2px solid #26c6f0;
    border-right: 2px solid #26c6f0;
    right: -1px;
    bottom: -1px;
}

.panel>.title {
    position: absolute;
    top: -0.8rem;
    right: 20%;
    left: 20%;
    line-height: 1.4rem;
    font-size: 1.2rem;
    text-align: center;
    background-color: #000c3b;
    color: #83c7e3;
}

.panel>.title::before {
    content: "[";
    color: #105eda;
    font-weight: bold;
    position: absolute;
    left: 0;
}

.panel>.title::after {
    content: "]";
    color: #105eda;
    font-weight: bold;
    position: absolute;
    right: 0;
}

.panel .chart {
    position: absolute;
    top: 0.1rem;
    right: 0.3rem;
    bottom: 0.3rem;
    left: 0.3rem;
}

.layout-center-bottom .panel {
    background-image: -webkit-radial-gradient(250px 250px at 50% 50%, hsla(209, 99%, 32%, 28), hsla(228, 100%, 0%, 0));
    background-image: radial-gradient(250px 250px at 50% 50%, hsla(209, 99%, 32%, 28), hsla(228, 100%, 0%, 0));
}

#cwyzzmain {
    width: 95%;
    /* 设置为自适应的宽度，可以是 80% 或者固定像素值 */
    height: 27vh;
    /* 高度可以根据需要进行调整32 */
    margin: 0 auto;
    /* 使用 margin：0，因为我们用 Flexbox 进行居中 */
}

#sqSINglemian {
    width: 95%;
    /* 设置为自适应的宽度，可以是 80% 或者固定像素值 */
    height: 27vh;
    /* 高度可以根据需要进行调整32 */
    margin: 0 auto;
    /* 使用 margin：0，因为我们用 Flexbox 进行居中 */
}

#yugzmain {
    width: 98%;
    /* 设置为自适应的宽度，可以是 80% 或者固定像素值 */
    height: 27vh;
    /* 高度可以根据需要进行调整32 */
    margin: 0 auto;
    /* 使用 margin：0，因为我们用 Flexbox 进行居中 */
}

.table {
    border-collapse: collapse;
    font-size: 0.60vw;
    /* 字体大小根据视口宽度变化 */
    margin: auto;
    position: absolute;
    left: 15%;
    top: 85%
}

.table th,
.table td {
    padding: 0.15vw 0.3vw;
    /* 使用视口单位来设置内边距 */
    text-align: center;
    color: yellow;
}

.chart th {
    color: #ffffff;
}

.number {
    display: flex;
    font-size: 0.8vw;
    font-weight: bold;
    text-align: center;
    align-items: center;
    justify-content: center;
    align-content: center;
    margin-top: 3.5%;


}

.digit {
    width: 0.8vw;
    /* 每个数字的宽度 */
    height: 1.2vw;
    /* 每个数字的高度 */
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 0 4px;
    /* 数字间的间距 */
    background-color: #3f4ab1;
    /* 背景色 */
}

#tableContainer {
    margin-top: 3%;
    max-height: 95%;
    /* 设置可滚动区域的最大高度 */
    overflow-y: hidden;
    /* 默认不显示滚动条 */
    border: 1px solid #ccc;
    /* 可选：为容器添加边框 */
}

.table1 {
    width: 100%;
    /* 占满宽度 */
    border-collapse: collapse;
    /* 合并边框 */
}

.table1 th,
.table1 td {
    padding: 10px;
    /* 单元格内边距 */
    text-align: left;
    /* 左对齐文本 */
    border-bottom: 1px solid #ddd;
    /* 表格行的底部边框 */
}

.table1 th {
    background-color: #000c3b;
    /* 表头背景颜色 */
    position: sticky;
    /* 使表头固定 */
    top: 0;
    /* 将其位置设定在顶部 */
    z-index: 10;
    /* 确保其显示在其他元素的上方 */
}
</style>