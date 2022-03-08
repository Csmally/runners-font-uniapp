<template>
  <navigationBar :opacity="opacity" />
  <fui-backdrop :show="alertModalStatus" :zIndex="1" />
  <!-- <view class="alertModal" v-if="alertModalStatus">
    <view>弹出提示内容</view>
  </view> -->
  <fui-animation :duration="500" :animationType="animations" :show="alertModalStatus">
    <view>
      <tui-bubble-popup :show="true" backgroundColor="#e62222">123456</tui-bubble-popup>
      <view class="alertModal"></view>
      <view class="alertModalText">
        fdgdfgdgdgdgdgd
      </view>
    </view>
  </fui-animation>
  <scroll-view class="myScroll" scroll-y @scroll="onScroll">
    <view :style="{height: navigationBarHeight}"></view>
    <!-- <view v-for="item in arr" :key="item" class="content">
      content内容区域{{opacity}}____{{navigationBarHeight}}
    </view> -->
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
    console.log("9898111onLoad");
  },
  onShow() {
    console.log("9898onShow");
    setTimeout(() => {
      this.alertModalStatus = true;
    }, 1500);
  },
  onReady() {
    console.log("9898onReady");
  },
  data() {
    return {
      alertModalStatus: false,
      animations: ["zoom-in"],
      arr: [
        1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
      ],
      opacity: 0,
    };
  },
  computed: {
    navigationBarHeight() {
      let statusBarHeight = 50;
      uni.getSystemInfo({
        success: (result) => {
          statusBarHeight = result.statusBarHeight;
        },
        fail: (error) => {
          console.log(error);
        },
      });
      return 44 + statusBarHeight + "px";
    },
  },
  methods: {
    backpage() {
      uni.navigateBack({
        delta: 1,
      });
    },
    onScroll(e) {
      let top = e.detail.scrollTop;
      let opacity = top / 200;
      this.opacity = opacity;
    },
  },
};
</script>

<style lang="scss">
// page {
//   background: linear-gradient(#5c699c, #8b95be, #c9ccdb);
// }
.myScroll {
  height: 100vh;
  background-image: url("@/static/addCampus.png");
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
}
.content {
  height: 30vh;
  border-top: 1px solid #000000;
}
.alertModal {
  // border: 1px solid #000000;
  width: 400rpx;
  height: 400rpx;
  background-image: url("@/static/thanks.png");
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
}
.alertModalText {
  text-align: center;
}
</style>


