<template>
    <div class='textPICTURE'>

        <el-button size="mini" type="success" @click="saveAsImage">保存图片</el-button>
        <div id="container">
            <img class="picimg" src="../../assets/images/glbnew4.jpg"></img>
            <div class="test">6</div>
            <div class="test1">20</div><!-- 低温目标 -->
            <div class="test2">{{ month }}</div>
            <div class="test3">{{ day }}</div>
            <div class="test4">6</div>
            <div class="test5">20</div>
            <div class="test6">8</div>
            <div class="test7">20</div>
            <div class="test8">{{ goalnumtotal }}</div>
            <div class="test9">{{ fixedbox }}</div>
            <div class="test10">{{ todaybox }}</div>
            <div class="test11">{{ leijibox }}</div>
            <div class="test12">{{ goalnumStage }}</div>
            <div class="test13">{{ goalnumDiff }}</div>
            <div class="test14">{{ goalnumRate }}</div>
            <div class="test15">{{ leijiboxhistory }}</div>
            <div class="test16">{{ historyDiff }}</div>
            <div class="test17">{{ historyRate }}</div>

            <el-table :data="dataList" class="test19">
                <el-table-column align="center" prop="sort" label="排名" />
                <el-table-column align="center" width="120" prop="sqname" label="省区" />
                <el-table-column align="center" prop="todaybox" label="今日报单" />
                <el-table-column align="center" prop="leijibox" label="累计报单" />
                <el-table-column align="center" prop="goalnumDiff" label="目标增幅" />
                <el-table-column align="center" prop="goalnumRate" label="目标完成率" />
                <el-table-column align="center" prop="historyDiff" label="同期增幅" />
                <el-table-column align="center" prop="historyRate" label="同期完成率" />
            </el-table>
            <!-- <div class="test18">
                <div>{{ area1 }}</div>
                <div>{{ today1 }}</div>
            </div> -->


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

            goalnumtotal: '',//总目标
            fixedbox: '',//同期报单
            todaybox: '',//今日报单
            leijibox: '',//累计报单
            goalnumStage: '',//截至今日目标
            goalnumDiff: '',//截至今日差额
            goalnumRate: '',//目标完成率
            leijiboxhistory: '',//截至今日同期
            historyDiff: '',//同期差额
            historyRate: '',//同期完成率

            area1: '',//四川今日差额
            today1: '',//重庆今日差额
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

            this.dataList = this.dataList.map(item => {
                // 转换为数字（无效值转为0）
                const leijibox = Number(item.leijibox) || 0;
                const goalnumStage = Number(item.goalnumStage) || 0;
                const leijiboxhistory = Number(item.leijiboxhistory) || 0;

                // 1. 计算目标差额（允许正负数）
                const goalnumDiff = parseInt(leijibox - goalnumStage);

                // 2. 计算目标完成率（分母为0时返回0%）
                const goalnumRate = goalnumStage === 0
                    ? "0%"
                    : `${((leijibox / goalnumStage) * 100).toFixed(2)}%`;

                // 3. 计算同期差额（允许正负数）
                const historyDiff = parseInt(leijibox - leijiboxhistory);

                // 4. 计算同期完成率（分母为0时返回0%）
                const historyRate = leijiboxhistory === 0
                    ? "0%"
                    : `${((leijibox / leijiboxhistory) * 100).toFixed(2)}%`;

                return {
                    ...item,
                    goalnumDiff,     // 可能为负数
                    goalnumRate,
                    historyDiff,     // 可能为负数
                    historyRate
                };
            });

            this.dataList = this.dataList.sort((a, b) => {
                // 处理 a.historyRate
                const strA = a.historyRate.replace('%', '');
                const numA = strA === '∞' ? Infinity : parseFloat(strA);

                // 处理 b.historyRate
                const strB = b.historyRate.replace('%', '');
                const numB = strB === '∞' ? Infinity : parseFloat(strB);

                // 降序排序（Infinity 最大，NaN 或无效值可以单独处理）
                return numB - numA;
            });
            // 剔除 sqname 为 "全国合计" 的对象
            const filteredArray = this.dataList.filter(item => item.sqname == "全国合计");

            // 从原数组中移除 "全国合计"（直接修改原数组）
            this.dataList = this.dataList.filter(item => item.sqname !== "全国合计");

            this.dataList = this.dataList.map((item, index) => ({
                ...item,
                sort: index + 1, // 从 1 开始编号
            }));

            console.log(this.dataList, 'dataList')

            this.goalnumtotal = (filteredArray.find(item => item.sqname === "全国合计").goalnumtotal);//总目标
            this.fixedbox = (filteredArray.find(item => item.sqname === "全国合计").fixedbox)//同期销量
            this.todaybox = (filteredArray.find(item => item.sqname === "全国合计").todaybox)//今日报单
            this.leijibox = (filteredArray.find(item => item.sqname === "全国合计").leijibox)//累计报单
            this.goalnumStage = (filteredArray.find(item => item.sqname === "全国合计").goalnumStage).toFixed(0) //截至今日目标
            this.goalnumDiff = (filteredArray.find(item => item.sqname === "全国合计").goalnumDiff).toFixed(0)//目标差额
            this.goalnumRate = (filteredArray.find(item => item.sqname === "全国合计").goalnumRate)//目标完成率
            this.leijiboxhistory = (filteredArray.find(item => item.sqname === "全国合计").leijiboxhistory);//截至今日同期
            this.historyDiff = (filteredArray.find(item => item.sqname === "全国合计").historyDiff)//目标差额
            this.historyRate = (filteredArray.find(item => item.sqname === "全国合计").historyRate)//目标完成率

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

.test {
    position: absolute;
    top: 10%;
    left: 33.8%;
    font-size: 16px;
    font-family: Microsoft YaHei;
    font-weight: 600;
    color: #c00000;
}

.test1 {
    position: absolute;
    top: 10%;
    left: 40%;
    font-size: 16px;
    font-family: Microsoft YaHei;
    font-weight: 600;
    color: #c00000;
}


.test2 {
    position: absolute;
    top: 10%;
    left: 56%;
    font-size: 16px;
    font-family: Microsoft YaHei;
    font-weight: 600;
    color: #c00000;
}

.test3 {
    position: absolute;
    top: 10%;
    left: 61.5%;
    font-size: 16px;
    font-family: Microsoft YaHei;
    font-weight: 600;
    color: #c00000;
}

.test4 {
    position: absolute;
    top: 17.5%;
    left: 34%;
    font-size: 16px;
    font-family: Microsoft YaHei;
    font-weight: 600;
    color: #c00000;
}

.test5 {
    position: absolute;
    top: 17.5%;
    left: 41.5%;
    font-size: 16px;
    font-family: Microsoft YaHei;
    font-weight: 600;
    color: #c00000;
}

.test6 {
    position: absolute;
    top: 17.5%;
    left: 55.5%;
    font-size: 17px;
    font-family: Microsoft YaHei;
    font-weight: 600;
    color: #c00000;
}

.test7 {
    position: absolute;
    top: 17.5%;
    left: 63%;
    font-size: 17px;
    font-family: Microsoft YaHei;
    font-weight: 600;
    color: #c00000;
}

.test8 {
    position: absolute;
    top: 20%;
    left: 31%;
    font-size: 17px;
    font-family: Microsoft YaHei;
    font-weight: 600;
    color: #c00000;
}

.test9 {
    position: absolute;
    top: 20%;
    left: 64%;
    font-size: 17px;
    font-family: Microsoft YaHei;
    font-weight: 600;
    color: #c00000;

}

.test10 {
    position: absolute;
    top: 28.5%;
    left: 35%;
    font-size: 17px;
    font-family: Microsoft YaHei;
    font-weight: 600;
    color: #c00000;
}

.test11 {
    position: absolute;
    top: 28.5%;
    left: 68%;
    font-size: 17px;
    font-family: Microsoft YaHei;
    font-weight: 600;
    color: #c00000;
}

.test12 {
    position: absolute;
    top: 37.0%;
    left: 30%;
    font-size: 17px;
    font-family: Microsoft YaHei;
    font-weight: 600;
    color: #c00000;
}

.test13 {
    position: absolute;
    top: 37.0%;
    left: 53.5%;
    font-size: 17px;
    font-family: Microsoft YaHei;
    font-weight: 600;
    color: #c00000;
}

.test14 {
    position: absolute;
    top: 37.0%;
    left: 79.5%;
    font-size: 14px;
    font-family: Microsoft YaHei;
    font-weight: 600;
    color: #c00000;
}

.test15 {
    position: absolute;
    top: 40%;
    left: 29%;
    font-size: 17px;
    font-family: Microsoft YaHei;
    font-weight: 600;
    color: #c00000;
}

.test16 {
    position: absolute;
    top: 40%;
    left: 53.5%;
    font-size: 17px;
    font-family: Microsoft YaHei;
    font-weight: 600;
    color: #c00000;
}

.test17 {
    position: absolute;
    top: 40%;
    left: 79.5%;
    font-size: 14px;
    font-family: Microsoft YaHei;
    font-weight: 600;
    color: #c00000;
}

.test18 {
    position: absolute;
    top: 56.5%;
    left: 30%;
    font-size: 17px;
    font-family: Microsoft YaHei;
    font-weight: 600;
    color: #c00000;
    display: flex;
    gap: 20px;
}

.test19 {
    position: absolute;
    top: 45.4%;
    width: 92%;
    left: 4.2%;
    // font-size: 17px;
    // width: 30rem;
    font-family: Microsoft YaHei;
    font-weight: 600;
    color: #ffffff;
}

/* 表头样式：红底白字 */
.test19>>>.el-table__header th {
    background-color: #ff0000 !important;
    /* 红色背景 */
    color: white !important;
    /* 白色字体 */
}

/* 表体样式：红色字体 */
.test19>>>.el-table__body td {
    color: black !important;
}

/* 调整表体（数据行）字体为宋体 */
.test19>>>.el-table__body td .cell {
    font-family: "Microsoft YaHei";
}

.test19>>>.el-table__body td {
    padding: 1px 0 !important;
    /* 更紧凑的间距 */
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