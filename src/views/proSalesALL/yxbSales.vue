<template>
    <div class='single'>
        <div id="pieChart" style="width:100%; height:500px;"></div>

        <el-form :inline="true" style="width: 95%; margin: 0 auto;">
            <el-form-item>
                <el-date-picker v-model="dataForm.p_vouchdatestart" value-format="yyyy-MM-dd" type="date"
                    placeholder="开始日期" clearable style="width: 100%"></el-date-picker>
            </el-form-item>
            <el-form-item>
                <el-date-picker v-model="dataForm.p_vouchdateend" value-format="yyyy-MM-dd" type="date"
                    placeholder="结束日期" clearable style="width: 100%"></el-date-picker>
            </el-form-item>
            <el-form-item>
                <!-- <el-button class="filter-item" size="mini" type="success" icon="el-icon-search"
                    @click="getDataList">查询</el-button> -->
            </el-form-item>
            <el-form-item>
                <el-button class="filter-item" size="mini" type="success" @click="getDataListall">查询</el-button>
                <el-button v-for="(item, index) in custList" :key="index" class="filter-item" size="mini" type="success"
                    @click="() => getDataList1(item, index + 1)">
                    {{ item }}
                </el-button>
                <el-button v-show="exshow" size="mini" class="filter-item" type="warning" icon="el-icon-download"
                    @click="exportData">导出</el-button>
            </el-form-item>
        </el-form>

        <AddOrUpdate v-if="show" ref="addupdata" :start-time="startTime" :end-time="endTime" :message="message">
        </AddOrUpdate>

        <el-table v-else class="table" ref="table" border :data="dataList" v-loading="dataListLoading"
            style="width: 95%; margin: 0 auto; margin-bottom: 50px;">
            <el-table-column fixed :show-overflow-tooltip="true" align="center" prop="name" label="战区" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="lowSeries" label="老品">
                <el-table-column :show-overflow-tooltip="true" align="center" prop="bigyuanwei" label="大原味" />
                <el-table-column :show-overflow-tooltip="true" align="center" prop="smallyuanwei" label="小原味" />
                <el-table-column :show-overflow-tooltip="true" align="center" prop="yxyuanwei" label="优选原味" />
                <el-table-column :show-overflow-tooltip="true" align="center" width="140" prop="xyuanweidyh"
                    label="小原味（戴永红定制）" />
                <el-table-column :show-overflow-tooltip="true" align="center" width="120" prop="xyuanweily"
                    label="小原味（绿叶定制）" />
                <el-table-column :show-overflow-tooltip="true" align="center" prop="dbt" label="大白桃" />
                <el-table-column :show-overflow-tooltip="true" align="center" prop="xbt" label="小白桃" />
                <el-table-column :show-overflow-tooltip="true" align="center" prop="dqx" label="大清新" />
                <el-table-column :show-overflow-tooltip="true" align="center" prop="xqx" label="小清新" />
                <el-table-column :show-overflow-tooltip="true" align="center" prop="qinxi450" label="450清新" />
                <el-table-column :show-overflow-tooltip="true" align="center" prop="djs" label="大健爽" />
                <el-table-column :show-overflow-tooltip="true" align="center" prop="xjs" label="小健爽" />
                <el-table-column :show-overflow-tooltip="true" align="center" prop="dlt" label="大0糖" />
                <el-table-column :show-overflow-tooltip="true" align="center" prop="xlt" label="小0糖" />
                <el-table-column :show-overflow-tooltip="true" align="center" prop="lsjs" label="蓝色健爽" />
                <el-table-column :show-overflow-tooltip="true" align="center" prop="jn" label="健能" />
                <el-table-column :show-overflow-tooltip="true" align="center" prop="jh" label="姜黄" />
                <el-table-column :show-overflow-tooltip="true" align="center" prop="yz330" label="330" />
                <el-table-column :show-overflow-tooltip="true" align="center" prop="yz310" label="310" />
                <el-table-column :show-overflow-tooltip="true" align="center" width="120" prop="snnb180"
                    label="180酸乳酪(白）" />
                <el-table-column :show-overflow-tooltip="true" align="center" width="120" prop="snnred180"
                    label="180酸乳酪(红）" />
            </el-table-column>

            <el-table-column :show-overflow-tooltip="true" align="center" prop="lowSeries" label="新品">
                <el-table-column :show-overflow-tooltip="true" align="center" prop="lyznr1" label="1L椰子牛乳" />
                <el-table-column :show-overflow-tooltip="true" align="center" width="140" prop="lyznrdz1"
                    label="1L椰子牛乳(定制款）" />
                <el-table-column :show-overflow-tooltip="true" align="center" width="120" prop="cgb970"
                    label="970常温(常规版）" />
                <el-table-column :show-overflow-tooltip="true" align="center" width="120" prop="yxb970"
                    label="970常温(宴席版）" />
                <el-table-column :show-overflow-tooltip="true" align="center" width="120" prop="yxb300"
                    label="300常温(宴席版）" />
                <el-table-column :show-overflow-tooltip="true" align="center" width="120" prop="jdb300"
                    label="300常温(经典版）" />
                <el-table-column :show-overflow-tooltip="true" align="center" prop="cz380" label="380橙汁" />
                <el-table-column :show-overflow-tooltip="true" align="center" prop="cz135" label="1.35橙汁" />
                <el-table-column :show-overflow-tooltip="true" align="center" prop="syz380" label="380双柚汁" />
                <el-table-column :show-overflow-tooltip="true" align="center" prop="syz135" label="1.35双柚汁" />
                <el-table-column :show-overflow-tooltip="true" align="center" prop="yzz245" label="245椰子汁" />
                <el-table-column :show-overflow-tooltip="true" align="center" prop="lyzz1" label="1L椰子汁" />
                <el-table-column :show-overflow-tooltip="true" align="center" prop="yzz300" label="300椰子汁" />
                <el-table-column :show-overflow-tooltip="true" align="center" width="120" prop="hpyzz125"
                    label="1.25L红瓶椰子汁" />
                <el-table-column :show-overflow-tooltip="true" align="center" width="120" prop="lpyzz125"
                    label="1.25L蓝瓶椰子汁" />
                <el-table-column :show-overflow-tooltip="true" align="center" width="120" prop="lkyzz300"
                    label="300礼盒椰子汁" />
            </el-table-column>
            <el-table-column :show-overflow-tooltip="true" align="center" prop="Qtnmer" label="其它" />
            <el-table-column prop="max" align="center" label="小计" />
        </el-table>
    </div>
</template>

<script>
import * as api from '@/api/frame/customer.js'
import * as echarts from 'echarts';
import AddOrUpdate from './yxbSales-updata'
import {
    exportExcel
} from './SingleSalesTableExpro.js'
export default {
    name: 'single-page',
    components: {
        AddOrUpdate
    },
    data() {
        return {
            msg: 'single-page',
            codes: [
                {
                    id: '1520100050',
                    name: 'lpyzz125'
                },
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
                {
                    id: '1520100045',
                    name: 'qinxi450'
                },
                {
                    id: '1520100040',
                    name: 'xqn300'
                },
                {
                    id: '1520100039',
                    name: 'xqn900'
                },
                {
                    id: '1520100037',
                    name: 'pgz900'
                },
                {
                    id: '1520100038',
                    name: 'pgz300'
                },
                {
                    id: '1520100036',
                    name: 'mgbl300'
                },
                {
                    id: '1520100035',
                    name: 'mgbl900'
                },
                {
                    id: '1520100041',
                    name: 'yzz24541'
                },
                {
                    id: '1520100042',
                    name: 'yzz1ll'
                },
                {
                    id: '1520100043',
                    name: 'yzz30043'
                },
                {
                    id: '1520100044',
                    name: 'yzz125red'
                },
                {
                    id: '1520100046',
                    name: 'yzz300box'
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
            dataForm: {
                p_vouchdatestart: '',
                p_vouchdateend: '',
                p_orgname: ''
            },
            dataForm1: {
                blurry: '',
            },
            custList: [],
            zdname: [],
            dataListLoading: false,
            dataList: [],
            dataListall: [],
            chart: null,
            chartData: [],
            startTime: '',
            endTime: '',
            message: '',
            show: false,
            exshow: true,
            type: '0',
        };
    },
    mounted() {
        this.getDataList();
        this.initializeChart();

        window.addEventListener('resize', this.handleResize);
    },
    beforeDestroy() {
        //组件销毁前，移除事件监听 
        window.removeEventListener('resize', this.handleResize);
    },
    created() {
        this.calculateDates();
    },
    methods: {
        getcustList() {
            api.BdallCustomer(this.dataForm1).then(res => {
                this.custList = res
                this.custList.forEach(item => {
                    const levels = item.levelName.split(' -> ');
                    item.levelName1 = levels[0] || "";
                    // 去掉 levelName2 中的数字  
                    item.levelName2 = levels[1] ? levels[1].replace(/\d+/g, '').trim() : "";
                    item.levelName3 = levels[2] || "";
                });
                this.custList = this.custList = [...new Set(this.custList.map(item => item.levelName1))];
                console.log(this.custList)
            })

        },
        Enterdetails() {
            if (this.type == 0) {
                this.$router.push({
                    path: '/proSalesALL/yxbSalesDetails',
                    query: {
                        param1: '',
                        enddata: this.dataForm.p_vouchdateend,
                        startdate: this.dataForm.p_vouchdatestart
                    }
                });
            } else {
                this.$router.push({
                    path: '/proSalesALL/yxbSalesDetails',
                    query: {
                        param1: this.zdname,
                        enddata: this.dataForm.p_vouchdateend,
                        startdate: this.dataForm.p_vouchdatestart
                    }
                });
            }

        },
        exportData() {
            this.$confirm('是否导出表格数据到Excel?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {

                exportExcel(this.dataList, '单品销量表.xlsx')

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
        getDataList1(data, index) {
            this.show = true
            this.type = index
            this.exshow = false
            this.startTime = this.dataForm.p_vouchdatestart
            this.endTime = this.dataForm.p_vouchdateend
            this.zdname = data
            this.message = data
            this.dataForm.p_orgname = data
            this.getbingData()
            // 使用 setTimeout 延迟一秒后执行后续操作 
            setTimeout(() => {
                // 一秒后执行的操作 
                this.$refs.addupdata.getDataList();
            }, 100);
        },

        getDataListall() {
            this.type = '0'
            this.exshow = true
            // this.dataForm.p_orgname = ''
            // this.getbingData()
            this.getDataList()

        },
        //表格数据
        getDataList() {
            this.fetchData();
            this.show = false,
                this.dataListLoading = true
            api.productonesellbipdq(this.dataForm).then(res => {
                this.dataList = res

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
                    const existing = accumulator.find(item => item.name === current.name);
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
                        // 如果没有找到相同name的对象，就添加到数组中，移除不需要的字段 
                        const { cProductCode, cProductName, box, ...rest } = current; // 解构赋值，移除指定字段 
                        accumulator.push({ name: current.name, ...rest }); //只保留name和合并后的其他字段 
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
                const totalObject = { name: "合计", ...total };

                // 将合计对象中的值为0替换为空字符串
                this.codes.forEach(field => {
                    const fieldName = field.name;
                    if (totalObject[fieldName] === 0) {
                        totalObject[fieldName] = ""; // 将0赋值为空字符串 
                    }
                });
                // 将合计对象添加到原数组中
                this.dataList.push(totalObject);
                console.log(this.dataList)

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
                    const newItem = { name: item.name }; // 遍历对象的每个字段 
                    for (const key in item) {
                        if (key !== 'name') { // 排除 name 字段 
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
                        yzz245: (Number(item.yzz245) || 0) + (Number(item.yzz245h) || 0) + (Number(item.yzz24541) || 0),
                        lyzz1: (Number(item.lyzz1) || 0) + (Number(item.yzz1Lh) || 0) + (Number(item.yzz1ll) || 0),
                        yzz300: (Number(item.yzz300) || 0) + (Number(item.yzz300h) || 0) + (Number(item.yzz30043) || 0),
                        hpyzz125: (Number(item.hpyzz125) || 0) + (Number(item.yzz125Lh) || 0) + (Number(item.yzz125red) || 0),
                        lkyzz300: (Number(item.lkyzz300) || 0) + (Number(item.yzz300h1) || 0),
                        // yz330:(Number(item.yz330) || 0) + (Number(item.yznr330h) || 0),
                        // xqx:(Number(item.xqx) || 0) + (Number(item.xqxjsh) || 0)
                    };
                });
                this.dataList.forEach(item => {
                    const xqmcValue = parseFloat(item.xqmc) || 0; // 如果没有值，则取0  
                    const gm1lValue = parseFloat(item.gm1l) || 0; // 如果没有值，则取0  
                    const pcbValue = parseFloat(item.pcb) || 0; // 如果没有值，则取0 
                    item.Qtnmer = xqmcValue + gm1lValue + pcbValue; // 计算和并赋值给新字段  
                });
                console.log(this.dataList, 115566)
                this.dataListLoading = false

            })
        },
        async fetchData() {

            try {
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
                const response = await fetch(`http://bi.yufanjtbip.com:8069/api/report/get_pro_product_one_sell_index_ncc?p_vouchdatestart=${this.dataForm.p_vouchdatestart}&p_vouchdateend=${this.dataForm.p_vouchdateend}`);
                const data = await response.json();
                console.log(data, 999922)

                // Step1:计算 box 字段的总和，将 box 转换为数字
                const totalBox = data.reduce((sum, obj) => sum + Number(obj.box), 0);

                // Step2: 使用 map生成新的对象数组，添加 percentage 字段
                const result = data.map(obj => ({
                    product_class_pname: obj.product_class_pname,
                    box: Number(obj.box), // 确保 box以数字形式保留 
                    percentage: ((Number(obj.box) / totalBox) * 100).toFixed(2) + '%' //计算百分比并格式化
                }));

                const totalBoxValue = result.reduce((sum, item) => {
                    return sum + (item.box || 0); // 确保 box 字段存在，若不存在则加0
                }, 0);





                //处理数据 
                this.chartData = data.map(item => ({
                    name: item.product_class_pname,
                    value: item.box
                }));
                console.log(this.chartData, 66666)

                this.renderChart();
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        },
        getbingData() {
            api.productonesedetails(this.dataForm).then(res => {
                console.log(res, 123456)

                // Step1:计算 box 字段的总和，将 box 转换为数字
                const totalBox = res.reduce((sum, obj) => sum + Number(obj.box), 0);

                // Step2: 使用 map生成新的对象数组，添加 percentage 字段
                const result = res.map(obj => ({
                    product_class_pname: obj.cProductName,
                    box: Number(obj.box), // 确保 box以数字形式保留 
                    percentage: ((Number(obj.box) / totalBox) * 100).toFixed(2) + '%' //计算百分比并格式化

                }));
                const totalBoxValue = result.reduce((sum, item) => {
                    return sum + (item.box || 0); // 确保 box 字段存在，若不存在则加0
                }, 0);



                console.log(totalBoxValue)

                //处理数据 
                this.chartData = result.map(item => ({
                    name: item.product_class_pname,
                    value: item.box
                }));
                console.log(this.chartData, 9999999)
                this.renderChart();
            })
        },

        renderChart() {
            if (this.chartData.length === 0) return;

            const total = this.chartData.reduce((acc, item) => acc + item.value, 0);

            const option = {
                tooltip: {
                    trigger: 'item',
                    formatter: (params) => {
                        const percentage = ((params.value / total) * 100).toFixed(2) + '%';
                        return `${params.name}: ${params.value}`;
                    }
                },
                series: [
                    {
                        name: '产品类别',
                        type: 'pie',
                        radius: '65%',
                        data: this.chartData,
                        emphasis: {
                            itemStyle: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(0,0,0,0.5)'
                            }
                        },
                        label: {
                            show: true,
                            formatter: '{b}:{d}%', //仅显示百分比 
                            position: 'outside' // 标签位于饼图内部 
                        },
                        labelLine: {
                            show: true // 显示连线 
                        },
                    }
                ]
            };

            this.chart.setOption(option);
        },
        initializeChart() {
            this.chart = echarts.init(document.getElementById('pieChart'));
            this.renderChart(); // Render the chart after initialization 
        },
        handleResize() {
            if (this.chart) {
                this.chart.resize(); // Adjust the chart size on window resize 
            }
        }


    },


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