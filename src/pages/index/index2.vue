<template>
  <view class="aa">
    <button @click="test1">获取现在db</button>
    <button @click="test2">新建表</button>
  </view>
</template>

<script>
import { uniRequest, getFileName, reSetArr } from "@/utils/tool.js";
export default {
  data() {
    return {
        test3: this.test4()
    };
  },
  methods: {
    async test1() {
      let aa = await uniRequest("order/models", "GET");
      console.log("9898现在的DB", aa);
    },
    async test2() {
      let aa = await uniRequest("campus/add", "POST",{
          name: "清华大学",
          address: "北京市-北京市-海淀区",
          code: "qinghua"
      });
      console.log("9898新建DB", aa);
    },
    test4() {
      let aa = 0;
      return () => {
          aa++
          console.log('9898啥',aa)
      };
    },
  },
};
</script>

<style>
.aa {
  padding-top: 250rpx;
}
</style>
