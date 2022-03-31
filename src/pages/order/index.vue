<template>
  <view class="order" :style="`background-image:url(${orderBase64.backgroundImg})`">
    <div class="segmentedControl">
      <fui-segmented-control :values="values" type="text" bold color="#a3a2a2" activeColor="#000000" :current="currentPage" @click="changeTab"></fui-segmented-control>
    </div>
    <view v-if="userInfo&&userInfo.type==='2'">
      <Tourist/>
    </view>
    <view v-if="userInfo&&userInfo.type==='1'">
      <NewOrder v-show="currentPage===0" />
      <OrderIng v-show="currentPage===1" />
      <OrderEd v-show="currentPage===2" />
    </view>
  </view>
</template>

<script>
import { uniRequest } from "@/utils/tool.js";
import NewOrder from "./newOrder.vue";
import OrderIng from "./orderIng.vue";
import OrderEd from "./orderEd.vue";
import Tourist from "./tourist.vue"
import { orderBase64 } from "@/base64/index.js";
export default {
  components: { NewOrder, OrderIng, OrderEd, Tourist },
  data() {
    return {
      orderBase64,
      currentPage: 1,
      values: ["New", "进行中", "已完成"],
      userInfo: null
    };
  },
  onLoad() {},
  onShow() {
    this.userInfo = uni.getStorageSync("userInfo");
  },
  methods: {
    changeTab(value) {
      console.log("9898tab", value);
      this.currentPage = value.index;
    },
  },
};
</script>

<style lang="scss" >
.order {
  height: 100vh;
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
}
.segmentedControl {
  position: -webkit-sticky;
  position: sticky;
  top: 0;
  background-color: #ffffff;
  z-index: 999;
}
</style>
