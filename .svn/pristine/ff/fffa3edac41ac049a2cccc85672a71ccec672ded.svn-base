const app = getApp()

Page({
  data: {
    array: [],
    index: 0,
    disabled: true,
    name:"",
    openid:""
  },
  onLoad: function () {
    var that = this
    wx.request({
      url: app.globalData.ServerURL +'/mvc/orgunitController/orgunitInfo',//服务器的地址，现在微信小程序只支持https请求，所以调试的时候请勾选不校监安全域名
      data: {

      },
      header: {
        'Content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        console.log(res.data.data)
        app.globalData.companyName = res.data.data
        that.setData({
          array: res.data.data,

        })
      },
      fail: function (msg) {
        console.log(msg)
      }
    });
    wx.getUserInfo({
      withCredentials: true,//此处设为true，才会返回encryptedData等敏感信息
      success: res => {
        console.log(app.globalData.userInfo)
        wx.setStorageSync('userName', res.userInfo.nickName);
        const info = res
        wx.login({
          success: function (res) {
            const code = res.code
            console.log(code)
            wx.request({
              url: app.globalData.ServerURL + '/mvc/wechatUserController/userOpenIdByCode?code=' + code,//服务器的地址，现在微信小程序只支持https请求，所以调试的时候请勾选不校监安全域名
              data: {
              },
              header: {
                'content-type': 'application/json'
              },
              success: function (res) {
                console.log(res.data.data)
                that.setData({
                  openid: res.data.data,
                })
              }
            })
          }
        })
      }
    })
  },

  
  setDisabled: function (e) {
    var that = this;
    this.setData({
      name: e.detail.value
    })
    var index = this.data.index;
    var name = this.data.name;
    var that = this;
    if (name.length >= 2 && index > 0) {
      that.setData({
        disabled: false,
      })
    } else {
      that.setData({
        disabled: true,
      })
    }
   
  },
  bindPickerChange: function (e) {
    this.setData({
      index: e.detail.value
    })
    var index = this.data.index;
    var name = this.data.name;
    var that = this;
    if (name.length >= 2 && index>0) {
      that.setData({
        disabled: false,
      })
    } else {
      that.setData({
        disabled: true,
      })
    }

  },
  tijiao: function () {
    var index = this.data.index;
    var name = this.data.name;
    var openid = this.data.openid;
    console.log(openid)
    var orgId = app.globalData.companyName[index].id
    wx.request({
      url: app.globalData.ServerURL +'/mvc/wechatUserController/updateUserInfoByOpenId',//服务器的地址，现在微信小程序只支持https请求，所以调试的时候请勾选不校监安全域名
      data: {
        userName:name,
        openId:openid,
        orgId:orgId
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        console.log(res.data);
        if(res.data.status==true){
          console.log(res.data.data)
          wx.setStorageSync('tokenId', res.data.data)
          app.globalData.tokenId = res.data.data
          wx.setStorageSync('orgId', orgId)
          wx.setStorageSync('orgName', app.globalData.companyName[index].objname)
          var pages = getCurrentPages(); // 当前页面  
          var beforePage = pages[pages.length - 2];
          beforePage.setData({
            company:true,
            companyName:app.globalData.companyName[index].objname,
          }),

          wx.showToast({
            title: '绑定成功',
            icon: 'sucess',
            duration: 1000,
            width: 2000,
          })
          setTimeout(function () {
            wx.switchTab({
              url: '../../mine/index',
            })
          }, 1000)
        }else{
          wx.showToast({
            title: '绑定失败',
            icon: 'loading',
            duration: 1000,
            width: 2000,
          })
          setTimeout(function () {
            wx.switchTab({
              url: '../../mine/index',
            })
          }, 1000)
        }
        
      }
    })
  }
  
})