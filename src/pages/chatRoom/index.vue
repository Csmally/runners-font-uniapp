<template>
  <view class="container" v-if="userInfo">
    <NavBar mark="home" />
    <view class="chattitle" :style="{paddingTop:statusBarHeight}">
      <view class="name">
        {{userInfo.openid===orderInfo.openid?orderInfo.runnerNickName:orderInfo.nickName}}
      </view>
    </view>
    <scroll-view scroll-y :scroll-into-view="showid" class="chatbox" id="chatbox">
      <view class="chatInfo" v-for="(item,index) in allChatLog" :id="'showid'+index" :key="index">
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
        <!-- <textarea style="width:100%" auto-height :show-confirm-bar="false" :cursor-spacing="15" v-model="inputValue" confirm-type="send" @confirm="senMsg" /> -->
        <input style="width:100%" auto-height :show-confirm-bar="false" :cursor-spacing="15" v-model="inputValue" confirm-type="send" @confirm="senMsg" />
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
    let socketObj = getApp().globalData.socketObj;
    this.socketObj = socketObj;
    let orderid = this.orderInfo.campus + "-" + this.orderInfo.id;
    socketObj.emit("isChatLogTable", { orderid });
    socketObj.on("getAllChatLog", (data) => {
      this.allChatLog = data.allChatLog;
      if (this.allChatLog.length > 0) {
        this.showid = "showid" + (this.allChatLog.length - 1);
      }
    });
    socketObj.on("onMessage", (data) => {
      this.allChatLog.push(data.msgData);
      this.showid = "showid" + (this.allChatLog.length - 1);
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
      scrollTop: 0,
      statusBarHeight: uni.getStorageSync("menuInfo").statusBarHeight,
      showid: null,
    };
  },
  methods: {
    senMsg() {
      let toopenid =
        this.userInfo.openid === this.orderInfo.openid
          ? this.orderInfo.runnerOpenid
          : this.orderInfo.openid;
      let orderid = this.orderInfo.campus + "-" + this.orderInfo.id;
      this.socketObj.emit("sendMessage", {
        toopenid,
        msgData: {
          text: this.msgType === "text" ? this.inputValue : this.mediaUrl,
          orderid,
          msgType: this.msgType,
          fromOpenid: this.userInfo.openid,
        },
      });
      this.allChatLog.push({
        text: this.msgType === "text" ? this.inputValue : this.mediaUrl,
        orderid,
        msgType: this.msgType,
        fromOpenid: this.userInfo.openid,
      });
      this.showid = "showid" + (this.allChatLog.length - 1);
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
}
.chattitle {
  height: 11vh;
  box-sizing: border-box;
  .name {
    font-size: 33rpx;
    color: #000;
    font-weight: 500;
    text-align: center;
    height: 44px;
    line-height: 44px;
  }
}
.chatbox {
  background-color: #f8f8f8;
  width: 100%;
  height: 78vh;
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
  background-color: #f8f8f8;
  border-top: 1px solid #cccaca;
  height: 11vh;
  width: 100%;
  .inputbox {
    height: 50rpx;
    margin: 20rpx 20rpx 0 20rpx;
    padding: 15rpx 25rpx;
    border-radius: 10rpx;
    background-color: #ffffff;
    display: flex;
    align-items: center;
  }
}
</style>
