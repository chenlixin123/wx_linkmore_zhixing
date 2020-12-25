//index.js
//获取应用实例
const app = getApp()
//引入network 
import api from "../../utils/network.js"
import util from "../../utils/util.js"

Page({
  data: {
    nocarmodule: true,
    loading_display: true,
    my_data: [],
    now_Time: '',
    getWeekDate: '',
    city_name: '',
    //天气
    condition: '',
    //天气图片
    conditionId: '',
    //温度
    temp: '',
    //PM2.5
    pm25: '',
    //限行车号
    limit: '',
    //提示语
    tips: '',
    //pm2.5提示语
    pm25_text: ''

  },
  onLoad: function (options) {
    // wx.showToast({
    //   title: '走了onload',
    // })
    if (!app.token) {
      let that = this;
      app.time = new Date().getTime() + 1800000
      // console.log(app.time)
      that.setData({
        loading_display: true
      });
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
              app.globalData = res.data.data;
              app.token = res.data.data.token;
              wx.setStorageSync('login-user', {
                data: res.data.data,
                time: new Date().getTime()
              })
              if (res.data.data == null || res.data.data.id == null) {
                app.login = false
                wx.getLocation({
                  type: 'wgs84',
                  success(res) {
                    // console.log(res)
                    const latitude = res.latitude
                    const longitude = res.longitude
                    app.latitude = res.latitude
                    app.longitude = res.longitude
                    that.setData({
                      loading_display: false,
                    })
                    //获取天气
                    api.GET({
                      url: app.url.citys_weather,
                      params: {
                        latitude: latitude ? latitude : '39.90469',
                        longitude: longitude ? longitude : '116.40717'
                      },
                      success(res) {
                        console.log(res)
                        let limits = res.data.data.limit
                        if (limits) {
                          limits.split()
                        }
                        app.condition = res.data.data.condition
                        app.conditionId = '../../assets/icon/' + res.data.data.conditionId + '.png'
                        app.temp = res.data.data.temp
                        app.pm25 = res.data.data.pm25
                        app.limit = limits
                        app.tips = res.data.data.tips ? res.data.data.tips.slice(0, res.data.data.tips.length - 1) : '较宜洗车'
                        that.setData({
                          loading_display: false,
                          condition: res.data.data.condition,
                          conditionId: '../../assets/icon/' + res.data.data.conditionId + '.png',
                          temp: res.data.data.temp,
                          pm25: res.data.data.pm25,
                          limit: limits,
                          tips: res.data.data.tips ? res.data.data.tips.slice(0, res.data.data.tips.length - 1) : '较宜洗车'
                        })
                        wx.navigateTo({
                          url: '/pages/bindPhone/bind',
                        })
                      }
                    }, app.token)
                  },
                  fail(e) {
                    // console.log(e)
                    app.latitude = '39.90469'
                    app.longitude = '116.40717'
                    let limits = '50'
                    limits.split()
                    that.setData({
                      loading_display: false,
                      city_name: '北京市 朝阳区',
                      condition: '晴',
                      conditionId: '../../assets/icon/W0.png',
                      temp: "3",
                      pm25: 78,
                      limit: limits,
                      tips: "较宜洗车"
                    })
                    app.condition = '晴'
                    app.conditionId = '../../assets/icon/W0.png'
                    app.temp = "3"
                    app.pm25 = 78,
                      app.limit = limits
                    app.tips = "较宜洗车"
                    wx.showModal({
                      title: '位置授权失败，会影响部分功能的使用，如需开启，请到设置里手动开启',
                      showCancel: false,
                      success:function(res){
                        console.log(res)
                        if(res.confirm){
                          wx.navigateTo({
                            url: '/pages/bindPhone/bind',
                          })
                        }
                      }
                    })
                  }
                })
                return
              }
              app.login = true
              api.GET({
                url: app.url.choose_user,
                success(res) {
                  if (res.data.data) {
                    app.mobile = res.data.data.mobile,
                      app.nickname = res.data.data.nickname ? res.data.data.nickname : '未设置'
                  } else {
                    app.nickname = '未设置'
                  }
                }
              }, app.token)
              api.GET({
                url: app.url.choose_carModule, //判断是否为长租
                params: {},
                success(res) {
                  // console.log(res)
                  if (res.data.status == true) {
                    let parameter = res.data.data;
                    if (parameter == false) {
                      that.setData({
                        nocarmodule: true,
                        loading_display: false
                      });
                      wx.getLocation({
                        type: 'wgs84',
                        success(res) {
                          // console.log(res)
                          const latitude = res.latitude
                          const longitude = res.longitude
                          app.latitude = res.latitude
                          app.longitude = res.longitude
                          const speed = res.speed
                          const accuracy = res.accuracy
                          wx.request({
                            url: 'https://apis.map.qq.com/ws/geocoder/v1/?key=NTUBZ-KDY3F-QAMJB-JEOXP-G2O36-J7FB5&location=' + latitude + ',' + longitude,
                            method: 'get',
                            success: (res) => {
                              // console.log(res.data)
                              let city = res.data.result.ad_info.city ? res.data.result.ad_info.city : '北京市'
                              let city_small_name = res.data.result.ad_info.district ? res.data.result.ad_info.district : '朝阳区'
                              that.setData({
                                city_name: city + ' ' + city_small_name
                              })
                            },

                            fail: () => {},

                            complete: () => {}
                          })
                          //获取天气
                          api.GET({
                            url: app.url.citys_weather,
                            params: {
                              latitude: latitude ? latitude : '39.90469',
                              longitude: longitude ? longitude : '116.40717'
                            },
                            success(res) {
                              console.log(res)
                              let limits = res.data.data.limit
                              if (limits) {
                                limits.split()
                              }
                              app.condition = res.data.data.condition
                              app.conditionId = '../../assets/icon/' + res.data.data.conditionId + '.png'
                              app.temp = res.data.data.temp
                              app.pm25 = res.data.data.pm25
                              app.limit = limits
                              app.tips = res.data.data.tips ? res.data.data.tips.slice(0, res.data.data.tips.length - 1) : '较宜洗车'
                              that.setData({
                                loading_display: false,
                                condition: res.data.data.condition,
                                conditionId: '../../assets/icon/' + res.data.data.conditionId + '.png',
                                temp: res.data.data.temp,
                                pm25: res.data.data.pm25,
                                limit: limits,
                                tips: res.data.data.tips ? res.data.data.tips.slice(0, res.data.data.tips.length - 1) : '较宜洗车'
                              })
                            }
                          }, app.token)
                        },
                        fail(e) {
                          // console.log(e)
                          app.latitude = '39.90469'
                          app.longitude = '116.40717'
                          let limits = '50'
                          limits.split()
                          that.setData({
                            loading_display: false,
                            city_name: '北京市 朝阳区',
                            condition: '晴',
                            conditionId: '../../assets/icon/W0.png',
                            temp: "3",
                            pm25: 78,
                            limit: limits,
                            tips: "较宜洗车"
                          })
                          app.condition = '晴'
                          app.conditionId = '../../assets/icon/W0.png'
                          app.temp = "3"
                          app.pm25 = 78,
                            app.limit = limits
                          app.tips = "较宜洗车"
                          wx.showModal({
                            title: '位置授权失败，会影响部分功能的使用，如需开启，请到设置里手动开启',
                            showCancel: false,
                          })
                        }
                      })
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
                          wx.request({
                            url: 'https://apis.map.qq.com/ws/geocoder/v1/?key=NTUBZ-KDY3F-QAMJB-JEOXP-G2O36-J7FB5&location=' + latitude + ',' + longitude,
                            method: 'get',
                            success: (res) => {
                              console.log(res.data)
                              let city = res.data.result.ad_info.city ? res.data.result.ad_info.city : '北京市'
                              let city_small_name = res.data.result.ad_info.district ? res.data.result.ad_info.district : '朝阳区'
                              that.setData({
                                city_name: city + ' ' + city_small_name
                              })
                            },

                            fail: () => {},

                            complete: () => {}
                          })
                          //获取天气
                          api.GET({
                            url: app.url.citys_weather,
                            params: {
                              latitude: latitude ? latitude : '39.90469',
                              longitude: longitude ? longitude : '116.40717'
                            },
                            success(res) {
                              console.log(res)
                              let limits = res.data.data.limit
                              if (limits) {
                                limits.split()
                              }
                              app.condition = res.data.data.condition
                              app.conditionId = '../../assets/icon/' + res.data.data.conditionId + '.png'
                              app.temp = res.data.data.temp
                              app.pm25 = res.data.data.pm25
                              app.limit = limits
                              app.tips = res.data.data.tips ? res.data.data.tips.slice(0, res.data.data.tips.length - 1) : '较宜洗车'
                              that.setData({
                                loading_display: false,
                                condition: res.data.data.condition,
                                conditionId: '../../assets/icon/' + res.data.data.conditionId + '.png',
                                temp: res.data.data.temp,
                                pm25: res.data.data.pm25,
                                limit: limits,
                                tips: res.data.data.tips ? res.data.data.tips.slice(0, res.data.data.tips.length - 1) : '较宜洗车'
                              })
                            }
                          }, app.token)
                          api.POST({
                            url: app.url.long_carList2, //查看长租用户车位列表
                            params: {
                              latitude: latitude ? latitude : '39.90469',
                              longitude: longitude ? longitude : '116.40717'
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
                                  loading_display: false
                                })
                            },
                          }, app.token)
                        },
                        fail(e) {
                          // console.log(e)
                          app.latitude = '39.90469'
                          app.longitude = '116.40717'
                          let limits = '50'
                          limits.split()
                          that.setData({
                            loading_display: false,
                            city_name: '北京市 朝阳区',
                            condition: '晴',
                            conditionId: '../../assets/icon/W0.png',
                            temp: "3",
                            pm25: 78,
                            pm25_text: '',
                            limit: limits,
                            tips: "较宜洗车"
                          })
                          app.condition = '晴'
                          app.conditionId = '../../assets/icon/W0.png'
                          app.temp = "3"
                          app.pm25 = 78,
                            app.limit = limits
                          app.tips = "较宜洗车"
                          api.POST({
                            url: app.url.long_carList2, //查看长租用户车位列表
                            params: {
                              latitude: '39.90469',
                              longitude: '116.40717'
                            },
                            success(res) {
                              let data = []
                              res.data.data.rentPres.map(res => {
                                res.rentPreStalls.map(reson => {
                                  reson.validity = api.Times(reson.validity)
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
                          }, app.token)
                          wx.showModal({
                            title: '位置授权失败，会影响部分功能的使用，如需开启，请到设置里手动开启',
                            showCancel: false,
                          })
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
                      loading_display: false
                    })
                }

              }, app.token)
            },
            fail(err) {
              console.log(err)
              that.setData({
                loading_display: false
              })
            }
          }, app.token)
        }
      });
    }
  },
  onShow() {
    let that = this
    function getWeekDate() {
      var now = new Date();
      var day = now.getDay();
      var weeks = new Array("星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六");
      var week = weeks[day];
      return week;
    }
    that.setData({
      now_Time: api.now_Time(),
      getWeekDate: getWeekDate(),
    })
    if (app.token) {
      console.log(app.time)
      let nowtime = new Date().getTime()
      if(app.time){
        if(app.time < nowtime){
          app.time = new Date().getTime() + 1800000
          wx.getLocation({
            type: 'wgs84',
            success(res) {
              const latitude = res.latitude
              const longitude = res.longitude
              app.latitude = res.latitude
              app.longitude = res.longitude
              wx.request({
                url: 'https://apis.map.qq.com/ws/geocoder/v1/?key=NTUBZ-KDY3F-QAMJB-JEOXP-G2O36-J7FB5&location=' + latitude + ',' + longitude,
                method: 'get',
                success: (res) => {
                  let city = res.data.result.ad_info.city ? res.data.result.ad_info.city : '北京市'
                  let city_small_name = res.data.result.ad_info.district ? res.data.result.ad_info.district : '朝阳区'
                  that.setData({
                    city_name: city + ' ' + city_small_name
                  })
                },

                fail: () => {},

                complete: () => {}
              })
              //获取天气
              api.GET({
                url: app.url.citys_weather,
                params: {
                  latitude: latitude ? latitude : '39.90469',
                  longitude: longitude ? longitude : '116.40717'
                },
                success(res) {
                  console.log(res)
                  let limits = res.data.data.limit
                  if (limits) {
                    limits.split()
                  }
                  app.condition = res.data.data.condition
                  app.conditionId = '../../assets/icon/' + res.data.data.conditionId + '.png'
                  app.temp = res.data.data.temp
                  app.pm25 = res.data.data.pm25
                  app.limit = limits
                  app.tips = res.data.data.tips ? res.data.data.tips.slice(0, res.data.data.tips.length - 1) : '较宜洗车'
                  that.setData({
                    loading_display: false,
                    condition: res.data.data.condition,
                    conditionId: '../../assets/icon/' + res.data.data.conditionId + '.png',
                    temp: res.data.data.temp,
                    pm25: res.data.data.pm25,
                    limit: limits,
                    tips: res.data.data.tips ? res.data.data.tips.slice(0, res.data.data.tips.length - 1) : '较宜洗车'
                  })
                }
              }, app.token)
            },
            fail(e) {
              app.latitude = '39.90469'
              app.longitude = '116.40717'
              let limits = '50'
              limits.split()
              that.setData({
                loading_display: false,
                city_name: '北京市 朝阳区',
                condition: '晴',
                conditionId: '../../assets/icon/W0.png',
                temp: "3",
                pm25: 78,
                limit: limits,
                tips: "较宜洗车"
              })
              app.condition = '晴'
              app.conditionId = '../../assets/icon/W0.png'
              app.temp = "3"
              app.pm25 = 78,
                app.limit = limits
              app.tips = "较宜洗车"
            }
          })
        }
      }else{
        app.time = new Date().getTime() + 1800000
      }
      that.setData({
        condition: app.condition,
        conditionId: app.conditionId,
        temp: app.temp,
        pm25: app.pm25,
        limit: app.limit,
        tips: app.tips
      })
      console.log('onshow')
      api.GET({
        url: app.url.choose_user,
        success(res) {
          console.log(res)
          if (res.data.data) {
            app.mobile = res.data.data.mobile,
              app.nickname = res.data.data.nickname ? res.data.data.nickname : '未设置'
          } else {
            app.nickname = '未设置'
          }
        }
      }, app.token)
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
                  wx.request({
                    url: 'https://apis.map.qq.com/ws/geocoder/v1/?key=NTUBZ-KDY3F-QAMJB-JEOXP-G2O36-J7FB5&location=' + latitude + ',' + longitude,
                    method: 'get',
                    success: (res) => {
                      let city = res.data.result.ad_info.city ? res.data.result.ad_info.city : '北京市'
                      let city_small_name = res.data.result.ad_info.district ? res.data.result.ad_info.district : '朝阳区'
                      console.log(city, city_small_name)
                      that.setData({
                        city_name: city + ' ' + city_small_name
                      })
                      console.log(that.data.city_name)
                    },

                    fail: () => {},

                    complete: () => {}
                  })
                  api.POST({
                    url: app.url.long_carList2, //查看长租用户车位列表
                    params: {
                      latitude: latitude ? latitude : '39.90469',
                      longitude: longitude ? longitude : '116.40717'
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
                    complete() {}
                  }, app.token)
                },
                fail(e) {
                  console.log(e)
                  app.latitude = '39.90469'
                  app.longitude = '116.40717'
                  that.setData({
                    loading_display: false
                  })
                  api.POST({
                    url: app.url.long_carList2, //查看长租用户车位列表
                    params: {
                      latitude: '39.90469',
                      longitude: '116.40717'
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
                    complete() {}
                  }, app.token)
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
              loading_display: false
            })
        },
        complete() {}

      }, app.token)
    }
  },
  onHide() {

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
    if (app.login == false) {
      wx.navigateTo({
        url: '/pages/bindPhone/bind',
      })
      return
    }
    wx.navigateTo({
      url: '/pages/noCarModule/noCarModule',
    })
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    let that = this
    that.setData({
      loading_display: true
    })
    api.GET({
      url: app.url.choose_carModule, //判断是否为长租
      params: {},
      success(res) {
        // console.log(res)
        if (res.data.status == true) {
          let parameter = res.data.data;
          if (parameter == false) {
            that.setData({
              nocarmodule: true,
              loading_display: false
            });
            wx.getLocation({
              type: 'wgs84',
              success(res) {
                // console.log(res)
                const latitude = res.latitude
                const longitude = res.longitude
                app.latitude = res.latitude
                app.longitude = res.longitude
                wx.request({
                  url: 'https://apis.map.qq.com/ws/geocoder/v1/?key=NTUBZ-KDY3F-QAMJB-JEOXP-G2O36-J7FB5&location=' + latitude + ',' + longitude,
                  method: 'get',
                  success: (res) => {
                    // console.log(res.data)
                    let city = res.data.result.ad_info.city ? res.data.result.ad_info.city : '北京市'
                    let city_small_name = res.data.result.ad_info.district ? res.data.result.ad_info.district : '朝阳区'
                    that.setData({
                      city_name: city + ' ' + city_small_name
                    })
                  },

                  fail: () => {},

                  complete: () => {}
                })
                //获取天气
                api.GET({
                  url: app.url.citys_weather,
                  params: {
                    latitude: latitude ? latitude : '39.90469',
                    longitude: longitude ? longitude : '116.40717'
                  },
                  success(res) {
                    console.log(res)
                    let limits = res.data.data.limit
                    if (limits) {
                      limits.split()
                    }
                    app.condition = res.data.data.condition
                    app.conditionId = '../../assets/icon/' + res.data.data.conditionId + '.png'
                    app.temp = res.data.data.temp
                    app.pm25 = res.data.data.pm25
                    app.limit = limits
                    app.tips = res.data.data.tips ? res.data.data.tips.slice(0, res.data.data.tips.length - 1) : '较宜洗车'
                    that.setData({
                      loading_display: false,
                      condition: res.data.data.condition,
                      conditionId: '../../assets/icon/' + res.data.data.conditionId + '.png',
                      temp: res.data.data.temp,
                      pm25: res.data.data.pm25,
                      limit: limits,
                      tips: res.data.data.tips ? res.data.data.tips.slice(0, res.data.data.tips.length - 1) : '较宜洗车'
                    })
                    wx.stopPullDownRefresh()
                  }
                }, app.token)
              },
              fail(e) {
                // console.log(e)
                app.latitude = '39.90469'
                app.longitude = '116.40717'
                let limits = '50'
                limits.split()
                that.setData({
                  loading_display: false,
                  city_name: '北京市 朝阳区',
                  condition: '晴',
                  conditionId: '../../assets/icon/W0.png',
                  temp: "3",
                  pm25: 78,
                  pm25_text: '',
                  limit: limits,
                  tips: "较宜洗车"
                })
                app.condition = '晴'
                app.conditionId = '../../assets/icon/W0.png'
                app.temp = "3"
                app.pm25 = 78,
                  app.limit = limits
                app.tips = "较宜洗车"
                wx.stopPullDownRefresh()
              }
            })
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
                wx.request({
                  url: 'https://apis.map.qq.com/ws/geocoder/v1/?key=NTUBZ-KDY3F-QAMJB-JEOXP-G2O36-J7FB5&location=' + latitude + ',' + longitude,
                  method: 'get',
                  success: (res) => {
                    console.log(res.data)
                    let city = res.data.result.ad_info.city ? res.data.result.ad_info.city : '北京市'
                    let city_small_name = res.data.result.ad_info.district ? res.data.result.ad_info.district : '朝阳区'
                    that.setData({
                      city_name: city + ' ' + city_small_name
                    })
                  },

                  fail: () => {},

                  complete: () => {}
                })
                //获取天气
                api.GET({
                  url: app.url.citys_weather,
                  params: {
                    latitude: latitude ? latitude : '39.90469',
                    longitude: longitude ? longitude : '116.40717'
                  },
                  success(res) {
                    console.log(res)
                    let limits = res.data.data.limit
                    if (limits) {
                      limits.split()
                    }
                    app.condition = res.data.data.condition
                    app.conditionId = '../../assets/icon/' + res.data.data.conditionId + '.png'
                    app.temp = res.data.data.temp
                    app.pm25 = res.data.data.pm25
                    app.limit = limits
                    app.tips = res.data.data.tips ? res.data.data.tips.slice(0, res.data.data.tips.length - 1) : '较宜洗车'
                    that.setData({
                      loading_display: false,
                      condition: res.data.data.condition,
                      conditionId: '../../assets/icon/' + res.data.data.conditionId + '.png',
                      temp: res.data.data.temp,
                      pm25: res.data.data.pm25,
                      limit: limits,
                      tips: res.data.data.tips ? res.data.data.tips.slice(0, res.data.data.tips.length - 1) : '较宜洗车'
                    })
                    wx.stopPullDownRefresh()
                  }
                }, app.token)
                api.POST({
                  url: app.url.long_carList2, //查看长租用户车位列表
                  params: {
                    latitude: latitude ? latitude : '39.90469',
                    longitude: longitude ? longitude : '116.40717'
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
                    wx.stopPullDownRefresh()
                  },
                  fail() {
                    wx.stopPullDownRefresh()
                    wx.showToast({
                        title: '请求失败',
                        icon: 'none'
                      }),
                      that.setData({
                        loading_display: false
                      })
                  },
                }, app.token)
              },
              fail(e) {
                // console.log(e)
                app.latitude = '39.90469'
                app.longitude = '116.40717'
                let limits = '50'
                limits.split()
                that.setData({
                  loading_display: false,
                  city_name: '北京市 朝阳区',
                  condition: '晴',
                  conditionId: '../../assets/icon/W0.png',
                  temp: "3",
                  pm25: 78,
                  pm25_text: '',
                  limit: limits,
                  tips: "较宜洗车"
                })
                app.condition = '晴'
                app.conditionId = '../../assets/icon/W0.png'
                app.temp = "3"
                app.pm25 = 78,
                  app.limit = limits
                app.tips = "较宜洗车"
                api.POST({
                  url: app.url.long_carList2, //查看长租用户车位列表
                  params: {
                    latitude: '39.90469',
                    longitude: '116.40717'
                  },
                  success(res) {
                    let data = []
                    res.data.data.rentPres.map(res => {
                      res.rentPreStalls.map(reson => {
                        reson.validity = api.Times(reson.validity)
                        data.push(reson)
                      })
                    })
                    that.setData({
                      nocarmodule: false,
                      my_data: data,
                      loading_display: false
                    })
                    wx.stopPullDownRefresh()
                  },
                  fail() {
                    wx.showToast({
                        title: '请求失败',
                        icon: 'none'
                      }),
                      that.setData({
                        loading_display: false
                      })
                    wx.stopPullDownRefresh()
                  },
                }, app.token)
              }
            })

          }
        } else {
          that.setData({
            nocarmodule: true
          });
          wx.stopPullDownRefresh()
        }
      },
      fail() {
        wx.showToast({
            title: '请求失败',
            icon: 'none'
          }),
          that.setData({
            loading_display: false
          })
        wx.stopPullDownRefresh()
      }

    }, app.token)
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    // console.log('上拉了')
    wx.showToast({
      title: '上拉了'
    })
  },
})