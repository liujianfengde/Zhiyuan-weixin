// pages/mine/mycon/index.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
      list:[],
      pageindex:1,
      listLength:true,
      comp:"",
      tokenId:"",      
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.loading();
    var comp=options.comp;
    if (comp == 9) {
      wx.setNavigationBarTitle({
        title: '发起待续'
      })
    } else if (comp == 1) {
      wx.setNavigationBarTitle({
        title: '流程待办'
      })
    } else if (comp == 8) {
      wx.setNavigationBarTitle({
        title: '流程已办'
      })
    } else if (comp == 7) {
      wx.setNavigationBarTitle({
        title: '办结事项'
      })
    } else if (comp == 14) {
      wx.setNavigationBarTitle({
        title: '流程退回'
      })
    }
    
    console.log(wx.getStorageSync('tokenId'));
    
    var tokenId = wx.getStorageSync('tokenId');
    this.setData({
      comp:comp,
      tokenId:tokenId,
    });
   
    var that=this;
    wx.request({
      url: app.globalData.ServerURL + '/mobile/plugin/ComponentList.jsp?pageindex=1&pagesize=10&tokenId=' + that.data.tokenId
  + '&comp='+that.data.comp,
      data: {

      },
      header: {
        'Content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        console.log(res);
        if (res.data.list.length>0){
          that.setData({
            list: res.data.list
          });
        }else{
          that.setData({
            listLength: false
          });
          wx.showToast({
            title: '暂无数据',
            image: '../../../images/index/message.png',
            duration: 2000
          })  
        }
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
    console.log(this.data.list)
    console.log(1111111111111111111111111111111111111111111)
    var that = this;
    var pageindex=this.data.pageindex+1;
    this.setData({
      pageindex: pageindex,
    });
    console.log(this.data.pageindex);
    wx.request({
      url: app.globalData.ServerURL + '/mobile/plugin/ComponentList.jsp?pagesize=10&pageindex=' + pageindex + '&tokenId=' + that.data.tokenId + '&comp=' + that.data.comp,
      data: {

      },
      header: {
        'Content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        console.log(res.data.list);
        var newlist = res.data.list;
        var list=that.data.list;
        list =list.concat(newlist);
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

  }
})