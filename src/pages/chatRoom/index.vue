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
          <image class="avatarimage" :src="userInfo.openid===orderInfo.openid?orderInfo.avatarUrl:orderInfo.runnerAvatarUrl" />
          <view v-if="item.msgType==='text'" class="textright">
            <view class="speakright"></view>
            <view class="chatcontent">
              <view>{{item.text}}</view>
            </view>
          </view>
          <image class="chatImage" v-if="item.msgType==='image'" :src="item.text" lazy-load mode="heightFix" @click="previewImage(item.text)" />
          <video :id="'video'+index" :style="getVideoStyle(item.style)" class="chatVideo" v-if="item.msgType==='video'" object-fit="fill" :src="item.text" :show-center-play-btn="!videoLoadingMap.get(item.text)" @play="playVideo(index)" @fullscreenchange="fullscreenchange" play-btn-position="center" :vslide-gesture-in-fullscreen="false" :show-progress="false" :show-fullscreen-btn="false">
            <cover-view class="covervideo" v-if="videoLoadingMap.get(item.text)">
              <cover-image class="videoloading" src="@/static/loading.png" />
            </cover-view>
          </video>
        </view>
        <view class="chatleft" v-else>
          <image class="avatarimage" :src="userInfo.openid===orderInfo.openid?orderInfo.runnerAvatarUrl:orderInfo.avatarUrl" />
          <view class="textleft">
            <view class="speakleft"></view>
            <view class="chatcontent">
              <view v-if="item.msgType==='text'">{{item.text}}</view>
            </view>
          </view>
          <image class="chatImage" v-if="item.msgType==='image'" :src="item.text" lazy-load mode="heightFix" @click="previewImage(item.text)" />
          <video :id="'video'+index" class="chatVideo" v-if="item.msgType==='video'" :src="item.text" @play="playVideo(index)" play-btn-position="center" :vslide-gesture-in-fullscreen="false" :show-progress="false" :show-fullscreen-btn="false" />
        </view>
      </view>
    </scroll-view>
    <view class="operationbar">
      <view class="operationbox">
        <view class="inputbox">
          <!-- <textarea style="width:100%" auto-height :show-confirm-bar="false" :cursor-spacing="15" v-model="inputValue" confirm-type="send" @confirm="senMsg" /> -->
          <input style="width:100%" auto-height :show-confirm-bar="false" :cursor-spacing="15" v-model="inputValue" confirm-type="send" @confirm="senMsg" />
        </view>
        <tui-icon name="add" color="#000000" size="65" unit="rpx" @click="chooseMedia"></tui-icon>
      </view>
    </view>
  </view>
</template>

<script>
import NavBar from "@/components/navBar.vue";
import navigationBar from "@/components/navigationBar.vue";
import { uploadFile } from "@/utils/tool.js";
export default {
  components: { navigationBar, NavBar },
  onLoad(option) {
    this.orderInfo = option;
  },
  onShow() {
    console.log("9898showle");
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
      allChatLog: [],
      scrollTop: 0,
      statusBarHeight: uni.getStorageSync("menuInfo").statusBarHeight,
      showid: null,
      systemInfo: uni.getStorageSync("systemInfo"),
      videoLoadingMap: new Map(),
    };
  },
  methods: {
    dianji() {
      let test = [5, 2, 1, 8, 3];
      for (const item of test) {
        console.log("9898test前", item);
        setTimeout(() => {
          console.log("9898test后", item);
        }, item * 1000);
      }
    },
    senMsg() {
      let toopenid =
        this.userInfo.openid === this.orderInfo.openid
          ? this.orderInfo.runnerOpenid
          : this.orderInfo.openid;
      let orderid = this.orderInfo.campus + "-" + this.orderInfo.id;
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
          console.log("9898res11", res);
          let orderid = this.orderInfo.campus + "-" + this.orderInfo.id;
          await Promise.all(
            res.tempFiles.map((item) => {
              return (async () => {
                let cdnPath = await uploadFile({
                  filePath: item.tempFilePath,
                  folder: "chatLogMedia/",
                });
                this.allChatLog.push({
                  text: cdnPath,
                  orderid,
                  msgType: res.type,
                  fromOpenid: this.userInfo.openid,
                  style:
                    res.type === "video"
                      ? { width: item.width, height: item.height }
                      : null,
                });
                this.showid = "showid" + (this.allChatLog.length - 1);
                this.socketObj.emit("sendMessage", {
                  toopenid:
                    this.userInfo.openid === this.orderInfo.openid
                      ? this.orderInfo.runnerOpenid
                      : this.orderInfo.openid,
                  msgData: {
                    text: cdnPath,
                    orderid,
                    msgType: res.type,
                    fromOpenid: this.userInfo.openid,
                    style:
                      res.type === "video"
                        ? { width: item.width, height: item.height }
                        : null,
                  },
                });
                // this.videoLoadingMap.delete(item.tempFilePath);
                return cdnPath;
              })();
            })
          );

          // for (const item of res.tempFiles) {
          //   uni.getFileSystemManager().readFile({
          //     filePath: item.tempFilePath, //选择图片返回的相对路径
          //     encoding: "base64", //编码格式
          //     success: (res) => {
          //       let base64 = "data:image/jpeg;base64," + res.data;
          //       console.log("9898base64", base64);
          //       this.allChatLog.push({
          //         text: base64,
          //         orderid,
          //         msgType: res.type,
          //         fromOpenid: this.userInfo.openid,
          //         style:
          //           res.type === "video"
          //             ? { width: item.width, height: item.height }
          //             : null,
          //       });
          //       this.showid = "showid" + (this.allChatLog.length - 1);
          //       this.videoLoadingMap.set(item.tempFilePath, true);
          //     },
          //   });
          //   uploadFile({
          //     filePath: item.tempFilePath,
          //     folder: "chatLogMedia/",
          //   }).then((resPath) => {
          //     this.socketObj.emit("sendMessage", {
          //       toopenid:
          //         this.userInfo.openid === this.orderInfo.openid
          //           ? this.orderInfo.runnerOpenid
          //           : this.orderInfo.openid,
          //       msgData: {
          //         text: resPath,
          //         orderid,
          //         msgType: res.type,
          //         fromOpenid: this.userInfo.openid,
          //         style:
          //           res.type === "video"
          //             ? { width: item.width, height: item.height }
          //             : null,
          //       },
          //     });
          //     this.videoLoadingMap.delete(item.tempFilePath);
          //   });
          // }
        },
      });
    },
    playVideo(index) {
      this.videoContext = uni.createVideoContext("video" + index);
      // 进入全屏状态
      this.videoContext.requestFullScreen();
    },
    exitFullScreen(index) {
      this.videoContext = uni.createVideoContext("video" + index);
      // 进入全屏状态
      this.videoContext.exitFullScreen();
    },
    previewImage(src) {
      uni.previewImage({ urls: [src], indicator: "none" });
    },
    fullscreenchange(val) {
      console.log("9898", val);
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
.covervideo {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  .videoloading {
    width: 60rpx;
    height: 60rpx;
    animation: videoloading 1s linear infinite;
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
      .chatVideo {
        margin-right: 30rpx;
        border-radius: 15rpx;
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
