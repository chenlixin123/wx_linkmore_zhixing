//获取应用实例
const app = getApp()
//引入network
import api from "../../utils/network.js"
import util from "../../utils/util.js"
Page({
  /**
   * 页面的初始数据
   */
  data: {
    prename:'',
    plate:'',
    endtime:'',
    val:'',
    num:'',
    datas:[],
    self:true,
    stallId:'',
    loading: "none",
    loadingText: "",
    begins: "none",
    aligns:'地锁升起失败,再升一次',
    s : 0,
    ss:'',
    battery:'',
    gatewayStatus:12,//网关状态 0离线 1在线
    show:false,
    shows1:false,
    latitude:"",
    longitude:"",
    validity:'' ,//到期时间
    isUserRecord:'',//是否显示使用记录 0显示  1不显示
    isUserUse:'',
    downLockTime:'',//降锁时间
    stallStatus:'',//当前是否有用户使用 0无 1有
    lockStatus:'',//锁状态 1升起  2降下
    unusualBattery:12,//异常电量 0低于30 1大于30
    useUpLockTime:'',//上次使用时间
    useUserMobile:'',//使用用户电话
    userStatus:'',//用户状态 1授权人 0被授权人  
    useUserName:'',//用户姓名
    src:'',//图片路径
    data:'',
    data1:'',
    validitys:'',
    number:0,
    carstatus:1, // 1导航  2反向寻车,
    prak_Height:160,
    navigation_Height:140,
    navigation: 'none',
    pathFlag:-1,
    preId:'',
    isSelfUser:'',
    impower_show:false,
    isAuthFlag:'',
    impower_list:{},
    operateAuthFlag:'',
    nopermission:'',
    nopermissions:'车位无法使用，请通过物业管理人员开启车位使用权限',
    latitude:'39.91106',
    longitude:'116.41361',
    entranceFlag:'',
    planeId:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('111111111111111111')
    let that = this
    that.setData({
      num: app.num,
    })
    let impower = wx.getStorageSync('impower')
    console.log(impower)
    if (impower == ''){
      that.setData({
        impower_show:true
      })
    }else{
      console.log('不空')
      that.setData({
        impower_show: false
      })
    }
    if (app.num == '' || app.num == 1 || options.num == 1){
      that.setData({
        latitude: options.latitude,
        longitude: options.longitude,
      })
      if(that.prak_Height=160){
         that.setData({
           prak_Height: 120,
           navigation_Height: 100
         })
      }
      api.POST({
        url: app.url.long_carList2,
        params: {
          latitude: options.latitude,
          longitude: options.longitude
        },
        success(res) {
          console.log(res)
          if (res.data.status == true) {
            res.data.data.rentPres.map(res => {
              that.setData({
                preId: res.preId,
                pathFlag: res.pathFlag, 
                entranceFlag: res.entranceFlag,
                planeId: res.planeId
              })
              res.rentPreStalls.map(res => {
                wx.setStorageSync('carname', res.stallName)
                if (res.gatewayStatus == 0) {
                  that.setData({
                    unusualBattery: 1
                  })
                } else {
                  that.setData({
                    unusualBattery: res.unusualBattery
                  })
                }
               
                if (res.userStatus == 1){
                  
                  wx.setNavigationBarTitle({
                    title: '我的车位'
                  })
                }else{
                  if (that.prak_Height = 160) {
                    that.setData({
                      prak_Height: 120,
                      navigation_Height: 100
                    })
                  }else{
                    that.setData({
                      prak_Height: 80,
                      navigation_Height: 60
                    })
                  }
                  wx.setNavigationBarTitle({
                    title: '授权车位'
                  })
                }
                that.setData({
                  userStatus: res.userStatus,
                })
                if (res.gatewayStatus == 1) { //判断网关在线
                  if (res.stallStatus == 2) { //判断车位状态 2占用
                    that.setData({
                      src: '../../assets/icon/zaixianshiyongzhong@2x.png'
                    })
                  } else {

                    if (res.lockStatus == 1) { //判断锁升起
                      if (res.userStatus == 1) { //判断授权人
                        that.setData({
                          src: '../../assets/icon/zhaunyongzaixian_suoshengqi@2x.png'
                        })
                      } else {
                        that.setData({
                          src: '../../assets/icon/zaixianshouquan_suoshengqi@2x.png'
                        })
                      }

                    } else {
                      that.setData({
                        src: '../../assets/icon/suojiangxia@2x.png'
                      })
                    }
                  }
                } else {
                  if (res.stallStatus == 2) { //判断车位状态 2占用
                    that.setData({
                      src: '../../assets/icon/zaixianshiyongzhong@2x.png'
                    })
                  } else{
                    if (res.lockStatus == 1) {
                      if (res.userStatus == 1) {
                        that.setData({
                          src: '../../assets/icon/zhaunyonglixian_suoshengqi@2x.png'
                        })
                      } else {
                        that.setData({
                          src: '../../assets/icon/shouquanlixian_suoshengqi@2x.png'
                        })
                      }

                    } else {
                      that.setData({
                        src: '../../assets/icon/lixiansuojiangxia@2x.png'
                      })
                    }
                  }
                }
                let time = new Date(res.validity);
                console.log(res.validity)
                let y = time.getFullYear()
                let m = time.getMonth() + 1 < 10 ? '0' + (time.getMonth() + 1) : time.getMonth() + 1
                let d = time.getDate() < 10 ? '0' + time.getDate() : time.getDate()
                let h = time.getHours() < 10 ? '0' + time.getHours() : time.getHours()
                let mm = time.getMinutes() < 10 ? '0' + time.getMinutes() : time.getMinutes()
                let validity = y + '-' + m + '-' + d + ' ' + h + ':' + mm
                let validitys = y + '-' + m + '-' + d 
                console.log(res.useUpLockTime)
                console.log(res.downLockTime)
                console.log(new Date(res.downLockTime))
                if (res.useUpLockTime != null){
                  let date = new Date(res.useUpLockTime)
                  let Y = date.getFullYear() + '-';
                  let MM = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
                  let D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
                  let H = date.getHours() < 10 ? '0' + date.getHours() : date.getHours();
                  let M = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()
                  console.log(Y + MM + D + H + M);
                  var useUpLockTimes = Y + MM + D  + ' ' + H + ':' + M
                }else{
                  var useUpLockTimes = null
                }
               
                if (res.downLockTime != null){
                  let dates = new Date(res.downLockTime)
                  let Ys = dates.getFullYear() + '-';
                  let MMs = (dates.getMonth() + 1 < 10 ? '0' + (dates.getMonth() + 1) : dates.getMonth() + 1) + '-';
                  let Ds = dates.getDate() < 10 ? '0' + dates.getDate() : dates.getDate();
                  let Hs = dates.getHours() < 10 ? '0' + dates.getHours() : dates.getHours();
                  let Ms = dates.getMinutes() < 10 ? '0' + dates.getMinutes() : dates.getMinutes()
                  var downLockTimes = Ys + MMs + Ds + "  " + Hs +':' + Ms
                }else{
                  var downLockTimes = null
                }
                console.log(res.operateAuthFlag)
                that.setData({
                  validity: validity,
                  validitys: validitys,
                  prename: res.preName,
                  val: res.stallName,
                  isUserRecord: res.isUserRecord,
                  downLockTime: downLockTimes,
                  stallStatus: res.stallStatus,
                  lockStatus: res.lockStatus,
                  useUpLockTime: useUpLockTimes,
                  useUserMobile: res.useUserMobile,
                  userStatus: res.userStatus,
                  useUserName: res.useUserName,
                  gatewayStatus: res.gatewayStatus,
                  stallId: res.stallId,
                  isUserUse: res.isUserUse,
                  preId:res.preId,
                  underLayer: res.underLayer,
                  isSelfUser: res.isSelfUser,
                  isAuthFlag: res.isAuthFlag,
                  impower_list: res,
                  operateAuthFlag: res.operateAuthFlag
                })
                if (that.data.lockStatus == 1){
                        that.setData({
                          carstatus:1     //导航
                        })
                }else{
                  that.setData({
                    carstatus: 2   //反向寻车
                  })
                }
                if (that.data.operateAuthFlag == 0) {
                  that.setData({
                    nopermission: true
                  })
                } else {
                  that.setData({
                    nopermission: false
                  })
                }
                console.log(that.data.carstatus)
              })
            })
          }else{
            console.log(res.data.message.content)
          }
          
        }
        
      }, app.token)
    }else{
       let data = JSON.parse(options.data)
    let data1 = JSON.parse(options.data1)
    that.setData({
      pathFlag: data1.pathFlag,
      entranceFlag: data1.entranceFlag
    })
      if (data.gatewayStatus == 0) {
        that.setData({
          unusualBattery: 1
        })
      } else {
        that.setData({
          unusualBattery: data.unusualBattery
        })
      }
    console.log(data1)
    console.log(data)
    that.setData({
      impower_list:data,
      planeId: data1.planeId,
      preId: data1.preId
    })
      if (options.downtime == 'null'){
        that.setData({
          downLockTime: null
        })
      }else{
        // console.log('zou 555555555555')
        let date = new Date(Number(options.downtime))
        let time = date.getFullYear() + '-' + ((date.getMonth() + 1) < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1)) + '-' + (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ' ' + (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':' + (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes())
        that.setData({
          downLockTime: time
        })
        console.log(that.data.downLockTime)
      }

      if (options.uptime == 'null') {
        that.setData({
          useUpLockTime: null
        })
      } else {
        console.log('zou 66666666666666')
        // console.log(api.Time(Number(options.uptime)))
        let date = new Date(Number(options.uptime))
        let time = date.getFullYear() + '-' + ((date.getMonth() + 1) < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1)) + '-' + (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ' ' + (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':' + (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes())
        that.setData({
          useUpLockTime: time
        })
      }
      that.setData({
        data: data,
        data1: data1,
        latitude: data1.latitude,
        longitude: data1.longitude,
        isUserUse: data.isUserUse ,
        isSelfUser: data.isSelfUser,
        isAuthFlag: data.isAuthFlag
      })
    
      wx.setStorageSync('carname', data.stallName)
      if (data.userStatus == 1) {
        wx.setNavigationBarTitle({
          title: '我的车位'
        })
      } else {
        wx.setNavigationBarTitle({
          title: '授权车位'
        })
      }
      console.log(that.data.isSelfUser, '--------- isSelfUser')
      if (data.gatewayStatus == 1) { //判断网关在线
        if (data.stallStatus == 2) { //判断车位状态 2占用
          that.setData({
            src: '../../assets/icon/zaixianshiyongzhong@2x.png'
          })
        } else {

          if (data.lockStatus == 1) { //判断锁升起
            if (data.userStatus == 1) { //判断授权人
              that.setData({
                src: '../../assets/icon/zhaunyongzaixian_suoshengqi@2x.png'
              })
            } else {
              that.setData({
                src: '../../assets/icon/zaixianshouquan_suoshengqi@2x.png'
              })
            }

          } else {
            that.setData({
              src: '../../assets/icon/suojiangxia@2x.png'
            })
          }
        }
      } else {
        if (data.stallStatus == 2) { //判断车位状态 2占用
          that.setData({
            src: '../../assets/icon/zaixianshiyongzhong@2x.png'
          })
        } else {
          if (data.lockStatus == 1) {
            if (data.userStatus == 1) {
              that.setData({
                src: '../../assets/icon/zhaunyonglixian_suoshengqi@2x.png'
              })
            } else {
              that.setData({
                src: '../../assets/icon/shouquanlixian_suoshengqi@2x.png'
              })
            }

          } else {
            that.setData({
              src: '../../assets/icon/lixiansuojiangxia@2x.png'
            })
          }
        }
      }
      let time = new Date(data.validity);
      console.log(data.validity)
      let y = time.getFullYear()
     let m = time.getMonth() + 1 < 10 ? '0' + (time.getMonth() + 1) : time.getMonth() + 1
      let d = time.getDate() < 10 ? '0' + time.getDate() : time.getDate()
      let h = time.getHours() < 10 ? '0' + time.getHours() : time.getHours()
      let mm = time.getMinutes() < 10 ? '0' + time.getMinutes() : time.getMinutes()
      let validity = y + '-' + m + '-' + d + ' ' + h + ':' + mm
      let validitys = y + '-' + m + '-' + d 
      that.setData({
        validity: validity,
        validitys: validitys,
        prename: data.preName,
        val: data.stallName,
        isUserRecord: data.isUserRecord,
        stallStatus: data.stallStatus,
        lockStatus: data.lockStatus,
        useUserMobile: data.useUserMobile,
        userStatus: data.userStatus,
        useUserName: data.useUserName,
        gatewayStatus: data.gatewayStatus,
        stallId: data.stallId,
        longitude: data1.longitude,
        latitude: data1.latitude,
        underLayer: data.underLayer,
        operateAuthFlag: data.operateAuthFlag
      })
      console.log(that.data.useUserName, that.data.useUserMobile)
      if (that.data.lockStatus == 1) {
        that.setData({
          carstatus: 1     //导航
        })
      } else {
        that.setData({
          carstatus: 2   //反向寻车
        })
      }
      if (that.data.operateAuthFlag == 0) {
        that.setData({
          nopermission: true
        })
      } else {
        that.setData({
          nopermission: false
        })
      }
      console.log(that.data.carstatus)

    }   
    console.log(that.data.battery)
  },
  //记录信息
  record(){
    let that = this
    wx.navigateTo({
      url: '/pages/record/record?stallId=' + that.data.stallId,
    })
      console.log('记录')
  },
  //点击取消弹框
  impowers(){
    let that = this
    wx.setStorageSync('impower','授权不显示')
    that.setData({
      impower_show:false
    })
  },
  //点击跳转授权
  impowerTap(){
      let that = this
    console.log(that.data.impower_list.stallName)
    let time = new Date(that.data.impower_list.validity);
    let y = time.getFullYear()
    let m = time.getMonth() + 1 < 10 ? '0' + (time.getMonth() + 1) : time.getMonth() + 1
    let d = time.getDate() < 10 ? '0' + time.getDate() : time.getDate()
    let h = time.getHours() < 10 ? '0' + time.getHours() : time.getHours()
    let mm = time.getMinutes() < 10 ? '0' + time.getMinutes() : time.getMinutes()
    let validitys = y + '-' + m + '-' + d 
    console.log(validitys)
      wx.navigateTo({
        url: '/pages/confirmImpower/confirmImpower?name=' + that.data.impower_list.stallName + "&carname=" + that.data.impower_list.preName + "&index=" + "&num=1" + '&preId=' + that.data.impower_list.preId + '&stallId=' + that.data.impower_list.stallId + '&stallEndTime=' + validitys,
      })
  },
  shows() {
    let that = this
    that.setData({
      show: false
    })
  },
  tops(){
    let that = this
      console.log('升锁')
  },
  nopermissione(){
      let that = this
      that.setData({
        nopermission:false
      })
  },
  top(){
    let that = this
    if (that.data.operateAuthFlag == 0){
        that.setData({
          nopermission:true
        })
        return
    }
    if (that.data.useUserMobile != null && that.data.useUserMobile != ''){
      var mobil = that.data.useUserMobile.substring(0, 3) + "****"+ that.data.useUserMobile.substring(7, 11)
    }
    console.log(that.data.isSelfUser)
    if (that.data.isSelfUser == 1){
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
                  loading: 'block',
                  loadingText: "升锁中请稍候",
                  self: false
                })
                api.POST({
                  url: app.url.long_controls, //1 降下地锁  2 升起地锁
                  params: {
                    stallId: that.data.stallId,
                    state: 2,
                    parkingStatus: 0   //0未知 1到达 2未到达
                  },
                  success(res) {
                    console.log(res)
                    if (res.data.data == true) {
                      that.setData({
                        carstatus:1,
                        loading: 'none',
                        self: true
                      })
                      that.setData({
                        downLockTime: null
                      })
                      let date = new Date()
                      let time = date.getFullYear() + '-' + ((date.getMonth() + 1) < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1)) + '-' + (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ' ' + (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':' + (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes())
                      that.setData({
                        useUpLockTime: time
                      })
                      console.log(that.data.useUpLockTime)
                      setTimeout(() => {
                        wx.showToast({
                          title: '车位锁升起成功',
                          icon: 'none'
                        })
                      }, 1000)
                      wx.setStorageSync('oo', false)
                    } else {
                      if (res.data.message != null) {
                        if (res.data.message.code == 8005099) {
                          that.setData({
                            aligns: res.data.message.content,
                            ss: '再升一次',
                            s: 1,
                            begins: 'block',
                            loading: 'none',
                          })
                        } else if (res.data.message.code == 8005101) {
                          that.setData({
                            aligns: res.data.message.content,
                            ss: '故障上报',
                            s: 3,
                            begins: 'block',
                            loading: 'none',
                          })
                        } else if (res.data.message.code == 8005093) {
                          that.setData({
                            aligns: res.data.message.content,
                            ss: '切换车位',
                            s: 4,
                            begins: 'block',
                            loading: 'none',
                          })
                        } else if (res.data.message.code == 8005073) {
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
                        } else if (res.data.message.code == 8005072) {
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
                      }else{
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
                      loading: 'none',
                    })
                  },
                }, app.token)
              }
            }
          }
        })
    }else{
      if (that.data.self == true) {
        that.setData({
          loading: 'block',
          loadingText: "升锁中请稍候",
          self: false
        })
        api.POST({
          url: app.url.long_controls, //1 降下地锁  2 升起地锁
          params: {
            stallId: that.data.stallId,
            state: 2,
            parkingStatus: 0   //0未知 1到达 2未到达
          },
          success(res) {
            console.log(res)
            if (res.data.status == true) {
              that.setData({
                carstatus: 1,
                loading: 'none',
                self: true
              })
              that.setData({
                downLockTime: null
              })
                let date = new Date()
                let time = date.getFullYear() + '-' + ((date.getMonth() + 1) < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1)) + '-' + (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ' ' + (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':' + (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes())
                that.setData({
                  useUpLockTime: time
                })
                console.log(that.data.useUpLockTime)

              setTimeout(() => {
                wx.showToast({
                  title: '车位锁升起成功',
                  icon: 'none'
                })
              }, 1000)
              wx.setStorageSync('oo', false)
            } else {
              if (res.data.message != null) {
                if (res.data.message.code == 8005099) {
                  
                  that.setData({
                    aligns: res.data.message.content,
                    ss: '再升一次',
                    s: 1,
                    begins: 'block',
                    loading: 'none',
                  })
                } else if (res.data.message.code == 8005101) {
                  that.setData({
                    aligns: res.data.message.content,
                    ss: '故障上报',
                    s: 3,
                    begins: 'block',
                    loading: 'none',
                  })
                } else if (res.data.message.code == 8005093) {
                  that.setData({
                    aligns: res.data.message.content,
                    ss: '切换车位',
                    s: 4,
                    begins: 'block',
                    loading: 'none',
                  })
                } else if (res.data.message.code == 8005073) {
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
                } else if (res.data.message.code == 8005072) {
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
                }else{
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
              loading: 'none',
            })
          },
        }, app.token)
      }
    }
  },
  bottom(){
    let that = this
    if (that.data.operateAuthFlag == 0) {
      that.setData({
        nopermission: true
      })
      return
    }
    if (that.data.self == true) {
      if (that.data.isSelfUser == 1) {
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
                loading: 'block',
                loadingText: "降锁中请稍候",
                self: false
              })
              api.POST({
                url: app.url.long_controls, //1 降下地锁  2 升起地锁
                params: {
                  stallId: that.data.stallId,
                  state: 1,
                  parkingStatus: 0   //0未知 1到达 2未到达
                },
                success(res) {
                  console.log(res)
                  if (res.data.data == true) {
                    that.setData({
                      carstatus: 2
                    })

                    that.setData({
                      useUpLockTime: null
                    })

                    // console.log('zou 555555555555')
                    let date = new Date()
                    let time = date.getFullYear() + '-' + ((date.getMonth() + 1) < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1)) + '-' + (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ' ' + (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':' + (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes())
                    that.setData({
                      downLockTime: time
                    })
                    console.log(that.data.downLockTime)
                    setTimeout(() => {
                      wx.showToast({
                        title: '车位锁降下成功',
                        icon: 'none'
                      })
                    }, 1000)
                    wx.setStorageSync('oo', true)
                    that.setData({
                      loading: 'none',
                      self: true
                    })
                  } else {
                    if (res.data.message != null) {
                      if (res.data.message.code == 8005100) {
                        that.setData({
                          loading: 'none',
                          self: true,
                          begins: 'block',
                          loading: 'none',
                        })
                        that.setData({
                          aligns: res.data.message.content,
                          ss: '再降一次',
                          s: 2,
                          begins: 'block',
                          loading: 'none',
                        })
                      } else if (res.data.message.code == 8005102) {
                        that.setData({
                          aligns: res.data.message.content,
                          ss: '故障上报',
                          s: 3,
                          begins: 'block',
                          loading: 'none',
                        })
                      } else if (res.data.message.code == 8005093) {
                        that.setData({
                          aligns: res.data.message.content,
                          ss: '切换车位',
                          s: 4,
                          begins: 'block',
                          loading: 'none',
                        })
                      } else if (res.data.message.code == 8005073) {
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
                      } else if (res.data.message.code == 8005072) {
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
                      } else {
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
                    loading: 'none',
                  })
                },
              }, app.token)
            }
          }
          })
        
      }else{
        that.setData({
          loading: 'block',
          loadingText: "降锁中请稍候",
          self: false
        })
        api.POST({
          url: app.url.long_controls, //1 降下地锁  2 升起地锁
          params: {
            stallId: that.data.stallId,
            state: 1,
            parkingStatus: 0   //0未知 1到达 2未到达
          },
          success(res) {
            console.log(res)
            if (res.data.data == true) {
              that.setData({
                carstatus: 2
              })

              that.setData({
                useUpLockTime: null
              })

              // console.log('zou 555555555555')
              let date = new Date()
              let time = date.getFullYear() + '-' + ((date.getMonth() + 1) < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1)) + '-' + (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ' ' + (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':' + (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes())
              that.setData({
                downLockTime: time
              })
              console.log(that.data.downLockTime)
              setTimeout(() => {
                wx.showToast({
                  title: '车位锁降下成功',
                  icon: 'none'
                })
                // that.setData({
                //   src: '../../assets/icon/suojiangxia@2x.png'
                // })
              }, 1000)
              wx.setStorageSync('oo', true)
              that.setData({
                loading: 'none',
                self: true
              })
            } else {
              if (res.data.message != null) {
                if (res.data.message.code == 8005100) {
                  that.setData({
                    loading: 'none',
                    self: true,
                    begins: 'block',
                    loading: 'none',
                  })
                  that.setData({
                    aligns: res.data.message.content,
                    ss: '再降一次',
                    s: 2,
                    begins: 'block',
                    loading: 'none',
                  })
                } else if (res.data.message.code == 8005102) {
                  that.setData({
                    aligns: res.data.message.content,
                    ss: '故障上报',
                    s: 3,
                    begins: 'block',
                    loading: 'none',
                  })
                } else if (res.data.message.code == 8005093) {
                  that.setData({
                    aligns: res.data.message.content,
                    ss: '切换车位',
                    s: 4,
                    begins: 'block',
                    loading: 'none',
                  })
                } else if (res.data.message.code == 8005073) {
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
                } else if (res.data.message.code == 8005072) {
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
                } else {
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
              loading: 'none',
            })
          },
        }, app.token)
      }
    }
  },
  carwhere(){
    let that = this
    if (that.data.pathFlag == 0 || that.data.pathFlag==null){
        wx.navigateTo({
          url: '/pages/map_where/map_where?val=' + that.data.val,
        })
    } else if (that.data.entranceFlag == 1){
        wx.navigateTo({
          url: '/pages/choose/choose?id=' + that.data.preId + "&val=" + that.data.val + '&planeId=' + that.data.planeId,
        })
      }else if(that.data.entranceFlag == 0){
      wx.navigateTo({
        url: '/pages/maps/maps?id=' + that.data.planeId + "&val=" + that.data.val,
      })
      }
  },
  malfunction(){
    let that = this
    let oo = wx.getStorageSync('oo')
    // if (oo == true) {
      // wx.showModal({
      //   title: '您正在使用长租'+ that.data.val+'车位',
      //   confirmText:'确定',
      //   showCancel:false
      // })
    //   this.setData({
    //     show: true
    //   })
    //   return
    // }
        wx.navigateTo({
          url: '/pages/malfunction/malfunction?stallId=' + that.data.stallId + '&val=' + that.data.val
        })
  },
  prke() {
    var taht = this
    taht.setData({
      navigation: 'none'
    })

  },
  More() {
    var that = this
    that.setData({
      navigation: 'block'
    })

  },
  more_malfunction(){
    let that = this
    that.setData({
      navigation: 'none'
    })
  wx.navigateTo({
    url: '/pages/malfunction/malfunction?stallId=' + that.data.stallId + '&val=' + that.data.val
  })
  },
  more_malfunction(){
    let that = this
    that.setData({
      navigation: 'none'
    })
    wx.navigateTo({
      url: '/pages/record/record?stallId=' + that.data.stallId,
    })
  },
  navigation_item(){
    let data = JSON.stringify(this.data.datas);
    let that = this;
    that.setData({
      navigation: 'none'
    })
                wx.redirectTo({
                  url: '/pages/LongRent/LongRent?data=' + data + "&latitude=" + that.data.latitude + "&longitude=" + that.data.longitude + "&switchFlag=" + 1 + '&id=' + that.data.stallId,
                })
  },
  xiao(){
    let that = this
    that.setData({
      self: true,
      begins: "none"
    })
  },
  ones(){
    let that = this
    that.setData({
      self: true,
      begins:"none"
    })
    if(that.data.s == 1){
      that.top()
    } else if (that.data.s == 2){
      that.bottom()
    } else if (that.data.s == 4) {
      wx.navigateTo({
        url: '/pages/LongRent/LongRent'
      })
    }else{
      wx.navigateTo({
          url: '/pages/malfunction/malfunction?stallId=' + that.data.stallId + '&val=' + that.data.val
        })
    }

  },
  know(){
    let that = this
    app.shows = true
    that.setData({
      shows1:false
    })
  },
  noshow(){
    let that = this
    that.setData({
      shows1: false
    })
      wx.setStorageSync('show', true)
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let that = this
    let ss = wx.getStorageSync('show')
    if (ss == '') {
      if(app.shows == false){
        app.shows = true
        that.setData({
          shows1: true
        })
      }else{
        that.setData({
          shows1: false
        })
      }
    } else {
      that.setData({
        shows1: false
      })
      app.shows  = false
   
    }
    wx.setStorageSync('skipe', 1)
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    console.log('存储了')
     wx.setStorageSync('impower', '授权不显示')
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    console.log('存储了')
    wx.setStorageSync('impower', '授权不显示')
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