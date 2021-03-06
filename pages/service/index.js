var app = getApp()
Page({
  data: {
    slider: [],
    currentSwiper: 0,
    autoplay: true,
  },
  onLoad: function (options) {
    var that = this;
    wx.request({
      url: app.globalData.ServerURL + '/mvc/wechatAppBaseController/getTopThreeDocWithPic',
      data: {

      },
      header: {
        'Content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        console.log(res)
        var list = res.data.data;
        for (var i = 0; i < list.length; i++) {
          list[i].attachid = list[i].attachid.replace(list[i].attachid, list[i].attachid.substring(0, 32))
        }
        that.setData({
          slider: res.data.data,
        });
      },
      fail: function (msg) {
        console.log(msg);
      }
    })
    
  },
  onReady: function () {
    
  },
  swiperChange: function (e) {
    this.setData({
      currentSwiper: e.detail.current
    })
  },
  baoxiu: function (e) {
    if (app.globalData.userInfo && wx.getStorageSync('orgName')) {
      wx.navigateTo({
        url: '../servering/index?workflowId=' + e.currentTarget.id
      });
    } else {
      wx.showToast({
        title: '登录并选择企业',
        icon: 'loading',
        duration: 1000,
        width: 2000,
      })
      setTimeout(function () {
        wx.switchTab({
          url: '../mine/index',
        })
      }, 1000)
    }
  },  
  baoxiu2: function (e) {
    wx.navigateTo({
      url: '../information/index'
    })
  },
  baoxiu3: function (e) {
    wx.navigateTo({
      url: '../detail/index?id=' + e.currentTarget.id
    })
  },
})
