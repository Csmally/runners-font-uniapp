<script>
import { setUpMenuInfo } from "@/utils/tool.js";
import io from "@hyoga/uni-socket.io";
import { getOpenid } from "@/utils/login.js";
export default {
  onLaunch: async function () {
    const host = import.meta.env.VITE_SOCKET
    let openid = await getOpenid();
    const socket = io(host, {
      query: {},
      transports: ["websocket", "polling"],
      timeout: 5000,
    });
    //连接成功
    socket.on("connect", () => {
      // ws连接已建立，此时可以进行socket.io的事件监听或者数据发送操作
      // 连接建立后，本插件的功能已完成，接下来的操作参考socket.io官方客户端文档即可
      // socket.io 唯一连接id，可以监控这个id实现点对点通讯
      const { id } = socket;
      console.log("connect", socket);
      socket.emit("userData", { openid, socketid: socket.id, type: "1" });
      getApp().globalData.socketObj = socket;
    });
    // socket.on("message", (data) => {
    //   console.log("message", data);
    // });
    socket.on("connect_error", () => {
      console.log("connect_error", socket);
    });
    //连接断开了
    socket.on("disconnect", () => {
      console.log("disconnect", socket);
    });
    //重连中
    socket.io.on("reconnect_attempt", () => {
      console.log("reconnect_attempt", socket);
    });
    //重连成功
    socket.io.on("reconnect", () => {
      console.log("reconnect", socket);
    });

    socket.io.on("reconnect_failed", () => {
      console.log("reconnect_failed", socket);
    });
    socket.io.on("reconnect_error", () => {
      console.log("reconnect_error", socket);
    });
    socket.on("error", () => {
      console.log("ws error", socket);
    });
  },
  onShow: function () {
    setUpMenuInfo();
  },
};
</script>

<style>
/*每个页面公共css */
@import "./fui.scss";
page {
}
.hiddenText {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>
