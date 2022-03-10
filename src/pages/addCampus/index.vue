<template>
  <NavBar mark="back" />
  <navigationBar :opacity="opacity" titleText="社区添加" />
  <fui-backdrop :show="alertModalStatus" :zIndex="1" />
  <fui-animation :duration="500" :animationType="animations" :show="alertModalStatus">
    <view class="alertBox">
      <image class="alertImg" src="https://s1.ax1x.com/2022/03/10/bfYTZ6.png" mode="aspectFit" />
      <view class="alertClose">
        <tui-icon @click="closeAlert" name="close" color="#ffffff"></tui-icon>
      </view>
    </view>
  </fui-animation>
  <scroll-view class="myScroll" scroll-y @scroll="onScroll">
    <view :style="{height: navigationBarHeight}"></view>
    <view v-show="isContentShow">
      <view class="card">
        <tui-card :image="card.self.img" :title="card.self.title">
          <template slot="body">
            <view class="tui-default">
              <form ref="form"></form>
            </view>
          </template>
        </tui-card>
      </view>
      <view class="card">
        <tui-card :image="card.campus.img" :title="card.campus.title">
          <template slot="body">
            <view class="tui-default">
              卡片内容部分
            </view>
          </template>
        </tui-card>
      </view>
      <view class="card">
        <tui-card :image="card.joinus.img" :title="card.joinus.title">
          <template slot="body">
            <view class="tui-default">
              卡片内容部分
            </view>
          </template>
        </tui-card>
      </view>
    </view>
  </scroll-view>
</template>

<script>
import navigationBar from "@/components/navigationBar.vue";
import NavBar from "@/components/navBar.vue";
export default {
  components: { navigationBar, NavBar },
  onInit() {
    console.log("111");
  },
  onLoad() {
    console.log("222");
  },
  onShow() {
    console.log("333");
    setTimeout(() => {
      this.alertModalStatus = true;
    }, 1000);
  },
  onReady() {
    console.log("555");
  },
  data() {
    return {
      alertModalStatus: false,
      isContentShow: false,
      animations: ["zoom-in"],
      card: {
        self: {
          img: {
            url: "/static/selfInfo.png",
            circle: true,
          },
          title: {
            text: "个人信息",
            color: "#000000",
            size: 34,
          },
        },
        campus: {
          img: {
            url: "/static/campus1.png",
            circle: true,
          },
          title: {
            text: "学校&社区信息",
            color: "#000000",
            size: 34,
          },
        },
        joinus: {
          img: {
            url: "/static/runnerLogo.png",
            circle: true,
          },
          title: {
            text: "加入我们",
            color: "#000000",
            size: 34,
          },
        },
      },
      opacity: 0,
    };
  },
  computed: {
    navigationBarHeight() {
      let statusBarHeight = 50;
      uni.getSystemInfo({
        success: (result) => {
          statusBarHeight = result.statusBarHeight;
        },
        fail: (error) => {
          console.log(error);
        },
      });
      return 44 + statusBarHeight + "px";
    },
  },
  methods: {
    backpage() {
      uni.navigateBack({
        delta: 1,
      });
    },
    onScroll(e) {
      let top = e.detail.scrollTop;
      let opacity = top / 200;
      this.opacity = opacity;
    },
    closeAlert() {
      this.isContentShow = true
      this.alertModalStatus = false;
    },
  },
};
</script>

<style lang="scss">
.myScroll {
  height: 100vh;
  background-image: url("@/static/addCampus.png");
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
}
.alertBox {
  display: flex;
  flex-direction: column;
}
.alertImg {
  width: 700rpx;
  height: 65vh;
}
.alertClose {
  text-align: center;
  margin-top: 20rpx;
}
.card {
  margin-bottom: 20rpx;
}
</style>


