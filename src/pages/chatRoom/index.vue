<template>
  <view class="container" v-if="userInfo">
    <NavBar mark="home" />
    <navigationBar :titleText="userInfo.openid===orderInfo.openid?orderInfo.runnerNickName:orderInfo.nickName" />
    <view :style="'height:'+allHeight"></view>
    <scroll-view id="chatbox" scroll-y :scroll-top="scrollTop" class="chatbox" :style="'top:'+allHeight">
      <view class="chatInfo" v-for="(item,index) in allChatLog" :key="index">
        <view class="chatright" v-if="item.fromOpenid===userInfo.openid">
          <image :src="userInfo.openid===orderInfo.openid?orderInfo.avatarUrl:orderInfo.runnerAvatarUrl" />
          <view class="textright">
            <view class="speakright"></view>
            <view class="chatcontent">
              <view>{{item.text}}</view>
            </view>
          </view>
        </view>
        <view class="chatleft" v-else>
          <image :src="userInfo.openid===orderInfo.openid?orderInfo.runnerAvatarUrl:orderInfo.avatarUrl" />
          <view class="textleft">
            <view class="speakleft"></view>
            <view class="chatcontent">
              <view>{{item.text}}</view>
            </view>
          </view>
        </view>
      </view>
    </scroll-view>
    <view class="operationbar">
      <view class="inputbox">
        <textarea style="width:100%" auto-height :show-confirm-bar="false" :cursor-spacing="15" v-model="inputValue" confirm-type="send" @confirm="senMsg" />
        <!-- <input style="width:100%" auto-height :show-confirm-bar="false" :cursor-spacing="15" v-model="inputValue" confirm-type="send" @confirm="senMsg" /> -->
      </view>
    </view>
  </view>
</template>

<script>
import NavBar from "@/components/navBar.vue";
import navigationBar from "@/components/navigationBar.vue";
export default {
  components: { navigationBar, NavBar },
  onLoad(option) {
    this.orderInfo = option;
  },
  onShow() {
    this.userInfo = uni.getStorageSync("userInfo");
    this.allHeight = uni.getStorageSync("menuInfo").allHeight;
    let socketObj = getApp().globalData.socketObj;
    this.socketObj = socketObj;
    socketObj.emit("isChatLogTable", { orderid: this.orderInfo.id });
    socketObj.on("getAllChatLog", (data) => {
      this.allChatLog = data.allChatLog;
    });
    socketObj.on("message", (data) => {
      this.allChatLog.push(data.msgData);
    });
  },
  data() {
    return {
      userInfo: null,
      orderInfo: null,
      socketObj: null,
      inputValue: "",
      msgType: "text",
      mediaUrl: "",
      allChatLog: [],
      scrollTop: 0
    };
  },
  methods: {
    senMsg() {
      let toopenid =
        this.userInfo.openid === this.orderInfo.openid
          ? this.orderInfo.runnerOpenid
          : this.orderInfo.openid;
      this.socketObj.emit("sendMessage", {
        toopenid,
        msgData: {
          text: this.msgType === "text" ? this.inputValue : this.mediaUrl,
          orderid: this.orderInfo.id,
          msgType: this.msgType,
          fromOpenid: this.userInfo.openid,
        },
      });
      this.allChatLog.push({
        text: this.msgType === "text" ? this.inputValue : this.mediaUrl,
        orderid: this.orderInfo.id,
        msgType: this.msgType,
        fromOpenid: this.userInfo.openid,
      });

      // let query = uni.createSelectorQuery();
      // query.select("#chatbox").boundingClientRect();
      // query.exec((res) => {
      //   console.log("9898res", res);
      //   this.scrollTop = res[0].bottom+res[0].height
      // });

      this.inputValue = "";
      this.msgType = "text";
      this.mediaUrl = "";
    },
  },
};
</script>

<style lang="scss">
.container {
  height: 100vh;
  position: relative;
}
.chatbox {
  position: absolute;
  bottom: 10vh;
  background-color: #f8f8f8;
  width: 100%;
//   overflow: auto;
  .chatInfo {
    margin: 35rpx 25rpx;
    .chatright {
      display: flex;
      flex-direction: row-reverse;
      image {
        width: 90rpx;
        height: 90rpx;
        border-radius: 10rpx;
      }
      .textright {
        position: relative;
        .speakright {
          position: absolute;
          right: 1px;
          top: 30rpx;
          border-top: 15rpx solid #f8f8f8;
          border-bottom: 15rpx solid #f8f8f8;
          border-left: 15rpx solid #64d777;
          border-right: 15rpx solid #f8f8f8;
        }
        .chatcontent {
          min-height: 40rpx;
          display: flex;
          align-items: center;
          padding: 25rpx;
          margin-right: 30rpx;
          border-radius: 15rpx;
          background-color: #64d777;
          view {
            max-width: 410rpx;
          }
        }
      }
    }
    .chatleft {
      display: flex;
      image {
        width: 90rpx;
        height: 90rpx;
        border-radius: 10rpx;
      }
      .textleft {
        position: relative;
        .speakleft {
          position: absolute;
          left: 1px;
          top: 30rpx;
          border-top: 15rpx solid #f8f8f8;
          border-bottom: 15rpx solid #f8f8f8;
          border-left: 15rpx solid #f8f8f8;
          border-right: 15rpx solid #ffffff;
        }
        .chatcontent {
          min-height: 40rpx;
          display: flex;
          align-items: center;
          padding: 25rpx;
          margin-left: 30rpx;
          border-radius: 15rpx;
          background-color: #ffffff;
          view {
            max-width: 410rpx;
          }
        }
      }
    }
  }
}
.operationbar {
  position: absolute;
  bottom: 0;
  background-color: #f8f8f8;
  border-top: 1px solid #cccaca;
  height: 12vh;
  width: 100%;
  .inputbox {
    height: 70rpx;
    margin: 20rpx 20rpx 0 20rpx;
    padding: 15rpx 25rpx;
    border-radius: 10rpx;
    background-color: #ffffff;
    display: flex;
    align-items: center;
  }
}
</style>
