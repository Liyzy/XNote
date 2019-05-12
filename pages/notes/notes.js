// pages/notes/notes.js
const regeneratorRuntime = require("../../utils/regenerator-runtime/runtime.js");
Page({
  /**
   * 页面的初始数据
   */
  data: {
    noteInfo: [],  // {title：string, date: string}  里面的string是toDateString()处理过的
    date: [],  // 记录时间做页面跳转参数 
  },

  onLoad: function() {
    this.getMyNotesInfo();
  },

  /**
   * 获取所有已保存文章信息
   */
  async getMyNotesInfo() {
    wx.showLoading({
      title: '加载中',
    })
    var ni = this.data.noteInfo;
    var d = this.data.date;
    // 获取openid
    var openid = wx.getStorageSync('openid');
    // console.log(openid)
    if (openid) {
      // 获取数据库引用
      const db = wx.cloud.database({
        env: 'xnote-rcmn6'
      });
      // 解决小程序端一次只能读取20条限制的问题
      // 定义每次获取的条数​
      const MAX_LIMIT = 20;
      // 计算集合中符合条件的总记录数
      const countResult = await db.collection('post').where({
        _openid: openid,
        type: 'post'
      }).count();
      const total = countResult.total;
      // Math.ceil()向上取整
      const batchTimes = Math.ceil(total / MAX_LIMIT);
      for (var i = 0; i < batchTimes; i++) {
        const promise = await db.collection('post').where({_openid: openid, type: 'post'}).skip(i * MAX_LIMIT).limit(MAX_LIMIT).get();
        // 将​本次获取到的20条数据push到noteInfo数组中
        for (var j = 0; j < promise.data.length; j++) {
          const node = {
            title: promise.data[j].title,
            date: promise.data[j].date.toDateString(),
          }
          d.push((promise.data[j].date).valueOf());  // 毫秒数，当参数传递，然后根据毫秒数构造出原date对象
          ni.push(node);
        }
      }
    }
    this.setData({
      noteInfo: ni,
      date: d,
    })
    wx.hideLoading();
  },

  /**
   * 点击文章标题进入详情页
   */
  getNoteContent: function(e) {
    const index = e.currentTarget.dataset.index;
    const title = this.data.noteInfo[index].title;
    const date = this.data.date[index];
    wx.redirectTo({
      url: '../noteContent/noteContent?title=' + title + '&date=' + date,
    })
  }
})