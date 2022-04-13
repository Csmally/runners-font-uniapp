<template>
  <view class="container">
    我发出的
    <button @click="dianji">点击</button>
  </view>
</template>

<script>
export default {
  props: {
    orderData: {
      type: Array,
      default: [],
    },
  },
  data() {
    return {
     
    };
  },
  methods: {
    dianji() {
      console.log("9898数据111", this.orderData);
    },
  },
};
</script>

<style lang="scss">
.container {
  height: 93vh;
  background-color: #f6f6f6;
}
</style>