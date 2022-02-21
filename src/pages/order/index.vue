<template>
  <view>
    <view class="head">我是第二页的头部</view>
    <view>我是内容部分</view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      title: '第二页',
    }
  },
  onLoad() {},
  methods: {},
}
</script>

<style>
.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.text-area {
  display: flex;
  justify-content: center;
}

.title {
  font-size: 36rpx;
}
</style>
