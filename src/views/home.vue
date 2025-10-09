<template>
  <div>
    <yxbbtn v-show="addOrUpdateVisible" ref="addOrUpdate" @string1Sent="updateString1" @string2Sent="updateString2"
      @close="addOrUpdateVisible = false" @requestBillList1="getBIlllist1"></yxbbtn>

    <ruku v-if="isruku"></ruku>
    <div v-else class="dashboard-container">
      <!-- <iphon v-if="isMobile"></iphon>
    <iframe v-else src="http://bi.yufanjtbip.com:50401/dv/98607dbe4192325e0f44/?DG_SAFE_SESSION=1"
      style="width:100%;height:100%;border:0;"></iframe> -->
      <el-button v-show="btnshow" class="filter-item" size="mini" type="success" icon="el-icon-search" @click="getALLlist"
        style="position: absolute; z-index: 1000; margin-top: 1%;">选择战区/销售区域</el-button>
      <iframe src="http://bi.yufanjtbip.com:50401/dv/6d9913f31192e587a5e7/?DG_SAFE_SESSION=1"
        style="width:100%;height:100%;border:0;"></iframe>
    </div>
  </div>
</template>

<script>
import iphon from './ECharts/test.vue'
import ruku from './FactoryStorage/FactoryHome.vue'
import yxbbtn from './ECharts/buttonVue.vue'
import {
  mapGetters,
} from 'vuex'

export default {
  name: 'Dashboard',
  components: {
    iphon,
    ruku,
    yxbbtn
  },
  data() {
    return {
      isMobile: false,
      isruku: true,
      ruid: '',
      rudepts: '',
      rujobs: '',
      btnshow:false,
      addOrUpdateVisible: false,
      receivedString1: '',//战区
      receivedString2: ''//销售区域
      // lineChartData: lineChartData.newVisitis

    }
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
    
    if(this.rujobs=='全部'){
      this.btnshow = true
    }
    const ids = sessionStorage.getItem('id');
    this.ruid = ids
    this.rukushowfalse()
    this.checkDevice();
    window.addEventListener('resize', this.checkDevice);
  },
  methods: {
    updateString1(string1) {
      this.receivedString1 = string1;
      sessionStorage.setItem('yxb', this.receivedString1);

    },
    updateString2(string2) {
      this.receivedString2 = string2;
      sessionStorage.setItem('sf',  this.receivedString2);
    },
    getALLlist() {
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init()
      })
    },
    getBIlllist1() {
      this.$router.push({
        path: '/changshaDQ/ECharts',
        // query: {
        //   param1: this.receivedString1,
        //   param2: this.receivedString2,
        // }
      });
    },


    checkDevice() {
      // 判断当前窗口宽度是否小于等于768像素  
      this.isMobile = window.innerWidth <= 768;
    },
    rukushowfalse() {
      console.log(this.id)
      if (this.ruid == 23) {
        this.isruku = true
      } else {
        this.isruku = false
      }
    },
    // handleSetLineChartData(type) {
    //   this.lineChartData = lineChartData[type]
    // }

  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.dashboard-container {
  width: 100%;
  height: 100%;
  position: absolute;
  /* 或使用 flexbox */
  top: 0;
  left: 0;
}


@media (max-width:1024px) {
  .chart-wrapper {
    padding: 8px;
  }
}
</style>
