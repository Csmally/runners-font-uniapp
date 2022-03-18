<template>
  <view>
    我是第一是页
    <view>
      环境：{{envStr}}
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      envStr: import.meta.env.MODE,
    };
  },
  onLoad() {
    // uni.showTabBarRedDot({
    //   index: 1,
    // });
  },
  methods: {},
};
</script>

<style>
</style>
