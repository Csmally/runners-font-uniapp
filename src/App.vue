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
@import './fui.scss';
page {
  background-color: #F8F8F8;
}
</style>
