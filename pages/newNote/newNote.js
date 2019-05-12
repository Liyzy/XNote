// pages/newNote/newNote.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    title: '', // 文章标题
    nodeList: [], // 文章内容节点数组
    textBufferedPool: [], // 内容缓冲池
    windowsHeight: 0,
    type: 'post', // 类型：可选 post draft
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
   * 加载本地缓存
   */
  // onLoad: function() {
  //   try {
  //     const title = wx.getStorageSync('title');
  //     if (title) {
  //       this.setData({
  //         title: title,
  //       })
  //     }
  //   } catch (e) {
  //     // 异常处理
  //     console.log('Get title failed!');
  //   }
  //   try {
  //     const tbp = wx.getStorageSync('tbp');
  //     if (tbp) {
  //       this.setData({
  //         textBufferedPool: tbp,
  //       })
  //     }
  //   } catch (e) {
  //     // 异常处理
  //     console.log('Get textBufferedPool failed!')
  //   }
  //   try {
  //     const draft = wx.getStorageSync('draft');
  //     if (draft) {
  //       this.setData({
  //         nodeList: draft,
  //       })
  //     }
  //   } catch (e) {
  //     // 异常处理
  //     console.log('Get nodeList failed!')
  //   }
  // },

  /**
   * 设置标题
   */
  setTitle: function(e) {
    var title = e.detail.value;
    this.setData({
      title: title,
    })
  },

  /**
   * 添加文本节点
   */
  addTextNode: function(e) {
    this.writeTextToNode();
    const index = e.currentTarget.dataset.index;
    const node = {
      name: 'p',
      attrs: {
        class: 'weapp-p',
      },
      children: [{
        type: 'text',
        text: ''
      }]
    };
    const nl = this.data.nodeList;
    const tbp = this.data.textBufferedPool;
    nl.splice(index + 1, 0, node);
    tbp.splice(index + 1, 0, '');
    this.setData({
      nodeList: nl,
      textBufferedPool: tbp,
    })
  },

  /**
   * 输入文本框中内容写到缓冲区
   */
  onTextareaInput: function(e) {
    const index = e.currentTarget.dataset.index;
    var tbp = this.data.textBufferedPool;
    tbp[index] = e.detail.value;
    this.setData({
      textBufferedPool: tbp,
    })
  },

  /**
   * 将缓冲区文本写入节点中
   */
  writeTextToNode: function(e) {
    const tbp = this.data.textBufferedPool;
    const nl = this.data.nodeList;
    nl.forEach((node, index) => {
      if (node.name === 'p') {
        node.children[0].text = tbp[index];
      }
    })
    this.setData({
      nodeList: nl,
    })
  },

  /**
   *添加图片节点
   */
  addImageNode: function(e) {
    this.writeTextToNode();
    const index = e.currentTarget.dataset.index;
    // 选择图片
    wx.chooseImage({
      success: res => {
        const tempFilePath = res.tempFilePaths[0];
        wx.getImageInfo({
          src: tempFilePath,
          success: res => {
            const relativeHeight = res.height / res.width;
            // 上传图片至云存储
            wx.cloud.uploadFile({
              // 待解决：如何更好的唯一标志图片路径 -> 解决方案：时间戳做图片名称
              cloudPath: (new Date().valueOf()).toString() + '.png',
              filePath: tempFilePath,
              success: res => {
                // get resource ID
                var node = {
                  name: 'image',
                  attrs: {
                    class: 'weapp-img',
                    style: 'width: 100%',
                    src: res.fileID,
                    _height: relativeHeight,
                  },
                }
                let nl = this.data.nodeList;
                let tbp = this.data.textBufferedPool;
                nl.splice(index + 1, 0, node);
                tbp.splice(index + 1, 0, res.fileID);
                this.setData({
                  nodeList: nl,
                  textBufferedPool: tbp,
                })
                console.log(res.fileID)
              },
              fail: err => {
                // handle error
                console.log('图片上传失败')
              }
            })
          }
        })
      },
    })
  },

  /**
   * 删除节点
   */
  deleteNode: function(e) {
    this.writeTextToNode();
    const index = e.currentTarget.dataset.index;
    let nl = this.data.nodeList;
    let tbp = this.data.textBufferedPool;
    // 删除云端图片文件
    if (nl[index].name === 'image') {
      wx.cloud.deleteFile({
        fileList: [nl[index].attrs.src],
        success: res => {
          // handle success
          console.log(res.fileList)
          console.log('成功删除云端图片')
        },
        fail: err => {
          // handle error
          console.log('删除云端图片失败')
        }
      })
    }
    nl.splice(index, 1);
    tbp.splice(index, 1);
    this.setData({
      nodeList: nl,
      textBufferedPool: tbp,
    })
  },

  /**
   * 当前节点上移
   */
  currentNodeUp: function(e) {
    this.writeTextToNode();
    const index = e.currentTarget.dataset.index;
    if (index > 0) {
      var nl = this.data.nodeList;
      var tbp = this.data.textBufferedPool;
      var tempNode = nl[index];
      var tempTbp = tbp[index];
      nl.splice(index, 1);
      tbp.splice(index, 1);
      nl.splice(index - 1, 0, tempNode);
      tbp.splice(index - 1, 0, tempTbp);
      this.setData({
        nodeList: nl,
        textBufferedPool: tbp,
      })
    }
  },

  /**
   * 当前节点下移
   */
  currentNodeDown: function(e) {
    this.writeTextToNode();
    const index = e.currentTarget.dataset.index;
    var nl = this.data.nodeList;
    if (index + 1 < nl.length) {
      var tbp = this.data.textBufferedPool;
      var tempNode = nl[index];
      var tempTbp = tbp[index];
      nl.splice(index, 1);
      tbp.splice(index, 1);
      nl.splice(index + 1, 0, tempNode);
      tbp.splice(index + 1, 0, tempTbp);
      this.setData({
        nodeList: nl,
        textBufferedPool: tbp,
      })
    }
  },

  /**
   * 完成编辑
   */
  onFinish: function(e) {
    wx.showToast({
      title: '正在保存',
      icon: 'loading',
      duration: 2000,
    })
    this.writeTextToNode();
    this.uploadPostToDB();
    wx.showToast({
      title: '保存笔记成功',
      icon: 'success',
      duration: 1000
    })
    wx.redirectTo({
      url: '../index/index',
    })
  },

  /**
   * 保存草稿
   */
  saveAsDraft: function() {
    this.writeTextToNode();
    this.setData({
      type: 'draft',
    })
    this.uploadPostToDB();
    wx.showToast({
      title: '保存草稿成功',
      icon: 'success',
      duration: 1000
    })
  },

  /**
   * 文章上传到服务器数据库
   */
  uploadPostToDB: function() {
    const db = wx.cloud.database({
      env: 'xnote-rcmn6'
    });
    // console.log('Get database successful.');
    const post = db.collection('post');
    // console.log('Get collection successful.');
    post.add({
      data: {
        // 字段：标题
        title: this.data.title,
        // 字段：创建时间
        date: new Date(),
        // 字段： 文章类型
        type: this.data.type,
        // 字段：文章内容
        content: this.data.nodeList
      }
    }).then(res => {
      console.log('文章上传成功')
    }).catch(console.error)
  },

  /**
   * 将云端图片的fileID换成可以预览的图片临时链接
   */
  // linkExchange: function() {
  //   const nl = this.data.nodeList;
  //   var tnl = this.data.tempNodeList;
  //   nl.forEach((node, index) => {
  //     if(node.name === 'image') {
  //       wx.cloud.getTempFileURL({
  //         fileList: [node.attrs.src],
  //         success: res => {
  //           // get temp file URL
  //           tnl[index].attrs.src = res.fileList[0].tempFileURL;
  //           console.log(res.fileList);
  //         },
  //         fail: err => {
  //           // handle error
  //           console.log('转换地址失败');
  //         }
  //       })
  //     }
  //   })
  // }
})