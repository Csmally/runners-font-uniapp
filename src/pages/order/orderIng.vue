<template>
  <view class="container">
    <view v-for="item in orderData" :key="item.id" class="chatitem" @click="selectChat(item)">
      <image v-if="userInfo.openid===item.publisherOpenid" class="avatar" :src="item.runnerInfo.avatarUrl" />
      <image v-else class="avatar" :src="item.publisherInfo.avatarUrl" />
      <view class="nameandinfo">
        <view class="nickname">
          <view v-if="userInfo.openid===item.publisherOpenid">{{item.runnerInfo.nickName}}</view>
          <view v-else>{{item.publisherInfo.nickName}}</view>
        </view>
        <view>
          <view v-if="item.lastChat">
            <view class="chatinfo hiddenText" v-if="item.lastChat.msgType==='text'">{{item.lastChat.text}}</view>
            <view class="chatinfo hiddenText" v-if="item.lastChat.msgType==='voice'">[语音]</view>
            <view class="chatinfo hiddenText" v-if="item.lastChat.msgType==='image'">[图片]</view>
            <view class="chatinfo hiddenText" v-if="item.lastChat.msgType==='video'">[视频]</view>
          </view>
        </view>
      </view>
      <view class="goods">
        <view class="goodsname">
          {{item.goodsName}}
        </view>
        <view style="text-align: right">
          <image v-if="userInfo.openid===item.publisherOpenid" class="ordertype" src="@/static/ordersend.png" />
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
    orderData: {
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
      test: 1,
    };
  },
  methods: {
    selectChat(item) {
      jumpTo("/pages/chatRoom/index", { orderInfo: JSON.stringify(item) });
    },
  },
};
</script>

<style lang="scss">
.container {
  height: 88vh;
  overflow: auto;
}
.chatitem {
  padding: 25rpx;
  border-bottom: 1px solid #f8f8f8;
  display: flex;
  .avatar {
    width: 120rpx;
    height: 120rpx;
    border-radius: 12rpx;
  }
  .nameandinfo {
    flex-grow: 2;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    margin-left: 25rpx;
    .nickname {
      margin-top: 5rpx;
      font-size: 33rpx;
      font-weight: 500;
    }
    .chatinfo {
      color: #a09d9d;
      margin-bottom: 5rpx;
      width: 350rpx;
      font-size: 30rpx;
    }
  }
  .goods {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    .goodsname {
      margin-top: 5rpx;
      color: #a09d9d;
      margin-top: 10rpx;
    }
    .ordertype {
      width: 38rpx;
      height: 38rpx;
      margin-bottom: 5rpx;
    }
  }
}
</style>
