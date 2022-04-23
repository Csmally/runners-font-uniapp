<template>
  <view class="container" @click.stop>
    <view class="loading" v-if="loading">
      <image src="@/static/loadingBottom.png" />
    </view>
    <uni-transition :mode-class="['fade','zoom-in']" :show="!loading">
      <view class="chatBox">
        <view class="chatList">
          <view class="chatitem">
            <view class="name">稍等方式:</view>
            <view class="content">短的宝宝感染</view>
          </view>
          <view class="chatitem">
            <view class="name">23fdf反倒是:</view>
            <view class="content">感豆腐干豆腐干豆腐放仨的宝宝感染</view>
          </view>
          <view class="chatitem">
            <view class="name">sdfv:</view>
            <view class="content">短发是法国代购防晒服防辐射服咕咚咕咚...</view>
          </view>
          <view class="chatitem">
            <view class="name">sasf搜索:</view>
            <view class="content">短发是豆腐干豆腐放仨的宝宝感染？？？</view>
          </view>
          <view class="chatitem">
            <view class="name">43453的官方地方:</view>
            <view class="content">哈哈哈哈😄</view>
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
export default {
  data() {
    return {
      loading: true,
      inputValue: "",
    };
  },
  created() {
    setTimeout(() => {
      this.loading = false;
    }, 3000);
  },
  methods: {
    sendChat() {
      console.log("9898value", this.inputValue);
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
