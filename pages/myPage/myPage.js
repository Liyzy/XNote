// pages/myPage/myPage.js
const app = getApp() // 之后优化 -> Appsecret不能写在前端代码里

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isLogin: false,
    nickname: '未登录',
    avatarSrc: '../../images/unlogin.png',

  },

  /**
   * 看是否已登录
   */
  onLoad: function() {
    const info = wx.getStorageSync('userInfo');
    if (info) {
      this.setData({
        isLogin: true,
        nickname: info.nickname,
        avatarSrc: info.avatarSrc,
      })
    }
  },

  /**
   * 获取用户信息
   */
  getUserInfo: function(e) {
    let info = e.detail.userInfo;
    // 设入缓存，避免一直要求登录
    wx.setStorageSync('userInfo', {
      avatarSrc: info.avatarUrl,
      nickname: info.nickName,
    });
    this.setData({
      isLogin: true, //确认登陆状态
      avatarSrc: info.avatarUrl, //更新图片来源
      nickname: info.nickName //更新昵称
    })
    // 获取openid并设入本地缓存,该段代码来源于https://blog.csdn.net/qq_27626333/article/details/54614037
    var user = wx.getStorageSync('user') || {};
    // if ((!user.openid || (user.expires_in || Date.now()) < (Date.now() + 600))) {
    //   wx.login({
    //     success: function(res) {
    //       var d = app.globalData; // 这里存储了appid、Appsecret
    //       var l = 'https://api.weixin.qq.com/sns/jscode2session?appid=' + d.appid + '&secret=' + d.secret + '&js_code=' + res.code + '&grant_type=authorization_code';
    //       wx.request({
    //         url: l,
    //         //url: 'https://30paotui.com/user/wechat',
    //         data: {code: res.code},
    //         method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT  
    //         // header: {}, // 设置请求的 header  
    //         success: function(res) {
    //           var obj = {};
    //           obj.openid = res.data.openid;
    //           obj.expires_in = Date.now() + res.data.expires_in;
    //           //console.log(obj);
    //           wx.setStorageSync('user', obj); //存储openid
    //         }
    //       });
    //     }
    //   })
    // }
    if ((!user.openid || (user.expires_in || Date.now()) < (Date.now() + 600))) {
      wx.cloud.callFunction({
        name: 'getOpenid',
      }).then(res => {
        var openid = res.result.openid;
        console.log(openid);
        wx.setStorageSync('openid', openid);
      }).catch(console.error)
    }
  },

  /**
   * 跳转笔记页面
   */
  getMyNotes: function() {
    if (!this.data.isLogin) {
      wx.showModal({
        content: '登录后才能使用哦',
        confirmText: '我知道了',
        showCancel: false,
      })
    } else {
      wx.navigateTo({
        url: '../notes/notes',
        success: function(res) {},
        fail: function(res) {},
        complete: function(res) {},
      })
    }
  },

  /**
   * 跳转草稿页面
   */
  getMydraftsInfo: function() {
    if (!this.data.isLogin) {
      wx.showModal({
        content: '登录后才能使用哦',
        confirmText: '我知道了',
        showCancel: false,
      })
    } else {
      wx.navigateTo({
        url: '../drafts/drafts',
        success: function(res) {},
        fail: function(res) {},
        complete: function(res) {},
      })
    }
  },

  /**
   * 跳转计划页面
   */
  tempFuntion: function() {
    wx.navigateTo({
      url: '../newPlan/newPlan',
    })
  },

  /**
   * 跳转关于界面
   */
  getAbout: function() {
    wx.navigateTo({
      url: '../about/about',
    })
  },

  // /**
  //  * 还未设计的页面
  //  */
  // uncompleted: function() {
  //   wx.showModal({
  //     content: '再催就要秃啦',
  //     confirmText: '我不催了',
  //     showCancel: false,
  //   })
  // }
})