<template>
  <view>
    <fui-loading v-if="loading" text="加载中. . ." :srcCol="commonBase64.loading"></fui-loading>
    <tui-toast ref="toast" position="center"></tui-toast>
    <tui-modal :show="isModalShow" custom padding="20rpx 20rpx 20rpx 20rpx">
      <fui-radiogroup v-model="campus">
        <scroll-view scroll-y class="modalcontent">
          <fui-label v-for="item in campuses" :key="item.code">
            <fui-listcell :highlight="false">
              <text>{{ item.name }}</text>
              <fui-radio :value="item.code" isCheckMark checkMarkColor="#000" scaleRatio="1.8">
              </fui-radio>
            </fui-listcell>
          </fui-label>
        </scroll-view>
      </fui-radiogroup>
      <tui-grid :unlined="true">
        <tui-grid-item class="grid grid_nomore" :hover="false" :bottomLine="false" :border="false" @click="confirm('nomore')">
          没有？
        </tui-grid-item>
        <tui-grid-item class="grid grid_no" :hover="false" :bottomLine="false" :border="false" @click="confirm('no')">
          游客
        </tui-grid-item>
        <tui-grid-item class="grid grid_go" :hover="false" :bottomLine="false" :border="false" @click="confirm('go',campus)">
          GO!
        </tui-grid-item>
      </tui-grid>
    </tui-modal>
  </view>
</template>

<script>
import { getOpenid, getUserInfo } from "@/utils/login.js";
import { uniRequest, jumpTo } from "@/utils/tool.js";
import { commonBase64, addCampusBase64 } from "@/base64/index.js";
export default {
  data() {
    return {
      commonBase64,
      addCampusBase64,
      loading: false,
      isModalShow: false,
      campus: null,
      openid: null,
    };
  },
  onLoad() {
    
  },
  async onShow() {
    this.loading = true;
    //获取是否新用户
    let openid = await getOpenid();
    this.openid = openid;
    let userData = await uniRequest("userInfo/search", "post", { openid });
    if (userData.data) {
      //如果是老用户 返回用户信息，并存到本地
      uni.setStorageSync("userInfo", userData.data);
      this.loading = false;
      uni.switchTab({
        url: "/pages/list/index",
      });
    } else {
      this.loading = false;
      this.isModalShow = true;
      // let info = {
      //   openid,
      //   campus: "qinghua",
      // };
      //   await uniRequest("userInfo_add", "post", info);
    }
  },
  methods: {
    async confirm(type, value) {
      if (type === "nomore") {
        console.log("9898此时需要跳转到新增学校页面");
        jumpTo("/pages/index/addCampus", { openid: this.openid });
      }
      if (type === "no") {
        console.log("9898此时需要跳转到list页面，只是不带用户信息");
        uni.switchTab({
          url: "/pages/list/index",
        });
      }
      if (type === "go") {
        if (value === null) {
          let options = {
            title: "请先选择runner社区~",
            imgUrl: addCampusBase64.toastImg,
            icon: true,
          };
          this.$refs.toast.show(options);
          console.log("9898此时告诉用户需要先选择学校");
        } else {
          let info = {
            openid: this.openid,
            campus: value,
          };
          uni.setStorageSync("userInfo", info);
          await uniRequest("userInfo/add", "post", info);
          uni.switchTab({
            url: "/pages/list/index",
          });
        }
      }
    },
  },
};
</script>

<style scoped>
.modalcontent {
  max-height: 500rpx;
}
.grid {
  text-align: center;
}
.grid_nomore {
  color: #552bc7;
}
.grid_no {
  color: #474749;
}
.grid_go {
  color: #000000;
}
</style>
