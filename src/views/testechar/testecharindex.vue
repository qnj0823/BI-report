<template>

  <div :class="isClass ? 'dashboard-container' : 'dashboard-content'">
    <div style="width: 50%;height: 100%;"><img src="../../assets/images/yf20241031121714.jpeg" alt="Image"
        class="responsive-image"></div>

        <!-- <div style="width: 50%;height: 100%;">
          <iframe src="http://sc.yufanjtbip.com:50401/dv/e971dc7de1946290b3ec/?DG_SAFE_SESSION=1"
          style="width:100%;height:100%;border:0;"></iframe>
        </div> -->

    <!-- <div style="width: 50%; height: 100%;">
      <video >
        <source src="../../assets/images/ship.mp4" type="video/mp4">
      </video>
    </div> -->

    <!-- <iframe src="http://bi.yufanjtbip.com:50401/dv/3174aadd2192e0f1c21e/?DG_SAFE_SESSION=1"
      style="width:100%;height:100%;border:0;"></iframe> -->


    <iframe src="http://bi.yufanjtbip.com:50401/dv/47351728b192f5fe5a39/?DG_SAFE_SESSION=1"
      style="width:100%;height:100%;border:0;"></iframe>

  </div>
</template>

<script>
import screenfull from 'screenfull'
import Screenfull from '@/components/Screenfull'
export default {
  components: {
    Screenfull,

  },
  name: 'Dashboard',

  data() {
    return {
      isMobile: false,
      isClass: true,

    }
  },
  mounted() {
    console.log(this.isClass)
    // 监听全屏状态变化  
    screenfull.on('change', this.handleFullScreenChange);

  },
  beforeDestroy() {

    // 解除全屏状态变化监听  
    screenfull.off('change', this.handleFullScreenChange);
  },
  methods: {
    handleFullScreenChange() {
      // 检查当前是否处于全屏状态  
      if (!screenfull.isFullscreen) {
        // 当变为非全屏时切换 isVisible  
        this.isClass = !this.isClass
      } else {
        this.isClass = !this.isClass
        console.log('已进入全屏11111');
      }
    },

  }
}
</script>

<style lang="scss" scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  /* 确保 padding 和 border 不会影响宽高计算 */
}


.dashboard-container {
  width: 100%;
  height: 90.8vh;
  // position: absolute;
  // /* 或使用 flexbox */
  // top: 0;
  // left: 0;
  display: flex;
}

.dashboard-content {
  width: 100%;
  height: 100vh;
  // position: absolute;
  // /* 或使用 flexbox */
  // top: 0;
  // left: 0;
  display: flex;
}


@media (max-width:1024px) {
  .chart-wrapper {
    padding: 8px;
  }
}

.image-container {
  width: 100%;
  /* 或者你想要的任何宽度 */
  height: 400px;
  /* 或者根据需求指定高度 */
  overflow: hidden;
  /* 如果图片超出了容器的边界，隐藏多余部分 */
}

.responsive-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  /* 使图片覆盖容器，保持纵横比 */
}
</style>