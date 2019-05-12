// pages/found/found.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    year: '1999',
    month: '01',
    day: '01',
    completedPlans: 0,
    uncompletedPlans: 0,
    plans: []
  },

  onShow: function(options) {
    this.formatDate();
    this.getPlans();
  },

  formatDate: function() {
    const year = (new Date()).getFullYear();
    const month = (new Date()).getMonth() + 1;
    const day = (new Date()).getDate();
    this.setData({
      year: year,
      month: month,
      day: day,
    })
  },

  getPlans: function() {
    var counterUncomplete = 0;
    var counterComplete = 0;
    const todos = wx.getStorageSync('todos');
    if (todos) {
      for (let i = 0; i < todos.length; i++) {
        if (todos[i].complete) {
          counterComplete++;
        } else {
          counterUncomplete++;
        }
      }
      this.setData({
        uncompletedPlans: counterUncomplete,
        completedPlans: counterComplete,
        plans: todos,
      })
    }
  }
})