<template>
  <view class="container">
    <view class="tool">
      <view class="toolback">
        <image src="@/static/media.png" />
      </view>
      <view class="title">照片</view>
    </view>
    <view class="tool">
      <view class="toolback">
        <image src="@/static/orderInfo.png" />
      </view>
      <view class="title">订单详情</view>
    </view>
    <view class="tool">
      <view class="toolback">
        <image src="@/static/money.png" />
      </view>
      <view class="title">追加酬劳</view>
    </view>
    <view class="tool">
      <view class="toolback">
        <image src="@/static/complete.png" />
      </view>
      <view class="title">完成订单</view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {};
  },
};
</script>

<style lang="scss">
.container {
  display: flex;
  flex-direction: row;
  height: 10vh;
  flex-wrap: wrap;
  justify-content: space-around;
}
.tool {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  .toolback {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100rpx;
    height: 100rpx;
    border-radius: 20rpx;
    background-color: #ffffff;
    margin-top: 30rpx;
    image {
      width: 60rpx;
      height: 60rpx;
    }
  }
  .title {
    font-size: 25rpx;
    margin: 20rpx 0;
    color: #a09d9d;
  }
}
</style>
