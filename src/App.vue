<script>
import { setUpMenuInfo } from "@/utils/tool.js";
export default {
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
