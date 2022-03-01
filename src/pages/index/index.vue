<template>
  <view>
    <fui-loading v-if="loading" text="加载中. . ." :srcCol="loadingImg"></fui-loading>
    <tui-toast ref="toast" position="center"></tui-toast>
    <tui-modal :show="isModalShow" custom padding="20rpx 20rpx 20rpx 20rpx">
      <fui-radiogroup v-model="campus">
        <scroll-view scroll-y class="modalcontent">
          <fui-label v-for="item in campuss" :key="item.value">
            <fui-listcell :highlight="false">
              <text>{{ item.name }}</text>
              <fui-radio :value="item.value" isCheckMark checkMarkColor="#000" scaleRatio="1.8">
              </fui-radio>
            </fui-listcell>
          </fui-label>
        </scroll-view>
      </fui-radiogroup>
      <tui-grid :unlined="true">
        <tui-grid-item class="grid grid_nomore" :hover="false" :bottomLine="false" :border="false"
          @click="confirm('nomore')">没有？</tui-grid-item>
        <tui-grid-item class="grid grid_no" :hover="false" :bottomLine="false" :border="false" @click="confirm('no')">
          NO~</tui-grid-item>
        <tui-grid-item class="grid grid_go" :hover="false" :bottomLine="false" :border="false"
          @click="confirm('go',campus)">GO!</tui-grid-item>
      </tui-grid>
    </tui-modal>
  </view>
</template>

<script>
import { getOpenid, getUserInfo } from "@/utils/login.js";
import { uniRequest } from "@/utils/tool.js";
export default {
  data() {
    return {
      loading: false,
      loadingImg:
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAADICAMAAACahl6sAAAArlBMVEUAAAD///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////8tivQqAAAAOXRSTlMAzNK/P42AYRZ6ZhlKmgWJcVjw2bOqaTreUQ9N9+vmtqA1dUUfxioJvMITk1wN9K6lbfriLSWFMn5O6843AAAJgElEQVR42uzah3LaQBAG4F8Vid47AplmuglgZ9//xTJOMhk75qpOCpnR9wA2y5XdvQW5XC6Xy+VyuVwul3tgh9KqV250w7DbKPeuiyH+O4d473esI/2t1a4V3QD/haD86kTE1Vx65QMe2VuxYpMkx58/aDC9WovUNKfFh9tmt/qGdDRnAzyQfecbaWvVengMRYsSmj7CsjDCUPTcgJIHDePdpoB/p3EvjHFkO/ZlTMqsfxVK3KGPIqdSL78tDvhlXbq6RW/aJwVtF9kbvn6jP5wwHuK+6rXQiUiWV0LGCjb9Zu8aBwj0wmmTpPS7yNLtpJwEgvNS8gLrITP7C72LKiOoKL9I5c3xGdlYe/TOLg6hauVHJGEWIAPu8ueeqlehoyQVil1G6urv2+MSDsFgKJQQKdsZuCRL30msg1S1iWgzR1LzJQk9Iz1rm2gcwoBqjYQspGXRJDrFMGNkkUgL6YiJqAZjhhUSiZCGFdG4CJPOYxIYw7wFke3CLNcigSNMC450KsG07YwE+jBraFMFaRCmlCVMqrbpFel4IoETDOqQj7R0M8zxHvlIzzmzSArkIU1hRhVkPNkgXRUSKMOAqmMjbUviswMkt4tKSF1L1DMiseJ4jvStJsR3RkLX5h5ZKAveJcY9JNPxkI16un1Wd7NGRtrE1022dXvISjwmrn4J+k5nZCckPg/aujNk6Zn4XP0efYUsucTXhqaKD21uo+69OK1ms+W8ePWGCxk14ivoNrdb6Ilrl69z6EYJIls7lQeija8XhW/TfdPwDXz7NJZkS9CwXxLPbiXq4Lg20GB5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",
      toastImg:
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAADICAMAAACahl6sAAAArlBMVEUAAAD///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////8tivQqAAAAOXRSTlMAgL9W9iGpZ18Soxjq0nJA+suwDPHind3Ygx0JBcOITeUvrJiNOjNtWnpEJce2lZB3SCq6UTdjJ88zfKXgAAAJL0lEQVR42uzbaZOaQBAG4JdLxPu+8D7XM67rmrz//4+lBERAzTomFYZUnk9btfqhC2Z6errFf//9G96nqmoi+RSeKUg6jQ4VSafSkUbCVenIIOnmPJvClx2tkURpkj80P4pCnmSuMoDcOsUOIpakYsPVLdRJSr6J2e+7vE5Sz08GFq7M5hGeYplXkj6TWSPHq1Lg1dFG8LzV6JB49Q/GjPJDsf04GPIN8mnznjZCzKF61qrRNYJ0KryvgqABPLbxeTSVOaSTYZD0y+Ahk48l6cir8Vc0JMaGv5K3kRAaf62AhNjy1+pZhH1fdyGhT35lgYD1okfWF5CPwq9s4VtN5N0CNvySDZdVpg+ysfm1FRzzRbF43LV4loJsRnQIpJJOWlEGWcjmSE/Ss/ueX1siAU58oFVpTHfN5KTEIu9SPuH4LCXlPqvDO9QiLhR5a/OIGm/04TkoG0krwTtSjFLgWnn/qiMRTEak4FhP6GkgEQyGleFY5HjxhmSYMMS8vnAJaybM7zyQOq/ekRSTmwcyJJmwFXJmf/DKiNxyfSSmZAeQpS8XLbWyANDVpqlNncPNeGdakNgnL9RIHJ+AlR6XGJB6kziWQ52uWnrLq/oB0JqMGirylSMX1pi3xha6U94zlLfJA01lWD4NzHp8YCvhFfbFKbRbKVWgoPOhWux1o9LBHdm5AVhavzFWx42+lgVglnmXHD3EdZP9mzmTspMB9UYRPutxGFIcwtpkxUBA96TyqvSR6Re04tt+W6JL0pv6Kanh8IYLa9nib8gZiMeMRLVBFuE6iYchRTu02qPSKfvn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",
      isModalShow: false,
      campus: null,
      campuss: [
        { value: "qinghua", name: "清华大学" },
        { value: "beida", name: "北京大学" },
        { value: "nanda", name: "南京大学" },
        { value: "fudan", name: "复旦大学" },
        { value: "taili", name: "太原理工大学" },
        { value: "shanda", name: "山西大学" },
        { value: "keda", name: "太原科技大学" },
        { value: "xijiaoda", name: "西安交通大学" },
      ],
      openid: null,
    };
  },
  onLoad() {
    console.log("9898谁先55");
  },
  async onShow() {
    this.loading = true;
    //获取是否新用户
    let openid = await getOpenid();
    this.openid = openid;
    let userData = await uniRequest("userInfo_search", "post", { openid });
    console.log("9898查询用户", userData);
    if (userData.userInfo) {
      //如果是老用户 返回用户信息，并存到本地
      console.log("9898111");
      uni.setStorageSync("userInfo", userData.userInfo);
      this.loading = false;
      uni.switchTab({
        url: "/pages/list/index",
      });
    } else {
      this.loading = false;
      this.isModalShow = true;
      console.log("9898222");
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
      }
      if (type === "no") {
        console.log("9898此时需要跳转到list页面，只是不带用户信息");
      }
      if (type === "go") {
        if (value === null) {
          let options = {
            title: "请先选择runner社区~",
            imgUrl: this.toastImg,
            icon: true,
          };
          this.$refs.toast.show(options);
          console.log("9898此时告诉用户需要先选择学校");
        } else {
          console.log("9898选了");
          let info = {
            openid: this.openid,
            campus: value,
          };
          uni.setStorageSync("userInfo", info);
          await uniRequest("userInfo_add", "post", info);
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
