<template>
    <!-- <div class="box" :style="'background-image:url(' + sjdp + ');'"> -->
        <div class="box">
        <div class="head">
            <div class="title"><label>业务数据跟踪分析看板</label></div>
        </div>
        <div :class="{ 'mobile-class': isMobile }" style="display: flex;">
            <!-- <v-scale-screen ref="scale-screen" width="1920" height="1080" :boxStyle="boxStyle" :fullScreen="true"> -->
            <div ref="myChart"></div>
            <iframe src="http://bi.yufanjtbip.com:50401/cv/e6fdc9c8419232d3f708/?DG_SAFE_SESSION=1"
                style="width:100%;height:400px;border:1;"></iframe>
            <iframe src="http://bi.yufanjtbip.com:50401/cv/f6dcd076b192328dba4a/?DG_SAFE_SESSION=1"
                style="width:100%;height: 400px;border:0;"></iframe>
            <iframe src="http://bi.yufanjtbip.com:50401/cv/e177b365f19265b5e1e6/?DG_SAFE_SESSION=1"
                style="width:100%;height:400px;border:1;"></iframe>
            <!-- </v-scale-screen> -->
        </div>
    </div>
</template>


<script>
import * as echarts from 'echarts';
import sjdp from '@/assets/images/sjdp.jpeg'
export default {
    name: 'MyChart',
    data() {
        return {
            sjdp: sjdp,
            boxStyle: {
                background: 'linear-gradient(to top ,white, white)'
            },
            isMobile: false,
        }
    },
    mounted() {
        this.initChart();
        this.checkDevice();
        window.addEventListener('resize', this.handleResize);
        window.addEventListener('resize', this.checkDevice);
    },
    beforeDestroy() {
        window.removeEventListener('resize', this.checkDevice);
        window.removeEventListener('resize', this.handleResize);
        if (this.myChart) {
            this.myChart.dispose();
        }
    },
    methods: {
        initChart() {
            const chartDom = this.$refs.myChart;
            this.myChart = echarts.init(chartDom);

            const option = {
                title: {
                    text: '折线图示例'
                },
                tooltip: {},
                xAxis: {
                    type: 'category',
                    data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
                },
                yAxis: {
                    type: 'value'
                },
                series: [{
                    name: '销量',
                    type: 'line',
                    data: [120, 132, 101, 134, 90, 230, 210]
                }]
            };

            this.myChart.setOption(option);
        },
        handleResize() {
            // 使图表适应容器大小  
            if (this.myChart) {
                this.myChart.resize();
            }
        },
        checkDevice() {
            // 判断当前窗口宽度是否小于等于768像素  
            this.isMobile = window.innerWidth <= 768;
        },
    }
}
</script>

<style scoped lang="scss">
.box {
    // background-size: cover; /* 背景图片铺满 */  
    // // background-position: center; /* 背景图片居中 */  
    // height: 100vh; /* 设置高度 */  
    // width: 100%; /* 设置宽度 */  
}

html {
    font-size: 16px;
    /* 根字体大小设置为16px */
}

.mobile-class {
    display: flex !important;
    flex-wrap: wrap !important;
}

.head {
    width: 100%;
    font-size: 2rem;
    text-align: center;

}


.title {
    padding-top: 1rem;
    margin-bottom: 2rem;
    // color: aliceblue;

}
</style>
