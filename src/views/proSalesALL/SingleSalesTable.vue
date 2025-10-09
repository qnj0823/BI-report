<template>
    <div class='single'>
        <div id="pieChart" style="width:100%; height:500px;"></div>

        <el-form :inline="true" style="width: 100%; display: flex; margin: 0 auto;">
            <el-form-item>
                <el-date-picker v-model="dataForm.p_vouchdatestart" value-format="yyyy-MM-dd" type="date"
                    placeholder="开始日期" clearable style="width: 80%"></el-date-picker>
            </el-form-item>
            <el-form-item>
                <el-date-picker v-model="dataForm.p_vouchdateend" value-format="yyyy-MM-dd" type="date"
                    placeholder="结束日期" clearable style="width: 80%"></el-date-picker>
            </el-form-item>
            <el-form-item>
                <!-- <el-button class="filter-item" size="mini" type="success" icon="el-icon-search"
                    @click="getDataList">查询</el-button> -->
                <el-button class="filter-item" size="mini" type="success" @click="getDataListall">查询</el-button>
                <el-button v-for="(item, index) in custList" :key="index" class="filter-item" size="mini" type="success"
                    @click="() => getDataList1(item, index + 1)">
                    {{ item }}
                </el-button>
                <el-button v-show="exshow" size="mini" class="filter-item" type="warning" icon="el-icon-download"
                    @click="exportData">导出</el-button>
                <el-button class="filter-item" size="mini" type="primary" @click="Enterdetails">站点详情</el-button>
            </el-form-item>
            <el-form-item>

            </el-form-item>
        </el-form>

        <AddOrUpdate v-if="show" ref="addupdata" :start-time="startTime" :end-time="endTime" :message="message">
        </AddOrUpdate>

        <el-table v-else class="table" ref="table" border :data="allArray" v-loading="dataListLoading"
            style="width: 90%; margin: 0 auto; margin-bottom: 50px;">
            <el-table-column fixed :show-overflow-tooltip="true" align="center" prop="nAME" label="战区" />
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
                <el-table-column :show-overflow-tooltip="true" align="center" prop="js180" width="120"
                    label="180活力健爽" />
                <el-table-column :show-overflow-tooltip="true" align="center" prop="js455" width="120"
                    label="455活力健爽" />
                <el-table-column :show-overflow-tooltip="true" align="center" prop="ylr200" width="120"
                    label="200鲜酪乳" />
                <el-table-column :show-overflow-tooltip="true" align="center" prop="ylr450" width="120"
                    label="450鲜酪乳" />


                <el-table-column :show-overflow-tooltip="true" align="center" prop="lyznr1" label="1L椰子牛乳" />
                <el-table-column :show-overflow-tooltip="true" align="center" width="140" prop="lyznrdz1"
                    label="1L椰子牛乳(定制款）" />
                <el-table-column :show-overflow-tooltip="true" align="center" width="120" prop="cgb970"
                    label="950常温(常规版）" />
                <el-table-column :show-overflow-tooltip="true" align="center" width="120" prop="yxb970"
                    label="950常温(宴席版）" />
                <el-table-column :show-overflow-tooltip="true" align="center" width="120" prop="yxb300"
                    label="300常温(宴席版）" />
                <el-table-column :show-overflow-tooltip="true" align="center" width="120" prop="jdb300"
                    label="300常温(经典版）" />
                <el-table-column :show-overflow-tooltip="true" align="center" prop="cz380" label="380橙汁" />
                <el-table-column :show-overflow-tooltip="true" align="center" prop="cz135" label="1.35橙汁" />
                <el-table-column :show-overflow-tooltip="true" align="center" prop="syz380" label="380双柚汁" />
                <el-table-column :show-overflow-tooltip="true" align="center" prop="syz135" label="1.35双柚汁" />
                <el-table-column :show-overflow-tooltip="true" align="center" prop="yzs1l" label="1L椰子水" />
                <el-table-column :show-overflow-tooltip="true" align="center" prop="yzs380" width="120" label="380椰子水" />

                <el-table-column :show-overflow-tooltip="true" align="center" prop="yzz245" label="245椰子汁" />
                <el-table-column :show-overflow-tooltip="true" align="center" prop="lyzz1" label="1L椰子汁" />
                <el-table-column :show-overflow-tooltip="true" align="center" prop="yzz300" label="300椰子汁" />
                <el-table-column :show-overflow-tooltip="true" align="center" width="120" prop="hpyzz125"
                    label="1.25L红瓶椰子汁" />
                <el-table-column :show-overflow-tooltip="true" align="center" width="120" prop="lpyzz125"
                    label="1.25L蓝瓶椰子汁" />
                <el-table-column :show-overflow-tooltip="true" align="center" width="120" prop="lkyzz300"
                    label="300礼盒椰子汁" />
                <el-table-column :show-overflow-tooltip="true" align="center" prop="xqn300" label="300小青柠汁" />
                <el-table-column :show-overflow-tooltip="true" align="center" prop="xqn900" label="900小青柠汁" />
                <el-table-column :show-overflow-tooltip="true" align="center" prop="pgz300" label="300苹果汁" />
                <el-table-column :show-overflow-tooltip="true" align="center" prop="pgz900" label="900苹果汁" />
                <el-table-column :show-overflow-tooltip="true" align="center" prop="mgbl300" width="120"
                    label="300芒果菠萝汁" />
                <el-table-column :show-overflow-tooltip="true" align="center" prop="mgbl900" width="120"
                    label="900芒果菠萝汁" />
               
            </el-table-column>
            <el-table-column :show-overflow-tooltip="true" align="center" prop="Qtnmer" label="其它" />
            <el-table-column prop="sum" align="center" label="小计" />
        </el-table>
    </div>
</template>

<script>
import * as api from '@/api/frame/customer.js'
import * as echarts from 'echarts';
import AddOrUpdate from './Singlelimt'
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
                    id: '1520100033',
                    name: 'yzs380'
                },
                {
                    id: '1520100054',
                    name: 'js455'
                },

                {
                    id: '1520100053',
                    name: 'ylr450'
                },
                {
                    id: '1520100052',
                    name: 'ylr200'
                },

                {
                    id: '1520100051',
                    name: 'js180'
                },


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
                //     id: 'Y0003',
                //     name: 'le003'
                // },
                {
                    id: '3520100002',
                    name: 'xyw1'
                },
                {
                    id: '3520100012',
                    name: 'xbt1'
                },
                {
                    id: '3520100010',
                    name: 'dbt1'
                },
                {
                    id: '3520100001',
                    name: 'dyw1'
                },

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

                {
                    id: '3520100006',
                    name: 'xqxjsh'
                },
                {
                    id: '3520100011',
                    name: 'yznr330h'
                },
                {
                    id: 'HBLK002',
                    name: 'HBLK002'
                },
                {
                    id: 'HBLK003',
                    name: 'HBLK003'
                },
                {
                    id: 'HBLK004',
                    name: 'HBLK004'
                },
                {
                    id: 'HNYZ0001',
                    name: 'HNYZ0001'
                },
                {
                    id: 'HNYZ0002',
                    name: 'HNYZ0002'
                },
                {
                    id: 'HNYZ0003',
                    name: 'HNYZ0003'
                },
                {
                    id: 'HNYZ0004',
                    name: 'HNYZ0004'
                },
                {
                    id: 'SCLK0001',
                    name: 'SCLK0001'
                },
                {
                    id: 'SCLK0002',
                    name: 'SCLK0002'
                },
                {
                    id: 'HFZF001',
                    name: 'HFZF001'
                },
                {
                    id: 'HFZF002',
                    name: 'HFZF002'
                },
                {
                    id: 'HFZF003',
                    name: 'HFZF003'
                },
                {
                    id: 'HFZF004',
                    name: 'HFZF004'
                },
                {
                    id: 'HFZF006',
                    name: 'HFZF006'
                },
                {
                    id: '1520100019',
                    name: 'gmxxmc900'
                },
                {
                    id: '1520100018',
                    name: 'gmxxmc420'
                },
                {
                    id: 'HBLK007',
                    name: 'HBLK007'
                },
                {
                    id: 'HBLK001',
                    name: 'HBLK001'
                },
                {
                    id: '1520100047',
                    name: 'CGB950'
                },
                {
                    id: '1520100048',
                    name: 'YXB950'
                },
                {
                    id: '1520100034',
                    name: 'yzs1l'
                },
                {
                    id: '1520100049',
                    name: 'yqb36'
                },
            ],
            dataForm: {
                p_vouchdatestart: '',
                p_vouchdateend: ''
            },
            p_orgname: '',
            dataForm1: {
                blurry: '',
            },
            custList: [],
            zdname: '',
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
            allArray: ''
        };
    },
    mounted() {
        this.getDataList();
        this.initializeChart();
        this.getcustList()

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
                    path: '/proSalesALL/SingleDetails',
                    query: {
                        param1: '',
                        enddata: this.dataForm.p_vouchdateend,
                        startdate: this.dataForm.p_vouchdatestart
                    }
                });
            } else {
                this.$router.push({
                    path: '/proSalesALL/SingleDetails',
                    query: {
                        param1: this.zdname,
                        enddata: this.dataForm.p_vouchdateend,
                        startdate: this.dataForm.p_vouchdatestart
                    }
                });
            }
        },
        getDataList1(data, index) {
            this.show = true
            this.type = index
            this.exshow = false
            this.startTime = this.dataForm.p_vouchdatestart
            this.endTime = this.dataForm.p_vouchdateend
            this.zdname = data
            this.message = data
            this.p_orgname = data
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
        exportData() {
            this.$confirm('是否导出表格数据到Excel?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {

                exportExcel(this.allArray, '单品销量表.xlsx')

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
        mergeByName(arr) {
            return Object.values(
                arr.reduce((acc, obj) => {
                    const { nAME, box, cProductCode, cProductName, cSiteName, cname, ocustomerClass_name, sqname, ...rest } = obj;

                    if (!acc[nAME]) {
                        acc[nAME] = { nAME, box, cProductCode, cProductName, cSiteName, cname, ocustomerClass_name, sqname };
                    }

                    // 累加除了特定字段之外的值  
                    for (const [key, value] of Object.entries(rest)) {
                        acc[nAME][key] = (acc[nAME][key] || 0) + value;
                    }

                    return acc;
                }, {})
            );
        },
        // assignSum(dataArray) {
        //     const excludeFields = ['box', 'cProductCode', 'cProductName', 'cSiteName', 'cname', 'nAME', 'ocustomerClass_name', 'sqname'];

        //     return dataArray.map(obj => {
        //         // 计算sum  
        //         const sum = Object.keys(obj).reduce((acc, key) => {
        //             // 如果当前键不在排除列表，累加其值  
        //             if (!excludeFields.includes(key)) {
        //                 acc += obj[key];
        //             }
        //             return acc;
        //         }, 0);

        //         // 赋值给sum字段  
        //         return {
        //             ...obj, // 保留其他字段  
        //             sum: sum // 添加sum字段  
        //         };
        //     });
        // },


        sumAndAdd(dataArray) {
            // 计算并添加合计对象  
            const sumObject = dataArray.reduce((acc, obj) => {
                Object.keys(obj).forEach(key => {
                    // 过滤出不需要的字段  
                    if (!["box", "cProductCode", "cProductName", "cSiteName", "cname", "nAME", "ocustomerClass_name", "sqname"].includes(key)) {
                        // 转换为数字并累计和  
                        const value = parseFloat(obj[key]) || 0; // 确保转换为数字，如果转换失败则使用0  
                        acc[key] = (acc[key] || 0) + value; // 累加到对应字段  
                    }
                });
                return acc;
            }, {});

            // 确保数值保留两位小数  
            const roundedSumObject = Object.fromEntries(
                Object.entries(sumObject).map(([key, value]) => [key, parseFloat(value.toFixed(2))])
            );

            // 设置合计对象的 ocustomerClass_name 字段  
            const totalObject = {
                cSiteName: "",
                cname: "",
                nAME: "合计",
                ocustomerClass_name: "",
                sqname: "",
                ...roundedSumObject,
            };

            // 将合计对象添加到原数组中  
            dataArray.push(totalObject);
            return dataArray;
        },



        //表格数据
        getDataList() {
            this.fetchData();
            this.show = false,
                this.dataListLoading = true
            api.productonesellsite(this.dataForm).then(res => {
                this.dataList = res
                this.dataList.forEach(item => {
                    if (item.cProductCode == 'HBLK007') {
                        item.box = item.box / 40
                    }
                })

                this.dataList = Object.values(this.dataList.reduce((acc, item) => {
                    const key = `${item.cProductCode}-${item.cSiteName}-${item.ocustomerClass_name}-${item.sqname}-${item.cname} `; // 生成唯一键  
                    if (!acc[key]) {
                        // 如果不存在该键，则创建一个新的对象  
                        acc[key] = {
                            cProductCode: item.cProductCode,
                            cProductName: item.cProductName,
                            sqname: item.sqname,
                            ocustomerClass_name: item.ocustomerClass_name,
                            cSiteName: item.cSiteName,
                            cname: item.cname,
                            nAME: item.nAME,
                            box: 0, // 初始化 box 为 0  
                        };
                    }
                    // 将 box 转换为数字并相加  
                    acc[key].box += Number(item.box);

                    return acc;
                }, {}));

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
                //去除这些对象
                this.dataList = this.dataList.map(({ box, cProductCode, cProductName, product_class_pname, attribute, ...rest }) => rest);

                const mergedData = this.mergeByName(this.dataList);

                console.log(mergedData, 'mergedData')

                //计算小计
                const updatedArray = mergedData.map(obj => {
                    // 计算非指定字段的和  
                    const sum = Object.keys(obj)
                        .filter(key => !["cSiteName", "cname", "nAME", "ocustomerClass_name", "sqname"].includes(key))
                        .reduce((acc, key) => {
                            // 转换为数字并相加，确保即使是字符串也会被正确转换  
                            const value = Number(obj[key]);
                            return acc + (typeof value === 'number' && !isNaN(value) ? value : 0);
                        }, 0);

                    // 转换为带有两位小数的数字  
                    const formattedSum = parseFloat(sum.toFixed(2));

                    return { ...obj, sum: formattedSum }; // 返回新对象，包含原有字段和计算的 sum 字段  
                });

                this.allArray = this.sumAndAdd(updatedArray);

                console.log(this.allArray, 'allArray');


                this.allArray = this.allArray.map(item => {

                    return {
                        ...item, // 保留所有原有字段  
                        dbt: ((Number(item.dbt) || 0) + (Number(item.dbt1) || 0)).toFixed(2), // 更新 dbt 字段  
                        xbt: ((Number(item.xbt) || 0) + (Number(item.xbt1) || 0)).toFixed(2), // 更新 xbt 字段  
                        bigyuanwei: ((Number(item.bigyuanwei) || 0) + (Number(item.dyw1) || 0)).toFixed(2), // 更新 bigyuanwei 字段  
                        smallyuanwei: ((Number(item.smallyuanwei) || 0) + (Number(item.xyw1) || 0)).toFixed(2), // 更新 smallyuanwei 字段  le003 yzz24599 HBLK004
                        yzz245: ((Number(item.yzz245) || 0) + (Number(item.yzz245h) || 0) + (Number(item.yzz24541) || 0) + (Number(item.yzz24599) || 0) + (Number(item.HBLK004) || 0) + (Number(item.HNYZ0004) || 0) + (Number(item.HFZF006) || 0)).toFixed(2),
                        lyzz1: ((Number(item.lyzz1) || 0) + (Number(item.yzz1Lh) || 0) + (Number(item.yzz1ll) || 0) + (Number(item.HNYZ0001) || 0) + (Number(item.SCLK0001) || 0) + (Number(item.HFZF001) || 0) + (Number(item.HBLK001) || 0)).toFixed(2),
                        yzz300: ((Number(item.yzz300) || 0) + (Number(item.yzz300h) || 0) + (Number(item.yzz30043) || 0) + (Number(item.HBLK003) || 0) + (Number(item.HNYZ0003) || 0) + (Number(item.HFZF003) || 0)).toFixed(2),
                        hpyzz125: ((Number(item.hpyzz125) || 0) + (Number(item.yzz125Lh) || 0) + (Number(item.yzz125red) || 0) + (Number(item.HBLK002) || 0) + (Number(item.HNYZ0002) || 0) + (Number(item.SCLK0002) || 0) + (Number(item.HFZF002) || 0)).toFixed(2),
                        lkyzz300: ((Number(item.lkyzz300) || 0) + (Number(item.yzz300h1) || 0) + (Number(item.HFZF004) || 0) + (Number(item.HBLK007) || 0)).toFixed(2),
                        yz330: ((Number(item.yz330) || 0) + (Number(item.yznr330h) || 0)).toFixed(2),
                        xjs: ((Number(item.xjs) || 0) + (Number(item.xqxjsh) || 0)).toFixed(2),
                        cgb970: ((Number(item.cgb970) || 0) + (Number(item.CGB950) || 0)).toFixed(2),
                        yxb970: ((Number(item.yxb970) || 0) + (Number(item.YXB950) || 0)).toFixed(2),
                        yxb300: ((Number(item.yxb300) || 0) + (Number(item.yqb36) || 0)).toFixed(2),
                    };
                });
                this.allArray.forEach(item => {
                    const xqmcValue = parseFloat(item.xqmc) || 0; // 如果没有值，则取0  
                    const gm1lValue = parseFloat(item.gm1l) || 0; // 如果没有值，则取0  
                    const pcbValue = parseFloat(item.pcb) || 0;
                    const gmxxmc900 = parseFloat(item.gmxxmc900) || 0;
                    const gmxxmc420 = parseFloat(item.gmxxmc420) || 0;
                    item.Qtnmer = xqmcValue + gm1lValue + pcbValue + gmxxmc900 + gmxxmc420; // 计算和并赋值给新字段
                    item.sum = item.sum.toFixed(2);

                });

                // console.log(this.dataList, 115566)
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
    font-size: 12px;
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
    font-size: 13px;
    font-weight: 600;
}
</style>