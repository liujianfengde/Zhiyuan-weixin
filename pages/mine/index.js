//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    array: [],
    index: 0,
    isShowAhturoizeWarning:false,
    acceptAuthorize:false,
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    pickDisable:false,
    company:true,
    companyName:"",
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    });
  },
  onLoad: function(options) {
    wx.hideTabBarRedDot({
      index: 3,
    })
    var openid=wx.getStorageSync('openid')
    var orgId = wx.getStorageSync('orgId')
    wx.request({
      url: app.globalData.ServerURL + '/mvc/wechatUserController/getUseBandInfoByOpenId?openId=' + openid,
      data: {
      },
      header: {
        'content-type': 'application/json'
      },
      method: 'GET',
      success: function (res) {
        console.log(res.data.data[0])
        if (res.data.data[0].id !=orgId){
          wx.setStorageSync('orgId', res.data.data[0].humresid)
          wx.setStorageSync('orgName', res.data.data[0].objname)
        }
      }
    })
    if(options.company){
      this.setData({
        company: true,
        companyName: wx.getStorageSync('orgName')
      })
    };
    if (wx.getStorageSync('orgName')){
      this.setData({
        company: true,
        companyName: wx.getStorageSync('orgName')
      })
    };
    var that=this
    console.log(app.globalData.userInfo)
    console.log(this.data.canIUse)
    if (app.globalData.userInfo !=null) {
      that.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse != "") {
      
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        that.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          that.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  onReady:function(){
  },
  onShow:function(){
    var that = this;
    var tokenId = wx.getStorageSync('tokenId');
    app.post(app.globalData.ServerURL + '/mobile/plugin/ComponentList.jsp?pageindex=1&pagesize=1&comp=1&tokenId=' + tokenId, 0).then((res) => {
      console.log(res.data.count)
      that.setData({
        count1: res.data.count
      })
    }).catch((errMsg) => {
      console.log(errMsg);
    });
  },
  getUserInfo(e) {//同意授权，获取用户信息，encryptedData是加密字符串，里面包含unionid和openid信息
    var that2=this
    console.log(e)
    wx.getUserInfo({
      withCredentials: true,//此处设为true，才会返回encryptedData等敏感信息
      success: res => {
        app.globalData.userInfo = e.detail.userInfo
        that2.setData({
          userInfo: e.detail.userInfo,
          hasUserInfo: true
        })
        wx.setStorageSync('userName', res.userInfo.nickName);
        const info=res
        wx.login({
          success: function (res) {
            const code=res.code
            console.log(code)
            wx.request({
              url: app.globalData.ServerURL +'/mvc/wechatUserController/userOpenIdByCode?code='+code,//服务器的地址，现在微信小程序只支持https请求，所以调试的时候请勾选不校监安全域名
              data: {
              },
              header: {
                'content-type': 'application/json'
              },
              success: function (res) {
                console.log(res.data.data)
                wx.request({
                  url: app.globalData.ServerURL +'/mvc/wechatUserController/saveUserInfo',//服务器的地址，现在微信小程序只支持https请求，所以调试的时候请勾选不校监安全域名
                  data: {
                    nickName: info.userInfo.nickName,
                    headImgUrl: info.userInfo.avatarUrl,
                    sex: info.userInfo.gender,
                    openId:res.data.data,
                    country: info.userInfo.country,
                    province: info.userInfo.province,
                    city: info.userInfo.city,
                    privilege1:"",
                    accessToken:"",
                  },
                  method: 'POST',
                  header: {
                    'content-type': 'application/x-www-form-urlencoded'
                  },
                  success: function (res) {
                    console.log(res)
                    wx.setStorageSync('humresid', res.data.data[0].humresid)
                    wx.setStorageSync('humresname', res.data.data[0].humresname)
                    wx.setStorageSync('openid', res.data.data[0].openid)
                    wx.setStorageSync('orgId', res.data.data[0].orgid)
                    wx.setStorageSync('orgName', res.data.data[0].orgname)
                    wx.setStorageSync('tokenId', res.data.data[0].tokenid)
                    app.globalData.userInfo = res.data.data
                    if (res.data.data[0].orgid!=null){
                      that2.setData({
                        company: true,
                        companyName: res.data.data[0].orgname
                      })
                    }else{
                      that2.setData({
                        company: false,
                      })
                    }
                  }
                })
              }
            })
          }
        })
      }
    })
  },
  getAuthorize() {//弹出授权窗函数
    if (this.data.acceptAuthorize) {//判断是否已经授权过
      // 获取用户信息
      wx.getSetting({
        success: res => {
          if (res.authSetting['scope.userInfo']) {
            // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
            this.getUserInfo();
            this.setData({
              isShowAhturoizeWarning: false
            })
          } else {
            this.setData({
              isShowAhturoizeWarning: true
            })
          }
        }
      })
    } else {//如果已经授权过直接登录
      this.saveUserInfo()
    }
  },
    cancelAuthroize(){
      this.setData({
        isShowAhturoizeWarning: false,
        acceptAuthorize: false
      });
      app.globalData.unionid = null;
      this.saveUserInfo();

    },
  onPullDownRefresh: function () {
    var that = this;
    var tokenId = wx.getStorageSync('tokenId');
    app.post(app.globalData.ServerURL + '/mobile/plugin/ComponentList.jsp?pageindex=1&pagesize=1&comp=1&tokenId=' + tokenId, 0).then((res) => {
      console.log(res.data.count)
      that.setData({
        count1: res.data.count
      })
      wx.stopPullDownRefresh()
    }).catch((errMsg) => {
      console.log(errMsg);
    });
  }
})
