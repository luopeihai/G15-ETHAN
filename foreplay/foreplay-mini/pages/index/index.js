Page({
  onGetToken(){ //获取token
    //微信登录
    wx.login({
      success: (res) => {
        if (res.code) {
          wx.request({
            url: 'http://localhost:3000/v1/token',
            method: 'POST',
            data: {
              account: res.code,
              type: 100
            },
            success: (res) => {
              console.log(res.data)
              const code = res.statusCode.toString()
              if (code.startsWith('2')) {
                //写入缓存中
                wx.setStorageSync('token', res.data.token)
              }
            }
          })
        }
      }
    })
  }
})