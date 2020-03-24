import {
  Base64
} from 'js-base64'

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
  },
  onVerifyToken() { //验证token
    wx.request({
      url: 'http://localhost:3000/v1/token/verify',
      method: 'POST',
      data: {
        token: wx.getStorageSync('token') //获取wx 缓存类的token
      },
      success: res => {
        console.log(res.data)
      }
    })
  },
   onGetLatest() { //获取最新期刊
    wx.request({
      url: 'http://localhost:3000/v1/classic/latest',
      method: 'GET',
      success: res => {
        console.log(res.data)
      },
      header: {
        Authorization: this._encode()
      }
    })
  },
  onLike() { //点赞
    wx.request({
      url: 'http://localhost:3000/v1/like',
      method: 'POST',
      data: {
        art_id: 1,
        type: 100
      },
      success: res => {
        console.log(res.data)
      },
      header: {
        Authorization: this._encode()
      }
    })
  },

  onDisLike() { //取消点赞
    wx.request({
      url: 'http://localhost:3000/v1/like/cancel',
      method: 'POST',
      data: {
        art_id: 1,
        type: 100
      },
      success: res => {
        console.log(res.data)
      },
      header: {
        Authorization: this._encode()
      }
    })
  },
  onGetClassicFavor() {//获取期刊点赞
    wx.request({
      url: 'http://localhost:3000/v1/classic/100/1/favor',
      method: 'GET',
      success: res => {
        console.log(res.data)
      },
      header: {
        Authorization: this._encode()
      }
    })
  },
  onGetMyFavorList() { //获取我点赞的期刊列表
    wx.request({
      url: 'http://localhost:3000/v1/classic/favor',
      method: 'GET',
      success: res => {
        console.log(res.data)
      },
      header: {
        Authorization: this._encode()
      }
    })
  },
  onGetClassicDetail() { //获取期刊详情
    wx.request({
      url: 'http://localhost:3000/v1/classic/100/2',
      method: 'GET',
      success: res => {
        console.log(res.data)
      },
      header: {
        Authorization: this._encode()
      }
    })
  },
  onGetHotBookList() {
    wx.request({
      url: 'http://localhost:3000/v1/book/hot_list',
      method: 'GET',
      success: res => {
        console.log(res.data)
      },
      header: {
        Authorization: this._encode()
      }
    })
  },
  onGetBookDetail() { //获取book详情
    wx.request({
      url: 'http://localhost:3000/v1/book/1120/detail',
      method: 'GET',
      success: res => {
        console.log(res.data)
      },
      header: {
        Authorization: this._encode()
      }
    })
  },
  onBookSearch() { //鱼书 查询书籍
    wx.request({
      url: 'http://localhost:3000/v1/book/search',
      method: 'GET',
      data: {
        q: '东野',
        count: 5
      },
      // like key%
      success: res => {
        console.log(res.data)
      },
      header: {
        Authorization: this._encode()
      }
    })
  },
  onGetMyFavorsBookCount() { //获取我点赞的数量
    wx.request({
      url: 'http://localhost:3000/v1/book/favor/count',
      method: 'GET',
      // like key%
      success: res => {
        console.log(res.data)
      },
      header: {
        Authorization: this._encode()
      }
    })
  },
  onGetBookFavor() { //获取book 点赞数量
    wx.request({
      url: 'http://localhost:3000/v1/book/1120/favor',
      method: 'GET',
      success: res => {
        console.log(res.data)
      },
      header: {
        Authorization: this._encode()
      }
    })
  },

  _encode() { //Authorization 加密
    // account:password
    // token
    // token:
    const token = wx.getStorageSync('token')
    const base64 = Base64.encode(token + ':')
    // Authorization:Basic base64(account:password)
    return 'Basic ' + base64
  } 


})