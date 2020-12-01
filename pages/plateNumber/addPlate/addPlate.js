import api from "../../../utils/network.js"
import util from "../../../utils/util.js"
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    keyWord: false,
    eightWord: false,
    carPlete: ["京", "津", "冀", "晋", "蒙", "辽", "吉", "黑", "沪",
      "苏", "浙", "皖", "闽", "赣", "鲁", "豫", "鄂", "湘", "粤",
      "桂", "琼", "渝", "川", "贵", "云", "藏", "陕", "甘", "青",
      "宁", "新", "使"
    ], //中文键盘key
    descWord: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0",
      "A", "B", "C", "D", "E", "F", "G", "H", "J", "K", "L",
      "M", "N", "P", "Q", "R", "S", "T", "U", "V", "W", "X",
      "Y", "Z", "领", "警", "学", "使", "港", "澳"
    ], //中文键盘key
    zhData: [],
    zhDatas: [],
    CanNum: 7,
    types: "",
    numes: "",
    preId: "",
    distance: "",
    statues: "",
    preIds: "",
    nums: "",
    txt: "",
    data: "",
    num: '',
    //本地经纬度
    location: {
      longitude: "116.41361",
      latitude: "39.91106"
    },
    preName: '',
    val: '',
    stallEndTime: '',
    plate: '',
    stallId: '',
    battery: '',
    gatewayStatus: '',
    carlist: [],
    obj: '',
    longitude: "116.41361",
    latitude: "39.91106",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options, "==========================")
    let self = this;
    api.GET({
      url: app.url.plate_list, //车牌列表
      params: {},
      success(res) {
        console.log(res, "kKKKKKKKKKKKKKKKKK")
        let plateList = res.data.data;
        self.setData({
          carlist: plateList,
        })
      },
    }, app.globalData.token)
    if (options.type) {
      this.setData({
        types: options.type,
        nums: options.nums,
        txt: options.txt,
      })
    } else {
      this.setData({
        types: 1,
        nums: options.nums,
        txt: options.txt
      })
    }
    this.setData({
      num: options.num
    })
    this.data.preId = app.preId
    this.data.distance = app.distance
    console.log(this.data.preId, "21321312312")
  },
  //调取车牌区域软键盘
  plateZh() {
    let btns = this.data.carPlete;
    this.setData({
      keyBtn: btns,
      keyWord: true
    })
  },
  //调取车牌号软键盘
  inMsg() {
    let btns = this.data.descWord;
    this.setData({
      keyBtn: btns,
      keyWord: true
    })
  },

  //键盘删除
  keyDel() {
    let zhData = this.data.zhData;
    zhData.pop();
    this.setData({
      zhData: zhData
    })
  },
  //键盘确定
  keyTrue() {
    this.setData({
      keyWord: false
    })
  },
  //输入
  inPleteNumber(e) {
    console.log(e.currentTarget.dataset.key);
    let zh = e.currentTarget.dataset.key;
    let zhData = this.data.zhData;
    let keword1 = this.data.carPlete;
    let keword2 = this.data.descWord;
    if (zhData.length == 0) {
      this.setData({
        inpStyle: "border: 1px solid #f66913",
        keyBtn: keword2
      })
    }
    //可输车牌号数量
    let CanNum = this.data.CanNum;
    if (zhData.length < CanNum) {
      zhData.push(zh);
      this.setData({
        zhData: zhData
      })
    }
  },

  //是否启用8位车牌
  changeNum() {
    if (this.data.CanNum == 7) {
      this.setData({
        CanNum: 8
      })
    } else {
      this.setData({
        CanNum: 7
      })
    }
  },
  //提交车牌
  addPlete() {
    let self = this;
    let that = this
    let nums = this.data.zhData;
    let list = []
    console.log(self.data.carlist)
    console.log(nums)
    nums = nums.toString().replace(/,/g, '');
    console.log(nums)
    if (nums == "") {
      wx.showToast({
        title: '请输入正确的车牌号',
        icon: 'none'
      })
      //return false;
    }
    wx.getStorage({
      key: 'abc',
      success: function (res) {
        console.log(res.data, "KKKKKKKK")
        self.setData({
          obj: res.data
        })
      },
    })
    if (self.data.obj != "") {
      wx.navigateTo({
        url: '/pages/parklot/parklot?groupId=' + self.data.obj.groupId + "&prefectureId=" + self.data.obj.prefectureId + "&ordersource=" + 2,
      })
      console.log(self.data.obj, "PPPPPPPPPPPPPPPPP")
      wx.removeStorage({
        key: 'abc'
      })
    }
    self.data.carlist.map((res) => {
      console.log(res, 'ppppppppppppppppppppp' + self.data.zhData)
      if (res.vehMark == nums) {
        list.push(res.vehMark)
        console.log(list, "LLLLAAAAAAAAAAAAAAAAAAAAAAAAAA")
      }
    })
    if (list.length != 0) {
      list.map((res) => {
        if (res == nums) {
          wx.showToast({
            title: '添加失败，车牌号已存在',
            icon: 'none'
          })
          return
        }
      })
    } else {
      // let xreg = /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}(([0-9]{5}[DF]$)|([DF][A-HJ-NP-Z0-9][0-9]{4}$))/;
      // let creg = /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-HJ-NP-Z0-9]{4}[A-HJ-NP-Z0-9挂学警港澳]{1}$/;
      if (nums.length == 7) {
        console.log(nums)
        console.log(self.data.preId)
        api.POST({
          url: app.url.add_plate,
          params: {
            vehMark: nums,
            preId: self.data.preId
          },
          success(res) {
            console.log(res)
            if (res.data.status == false) {
              wx.showToast({
                title: res.data.message.content,
                icon: 'none'
              })
            } else {
              self.setData({
                statues: res.data.status,
                //   statues:true
                data: res.data.data
              })
              wx.showToast({
                title: '添加成功',
                icon: 'none'
              })
              app.low = 1
              console.log("成功")
              setTimeout(function () {
                console.log(self.data.num)
                if (self.data.num == 1) {
                  api.GET({
                    url: app.url.choose_carModule, //判断是否为长租
                    params: {},
                    success(res) {
                      console.log(res, "tagtagtagtagtagtagtagtagtagtagtagtagtagtagtagtag")
                      let parameter = res.data.data;
                      if (res.data.status == true) {
                        if (parameter == false) {
                          wx.redirectTo({
                            url: '/pages/noCarModule/noCarModule',
                          })
                        } else if (parameter == true) {
                          wx.redirectTo({
                            url: '/pages/index/index', //跳转到首页
                          })
                        }
                      } else {
                        wx.redirectTo({
                          url: '/pages/noCarModule/noCarModule',
                        })
                      }
                    },
                    fail() {
                      wx.showToast({
                          title: '请求失败',
                          icon: 'none'
                        }),
                        self.setData({
                          loading: 'none'
                        })
                    },
                    complete() {
                      self.setData({
                        loading: 'none'
                      })
                    }

                  }, app.token)
                } else {
                  if (self.data.types == 1) {
                    app.state = 1;
                    console.log(app.state, "=-------===")
                    var pages = getCurrentPages(); //  获取页面栈
                    var currPage = pages[pages.length - 1]; // 当前页面
                    var prevPage = pages[pages.length - 2]; // 上一个页面
                    prevPage.setData({
                      date: {
                        id: self.data.preId,
                        distance: self.data.distance,
                        statues: self.data.statues,
                        datas: res.data.data,
                        numes: nums
                      }
                    })
                    wx.navigateBack({
                      delta: 1
                    })
                  } else {
                    wx.redirectTo({
                      url: '/pages/plateNumber/plateNumber'
                    })
                  }
                }
              }, 500)
            }
          },
          fail() {
            wx.showToast({
              title: '添加失败',
              icon: 'none'
            })
          }
        }, app.token)
      } else if (nums.length == 8) {
        api.POST({
          url: app.url.add_plate,
          params: {
            vehMark: nums
          },
          success(res) {
            console.log(res)
            if (res.data.status == false) {
              wx.showToast({
                title: res.data.message.content,
                icon: 'none'
              })
            } else {
              //添加成功之后跳转到首页
              console.log(res, "这是添加车牌的数据")
              wx.showToast({
                title: '添加成功',
                icon: 'none'
              })
              app.low = 1
              console.log(self.data.types);
              if (self.data.num == 1) {
                api.GET({
                  url: app.url.choose_carModule, //判断是否为长租
                  params: {},
                  success(res) {
                    console.log(res, "tagtagtagtagtagtagtagtagtagtagtagtagtagtagtagtag")
                    let parameter = res.data.data;
                    if (res.data.status == true) {
                      if (parameter == false) {
                        wx.navigateTo({
                          url: '/pages/noCarModule/noCarModule',
                        })
                      } else if (parameter == true) {
                        let longitude = that.data.location.longitude;
                        let latitude = that.data.location.latitude;
                        api.POST({
                          url: app.url.long_carList2, //查看长租用户车位列表
                          params: {
                            latitude: latitude,
                            longitude: longitude
                          },
                          success(res) {
                            console.log(res, "changzudexinxi", res.data.message)
                            res.data.data.rentPres.map((res) => {
                              that.setData({
                                preName: res.preName,
                              })
                              let datas = res.rentPreStalls
                              datas.map((reson) => {
                                // console.log(reson)
                                that.setData({
                                  val: reson.stallName,
                                  stallEndTime: reson.stallEndTime,
                                  plate: reson.plate,
                                  stallId: reson.stallId,
                                  battery: reson.battery,
                                  gatewayStatus: reson.gatewayStatus
                                })
                              })
                            })
                            let num = res.data.data.num;
                            console.log(that.data.battery)
                            var data = JSON.stringify(res.data.data.res)
                            if (num == 1) {
                              wx.navigateTo({
                                url: '/pages/myCarModule/myCarModule?data=' + data + '&num=' + num + '&prename=' + that.data.preName + '&val=' + that.data.val + '&stallEndTime=' + that.data.stallEndTime + '&plate=' + that.data.plate + "&stallId=" + that.data.stallId + '&battery=' + that.data.battery + "&gatewayStatus=" + that.data.gatewayStatus, //跳转一个长租车位页面
                              })
                              console.log('跳转一个长租车位页面')
                            } else if (num > 1) {
                              console.log('跳转到长租选车位页面')
                              wx.navigateTo({
                                url: '/pages/LongRent/LongRent?data=' + data, //跳转到长租选车位页面
                              })
                            }
                          },
                          fail() {
                            wx.showToast({
                                title: '请求失败',
                                icon: 'none'
                              }),
                              self.setData({
                                loading: 'none'
                              })
                          },
                          complete() {
                            self.setData({
                              loading: 'none'
                            })
                          }
                        }, app.token)
                      }
                    } else {
                      wx.navigateTo({
                        url: '/pages/noCarModule/noCarModule',
                      })
                    }
                  },
                  fail() {
                    wx.showToast({
                        title: '请求失败',
                        icon: 'none'
                      }),
                      self.setData({
                        loading: 'none'
                      })
                  },
                  complete() {
                    self.setData({
                      loading: 'none'
                    })
                  }

                }, app.token)
              } else {
                if (self.data.types == 1) {
                  wx.reLaunch({
                    url: '/pages/home/home',
                  })
                } else {
                  wx.navigateBack({
                    url: '/pages/plateNumber/plateNumber'
                  })
                }
              }
            }
          },
          fail() {
            wx.showToast({
              title: '添加失败',
              icon: 'none'
            })
          }
        }, app.globalData.token)
      } else {
        wx.showToast({
          title: '请输入正确的车牌号',
          icon: 'none'
        })
      };
    }
  }
})