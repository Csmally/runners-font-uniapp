import wxKeys from '/pswConfig/wxKeysConfig.js'

const host =
    import.meta.env.VITE_HOST + '/wx/getUeserInfoFromWx'
export function getOpenid() {
    return new Promise((resolve, reject) => {
        uni.login({
            onlyAuthorize: true,
            success: (res) => {
                let data = {
                    appid: wxKeys.appid,
                    secret: wxKeys.appsecret,
                    js_code: res.code
                }
                uni.request({
                    url: host,
                    data: data,
                    method: 'POST',
                    success: (res1) => {
                        resolve(res1.data.data.openid)
                    },
                    fail: (error) => {
                        reject(error)
                    }
                })
            }
        })

    })
}

export function getUserInfo() {
    return new Promise((resolve, reject) => {
        uni.getUserInfo({
            lang: 'zh_CN',
            success: (res) => {
                resolve(res)
            },
            fail: (error) => {
                reject(error)
            }
        })
    })
}

export function test() {
    uni.getUserProfile({
        desc: '获取信息11',
        lang: 'zh-CN',
        success: (res) => {
            console.log('9898res888', res)
                // uni.login({
                //     onlyAuthorize: true,
                //     success: (res1)=>{
                //         // encryptedData
                //         console.log('9898res11',res1)
                //     }
                // })
        }
    })
}