<template>
    <div class='textPICTURE'>
        <el-form :inline="true" style="width: 100%; margin: 0 auto;">

            <el-form-item>
                <el-date-picker v-model="dataForm.queryDate" value-format="yyyy-MM-dd" type="date" placeholder="结束日期"
                    clearable style="width: 100%"></el-date-picker>
            </el-form-item>
            <el-form-item>
                <el-button class="filter-item" size="mini" type="success" icon="el-icon-search"
                    @click="getDateList()">查询</el-button>
            </el-form-item>
        </el-form>
        <el-button size="mini" type="success" v-if="showExportButton" @click="saveAsImage">保存图片</el-button>
        <div id="container">
            <img class="picimg" src="../../assets/images/毛利率.jpg"></img>
            <div class="test">{{ month1 }}</div>
            <div class="test1">{{ month1 }}</div>
            <div class="test2">{{ GrossProfit }}</div>
            <div class="test3">{{ GrossProfitMargin }}</div>
            <div class="test4">{{ GpaPercentage }}</div>
            <div class="test5">{{ GpmPercentage }}</div>

            <div v-for="(item, index) in topTen" :class="`test6-${index + 1}`">
                <div class="col-1">{{ item.custclass_name }}</div>
                <div class="col-2">{{ item.customer_name }}</div>
                <div class="col-3">{{ item.grossProfitMargin }}</div>
            </div>
            <div v-for="(item, index) in backTen" :class="`test7-${index + 1}`">
                <div class="col-1-1">{{ item.custclass_name }}</div>
                <div class="col-2-1">{{ item.customer_name }}</div>
                <div class="col-3-1">{{ item.grossProfitMargin }}</div>
            </div>
            <!-- <div v-for="(item, index) in topTen" :key="index" class="rank-item">
                <div :class="`test${6 + index * 3}`">{{ item.custclass_name }}</div>
                <div :class="`test${7 + index * 3}`">{{ item.customer_name }}</div>
                <div :class="`test${8 + index * 3}`">{{ item.grossProfitMargin }}</div>
            </div> -->

        </div>

    </div>
</template>

<script>
import html2canvas from "html2canvas";
import { EventBus } from '@/utils/eventBus';
import axios from 'axios';
import {
    mapGetters,
} from 'vuex'
export default {
    name: 'textPICTURE-page',
    data() {
        return {
            msg: 'textPICTURE-page',
            dataForm: {
                queryDate: ''
            },
            dataList: [],
            dataListaLL: [],
            topTen: [],
            backTen: [],
            year: '',
            month1: '',
            day: '',
            showExportButton: false,
            GrossProfit: '',//毛利额 
            GrossProfitMargin: '',//毛利率
            GpaPercentage: '',//环比毛利额
            GpmPercentage: '',// 环比毛利率
            TheFirstPlace: '',//第一位
            SecondPlace: '',//第二位
            TheThirdPlace: '',//第三位
            testList: [
                {
                    "ari_local_money_de": 459,
                    "customer": "1001A1100000005RT36B",
                    "customer_name": "青山旺角批发部",
                    "grossProfitMargin": -328.45,
                    "custclass_name": "广东云帆供应链管理有限公司",
                    "pk_org_v": "0001A11000000000ERCD",
                    "pob_norigmny": 1856.23,
                    "result": -1423.67
                },
                {
                    "ari_local_money_de": 287,
                    "customer": "1001A1100000007TY42C",
                    "customer_name": "滨江恒通贸易商行",
                    "grossProfitMargin": -187.32,
                    "custclass_name": "上海远航食品有限公司",
                    "pk_org_v": "0001A11000000000FWDE",
                    "pob_norigmny": 3245.78,
                    "result": -2156.39
                },
                {
                    "ari_local_money_de": 512,
                    "customer": "1001A1100000009YU58D",
                    "customer_name": "城东兴盛百货店",
                    "grossProfitMargin": -476.19,
                    "custclass_name": "北京天宇商贸集团",
                    "pk_org_v": "0001A11000000000GXEF",
                    "pob_norigmny": 2789.45,
                    "result": -1987.62
                },
                {
                    "ari_local_money_de": 365,
                    "customer": "1001A1100000011VW64E",
                    "customer_name": "城西惠民供销站",
                    "grossProfitMargin": -254.78,
                    "custclass_name": "江苏汇通餐饮管理有限公司",
                    "pk_org_v": "0001A11000000000HYFG",
                    "pob_norigmny": 1654.32,
                    "result": -1245.87
                },
                {
                    "ari_local_money_de": 621,
                    "customer": "1001A1100000013SU70F",
                    "customer_name": "城南恒信批发中心",
                    "grossProfitMargin": -612.54,
                    "custclass_name": "浙江恒丰食品供应链有限公司",
                    "pk_org_v": "0001A11000000000JZGH",
                    "pob_norigmny": 3542.89,
                    "result": -2876.32
                },
                {
                    "ari_local_money_de": 298,
                    "customer": "1001A1100000015PR76G",
                    "customer_name": "城北兴旺零售店",
                    "grossProfitMargin": -198.65,
                    "custclass_name": "四川鑫源商贸有限公司",
                    "pk_org_v": "0001A11000000000KAIJ",
                    "pob_norigmny": 2156.78,
                    "result": -1568.43
                },
                {
                    "ari_local_money_de": 412,
                    "customer": "1001A1100000017MN82H",
                    "customer_name": "河东润发商贸行",
                    "grossProfitMargin": -376.21,
                    "custclass_name": "湖北瑞丰供应链管理有限公司",
                    "pk_org_v": "0001A11000000000LBKK",
                    "pob_norigmny": 1987.65,
                    "result": -1456.98
                },
                {
                    "ari_local_money_de": 578,
                    "customer": "1001A1100000019KL88J",
                    "customer_name": "河西恒通批发部",
                    "grossProfitMargin": -523.87,
                    "custclass_name": "福建永辉食品有限公司",
                    "pk_org_v": "0001A11000000000MCLL",
                    "pob_norigmny": 3265.41,
                    "result": -2547.89
                },
                {
                    "ari_local_money_de": 325,
                    "customer": "1001A1100000021JJ94K",
                    "customer_name": "南山兴盛百货商行",
                    "grossProfitMargin": 245.36,
                    "custclass_name": "安徽汇通供应链有限公司",
                    "pk_org_v": "0001A11000000000NDMM",
                    "pob_norigmny": 1754.23,
                    "result": -1326.78
                },
                {
                    "ari_local_money_de": 496,
                    "customer": "1001A1100000023HH00L",
                    "customer_name": "北山惠民贸易中心",
                    "grossProfitMargin": 412.78,
                    "custclass_name": "湖南恒信商贸集团",
                    "pk_org_v": "0001A11000000000OENN",
                    "pob_norigmny": 2845.67,
                    "result": -2158.90
                },
                {
                    "ari_local_money_de": 275,
                    "customer": "1001A1100000025FF06M",
                    "customer_name": "东城恒丰零售店",
                    "grossProfitMargin": 186.45,
                    "custclass_name": "陕西鑫源食品有限公司",
                    "pk_org_v": "0001A11000000000PFOP",
                    "pob_norigmny": 2056.34,
                    "result": -1547.89
                },
                {
                    "ari_local_money_de": 532,
                    "customer": "1001A1100000027DD12N",
                    "customer_name": "西城润发批发站",
                    "grossProfitMargin": 487.65,
                    "custclass_name": "山东瑞丰供应链管理有限公司",
                    "pk_org_v": "0001A11000000000QGQQ",
                    "pob_norigmny": 3145.89,
                    "result": -2467.32
                },
                {
                    "ari_local_money_de": 389,
                    "customer": "1001A1100000029BB18P",
                    "customer_name": "南城兴旺商贸行",
                    "grossProfitMargin": 312.54,
                    "custclass_name": "河南汇通食品有限公司",
                    "pk_org_v": "0001A11000000000RHRS",
                    "pob_norigmny": 1965.43,
                    "result": -1478.65
                },
                {
                    "ari_local_money_de": 594,
                    "customer": "1001A1100000031ZZ24Q",
                    "customer_name": "北城恒通批发中心",
                    "grossProfitMargin": 543.21,
                    "custclass_name": "河北永辉供应链管理有限公司",
                    "pk_org_v": "0001A11000000000SJTS",
                    "pob_norigmny": 3354.78,
                    "result": -2678.45
                },
                {
                    "ari_local_money_de": 315,
                    "customer": "1001A1100000033XX30R",
                    "customer_name": "中城惠民百货店",
                    "grossProfitMargin": 234.87,
                    "custclass_name": "江西恒丰商贸有限公司",
                    "pk_org_v": "0001A11000000000TKUT",
                    "pob_norigmny": 1687.54,
                    "result": -1256.98
                },
                {
                    "ari_local_money_de": 476,
                    "customer": "1001A1100000035VV36S",
                    "customer_name": "港务区润发贸易商行",
                    "grossProfitMargin": 398.76,
                    "custclass_name": "重庆鑫源供应链管理有限公司",
                    "pk_org_v": "0001A11000000000ULVU",
                    "pob_norigmny": 2754.32,
                    "result": -2045.78
                },
                {
                    "ari_local_money_de": 293,
                    "customer": "1001A1100000037UU42T",
                    "customer_name": "高新区恒信批发部",
                    "grossProfitMargin": -195.43,
                    "custclass_name": "天津瑞丰食品有限公司",
                    "pk_org_v": "0001A11000000000VLWV",
                    "pob_norigmny": 2145.67,
                    "result": -1654.32
                },
                {
                    "ari_local_money_de": 548,
                    "customer": "1001A1100000039SS48U",
                    "customer_name": "经开区兴盛贸易中心",
                    "grossProfitMargin": -512.34,
                    "custclass_name": "辽宁汇通供应链有限公司",
                    "pk_org_v": "0001A11000000000WLWW",
                    "pob_norigmny": 3287.45,
                    "result": -2576.98
                },
                {
                    "ari_local_money_de": 367,
                    "customer": "1001A1100000041RR54V",
                    "customer_name": "保税区惠民批发站",
                    "grossProfitMargin": -287.65,
                    "custclass_name": "吉林恒信食品有限公司",
                    "pk_org_v": "0001A11000000000XLXX",
                    "pob_norigmny": 1876.54,
                    "result": -1354.87
                },
                {
                    "ari_local_money_de": 509,
                    "customer": "1001A1100000043PP60W",
                    "customer_name": "自贸区润发零售店",
                    "grossProfitMargin": -465.78,
                    "custclass_name": "黑龙江永辉商贸集团",
                    "pk_org_v": "0001A11000000000YLXY",
                    "pob_norigmny": 2965.32,
                    "result": -2245.67
                }
            ]

        };
    },
    created() {
        // 也可以在created/mounted等生命周期中获取
        this.calculateDates()
        // console.log('从Vuex获取的数据:', this.$store.state.dataList)
    },
    mounted() {
        // EventBus.$emit('triggerGetDataList');
        this.getDateList()
    },
    methods: {

        //获取时间
        calculateDates() {
            const today = new Date();
            // 获取当前月份的月初时间 
            const startOfMonthDate = new Date(today.getFullYear(), today.getMonth(), 1);
            this.startOfMonth = this.formatDate(startOfMonthDate);

            // 获取截至今天的时间 
            this.endOfToday = this.formatDate(today);
            this.dataForm.p_vouchdatestart = this.startOfMonth
            this.dataForm.queryDate = this.endOfToday
            console.log(this.dataForm.p_vouchdateend)
        },
        formatDate(date) {
            this.year = date.getFullYear();
            this.month = String(Number(date.getMonth() + 1));
            this.day = String(date.getDate()).padStart(2, '0');
            return `${this.year}-${this.month}-${this.day}`;
        },
        async getDateList() {
            this.month1 = parseInt(this.dataForm.queryDate.split('-')[1]);

            const isDev = process.env.NODE_ENV === 'development';
            const baseURL = isDev ? 'http://153.0.158.115:8180' : '';
            const response = await axios.get(
                `${baseURL}/uapws/rest/wms/getGrossProfitMargin?queryDate=${this.dataForm.queryDate}`,

            );
            if (response.data.restCode == 200) {
                this.dataList = response.data.data[0].currDetailList
                this.dataListaLL = response.data.data[0]
                // this.dataList = [...this.dataList, ...this.testList]
                this.dataList.sort((a, b) => {
                    const valueA = a.grossProfitMargin || 0;
                    const valueB = b.grossProfitMargin || 0;

                    // 如果都是正数或都是负数，按数值大小排序
                    if (valueA >= 0 && valueB >= 0) {
                        return valueB - valueA; // 正数从大到小
                    } else if (valueA < 0 && valueB < 0) {
                        return valueB - valueA; // 负数从小到大
                    } else {
                        // 一个正数一个负数，正数排在前面
                        return valueB >= 0 ? 1 : -1;
                    }
                });

                console.log(this.dataList, 666)
                this.dataList = this.dataList.map(item => {
                    return {
                        ...item,
                        grossProfitMargin: item.grossProfitMargin + '%'
                    };
                });
                if (this.dataList.length <= 10) {
                    // 获取前10个对象
                    this.topTen = this.dataList.slice(0, 10);
                } else {
                    // 获取前10个对象
                    this.topTen = this.dataList.slice(0, 10);
                    // 获取后10个对象
                    this.backTen = this.dataList.slice(-10);
                }



                console.log(this.topTen, this.backTen, 77777)
                this.GrossProfit = this.dataListaLL.currGpAmount//毛利额
                this.GrossProfitMargin = this.dataListaLL.currGrossProfitMargin + '%'//毛利率
                this.GpaPercentage = this.dataListaLL.gpaPercentage//环比毛利额
                this.GpmPercentage = this.dataListaLL.gpmPercentage//环比毛利率

                console.log(this.GrossProfit, this.GrossProfitMargin, this.GpaPercentage, this.GpmPercentage)
                // this.TheFirstPlace = this.dataList[0]
                // this.SecondPlace = this.dataList[1]
                // this.TheThirdPlace = this.dataList[2]
                // console.log(this.TheFirstPlace)
                // console.log(this.dataList)
                // console.log(this.dataListaLL)
                this.showExportButton = true
            } else {
                // alert(response.data.msg)
                this.$message.warning(response.data.msg)
                console.log(9999)
                this.topTen = ''
                this.backTen = ''
                this.GrossProfit = ''//毛利额
                this.GrossProfitMargin = ''//毛利率
                this.GpaPercentage = ''//环比毛利额
                this.GpmPercentage = ''//环比毛利率

            }
            console.log(response)
        },
        async saveAsImage() {
            try {
                // 1. 获取要截图的 DOM 元素
                const element = document.getElementById("container");
                if (!element) {
                    alert("未找到截图区域！");
                    return;
                }

                // 2. 使用 html2canvas 渲染 Canvas
                const canvas = await html2canvas(element, {
                    backgroundColor: null, // 透明背景
                    scale: 2, // 提高清晰度
                    useCORS: true, // 允许跨域图片（如有外部图片）
                });

                // 3. 转换为图片并下载
                const imgData = canvas.toDataURL("image/png");
                const link = document.createElement("a");
                link.href = imgData;
                link.download = "snapshot.png"; // 下载文件名
                link.click();

                console.log("截图保存成功！");
            } catch (err) {
                console.error("截图失败:", err);
                alert("截图失败，请重试！");
            }
        },
    }
};
</script>

<style scoped lang="scss">
#container {
    position: relative;
    width: 1200px;
    margin: 0 auto;
}

.picimg {
    width: 100%;
}

.test {
    position: absolute;
    top: 26%;
    right: 32.5%;
    font-size: 30px;
    font-family: Microsoft YaHei;
    font-weight: 600;
    color: #c00000;
}

.test1 {
    position: absolute;
    top: 26%;
    left: 22%;
    font-size: 30px;
    font-family: Microsoft YaHei;
    font-weight: 600;
    color: #c00000;
}

.test2 {
    position: absolute;
    top: 20%;
    left: 22%;
    font-size: 30px;
    font-family: Microsoft YaHei;
    font-weight: 600;
    color: #c00000;
}

.test3 {
    position: absolute;
    top: 20%;
    right: 26%;
    font-size: 30px;
    font-family: Microsoft YaHei;
    font-weight: 600;
    color: #c00000;
}

.test4 {
    position: absolute;
    top: 34%;
    left: 28%;
    font-size: 22px;
    font-family: Microsoft YaHei;
    font-weight: 600;
    color: #c00000;
}

.test5 {
    position: absolute;
    top: 34%;
    left: 69%;
    font-size: 20px;
    font-family: Microsoft YaHei;
    font-weight: 600;
    color: #c00000;
}

.test6-1 {
    display: flex;
    // gap: 5px;
    position: absolute;
    top: 51.2%;
    left: 10.5%;
    font-size: 12px;
    font-family: Microsoft YaHei;
    font-weight: 600;
    // color: #000000;
}

.test6-2 {
    display: flex;
    // gap: 5px;
    position: absolute;
    top: 55.2%;
    left: 10.5%;
    font-size: 12px;
    font-family: Microsoft YaHei;
    font-weight: 600;
    // color: #000000;
}

.test6-3 {
    display: flex;
    // gap: 5px;
    position: absolute;
    top: 59.2%;
    left: 10.5%;
    font-size: 12px;
    font-family: Microsoft YaHei;
    font-weight: 600;
    // color: #000000;
}

.test6-4 {
    display: flex;
    // gap: 5px;
    position: absolute;
    top: 63.2%;
    left: 10.5%;
    font-size: 12px;
    font-family: Microsoft YaHei;
    font-weight: 600;
    // color: #000000;
}

.test6-5 {
    display: flex;
    // gap: 5px;
    position: absolute;
    top: 67.2%;
    left: 10.5%;
    font-size: 12px;
    font-family: Microsoft YaHei;
    font-weight: 600;
    // color: #000000;
}

.test6-6 {
    display: flex;
    // gap: 5px;
    position: absolute;
    top: 71.5%;
    left: 10.5%;
    font-size: 12px;
    font-family: Microsoft YaHei;
    font-weight: 600;
    // color: #000000;
}

.test6-7 {
    display: flex;
    // gap: 5px;
    position: absolute;
    top: 75.5%;
    left: 10.5%;
    font-size: 12px;
    font-family: Microsoft YaHei;
    font-weight: 600;
    // color: #000000;
}

.test6-8 {
    display: flex;
    // gap: 5px;
    position: absolute;
    top: 79.5%;
    left: 10.5%;
    font-size: 12px;
    font-family: Microsoft YaHei;
    font-weight: 600;
    // color: #000000;
}

.test6-9 {
    display: flex;
    // gap: 5px;
    position: absolute;
    top: 83.8%;
    left: 10.5%;
    font-size: 12px;
    font-family: Microsoft YaHei;
    font-weight: 600;
    // color: #000000;
}

.test6-10 {
    display: flex;
    // gap: 5px;
    position: absolute;
    top: 87.7%;
    left: 10.5%;
    font-size: 12px;
    font-family: Microsoft YaHei;
    font-weight: 600;
    // color: #000000;
}

.test7-1 {
    display: flex;
    // gap: 5px;
    position: absolute;
    top: 51.2%;
    left: 51%;
    font-size: 12px;
    font-family: Microsoft YaHei;
    font-weight: 600;
    // color: #000000;
}

.test7-2 {
    display: flex;
    // gap: 5px;
    position: absolute;
    top: 55.2%;
    left: 51%;
    font-size: 12px;
    font-family: Microsoft YaHei;
    font-weight: 600;
    // color: #000000;
}

.test7-3 {
    display: flex;
    // gap: 5px;
    position: absolute;
    top: 59.2%;
    left: 51%;
    font-size: 12px;
    font-family: Microsoft YaHei;
    font-weight: 600;
    // color: #000000;
}

.test7-4 {
    display: flex;
    // gap: 5px;
    position: absolute;
    top: 63.2%;
    left: 51%;
    font-size: 12px;
    font-family: Microsoft YaHei;
    font-weight: 600;
    // color: #000000;
}

.test7-5 {
    display: flex;
    // gap: 5px;
    position: absolute;
    top: 67.2%;
    left: 51%;
    font-size: 12px;
    font-family: Microsoft YaHei;
    font-weight: 600;
    // color: #000000;
}

.test7-6 {
    display: flex;
    // gap: 5px;
    position: absolute;
    top: 71.5%;
    left: 51%;
    font-size: 12px;
    font-family: Microsoft YaHei;
    font-weight: 600;
    // color: #000000;
}

.test7-7 {
    display: flex;
    // gap: 5px;
    position: absolute;
    top: 75.5%;
    left: 51%;
    font-size: 12px;
    font-family: Microsoft YaHei;
    font-weight: 600;
    // color: #000000;
}

.test7-8 {
    display: flex;
    // gap: 5px;
    position: absolute;
    top: 79.7%;
    left: 51%;
    font-size: 12px;
    font-family: Microsoft YaHei;
    font-weight: 600;
    // color: #000000;
}

.test7-9 {
    display: flex;
    // gap: 5px;
    position: absolute;
    top: 83.7%;
    left: 51%;
    font-size: 12px;
    font-family: Microsoft YaHei;
    font-weight: 600;
    // color: #000000;
}

.test7-10 {
    display: flex;
    // gap: 5px;
    position: absolute;
    top: 87.7%;
    left: 51%;
    font-size: 12px;
    font-family: Microsoft YaHei;
    font-weight: 600;
    // color: #000000;
}

/* 固定每个列的宽度 */
.col-1 {
    width: 120px;
    text-align: center;
    color: #000000;
}

.col-2 {
    width: 248px;
    font-size: 12px;
    text-align: center;
    color: #ffffff;
}

.col-3 {
    width: 100px;
    text-align: center;
}

/* 固定每个列的宽度 */
.col-1-1 {
    width: 120px;
    text-align: center;
    color: #000000;
}

.col-2-1 {
    width: 248px;
    text-align: center;
    color: #ffffff;
}

.col-3-1 {
    width: 100px;
    text-align: center;
}

.test6 {
    position: absolute;
    top: 51.2%;
    left: 10.5%;
    font-size: 12px;
    font-family: Microsoft YaHei;
    font-weight: 600;
    color: #000000;
}

.test7 {
    position: absolute;
    top: 50.9%;
    left: 26%;
    font-size: 15px;
    font-family: Microsoft YaHei;
    font-weight: 600;
    color: #ffffff;
}

.test8 {
    position: absolute;
    top: 50.9%;
    left: 41%;
    font-size: 17px;
    font-family: Microsoft YaHei;
    font-weight: 600;
    color: #000000;
}

.test9 {
    position: absolute;
    top: 55.5%;
    left: 10.5%;
    font-size: 12px;
    font-family: Microsoft YaHei;
    font-weight: 600;
    color: #000000;

}

.test10 {
    position: absolute;
    top: 55.3%;
    left: 26%;
    font-size: 15px;
    font-family: Microsoft YaHei;
    font-weight: 600;
    color: #ffffff;
}

.test11 {
    position: absolute;
    top: 55%;
    left: 41%;
    font-size: 17px;
    font-family: Microsoft YaHei;
    font-weight: 600;
    color: #000000;

}

.test12 {
    position: absolute;
    top: 59.6%;
    left: 10.5%;
    font-size: 12px;
    font-family: Microsoft YaHei;
    font-weight: 600;
    color: #000000;
}

.test13 {
    position: absolute;
    top: 58.9%;
    left: 26%;
    font-size: 15px;
    font-family: Microsoft YaHei;
    font-weight: 600;
    color: #ffffff;
}

.test14 {
    position: absolute;
    top: 58.9%;
    left: 41%;
    font-size: 17px;
    font-family: Microsoft YaHei;
    font-weight: 600;
    color: #000000;
}

.test15 {
    position: absolute;
    top: 64%;
    left: 10.5%;
    font-size: 12px;
    font-family: Microsoft YaHei;
    font-weight: 600;
    color: #000000;
}

.test16 {
    position: absolute;
    top: 62.9%;
    left: 26%;
    font-size: 15px;
    font-family: Microsoft YaHei;
    font-weight: 600;
    color: #ffffff;
}

.test17 {
    position: absolute;
    top: 62.9%;
    left: 41%;
    font-size: 17px;
    font-family: Microsoft YaHei;
    font-weight: 600;
    color: #000000;
}

.test18 {
    position: absolute;
    top: 67.5%;
    left: 10.5%;
    font-size: 12px;
    font-family: Microsoft YaHei;
    font-weight: 600;
    color: #000000;
}

.test19 {
    position: absolute;
    top: 67.2%;
    left: 26%;
    font-size: 15px;
    font-family: Microsoft YaHei;
    font-weight: 600;
    color: #ffffff;
}

.test20 {
    position: absolute;
    top: 67.2%;
    left: 41%;
    font-size: 17px;
    font-family: Microsoft YaHei;
    font-weight: 600;
    color: #000000;
}
</style>