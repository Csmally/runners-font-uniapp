<template>
  <!-- <view class="order" :style="`background-image:url(${orderBase64.backgroundImg})`"> -->
  <view class="order">
    <view v-if="userInfo&&userInfo.type==='2'">
      <Tourist />
    </view>
    <view v-if="userInfo&&userInfo.type==='1'">
      <SegmentedControl :texts="texts" @tabChange="tabChange" :currentTab="currentTab" />
      <view class="typechange" v-if="currentTab===1||currentTab===3">
        <view class="box" @click="changeType">
          <image :class="isChanging?'typechangeing':'loadingimg'" src="@/static/loadingSearch.png" />
          <view class="typetext">{{typeText[typeIndex]}}</view>
        </view>
      </view>
      <view>
        <NewOrder v-show="currentTab===0" :userInfo="userInfo" />
        <OrderIng v-show="currentTab===1" :userInfo="userInfo" :orderData="orderData" />
        <OrderSelf v-show="currentTab===2" :userInfo="userInfo" :orderData="orderData" />
        <OrderEd v-show="currentTab===3" :userInfo="userInfo" :orderData="orderData" />
      </view>
    </view>
  </view>
</template>

<script>
import { uniRequest } from "@/utils/tool.js";
import NewOrder from "./newOrder.vue";
import OrderSelf from "./orderSelf.vue";
import OrderIng from "./orderIng.vue";
import OrderEd from "./orderEd.vue";
import Tourist from "./tourist.vue";
import { orderBase64 } from "@/base64/index.js";
import SegmentedControl from "@/components/segmentedControl.vue";
export default {
  components: {
    NewOrder,
    OrderIng,
    OrderEd,
    Tourist,
    SegmentedControl,
    OrderSelf,
  },
  data() {
    return {
      orderBase64,
      currentTab: 1,
      texts: ["去下单", "进行中", "我发出", "已完成"],
      userInfo: null,
      orderData: [],
      typeIndex: 0,
      typeText: ["全部", "我发出的", "我接收的"],
      isChanging: false,
    };
  },
  onLoad() {},
  onShow() {
    this.userInfo = uni.getStorageSync("userInfo");
    if (this.currentTab !== 0) {
      this.getOrderData();
    }
  },
  methods: {
    async tabChange(value) {
      this.currentTab = value;
      if (value !== 0) {
        await this.getOrderData();
      }
    },
    changeType() {
      this.isChanging = true;
      if (this.typeIndex === 2) {
        this.typeIndex = 0;
      } else {
        this.typeIndex++;
      }
      this.getOrderData();
    },
    async getOrderData() {
      let param;
      if (this.currentTab === 1) {
        if (this.typeIndex == 0) {
          param = {
            status: 2,
            $or: [
              { openid: this.userInfo.openid },
              { runnerOpenid: this.userInfo.openid },
            ],
          };
        }
        if (this.typeIndex == 1) {
          param = {
            status: 2,
            openid: this.userInfo.openid,
          };
        }
        if (this.typeIndex == 2) {
          param = {
            status: 2,
            runnerOpenid: this.userInfo.openid,
          };
        }
      }
      if (this.currentTab === 2) {
        param = {
          status: 1,
          openid: this.userInfo.openid,
        };
      }
      if (this.currentTab === 3) {
        if (this.typeIndex == 0) {
          param = {
            status: {
              $or: [3, 4],
            },
            $or: [
              { openid: this.userInfo.openid },
              { runnerOpenid: this.userInfo.openid },
            ],
          };
        }
        if (this.typeIndex == 1) {
          param = {
            status: {
              $or: [3, 4],
            },
            openid: this.userInfo.openid,
          };
        }
        if (this.typeIndex == 2) {
          param = {
            status: {
              $or: [3, 4],
            },
            runnerOpenid: this.userInfo.openid,
          };
        }
      }
      let resData = await uniRequest("order/search", "POST", {
        dbTable: this.userInfo.campus,
        param,
      });
      if (resData.data.length > 0 && this.currentTab === 1) {
        let searchParam = [];
        for (const item of resData.data) {
          searchParam.push({ orderid: item.campus + "-" + item.id });
        }
        let chatInfo = await uniRequest("chatLogs/search", "POST", {
          param: {
            $or: searchParam,
          },
        });
        for (const item of resData.data) {
          for (const item1 of chatInfo.data) {
            if (item.campus + "-" + item.id === item1.orderid) {
              if (JSON.parse(item1.content).length > 0) {
                item.lastChat = JSON.parse(item1.content)[
                  JSON.parse(item1.content).length - 1
                ];
              } else {
                item.lastChat = null;
              }
              break;
            }
          }
        }
      }
      this.orderData = resData.data;
      this.isChanging = false;
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
.typechange {
  width: 100%;
  display: flex;
  justify-content: flex-end;
  .box {
    display: flex;
    align-items: center;
    height: 5vh;
    .typetext {
      color: #a09d9d;
      margin: 0 30rpx 0 20rpx;
    }
    .loadingimg {
      width: 40rpx;
      height: 40rpx;
    }
    .typechangeing {
      width: 40rpx;
      height: 40rpx;
      animation: loading 1s linear infinite;
    }
  }
}
@-webkit-keyframes loading {
  0% {
    -webkit-transform: rotate(0);
    -moz-transform: rotate(0);
    -ms-transform: rotate(0);
    -o-transform: rotate(0);
    transform: rotate(0);
  }
  100% {
    -webkit-transform: rotate(360deg);
    -moz-transform: rotate(360deg);
    -ms-transform: rotate(360deg);
    -o-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}
</style>
