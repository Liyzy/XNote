//index.js
//获取应用实例
const app = getApp()

Page({
  data: {

  },
  // 跳转到 新建笔记 页面
  newNote: function() {
    wx.navigateTo({
      url: '../newNote/newNote',
    })
  },
  // 跳转到 每日计划 页面
  newPlan: function() {
    wx.navigateTo({
      url: '../newPlan/newPlan',
    })
  },
})