<template>
  <view>
    <view class="title">头部区域</view>
    <vie class="content">
      content内容区域
    </vie>
  </view>
</template>

<script>
export default {
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
    return {};
  },
  methods: {
    backpage() {
      uni.navigateBack({
        delta: 1,
      });
    },
  },
};
</script>


