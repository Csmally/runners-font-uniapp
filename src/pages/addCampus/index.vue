<template>
  <scroll-view class="myScroll" scroll-y @scroll="onScroll">
    <navigationBar :opacity="opacity" />
    <view v-for="item in arr" :key="item" class="content">
      content内容区域{{opacity}}
    </view>
  </scroll-view>
</template>

<script>
import navigationBar from "@/components/navigationBar.vue";
export default {
  components: { navigationBar },
  onInit() {
    console.log("9898onInit");
  },
  onLoad() {
    console.log("9898onLoad");
  },
  onShow() {
    console.log("9898onShow");
  },
  onReady() {
    console.log("9898onReady");
  },
  data() {
    return {
      arr: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],
      opacity: 0,
    };
  },
  methods: {
    backpage() {
      uni.navigateBack({
        delta: 1,
      });
    },
    onScroll(e) {
      let top = e.detail.scrollTop;
      let opacity = (top / 200);
      this.opacity = opacity;
    },
  },
};
</script>

<style lang="scss">
page {
  // background-color: red;  #69708C   #5c699c
  background: linear-gradient(#5c699c, #8b95be, #c9ccdb);
}
.myScroll {
  height: 100vh;
}
.content {
  height: 30vh;
  border-bottom: 1px solid #000000;
}
</style>


