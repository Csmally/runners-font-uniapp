<template>
  <view class="container">
    <!-- <tui-toast ref="toast" position="center"></tui-toast> -->
    <view class="info">
      <view v-if="userInfo" class="infotop" :style="'top:'+allHeight">
        <view class="avatar">
          <image class="genderImg" v-if="userInfo.gender==='1'" src="@/static/man.png" mode="aspectFit" />
          <image class="genderImg" v-if="userInfo.gender==='2'" src="@/static/woman.png" mode="aspectFit" />
          <image class="avatarImg" :src="userInfo.avatarUrl" />
        </view>
        <text>{{userInfo.nickName}}</text>
      </view>
      <view v-if="userInfo" class="infobottom">
        <view class="socialcontact">
          <view class="socialcontactitem">
            <text>0</text>
            <text>关注</text>
          </view>
          <view class="socialcontactitem">
            <text>0</text>
            <text>粉丝</text>
          </view>
          <view class="socialcontactitem">
            <text>0</text>
            <text>获赞</text>
          </view>
        </view>
        <view class="operation">
          <view class="operationinfo" @click="editInfo">
            <text>编辑资料</text>
          </view>
          <view class="setting">
            <view></view>
            <view></view>
            <view></view>
          </view>
        </view>
      </view>
      <image class="backgroundImage" src="@/static/test5.jpg" mode="scaleToFill" />
    </view>
    <view class="content">
      <ContentInfo />
    </view>
    <!-- 底部弹出 -->
    <tui-bottom-popup :zIndex="1002" :maskZIndex="1001" :show="isPopupShow" @close="closePopup">
      <view class="noallow">
        <p class="p1">由于微信隐私政策原因，若您的性别数据错误，您可以在本页面“编辑资料”中自行修改</p>
        <p class="p2">（此操作不会影响您的微信资料）</p>
      </view>
    </tui-bottom-popup>
  </view>
</template>

<script>
import ContentInfo from "./contentInfo.vue";
import { jumpTo } from "@/utils/tool.js";
export default {
  components: { ContentInfo },
  data() {
    return {
      allHeight: null,
      userInfo: null,
      isPopupShow: false,
    };
  },
  onLoad() {},
  onShow() {
    this.allHeight = uni.getStorageSync("menuInfo").allHeight;
    this.userInfo = uni.getStorageSync("userInfo");
    let isFirst = uni.getStorageSync("isFirst");
    if (isFirst) {
      this.isPopupShow = true;
    }
  },
  methods: {
    closePopup() {
      this.isPopupShow = false;
      uni.setStorageSync("isFirst", false);
    },
    editInfo() {
      jumpTo("/pages/self/editInfo");
    },
  },
};
</script>

<style lang="scss">
.container {
  height: 100vh;
  position: relative;
}
.info {
  width: 100%;
  height: 50%;
  position: relative;
}
.backgroundImage {
  width: 100%;
  height: 100%;
}
.infotop {
  position: absolute;
  padding: 35rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  .avatar {
    position: relative;
    .avatarImg {
      width: 140rpx;
      height: 140rpx;
      border-radius: 70rpx;
      border: 5rpx solid #ffffff;
    }
    .genderImg {
      position: absolute;
      top: 0;
      right: -15rpx;
      width: 50rpx;
      height: 50rpx;
      border-radius: 25rpx;
      background-color: #ffffff;
    }
  }
  text {
    margin-top: 10rpx;
    font-size: 40rpx;
    font-weight: bolder;
    color: #ffffff;
  }
}
.infobottom {
  position: absolute;
  bottom: 5vh;
  padding: 20rpx 0;
  color: #ffffff;
  font-weight: 700;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .socialcontact {
    margin-left: 20rpx;
    display: flex;
    .socialcontactitem {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-right: 50rpx;
    }
  }
  .operation {
    margin-right: 20rpx;
    display: flex;
    align-items: center;
    .operationinfo {
      display: flex;
      width: 180rpx;
      height: 55rpx;
      justify-content: center;
      align-items: center;
      border-radius: 30rpx;
      margin-right: 30rpx;
      border: 2rpx solid #ffffff;
    }
    .setting {
      display: flex;
      flex-direction: column;
      height: 55rpx;
      width: 75rpx;
      border-radius: 25rpx;
      border: 2rpx solid #ffffff;
      justify-content: center;
      align-items: center;
      view {
        width: 40rpx;
        height: 5rpx;
        border-radius: 3rpx;
        margin: 5rpx 0;
        background-color: #ffffff;
      }
    }
  }
}
.content {
  position: absolute;
  bottom: 0;
  height: 55%;
  width: 100%;
  border-top-left-radius: 60rpx;
  border-top-right-radius: 60rpx;
  background-color: #ffffff;
}
.noallow {
  height: 20vh;
  background-image: url("/static/noAllow.png");
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  .p1{
    font-size: 35rpx;
    margin: 0 45rpx;
  }
  .p2{
    margin-top: 50rpx;
    color: #a3a2a2;
  }
}
</style>
