<template>
  <ResultPage :title="title" :titleColor="titleColor" :canvasColor="canvasColor"/>
</template>

<script>
import ResultPage from '@/components/resultPage.vue';
export default {
  components: { ResultPage },
  onLoad(option) {
    this.title = option.title;
    this.titleColor = option.titleColor;
    this.canvasColor = option.canvasColor;
  },
  data() {
    return {
      title: null,
      titleColor: null,
      canvasColor: null
    };
  },
  methods: {},
};
</script>

<style>
</style>
