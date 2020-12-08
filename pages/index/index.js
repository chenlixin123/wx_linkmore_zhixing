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
    loading_display: true,
    show: false, //控制下拉列表的显示隐藏，false隐藏、true显示
    selectData: ['北京市', '杭州市', '承德市', '哈尔滨'], //下拉列表的数据
    index: 0, //选择的下拉列表下标
    my_data: [],

  },
  onShow() {
    if(app.token){
      let that = this
      that.setData({
        loading_display: true
      });
      console.log('onshow')
      api.GET({
        url: app.url.choose_carModule, //判断是否为长租
        params: {},
        success(res) {
          console.log(res)
          if (res.data.status == true) {
            let parameter = res.data.data;
            if (parameter == false) {
              that.setData({
                nocarmodule: true,
                loading_display: false
              });
              console.log('没有长租车位')
            } else if (parameter == true) {
              console.log('有长租车位')
              wx.getLocation({
                type: 'wgs84',
                success(res) {
                  console.log(res)
                  const latitude = res.latitude
                  const longitude = res.longitude
                  app.latitude = res.latitude
                  app.longitude = res.longitude
                  const speed = res.speed
                  const accuracy = res.accuracy
                  api.POST({
                    url: app.url.long_carList2, //查看长租用户车位列表
                    params: {
                      latitude: latitude,
                      longitude: longitude
                    },
                    success(res) {
                      console.log(res)
                      let data = []
                      res.data.data.rentPres.map(res => {
                        res.rentPreStalls.map(reson => {
                          reson.validity = api.Times(reson.validity)
                          // console.log(api)
                          data.push(reson)
                        })
                      })
                      that.setData({
                        nocarmodule: false,
                        my_data: data,
                        loading_display: false
                      })
                    },
                    fail() {
                      wx.showToast({
                          title: '请求失败',
                          icon: 'none'
                        }),
                        that.setData({
                          loading_display: false
                        })
                    },
                    complete() {
                    }
                  }, app.token)
                },
                fail(e) {
                  console.log(e)
                }
              })
  
            }
          } else {
            that.setData({
              nocarmodule: true
            });
          }
        },
        fail() {
          wx.showToast({
              title: '请求失败',
              icon: 'none'
            }),
            that.setData({
              loading_display:false
            })
        },
        complete() {
        }
  
      }, app.token)
    }
  },
  onHide() {

  },
  onLoad: function (options) {
    if(!app.token){
      console.log('onload')
      // wx.showModal({
      //   title: '',
      //   content: options.name,
      //   showCancel: false, //是否显示取消按钮-----》false去掉取消按钮
      //   confirmText: "知道了", //默认是“确定”
      //   confirmColor: '#666', //确定文字的颜色
      // })
      let that = this;
      wx.login({
        success: res => {
          app.code = res.code;
          // console.log(res)
          api.GET({
            url: app.url.vx_login + '?code=' + res.code + '&alias=1001',
            params: {},
            success: (res) => {
              console.log(res)
              if (res.data.status == false) {
                return
              }
              app.mobile = res.data.data.mobile
              that.setData({
                tokens: res.data.data.token
              });
              app.globalData = res.data.data;
              app.token = res.data.data.token;
              wx.setStorageSync('login-user', {
                data: res.data.data,
                time: new Date().getTime()
              })
              if (res.data.data == null || res.data.data.id == null) {
                that.setData({
                  tokens: res.data.data.token
                });
                wx.navigateTo({
                  url: '/pages/bindPhone/bind',
                })
                return
              }
  
              api.GET({
                url: app.url.choose_carModule, //判断是否为长租
                params: {},
                success(res) {
                  console.log(res)
                  if (res.data.status == true) {
                    let parameter = res.data.data;
                    if (parameter == false) {
                      that.setData({
                        nocarmodule: true,
                        loading_display: false
                      });
                      console.log('没有长租车位')
                    } else if (parameter == true) {
                      console.log('有长租车位')
                      wx.getLocation({
                        type: 'wgs84',
                        success(res) {
                          console.log(res)
                          const latitude = res.latitude
                          const longitude = res.longitude
                          app.latitude = res.latitude
                          app.longitude = res.longitude
                          const speed = res.speed
                          const accuracy = res.accuracy
                          api.POST({
                            url: app.url.long_carList2, //查看长租用户车位列表
                            params: {
                              latitude: latitude,
                              longitude: longitude
                            },
                            success(res) {
                              let data = []
                              res.data.data.rentPres.map(res => {
                                res.rentPreStalls.map(reson => {
                                  reson.validity = api.Times(reson.validity)
                                  // console.log(api)
                                  data.push(reson)
                                })
                              })
                              that.setData({
                                nocarmodule: false,
                                my_data: data,
                                loading_display: false
                              })
                            },
                            fail() {
                              wx.showToast({
                                  title: '请求失败',
                                  icon: 'none'
                                }),
                                that.setData({
                                  loading_display:false
                                })
                            },
                            complete() {
                              that.setData({
                                loading_display:false
                              })
                            }
                          }, app.token)
                        },
                        fail(e) {
                          console.log(e)
                        }
                      })
  
                    }
                  } else {
                    that.setData({
                      nocarmodule: true
                    });
                  }
                },
                fail() {
                  wx.showToast({
                      title: '请求失败',
                      icon: 'none'
                    }),
                    that.setData({
                      loading_display:false
                    })
                }
  
              }, app.token)
            },
            fail(err) {
              console.log(err)
            }
          }, app.token)
        }
      });
    }
  },
  //进入个人中心
  to_user() {
    wx.navigateTo({
      url: '/pages/personal_center/personal_center',
    })
  },
  // 我的车位点击
  mycar_tap(e) {
    let data = e.currentTarget.dataset.datas
    wx.navigateTo({
      url: '/pages/mycarmodule/mycarmodule?stallId=' + data.stallId,
    })
  },
  //没有车位点击
  mycar_tap_nocarmodule() {
    let that = this
    wx.navigateTo({
      url: '/pages/noCarModule/noCarModule',
    })
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