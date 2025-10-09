<template>
    <div class='textPICTURE'>

        <el-button size="mini" type="success" @click="saveAsImage">保存图片</el-button>
        <div id="container">
            <img class="picimg" src="../../assets/images/文字.jpg"></img>
            <div class="test">{{ month }}</div>
            <div class="test1">{{ lowTarget }}</div><!-- 低温目标 -->
            <div class="test2">{{ month }}</div>
            <div class="test3">{{ day }}</div>
            <div class="test4">{{ daybox }}</div><!-- 今日报单 -->
            <div class="test5">{{ Astoday }}</div><!-- 截至今日完成 -->
            <div class="test6">{{ Accmplish }}</div><!-- 平均完成率 -->
            <div class="test7">{{ daydiff }}</div><!-- 截至今日差额 -->
            <div class="test8">{{ Adddiff }}</div><!-- 全月累计差额 -->
            <div class="test9">{{ hndaydiff }}</div><!-- 湖南今日差额 -->
            <div class="test10">{{ csdaydiff }}</div><!-- 长沙今日差额 -->
            <div class="test11">{{ hbdaydiff }}</div><!-- 湖北今日差额 -->
            <div class="test12">{{ cddaydiff }}</div><!-- 成都今日差额 -->
            <div class="test13">{{ scdaydiff }}</div><!-- 四川今日差额 -->
            <div class="test14">{{ cqdaydiff }}</div><!-- 重庆今日差额 -->
            <div class="test15">{{ yndaydiff }}</div><!-- 云南今日差额 -->
            <div class="test16">{{ gzdaydiff }}</div><!-- 贵州今日差额 -->
            <div class="test17">{{ fjdaydiff }}</div><!-- 福建今日差额 -->
            <div class="test18">{{ jxdaydiff }}</div><!-- 江西今日差额 -->
            <div class="test19">{{ gddaydiff }}</div><!-- 广东今日差额 -->
            <div class="test20">{{ gxdaydiff }}</div><!-- 广西今日差额 -->
            <div class="test21">{{ handaydiff }}</div><!-- 海南今日差额 -->
            <div class="test22">{{ zjdaydiff }}</div><!-- 浙江今日差额 -->
            <div class="test23">{{ jsdaydiff }}</div><!-- 江苏今日差额 -->
            <div class="test24">{{ hzdaydiff }}</div><!-- 合资今日差额 -->
            <div class="test25">{{ hendaydiff }}</div><!-- 河南今日差额 -->
            <div class="test26">{{ sdndaydiff }}</div><!-- 山东今日差额 -->
            <div class="test27">{{ dbndaydiff }}</div><!-- 东北今日差额 -->

        </div>

    </div>
</template>

<script>
import html2canvas from "html2canvas";
import { EventBus } from '@/utils/eventBus';
import {
    mapGetters,
} from 'vuex'
export default {
    name: 'textPICTURE-page',
    data() {
        return {
            msg: 'textPICTURE-page',
            dataForm: {
                p_vouchdatestart: '',
                p_vouchdateend: ''
            },

            lowTarget: '',//低温目标
            daybox: '',//今日报单
            Astoday: '',//截至今日完成
            Accmplish: '',//平均完成率
            daydiff: '',//截至今日差额
            Adddiff: '',//全月累计差额
            hndaydiff: '',//湖南今日差额
            csdaydiff: '',//长沙今日差额
            hbdaydiff: '',//湖北今日差额
            cddaydiff: '',//成都今日差额
            scdaydiff: '',//四川今日差额
            cqdaydiff: '',//重庆今日差额
            yndaydiff: '',//云南今日差额
            gzdaydiff: '',//贵州今日差额
            fjdaydiff: '',//福建今日差额
            jxdaydiff: '',//江西今日差额
            gddaydiff: '',//广东今日差额
            gxdaydiff: '',//广西今日差额
            handaydiff: '',//海南今日差额
            zjdaydiff: '',//浙江今日差额
            jsdaydiff: '',//江苏今日差额
            hzdaydiff: '',//合资今日差额
            hendaydiff: '',//河南今日差额
            sdndaydiff: '',//山东今日差额
            dbndaydiff: '',//东北今日差额
            dataList: [],
            year: '',
            month: '',
            day: '',
        };
    },
    created() {
        // 也可以在created/mounted等生命周期中获取
        this.calculateDates()
        console.log('从Vuex获取的数据:', this.$store.state.dataList)
    },
    mounted() {
        EventBus.$emit('triggerGetDataList');
        this.getdataList()
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
            this.dataForm.p_vouchdateend = this.endOfToday
            console.log(this.dataForm.p_vouchdateend)
        },
        formatDate(date) {
            this.year = date.getFullYear();
            this.month = String(Number(date.getMonth() + 1));
            this.day = String(date.getDate()).padStart(2, '0');
            return `${this.year}-${this.month}-${this.day}`;
        },
        getdataList() {
            // 读取数据
            this.dataList = JSON.parse(sessionStorage.getItem('dataListCache'));
            console.log(this.dataList)
            this.lowTarget = (this.dataList.find(item => item.companyname === "全国总计").lowTask / 10000).toFixed(2);
            this.daybox = (this.dataList.find(item => item.companyname === "全国总计").box).toFixed(0)
            this.Astoday = parseInt(this.dataList.find(item => item.companyname === "全国总计").Astoday)
            this.Accmplish = this.dataList.find(item => item.companyname === "全国总计").Accmplish.replace('%', '');
            this.daydiff = (this.dataList.find(item => item.companyname === "全国总计").daydiff / 10000).toFixed(4)
            this.Adddiff = (this.dataList.find(item => item.companyname === "全国总计").Adddiff / 10000).toFixed(4)
            this.hndaydiff = (this.dataList.find(item => item.companyname === "小湖南小计").daydiff).toFixed(0)
            this.csdaydiff = (this.dataList.find(item => item.companyname === "长沙区域小计").daydiff).toFixed(0)
            this.hbdaydiff = (this.dataList.find(item => item.companyname === "湖北区域小计").daydiff).toFixed(0)
            this.cddaydiff = (this.dataList.find(item => item.companyname === "成都区域小计").daydiff).toFixed(0)
            this.scdaydiff = (this.dataList.find(item => item.companyname === "四川（除成都）小计").daydiff).toFixed(0)
            this.cqdaydiff = (this.dataList.find(item => item.companyname === "重庆小计").daydiff).toFixed(0)
            this.yndaydiff = (this.dataList.find(item => item.companyname === "云南小计").daydiff).toFixed(0)
            this.gzdaydiff = (this.dataList.find(item => item.companyname === "贵州省小计").daydiff).toFixed(0)
            this.fjdaydiff = (this.dataList.find(item => item.companyname === "福建小计").daydiff).toFixed(0)
            this.jxdaydiff = (this.dataList.find(item => item.companyname === "江西小计").daydiff).toFixed(0)
            this.gddaydiff = (this.dataList.find(item => item.companyname === "广东小计").daydiff).toFixed(0)
            this.gxdaydiff = (this.dataList.find(item => item.companyname === "广西小计").daydiff).toFixed(0)
            this.handaydiff = (this.dataList.find(item => item.companyname === "海南小计").daydiff).toFixed(0)
            this.zjdaydiff = (this.dataList.find(item => item.companyname === "浙江小计").daydiff).toFixed(0)
            this.jsdaydiff = (this.dataList.find(item => item.companyname === "江苏小计").daydiff).toFixed(0)
            this.hzdaydiff = (this.dataList.find(item => item.companyname === "合资公司合计").daydiff).toFixed(0)
            this.hendaydiff = (this.dataList.find(item => item.companyname === "河南省小计").daydiff).toFixed(0)
            this.sdndaydiff = (this.dataList.find(item => item.companyname === "山东小计").daydiff).toFixed(0)
            this.dbndaydiff = (this.dataList.find(item => item.companyname === "东北区域小计").daydiff).toFixed(0)
            console.log(this.lowTarget)
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
    width: 750px;
    margin: 0 auto;
}

.picimg {
    width: 100%;
}

.test1 {
    position: absolute;
    top: 15%;
    left: 38.8%;
    font-size: 16px;
    font-family: Microsoft YaHei;
    font-weight: 600;
    color: #c00000;
}
.test{
    position: absolute;
    top: 15%;
    left: 21.8%;
    font-size: 16px;
    font-family: Microsoft YaHei;
    font-weight: 600;
    color: #c00000;
}

.test2 {
    position: absolute;
    top: 18%;
    left: 22%;
    font-size: 16px;
    font-family: Microsoft YaHei;
    font-weight: 600;
    color: #c00000;
}

.test3 {
    position: absolute;
    top: 18%;
    left: 32%;
    font-size: 16px;
    font-family: Microsoft YaHei;
    font-weight: 600;
    color: #c00000;
}

.test4 {
    position: absolute;
    top: 20.7%;
    left: 27%;
    font-size: 16px;
    font-family: Microsoft YaHei;
    font-weight: 600;
    color: #c00000;
}

.test5 {
    position: absolute;
    top: 20.6%;
    left: 51%;
    font-size: 16px;
    font-family: Microsoft YaHei;
    font-weight: 600;
    color: #c00000;
}

.test6 {
    position: absolute;
    top: 23.1%;
    left: 38%;
    font-size: 17px;
    font-family: Microsoft YaHei;
    font-weight: 600;
    color: #c00000;
}

.test7 {
    position: absolute;
    top: 23.1%;
    left: 70%;
    font-size: 17px;
    font-family: Microsoft YaHei;
    font-weight: 600;
    color: #c00000;
}

.test8 {
    position: absolute;
    top: 25.9%;
    left: 31.8%;
    font-size: 17px;
    font-family: Microsoft YaHei;
    font-weight: 600;
    color: #c00000;
}

.test9 {
    position: absolute;
    top: 30.5%;
    left: 50%;
    font-size: 17px;
    font-family: Microsoft YaHei;
    font-weight: 600;
    color: #ffffff;

}

.test10 {
    position: absolute;
    top: 33.4%;
    left: 50%;
    font-size: 17px;
    font-family: Microsoft YaHei;
    font-weight: 600;
    color: #ffffff;
}

.test11 {
    position: absolute;
    top: 36.2%;
    left: 50%;
    font-size: 17px;
    font-family: Microsoft YaHei;
    font-weight: 600;
    color: #ffffff;
}

.test12 {
    position: absolute;
    top: 39.0%;
    left: 50%;
    font-size: 17px;
    font-family: Microsoft YaHei;
    font-weight: 600;
    color: #ffffff;
}

.test13 {
    position: absolute;
    top: 42.0%;
    left: 50%;
    font-size: 17px;
    font-family: Microsoft YaHei;
    font-weight: 600;
    color: #ffffff;
}

.test14 {
    position: absolute;
    top: 45%;
    left: 50%;
    font-size: 17px;
    font-family: Microsoft YaHei;
    font-weight: 600;
    color: #ffffff;
}

.test15 {
    position: absolute;
    top: 47.8%;
    left: 50%;
    font-size: 17px;
    font-family: Microsoft YaHei;
    font-weight: 600;
    color: #ffffff;
}

.test16 {
    position: absolute;
    top: 50.5%;
    left: 50%;
    font-size: 17px;
    font-family: Microsoft YaHei;
    font-weight: 600;
    color: #ffffff;
}

.test17 {
    position: absolute;
    top: 53.5%;
    left: 50%;
    font-size: 17px;
    font-family: Microsoft YaHei;
    font-weight: 600;
    color: #ffffff;
}

.test18 {
    position: absolute;
    top: 56.5%;
    left: 50%;
    font-size: 17px;
    font-family: Microsoft YaHei;
    font-weight: 600;
    color: #ffffff;
}

.test19 {
    position: absolute;
    top: 59.4%;
    left: 50%;
    font-size: 17px;
    font-family: Microsoft YaHei;
    font-weight: 600;
    color: #ffffff;
}

.test20 {
    position: absolute;
    top: 62.2%;
    left: 50%;
    font-size: 17px;
    font-family: Microsoft YaHei;
    font-weight: 600;
    color: #ffffff;
}

.test21 {
    position: absolute;
    top: 65.2%;
    left: 50%;
    font-size: 17px;
    font-family: Microsoft YaHei;
    font-weight: 600;
    color: #ffffff;
}

.test22 {
    position: absolute;
    top: 68.2%;
    left: 50%;
    font-size: 17px;
    font-family: Microsoft YaHei;
    font-weight: 600;
    color: #ffffff;
}

.test23 {
    position: absolute;
    top: 71.0%;
    left: 50%;
    font-size: 17px;
    font-family: Microsoft YaHei;
    font-weight: 600;
    color: #ffffff;
}

.test24 {
    position: absolute;
    top: 74.0%;
    left: 50%;
    font-size: 17px;
    font-family: Microsoft YaHei;
    font-weight: 600;
    color: #ffffff;
}

.test25 {
    position: absolute;
    top: 77.0%;
    left: 50%;
    font-size: 17px;
    font-family: Microsoft YaHei;
    font-weight: 600;
    color: #ffffff;
}

.test26 {
    position: absolute;
    top: 79.8%;
    left: 50%;
    font-size: 17px;
    font-family: Microsoft YaHei;
    font-weight: 600;
    color: #ffffff;
}

.test27 {
    position: absolute;
    top: 82.5%;
    left: 50%;
    font-size: 17px;
    font-family: Microsoft YaHei;
    font-weight: 600;
    color: #ffffff;
}
</style>