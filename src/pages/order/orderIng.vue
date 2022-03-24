<template>
    <view>
       <view v-for="item in list" :key="item" class="test">进行中进行中进行中进行中进行中进行中进行中进行中进行中进行中进行中</view>
    </view>
</template>

<script>
export default {
    data() {
        return {
            list:[1,2,3,4,5,6,7,8,9]
        }
    }
}
</script>

<style>
.test {
    height: 30vh;
    background-color: red;
}
</style>
