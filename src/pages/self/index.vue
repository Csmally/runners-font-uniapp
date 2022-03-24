<template>
  <view>
    <button @click="dianji">改变type</button>
    <button @click="dianji1">改变campus</button>
    <button @click="dianji2">获取app实例</button>
  </view>
</template>

<script>
export default {
  data() {
    return {
      
    }
  },
  onLoad() {},
  methods: {
    dianji() {
      let userInfo = uni.getStorageSync("userInfo")
      console.log('9898内存走了吗')
      uni.setStorageSync("userInfo",{...userInfo,type:"1"})
    },
    dianji1() {
      let userInfo = uni.getStorageSync("userInfo")
      console.log('9898内存走了吗')
      uni.setStorageSync("userInfo",{...userInfo,campus:"qinghua"})
    },
    dianji2() {
      this.campuses.push("我新添加的数据")
      console.log('9898实例',this.campuses)
    }
  },
}
</script>

<style>

</style>
