<template>
  <view>
    <button @click="search">查询</button>
    <!-- <tui-upload :value="imgList" :serverUrl="serverUrl" @complete="complete">上传图片</tui-upload> -->
    <!-- :auto-upload="false" -->
    <uni-file-picker v-model="imageValue" fileMediatype="image" mode="grid" @select="select" @progress="progress" @success="success" @fail="fail">上传图片</uni-file-picker>
    {{imageValue}}
    <button @click="searchFile">拍照</button>
    <image :src="imgUrl"/>
  </view>
</template>

<script>
import { uniRequest } from "@/utils/tool.js";
export default {
  data() {
    return {
      imageValue: [],
      serverUrl: "http://192.168.1.7:8087/wx/txCos/upload",
      test: "aa",
      imgUrl: "https://static.runners.ink/0G0KuoMUyzRq2d5b8812f5e09750b808c43629487b0a.jpeg"
    };
  },
  onLoad() {},
  methods: {
    async search() {
      console.log('9898图片地址',this.imgUrl)
      return
      let data = await uniRequest("txCos/search", "post", {path:"./descImg/"});
      console.log("9898存储桶", data);
    },
    complete(a, b, c) {
      console.log("9898aaa", a),
        console.log("9898bbb", b),
        console.log("9898ccc", c);
    },
    select(e) {
      console.log("选择文件：", e);
    },
    // 获取上传进度
    progress(e) {
      console.log("上传进度：", e);
    },

    // 上传成功
    success(e) {
      console.log("上传成功");
    },

    // 上传失败
    fail(e) {
      console.log("上传失败：", e);
    },
    // 拍照
    searchFile() {
      uni.chooseMedia({
        count: 9,
        mediaType: ["image", "video"],
        sourceType: ["album", "camera"],
        maxDuration: 30,
        camera: "back",
        success: async (res) => {
          let _this = this
          console.log("9898resres", res.tempFiles[0].tempFilePath);
          wx.uploadFile({
            url: "http://192.168.1.7:8087/wx/txCos/upload", //仅为示例，非真实的接口地址
            filePath: res.tempFiles[0].tempFilePath,
            name: "file",
            success(res) {
              console.log("9898resdatares", JSON.parse(res.data));
              let imgUrl = JSON.parse(res.data).data.Location
              console.log('9898this',imgUrl)
              _this.imgUrl = "https://" + imgUrl
            },
          });
          // let data = await uniRequest("txCos/upload", "post", {
          //   filePath: res.tempFiles[0].tempFilePath,
          // });
          // console.log("9898resdata", data);
        },
      });
    },
  },
};
</script>

<style>
</style>
