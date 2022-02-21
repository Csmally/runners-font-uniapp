<template>
  <view>
    <uni-nav-bar title="导航栏"></uni-nav-bar>
  </view>
</template>

<script>
export default {
  data() {
    return {
      title: "第一页",
    };
  },
  onLoad() {},
  methods: {},
};
</script>

<style>
.head {
  background-color: red;
  height: var(--status-bar-height);
}

</style>
