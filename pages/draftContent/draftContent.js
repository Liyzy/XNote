// pages/draftContent/draftContent.js
const regeneratorRuntime = require("../../utils/regenerator-runtime/runtime.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: '',
    date: 0,
    content: [],
    draftId: ''
  },

  /**
   * 生命周期函数--监听页面加载,获取上一个页面传来的数据
   */
  onLoad: function (options) {
    this.setData({
      title: options.title,
      date: Number(options.date),
    })
    this.getContent();
  },

  /**
   * 获得文章内容
   */
  async getContent() {
    wx.showLoading({
      title: '加载中',
    })
    var c = this.data.content;
    var draftid = this.data.draftId;
    // 获取openid
    var openid = wx.getStorageSync('openid');
    // console.log(openid)
    if (openid) {
      // 获取数据库引用
      const db = wx.cloud.database({
        env: 'xnote-rcmn6'
      });
      const promise = await db.collection('post').where({
        _openid: openid,
        type: 'draft',
        title: this.data.title,
        date: new Date(this.data.date),
      }).get();
      // console.log(promise.data)
      c.push(promise.data[0].content);
      draftid = promise.data[0]._id;
    }
    // console.log(c)
    this.setData({
      content: c,
      draftId: draftid,
    })
    wx.hideLoading();
  },

  /**
   * 删除草稿
   */
  deletedraft: function () {
    const db = wx.cloud.database({
      env: 'xnote-rcmn6'
    });
    // 云端删除相关的图片，如果有的话
    var content = this.data.content;
    content[0].forEach((node, index) => {
      if (node.name === 'image') {
        wx.cloud.deleteFile({
          fileList: [node.attrs.src]
        }).then(res => {
          console.log('成功删除云端图片')
        }).catch(error => {
          console.log('删除云端图片失败')
        })
      }
    })
    // 数据库删除记录
    db.collection('post').doc(this.data.draftId).remove()
      .then(console.log)
      .catch(console.error)
    wx.redirectTo({
      url: '../drafts/drafts',
    })
  }
})