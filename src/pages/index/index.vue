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
        <tui-grid-item class="grid grid_no" :hover="false" :bottomLine="false" :border="false" @click="confirm('tourist')">
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
import { getOpenid, getUserProfile } from "@/utils/login.js";
import { uniRequest, jumpTo, uploadFile, downloadFile } from "@/utils/tool.js";
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
  onLoad() {},
  async onShow() {
    this.loading = true;
    //获取是否新用户
    let openid = await getOpenid();
    this.openid = openid;
    let userData = await uniRequest("userInfo/search", "post", { openid });
    if (userData.data) {
      //如果是老用户 返回用户信息，并存到本地
      uni.setStorageSync("isFirst", false);
      uni.setStorageSync("userInfo", userData.data);
      this.loading = false;
      uni.switchTab({
        url: "/pages/list/index",
      });
    } else {
      this.loading = false;
      this.isModalShow = true;
    }
  },
  methods: {
    async saveUserInfo(type, value) {
      let proInfo = await getUserProfile();
      let cloudPhotoPath = null;
      let localFilePath = null;
      if (proInfo) {
        localFilePath = await downloadFile({
          url: proInfo.userInfo.avatarUrl,
        });
        cloudPhotoPath = await uploadFile({
          filePath: localFilePath,
          folder: "userAvatar/",
        });
        let info = {
          avatarUrl: cloudPhotoPath,
          gender: "1",
          nickName: proInfo.userInfo.nickName,
          openid: this.openid,
          campus: type == "tourist" ? "" : value,
          type: type == "tourist" ? "2" : "1",
        };
        uni.setStorageSync("userInfo", info);
        uni.setStorageSync("isFirst", true);
        await uniRequest("userInfo/add", "post", info);
        uni.switchTab({
          url: "/pages/self/index",
        });
      } else {
        return;
      }
    },
    async confirm(type, value) {
      if (type === "nomore") {
        jumpTo("/pages/index/addCampus", { openid: this.openid });
      }
      if (type === "tourist") {
        await this.saveUserInfo(type, value);
      }
      if (type === "go") {
        if (value === null) {
          let options = {
            title: "请先选择runner社区~",
            imgUrl: addCampusBase64.toastImg,
            icon: true,
          };
          this.$refs.toast.show(options);
        } else {
          await this.saveUserInfo(type, value);
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
