// pages/index.js
var WxParse = require('../../wxParse/wxParse.js')
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    detail:'',
    content:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.loading();
    var that=this;
    var id = options.id;
    wx.request({
      url: app.globalData.ServerURL + '/mvc/wechatAppBaseController/getDocBaseNewsInfo?docId='+id,
      data: {

      },
      header: {
        'Content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var str = res.data.data[0].content;
        var subStr = new RegExp('/ueditor/jsp/upload/image','ig');
        var result = str.replace(subStr, "http://121.52.208.49:8041/ueditor/jsp/upload/image");
        that.setData({
          detail: res.data.data[0],
          content: WxParse.wxParse('databinding', 'html', result, that, 5),
        })
      },
      fail: function (msg) {
        console.log(msg);
      },
      complete: function () {
        wx.hideToast();
      }
    })
  },
  loading: function () {
    wx.showToast({
      title: '加载中',
      icon: 'loading',
      duration: 10000
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})