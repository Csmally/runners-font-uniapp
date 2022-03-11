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
      <!-- 个人信息 -->
      <view class="card">
        <tui-card :image="card.self.img" :title="card.self.title">
          <template slot="body">
            <view class="tui-default">
              <fui-input label="姓名" required textRight placeholder="请输入姓名" />
              <picker mode="selector" :value="sexIndex" :range="sexs" @change="sexChange">
                <fui-input :value="form.sex" label="性别" required textRight disabled placeholder="请选择性别" :endTagUrl="endTagUrl" :endTagStyle="endTagStyle"/>
              </picker>
              
              <fui-input label="年龄" required textRight placeholder="请输入年龄" />
              <fui-input label="年级" textRight placeholder="请输入年龄" />
              <fui-input label="微信账号" textRight placeholder="请输入年龄" />
              <fui-input label="QQ账号" textRight placeholder="请输入年龄" />
              <fui-input label="邮箱" textRight placeholder="请输入年龄" />



            </view>
          </template>
        </tui-card>
      </view>
      <!-- 社区信息 -->
      <view class="card">
        <tui-card :image="card.campus.img" :title="card.campus.title">
          <template slot="body">
            <view class="tui-default">
              卡片内容部分
            </view>
          </template>
        </tui-card>
      </view>
      <!-- 加入我们 -->
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
      endTagUrl: null,
      endTagStyle: null,
      form: {
        sex: null
      },
      sexs: ["男", "女", "未知"],
      sexIndex: 0,
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
            url: "/static/campus.png",
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
      this.isContentShow = true;
      this.alertModalStatus = false;
    },
    sexChange(e) {
      console.log('9898val',e.detail.value)
      if(e.detail.value==='0'){
        this.endTagStyle = "width:73rpx;height:43rpx"
        this.endTagUrl = "data:image/png;base64,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"
      }
      if(e.detail.value==='1'){
        this.endTagStyle = "width:73rpx;height:43rpx"
        this.endTagUrl = "data:image/png;base64,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"
      }
      if(e.detail.value==='2'){
        this.endTagStyle = "width:43rpx;height:43rpx"
        this.endTagUrl = "data:image/png;base64,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"
      }
      this.form.sex = this.sexs[e.detail.value]
    }
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


