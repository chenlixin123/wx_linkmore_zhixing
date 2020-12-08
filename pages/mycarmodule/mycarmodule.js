//获取应用实例
const app = getApp()
//引入network
import api from "../../utils/network.js"
import util from "../../utils/util.js"
Page({
  // mixins: [require('../../mixin/themeChanged')],
  /**
   * 页面的初始数据
   */
  data: {
    show: false,
    loading:false,
    loading_text:"",
    success_toast:false,
    success_text:'',
    data:'',
    floor:'',
    useUpLockTime:'',
    nopermission:'',
    nopermissions:'车位无法使用，请通过物业管理人员开启车位使用权限',
    src:'',
    lockStatus:'',//锁状态 1.升起  2.降下
    isAuthFlag:0,//显示授权 0.不显示  1.显示
    stallId:'',
    loading_display:true,
    setInterval:'',
    validity:'',//有效期
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    console.log(options)
    let that = this
    that.setData({
      stallId:options.stallId,
    })
    //  api.POST({
    //   url: app.url.long_carList2,
    //   params: {
    //     latitude: app.latitude,
    //     longitude: app.longitude
    //   },
    //   success(res) {
    //     if (res.data.status == true) {
    //       res.data.data.rentPres.map(res => {
    //         that.setData({
    //           preId: res.preId,
    //           pathFlag: res.pathFlag, 
    //           entranceFlag: res.entranceFlag,
    //           planeId: res.planeId
    //         })
    //         res.rentPreStalls.map(res => {
    //           if(res.stallId == that.data.stallId){
    //             that.setData({
    //               data:res,
    //               floor:res.underLayer.split('层')[0],
    //               useUpLockTime: res.useUpLockTime ? api.Time(res.useUpLockTime) : '无',
    //               loading_display:false
    //             })
    //             if (res.operateAuthFlag == 0) {
    //               that.setData({
    //                 nopermission: true
    //               })
    //             } else {
    //               that.setData({
    //                 nopermission: false
    //               })
    //             }
    //             if (res.userStatus == 1){
    //               wx.setNavigationBarTitle({
    //                 title: '我的车位'
    //               })
    //             }else{
    //               wx.setNavigationBarTitle({
    //                 title: '授权车位'
    //               })
    //             }
    //             that.setData({
    //               lockStatus: res.lockStatus,
    //               // isAuthFlag:res.isAuthFlag
    //             })
    //               if (res.lockStatus == 1) { //判断车锁状态 1升起 2降下
    //                 that.setData({
    //                   src: '../../assets/img/tupian@2x.png'
    //                 })
    //               } else {
    //                 that.setData({
    //                   src: '../../assets/img/car.png'
    //                 })
    //               }
    //           }
    //         })
    //       })
    //     }else{
    //       // console.log(res.data.message.content)
    //       wx.showToast({
    //         title: res.data.message.content,
    //       })
    //       that.setData({
    //         loading_display:false
    //       })
    //     }
    //   }
    // }, app.token)
  },
  /**
   * 生命周期函数--0
   */
  onReady: function () {

  },
  //渲染车场数据
  list(){
    let that = this
    that.setData({
      loading_display:true
    })
    api.POST({
      url: app.url.long_carList2,
      params: {
        latitude: app.latitude,
        longitude: app.longitude
      },
      success(res) {
        if (res.data.status == true) {
          res.data.data.rentPres.map(res => {
            that.setData({
              preId: res.preId,
              pathFlag: res.pathFlag, 
              entranceFlag: res.entranceFlag,
              planeId: res.planeId
            })
            res.rentPreStalls.map(res => {
              if(res.stallId == that.data.stallId){
                console.log(res)
                that.setData({
                  data:res,
                  floor:res.underLayer.split('层')[0],
                  useUpLockTime: res.useUpLockTime ? api.Time(res.useUpLockTime) : '无',
                  loading_display:false,
                  validity:api.Times(res.validity)
                })
                if (res.operateAuthFlag == 0) {
                  that.setData({
                    nopermission: true
                  })
                } else {
                  that.setData({
                    nopermission: false
                  })
                }
                if (res.userStatus == 1){
                  wx.setNavigationBarTitle({
                    title: '我的车位'
                  })
                }else{
                  wx.setNavigationBarTitle({
                    title: '授权车位'
                  })
                }
                that.setData({
                  lockStatus: res.lockStatus,
                  isAuthFlag:res.isAuthFlag
                })
                  if (res.lockStatus == 1) { //判断车锁状态 1升起 2降下
                    that.setData({
                      src: '../../assets/img/tupian@2x.png'
                    })
                  } else {
                    that.setData({
                      src: '../../assets/img/car.png'
                    })
                  }
              }
            })
          })
        }else{
          // console.log(res.data.message.content)
          that.setData({
            loading_display:false
          })
        }
      }
    }, app.token)
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let that = this
    that.list()
    that.setData({
      setInterval: setInterval(function () {
        if (app.token) {
          that.list()
        }
      }, 180000)
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    let that = this
    clearInterval(that.data.setInterval)
    console.log('onhide执行了')
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    let that = this
    clearInterval(that.data.setInterval)
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

  },
  //升锁
  top(){
    console.log('升锁')
    let that = this
    if (that.data.data.operateAuthFlag == 0){
        that.setData({
          nopermission:true
        })
        return
    }

    if (that.data.data.isSelfUser == 1){
      wx.showModal({
        content: '车位正在使用中,确认上方无车\r\n\r\n再升起地锁',
        confirmText: "升起", //默认是“确定”
        confirmColor: '#666', //确定文字的颜色
        cancelText: "取消", //默认是“取消”
        cancelColor: '#666', //取消文字的颜色
        success(res){
          if (res.cancel) {
            //点击取消
          } else if (res.confirm) {
            //点击确定
            if (that.data.self == true) {
              that.setData({
                loading: true,
                loading_text: "升锁中请稍候",
              })
              api.POST({
                url: app.url.long_controls, //1 降下地锁  2 升起地锁
                params: {
                  stallId: that.data.data.stallId,
                  state: 2,
                  parkingStatus: 0   //0未知 1到达 2未到达
                },
                success(res) {
                  console.log(res)
                  if (res.data.data == true) {
                    that.setData({
                      loading: false,
                    })
                    setTimeout(() => {
                      wx.showToast({
                        title: '车位锁升起成功',
                        icon: 'none'
                      })
                        that.setData({
                          lockStatus: 1,
                          src: '../../assets/img/tupian@2x.png',
                        })
                    }, 1000)
                    wx.setStorageSync('oo', false)
                  } else {
                    if (res.data.message != null) {
                        that.setData({
                          loading: 'none',
                          self: true
                        })
                        wx.showModal({
                          content: res.data.message.content,
                          showCancel: false,
                          confirmText: "确定", //默认是“确定”
                          confirmColor: '#666', //确定文字的颜色
                          success(res) {
                            if (res.confirm) {
                              console.log('666666666666666')
                            }
                          }
                        })
                    }
                  }
                },
                fail() {
                  setTimeout(() => {
                    wx.showToast({
                      title: '升锁超时，请重试',
                      icon: 'none'
                    })
                  }, 1000)
                  that.setData({
                    loading:false,
                  })
                },
              }, app.token)
            }
          }
        }
      })
  }else{
      that.setData({
        loading: true,
        loading_text: "升锁中请稍候",
      })
      api.POST({
        url: app.url.long_controls, //1 降下地锁  2 升起地锁
        params: {
          stallId: that.data.data.stallId,
          state: 2,
          parkingStatus: 0   //0未知 1到达 2未到达
        },
        success(res) {
          console.log(res)
          if (res.data.status == true) {
            that.setData({
              loading: false
            })

            setTimeout(() => {
              wx.showToast({
                title: '车位锁升起成功',
                icon: 'none'
              })
              that.setData({
                lockStatus: 1,
                src: '../../assets/img/tupian@2x.png'
              })
            }, 1000)
            wx.setStorageSync('oo', false)
          } else {
            if (res.data.message != null) {
                that.setData({
                  loading: false,
                })
                wx.showModal({
                  content: res.data.message.content,
                  showCancel: false,
                  confirmText: "确定", //默认是“确定”
                  confirmColor: '#666', //确定文字的颜色
                  success(res) {
                    if (res.confirm) {
                      console.log('666666666666666')
                    }
                  }
                })
            }
          }
        },
        fail() {
          setTimeout(() => {
            wx.showToast({
              title: '升锁超时，请重试',
              icon: 'none'
            })
          }, 1000)
          that.setData({
            loading: false,
          })
        },
      }, app.token)
  }
  },
  //降锁
  bottom(){
    console.log('降锁')
    let that = this
    if (that.data.data.operateAuthFlag == 0) {
      that.setData({
        nopermission: true
      })
      return
    }
    if (that.data.data.isSelfUser == 1) {
      wx.showModal({
        content: '车位正在使用中,确认上方无车\r\n\r\n再降下地锁',
        confirmText: "降下", //默认是“确定”
        confirmColor: '#666', //确定文字的颜色
        cancelText: "取消", //默认是“取消”
        cancelColor: '#666', //取消文字的颜色
        success(res) {
          if (res.cancel) {
            //点击取消
          } else if (res.confirm) {
            //点击确定
            that.setData({
              loading_text:'降锁中请稍候',
              loading:true
            })
            api.POST({
              url: app.url.long_controls, //1 降下地锁  2 升起地锁
              params: {
                stallId: that.data.data.stallId,
                state: 1,
                parkingStatus: 0   //0未知 1到达 2未到达
              },
              success(res) {
                console.log(res)
                if (res.data.data == true) {
                  setTimeout(() => {
                    wx.showToast({
                      title: '车位锁降下成功',
                      icon: 'none'
                    })
                    that.setData({
                      lockStatus: 2,
                      src: '../../assets/img/car.png'
                    })
                  }, 1000)
                  wx.setStorageSync('oo', true)
                  that.setData({
                    loading:false
                  })
                } else {
                  that.setData({
                    loading:false
                  })
                  if (res.data.message != null) {
                    wx.showModal({
                      content: res.data.message.content,
                      showCancel: false,
                      confirmText: "确定", //默认是“确定”
                      confirmColor: '#666', //确定文字的颜色
                      success(res) {
                        if (res.confirm) {
                          console.log('666666666666666')
                        }
                      }
                    })
                  }
                }

              },
              fail() {
                setTimeout(() => {
                  wx.showToast({
                    title: '降锁超时，请重试',
                    icon: 'none'
                  })
                }, 1000)
                that.setData({
                  loading: false,
                })
              },
            }, app.token)
          }
        }
        })
      
    }else{
      that.setData({
        loading_text:'降锁中请稍候',
        loading:true
      })
      api.POST({
        url: app.url.long_controls, //1 降下地锁  2 升起地锁
        params: {
          stallId: that.data.data.stallId,
          state: 1,
          parkingStatus: 0   //0未知 1到达 2未到达
        },
        success(res) {
          console.log(res)
          if (res.data.data == true) {
            setTimeout(() => {
              wx.showToast({
                title: '车位锁降下成功',
                icon: 'none'
              })
              that.setData({
                lockStatus: 2,
                src: '../../assets/img/car.png'
              })
            }, 1000)
            wx.setStorageSync('oo', true)
            that.setData({
              loading:false
            })
          } else {
            that.setData({
              loading: false
            })
            if (res.data.message != null) {
                wx.showModal({
                  content: res.data.message.content,
                  showCancel: false,
                  confirmText: "确定", //默认是“确定”
                  confirmColor: '#666', //确定文字的颜色
                  success(res) {
                    if (res.confirm) {
                      console.log('666666666666666')
                    }
                  }
                })
            }
          }

        },
        fail() {
          setTimeout(() => {
            wx.showToast({
              title: '降锁超时，请重试',
              icon: 'none'
            })
          }, 1000)
          that.setData({
            loading: false,
          })
        },
      }, app.token)
    }
  },
  //授权
  authorization(){
      //跳转授权页面
    console.log('跳转授权页面')
    let that = this
    wx.navigateTo({
      url: '/pages/confirmImpower/confirmImpower?data=' +  JSON.stringify(that.data.data)
    })
  },
  //故障报修
  fault(){
    let that = this
    wx.navigateTo({
      url: '/pages/malfunction/malfunction?stallId=' + that.data.data.stallId + '&val=' + that.data.data.stallName
    })
  },
  nopermissione(){
    let that = this
    that.setData({
      nopermission:false
    })
},
})