<template>
  <div class='fhome'>
    <iframe src="http://bi.yufanjtbip.com:50401/dv/e19ef51fe192f9f3039e/?DG_SAFE_SESSION=1" style="width:100%;height:100%;border:0;"></iframe>
  </div>
</template>

<script>
import {
    mapGetters,
  } from 'vuex'
  export default {
    name: 'fhome-page',
    data() {
      return {
        msg: 'fhome-page'
      };
    },
    computed: {
      ...mapGetters(['id'])
    },
    mounted() {
    },
    methods: {
    }
  };
</script>

<style scoped lang="scss">
.fhome {
  width: 100%;
  height: 100%;
  position: absolute;
  /* 或使用 flexbox */
  top: 0;
  left: 0;
}
  
</style>