// pages/index.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:"",
    pageindex:1,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    wx.request({
      url: app.globalData.ServerURL + '/mobile/plugin/ComponentList.jsp?comp=3&conditions=categoryids:is:402880f260a17ff10160a188f32e0005&pageindex=0&pagesize=4',
      data: {

      },
      header: {
        'Content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        console.log("res",res)
        var list = res.data.list;
        for(var i=0;i<list.length;i++){
          list[i].pic=list[i].pic.replace(list[i].pic, list[i].pic.substring(0, 32))
          list[i].remen=true
        }
        that.setData({
          list: res.data.list
        });
      },
      fail: function (msg) {
        console.log(msg);
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var that=this;
    wx.request({
      url: app.globalData.ServerURL + '/mobile/plugin/ComponentList.jsp?comp=3&conditions=categoryids:is:4029bcd867b9d9b30167b9f52c3100a3&pageindex=0&pagesize=1',
      data: {

      },
      header: {
        'Content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        console.log(res)
        that.setData({
          listTop1: res.data.list[0],
        });
      },
      fail: function (msg) {
        console.log(msg);
      }
    })
    var tokenId = wx.getStorageSync('tokenId');
    app.post(app.globalData.ServerURL + '/mobile/plugin/ComponentList.jsp?pageindex=1&pagesize=1&comp=1&tokenId=' + tokenId, 0).then((res) => {
      console.log(res.data.count)
      if (res.data.count > 0) {
        wx.showTabBarRedDot({
          index: 3,
        })
      }
    }).catch((errMsg) => {
      console.log(errMsg);
    });
  },
  baoxiu: function (e) {
    var title = e.currentTarget.dataset.title ? e.currentTarget.dataset.title:"活动";
    if (app.globalData.userInfo && wx.getStorageSync('orgName')) {
      wx.navigateTo({
        url: '../servering/index?workflowId=' + e.currentTarget.id +'&title='+title
      });
    }else{
      wx.showToast({
        title: '登录并选择企业',
        icon: 'loading',
        duration: 1000,
        width:2000,
      })
      setTimeout(function () {
        wx.switchTab({
          url: '../mine/index',
        })
      },1000)
    }
  },  
  baoxiu2: function (e) {
    wx.navigateTo({
      url: '../information/index'
    })
  },  
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var that = this;
    var pageindex = this.data.pageindex + 1;
    this.setData({
      pageindex: pageindex,
    });
    wx.request({
      url: app.globalData.ServerURL + '/mobile/plugin/ComponentList.jsp?comp=3&conditions=categoryids:is:402880f260a17ff10160a188f32e0005&pagesize=4&pageindex=' + pageindex,
      data: {

      },
      header: {
        'Content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        console.log(res.data.list);
        var newlist = res.data.list;
        var list = that.data.list;
        list = list.concat(newlist);
        for (var i = 0; i < list.length; i++) {
          list[i].pic = list[i].pic.replace(list[i].pic, list[i].pic.substring(0, 32))
        }
        that.setData({
          list: list,
        });
        console.log(that.data.list);

      },
      fail: function (msg) {
        console.log(msg);
      }
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  onPullDownRefresh: function () {
    var that = this;
    wx.request({
      url: app.globalData.ServerURL + '/mobile/plugin/ComponentList.jsp?comp=3&conditions=categoryids:is:402880f260a17ff10160a188f32e0005&pageindex=0&pagesize=4',
      data: {

      },
      header: {
        'Content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        console.log("res", res)
        var list = res.data.list;
        for (var i = 0; i < list.length; i++) {
          list[i].pic = list[i].pic.replace(list[i].pic, list[i].pic.substring(0, 32))
          list[i].remen = true
        }
        that.setData({
          list: res.data.list
        });
        wx.stopPullDownRefresh()
      },
      fail: function (msg) {
        console.log(msg);
      }
    })
  },
  
})