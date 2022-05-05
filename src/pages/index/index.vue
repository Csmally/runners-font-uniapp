<template>
  <fui-loading v-if="loading||imgload===false" text="加载中. . ." :srcCol="commonBase64.loading"></fui-loading>
  <tui-toast ref="toast" position="center"></tui-toast>
  <uni-transition :mode-class="['fade']" :show="isShowLogin&&imgload">
    <!-- <div class="banner" :style="`background-image: url(${commonBase64.swiper1})`"> -->
    <div class="banner">
      <view class="coverbox"></view>
      <image class="coverimg" src="https://static.runners.ink/project/2041651476317_.pic_hd.jpg" @load="imgload" />
      <view class="htitle" v-if="backImgLoad">RunnersPub</view>
      <uni-transition v-if="showMark==='login'&&backImgLoad===true" class="loginbox" :mode-class="['fade','zoom-in']" :show="true">
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
      <uni-transition v-if="showMark==='getPhone'&&backImgLoad===true" class="loginbox" :mode-class="['fade','zoom-in']" :show="true">
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
import { uniRequest, getFileName, reSetArr } from "@/utils/tool.js";
export default {
  async onLoad() {
    let myCampuses = await uniRequest("campus/search", "POST");
    reSetArr(this.campuses, myCampuses.data);
  },
  async onShow() {
    //获取是否新用户
    let loginData = await getOpenid();
    this.openid = loginData.openid;
    this.unionid = loginData.unionid;
    let userData = await uniRequest("userInfo/search", "POST", {
      unionid: this.unionid,
    });
    console.log("9898数据库存的", userData);
    if (userData.data) {
      if (userData.data.openid) {
        //如果是老用户 返回用户信息，并存到本地
        uni.setStorageSync("isFirst", false);
        uni.setStorageSync("userInfo", userData.data);
        uni.setStorageSync("isRefresh", false);
        this.loading = false;
        uni.switchTab({
          url: "/pages/list/index",
        });
      } else {
        this.mark = "edit";
        this.loading = false;
        this.isShowLogin = true;
      }
    } else {
      this.mark = "add";
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
      unionid: null,
      showMark: "login",
      backImgLoad: false,
      mark: null,
    };
  },
  methods: {
    imgload(res) {
      this.backImgLoad = true;
    },
    selectCampus(code) {
      this.currentCode = code;
    },
    login() {
      if (this.currentCode) {
        uni.getUserProfile({
          desc: "获取信息",
          lang: "zh-CN",
          success: async (res) => {
            this.showMark = null;
            this.loading = true;
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
              unionid: this.unionid,
              gender: "1",
              avatarUrl: cloudPath,
            };
            this.userInfo = userInfo;
            this.loading = false;
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
        if (this.mark === "add") {
          await uniRequest("userInfo/add", "POST", info);
        } else {

          await uniRequest("userInfo/update", "POST", {
            searchParams: { unionid: this.unionid },
            updateParams: info,
          });
        }
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
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
  .coverbox {
    z-index: 3;
    position: absolute;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(57, 57, 57, 0.2);
    backdrop-filter: blur(5px);
  }
  .coverimg {
    z-index: 2;
    width: 100vw;
    height: 100vh;
    position: absolute;
    top: 0;
    left: 0;
  }
  .htitle {
    z-index: 4;
    margin-bottom: 35rpx;
    font-size: 60rpx;
    font-weight: bolder;
    font-family: Verdana, Geneva, Tahoma, sans-serif;
  }
}
.loginbox {
  z-index: 4;
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
