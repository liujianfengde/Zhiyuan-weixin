const app = getApp()
var tt = require('../../utils/util.js');
var dateTimePicker = require('../../utils/dateTimePicker.js');
var testCount=1;

Page({
  data: {
    imgsHttp:[],
    arr0:[],
    arr:[],
    tupian:false,
    tupian2:false,
    tijiao:"提交",
    disabled:false,
    color:"#1AAD19",
    disabled:false,
  },
  onLoad: function (options) {
    this.loading();
    var obj = dateTimePicker.dateTimePicker(2000, 2050);
    var lastArray = obj.dateTimeArray.pop();
    var lastTime = obj.dateTime.pop();

    var workflowId=options.workflowId;
    var title=options.title;
    wx.setNavigationBarTitle({
      title: title
    })
    this.setData({
      workflowId:workflowId
    })
    console.log(workflowId)
    var tokenId=wx.getStorageSync('tokenId');
    var that=this;
    wx.request({
      url: app.globalData.ServerURL + '/mvc/workFlowController/getWeChatWorkFlowLayout?workflowId='
       + workflowId + '&tokenId=' + tokenId,
      data: {

      },
      header: {
        'Content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        console.log(res)
        for (var i = 0; i < res.data.data.length; i++) {
          if (res.data.data[i].controlType == "Attach") {
            that.setData({
              tupian: true
            })
          } else if (res.data.data[i].controlType == "Select") {
            if (res.data.data[i].labelName == "申请单位"){
              var arr0 = that.data.arr0;
              var jihe = {
                labelaNme: res.data.data[i].labelName,
                index: res.data.data[i].value,
                showValue: res.data.data[i].showValue,
                showName: res.data.data[i].showName,
                labelPCName: res.data.data[i].labelPCName,
              }
              arr0[i] = jihe
              that.setData({
                arr0: arr0
              })
            } else if (res.data.data[i].labelName == "申请人"){
              var arr0 = that.data.arr0;
              var jihe = {
                labelaNme: res.data.data[i].labelName,
                index: res.data.data[i].value,
                showValue: res.data.data[i].showValue,
                showName: res.data.data[i].showName,
                labelPCName: res.data.data[i].labelPCName,
              }
              arr0[i] = jihe
              that.setData({
                arr0: arr0
              })
            }else{
              var arr0 = that.data.arr0;
              var jihe = {
                labelNme: res.data.data[i].labelName,
                index: res.data.data[i].value,
                showValue: res.data.data[i].pickValue[1].id,
                showName: res.data.data[i].pickValue[1].objname,
                labelPCName: res.data.data[i].labelPCName,
              }
              arr0[i] = jihe
              that.setData({
                arr0: arr0
              })
              if (res.data.data[i].pickValue[0].ismulti == "0") {
                res.data.data[i].pickValue = res.data.data[i].pickValue.slice(1)
              }
            }
          } else if (res.data.data[i].controlType == "Lable" && res.data.data[i].fieldType == "6") {
            var dateTime = obj.dateTime;
            var dateTimeArray = obj.dateTimeArray;
          
            var arr0 = that.data.arr0;
            var jihe = {
              labelName: res.data.data[i].labelName,
              index: res.data.data[i].value,
              showValue: dateTimeArray[0][dateTime[0]].replace(/年/g, "") + "-" + dateTimeArray[1][dateTime[1]].replace(/月/g, "") + "-" + dateTimeArray[2][dateTime[2]].replace(/日/g, "") + " " +
                dateTimeArray[3][dateTime[3]].replace(/时/g, "") + ":" + dateTimeArray[4][dateTime[4]].replace(/分/g, ""),
              showName: dateTimeArray[0][dateTime[0]].replace(/年/g, "") + "-" + dateTimeArray[1][dateTime[1]].replace(/月/g, "") + "-" + dateTimeArray[2][dateTime[2]].replace(/日/g, "") + " " +
                dateTimeArray[3][dateTime[3]].replace(/时/g, "") + ":" + dateTimeArray[4][dateTime[4]].replace(/分/g, ""),
              labelPCName: res.data.data[i].labelPCName,
              dateTime: obj.dateTime,
              dateTimeArray:obj.dateTimeArray,
            }
            arr0[i] = jihe
            that.setData({
              arr0: arr0
            })
          }
        }
        that.setData({
          arr: res.data.data
        })
      },
      fail: function (msg) {
        console.log(msg)
      },
      complete: function () {
        wx.hideToast();
      }
    })
    

  },

  changeDateTimeColumn(e) {
    var arr0=this.data.arr0;
    var arr = this.data.arr;
    var labelPCName = e.currentTarget.dataset.labelpcname;
    var that=this;
    for (var i = 0; i < arr.length; i++) {
      if (arr[i].labelPCName == labelPCName) {
        var datetime = that.data.arr0[i].dateTime;
        datetime[e.detail.column] = e.detail.value;
        var dateTime = "arr0[" + i + "].dateTime";
        var showName = "arr0[" + i + "].showName";
        console.log(datetime)
        that.setData({
          [dateTime]: datetime,
        });
      }
    }
  },
  changeDateTimeColumn2(e){
    var arr0 = this.data.arr0;
    var arr = this.data.arr;
    var labelPCName = e.currentTarget.dataset.labelpcname;
    var that = this;
    for (var i = 0; i < arr.length; i++) {
      if (arr[i].labelPCName == labelPCName) {
        var dateTime = that.data.arr0[i].dateTime;
        var dateTimeArray = that.data.arr0[i].dateTimeArray;
        var showValue = "arr0[" + i + "].showValue";
        var showName = "arr0[" + i + "].showName";
        that.setData({
          [showValue]: dateTimeArray[0][dateTime[0]].replace(/年/g, "") + "-" + dateTimeArray[1][dateTime[1]].replace(/月/g, "") + "-" + dateTimeArray[2][dateTime[2]].replace(/日/g, "") + " " +
            dateTimeArray[3][dateTime[3]].replace(/时/g, "") + ":" + dateTimeArray[4][dateTime[4]].replace(/分/g, ""),
          [showName]: dateTimeArray[0][dateTime[0]].replace(/年/g, "") + "-" + dateTimeArray[1][dateTime[1]].replace(/月/g, "") + "-" + dateTimeArray[2][dateTime[2]].replace(/日/g, "") + " " +
            dateTimeArray[3][dateTime[3]].replace(/时/g, "") + ":" + dateTimeArray[4][dateTime[4]].replace(/分/g, ""),
        });
      }
    }

  },

  loading: function () {
    wx.showToast({
      title: '加载中',
      icon: 'loading',
      duration: 10000
    })
  },

  onReady: function () {
    
  },
  //选择器更改showValue的值
  bindPickerChange: function (e) {
    var that=this;
    var labelPCName=e.currentTarget.dataset.labelpcname;
    var idx = e.currentTarget.dataset.idx;
    var array = this.data.arr;
    for (var i = 0; i < array.length; i++) {
      if (array[i].labelPCName == labelPCName) {
        var arr0=that.data.arr0
        var jihe={
          labelNme: array[i].labelName,          
          index: e.detail.value,
          showValue: array[i].pickValue[e.detail.value].id,
          showName: array[i].pickValue[e.detail.value].objname,
          labelPCName: array[i].labelPCName,
        }
        arr0[idx]=jihe
        that.setData({
          arr0:arr0
        })
      }
    }
    // this.yanzheng()
  },
  bindPickerChange2: function (e) {
    var that = this;
    var labelPCName = e.currentTarget.dataset.labelpcname;
    var idx = e.currentTarget.dataset.idx;
    var array = this.data.arr;
    for (var i = 0; i < array.length; i++) {
      if (array[i].labelPCName == labelPCName) {
        var arr0 = that.data.arr0
        var jihe = {
          labelNme: array[i].labelName,
          index: 1,
          showValue: e.detail.value,
          showName: e.detail.value,
          labelPCName: array[i].labelPCName,
        }
        arr0[idx] = jihe
        that.setData({
          arr0: arr0
        })
      }
    }
  },
  //修改input以及文本框中的内容
  inputChange: function (e) {
    var labelPCName = e.currentTarget.dataset.labelpcname;
    var array = this.data.arr;
    for (var i = 0; i < array.length; i++) {
      if (array[i].labelPCName == labelPCName) {
        array.forEach((item, index, arr) => {
          var showValue = "arr[" + i + "].showValue";
          this.setData({
              [showValue]: e.detail.value,
          })
        })
      }
    }
  },
  uploadpic: function (e) {
    var that = this//获取上下文
    var idx = e.currentTarget.dataset.idx;
    var array = this.data.arr;
    var upload_picture_list=[];
      
    //选择图片
    wx.chooseImage({
      count: 8, // 默认9，这里显示一次选择相册的图片数量 
      sizeType: ['original', 'compressed'],// 可以指定是原图还是压缩图，默认二者都有  
      sourceType: ['album', 'camera'],// 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {// 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片 
        var tempFiles = res.tempFiles
        //把选择的图片 添加到集合里
        for (var i in tempFiles) {
          // tempFiles[i]['upload_percent'] = 0
          // tempFiles[i]['path_server'] = ''
          upload_picture_list.push(tempFiles[i])
        }
        console.log(upload_picture_list)
        var oldPic = that.data.arr[idx].pickValue;
        console.log(oldPic)
        if(oldPic != null){
          upload_picture_list = oldPic.concat(upload_picture_list)
          console.log(upload_picture_list)
        }
        var pickValue = "arr[" + idx + "].pickValue";
        
        //显示
        that.setData({
          [pickValue]: upload_picture_list,
        })
        console.log(that.data.arr[idx].pickValue)
        if (that.data.arr[idx].pickValue.length>2){
          that.setData({
            display: "none",
          })
        }
      }
    })
  },
  //验证信息是否必填
  bitian() {
    var that=this;
    var arr = this.data.arr;
    for (var i = 0; i < arr.length; i++) {
      if (arr[i].controlType == "Lable" && arr[i].showType == "3" && arr[i].showValue == ""){
          wx.showToast({
            title: '请补全信息',
            icon: 'loading',
            duration: 2000,
            width: 2000,
          })
          this.setData({
            tijiao: "提交",
            color: "#1AAD19",
            disable:false
          })
          return 1;
        } else if (arr[i].controlType == "textArea" && arr[i].showType == "3" && arr[i].showValue == ""){
          wx.showToast({
            title: '请补全信息',
            icon: 'loading',
            duration: 2000,
            width: 2000,
          })
          this.setData({
            tijiao: "提交",
            color: "#1AAD19",
            disable: false
          })
          return 1;
        }
    }
  },
  tijiao: function () {

    this.setData({
      tijiao:"提交中...",
      disabled:true,
      color:"#ccc",
      disable:true
    })

    var that = this;
    var arr=that.data.arr;
    var arr0 = that.data.arr0;
    var workflowId = this.data.workflowId;
    var value=""
      value = "workflowid=" + workflowId + "&" +"src=submit";
    console.log(value)

    var tupian=this.data.tupian;
    if(tupian==false){
      for (var i2 = 0; i2 < arr.length; i2++) {
        if (arr[i2].controlType == "Select") {
          value = value + "&" + arr0[i2].labelPCName + "=" + arr0[i2].showValue
        } else if (arr[i2].controlType == "Lable" && arr[i2].fieldType == 4) {
          value = value + "&" + arr0[i2].labelPCName + "=" + arr0[i2].showValue
        } else if (arr[i2].controlType == "Lable" && arr[i2].fieldType == 5) {
          value = value + "&" + arr0[i2].labelPCName + "=" + arr0[i2].showValue
        } else if (arr[i2].controlType == "Lable" && arr[i2].fieldType == 6) {
          value = value + "&" + arr0[i2].labelPCName + "=" + arr0[i2].showValue
        }else {
          console.log(arr[i2].showValue)
          value = value + "&" + arr[i2].labelPCName + "=" + arr[i2].showValue
        }
      }
      if (that.bitian() == undefined) {
        var tokenId = wx.getStorageSync('tokenId');
        wx.request({
          url: app.globalData.ServerURL + '/mvc/wxHumresController/getHumresIdByTokenId?tokenId=' + tokenId,
          data: {
          },
          header: {
            'Content-type': 'application/x-www-form-urlencoded'
          },
          success: function (res) {
            var HumresId = res.data.data;
            value = value.replace(/年/g, "").replace(/月/g, "").replace(/日/g, "").replace(/时/g, "").replace(/分/g, "").replace(/秒/g, "") + "&sessionkey" + "=" + HumresId;
            wx.request({
              url: app.globalData.ServerURL + '/mvc/workFlowController/submitWorkFlow',
              data: {
                param: value,
              },
              method: 'POST',
              header: {
                'content-type': 'application/x-www-form-urlencoded'
              },
              success: function (res) {
                console.log(res)
                that.testSubmit2()
                wx.showToast({
                  title: '提交成功',
                  icon: 'sucess',
                  duration: 500,
                  width: 2000,
                })
                setTimeout(function () {
                  wx.switchTab({
                    url: '../index/index',
                  })
                }, 1000)
              }, fail(res) {
                console.log(res);
              }
            })
          },
          fail: function (msg) {
            console.log(msg);
          }
        })
      }
    }else{

      if(that.data.tupian2 == false){
        for(var i=0;i<arr.length;i++){
          if (arr[i].controlType == "Attach") {
            var upload_picture_list = arr[i].pickValue
            console.log(upload_picture_list)
            const idx=i;
            if (upload_picture_list !== null && upload_picture_list.length > 0) {
              for (var j in upload_picture_list) {
                  wx.uploadFile({
                    url: app.globalData.ServerURL + '/ServiceAction/com.tap.base.file.FileUploadAction?action=uploadFile',
                    filePath: upload_picture_list[j].path,
                    name: 'parkingPhoto',
                    success: function (res) {
                      var imgsHttp = that.data.imgsHttp;
                      // var showValue = "arr[" + idx + "].showValue";
                      imgsHttp.push(res.data)
                      that.setData({
                        imgsHttp: imgsHttp
                      })
                      if (upload_picture_list.length == imgsHttp.length) {
                        var showValue = "arr[" + idx + "].showValue";
                        that.setData({
                          tupian2: true,
                          [showValue]: imgsHttp
                        })
                        // value = value + "&" + arr[idx].labelPCName + "=" + arr[idx].showValue
                        for (var i2 = 0; i2 < arr.length; i2++) {
                          
                          if (arr[i2].controlType=="Select"){
                            value = value + "&" + arr0[i2].labelPCName + "=" + arr0[i2].showValue
                          }else if(arr[i2].controlType == "Lable" && arr[i2].fieldType == 4) {
                            value = value + "&" + arr0[i2].labelPCName + "=" + arr0[i2].showValue
                          }else if(arr[i2].controlType == "Lable" && arr[i2].fieldType == 5) {
                            value = value + "&" + arr0[i2].labelPCName + "=" + arr0[i2].showValue
                          }else if(arr[i2].controlType == "Lable" && arr[i2].fieldType == 6) {
                            value = value + "&" + arr0[i2].labelPCName + "=" + arr0[i2].showValue
                          }else{
                            console.log(arr[i2].showValue)
                            value = value + "&" + arr[i2].labelPCName + "=" + arr[i2].showValue
                          }
                        }
                          var tokenId = wx.getStorageSync('tokenId');
                          console.log(value)
                          if (that.bitian() == undefined) {
                            var tokenId = wx.getStorageSync('tokenId');
                            wx.request({
                              url: app.globalData.ServerURL + '/mvc/wxHumresController/getHumresIdByTokenId?tokenId=' + tokenId,
                              data: {
                              },
                              header: {
                                'Content-type': 'application/x-www-form-urlencoded'
                              },
                              success: function (res) {
                                var HumresId = res.data.data;
                                value = value.replace(/年/g, "").replace(/月/g, "").replace(/日/g, "").replace(/时/g, "").replace(/分/g, "").replace(/秒/g, "") + "&sessionkey" + "=" + HumresId;
                                wx.request({
                                  url: app.globalData.ServerURL + '/mvc/workFlowController/submitWorkFlow',
                                  data: {
                                    param: value,
                                  },
                                  method: 'POST',
                                  header: {
                                    'content-type': 'application/x-www-form-urlencoded'
                                  },
                                  success: function (res) {
                                    console.log(res)
                                    that.testSubmit2()
                                    wx.showToast({
                                      title: '提交成功',
                                      icon: 'sucess',
                                      duration: 500,
                                      width: 2000,
                                    })
                                    setTimeout(function () {
                                      wx.switchTab({
                                        url: '../index/index',
                                      })
                                    }, 1000)
                                  }, fail(res) {
                                    console.log(res);
                                  }
                                })
                              },
                              fail: function (msg) {
                                console.log(msg);
                              }
                            })
                          }
                      }
                    },
                    fail(res) {
                      console.log(res);
                    }
                  })
                }
            }else{
              for (var i2 = 0; i2 < arr.length; i2++) {
                if (arr[i2].controlType == "Select") {
                  value = value + "&" + arr0[i2].labelPCName + "=" + arr0[i2].showValue
                } else if (arr[i2].controlType == "Lable" && arr[i2].fieldType == 4) {
                  value = value + "&" + arr0[i2].labelPCName + "=" + arr0[i2].showValue
                } else if (arr[i2].controlType == "Lable" && arr[i2].fieldType == 5) {
                  value = value + "&" + arr0[i2].labelPCName + "=" + arr0[i2].showValue
                } else if (arr[i2].controlType == "Lable" && arr[i2].fieldType == 6) {
                  value = value + "&" + arr0[i2].labelPCName + "=" + arr0[i2].showValue
                } else {
                  console.log(arr[i2].showValue)
                  value = value + "&" + arr[i2].labelPCName + "=" + arr[i2].showValue
                }
              }
              if (that.bitian() == undefined) {
                var tokenId = wx.getStorageSync('tokenId');
                wx.request({
                  url: app.globalData.ServerURL + '/mvc/wxHumresController/getHumresIdByTokenId?tokenId=' + tokenId,
                  data: {
                  },
                  header: {
                    'Content-type': 'application/x-www-form-urlencoded'
                  },
                  success: function (res) {
                    var HumresId = res.data.data;
                    value = value.replace(/年/g, "").replace(/月/g, "").replace(/日/g, "").replace(/时/g, "").replace(/分/g, "").replace(/秒/g, "") + "&sessionkey" + "=" + HumresId;
                    wx.request({
                      url: app.globalData.ServerURL + '/mvc/workFlowController/submitWorkFlow',
                      data: {
                        param: value,
                      },
                      method: 'POST',
                      header: {
                        'content-type': 'application/x-www-form-urlencoded'
                      },
                      success: function (res) {
                        console.log(res)
                        that.testSubmit2()
                        wx.showToast({
                          title: '提交成功',
                          icon: 'sucess',
                          duration: 500,
                          width: 2000,
                        })
                        setTimeout(function () {
                          wx.switchTab({
                            url: '../index/index',
                          })
                        }, 1000)
                      }, fail(res) {
                        console.log(res);
                      }
                    })
                  },
                  fail: function (msg) {
                    console.log(msg);
                  }
                })
              }
            }
          }
        }
      }else{
        for (var i2 = 0; i2 < arr.length; i2++) {
          if (arr[i2].controlType == "Select") {
            value = value + "&" + arr0[i2].labelPCName + "=" + arr0[i2].showValue
          } else if (arr[i2].controlType == "Lable" && arr[i2].fieldType == 4) {
            value = value + "&" + arr0[i2].labelPCName + "=" + arr0[i2].showValue
          } else if (arr[i2].controlType == "Lable" && arr[i2].fieldType == 5) {
            value = value + "&" + arr0[i2].labelPCName + "=" + arr0[i2].showValue
          } else if (arr[i2].controlType == "Lable" && arr[i2].fieldType == 6) {
            value = value + "&" + arr0[i2].labelPCName + "=" + arr0[i2].showValue
          } else {
            console.log(arr[i2].showValue)
            value = value + "&" + arr[i2].labelPCName + "=" + arr[i2].showValue
          }
        }
        if(that.bitian()==undefined){
          var tokenId = wx.getStorageSync('tokenId');
          wx.request({
            url: app.globalData.ServerURL + '/mvc/wxHumresController/getHumresIdByTokenId?tokenId=' + tokenId,
            data: {
            },
            header: {
              'Content-type': 'application/x-www-form-urlencoded'
            },
            success: function (res) {
              var HumresId = res.data.data;
              value = value.replace(/年/g, "").replace(/月/g, "").replace(/日/g, "").replace(/时/g, "").replace(/分/g, "").replace(/秒/g, "") + "&sessionkey" + "=" + HumresId;
              wx.request({
                url: app.globalData.ServerURL + '/mvc/workFlowController/submitWorkFlow',
                data: {
                  param: value,
                },
                method: 'POST',
                header: {
                  'content-type': 'application/x-www-form-urlencoded'
                },
                success: function (res) {
                  console.log(res)
                  that.testSubmit2()
                  wx.showToast({
                    title: '提交成功',
                    icon: 'sucess',
                    duration: 500,
                    width: 2000,
                  })
                  setTimeout(function () {
                    wx.switchTab({
                      url: '../index/index',
                    })
                  }, 1000)
                }, fail(res) {
                  console.log(res);
                }
              })
            },
            fail: function (msg) {
              console.log(msg);
            }
          })
        }
      }
  }
  },
  //模板推送信息发送
  // tuisong: function (formId, _access_token) {
  //   let url = 'https://api.weixin.qq.com/cgi-bin/message/wxopen/template/send?access_token=' + _access_token;
  //   let _jsonData = {
  //     access_token: _access_token,
  //     touser: 'odXXE5A1xvTs7s-NZjs84zqC1w9o',
  //     template_id: 'G8F4iVB6EkU5yODUjMLXImW7e_Yzh87_DQoTwQWpX6I',
  //     form_id: formId,
  //     page: "pages/mine/index",
  //     data: {
  //       "keyword1": { "value": "测试数据一", "color": "#173177" },
  //       "keyword2": { "value": "测试数据二", "color": "#173177" },
  //       "keyword3": { "value": "测试数据三", "color": "#173177" },
  //       "keyword4": { "value": "测试数据四", "color": "#173177" },
  //     }
  //   }
  //   wx.request({
  //     url: url,
  //     data: _jsonData,
  //     method: "POST",
  //     success: function (res) {
  //       console.log(res)
  //     },
  //     fail: function (err) {
  //       console.log('request fail ', err);
  //     },
  //     complete: function (res) {
  //       console.log("request completed!");
  //     }

  //   })
  // },
  // testSubmit: function (e) {
  //   this.setData({
  //     formId: e.detail.formId
  //   })
  //   console.log("forMId", e.detail.formId)
  //   // app.post('https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=wxd25a1a45a24719e4&secret=edf1bfcaac0eb1c95cb815d1093b98d2', 0).then((res) => {
  //   //   let _access_token = res.data.access_token;
  //   //   console.log(e.detail.formId)
  //   //   this.tuisong(e.detail.formId, _access_token)

  //   // }).catch((errMsg) => {
  //   //   console.log(errMsg);
  //   // });
  // },
  // testSubmit2: function (e) {
  //   console.log("testsubmit")
  //   var that=this;
  //   app.get('https://zhiyuan.eplus.org.cn/mvc/wechatUserController/getAccessToken').then((res) => {
  //     console.log(res)
  //     let _access_token = res.data.data;
  //     this.tuisong(that.data.formId, _access_token)

  //   }).catch((errMsg) => {
  //     console.log(errMsg);
  //   });
  // },

  testSubmit: function (e) {
    var that=this;
    this.setData({
      formId: e.detail.formId
    })

  },
  testSubmit2: function (e) {
    var formId = this.data.formId;
    var openId = wx.getStorageSync('openid');
    app.post(app.globalData.ServerURL + '/mvc/workFlowController/remindMessage?formId=' + formId + "&openId=" + openId,0).then((res) => {
      console.log(res)
    }).catch((errMsg) => {
      console.log(errMsg);
    });
  },
  
})
