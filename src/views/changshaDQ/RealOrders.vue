<template>
    <div class='dqsales'>

        <!-- <el-form :inline="true" style="width: 100%; margin: 0 auto;">
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
        </el-form> -->

        <div >
            <div ref="chart" style="width:100%; height:400px;"></div>
            <el-button size="mini" class="filter-item" type="warning" icon="el-icon-download"
                @click="exportData">导出</el-button>
                <el-button class="filter-item" size="mini" type="primary" @click="Enterdetails">站点详情</el-button>
            <el-table class="table" ref="table" border :data="currentData" v-loading="dataListLoading"
                style="width: 100%; margin: 0 auto; margin-bottom: 50px;">
                <el-table-column fixed :show-overflow-tooltip="true" align="center" prop="sqname" label="销售区域/省区" />
                <el-table-column fixed :show-overflow-tooltip="true" align="center" width="150" prop="companyname" label="分公司/办事处" />

                <el-table-column :show-overflow-tooltip="true" align="center" prop="lowSeries" label="低温系列">
                    <el-table-column :show-overflow-tooltip="true" align="center" prop="bigyuanwei" label="大原味" />
                    <el-table-column :show-overflow-tooltip="true" align="center" prop="smallyuanwei" label="小原味" />
                    <el-table-column :show-overflow-tooltip="true" align="center" prop="yxyuanwei" label="优选原味" />
                    <el-table-column :show-overflow-tooltip="true" align="center" width="150" prop="xyuanweidyh"
                        label="小原味（戴永红定制）" />
                    <el-table-column :show-overflow-tooltip="true" align="center" width="150" prop="xyuanweily"
                        label="小原味（绿叶定制）" />
                    <el-table-column :show-overflow-tooltip="true" align="center" width="120" prop="snnb180"
                        label="180酸乳酪(白）" />
                    <el-table-column :show-overflow-tooltip="true" align="center" width="120" prop="snnred180"
                        label="180酸乳酪(红）" />
                    <el-table-column :show-overflow-tooltip="true" align="center" prop="dbt" label="大白桃" />
                    <el-table-column :show-overflow-tooltip="true" align="center" prop="xbt" label="小白桃" />
                    <el-table-column :show-overflow-tooltip="true" align="center" prop="dqx" label="大清新" />
                    <el-table-column :show-overflow-tooltip="true" align="center" prop="xqx" label="小清新" />
                    <el-table-column :show-overflow-tooltip="true" align="center" prop="djs" label="大健爽" />
                    <el-table-column :show-overflow-tooltip="true" align="center" prop="xjs" label="小健爽" />
                    <el-table-column :show-overflow-tooltip="true" align="center" prop="dlt" label="大0糖" />
                    <el-table-column :show-overflow-tooltip="true" align="center" prop="xlt" label="小0糖" />
                    <el-table-column :show-overflow-tooltip="true" align="center" prop="lsjs" label="蓝色健爽" />
                    <el-table-column :show-overflow-tooltip="true" align="center" prop="jn" label="健能" />
                    <el-table-column :show-overflow-tooltip="true" align="center" prop="jh" label="姜黄" />
                </el-table-column>
                <el-table-column align="center" prop="lowSeries" label="椰子牛乳系列">
                    <el-table-column :show-overflow-tooltip="true" align="center" prop="yz330" label="330" />
                    <el-table-column :show-overflow-tooltip="true" align="center" prop="yz310" label="310" />
                    <el-table-column :show-overflow-tooltip="true" align="center" width="150" prop="lyznr1"
                        label="1L椰子牛乳" />
                    <el-table-column :show-overflow-tooltip="true" align="center" width="140" prop="lyznrdz1"
                        label="1L椰子牛乳(定制款）" />
                </el-table-column>

                <el-table-column :show-overflow-tooltip="true" align="center" prop="lowSeries" label="常温系列">
                    <el-table-column :show-overflow-tooltip="true" align="center" width="120" prop="cgb970"
                        label="970常温(常规版）" />
                    <el-table-column :show-overflow-tooltip="true" align="center" width="120" prop="yxb970"
                        label="970常温(宴席版）" />
                    <el-table-column :show-overflow-tooltip="true" align="center" width="120" prop="yxb300"
                        label="300常温(宴席版）" />
                    <el-table-column :show-overflow-tooltip="true" align="center" width="120" prop="jdb300"
                        label="300常温(经典版）" />
                </el-table-column>
                <el-table-column :show-overflow-tooltip="true" align="center" prop="lowSeries" label="果汁系列">
                    <el-table-column :show-overflow-tooltip="true" align="center" prop="cz380" label="380橙汁" />
                    <el-table-column :show-overflow-tooltip="true" align="center" prop="cz135" label="1.35橙汁" />
                    <el-table-column :show-overflow-tooltip="true" align="center" prop="syz380" label="380双柚汁" />
                    <el-table-column :show-overflow-tooltip="true" align="center" width="150" prop="syz135"
                        label="1.35双柚汁" />
                </el-table-column>
                <el-table-column :show-overflow-tooltip="true" align="center" prop="lowSeries" label="椰子汁系列">
                    <el-table-column :show-overflow-tooltip="true" align="center" prop="yzz245" label="245椰子汁" />
                    <el-table-column :show-overflow-tooltip="true" align="center" prop="lyzz1" label="1L椰子汁" />
                    <el-table-column :show-overflow-tooltip="true" align="center" prop="yzz300" label="300椰子汁" />
                    <el-table-column :show-overflow-tooltip="true" align="center" width="120" prop="hpyzz125"
                        label="1.25L红瓶椰子汁" />
                    <el-table-column :show-overflow-tooltip="true" align="center" width="120" prop="lkyzz300"
                        label="300礼盒椰子汁" />
                </el-table-column>
                <el-table-column :show-overflow-tooltip="true" align="center" prop="Qtnmer" label="其它" />
                <el-table-column prop="max" align="center" label="小计" />
            </el-table>
            <el-pagination style="width: 100%;" @size-change="sizeChangeHandle" ref="pagination"
                @current-change="handleCurrentChange" :current-page="currentPage"
                :page-sizes="[20, 40, 60, 80, 100, 1000]" :page-size="pageSize"
                layout="total, sizes, prev, pager, next, jumper" :total="dataList.length">
            </el-pagination>
        </div>
    </div>
</template>

<script>
import * as api from '@/api/DQAPI/dqallApi.js'
import {
    exportExcel
} from './SingleSalesDQExpro.js'
import * as oapi from '@/api/frame/customer.js'
import * as echarts from 'echarts';

import { data } from 'vue-echarts';
export default {
    name: 'dqsales-page',

    data() {
        return {
            msg: 'dqsales-page',
            proshow: false,
            oldnewshow: false,
            dataForm: {
                p_vouchdatestart: '',
                p_vouchdateend: '',
                p_orgname: ''
            },
            dataForm1: {
                p_vouchdatestart: '',
                p_vouchdateend: '',
                p_orgname: ''
            },
            rudepts: '',
            rujobs: '',
            chartData: [],
            startTime: '',
            endTime: '',
            message: '',
            startTime1: '',
            endTime1: '',
            message1: '',
            dataListLoading: false,
            dataList: [],
            currentData: [],
            currentPage: 1,
            pageSize: 20,
            totalItems: 0,
            codes: [
                {
                    id: '1520100001',
                    name: 'bigyuanwei'
                },
                {
                    id: '1520100002',
                    name: 'smallyuanwei'
                },
                {
                    id: '1520100008',
                    name: 'yxyuanwei'
                },
                {
                    id: '1520100020',
                    name: 'xyuanweidyh'
                },
                {
                    id: '1520100021',
                    name: 'xyuanweily'
                },
                {
                    id: '1520100025',
                    name: 'snnb180'
                },
                {
                    id: '1520100026',
                    name: 'snnred180'
                },
                {
                    id: '1520100010',
                    name: 'dbt'
                },
                {
                    id: '1520100009',
                    name: 'xbt'
                },
                {
                    id: '1520100012',
                    name: 'dqx'
                },
                {
                    id: '1520100011',
                    name: 'xqx'
                },
                {
                    id: '1520100014',
                    name: 'djs'
                },
                {
                    id: '1520100015',
                    name: 'xjs'
                },
                {
                    id: '1520100017',
                    name: 'dlt'
                },
                {
                    id: '1520100016',
                    name: 'xlt'
                },
                {
                    id: '1520100003',
                    name: 'lsjs'
                },
                {
                    id: '1520100004',
                    name: 'jn'
                },
                {
                    id: '1520100007',
                    name: 'jh'
                },
                {
                    id: '1520130001',
                    name: 'yz330'
                },
                {
                    id: '1520130003',
                    name: 'yz310'
                },
                {
                    id: '1520130002',
                    name: 'lyznr1'
                },

                {
                    id: '1520130009',
                    name: 'lyznrdz1'
                },
                {
                    id: '1520100022',
                    name: 'cgb970'
                },
                {
                    id: '1520100023',
                    name: 'yxb970'
                },
                {
                    id: '1520100027',
                    name: 'yxb300'
                },
                {
                    id: '1520100028',
                    name: 'jdb300'
                },
                {
                    id: '1520100030',
                    name: 'cz380'
                },
                {
                    id: '1520100029',
                    name: 'cz135'
                },
                {
                    id: '1520100032',
                    name: 'syz380'
                },
                {
                    id: '1520100031',
                    name: 'syz135'
                },
                {
                    id: '1102010001',
                    name: 'yzz245'
                },
                {
                    id: '1103010003',
                    name: 'lyzz1'
                },
                {
                    id: '1103010005',
                    name: 'yzz300'
                },
                {
                    id: '1103010006',
                    name: 'hpyzz125'
                },
                {
                    id: '1103010007',
                    name: 'lkyzz300'
                },
                {
                    id: '1520110069',
                    name: 'xqmc'
                },
                {
                    id: '1520110072',
                    name: 'pcb'
                },
                {
                    id: '1520110073',
                    name: 'gm1l'
                },
                // {
                //     id: '3520100002',
                //     name: 'xyw1'
                // },
                // {
                //     id: '3520100012',
                //     name: 'xbt1'
                // },
                // {
                //     id: '3520100010',
                //     name: 'dbt1'
                // },
                // {
                //     id: '3520100001',
                //     name: 'dyw1'
                // },

                {
                    id: 'HNLK001',
                    name: 'yzz1Lh'
                },
                {
                    id: 'HNLK002',
                    name: 'yzz125Lh'
                },
                {
                    id: 'HNLK003',
                    name: 'yzz300h'
                },
                {
                    id: 'HNLK006',
                    name: 'yzz300h1'
                },
                {
                    id: 'HNLK005',
                    name: 'yzz245h'
                },
                // {
                //     id: '3520100006',
                //     name: 'xqxjsh'
                // },
                // {
                //     id: '3520100011',
                //     name: 'yznr330h'
                // },
            ],
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
        this.rudepts = sessionStorage.getItem('Busdept');
        this.rujobs = sessionStorage.getItem('Busjobs');
        if (this.rujobs == '全部') {
            this.rujobs = sessionStorage.getItem('sf');
            this.rudepts = sessionStorage.getItem('yxb');
        }
        this.getDataList()
    },
    methods: {
        Enterdetails() {
            this.$router.push({
                path: '/changshaDQ/RealOrdersfgs',
                query: {
                    param1: this.rujobs,
                    enddata: this.dataForm.p_vouchdateend,
                    startdate: this.dataForm.p_vouchdateend
                }
            });
        },
        //单品销量
        sqsinglefn() {
            this.dataForm1.p_orgname = this.rujobs,
                this.dataForm1.p_vouchdatestart = this.dataForm.p_vouchdateend,
                this.dataForm1.p_vouchdateend = this.dataForm.p_vouchdateend,
                api.indexsqnccbipApi(this.dataForm1).then(res => {
                    const sqsingle = res;
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
                    console.log(updatedData);
                    this.drawChart(updatedData); // 绘制图表  
                })

        },



        // 绘制柱状图  
        drawChart(data) {
            const categories = data.map(item => item.product_class_pname); // 横坐标数据  
            const values = data.map(item => Number(item.box)); // 纵坐标数据  
            const radios = data.map(item => item.radio); // 百分比数据  

            // 初始化 ECharts 实例 
            this.myChart = echarts.init(this.$refs.chart);

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
                        // fontSize: 10,
                        // color: '#ffffff',
                        // fontFamily: 'SimSun',
                        // fontWeight: 'lighter'
                    }
                },
                yAxis: {
                    type: 'value',
                    axisLabel: {
                        // fontSize: 9,
                        // color: '#ffffff',
                    },
                    min: 0, // 设置 y 轴的最小值  
                    max: 40000, // 设置 y 轴的最大值  
                    interval: 8000 // 设置刻度间隔（例如从0到100，显示5个刻度：0, 25, 50, 75, 100）   
                },
                barWidth: '50%',
                series: [{
                    name: '销量',
                    type: 'bar',
                    data: values, // 纵坐标数据  
                    itemStyle: {
                        // color: 'red' // 设置所有柱子的颜色  
                    },
                    label: {
                        show: true,
                        position: 'top',
                        // color: 'yellow',
                        // fontSize: 9,
                        formatter: (params) => {
                            const percentage = radios[params.dataIndex]; // 获取百分比  
                            return percentage === "0.00%" ? "" : percentage; // 如果是0.00%则返回空字符串，否则返回百分比  
                        }
                    }
                }]
            };

            // 使用制定的配置项和数据显示图表  
            this.myChart.setOption(option);
            // myChart.on('click', (params) => {
            // 	console.log('点击的横坐标名字:', params.name);
            // 	window.open('http://bi.yufanjtbip.com:8059/#/changshaDQ/SingleSalesDQ')
            // });
            // 添加自适应功能

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
                exportExcel(this.dataList, '单品销量表-站点.xlsx')

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
            this.dataForm.p_vouchdatestart = this.endOfToday
            this.dataForm.p_vouchdateend = this.endOfToday
        },
        formatDate(date) {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0'); // 月份从0开始，所以加1 
            const day = String(date.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
        },
        getDataList() {
            this.proshow = false
            this.oldnewshow = false
            this.dataListLoading = true;
            this.dataForm.p_orgname = this.rudepts
            oapi.productonesellcompanybip(this.dataForm).then(res => {
                this.dataList = res
                console.log( this.dataList,99999)
                this.dataList.forEach(item => {
                    if (item.sqname) { // 检查 sqname 是否存在且非空  
                        item.sqname = item.sqname.replace(/\d+/g, '').trim(); // 替换数字并去除空格  
                    }
                });
                this.dataList = this.dataList.filter(item => item.sqname === this.rujobs);
                
                // 遍历 this.dataList 数组 
                this.dataList = this.dataList.map(item => {
                    // 在 codes 数组中查找匹配的对象 
                    const matchedCode = this.codes.find(codeItem => codeItem.id === item.cProductCode);
                    // 如果找到了匹配的对象，添加新字段并设置 box 字段的值 
                    if (matchedCode) {
                        return {
                            ...item, // 保留原始 item 的所有字段 
                            [matchedCode.name]: item.box // 新增字段，名称为 matchedCode.name，值为 box 字段的值 
                        };
                    }
                    // 如果没有匹配的，返回原始 item
                    return item;
                });

                this.dataList = this.dataList.reduce((accumulator, current) => {
                    // 查找已有的对象 
                    const existing = accumulator.find(item => item.companyname === current.companyname);
                    if (existing) {
                        // 合并非指定字段 
                        for (const key in current) {
                            if (!['cProductCode', 'cProductName', 'box', 'name'].includes(key)) {
                                //只合并非重复的值 
                                if (existing[key] !== current[key]) {
                                    existing[key] = current[key]; //只保留最新的值 
                                }
                            }
                        }
                    } else {
                        // 如果没有找到相同companyname的对象，就添加到数组中，移除不需要的字段 
                        const { cProductCode, cProductName, box, ...rest } = current; // 解构赋值，移除指定字段 
                        accumulator.push({ companyname: current.name, ...rest }); //只保留name和合并后的其他字段 
                    }
                    return accumulator;
                }, []);

                const total = this.dataList.reduce((acc, obj) => {
                    this.codes.forEach(field => {
                        const fieldName = field.name; // 获取需要累加的字段名 // 确保值被转换为数字进行累加 
                        const currentValue = Number(obj[fieldName]) || 0; // 确保转换为数字 
                        acc[fieldName] = (acc[fieldName] || 0) + currentValue; // 累加总值 
                    });
                    return acc;
                }, {});



                // 创建合计对象
                const totalObject = { companyname: "合计", ...total };

                // 将合计对象中的值为0替换为空字符串
                this.codes.forEach(field => {
                    const fieldName = field.name;
                    if (totalObject[fieldName] === 0) {
                        totalObject[fieldName] = ""; // 将0赋值为空字符串 
                    }
                });
                // 将合计对象添加到原数组中
                this.dataList.push(totalObject);

                // 遍历每个对象
                this.dataList.forEach(obj => {
                    //计算除了 name 字段之外的其他字段的和 
                    const sum = Object.keys(obj).reduce((acc, key) => {
                        //只对非 name 字段进行求和，并确保将字符串转为数字 
                        if (key !== 'name') {
                            const value = Number(obj[key]); // 转换为数字 
                            return acc + (isNaN(value) ? 0 : value); //处理非数字情况 
                        }
                        return acc; // 针对 name 字段返回累加值 
                    }, 0);
                    // 将结果赋值到 max 字段 
                    obj.max = sum;
                });
                this.dataList = this.dataList.map(item => {
                    // 创建一个新的对象以保持原始的 name 字段 
                    const newItem = { companyname: item.companyname,sqname:item.sqname }; // 遍历对象的每个字段 
                    for (const key in item) {
                        if (key !== 'companyname' && key !== 'sqname') { // 排除 name 字段 
                            const numericValue = Number(item[key]); // 转换为数字 //只在转换成功时保留两位小数 
                            newItem[key] = !isNaN(numericValue) ? numericValue.toFixed(0) : ''; // 可以选择默认值 
                        }
                    }
                    return newItem; // 返回新对象
                });

                this.dataList = this.dataList.map(item => {
                    return {
                        ...item, // 保留所有原有字段  
                        // dbt: (Number(item.dbt) || 0) + (Number(item.dbt1) || 0), // 更新 dbt 字段  
                        // xbt: (Number(item.xbt) || 0) + (Number(item.xbt1) || 0), // 更新 xbt 字段  
                        // bigyuanwei: (Number(item.bigyuanwei) || 0) + (Number(item.dyw1) || 0), // 更新 bigyuanwei 字段  
                        // smallyuanwei: (Number(item.smallyuanwei) || 0) + (Number(item.xyw1) || 0), // 更新 smallyuanwei 字段  
                        yzz245:(Number(item.yzz245) || 0) + (Number(item.yzz245h) || 0),
                        lyzz1:(Number(item.lyzz1) || 0) + (Number(item.yzz1Lh) || 0),
                        yzz300:(Number(item.yzz300) || 0) + (Number(item.yzz300h) || 0),
                        hpyzz125:(Number(item.hpyzz125) || 0) + (Number(item.yzz125Lh) || 0),
                        lkyzz300:(Number(item.lkyzz300) || 0) + (Number(item.yzz300h1) || 0),
                        // yz330:(Number(item.yz330) || 0) + (Number(item.yznr330h) || 0),
                        // xqx:(Number(item.xqx) || 0) + (Number(item.xqxjsh) || 0)
                    };
                });
                
                // 按照 ocustomerClass_name、sqname 和 cSiteName 排序  
                this.dataList.sort((a, b) => {
                    // 处理比较时确保处理了空值情况  
                    const classNameA = a.ocustomerClass_name || ''; // 默认值为空字符串  
                    const classNameB = b.ocustomerClass_name || ''; // 默认值为空字符串  
                    const nameA = a.sqname || ''; // 默认值为空字符串  
                    const nameB = b.sqname || ''; // 默认值为空字符串  

                    // 如果 companyname 是 "合计"，则确保其排到最后  
                    if (a.companyname === "合计") return 1;
                    if (b.companyname === "合计") return -1;

                    // 首先比较 ocustomerClass_name  
                    const classComparison = classNameA.localeCompare(classNameB);

                    // 如果 ocustomerClass_name 相同，则比较 sqname  
                    if (classComparison === 0) {
                        return nameA.localeCompare(nameB); // 次级排序  
                    }

                    return classComparison; // 返回 ocustomerClass_name 的比较结果  
                });
                this.dataList.forEach(item => {
                    const xqmcValue = parseFloat(item.xqmc) || 0; // 如果没有值，则取0  
                    const gm1lValue = parseFloat(item.gm1l) || 0; // 如果没有值，则取0  
                    const pcbValue = parseFloat(item.pcb) || 0; // 如果没有值，则取0 
                    item.Qtnmer = xqmcValue + gm1lValue +pcbValue; // 计算和并赋值给新字段  
                });
                console.log(this.dataList)

               // 处理排序后的结果  


             this.currentData = {
                    ...this.dataList
                };
                this.dataListLoading = false;
                this.sizeChangeHandle(this.pageSize);
                this.sqsinglefn()

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
    font-size: 13px;
    background: #f5f7fa;
}

// ::v-deep .el-table .el-table__body-wrapper tbody tr:last-child {
//   font-size: 15px ;
//   /* 根据需要设置字体大小 */
//   font-weight: 600;
// }

::v-deep .el-table th {
    background: #f5f7fa;
}


::v-deep .el-table__row:last-child {
    font-size: 15px;
    font-weight: 600;
}
</style>