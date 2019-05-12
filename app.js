//app.js
App({
  /**
   * 全局数据
   */
  globalData: {
    appid: 'wxbd3697a62f0b1077', // appid
    secret: '77a010adc5c4ac7851ecfd190f110e21', // 加密密钥
  },

  /**
   * 当小程序初始化完成时，会触发 onLaunch（全局只触发一次）
   */
  onLaunch: function() {
    // 云服务初始化
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        env: 'xnote-rcmn6',
        traceUser: true,
      })
    }
},

/**
 * 当小程序启动，或从后台进入前台显示，会触发 onShow
 */
onShow: function(options) {

  },

  /**
   * 当小程序从前台进入后台，会触发 onHide
   */
  onHide: function() {

  },

  /**
   * 当小程序发生脚本错误，或者 api 调用失败时，会触发 onError 并带上错误信息
   */
  onError: function(msg) {

  }
})