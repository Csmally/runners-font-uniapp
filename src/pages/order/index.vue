<template>
  <view class="order" :style="`background-image:url(${orderBase64.backgroundImg})`">
    <div class="segmentedControl">
      <fui-segmented-control :values="values" type="text" bold color="#a3a2a2" activeColor="#000000" :current="currentPage" @click="changeTab"></fui-segmented-control>
    </div>
    <view v-if="userInfo&&userInfo.type==='2'">
      <Tourist />
    </view>
    <view v-if="userInfo&&userInfo.type==='1'">
      <NewOrder v-show="currentPage===0" :userInfo="userInfo" />
      <OrderIng v-show="currentPage===1" :userInfo="userInfo" :orderIngData="orderIngData" />
      <OrderEd v-show="currentPage===2" :userInfo="userInfo" :orderEdData="orderEdData" />
    </view>
  </view>
</template>

<script>
import { uniRequest } from "@/utils/tool.js";
import NewOrder from "./newOrder.vue";
import OrderIng from "./orderIng.vue";
import OrderEd from "./orderEd.vue";
import Tourist from "./tourist.vue";
import { orderBase64 } from "@/base64/index.js";
export default {
  components: { NewOrder, OrderIng, OrderEd, Tourist },
  data() {
    return {
      orderBase64,
      currentPage: 1,
      values: ["New", "进行中", "已完成"],
      userInfo: null,
      orderIngData: [],
      orderEdData: []
    };
  },
  onLoad() {},
  onShow() {
    this.userInfo = uni.getStorageSync("userInfo");
    if (this.currentPage === 1) {
      this.getOrderIngData();
    }
    if (this.currentPage === 2) {
      this.getOrderEdData();
    }
  },
  methods: {
    async changeTab(value) {
      this.currentPage = value.index;
      if (value.index === 1) {
        await this.getOrderIngData();
      }
      if (value.index === 2) {
        await this.getOrderEdData();
      }
    },
    async getOrderIngData() {
      let resData = await uniRequest("order/search", "post", {
        dbTable: this.userInfo.campus,
        param: {
          status: 2,
          $or: [
            { openid: this.userInfo.openid },
            { runnerOpenid: this.userInfo.openid },
          ],
        },
      });
      this.orderIngData = resData.data
    },
    async getOrderEdData() {
      let resData = await uniRequest("order/search", "post", {
        dbTable: this.userInfo.campus,
        param: {
          status: 3,
          $or: [
            { openid: this.userInfo.openid },
            { runnerOpenid: this.userInfo.openid },
          ],
        },
      });
      this.orderEdData = resData.data
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
