<template>
  <view class="container" v-if="userInfo">
    <NavBar mark="home" />
    <view class="chattitle">
      <view class="name" :style="{paddingTop:statusBarHeight}">
        {{userInfo.openid===orderInfo.openid?orderInfo.runnerNickName:orderInfo.nickName}}
      </view>
    </view>
    <view class="mainbox" :style="'width:100%;position: absolute;bottom: '+ keyboardheight">
      <scroll-view scroll-y :scroll-into-view="showid" class="chatbox" id="chatbox">
        <view class="chatInfo" v-for="(item,index) in allChatLog" :id="'showid'+index" :key="index">
          <view class="chatright" v-if="item.fromOpenid===userInfo.openid">
            <image class="avatarimage" :src="userInfo.openid===orderInfo.openid?orderInfo.avatarUrl:orderInfo.runnerAvatarUrl" />
            <view v-if="item.msgType==='text'" class="textright">
              <view class="speakright"></view>
              <view class="chatcontent">
                <view>{{item.text}}</view>
              </view>
            </view>
            <image class="chatImage" v-if="item.msgType==='image'" :src="item.text" lazy-load mode="heightFix" @click="previewImage(item.text)" />

            <view v-if="item.msgType==='video'" class="videobox">
              <image class="chatVideo-r" :style="getVideoStyle(item.style)" :src="item.text" />
              <image v-if="loadingMap.get(item.text)" class="videoloading-r" src="@/static/loading.png" />
              <image v-if="!loadingMap.get(item.text)" class="playvideo-r" src="@/static/playVideo.png" @click="lookVideo(item)" />
            </view>

          </view>
          <view class="chatleft" v-else>
            <image class="avatarimage" :src="userInfo.openid===orderInfo.openid?orderInfo.runnerAvatarUrl:orderInfo.avatarUrl" />
            <view v-if="item.msgType==='text'" class="textleft">
              <view class="speakleft"></view>
              <view class="chatcontent">
                <view>{{item.text}}</view>
              </view>
            </view>
            <image class="chatImage" v-if="item.msgType==='image'" :src="item.text" lazy-load mode="heightFix" @click="previewImage(item.text)" />

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
            <input style="width:100%" auto-height :show-confirm-bar="false" v-model="inputValue" confirm-type="send" @confirm="senMsg" :adjust-position="false" @keyboardheightchange="keyboardheightchange" />
          </view>
          <tui-icon name="add" color="#000000" size="65" unit="rpx" @click="chooseMedia"></tui-icon>
        </view>
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
    this.orderInfo = option;
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
      isFullScreen: false,
      videoPath: null,
      userInfo: null,
      orderInfo: null,
      socketObj: null,
      inputValue: "",
      allChatLog: [],
      scrollTop: 0,
      statusBarHeight: uni.getStorageSync("menuInfo").statusBarHeight,
      showid: null,
      systemInfo: uni.getStorageSync("systemInfo"),
      loadingMap: new Map(),
      keyboardheight: "0px",
    };
  },
  methods: {
    senMsg() {
      let toopenid =
        this.userInfo.openid === this.orderInfo.openid
          ? this.orderInfo.runnerOpenid
          : this.orderInfo.openid;
      let orderid = this.orderInfo.orderid;
      this.socketObj.emit("sendMessage", {
        toopenid,
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
      this.showid = "showid" + (this.allChatLog.length - 1);
      this.inputValue = "";
    },
    chooseMedia() {
      uni.chooseMedia({
        success: async (res) => {
          let orderid = this.orderInfo.orderid;
          chatSendFiles(res, this, orderid);
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
    keyboardheightchange(e) {
      if (e.detail.height === 0) {
        this.keyboardheight = e.detail.height + "px";
      } else {
        this.keyboardheight = e.detail.height - 25 + "px";
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
  transition: bottom 0.25s linear;
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
  position: relative;
  height: 100vh;
}
.chattitle {
  height: 11vh;
  position: absolute;
  top: 0;
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
  height: 78vh;
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
        height: 350rpx;
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
        height: 350rpx;
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
    padding: 20rpx;
    display: flex;
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
