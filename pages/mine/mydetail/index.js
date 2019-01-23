// pages/index.js
const app = getApp()
var dateTimePicker = require('../../../utils/dateTimePicker.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    quanxian: false,
    quanxian4:true,
    tijiao: "提交",
    tuihui:"退回",
    disabled:false,
    arr:[],
    arr0:[],
    tupian2:[],
    tupian:false,
    tupian3:false,
    remark:"",
    zhuanfa: "转发"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.loading();
    var obj = dateTimePicker.dateTimePicker(2000, 2050);
    var lastArray = obj.dateTimeArray.pop();
    var lastTime = obj.dateTime.pop();

    var that = this;

    var workflowId = options.wfid;
    var wfid=options.wfid;
    var comp = options.comp;
    this.setData({
      comp: comp,
      workflowId: workflowId
    });
    if (comp == 9) {
      wx.setNavigationBarTitle({
        title: '发起待续'
      })
    } else if (comp == 1) {
      wx.setNavigationBarTitle({
        title: '待办事项'
      })
    } else if (comp == 8) {
      wx.setNavigationBarTitle({
        title: '已办事项'
      })
    } else if (comp == 7) {
      wx.setNavigationBarTitle({
        title: '办结事项'
      })
    } else if (comp == 14) {
      wx.setNavigationBarTitle({
        title: '流程退回'
      })
    } else if (comp == 11) {
      wx.setNavigationBarTitle({
        title: '发起已结束'
      })
      that.setData({
        quanxian4:false,
      });
    }
    console.log(wfid);
    var tokenId = wx.getStorageSync('tokenId');
    wx.request({
      url: app.globalData.ServerURL + '/mvc/workFlowController/getRejectNodeInfo?requestId=' + wfid,
      data: {

      },
      header: {
        'Content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        console.log("res",res.data.data);
        that.setData({
          thRange: res.data.data,
          thIndex:0,
          thValue: res.data.data[0].id
        });
      },
      fail: function (msg) {
        console.log(msg);
      }
    })
    wx.request({
      url: app.globalData.ServerURL + '/mvc/workFlowController/getNodeIdByWorkFlowRequestId?requestId=' + wfid,
      data: {

      },
      header: {
        'Content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        console.log("nodeid", res.data.data);
        that.setData({
          nodeid: res.data.data
        });
      },
      fail: function (msg) {
        console.log(msg);
      }
    })
    wx.request({
      url: app.globalData.ServerURL + '/mvc/workFlowController/getWeChatWorkFlowLayout?requestId=' + wfid + '&tokenId=' + tokenId,
      data: {

      },
      header: {
        'Content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        console.log(res.data.data)
        var qianzhui = res.data.data[0].labelPCName.split('__')[0];
        that.setData({
          qianzhui:qianzhui,
          id: res.data.data[0].id
        });
        for(var i=0;i<res.data.data.length;i++){
          if (res.data.data[i].controlType == "Attach" && res.data.data[i].showType == "1"){
            var tupian = res.data.data[i].showValue.split(",")
            var tupian2=[];
            for(var j=0;j<tupian.length;j++){
              tupian2[j] = app.globalData.ServerURL + '/ServiceAction/com.tap.document.file.FileDownload?attachid=' + tupian[j]
            }
            that.setData({
              tupian2: tupian2
            });
          } else if (res.data.data[i].controlType == "Select") {
            var arr0 = that.data.arr0;
            var jihe = {
              labelNme: res.data.data[i].labelName,
              index: res.data.data[i].value,
              showValue: res.data.data[i].pickValue[2].id,
              showName: res.data.data[i].pickValue[2].objname,
              labelPCName: res.data.data[i].labelPCName,
            }
            arr0[i] = jihe
            that.setData({
              arr0: arr0
            })
            if (res.data.data[i].pickValue[0].ismulti == "0") {
              res.data.data[i].pickValue = res.data.data[i].pickValue.slice(1)
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
              dateTimeArray: obj.dateTimeArray,
            }
            arr0[i] = jihe
            that.setData({
              arr0: arr0
            })
          }
        }
        if (res.data.status==true){
          that.setData({
            arr: res.data.data
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
    //流转意见
    wx.request({
      url: app.globalData.ServerURL + '/mvc/workFlowController/getWorkFlowRequestStepInfo?workFlowId=' + wfid,
      data: {

      },
      header: {
        'Content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        that.setData({
          info2: res.data.data,
          len: res.data.data.length
        })
        //在查看待办事项时
        if (comp == "1" && res.data.data.length==1){
          that.setData({
            quanxian2: true
          })
          wx.request({
            url: app.globalData.ServerURL + '/mvc/wxHumresController/getHumresInfo?stationId=4029bcd860c04abc0160c0acd099013b',//服务器的地址，现在微信小程序只支持https请求，所以调试的时候请勾选不校监安全域名
            data: {

            },
            header: {
              'Content-type': 'application/x-www-form-urlencoded'
            },
            success: function (res) {
              console.log(res.data.data)
              app.globalData.stationName = res.data.data
              that.setData({
                array: res.data.data,
              })
            },
            fail: function (msg) {
              console.log(msg)
            },
            complete: function () {
              wx.hideToast();
            }
          })
          that.setData({
            quanxian: true
          })
        } else if (comp == "1" && res.data.data.length == 2){
          that.setData({
            quanxian:true,
            quanxian3: true
          })
          wx.request({
            url: app.globalData.ServerURL + '/mvc/wechatAppBaseController/selectItemById?itemId=4029bcd85cc4cee2015cc8a440970113',//服务器的地址，现在微信小程序只支持https请求，所以调试的时候请勾选不校监安全域名
            data: {

            },
            header: {
              'Content-type': 'application/x-www-form-urlencoded'
            },
            success: function (res) {
              console.log(res.data.data);
              app.globalData.itemName = res.data.data;
              that.setData({
                array2: res.data.data,
              })
            },
            fail: function (msg) {
              console.log(msg)
            },
            complete: function () {
              wx.hideToast();
            }
          })
        } else if (comp == "1") {
          that.setData({
            quanxian: true,
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
  inputChange: function (e) {
    console.log(e.detail.value)
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
  inputChange2: function (e) {
    this.setData({
      remark: e.detail.value
    })
  },
  changeDateTimeColumn(e) {
    var arr0 = this.data.arr0;
    var arr = this.data.arr;
    var labelPCName = e.currentTarget.dataset.labelpcname;
    var that = this;
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
  changeDateTimeColumn2(e) {
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
  bindPickerChange: function (e) {
    var that = this;
    var labelPCName = e.currentTarget.dataset.labelpcname;
    var idx = e.currentTarget.dataset.idx;
    console.log(idx)
    var array = this.data.arr;
    for (var i = 0; i < array.length; i++) {
      if (array[i].labelPCName == labelPCName) {
        var arr0 = that.data.arr0
        var jihe = {
          labelNme: array[i].labelName,
          index: e.detail.value,
          showValue: array[i].pickValue[e.detail.value].id,
          showName: array[i].pickValue[e.detail.value].objname,
          labelPCName: array[i].labelPCName,
        }
        arr0[idx] = jihe
        that.setData({
          arr0: arr0
        })
      }
    }
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

  bindPickerChange4: function (e) {
    var index= e.detail.value
    console.log(this.data.thRange[index].id)
    this.setData({
      thIndex: index,
      thValue: this.data.thRange[index].id
    })
    
  },
  bindPickerChange5: function (e) {
    var index = e.detail.value
    this.setData({
      thIndex2: index,
      thValue2: this.data.thRange2[index].id
    })

  },
  uploadpic: function (e) {
    var that = this//获取上下文
    var idx = e.currentTarget.dataset.idx;
    var array = this.data.arr;
    var upload_picture_list = [];

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
        if (oldPic != null) {
          upload_picture_list = oldPic.concat(upload_picture_list)
          console.log(upload_picture_list)
        }
        var pickValue = "arr[" + idx + "].pickValue";

        //显示
        that.setData({
          [pickValue]: upload_picture_list,
        })
        console.log(that.data.arr[idx].pickValue)
        if (that.data.arr[idx].pickValue.length > 2) {
          that.setData({
            display: "none",
          })
        }
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
    var that=this;
    wx.request({
      url: app.globalData.ServerURL + '/mvc/wxHumresController/getHumresInfo',
      data: {

      },
      header: {
        'Content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        console.log("res",res.data.data);
        that.setData({
          thRange2: res.data.data,
          thIndex2: 0,
          thValue2: res.data.data[0].id
        });
      },
      fail: function (msg) {
        console.log(msg);
      }
    })
  },
  imgYu: function (event) {
    var src = event.currentTarget.dataset.src;//获取data-src
    var imgList = event.currentTarget.dataset.list;//获取data-list
    //图片预览
    wx.previewImage({
      current: src, // 当前显示图片的http链接
      urls: imgList // 需要预览的图片http链接列表
    })
  },
  tongyi: function(event){
    this.setData({
      disable: true,
      color:"#ccc",
      tijiao:"提交中..."
    })

    var that = this;
    var arr = that.data.arr;
    var arr0 = that.data.arr0;
    var workflowId = this.data.workflowId;
    var remark=this.data.remark;
    var qianzhui = this.data.qianzhui + "__requestid=" + workflowId + "&requestid=" + this.data.workflowId
    var id = this.data.qianzhui +"__id="+this.data.id;
    console.log(id);
    var value = "workflowid=" + workflowId + "&" + "src=submit&userSignRemark=" + remark + "&" + qianzhui + "&"+id;


    var tupian = this.data.tupian;
    if (tupian == false) {
      for (var i2 = 0; i2 < arr.length; i2++) {
        if (arr[i2].controlType == "Select" && arr[i2].showType != "1") {
          console.log(i2)
          console.log(arr0)

          // console.log(arr0[12])
          value = value + "&" + arr0[i2].labelPCName + "=" + arr0[i2].showValue
        } else if (arr[i2].controlType == "Lable" && arr[i2].fieldType == 4 && arr[i2].showType != "1") {
          value = value + "&" + arr0[i2].labelPCName + "=" + arr0[i2].showValue
        } else if (arr[i2].controlType == "Lable" && arr[i2].fieldType == 5 && arr[i2].showType != "1") {
          value = value + "&" + arr0[i2].labelPCName + "=" + arr0[i2].showValue
        } else if (arr[i2].controlType == "Lable" && arr[i2].fieldType == 6 && arr[i2].showType != "1") {
          value = value + "&" + arr0[i2].labelPCName + "=" + arr0[i2].showValue
        } else {
          value = value + "&" + arr[i2].labelPCName + "=" + arr[i2].showValue
        }
      }
       if (that.bitian2() == undefined) {
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
            value = value.replace(/年/g, "").replace(/月/g, "").replace(/日/g, "").replace(/时/g, "").replace(/分/g, "").replace(/秒/g, "") +  "&sessionkey" + "=" + HumresId;
            console.log(value)
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
                wx.showToast({
                  title: '提交成功',
                  icon: 'sucess',
                  duration: 500,
                  width: 2000,
                })
                setTimeout(function () {
                  wx.switchTab({
                    url: '../../mine/index',
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
    } else {
      if (that.data.tupian3 == false) {
      for (var i = 0; i < arr.length; i++) {
        if (arr[i].controlType == "Attach") {
          var upload_picture_list = arr[i].pickValue
          const idx = i;
          if (upload_picture_list.length > 0) {
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
                      tupian3: true,
                      [showValue]: imgsHttp
                    })
                    // value = value + "&" + arr[idx].labelPCName + "=" + arr[idx].showValue
                    for (var i2 = 0; i2 < arr.length; i2++) {
                      if (arr[i2].controlType == "Select" && arr[i2].showType != "1") {
                        value = value + "&" + arr0[i2].labelPCName + "=" + arr0[i2].showValue
                      } else if (arr[i2].controlType == "Lable" && arr[i2].fieldType == 4 && arr[i2].showType != "1") {
                        value = value + "&" + arr0[i2].labelPCName + "=" + arr0[i2].showValue
                      } else if (arr[i2].controlType == "Lable" && arr[i2].fieldType == 5 && arr[i2].showType != "1") {
                        value = value + "&" + arr0[i2].labelPCName + "=" + arr0[i2].showValue
                      } else if (arr[i2].controlType == "Lable" && arr[i2].fieldType == 6 && arr[i2].showType != "1") {
                        value = value + "&" + arr0[i2].labelPCName + "=" + arr0[i2].showValue
                      } else {
                        console.log(arr[i2].showValue)
                        value = value + "&" + arr[i2].labelPCName + "=" + arr[i2].showValue
                      }
                    }
                    if (that.bitian2() == undefined) {
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
                              wx.showToast({
                                title: '提交成功',
                                icon: 'sucess',
                                duration: 500,
                                width: 2000,
                              })
                              setTimeout(function () {
                                wx.switchTab({
                                  url: '../../mine/index',
                                })
                              }, 1000)
                            }, fail(res) {
                              console.log(res);
                            }
                          })
                        },
                        fail: function (msg) {
                          console.log(msg);
                          wx.showToast({
                            title: '提交失败',
                            icon: 'loading',
                            duration: 500,
                            width: 2000,
                          })
                          setTimeout(function () {
                            wx.switchTab({
                              url: '../../mine/index',
                            })
                          }, 1000)
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
          }
        }
      }
    }else{
        for (var i2 = 0; i2 < arr.length; i2++) {
          if (arr[i2].controlType == "Select" && arr[i2].showType != "1") {
            value = value + "&" + arr0[i2].labelPCName + "=" + arr0[i2].showValue
          } else if (arr[i2].controlType == "Lable" && arr[i2].fieldType == 4 && arr[i2].showType != "1") {
            value = value + "&" + arr0[i2].labelPCName + "=" + arr0[i2].showValue
          } else if (arr[i2].controlType == "Lable" && arr[i2].fieldType == 5 && arr[i2].showType != "1") {
            value = value + "&" + arr0[i2].labelPCName + "=" + arr0[i2].showValue
          } else if (arr[i2].controlType == "Lable" && arr[i2].fieldType == 6 && arr[i2].showType != "1") {
            value = value + "&" + arr0[i2].labelPCName + "=" + arr0[i2].showValue
          } else {
            console.log(arr[i2].showValue)
            value = value + "&" + arr[i2].labelPCName + "=" + arr[i2].showValue
          }
        }
        if (that.bitian2() == undefined) {
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
                  wx.showToast({
                    title: '提交成功',
                    icon: 'sucess',
                    duration: 500,
                    width: 2000,
                  })
                  setTimeout(function () {
                    wx.switchTab({
                      url: '../../mine/index',
                    })
                  }, 1000)
                }, fail(res) {
                  console.log(res);
                }
              })
            },
            fail: function (msg) {
              console.log(msg);
              wx.showToast({
                title: '提交失败',
                icon: 'loading',
                duration: 500,
                width: 2000,
              })
              setTimeout(function () {
                wx.switchTab({
                  url: '../../mine/index',
                })
              }, 1000)
            }
          })
        }
    }
    }

  },
  tuihui: function (event) {
    this.setData({
      disable: true,
      color2: "#ccc",
      tuihui: "正在退回"
    })
    var that = this;
    var arr = that.data.arr;
    var arr0 = that.data.arr0;
    var workflowId = this.data.workflowId;
    var remark = this.data.remark;
    var nodeid=this.data.nodeid;
    var qianzhui = this.data.qianzhui + "__requestid=" + workflowId + "&requestid=" + this.data.workflowId + "&" + this.data.qianzhui + "__nodeid="+nodeid;
    var thValue = that.data.thValue;

    var value = "workflowid=" + workflowId + "&" + "src=reject&userSignRemark=" + remark + "&" + qianzhui + "&rejectnodeid=" + thValue;


    var tupian = this.data.tupian;
    if (tupian == false) {
      for (var i2 = 0; i2 < arr.length; i2++) {
        for (var i2 = 0; i2 < arr.length; i2++) {
          if (arr[i2].controlType == "Select" && arr[i2].showType != "1") {
            value = value + "&" + arr0[i2].labelPCName + "=" + arr0[i2].showValue
          } else if (arr[i2].controlType == "Lable" && arr[i2].fieldType == 4 && arr[i2].showType != "1") {
            value = value + "&" + arr0[i2].labelPCName + "=" + arr0[i2].showValue
          } else if (arr[i2].controlType == "Lable" && arr[i2].fieldType == 5 && arr[i2].showType != "1") {
            value = value + "&" + arr0[i2].labelPCName + "=" + arr0[i2].showValue
          } else if (arr[i2].controlType == "Lable" && arr[i2].fieldType == 6 && arr[i2].showType != "1") {
            value = value + "&" + arr0[i2].labelPCName + "=" + arr0[i2].showValue
          } else {
            console.log(arr[i2].showValue)
            value = value + "&" + arr[i2].labelPCName + "=" + arr[i2].showValue
          }
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
            console.log(value)
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
                wx.showToast({
                  title: '退回成功',
                  icon: 'sucess',
                  duration: 500,
                  width: 2000,
                })
                setTimeout(function () {
                  wx.switchTab({
                    url: '../../mine/index',
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
    } else {
      if (that.data.tupian3 == false) {
      for (var i = 0; i < arr.length; i++) {
        if (arr[i].controlType == "Attach") {
          var upload_picture_list = arr[i].pickValue
          const idx = i;
          if (upload_picture_list.length > 0) {
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
                      tupian3: true,
                      [showValue]: imgsHttp
                    })
                    // value = value + "&" + arr[idx].labelPCName + "=" + arr[idx].showValue
                    for (var i2 = 0; i2 < arr.length; i2++) {
                      if (arr[i2].controlType == "Select" && arr[i2].showType != "1") {
                        value = value + "&" + arr0[i2].labelPCName + "=" + arr0[i2].showValue
                      } else if (arr[i2].controlType == "Lable" && arr[i2].fieldType == 4 && arr[i2].showType != "1") {
                        value = value + "&" + arr0[i2].labelPCName + "=" + arr0[i2].showValue
                      } else if (arr[i2].controlType == "Lable" && arr[i2].fieldType == 5 && arr[i2].showType != "1") {
                        value = value + "&" + arr0[i2].labelPCName + "=" + arr0[i2].showValue
                      } else if (arr[i2].controlType == "Lable" && arr[i2].fieldType == 6 && arr[i2].showType != "1") {
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
                          value = value.replace(/年/g, "").replace(/月/g, "").replace(/日/g, "").replace(/时/g, "").replace(/分/g, "").replace(/秒/g, "") +  "&sessionkey" + "=" + HumresId;

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
                              wx.showToast({
                                title: '退回成功',
                                icon: 'sucess',
                                duration: 500,
                                width: 2000,
                              })
                              setTimeout(function () {
                                wx.switchTab({
                                  url: '../../mine/index',
                                })
                              }, 1000)
                            }, fail(res) {
                              console.log(res);
                            }
                          })
                        },
                        fail: function (msg) {
                          console.log(msg);
                          wx.showToast({
                            title: '退回失败',
                            icon: 'loading',
                            duration: 500,
                            width: 2000,
                          })
                          setTimeout(function () {
                            wx.switchTab({
                              url: '../../mine/index',
                            })
                          }, 1000)
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
          }
        }
      }
      }else{
        for (var i2 = 0; i2 < arr.length; i2++) {
          if (arr[i2].controlType == "Select" && arr[i2].showType != "1") {
            value = value + "&" + arr0[i2].labelPCName + "=" + arr0[i2].showValue
          } else if (arr[i2].controlType == "Lable" && arr[i2].fieldType == 4 && arr[i2].showType != "1") {
            value = value + "&" + arr0[i2].labelPCName + "=" + arr0[i2].showValue
          } else if (arr[i2].controlType == "Lable" && arr[i2].fieldType == 5 && arr[i2].showType != "1") {
            value = value + "&" + arr0[i2].labelPCName + "=" + arr0[i2].showValue
          } else if (arr[i2].controlType == "Lable" && arr[i2].fieldType == 6 && arr[i2].showType != "1") {
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
                  wx.showToast({
                    title: '退回成功',
                    icon: 'sucess',
                    duration: 500,
                    width: 2000,
                  })
                  setTimeout(function () {
                    wx.switchTab({
                      url: '../../mine/index',
                    })
                  }, 1000)
                }, fail(res) {
                  console.log(res);
                  wx.showToast({
                    title: '退回失败',
                    icon: 'loading',
                    duration: 500,
                    width: 2000,
                  })
                  setTimeout(function () {
                    wx.switchTab({
                      url: '../../mine/index',
                    })
                  }, 1000)
                }
              })
            },
            fail: function (msg) {
              console.log(msg);
              wx.showToast({
                title: '退回失败',
                icon: 'loading',
                duration: 500,
                width: 2000,
              })
              setTimeout(function () {
                wx.switchTab({
                  url: '../../mine/index',
                })
              }, 1000)
            }
          })
        }
      }
    }

  },
  zhuanfa() {
    this.setData({
      disable: true,
      color3: "#ccc",
      zhuanfa: "正在转发"
    })
    var that = this;
    var arr = that.data.arr;
    var arr0 = that.data.arr0;
    var workflowId = this.data.workflowId;
    var remark = this.data.remark;
    var nodeid = this.data.nodeid;
    var qianzhui = this.data.qianzhui + "__requestid=" + workflowId + "&requestid=" + this.data.workflowId + "&" + this.data.qianzhui + "__nodeid=" + nodeid;
    var thValue2 = that.data.thValue2;

    var value = "workflowid=" + workflowId + "&" + "src=forward&userSignRemark=" + remark + "&" + qianzhui + "&forwardresourceids=" + thValue2;
    var tupian = this.data.tupian;
    if (tupian == false) {
      for (var i2 = 0; i2 < arr.length; i2++) {
        for (var i2 = 0; i2 < arr.length; i2++) {
          if (arr[i2].controlType == "Select" && arr[i2].showType != "1") {
            value = value + "&" + arr0[i2].labelPCName + "=" + arr0[i2].showValue
          } else if (arr[i2].controlType == "Lable" && arr[i2].fieldType == 4 && arr[i2].showType != "1") {
            value = value + "&" + arr0[i2].labelPCName + "=" + arr0[i2].showValue
          } else if (arr[i2].controlType == "Lable" && arr[i2].fieldType == 5 && arr[i2].showType != "1") {
            value = value + "&" + arr0[i2].labelPCName + "=" + arr0[i2].showValue
          } else if (arr[i2].controlType == "Lable" && arr[i2].fieldType == 6 && arr[i2].showType != "1") {
            value = value + "&" + arr0[i2].labelPCName + "=" + arr0[i2].showValue
          } else {
            console.log(arr[i2].showValue)
            value = value + "&" + arr[i2].labelPCName + "=" + arr[i2].showValue
          }
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
            console.log(value)
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
                wx.showToast({
                  title: '转发成功',
                  icon: 'sucess',
                  duration: 500,
                  width: 2000,
                })
                setTimeout(function () {
                  wx.switchTab({
                    url: '../../mine/index',
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
    } else {
      if (that.data.tupian3 == false) {
        for (var i = 0; i < arr.length; i++) {
          if (arr[i].controlType == "Attach") {
            var upload_picture_list = arr[i].pickValue
            const idx = i;
            if (upload_picture_list.length > 0) {
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
                        tupian3: true,
                        [showValue]: imgsHttp
                      })
                      // value = value + "&" + arr[idx].labelPCName + "=" + arr[idx].showValue
                      for (var i2 = 0; i2 < arr.length; i2++) {
                        if (arr[i2].controlType == "Select" && arr[i2].showType != "1") {
                          value = value + "&" + arr0[i2].labelPCName + "=" + arr0[i2].showValue
                        } else if (arr[i2].controlType == "Lable" && arr[i2].fieldType == 4 && arr[i2].showType != "1") {
                          value = value + "&" + arr0[i2].labelPCName + "=" + arr0[i2].showValue
                        } else if (arr[i2].controlType == "Lable" && arr[i2].fieldType == 5 && arr[i2].showType != "1") {
                          value = value + "&" + arr0[i2].labelPCName + "=" + arr0[i2].showValue
                        } else if (arr[i2].controlType == "Lable" && arr[i2].fieldType == 6 && arr[i2].showType != "1") {
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
                                wx.showToast({
                                  title: '转发成功',
                                  icon: 'sucess',
                                  duration: 500,
                                  width: 2000,
                                })
                                setTimeout(function () {
                                  wx.switchTab({
                                    url: '../../mine/index',
                                  })
                                }, 1000)
                              }, fail(res) {
                                console.log(res);
                              }
                            })
                          },
                          fail: function (msg) {
                            console.log(msg);
                            wx.showToast({
                              title: '转发失败',
                              icon: 'loading',
                              duration: 500,
                              width: 2000,
                            })
                            setTimeout(function () {
                              wx.switchTab({
                                url: '../../mine/index',
                              })
                            }, 1000)
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
            }
          }
        }
      } else {
        for (var i2 = 0; i2 < arr.length; i2++) {
          if (arr[i2].controlType == "Select" && arr[i2].showType != "1") {
            value = value + "&" + arr0[i2].labelPCName + "=" + arr0[i2].showValue
          } else if (arr[i2].controlType == "Lable" && arr[i2].fieldType == 4 && arr[i2].showType != "1") {
            value = value + "&" + arr0[i2].labelPCName + "=" + arr0[i2].showValue
          } else if (arr[i2].controlType == "Lable" && arr[i2].fieldType == 5 && arr[i2].showType != "1") {
            value = value + "&" + arr0[i2].labelPCName + "=" + arr0[i2].showValue
          } else if (arr[i2].controlType == "Lable" && arr[i2].fieldType == 6 && arr[i2].showType != "1") {
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
              value = value.replace(/年/g, "").replace(/月/g, "").replace(/日/g, "").replace(/时/g, "").replace(/分/g, "").replace(/秒/g, "")  + "&sessionkey" + "=" + HumresId;

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
                  wx.showToast({
                    title: '转发成功',
                    icon: 'sucess',
                    duration: 500,
                    width: 2000,
                  })
                  setTimeout(function () {
                    wx.switchTab({
                      url: '../../mine/index',
                    })
                  }, 1000)
                }, fail(res) {
                  console.log(res);
                  wx.showToast({
                    title: '转发失败',
                    icon: 'loading',
                    duration: 500,
                    width: 2000,
                  })
                  setTimeout(function () {
                    wx.switchTab({
                      url: '../../mine/index',
                    })
                  }, 1000)
                }
              })
            },
            fail: function (msg) {
              console.log(msg);
              wx.showToast({
                title: '转发失败',
                icon: 'loading',
                duration: 500,
                width: 2000,
              })
              setTimeout(function () {
                wx.switchTab({
                  url: '../../mine/index',
                })
              }, 1000)
            }
          })
        }
      }
    }
  },
  //验证信息是否必填
  bitian() {
    var remark=this.data.remark;
    if(remark.length==0){
      wx.showToast({
        title: '请补充签字意见',
        icon: 'loading',
        duration: 2000,
        width: 2000,
      })
      this.setData({
        tijiao: "提交",
        zhuanfa:"转发",
        tuihui:"退回",
        color: "#1f80c6",
        color2:"#fff",
        color3: "#fff",
        disable: false
      })
      return 1;
    }
    var that = this;
    var arr = this.data.arr;
    for (var i = 0; i < arr.length; i++) {
      if (arr[i].controlType == "Lable" && arr[i].showType == "3" && arr[i].showValue == "") {
        wx.showToast({
          title: '请补全信息',
          icon: 'loading',
          duration: 2000,
          width: 2000,
        })
        this.setData({
          tijiao: "提交",
          zhuanfa: "转发",
          tuihui: "退回",
          color: "#1f80c6",
          color2: "#fff",
          color3: "#fff",
          disable: false
        })
        return 1;
      } else if (arr[i].controlType == "textArea" && arr[i].showType == "3" && arr[i].showValue == "") {
        wx.showToast({
          title: '请补全信息',
          icon: 'loading',
          duration: 2000,
          width: 2000,
        })
        this.setData({
          tijiao: "提交",
          zhuanfa: "转发",
          tuihui: "退回",
          color: "#1f80c6",
          color2: "#fff",
          color3: "#fff",
          disable: false
        })
        return 1;
      }
    }
  },
  bitian2() {
    var that = this;
    var arr = this.data.arr;
    for (var i = 0; i < arr.length; i++) {
      if (arr[i].controlType == "Lable" && arr[i].showType == "3" && arr[i].showValue == "") {
        wx.showToast({
          title: '请补全信息',
          icon: 'loading',
          duration: 2000,
          width: 2000,
        })
        this.setData({
          tijiao: "提交",
          zhuanfa: "转发",
          tuihui: "退回",
          color: "#1f80c6",
          color2: "#fff",
          color3: "#fff",
          disable: false
        })
        return 1;
      } else if (arr[i].controlType == "textArea" && arr[i].showType == "3" && arr[i].showValue == "") {
        wx.showToast({
          title: '请补全信息',
          icon: 'loading',
          duration: 2000,
          width: 2000,
        })
        this.setData({
          tijiao: "提交",
          zhuanfa: "转发",
          tuihui: "退回",
          color: "#1f80c6",
          color2: "#fff",
          color3: "#fff",
          disable: false
        })
        return 1;
      }
    }
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