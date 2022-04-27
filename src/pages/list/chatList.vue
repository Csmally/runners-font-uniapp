<template>
  <view class="container" @click.stop>
    <view class="loading" v-if="loading">
      <image :src="base64Img.loadingChatList" />
    </view>
    <uni-transition :mode-class="['fade','zoom-in']" :show="!loading">
      <view class="chatBox">
        <view class="chatList">
          <view class="chatitem" v-for="(item,index) in data" :key="index">
            <view class="name">{{item.name}}:</view>
            <view class="content">{{item.content}}</view>
          </view>
        </view>
        <view class="chatinput">
          <input placeholder="评论" v-model="inputValue" confirm-type="send" :cursor-spacing="20" @confirm="sendChat" />
        </view>
      </view>
    </uni-transition>
  </view>
</template>

<script>
import base64Img from "@/base64/common.json";
import { uniRequest } from "@/utils/tool.js";
export default {
  props: {
    userInfo: {
      type: Object,
      default: null,
    },
    orderid: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      base64Img,
      loading: true,
      inputValue: "",
      data: [],
    };
  },
  async created() {
    let data = (await uniRequest("orderOpration/search", "POST", {
      dbTable: this.userInfo.campus + "_orderchats",
      param: {
        orderid: this.orderid
      }
    })).data
    this.data = data
    this.loading = false
  },
  methods: {
    async sendChat() {
      await uniRequest("orderOpration/add", "POST", {
        dbTable: this.userInfo.campus + "_orderchats",
        param: {
          orderid: this.orderid,
          openid: this.userInfo.openid,
          name: this.userInfo.nickName,
          content: this.inputValue,
        },
      });
      this.inputValue = "";
    },
  },
};
</script>

<style lang="scss">
.container {
  padding: 20rpx 0;
}
.loading {
  text-align: center;
  image {
    width: 30rpx;
    height: 30rpx;
    animation: loading 1s linear infinite;
  }
}
@keyframes loading {
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
.chatBox {
  .chatList {
    max-height: 500rpx;
    color: #a3a2a2;
    overflow: auto;
    margin-bottom: 25rpx;
    .chatitem {
      margin: 15rpx 0;
      display: flex;
      .name {
        white-space: nowrap;
        color: #747474;
        font-weight: bold;
        margin-right: 20rpx;
      }
      .content {
        // max-width: 75%;
      }
    }
  }
  .chatinput {
    height: 80rpx;
    border-radius: 30rpx;
    background-color: #f8f8f8;
    display: flex;
    align-items: center;
    padding: 0 30rpx;
    input {
      width: 100%;
    }
  }
}
</style>
