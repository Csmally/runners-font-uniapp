<template>
  <view>
    <NavBar mark="back" />
    <view :style="'height:'+allHeight"></view>
    <tui-toast ref="toast" position="center"></tui-toast>
    <view class="content" v-if="orderInfo">
      <view class="top">
        <view class="avatar">
          <image class="genderImg" v-if="orderInfo.gender==='1'" src="@/static/man.png" mode="aspectFit" />
          <image class="genderImg" v-if="orderInfo.gender==='2'" src="@/static/woman.png" mode="aspectFit" />
          <image :src="orderInfo.avatarUrl" class="avatarimg" />
        </view>
      </view>
      <view class="middle">
        <view class="radiusleft"></view>
        <view class="radiusright"></view>
        <view class="borderbiew"></view>
      </view>
      <view class="bottom">
        <view class="infoitem">
          <view class="itemtitle">商品信息</view>
          <view>
            <view class="itemcontent">
              <view>商品名称</view>
              <view>{{orderInfo.goodsName}}</view>
            </view>
            <view class="itemcontent">
              <view>商品购买地址</view>
              <view>{{orderInfo.goodsAddress}}</view>
            </view>
            <view class="itemcontent">
              <view>商品预估价格</view>
              <view>{{orderInfo.goodsPrice}}元</view>
            </view>
            <view class="itemcontent">
              <view>送达地址</view>
              <view>{{orderInfo.selfAddress}}</view>
            </view>
          </view>
        </view>
        <view class="infoitem">
          <view class="itemtitle">报酬</view>
          <view>
            <view class="itemcontent">
              <view> 酬劳</view>
              <view>{{orderInfo.price}}元</view>
            </view>
            <view class="itemcontent">
              <view> 完成后可获得</view>
              <view>{{Number(orderInfo.goodsPrice)+Number(orderInfo.price)}}元</view>
            </view>
          </view>
        </view>
        <view class="infoitem" v-if="orderInfo.desc||orderInfo.photos">
          <view class="itemtitle">附加信息</view>
          <view>
            <view class="itemcontentdesc" v-if="orderInfo.desc&&orderInfo.openid===userInfo.openid">
              <view>备注：</view>
              <view class="desctext">{{orderInfo.desc}}</view>
            </view>
            <view class="itemcontent" v-if="orderInfo.desc&&orderInfo.openid!==userInfo.openid">
              <view>备注：</view>
              <view>* * * * * *</view>
            </view>
            <view class="itemcontent" v-if="orderInfo.photos">
              <image class="desimg" :src="orderInfo.photos" mode="widthFix" @click="previewImage(orderInfo.photos)" />
            </view>
          </view>
        </view>
        <view class="infoitem" v-if="orderInfo.mobile||orderInfo.wxAccount||orderInfo.qqAccount">
          <view class="itemtitle">联系方式</view>
          <view>
            <view class="itemcontent" v-if="orderInfo.mobile">
              <view>手机号码</view>
              <view v-if="orderInfo.openid!==userInfo.openid">* * * * * *</view>
              <view v-if="orderInfo.openid===userInfo.openid">{{orderInfo.mobile}}</view>
            </view>
            <view class="itemcontent" v-if="orderInfo.wxAccount">
              <view>微信号码</view>
              <view v-if="orderInfo.openid!==userInfo.openid">* * * * * *</view>
              <view v-if="orderInfo.openid===userInfo.openid">{{orderInfo.wxAccount}}</view>
            </view>
            <view class="itemcontent" v-if="orderInfo.qqAccount">
              <view>QQ号码</view>
              <view v-if="orderInfo.openid!==userInfo.openid">* * * * * *</view>
              <view v-if="orderInfo.openid===userInfo.openid">{{orderInfo.qqAccount}}</view>
            </view>
          </view>
        </view>
      </view>
      <fui-button v-if="orderInfo.openid!==userInfo.openid" class="submitBtn" width="80%" background="#000000" color="#FFFFFF" @click="startOrder">开始</fui-button>
    </view>
    <tui-bottom-popup :zIndex="1002" :maskZIndex="1001" :show="isPopupShow" @close="closePopup">
      <view class="popupCampus">
        <view class="popuptext">确定开始此订单吗？</view>
        <view class="popupbtncontent">
          <fui-button class="popupbtn" width="70%" background="#FFFFFF" color="#000000" @click="closePopup">取消</fui-button>
          <fui-button class="popupbtn" width="70%" background="#000000" color="#FFFFFF" @click="okPopup">确定</fui-button>
        </view>
      </view>
    </tui-bottom-popup>
  </view>
</template>
<script>
import NavBar from "@/components/navBar.vue";
import { uniRequest, jumpTo } from "@/utils/tool.js";
export default {
  components: { NavBar },
  onLoad(option) {
    this.userInfo = uni.getStorageSync("userInfo");
    let orderInfo = JSON.parse(JSON.stringify(option));
    for (const key in orderInfo) {
      if (orderInfo[key] === "null") {
        orderInfo[key] = null;
      }
    }
    this.orderInfo = orderInfo;
  },
  onShow() {
    this.allHeight = uni.getStorageSync("menuInfo").allHeight;
  },
  data() {
    return {
      orderInfo: null,
      userInfo: null,
      allHeight: null,
      isPopupShow: null,
    };
  },
  methods: {
    closePopup() {
      this.isPopupShow = false;
    },
    startOrder() {
      this.isPopupShow = true;
    },
    async okPopup() {
      let resData = await uniRequest("order/update", "POST", {
        dbTable: this.orderInfo.campus + "_orders",
        searchParams: { id: this.orderInfo.id, status: "1" },
        updateParams: {
          runnerAvatarUrl: this.userInfo.avatarUrl,
          runnerGender: this.userInfo.gender,
          runnerNickName: this.userInfo.nickName,
          runnerOpenid: this.userInfo.openid,
          status: "2",
        },
      });
      if (resData.code === 1) {
        let searData = await uniRequest("order/search", "POST", {
          dbTable: this.orderInfo.campus,
          param: { id: this.orderInfo.id },
        });
        this.isPopupShow = false;
        jumpTo("/pages/result/index", {
          title: "runner,GO！",
          mark: "chat",
          timer: true,
          orderInfo: JSON.stringify(searData.data[0]),
        });
      } else {
        let options = {
          title: "可惜了，手速慢了一丢丢，换个订单继续吧～",
          duration: 2500,
        };
        this.$refs.toast.show(options);
        this.isPopupShow = false;
      }
    },
    previewImage(src) {
      uni.previewImage({ urls: [src], indicator: "none" });
    },
  },
};
</script>

<style lang="scss">
.content {
  padding: 30rpx;
  .top {
    display: flex;
    justify-content: center;
    padding-top: 15rpx;
    border-top: 1px solid #dddbdb;
    border-right: 1px solid #dddbdb;
    border-left: 1px solid #dddbdb;
    background-color: antiquewhite;
    .avatar {
      position: relative;
      .avatarimg {
        width: 160rpx;
        height: 160rpx;
        border-radius: 80rpx;
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
  }
  .middle {
    background-color: antiquewhite;
    // background-color: red;
    height: 50rpx;
    position: relative;
    .radiusleft {
      width: 50rpx;
      height: 50rpx;
      position: absolute;
      top: 0;
      left: 0;
      background-color: #ffffff;
      border-top-right-radius: 25rpx;
      border-bottom-right-radius: 25rpx;
      border-top: 1px solid #dddbdb;
      border-bottom: 1px solid #dddbdb;
    }
    .radiusright {
      width: 50rpx;
      height: 50rpx;
      position: absolute;
      top: 0;
      right: 0;
      background-color: #ffffff;
      border-top-left-radius: 25rpx;
      border-bottom-left-radius: 25rpx;
      border-top: 1px solid #dddbdb;
      border-bottom: 1px solid #dddbdb;
    }
    .borderbiew {
      height: 23rpx;
      border-bottom: 5px dashed #f8f8f8;
    }
  }
  .bottom {
    border-right: 1px solid #dddbdb;
    border-left: 1px solid #dddbdb;
    border-bottom: 1px solid #dddbdb;
    background-color: antiquewhite;
    padding: 20rpx;
  }
  .itemtitle {
    font-size: 45rpx;
    font-weight: 600;
  }
  .itemcontent {
    display: flex;
    justify-content: space-between;
    margin: 20rpx 0;
  }
  .itemcontentdesc {
    margin: 20rpx 0;
    .desctext {
      color: #8d8888;
    }
  }
  .desimg {
    width: 100%;
    border-radius: 30rpx;
  }
  .submitBtn {
    display: flex;
    justify-content: center;
    margin: 50rpx 0;
  }
}
.popupCampus {
  height: 25vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  .popuptext {
    font-size: 45rpx;
    font-weight: 500;
  }
  .popupbtncontent {
    width: 70%;
    display: flex;
    justify-content: center;
    .popupbtn {
      width: 100%;
      display: flex;
      justify-content: center;
      margin: 50rpx 0;
    }
  }
}
</style>
