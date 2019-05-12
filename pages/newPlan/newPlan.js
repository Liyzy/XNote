// pages/newPlan/newPlan.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    windowHeight: 0,
    nodeList: [],
    textBufferedPool: '',
    uncompletedCounter: 0,
  },

  /**
   * 初始化屏幕高度
   */
  onReady: function() {
    const wh = wx.getSystemInfoSync();
    this.setData({
      windowsHeight: wh,
    })
  },

  /**
   * 获取本地缓存
   */
  onLoad: function() {
    try {
      const todos = wx.getStorageSync('todos');
      if (todos) {
        this.setData({
          nodeList: todos,
        })
      }
      const counter = wx.getStorageSync('counter');
      if(counter) {
        this.setData({
          uncompletedCounter: counter,
        })
      }
    } catch (e) {
      // 异常处理
      console.log('Get storage failed!')
    }
  },

  /**
   * 输入文本框中内容写到缓冲区
   */
  onInputInput: function(e) {
    var tbp = this.data.textBufferedPool;
    tbp = e.detail.value;
    this.setData({
      textBufferedPool: tbp,
    });
  },

  /**
   * 添加计划
   */
  addPlan: function() {
    const tbp = this.data.textBufferedPool;
    // 判断输入是否为空或者都是空格
    if (!tbp || !tbp.trim()) {
      return
    }
    const node = {
      complete: false,
      text: tbp,
    };
    var nl = this.data.nodeList;
    nl.push(node);
    var uc = this.data.uncompletedCounter + 1;
    this.setData({
      nodeList: nl,
      uncompletedCounter: uc,
      // 输入完成后清空缓冲区，输入框回复初始状态
      textBufferedPool: '',
    })
    this.localCache();
  },

  /**
   * 改变计划状态
   */
  changePlanStatus: function(e) {
    var nl = this.data.nodeList;
    const index = e.currentTarget.dataset.index;
    nl[index].complete = !nl[index].complete;
    var uc = this.data.uncompletedCounter + (nl[index].complete ? -1 : 1);
    this.setData({
      nodeList: nl,
      uncompletedCounter: uc,
    })
    this.localCache();
  },

  /**
   * 删除一条计划
   */
  deletePlan: function(e) {
    var nl = this.data.nodeList;
    const index = e.currentTarget.dataset.index;
    var uc = this.data.uncompletedCounter;
    var deleteNode = nl.splice(index, 1)[0];
    uc = uc - (deleteNode.complete ? 0 : 1);
    this.setData({
      nodeList: nl,
      uncompletedCounter: uc,
    })
    this.localCache();
  },

  /**
   * 完成所有任务
   */
  completeAllPlan: function() {
    var nl = this.data.nodeList;
    nl.forEach((node, index) => {
      node.complete = true;
    })
    this.setData({
      nodeList: nl,
      uncompletedCounter: 0,
    })
    this.localCache();
  },

  /**
   * 清除所有已完成计划
   */
  clearCompletedPlan: function() {
    var nl = this.data.nodeList;
    var uncompletedPlans = [];
    nl.forEach((node, index) => {
      if (!node.complete) {
        uncompletedPlans.push(node);
      }
    })
    this.setData({
      nodeList: uncompletedPlans,
    })
    this.localCache();
  },

  /**
   * 设置本地缓存
   */
  localCache: function() {
    try {
      wx.setStorageSync('todos', this.data.nodeList);
      wx.setStorageSync('counter', this.data.uncompletedCounter);
    } catch (e) {
      // 异常处理
    }
  }
})