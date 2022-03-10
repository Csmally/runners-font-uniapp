<template>
  <view>
    <view v-if="mark==='all'" class="menu_btn" :style="{ position: 'fixed',top:menuTop,left:menuRight,width:menuWidth,height:menuHeight, border: '1rpx solid #ddd',borderRadius:menuBorderRadius, backgroundColor: '#ffffff'}">
      <uni-icons @click="goToBack" class="arrowleft" type="arrowleft" :color="'#000'" size="20" />
      <text class="text_box"></text>
      <uni-icons @click="goToHome" class="home" type="home" :color="'#000'" size="20" />
    </view>
    <view v-if="mark==='back'" class="menu_btn" :style="{ position: 'fixed',top:menuTop,left:menuRight,width:menuWidth,height:menuHeight }">
      <uni-icons @click="goToBack" class="arrowleft" type="arrowleft" :color="'#000'" size="25" />
      <!-- <text class="text_box"></text> -->
      <!-- <uni-icons @click="goToHome" class="home" type="home" :color="'#000'" size="20" /> -->
    </view>
    <view v-if="mark==='home'" class="menu_btn" :style="{ position: 'fixed',top:menuTop,left:menuRight,width:menuWidth,height:menuHeight }">
      <uni-icons @click="goToHome" class="arrowleft" type="home" :color="'#000'" size="25" />
    </view>
  </view>
</template>
<script>
export default {
  props: {
    mark: {
      type: String,
      default: "all",
    },
  },
  data() {
    return {
      statusBarHeight: uni.getStorageSync("menuInfo").statusBarHeight, //状态栏的高度（可以设置为顶部导航条的padding-top）
      menuWidth: uni.getStorageSync("menuInfo").menuWidth,
      menuHeight: uni.getStorageSync("menuInfo").menuHeight,
      menuBorderRadius: uni.getStorageSync("menuInfo").menuBorderRadius,
      menuRight: uni.getStorageSync("menuInfo").menuRight,
      menuTop: uni.getStorageSync("menuInfo").menuTop,
      contentTop: uni.getStorageSync("menuInfo").contentTop,
    };
  },
  methods: {
    goToBack() {
      uni.navigateBack({
        delta: 1,
      });
    },
    goToHome() {
      uni.switchTab({
        url: "/pages/list/index",
      });
      //下方方法也可以回到首页 还可以传参 但是不建议使用---因为此方法会关闭其他所有页面（导致再次打开别的页面时候 会再次触发别的页面的onLoad）
      // uni.reLaunch({
      //   url: '/pages/index/index?id=1'
      // })
    },
  },
};
</script>

<style lang="scss" scope>
.menu_btn {
  // background-color: #ffffff; //这个是小程序默认的标题栏背景色
  overflow: hidden;
  z-index: 999;
  // position: fixed;//行内式写了固定定位--目的是去掉下划页面一起滚动问题
  .arrowleft {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-160%, -50%) !important;
    -webkit-transform: translate(-160%, -50%) !important;
  }
  .text_box {
    width: 1rpx;
    height: 20px;
    background-color: #ddd;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) !important;
    -webkit-transform: translate(-50%, -50%) !important;
  }
  .home {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(60%, -50%) !important;
    -webkit-transform: translate(60%, -50%) !important;
  }
}
</style>

