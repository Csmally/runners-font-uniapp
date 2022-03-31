const host = import.meta.env.VITE_HOST
export function uniRequest(url, method, data) {
    return new Promise((resolve, reject) => {
        uni.request({
            url: host + '/wx/' + url,
            method: method ? method : 'get',
            data: data ? data : {},
            success: (res) => {
                resolve(res.data)
            },
            fail: (error) => {
                reject(error)
            }
        })
    })
}

export function uploadFile(data) {
    return new Promise((resolve, reject) => {
        uni.uploadFile({
            url: host + '/wx/txCos/upload', //仅为示例，非真实的接口地址
            filePath: data.filePath,
            name: "file",
            formData: {
                folder: data.folder ? data.folder : ""
            },
            success(res) {
                console.log('9898upres', res)
                resolve(JSON.parse(res.data).data.Location.replace(
                    "runners-1307290574.cos.ap-beijing.myqcloud.com",
                    "https://static.runners.ink"
                ))
            },
            fail(err) {
                resolve("https://static.runners.ink/project/runnerLogo.png")
            }
        });
    })
}

export function downloadFile(data) {
    return new Promise((resolve, reject) => {
        uni.downloadFile({
            url: data.url,
            success(res) {
                resolve(res.tempFilePath)
            },
            fail(err) {
                reject(err)
            }
        })
    })
}

export function wxPay(data) {
    return new Promise((resolve, reject) => {

        uni.request({
            url: host + '/wx/wxpay',
            method: 'POST',
            data: data,
            success: (res) => {
                uni.requestPayment({
                    provider: "wxpay",
                    timeStamp: res.data.data.timeStamp,
                    package: "prepay_id=" + res.data.data.prepayId,
                    nonceStr: res.data.data.nonceStr,
                    signType: "MD5",
                    paySign: res.data.data.paySign,
                    success: (res1) => {
                        console.log("支付成功", res1)
                        resolve(res1)
                    },
                    fail: (res2) => {
                        console.log("支付失败", res2)
                        reject(res2)
                    }
                })
            },
            fail: (error) => {
                reject(error)
            }
        })
    })
}

export function jumpTo(url, param) {
    if (param) {
        let arr = []
        for (const key in param) {
            arr.push(key + "=" + param[key])
        }
        let newUrl = url + "?" + arr.join("&")
        uni.navigateTo({
            url: newUrl,
        });
    } else {
        uni.navigateTo({
            url
        });
    }
}

export function getFileName(suffix) {
    if (suffix) {
        return (Math.random() * 10000000).toString(16).substr(0, 4) + '-' + (new Date()).getTime() + '-' + (Math.random() * 1000000000).substr(0, 8) + '.' + suffix
    } else {
        return (Math.random() * 10000000).toString(16).substr(0, 4) + '-' + (new Date()).getTime() + '-' + (Math.random() * 1000000000).toString().substr(0, 8) + '.png'
    }
}

export function setUpMenuInfo() {
    uni.getSystemInfo({
        success: (result) => {
            // 获取手机系统的状态栏高度（不同手机的状态栏高度不同）  （ 不要使用uni-app官方文档的var(--status-bar-height) 官方这个是固定的20px  不对的 ）
            // console.log('当前手机的状态栏高度',result.statusBarHeight)
            let statusBarHeight = result.statusBarHeight + 'px'

            // 获取右侧胶囊的信息 单位px
            const menuButtonInfo = uni.getMenuButtonBoundingClientRect()
            //bottom: 胶囊底部距离屏幕顶部的距离
            //height: 胶囊高度
            //left:   胶囊左侧距离屏幕左侧的距离
            //right:  胶囊右侧距离屏幕左侧的距离
            //top:    胶囊顶部距离屏幕顶部的距离
            //width:  胶囊宽度
            // console.log(menuButtonInfo.width, menuButtonInfo.height, menuButtonInfo.top)
            // console.log('计算胶囊右侧距离屏幕右边距离', result.screenWidth - menuButtonInfo.right)
            let menuWidth = menuButtonInfo.width + 'px'
            let menuHeight = menuButtonInfo.height + 'px'
            let menuBorderRadius = menuButtonInfo.height / 2 + 'px'
            let menuRight = result.screenWidth - menuButtonInfo.right + 'px'
            let menuTop = menuButtonInfo.top + 'px'
            let contentTop = result.statusBarHeight + 44 + 'px'
            let allHeight = menuButtonInfo.height + menuButtonInfo.top + 6 + 'px'

            let menuInfo = {
                statusBarHeight: statusBarHeight, //状态栏高度----用来给自定义导航条页面的顶部导航条设计padding-top使用：目的留出系统的状态栏区域
                menuWidth: menuWidth, //右侧的胶囊宽度--用来给自定义导航条页面的左侧胶囊设置使用
                menuHeight: menuHeight, //右侧的胶囊高度--用来给自定义导航条页面的左侧胶囊设置使用
                menuBorderRadius: menuBorderRadius, //一半的圆角--用来给自定义导航条页面的左侧胶囊设置使用
                menuRight: menuRight, //右侧的胶囊距离右侧屏幕距离--用来给自定义导航条页面的左侧胶囊设置使用
                menuTop: menuTop, //右侧的胶囊顶部距离屏幕顶部的距离--用来给自定义导航条页面的左侧胶囊设置使用
                contentTop: contentTop, //内容区距离页面最上方的高度--用来给自定义导航条页面的内容区定位距离使用
                allHeight: allHeight
            }
            uni.setStorageSync('menuInfo', menuInfo)
        },
        fail: (error) => {
            console.log(error)
        }
    })
}

export function reSetArr(arr, newArr) {
    arr.length = 0
    arr.push(...newArr)
}