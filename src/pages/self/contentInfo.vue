<template>
    <view class="container">
        <view class="tabs">
            <view class="tabitem" @click="changeTab(0)">
                <view :class="currentTab===0?'currenttext':'bartext'">关注</view>
                <view class="bar" v-if="currentTab===0"></view>
            </view>
            <view class="tabitem" @click="changeTab(1)">
                <view :class="currentTab===1?'currenttext':'bartext'">赞赏</view>
                <view class="bar" v-if="currentTab===1"></view>
            </view>
            <view class="tabitem" @click="changeTab(2)">
                <view :class="currentTab===2?'currenttext':'bartext'">模版</view>
                <view class="bar" v-if="currentTab===2"></view>
            </view>
            <view class="tabitem" @click="changeTab(3)">
                <view :class="currentTab===3?'currenttext':'bartext'">地址</view>
                <view class="bar" v-if="currentTab===3"></view>
            </view>
        </view>
        <view>
            
        </view>
    </view>
</template>

<script>
export default {
    data() {
        return {
            currentTab: 0,
        }
    },
    onLoad() {

    },
    methods: {
        changeTab(value) {
            this.currentTab = value
        }
    }
}
</script>

<style lang="scss">
.container {
    width: 100%;
    height: 100%;
}
.tabs {
    display: flex;
    justify-content: center;
    .tabitem {
        margin: 20rpx 40rpx;
        display: flex;
        flex-direction: column;
        align-items: center;
        .bar {
            width: 30rpx;
            height: 6rpx;
            border-radius: 5rpx;
            margin-top: 5rpx;
            background-color: #000000;
        }
    }
}
.currenttext {
    color: #000000;
    font-weight: 600;
}
.bartext {
    color: #a3a2a2;
}
</style>
