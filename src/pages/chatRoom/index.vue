<template>
  <view class="container" v-if="userInfo">
    <NavBar mark="home" />
    <view class="chattitle">
      <view class="name" :style="{paddingTop:statusBarHeight}">
        {{userInfo.openid===orderInfo.publisherOpenid?orderInfo[userInfo.campus+'runnerInfo'].nickName:orderInfo[userInfo.campus+'publisherInfo'].nickName}}
      </view>
    </view>
    <scroll-view scroll-y :scroll-into-view="showid" :style="'height: '+scrollHeight" class="chatbox" scroll-anchoring :scroll-with-animation="true">
      <view class="chatInfo" v-for="(item,index) in allChatLog" :id="'showid'+index" :key="index">
        <view class="chatright" v-if="item.fromOpenid===userInfo.openid">
          <image class="avatarimage" :src="userInfo.openid===orderInfo.publisherOpenid?orderInfo[userInfo.campus+'publisherInfo'].avatarUrl:orderInfo[userInfo.campus+'runnerInfo'].avatarUrl" />
          <view v-if="item.msgType==='text'" class="textright">
            <view class="speakright"></view>
            <view class="chatcontent">
              <view>{{item.text}}</view>
            </view>
          </view>
          <image class="chatImage" v-if="item.msgType==='image'" :src="item.text" show-menu-by-longpress lazy-load mode="widthFix" @click="previewImage(item.text)" />

          <view v-if="item.msgType==='video'" class="videobox">
            <image class="chatVideo-r" :style="getVideoStyle(item.style)" :src="item.text" />
            <image v-if="loadingMap.get(item.text)" class="videoloading-r" src="@/static/loading.png" />
            <image v-if="!loadingMap.get(item.text)" class="playvideo-r" src="@/static/playVideo.png" @click="lookVideo(item)" />
          </view>

        </view>
        <view class="chatleft" v-else>
          <image class="avatarimage" :src="userInfo.openid===orderInfo.publisherOpenid?orderInfo[userInfo.campus+'runnerInfo'].avatarUrl:orderInfo[userInfo.campus+'publisherInfo'].avatarUrl" />
          <view v-if="item.msgType==='text'" class="textleft">
            <view class="speakleft"></view>
            <view class="chatcontent">
              <view>{{item.text}}</view>
            </view>
          </view>
          <image class="chatImage" v-if="item.msgType==='image'" :src="item.text" show-menu-by-longpress lazy-load mode="widthFix" @click="previewImage(item.text)" />

          <view v-if="item.msgType==='video'" class="videobox">
            <image class="chatVideo-l" :style="getVideoStyle(item.style)" :src="item.text" />
            <image class="playvideo-l" src="@/static/playVideo.png" @click="lookVideo(item)" />
          </view>
        </view>
      </view>
    </scroll-view>
    <view class="operationbar">
      <view class="operationbox">
        <view class="inputbox">
          <!-- <textarea style="width:100%" auto-height :show-confirm-bar="false" :cursor-spacing="15" v-model="inputValue" confirm-type="send" @confirm="senMsg" /> -->
          <!-- <input style="width:100%" :adjust-position="false" v-model="inputValue" confirm-type="send" confirm-hold @confirm="senMsg" @blur="blurInput" @focus="focusInput" /> -->
          <input style="width:100%" :adjust-position="false" v-model="inputValue" confirm-type="send" confirm-hold @confirm="senMsg" @keyboardheightchange="keyboardheightchange" />
        </view>
        <tui-icon name="add" color="#000000" size="65" unit="rpx" @click="chooseMedia"></tui-icon>
      </view>
    </view>
    <video class="covervideo" id="videoplayer" autoplay :direction="0" v-show="isFullScreen" :src="videoPath" @fullscreenchange="fullscreenchange" />
  </view>
</template>

<script>
import NavBar from "@/components/navBar.vue";
import navigationBar from "@/components/navigationBar.vue";
import { chatSendFiles } from "@/utils/tool.js";
export default {
  components: { navigationBar, NavBar },
  onLoad(option) {
    let scrollHeight =
      (uni.getStorageSync("systemInfo").screenHeight / 100) * 78;
    this.scrollHeight = scrollHeight + "px";
    this.initHeight = scrollHeight;
    this.orderInfo = JSON.parse(option.orderInfo);
    this.userInfo = uni.getStorageSync("userInfo");
    let socketObj = getApp().globalData.socketObj;
    this.socketObj = socketObj;
    let orderid = this.orderInfo.orderid;
    socketObj.emit("isChatLogTable", {
      orderid,
      dbTable: this.userInfo.campus + "_chatlogs",
    });
    socketObj.on("getAllChatLog", (data) => {
      this.allChatLog = data.allChatLog;
      if (this.allChatLog.length > 0) {
        this.changeScrollShow();
      }
    });
    socketObj.on("onMessage", (data) => {
      this.allChatLog.push(data.msgData);
      this.changeScrollShow();
    });
  },
  data() {
    return {
      isFullScreen: false,
      videoPath: null,
      userInfo: null,
      orderInfo: null,
      socketObj: null,
      inputValue: "",
      allChatLog: [],
      statusBarHeight: uni.getStorageSync("menuInfo").statusBarHeight,
      showid: null,
      systemInfo: uni.getStorageSync("systemInfo"),
      loadingMap: new Map(),
      scrollHeight: null,
      initHeight: null,
    };
  },
  methods: {
    changeScrollShow() {
      this.showid = "showid" + (this.allChatLog.length - 1);
    },
    senMsg() {
      let toopenid =
        this.userInfo.openid === this.orderInfo.publisherOpenid
          ? this.orderInfo.runnerOpenid
          : this.orderInfo.publisherOpenid;
      let orderid = this.orderInfo.orderid;
      this.socketObj.emit("sendMessage", {
        toopenid,
        dbTable: this.userInfo.campus + "_chatlogs",
        msgData: {
          text: this.inputValue,
          orderid,
          msgType: "text",
          fromOpenid: this.userInfo.openid,
        },
      });
      this.allChatLog.push({
        text: this.inputValue,
        orderid,
        msgType: "text",
        fromOpenid: this.userInfo.openid,
      });
      this.changeScrollShow();
      this.inputValue = "";
    },
    chooseMedia() {
      uni.chooseMedia({
        count: 1,
        success: async (res) => {
          let orderid = this.orderInfo.orderid;
          chatSendFiles(res, this, orderid, this.userInfo.campus + "_chatlogs");
        },
      });
    },
    previewImage(src) {
      uni.previewImage({ urls: [src], indicator: "none" });
    },
    getVideoStyle(style) {
      if (style) {
        let { windowWidth } = this.systemInfo;
        let { width, height } = style;
        let ratio = windowWidth / 2;
        if (height > width) {
          return {
            width: (ratio / height) * width + "px",
            height: ratio + "px",
          };
        }
        if (height === width) {
          return {
            width: ratio + "px",
            height: ratio + "px",
          };
        }
        if (height < width) {
          return {
            width: ratio + "px",
            height: (ratio / width) * height + "px",
          };
        }
      }
    },
    lookVideo(item) {
      this.isFullScreen = true;
      this.videoPath = item.videoCdnPath;
      // return
      let videoContext = uni.createVideoContext("videoplayer", this);
      // 进入全屏状态
      videoContext.requestFullScreen();
    },
    fullscreenchange(event) {
      let videoContext = uni.createVideoContext("videoplayer", this);
      if (event.detail.fullScreen === true) {
        videoContext.play();
      } else {
        videoContext.stop();
        this.isFullScreen = false;
      }
    },
    blurInput() {
      this.scrollHeight = this.initHeight + "px";
    },
    focusInput(e) {
      this.scrollHeight = (this.initHeight / 78) * 82 - e.detail.height + "px";
      this.changeScrollShow();
    },
    keyboardheightchange(e) {
      if (e.detail.height === 0) {
        this.scrollHeight = this.initHeight + "px";
      } else {
        this.scrollHeight =
          (this.initHeight / 78) * 82 - e.detail.height + "px";
      }
    },
  },
};
</script>

<style lang="scss">
page {
  background-color: #ededed;
}
.mainbox {
  transition: bottom 0.15s ease;
}
.covervideo {
  position: absolute;
}
.videobox {
  position: relative;
  box-sizing: content-box;
  .chatVideo-r {
    margin-right: 30rpx;
    border-radius: 15rpx;
  }
  .videoloading-r {
    position: absolute;
    top: calc(50% - 42rpx);
    left: calc(50% - 45rpx);
    width: 60rpx;
    height: 60rpx;
    animation: videoloading 1s linear infinite;
  }
  .playvideo-r {
    position: absolute;
    top: calc(50% - 42rpx);
    left: calc(50% - 45rpx);
    width: 60rpx;
    height: 60rpx;
  }
  .chatVideo-l {
    margin-left: 30rpx;
    border-radius: 15rpx;
  }
  .playvideo-l {
    position: absolute;
    top: calc(50% - 42rpx);
    left: calc(50% - 15rpx);
    width: 60rpx;
    height: 60rpx;
  }
}
.container {
  // position: relative;
  height: 100vh;
}
.chattitle {
  height: 11vh;
  width: 100%;
  z-index: 2;
  background-color: #ffffff;
  .name {
    font-size: 33rpx;
    color: #000;
    font-weight: 500;
    text-align: center;
    height: 44px;
    line-height: 44px;
  }
}
@-webkit-keyframes videoloading {
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
.chatbox {
  background-color: #ededed;
  width: 100%;
  box-sizing: border-box;
  transition: height 0.15s cubic-bezier(0.4, 0, 0.2, 1);
  .chatInfo {
    padding: 20rpx 25rpx;
    .chatright {
      display: flex;
      flex-direction: row-reverse;
      .avatarimage {
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
          border-top: 15rpx solid #ededed;
          border-bottom: 15rpx solid #ededed;
          border-left: 15rpx solid #64d777;
          border-right: 15rpx solid #ededed;
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
      .chatImage {
        max-width: 250rpx;
        border-radius: 15rpx;
        margin-right: 30rpx;
      }
    }
    .chatleft {
      display: flex;
      .avatarimage {
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
          border-top: 15rpx solid #ededed;
          border-bottom: 15rpx solid #ededed;
          border-left: 15rpx solid #ededed;
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
      .chatImage {
        max-width: 250rpx;
        border-radius: 15rpx;
        margin-left: 30rpx;
      }
      .chatVideo {
        margin-left: 30rpx;
        max-height: 350rpx;
        max-width: 400rpx;
        border-radius: 15rpx;
      }
    }
  }
}
.operationbar {
  background-color: #f6f6f6;
  border-top: 1px solid #e7e6e6;
  height: 11vh;
  width: 100%;
  .operationbox {
    padding: 0 20rpx;
    display: flex;
    height: 7vh;
    justify-content: space-between;
    align-items: center;
    .inputbox {
      width: 580rpx;
      height: 50rpx;
      padding: 13rpx 25rpx;
      border-radius: 10rpx;
      background-color: #ffffff;
      display: flex;
      align-items: center;
    }
  }
}
</style>
