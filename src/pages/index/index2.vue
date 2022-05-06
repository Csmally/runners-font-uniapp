<template>
  <view class="container">
    <view class="box">

    </view>
  </view>
</template>

<script>
import { commonBase64 } from "@/base64/index.js";
export default {
  data() {
    return {
      commonBase64,
    };
  },
  methods: {},
};
</script>

<style>
.container {
  width: 100vw;
  height: 100vh;
  /* background-image: url("https://static.runners.ink/project/cool-background%20%284%29%20%281%29.png");
  background-position: center center;
  background-repeat: no-repeat;
  background-size: cover; */
  background-color: #e6e6e6;
  display: flex;
  justify-content: center;
  align-items: center;
}
.box {
  /* background-color: #f1f1f1; */
  height: 200rpx;
  width: 550rpx;
  border-radius: 30rpx;
  background: #e6e6e6;
  /* border: 15rpx inset #a4a4a4; */
  box-shadow: inset 13rpx 13rpx 10rpx 10rpx #a4a4a4, inset -13rpx -13rpx 10rpx 10rpx #ffffff;
}
</style>
