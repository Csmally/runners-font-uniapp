<template>
  <view class="container">
    <view v-for="item in orderIngData" :key="item.id" class="chatitem" @click="selectChat(item)">
      <image v-if="userInfo.openid===item.openid" class="avatar" :src="item.runnerAvatarUrl" />
      <image v-else class="avatar" :src="item.avatarUrl" />
      <view class="nameandinfo">
        <view class="nickname">
          <view v-if="userInfo.openid===item.openid">{{item.runnerNickName}}</view>
          <view v-else>{{item.nickName}}</view>
        </view>
        <view class="chatinfo hiddenText">
          加钱加钱加钱加加钱加钱加钱加加钱加钱加钱加加钱加钱加钱加加钱加钱加钱加加钱加钱加钱加
        </view>
      </view>
      <view class="goods">
        <view class="goodsname">
          {{item.goodsName}}
        </view>
        <view style="text-align: right">
          <image v-if="userInfo.openid===item.openid" class="ordertype" src="@/static/ordersend.png" />
          <image v-else class="ordertype" src="@/static/orderget.png" />
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { jumpTo } from "@/utils/tool.js";
export default {
  props: {
    userInfo: {
      type: Object,
      default: null,
    },
    orderIngData: {
      type: Array,
      default: [],
    },
    socketObj: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      data: [],
      socketTask: null,
      socketOpen: false,
      test: 1
    };
  },
  methods: {
    selectChat(item) {
      jumpTo("/pages/chatRoom/index",item);
    }
  },
};
</script>

<style lang="scss">
.container {
  height: 100vh;
  overflow: auto;
}
.chatitem {
  padding: 25rpx;
  border-bottom: 1px solid #f8f8f8;
  display: flex;
  .avatar {
    width: 140rpx;
    height: 140rpx;
    border-radius: 20rpx;
  }
  .nameandinfo {
    flex-grow: 2;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    margin-left: 25rpx;
    .nickname {
      margin-top: 10rpx;
      font-size: 35rpx;
      font-weight: 500;
    }
    .chatinfo {
      color: #a09d9d;
      margin-bottom: 10rpx;
      width: 350rpx;
    }
  }
  .goods {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    .goodsname {
      margin-top: 10rpx;
      color: #a09d9d;
      margin-top: 10rpx;
    }
    .ordertype {
      width: 38rpx;
      height: 38rpx;
      margin-bottom: 10rpx;
    }
  }
}
</style>
