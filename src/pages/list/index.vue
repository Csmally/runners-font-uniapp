<template>
  <scroll-view class="myScrollView" refresher-default-style="none" refresher-enabled :refresher-triggered="topRefresh" @refresherrefresh="scrollTop" scroll-y>
    <template slot="refresher">
      <RefreshLoading />
    </template>
    <view>
      <!-- 轮播图 -->
      <!-- 轮播图指示器颜色 indicator-color="#d5eef5" indicator-active-color="#81ccf5" -->
      <swiper class="card-swiper" previous-margin="70rpx" next-margin="70rpx" :circular="true" :autoplay="true" :indicator-dots="true" :interval="3000" :current="cardCur" :duration="500" @change="swiperChange">
        <swiper-item v-for="(item,index) in list" :key="index" :class="cardCur==index ? 'cur' : ''">
          <image :src="item" class="swiper-item swiperVip shadow-blur" />
          <!-- <view class="swiper-item swiperVip shadow-blur">
          </view> -->
        </swiper-item>
      </swiper>
      <!-- 搜索框 -->
      <view class="search">
        <view class="searchText hiddenText" @click="changeDropdownShow">{{userCampus}}</view>
        <text style="font-weight: bold">></text>
        <view class="searchInput">
          <input placeholder="搜索" confirm-type="search" />
        </view>
      </view>
      <view class="list">
        <view class="listItem" v-for="(item,index) in data" :key="index">
          <view class="itemTop">
            <view class="topLeft">
              <view class="avatar">
                <image class="avatarImg" :src="item.avatarUrl" mode="aspectFit" />
                <image v-if="item.gender==='1'" class="genderImg" src="@/static/man.png" mode="aspectFit" />
                <image v-if="item.gender==='2'" class="genderImg" src="@/static/woman.png" mode="aspectFit" />
              </view>
              <view class="nickName">{{item.nickName}}</view>
            </view>
            <view class="topRight">
              <view class="followin">关注</view>
              <view class="more">
                <view></view>
                <view></view>
                <view></view>
              </view>
            </view>
          </view>
          <view class="itemMiddle">
            <view class="middleMainInfo">
              <view class="mainInfo">
                <image src="@/static/goods.png" mode="aspectFit" />
                <view>{{item.goodsName}}</view>
              </view>
              <view class="mainInfo">
                <image src="@/static/store.png" mode="aspectFit" />
                <view>{{item.goodsAddress}}</view>
              </view>
              <view class="mainInfo">
                <image src="@/static/wallet.png" mode="aspectFit" />
                <view>{{item.price}}元</view>
              </view>
              <view v-if="item.desc" class="mainInfo">
                <image src="@/static/chat.png" mode="aspectFit" />
                <view> * * * * * * </view>
              </view>
            </view>
            <image class="desimg" v-if="item.photos" :src="item.photos" mode="widthFix" />
          </view>
          <view class="itemBottom">

          </view>
        </view>
      </view>
    </view>
  </scroll-view>
</template>

<script>
import RefreshLoading from "@/components/refreshLoading.vue";
import { uniRequest, jumpTo } from "@/utils/tool.js";
import { getOpenid, getUserProfile } from "@/utils/login.js";
export default {
  components: { RefreshLoading },
  data() {
    return {
      cardCur: 0,
      list: [
        "/static/swiper1.jpeg",
        "/static/swiper2.jpeg",
        "/static/swiper3.jpeg",
      ],
      data: [],
      topRefresh: false,
      bottomRefresh: false,
      userCampus: null,
      userInfo: null,
    };
  },
  onLoad() {},
  onShow() {
    this.userInfo = uni.getStorageSync("userInfo");
    console.log("989811show", this.userInfo);
  },
  watch: {
    "userInfo.campus"() {
      console.log("9898campus变了", this.userInfo.type);
      this.changeCampus();
      this.getData();
    },
  },
  methods: {
    async getData() {
      if (this.userInfo.type === "1") {
        console.log("9898现在是客户模式了");
        let resData = await uniRequest("order/search", "post", {
          dbTable: this.userInfo.campus,
        });
        this.data = resData.data;
      } else {
        console.log("9898游客模式下只显示十条数据");
      }
    },
    changeCampus() {
      if (this.userInfo.type === "1") {
        for (const item of this.campuses) {
          if (this.userInfo.campus === item.code) {
            this.userCampus = item.name;
            break;
          }
        }
      } else {
        this.userCampus = "游客模式";
      }
    },
    swiperChange(e) {
      this.cardCur = e.target.current;
    },
    async scrollTop(e) {
      if (this.topRefresh === false) {
        this.topRefresh = true;
        await this.getData()
      } else {
        return;
      }
    },
    changeDropdownShow() {},
  },
};
</script>

<style lang="scss">
.myScrollView {
  height: 100vh;
}
.card-swiper {
  height: 420rpx !important;
}

.card-swiper swiper-item {
  width: 610rpx !important;
  box-sizing: border-box;
  padding: 40rpx 0rpx 70rpx;
  overflow: initial;
}

.card-swiper swiper-item .swiper-item {
  width: 100%;
  display: block;
  height: 100%;
  border-radius: 10rpx;
  transform: scale(0.9);
  transition: all 0.2s ease-in 0s;
}

.card-swiper swiper-item.cur .swiper-item {
  transform: none;
  transition: all 0.2s ease-in 0s;
}
.swiperVip {
  height: 100%;
  opacity: 1;
}
.shadow-blur {
  position: relative;
}
.shadow-blur::before {
  content: "";
  display: block;
  background: inherit;
  filter: blur(10rpx);
  position: absolute;
  width: 100%;
  height: 100%;
  top: 10rpx;
  left: 10rpx;
  z-index: -1;
  opacity: 0.4;
  transform-origin: 0 0;
  border-radius: inherit;
  transform: scale(1, 1);
}
.search {
  position: -webkit-sticky;
  position: sticky;
  top: 0;
  background-color: #ffffff;
  /* height: 80rpx; */
  display: flex;
  align-items: center;
  padding: 20rpx;
  font-weight: bold;
  z-index: 2;
}
.searchText {
  width: 150rpx;
}
.searchInput {
  display: flex;
  align-items: center;
  margin-left: 10rpx;
  padding-left: 40rpx;
  height: 80rpx;
  /* border: 1px #dbd8d8 solid; */
  border-radius: 40rpx;
  width: 100%;
  background-color: #f8f8f8;
  /* box-shadow: 5rpx 5rpx 20rpx 5rpx #cfcdcd; */
}
.list {
  padding: 10rpx;
}
.listItem {
  /* background-color: rgb(227, 162, 230); */
  padding: 20rpx;
  border-bottom: 1px dashed #e2dfdf;
}
.campusContent {
  padding: 10rpx;
  background-color: #d0ecf3;
  border-radius: 10rpx;
  width: 300rpx;
  height: 500rpx;
}
.itemTop {
  display: flex;
  align-items: center;
  justify-content: space-between;
  // height: 200rpx;
}
.topLeft {
  display: flex;
  align-items: center;
  .avatar{
    position: relative;
  }
  .avatarImg {
    width: 120rpx;
    height: 120rpx;
    border-radius: 60rpx;
  }
  .genderImg {
    position: absolute;
    top: 0;
    right: -15rpx;
    width: 46rpx;
    height: 46rpx;
    border-radius: 23rpx;
    background-color: #ffffff;
  }
}
.nickName {
  font-weight: bold;
  margin-left: 20rpx;
}
.topRight {
  display: flex;
  align-items: center;
}
.followin {
  width: 100rpx;
  height: 46rpx;
  line-height: 46rpx;
  margin-right: 30rpx;
  text-align: center;
  border: 1px solid #dbdada;
  color: #a3a2a2;
  border-radius: 24rpx;
  font-size: 25rpx;
  font-weight: bold;
}
.more {
  display: flex;
  view {
    width: 8rpx;
    height: 8rpx;
    border-radius: 4rpx;
    background-color: #757474;
    margin-left: 8rpx;
  }
}
.itemMiddle {
  margin: 30rpx 0;
  view image {
    width: 45rpx;
    height: 45rpx;
    margin: 0 20rpx;
  }
}
.middleMainInfo {
  margin: 20rpx 0;
}
.mainInfo {
  display: flex;
  align-content: center;
  margin: 30rpx 0;
}
.desimg {
  width: 100%;
  border-radius: 30rpx;
}
</style>
