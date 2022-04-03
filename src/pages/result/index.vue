<template>
  <NavBar :mark="mark" :orderInfo="orderInfo"/>
  <ResultPage :title="title" :titleColor="titleColor" :canvasColor="canvasColor" :timer="timer" :orderInfo="orderInfo"/>
</template>

<script>
import ResultPage from "@/components/resultPage.vue";
import NavBar from "@/components/navBar.vue";
export default {
  components: { ResultPage, NavBar },
  props: {
    mark: {
      type: String,
      default: "all",
    },
    timer: {
      type: Boolean,
      default: false,
    },
  },
  onLoad(option) {
    this.title = option.title;
    this.titleColor = option.titleColor;
    this.canvasColor = option.canvasColor;
    this.orderInfo = option.orderInfo?JSON.parse(option.orderInfo):null
  },
  onShow() {
    console.log('9898传过来了没11',this.orderInfo)
  },
  data() {
    return {
      title: null,
      titleColor: null,
      canvasColor: null,
      orderInfo: null
    };
  },
  methods: {},
};
</script>

<style>
</style>
