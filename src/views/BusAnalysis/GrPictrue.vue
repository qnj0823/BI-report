<template>
    <div class='textPICTURE'>

        <el-button size="mini" type="success" @click="saveAsImage">保存图片</el-button>
        <div id="container">
            <img class="picimg" src="../../assets/images/处理图片.png"></img>
                <table class="profit-table">
                    <thead>
                        <tr>
                            <th>单位体</th>
                            <th>毛利红榜</th>
                            <th>毛利率</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(item, index) in topTen" :key="index">
                            <td>{{ item.org_name }}</td>
                            <td>
                                <div class="bar-container">
                                    <div class="bar" :style="{ width: item.barWidth }">{{ item.customer_name }}</div>
                                </div>
                            </td>
                            <td>{{ item.grossProfitMargin }}</td>
                        </tr>
                    </tbody>
                </table>
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
                p_vouchdatestart: '',
                p_vouchdateend: ''
            },
            dataList: [],
            dataListaLL: [],
            topTen: [],
            year: '',
            month: '',
            day: '',
            GrossProfit: '',//毛利额 
            GrossProfitMargin: '',//毛利率
            GpaPercentage: '',//环比毛利额
            GpmPercentage: '',// 环比毛利率
            TheFirstPlace: '',//第一位
            SecondPlace: '',//第二位
            TheThirdPlace: '',//第三位

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
            this.dataForm.p_vouchdateend = this.endOfToday
            console.log(this.dataForm.p_vouchdateend)
        },
        formatDate(date) {
            this.year = date.getFullYear();
            this.month = String(Number(date.getMonth() + 1));
            this.day = String(date.getDate()).padStart(2, '0');
            return `${this.year}-${this.month}-${this.day}`;
        },
        async getDateList() {
            const isDev = process.env.NODE_ENV === 'development';
            const baseURL = isDev ? 'http://172.16.100.166:9090' : '';
            const response = await axios.get(
                `${baseURL}/uapws/rest/wms/getGrossProfitMargin?queryDate=2024-08-25`,

            );
            if (response.data.restCode == 200) {
                this.dataList = response.data.data[0].currDetailList
                this.dataListaLL = response.data.data[0]
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
                this.dataList = this.dataList.map(item => {
                    return {
                        ...item,
                        grossProfitMargin: item.grossProfitMargin + '%'
                    };
                });
                // 获取前10个对象
                this.topTen = this.dataList.slice(0, 10);

                // 获取后10个对象
                const backTen = this.dataList.slice(-10);
                console.log(this.topTen, backTen)
                this.GrossProfit = this.dataListaLL.currGpAmount//毛利额
                this.GrossProfitMargin = this.dataListaLL.currGrossProfitMargin + '%'//毛利率
                this.GpaPercentage = this.dataListaLL.gpaPercentage//环比毛利额
                this.GpmPercentage = this.dataListaLL.gpmPercentage//环比毛利率
                this.TheFirstPlace = this.dataList[0]
                this.SecondPlace = this.dataList[1]
                this.TheThirdPlace = this.dataList[2]
                console.log(this.TheFirstPlace)
                console.log(this.dataList)
                console.log(this.dataListaLL)
            } else {
                // alert(response.data.msg)
                this.$message.warning(response.data.msg)
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

.profit-table {
    width: 100%;
    /* 取消默认边框合并，为圆角做准备 */
    border-collapse: separate;
    border-spacing: 0;
    border-radius: 12px;
    position: absolute;
    top: 60%;
    left: 30%;
    width: 43%;
    transform: translate(-50%, -50%);
    overflow: hidden;
}

.profit-table th,
.profit-table td {
    padding: 12px 15px;
    text-align: center;
    border: 1px solid #ddd;
    /* 移除默认边框，后续通过伪类添加 */
    border-right: none;
    border-bottom: none;
}

/* 为最后一列添加右边框 */
.profit-table th:last-child,
.profit-table td:last-child {
    border-right: 1px solid #ddd;
}

/* 为最后一行添加下边框 */
.profit-table tbody tr:last-child td {
    border-bottom: 1px solid #ddd;
}

.profit-table th {
    background-color: #e52b2b;
    color: white;
    font-weight: bold;
}

/* 表头部分圆角设置 */
.profit-table thead tr:first-child th:first-child {
    border-top-left-radius: 12px;
}

.profit-table thead tr:first-child th:last-child {
    border-top-right-radius: 12px;
}

/* 表尾部分圆角设置 */
.profit-table tbody tr:last-child td:first-child {
    border-bottom-left-radius: 12px;
}

.profit-table tbody tr:last-child td:last-child {
    border-bottom-right-radius: 12px;
}

/* 行悬停效果 */
.profit-table tbody tr:hover {
    background-color: #f9f9f9;
    transition: background-color 0.3s ease;
}

.bar-container {
    width: 100%;
    height: 20px;
    background-color: #eee;
    border-radius: 10px;
    overflow: hidden;
}

.bar {
    height: 100%;
    background-color: #e52b2b;
    border-radius: 10px;
    transition: width 0.5s ease;
}
</style>