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
    btn_loading:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options, "==========================")
    let that = this;
    api.GET({
      url: app.url.plate_list, //车牌列表
      params: {},
      success(res) {
        console.log(res, "kKKKKKKKKKKKKKKKKK")
        let plateList = res.data.data;
        that.setData({
          carlist: plateList,
        })
      },
    }, app.globalData.token)
    if (options.type) {
      this.setData({
        types: options.type
      })
    } else {
      this.setData({
        types: 1,
      })
    }
    this.data.distance = app.distance
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
    let that = this;
    let nums = this.data.zhData;
    let list = []
    console.log(that.data.carlist)
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
        that.setData({
          obj: res.data
        })
      },
    })
    if (that.data.obj != "") {
      wx.navigateTo({
        url: '/pages/parklot/parklot?groupId=' + that.data.obj.groupId + "&prefectureId=" + that.data.obj.prefectureId + "&ordersource=" + 2,
      })
      console.log(that.data.obj, "PPPPPPPPPPPPPPPPP")
      wx.removeStorage({
        key: 'abc'
      })
    }
    that.data.carlist.map((res) => {
      console.log(res, 'ppppppppppppppppppppp' + that.data.zhData)
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
        that.setData({
          btn_loading:true
        })
        console.log(nums)
        console.log(that.data.preId)
        api.POST({
          url: app.url.add_plate,
          params: {
            vehMark: nums,
            preId: that.data.preId
          },
          success(res) {
            console.log(res)
            if (res.data.status == false) {
              wx.showToast({
                title: res.data.message.content,
                icon: 'none'
              })
              that.setData({
                btn_loading:false
              })
            } else {
              that.setData({
                statues: res.data.status,
                data: res.data.data
              })
              wx.showToast({
                title: '添加成功',
                icon: 'none'
              })
              that.setData({
                btn_loading:false
              })
              if(that.data.types == 0){
                wx.navigateBack({})
                return
              }
              console.log("成功")
              setTimeout(function () {
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
                        that.setData({
                          loading: 'none'
                        })
                    },
                    complete() {
                      that.setData({
                        loading: 'none'
                      })
                    }

                  }, app.token)
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
        that.setData({
          btn_loading:true
        })
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

              that.setData({
                btn_loading:false
              })
            } else {
              console.log(res, "这是添加车牌的数据")
              wx.showToast({
                title: '添加成功',
                icon: 'none'
              })
              that.setData({
                btn_loading:false
              })
              if(that.data.types == 0){
                wx.navigateBack({})
                return
              }
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
                        wx.redirectTo({
                          url: '/pages/index/index', //跳转到首页
                        })
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
                      that.setData({
                        loading: 'none'
                      })
                  },
                  complete() {
                    that.setData({
                      loading: 'none'
                    })
                  }

                }, app.token)
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