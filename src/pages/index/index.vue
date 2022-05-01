<template>
  <fui-loading v-if="loading" text="加载中. . ." :srcCol="commonBase64.loading"></fui-loading>
  <tui-toast ref="toast" position="center"></tui-toast>
  <uni-transition :mode-class="['fade']" :show="isShowLogin">
    <!-- <div class="banner" :style="`background-image: url(${commonBase64.swiper1})`"> -->
    <div class="banner" :style="`background-image: url(${commonBase64.logo})`">
      <view class="coverbox"></view>
      <uni-transition v-if="showMark==='login'" :mode-class="['fade','zoom-in']" :show="true">
        <div class="glass">
          <view class="title">选择社区</view>
          <view class="selectbox">
            <view v-for="item in campuses" @click="selectCampus(item.code)" :key="item.code" class="campusitem">
              <view>{{item.name}}</view>
              <image v-if="currentCode===item.code" src="@/static/select.png" />
            </view>
          </view>
          <view class="operation">
            <button size="mini" type="primary" @click="login">
              <view class="butonstyle">
                <image src="@/static/weChat.png" />
                <view class="btntext">微信登录</view>
              </view>
            </button>
          </view>
        </div>
      </uni-transition>
      <uni-transition v-if="showMark==='getPhone'" :mode-class="['fade','zoom-in']" :show="true">
        <div class="glass">
          <view class="getphonebox">
            <view class="title1">绑定手机号</view>
            <view class="title2">请先绑定手机号再进行此操作</view>
            <view class="operation">
              <button size="mini" type="primary" open-type="getPhoneNumber" @getphonenumber="getPhonenumberGo">
                <view class="butonstyle">
                  <image src="@/static/weChat.png" />
                  <view class="btntext">微信用户一键绑定</view>
                </view>
              </button>
            </view>
          </view>
        </div>
      </uni-transition>
    </div>
  </uni-transition>
</template>

<script>
import { commonBase64, addCampusBase64 } from "@/base64/index.js";
import { getOpenid } from "@/utils/login.js";
import { uniRequest, jumpTo, getFileName, reSetArr } from "@/utils/tool.js";
export default {
  async onLoad() {
    let myCampuses = await uniRequest("campus/search", "POST");
    reSetArr(this.campuses, myCampuses.data);
  },
  async onShow() {
    //获取是否新用户
    let openid = await getOpenid();
    this.openid = openid;
    let userData = await uniRequest("userInfo/search", "POST", { openid });
    if (userData.data) {
      //如果是老用户 返回用户信息，并存到本地
      uni.setStorageSync("isFirst", false);
      uni.setStorageSync("userInfo", userData.data);
      uni.setStorageSync("isRefresh", false);
      this.loading = false;
      uni.switchTab({
        url: "/pages/list/index",
      });
    } else {
      this.loading = false;
      this.isShowLogin = true;
    }
  },
  data() {
    return {
      commonBase64,
      addCampusBase64,
      loading: true,
      isShowLogin: false,
      currentCode: null,
      userInfo: null,
      openid: null,
      showMark: "login",
    };
  },
  methods: {
    selectCampus(code) {
      this.currentCode = code;
    },
    login() {
      if (this.currentCode) {
        uni.getUserProfile({
          desc: "获取信息11",
          lang: "zh-CN",
          success: async (res) => {
            this.showMark = null
            this.loading = true
            console.log("9898用户信息", res);
            let resData = await uniRequest("txCos/saveAvatar", "POST", {
              folder: "userAvatar/",
              filePath: res.userInfo.avatarUrl,
              fileName: getFileName(),
            });
            let cloudPath = resData.data.cloudPath;
            let userInfo = {
              nickName: res.userInfo.nickName,
              openid: this.openid,
              gender: "1",
              avatarUrl: cloudPath,
            };
            this.userInfo = userInfo;
            this.loading = false
            this.showMark = "getPhone";
          },
          fail: (error) => {
            console.log("9898用户信息失败", error);
          },
        });
      } else {
        let options = {
          title: "请先选择runner社区~",
          imgUrl: addCampusBase64.toastImg,
          icon: true,
        };
        this.$refs.toast.show(options);
      }
    },
    async getPhonenumberGo(e) {
      if (e.detail.code) {
        let phone = (
          await uniRequest("wxApi/getPhoneNumber", "POST", {
            code: e.detail.code,
            openid: this.openid,
          })
        ).data.phone_info.phoneNumber;
        let info = {
          ...this.userInfo,
          phoneNumber: phone,
          type: "1",
          campus: this.currentCode,
        };
        await uniRequest("userInfo/add", "POST", info);
        uni.setStorageSync("isFirst", true);
        uni.setStorageSync("userInfo", info);
        uni.switchTab({
          url: "/pages/self/index",
        });
      } else {
      }
    },
  },
};
</script>

<style lang="scss">
.banner {
  width: 100vw;
  height: 100vh;
  background-position: center center;
  background-repeat: no-repeat;
  background-size: cover;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  .coverbox {
    position: absolute;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.2);
    backdrop-filter: blur(8px);
  }
}
.glass {
  width: 550rpx;
  padding: 30rpx 15rpx;
  border-radius: 30rpx;
  background-color: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(8px);
  box-shadow: 0 0 5px rgb(156, 156, 156);
  .title {
    font-weight: bolder;
    text-align: center;
  }
}
.selectbox {
  width: 100%;
  max-height: 700rpx;
  overflow: auto;
}
.campusitem {
  height: 70rpx;
  padding: 20rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
  image {
    width: 70rpx;
    height: 70rpx;
  }
}
.operation {
  text-align: center;
  .butonstyle {
    display: flex;
    justify-content: center;
    align-items: center;
    image {
      width: 48rpx;
      height: 48rpx;
      margin-right: 10rpx;
    }
    .btntext {
      font-size: 33rpx;
    }
  }
}
.getphonebox {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  .title1 {
    font-size: 40rpx;
  }
  .title2 {
    color: #f8f8f8;
    margin: 50rpx;
  }
}
</style>
