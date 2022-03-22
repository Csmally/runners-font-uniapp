<template>
  <!-- <view>
    我是第一是页
    <view>
      环境：{{envStr}}
    </view>
  </view> -->
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
        <view class="listItem" v-for="(item,index) in list1" :key="index">
          <view class="itemTop">
            <view class="topLeft">
              <image :src="item.avatarUrl" mode="aspectFit" />
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
                <image src="@/static/location.png" mode="aspectFit" />
                <view>{{item.address}}</view>
              </view>
              <view class="mainInfo">
                <image src="@/static/wallet.png" mode="aspectFit" />
                <view>{{item.price}}</view>
              </view>
            </view>
            <image class="desimg" v-if="item.desimg" :src="item.desimg" mode="widthFix" />
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
export default {
  components: { RefreshLoading },
  data() {
    return {
      //   envStr
      // RefreshLoading: import.meta.env.MODE,
      cardCur: 0,
      list: [
        "/static/swiper1.jpeg",
        "/static/swiper2.jpeg",
        "/static/swiper3.jpeg",
      ],
      list1: [
        {
          avatarUrl: "/static/avatar1.jpg",
          nickName: "L.L.L",
          address: "三号楼603",
          price: "5.0元",
          desimg1: "https://runners-1307290574.cos.ap-beijing.myqcloud.com/okok.png?q-sign-algorithm=sha1&q-ak=AKIDowok8UxKJBob1bXBGkWEVazY6tNXZI6rcJVVrkJEBgIiTPFKJ2Kw3HHiU7uL_CSH&q-sign-time=1647739796;1647743396&q-key-time=1647739796;1647743396&q-header-list=host&q-url-param-list=&q-signature=23b9f0d84519334fd78683568aec9fb9030d5189&x-cos-security-token=frzhQtOlyBGWUDQBMBcaUZNo9MC4FTaad76378d42d7b440fd6024c4eeafd7eb9LZLETHfJrR_9pUtuyYL2_VnpvKHL-lJVRZlIw2L86nfON7OktDmAsNtqDfL_zHKyU2rZvlrLZV6sBB1GVfdlOexJNRdSt9Ic_TQ90sutA4mQnP0GrZUbClB7Ox4T1IFdxCv_DtdLpJnza3v0nEFzoJ2iRWXjO0EQ_mcwAMutZgKizeIYFQD_JwaTDcFlSmj0",
        },
        {
          avatarUrl: "/static/avatar2.jpg",
          nickName: "shmily",
          address: "一单元三号楼803",
          price: "2.0元",
        },
        {
          avatarUrl: "/static/avatar3.jpg",
          nickName: "🐻",
          address: "德馨楼-东-102",
          price: "3.5元",
          desimg1: "https://s1.ax1x.com/2022/03/20/qVcU1I.png",
        },
        {
          avatarUrl: "/static/avatar4.jpg",
          nickName: "Cross",
          address: "科技楼实验室",
          price: "6.0元",
          desimg1: "https://www.runners.ink/desimg/bfYTZ6.png",
        },
        {
          avatarUrl: "/static/avatar5.jpg",
          nickName: "姚迪",
          address: "9号楼阶梯教室3排5座",
          price: "0.5元",
          desimg1: "https://www.runners.ink/desimg/bfYTZ6.png",
        },
        {
          avatarUrl: "/static/avatar6.jpg",
          nickName: "篂篂点点",
          address: "理工楼502",
          price: "1.0元",
          desimg1: "https://www.runners.ink/desimg/bfYTZ6.png",
        },
        {
          avatarUrl: "/static/avatar7.jpg",
          nickName: "爱得、",
          address: "药品实验室3",
          price: "1.5元",
          desimg1: "https://www.runners.ink/desimg/okok.png",
        },
      ],
      topRefresh: false,
      bottomRefresh: false,
      dropdownShow: false,
      userCampus: null,
    };
  },
  onLoad() {
    // uni.showTabBarRedDot({
    //   index: 1,
    // });
  },
  onShow() {
    let userCampus = uni.getStorageSync("userInfo")?.campus;
    console.log("9898this", userCampus);
    if (userCampus) {
      for (const item of this.campuses) {
        console.log("9898item", item);
        if (userCampus === item.code) {
          this.userCampus = item.name;
          break;
        }
      }
    } else {
      this.userCampus = "游客模式";
    }
  },
  methods: {
    swiperChange(e) {
      this.cardCur = e.target.current;
    },
    scrollTop(e) {
      if (this.topRefresh === false) {
        this.topRefresh = true;
        console.log("9898顶部", e);
        setTimeout(() => {
          this.topRefresh = false;
        }, 2500);
      } else {
        return;
      }
    },
    changeDropdownShow() {
      this.dropdownShow = !this.dropdownShow;
    },
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
  image {
    width: 100rpx;
    height: 100rpx;
    border-radius: 50rpx;
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
