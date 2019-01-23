//main.js
//获取应用实例
var app = getApp()
Page({
  data: {
    windowHeight: "",
    windowWidth: "",
    dataId:0,
    type:"4029bcd8611b8e3801611c73bc790004",
    pageindex: 1,
  },
  onLoad: function (options) {
    this.getTypeData()
  },
  getTypeData: function (pageindex) {
    var type=this.data.type;
    var pageindex = this.data.pageindex;
    var that = this;
    app.get(app.globalData.ServerURL + '/mobile/plugin/ComponentList.jsp?comp=3&pageindex=0&pagesize=10&conditions=categoryids:is:' + type).then((res) => {
      var list = res.data.list;
      for (var i = 0; i < list.length; i++) {
        list[i].pic = list[i].pic.replace(list[i].pic, list[i].pic.substring(0, 32))
      };
      list = list.splice(0, 10)
      that.setData({
        list: list
      });
    }).catch((errMsg) => {
      console.log(errMsg);
    });
  },
  onShow: function (e) {
    wx.getSystemInfo({
      success: (res) => {
        this.setData({
          windowHeight: res.windowHeight,
          windowWidth: res.windowWidth
        })
      }
    })
  },
  //点击切换新闻类型
  check: function (e) {
    this.setData({
      dataId: e.target.dataset.id,
      list:"",
      type: e.target.dataset.type,
      pageindex: 1,
    })
    this.getTypeData()
  },
  //触底加载
  pullUpLoad: function (e) {
    var that = this;
    var pageindex = this.data.pageindex + 1;
    var type=that.data.type;
    this.setData({
      pageindex: pageindex,
    });
    app.get(app.globalData.ServerURL + '/mobile/plugin/ComponentList.jsp?comp=3&pagesize=10&conditions=categoryids:is:' + type + '&pageindex=' + pageindex).then((res) => {
      var newlist = res.data.list;
      var list = that.data.list;
      list = list.concat(newlist);
      for (var i = 0; i < list.length; i++) {
        list[i].pic = list[i].pic.replace(list[i].pic, list[i].pic.substring(0, 32))
      }
      if (list.length == that.data.list.length) {
        wx.showToast({
          title: '已经到底了',
          icon: 'sucess',
          duration: 500,
        })
      }
      that.setData({
        list: list,
      });
      
    }).catch((errMsg) => {
      console.log(errMsg);
    });
    
  },
  
})
