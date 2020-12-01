//index.js
//获取应用实例
const app = getApp()
//引入network 
import api from "../../utils/network.js"
import util from "../../utils/util.js"

Page({
  data: {
    tokens: '',
    error_text: '',
    nocarmodule: true,
    loading_display: false,
    show: false, //控制下拉列表的显示隐藏，false隐藏、true显示
    selectData: ['北京市', '杭州市', '承德市', '哈尔滨'], //下拉列表的数据
    index: 0, //选择的下拉列表下标
    my_data: [],

  },
  onShow() {
    console.log('onshow')
  },
  onHide() {

  },
  onLoad: function (options) {
    console.log('onload')
    // wx.showModal({
    //   title: '',
    //   content: options.name,
    //   showCancel: false, //是否显示取消按钮-----》false去掉取消按钮
    //   confirmText: "知道了", //默认是“确定”
    //   confirmColor: '#666', //确定文字的颜色
    // })
    let that = this;
    // wx.login({
    //   success: res => {
    //     app.code = res.code;
    //     // console.log(res)
    //     api.GET({
    //       url:app.url.vx_login + '?code=' + res.code + '&alias=1001',
    //       params: {},
    //       success:(res) => {
    //         console.log(res)
    //         if(res.data.status == false){
    //           return
    //         }
    //           that.setData({
    //             tokens: res.data.data.token
    //           });
    //           app.globalData = res.data.data;
    //           app.token = res.data.data.token;
    //           wx.setStorageSync('login-user', {
    //             data: res.data.data,
    //             time: new Date().getTime()
    //           })
    //       if (res.data.data == null || res.data.data.id == null) {
    //         that.setData({
    //           tokens: res.data.data.token
    //         });
    //         wx.navigateTo({
    //           url: '/pages/bindPhone/bind',
    //         })
    //         return
    //       }

    //       api.GET({
    //         url: app.url.choose_carModule, //判断是否为长租
    //         params: {},
    //         success(res) {
    //           console.log(res)
    //           if (res.data.status == true) {
    //             let parameter = res.data.data;
    //             if (parameter == false) {
    //               // wx.navigateTo({
    //               //   url: '/pages/noCarModule/noCarModule',
    //               // })
    //               that.setData({
    //                 nocarmodule:true,
    //                 loading_display:false
    //               });
    //             } else if (parameter == true) {
    //               wx.getLocation({
    //                 type: 'wgs84',
    //                 success (res) {
    //                   console.log(res)
    //                   const latitude = res.latitude
    //                   const longitude = res.longitude
    //                   const speed = res.speed
    //                   const accuracy = res.accuracy
    //                   api.POST({
    //                     url: app.url.long_carList2, //查看长租用户车位列表
    //                     params: {
    //                       latitude: latitude,
    //                       longitude: longitude
    //                     },
    //                     success(res) {
    //                       let data = []
    //                       res.data.data.rentPres.map(res => {
    //                           console.log(res.rentPreStalls)
    //                           res.rentPreStalls.map(reson => {
    //                             reson.validity = api.Times(reson.validity)
    //                             // console.log(api)
    //                             data.push(reson)
    //                           })
    //                       })
    //                       that.setData({
    //                         nocarmodule:false,
    //                         my_data:data,
    //                         loading_display:false
    //                       })
    //                     },
    //                     fail() {
    //                       wx.showToast({
    //                           title: '请求失败',
    //                           icon: 'none'
    //                         }),
    //                         that.setData({
    //                           loading: 'none'
    //                         })
    //                     },
    //                     complete() {
    //                       that.setData({
    //                         loading: 'none'
    //                       })
    //                     }
    //                   }, app.token)
    //                 },fail(e){
    //                       console.log(e)
    //                 }
    //                })

    //             }
    //           } else {
    //             that.setData({
    //               nocarmodule:true
    //             });
    //           }
    //         },
    //         fail() {
    //           wx.showToast({
    //               title: '请求失败',
    //               icon: 'none'
    //             }),
    //             that.setData({
    //               loading: 'none'
    //             })
    //         },
    //         complete() {
    //           that.setData({
    //             loading: 'none',
    //             loading_display:false
    //           })
    //         }

    //       }, app.token)
    //       }
    //     },app.token)
    //   }
    // });







    //扫车区或者车场码进入得逻辑
    // if (options.ssoo != undefined) {
    //   that.setData({
    //     fei: options.ssoo,
    //   })
    // }
    // that.setData({
    //   stallId: options.stallId,
    // })
    // let appTokenNew = wx.getStorageSync('login-user')
    // let q = decodeURIComponent(options.q)
    // let data = q
    // setTimeout(() => {
    //   let sear = wx.getStorageSync('oo')
    //   let sears = wx.getStorageSync('ooo')
    //   if (q != "undefined") {
    //     console.log("扫码进入");
    //     console.log(options, '我是扫码进来的数据')
    //     console.log(app.url.ress, 'app.url.ress')
    //     if (data.indexOf(app.url.ress) == -1) {
    //       wx.showToast({
    //         title: '请扫描正确的二维码',
    //         icon: 'none'
    //       })
    //       return
    //     }
    //     if (sears == true) {
    //       wx.showToast({
    //         title: '您正在使用预约车位，不可重复预约',
    //         icon: 'none'
    //       })
    //       return
    //     }
    //     if (options.currentBill == null || that.data.currentBill == null) {
    //       if (data.indexOf("?cityId") != -1 && data.indexOf("&prefectureId") != -1 && data.indexOf("&groupId") != -1) {
    //         // console.log('包含')
    //         let val = data.indexOf('?') + 1;
    //         let value = data.slice(val);
    //         console.log(String(value), '我是value')
    //         let values = value.split('&')
    //         console.log(values[1].split('=')[1])
    //         let prefectureId = values[1].split('=')[1]
    //         let groupId = values[2].split('=')[1]
    //         let obj = [];
    //         obj.push(prefectureId, groupId);
    //         if (app.globalData.id == null) {
    //           wx.setStorageSync('users', obj)
    //         }
    //         api.GET({
    //           url: app.url.group_strategy + '?groupId=' + groupId,
    //           success(res) {
    //             console.log(res)
    //             let title = ''
    //             if (res.data.status == false) {
    //               if (res.data.message.code == 8005095) {
    //                 title = res.data.message.content
    //               } else {
    //                 console.log(res.data.message.content)
    //               }
    //             }
    //             console.log(title)
    //             setTimeout(function () {
    //               if (appTokenNew == null || appTokenNew.data.id == null) {
    //                 wx.navigateTo({
    //                   url: '/pages/bindPhone/bind',
    //                 })
    //               } else if (title != '') {
    //                 wx.navigateTo({
    //                   url: '/pages/prohibit/prohibit?title=' + title,
    //                 })
    //               } else if (appTokenNew != '' || appTokenNew.data.id != null) {
    //                 wx.navigateTo({
    //                   url: '/pages/parklot/parklot?groupId=' + groupId + "&prefectureId=" + prefectureId + "&ordersource=" + 2,
    //                 })
    //               }
    //             }, 3000)
    //           }
    //         }, app.globalData.token)
    //       } else if (data.indexOf("?cityId") != -1 && data.indexOf("&prefectureId") != -1) {
    //         console.log("包含")
    //         let val = data.indexOf('?') + 1;
    //         let value = data.slice(val);
    //         console.log(String(value), '我是value')
    //         let values = value.split('&')
    //         console.log(values[1].split('=')[1])
    //         let prefectureId = values[1].split('=')[1]
    //         let cityId = values[0].split('=')[1]
    //         if (appTokenNew == null) {
    //           wx.navigateTo({
    //             url: '/pages/bindPhone/bind',
    //           })
    //         } else if (appTokenNew != null) {
    //           setTimeout(function () {
    //             wx.navigateTo({
    //               url: '/pages/carGroup/carGroup?id=' + prefectureId + '&cityId=' + cityId + '&latitude=' + that.data.location.latitude + '&longitude=' + that.data.location.longitude,
    //             })
    //           }, 3000)
    //         }
    //       }
    //     }
    //   }
    // }, 3000)
    // try {
    //   let loginUser = wx.getStorageSync('login-user')
    //   if (loginUser) {
    //     let time = new Date().getTime() - loginUser.time;
    //     if (time < 1000 * 60 * 60 * 24) {
    //       that.login(loginUser.data);
    //     }
    //   }
    // } catch (e) {}
  },
  // 我的车位点击
  mycar_tap() {
    console.log('点击了')
    wx.login({
      success: res => {
        console.log(res)
        app.code = res.code;
        wx.request({
          url: app.url.vx_login,
          data: {
            code: res.code,
            alias: '1001'
          },
          method: "GET",
          header: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "X-Access-Auth-Token": "",
            "os": "0"
          },
          success: function (res) {
            console.log(res)
            if (res.data.status) {
              app.token = res.data.data.token
            } else {
              that.setData({
                warnToast: true,
                error_text: res.data.message.content
              });
              setTimeout(() => {
                that.setData({
                  hidewarnToast: true
                });
                setTimeout(() => {
                  that.setData({
                    warnToast: false,
                    hidewarnToast: false,
                  });
                  return
                }, 300);
              }, 3000);
            }
            if (res.data.data == null || res.data.data.id == null) {
              wx.navigateTo({
                url: '/pages/bindPhone/bind',
              })
              return
            }
            if (res.data.data != '' || res.data.data.id != null) {
              api.GET({
                url: app.url.plate_list,
                params: {},
                success: function (res) {
                  console.log("成功", res)
                  if (res.data.data.length == 0) {
                    console.log("没有车牌")
                    wx.navigateTo({
                      url: '/pages/plateNumber/addPlate/addPlate',
                    })
                  } else {
                    console.log(app.state, "app.state")
                    wx.navigateTo({
                      url: '/pages/mycarmodule/mycarmodule',
                    })
                    // wx.redirectTo({
                    //   url: '/pages/home/home',
                    // })
                  }
                },
                fail: function () {
                  console.log("失败")
                }
              }, app.token)
              return
            }
          }
        })
      }
    })
  },
  //没有车位点击
  mycar_tap_nocarmodule() {
    let that = this
    wx.navigateTo({
      url: '/pages/noCarModule/noCarModule',
    })
    // that.setData({
    //   warnToast: true,
    //   error_text:"请添加车牌号"
    // });
    // setTimeout(() => {
    //   that.setData({
    //     hidewarnToast: true
    //   });
    //   setTimeout(() => {
    //     that.setData({
    //       warnToast: false,
    //       hidewarnToast: false,
    //     });
    //   }, 300);
    // }, 3000);
  },
  // 点击下拉显示框
  selectTap() {
    this.setData({
      show: !this.data.show
    });
  },
  // 点击下拉列表
  optionTap(e) {
    let Index = e.currentTarget.dataset.index; //获取点击的下拉列表的下标
    this.setData({
      index: Index,
      show: !this.data.show
    });
  },
})