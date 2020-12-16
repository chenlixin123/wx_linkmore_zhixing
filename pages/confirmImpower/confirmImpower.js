//获取应用实例
const app = getApp()
//引入network
import api from "../../utils/network.js"
const date = new Date()
// const years = []
// const months = []
const times = []
const hours = []
const min = []
// for (let i = 1990; i <= date.getFullYear(); i++) {
//   years.push(i)
// }

for (let i = 1; i <= 12; i++) {
  for (let j = 1; j <= new Date(date.getFullYear(), i, 0).getDate(); j++) {
    times.push(i + '月' + j + '日')
    // console.log(new Date(time.getFullYear(), i, 0).getDate())
  }
}
for (let i = 0; i <= 23; i++) {
  if (i <= 9) {
    hours.push('0' + i)
  } else {
    hours.push(i)
  }

}
for (let i = 0; i <= 59; i++) {
  if (i <= 9) {
    min.push('0' + i)
  } else {
    min.push(i)
  }

}
// console.log(min)

Page({

  /**
   * 页面的初始数据
   */
  data: {
    start_time: '',
    end_time: '',
    ss: '',
    show: 'false',
    relation: [],
    ind: -1,
    mobile: '',
    username: '',
    hours: hours,
    min: min,
    value: [],
    values: [],
    times: times,
    start_time: '',
    start_hour: '',
    start_min: '',
    end_time: '',
    end_hour: '',
    end_min: '',
    time: '',
    hour: '',
    mins: '',
    end_times: '',
    end_hour: '',
    end_mins: '',
    judge: '',
    dis: true,
    preId: '',
    stallId: '',
    carname: '',
    name: '',
    relationId: '',
    relationName: '',
    loadingText: '加载中请稍候',
    title: '',
    num: '',
    dd: '',
    loading_display: true,
    stallEndTime: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    let data = JSON.parse(options.data)
    that.setData({
      preId: data.preId,
      stallId: data.stallId,
      carname: data.stallName,
      name: data.preName,
      loading_display: true,
      stallEndTime: data.validity
    })

    // console.log(that.data.stallEndTime)
    api.GET({
      url: app.url.friends,
      success(res) {
        console.log(res)
        that.setData({
          loading_display: false
        })
        that.setData({
          relation: res.data.data
        })
      }
    }, app.token)
    // console.log(new Date(date.getFullYear(), date.getMonth(), 0).getDate())
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  bindChange(e) {
    let that = this
    const val = e.detail.value
    console.log(e.detail.value)
    if (that.data.judge == 1) {
      this.setData({
        start_time: that.data.times[val[0]],
        start_hour: that.data.hours[val[1]],
        start_min: that.data.min[val[2]],
        value: e.detail.value,
      })
    } else {
      this.setData({
        end_time: that.data.times[val[0]],
        end_hour: that.data.hours[val[1]],
        end_min: that.data.min[val[2]],
        value: e.detail.value,
      })
    }

    console.log(that.data.value)
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
  //选择开始时间选择器
  input1() {
    console.log('开始时间')
    let that = this
    that.setData({
      show: true,
      judge: 1,
      title: '开始时间'
    })
    // that.data.time + " " + that.data.hour + ":" + that.data.mins
    let hh = ''
    let mmm = ''
    let mm = ''
    let m = ''
    let n = ''
    let h = ''
    let d = ''
    let times
    console.log(that.data.start_time)
    if (that.data.start_time != '') {
      console.log(that.data.start_time.split(' ')[1])
      let start_time = that.data.start_time.split(' ')
      let start_hour = start_time[1].split(":")
      console.log(start_hour)
      m = start_time[0]
      h = start_hour[0]
      mm = start_hour[1]
      times = m
    } else {
      let time = new Date()
      m = time.getMonth() + 1;
      d = time.getDate();
      h = time.getHours();
      mm = time.getMinutes();
      times = m + '月' + d + '日'
    }

    let value = []
    for (let i = 0; i < that.data.times.length; i++) {
      if (that.data.times[i].indexOf(times) != -1) {
        // console.log(i)
        value.push(i)
        // console.log(that.data.times[i].indexOf(times))
      }
    }
    if (h <= 9) {
      hh = h
    } else {
      hh = h
    }
    if (mm <= 9) {
      mmm = mm
    } else {
      mmm = mm
    }
    for (let i = 0; i < that.data.hours.length; i++) {
      console.log(that.data.hours[i].toString().indexOf(hh))
      if (that.data.hours[i].toString().indexOf(hh) != -1) {
        value.push(i)
        console.log(value)
      }
    }
    for (let i = 0; i < that.data.min.length; i++) {
      console.log(that.data.min[i].toString().indexOf(mmm))
      if (that.data.min[i].toString().indexOf(mmm) != -1) {
        value.push(i)
        console.log(value)
      }
    }
    that.setData({
      value: value
    })
    value = []
    console.log(value)
  },
  //选择结束时间选择器
  input2() {
    let that = this
    that.setData({
      show: true,
      judge: 2,
      title: '到期时间'
    })
    let hh = ''
    let mmm = ''
    let mm = ''
    let m = ''
    let n = ''
    let h = ''
    let d = ''
    let times
    console.log(that.data.end_time)
    if (that.data.end_time != '') {
      console.log(that.data.end_time.split(' ')[1])
      let end_time = that.data.end_time.split(' ')
      let end_hour = end_time[1].split(":")
      m = end_time[0]
      h = end_hour[0]
      mm = end_hour[1]
      times = m
    } else {
      let time = new Date()
      m = time.getMonth() + 1;
      d = time.getDate();
      h = time.getHours();
      mm = time.getMinutes();
      times = m + '月' + d + '日'
    }

    let value = []
    for (let i = 0; i < that.data.times.length; i++) {
      if (that.data.times[i].indexOf(times) != -1) {
        // console.log(i)
        value.push(i)
        // console.log(that.data.times[i].indexOf(times))
      }
    }
    if (h <= 9) {
      hh = h
    } else {
      hh = h
    }
    if (mm <= 9) {
      mmm = mm
    } else {
      mmm = mm
    }
    for (let i = 0; i < that.data.hours.length; i++) {
      console.log(that.data.hours[i].toString().indexOf(hh))
      if (that.data.hours[i].toString().indexOf(hh) != -1) {
        value.push(i)
        console.log(value)
      }
    }
    for (let i = 0; i < that.data.min.length; i++) {
      console.log(that.data.min[i].toString().indexOf(mmm))
      if (that.data.min[i].toString().indexOf(mmm) != -1) {
        value.push(i)
        console.log(value)
      }
    }
    that.setData({
      value: value
    })
    value = []
    console.log(value)
  },
  //选择关系
  tap(event) {
    console.log('选择关系')
    let that = this
    console.log(event.currentTarget.dataset)
    that.setData({
      ind: event.currentTarget.dataset.index,
      relationId: event.currentTarget.dataset.datas.id,
      relationName: event.currentTarget.dataset.datas.name
    })
    if (that.data.num != 11 || that.data.start_time == '' || that.data.end_time == '' || that.data.ind == -1) {
      that.setData({
        dis: true
      })
    } else {
      that.setData({
        dis: false
      })
    }
  },
  //确定授权
  btn() {
    let that = this
    let mobile_verify = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1})|(19[0-9]{1})|(16[0-9]{1}))+\d{8})$/;
    if (!that.data.mobile) {
      wx.showToast({
        title: '请输入被授权人的手机号',
        icon: 'none'
      })
      return
    }

    if (!mobile_verify.test(that.data.mobile)) {
      wx.showToast({
        title: '请输入正确的手机号',
        icon: 'none'
      })
      return
    }

    if (that.data.ind == -1) {
      wx.showToast({
        title: '请选择被授权人与您的关系',
        icon: 'none'
      })
      return
    }

    if (!that.data.start_time) {
      wx.showToast({
        title: '请选择开始时间',
        icon: 'none'
      })
      return
    }

    if (!that.data.end_time) {
      wx.showToast({
        title: '请选择到期时间',
        icon: 'none'
      })
      return
    }
    let y = date.getFullYear() //年
    console.log(that.data.start_time)
    console.log(parseInt(that.data.start_time))
    let m = parseInt(that.data.start_time) //月
    let ri = that.data.start_time.split('月')
    let d = parseInt(ri[1]) //日
    console.log(d)
    let shi = that.data.start_time.split('日')
    let shis = parseInt(shi[1])
    console.log(shis) //时
    let fen = that.data.start_time.split(':')
    let fens = parseInt(fen[1]) //分
    let start_time = y + '/' + m + '/' + d + " " + shis + ":" + fens
    console.log(y + '/' + m + '/' + d + " " + shis + ":" + fens)

    console.log(that.data.end_time)
    console.log(parseInt(that.data.end_time))
    let end_m = parseInt(that.data.end_time) //月
    let end_ri = that.data.end_time.split('月')
    let end_d = parseInt(end_ri[1]) //日
    console.log(d)
    let end_shi = that.data.end_time.split('日')
    let end_shis = parseInt(end_shi[1])
    console.log(shis) //时
    let end_fen = that.data.end_time.split(':')
    let end_fens = parseInt(end_fen[1]) //分
    let end_time = y + '/' + end_m + '/' + end_d + " " + end_shis + ":" + end_fens
    console.log(y + '/' + end_m + '/' + end_d + " " + end_shis + ":" + end_fens)

    // if (that.data.dis == true){
    //         return
    // }
    console.log(that.data.stallEndTime)
    let stallEndTime = that.data.stallEndTime

    let data = new Date(stallEndTime)
    let time = data.getTime();
    console.log(time)

    console.log(y + '-' + m + '-' + d + " " + shis + ":" + fens)
    let data1 = new Date(y + '-' + m + '-' + d + " " + shis + ":" + fens)
    let start_times = data1.getTime()
    console.log(start_times)

    let data2 = new Date(y + '/' + end_m + '/' + end_d + " " + end_shis + ":" + end_fens)
    let end_times = data2.getTime();
    console.log(end_times)
    if (start_times > time) {
      wx.showToast({
        title: '开始时间不能大于车位使用时间',
        icon: 'none'
      })
      return
    } else if (end_times > time) {
      wx.showToast({
        title: '到期时间不能大于车位使用时间',
        icon: 'none'
      })
      return
    }
    if (start_times == end_times) {
      wx.showToast({
        title: '请设置有效的时间',
        icon: 'none'
      })
    } else if (app.globalData.mobile == that.data.mobile) {
      console.log(app.globalData.mobile)
      console.log(that.data.mobile)
      wx.showToast({
        title: '固定车位不能授权给自己',
        icon: 'none'
      })
    } else {
      console.log(mobile_verify.test(that.data.mobile))
      that.setData({
        loading_display: true
      })
      api.POST({
        url: app.url.newImpower,
        params: {
          endTime: end_time, //结束时间
          startTime: start_time, //开始时间
          mobile: that.data.mobile, //手机号
          preId: that.data.preId, //车区ID
          preName: that.data.carname, // 车区名称
          stallIds: that.data.stallId, //车位ID
          stallNames: that.data.name, //车位名称
          username: that.data.username, //用户名称
          relationId: that.data.relationId, //关系ID
          relationName: that.data.relationName, //关系名称
        },
        success(res) {
          console.log(res)
          if (res.data.data == true) {
            wx.showToast({
              title: '授权成功',
              icon: 'none'
            })
            wx.setStorageSync('show', '1')
            that.setData({
              loading_display: false
            })
            setTimeout(() => {
              wx.redirectTo({
                url: '/pages/succeedImpower/succeedImpower?start_time=' + that.data.start_time + '&endtime=' + that.data.end_time + '&mobile=' + that.data.mobile + '&username=' + that.data.username + '&relationName=' + that.data.relationName + '&carname=' + that.data.carname + '&name=' + that.data.name + '&stallId=' + that.data.stallId
              })
            }, 1000)
          } else {
            that.setData({
              loading_display: false
            })
            console.log(res.data.message.content)
            if (res.data.message.code == 9000001) {
              wx.showToast({
                title: '开始时间不能大于到期时间',
                icon: 'none'
              })
            } else {
              wx.showToast({
                title: res.data.message.content,
                icon: 'none'
              })
            }
          }
        }
      }, app.token)

    }

  },
  //输入授权人手机号
  put_mobile(e) {
    console.log(e.detail.cursor)
    let that = this
    that.setData({
      mobile: e.detail.value,
      num: e.detail.cursor
    })
    if (that.data.num != 11 || that.data.start_time == '' || that.data.end_time == '' || that.data.ind == -1) {
      that.setData({
        dis: true
      })
    } else {
      that.setData({
        dis: false
      })
    }
  },
  //输入授权备注名
  put_user(e) {
    console.log(e.detail.value)
    let that = this
    that.setData({
      username: e.detail.value
    })
  },
  //选择器取消
  cancel() {
    this.setData({
      show: false
    })
  },
  //调用手机通讯录
  img() {
    console.log('调用开始')
    wx.addPhoneContact({
      firstName: '11',
      success(res) {
        console.log(res)
      },
      fail(res) {
        console.log('失败', res)
      }
    })
  },
  //选择器确定
  confirm() {
    let that = this
    that.setData({
      show: false
    })
    let val = that.data.value
    if (that.data.judge == 1) {
      this.setData({
        time: that.data.times[val[0]],
        hour: that.data.hours[val[1]],
        mins: that.data.min[val[2]],
      })
    } else {
      this.setData({
        end_times: that.data.times[val[0]],
        end_hour: that.data.hours[val[1]],
        end_mins: that.data.min[val[2]],
      })
    }
    if (that.data.judge == 1) {
      that.setData({
        start_time: that.data.time + " " + that.data.hour + ":" + that.data.mins
      })
      if (that.data.num != 11 || that.data.start_time == '' || that.data.end_time == '' || that.data.ind == -1) {
        that.setData({
          dis: true
        })
      } else {
        that.setData({
          dis: false
        })
      }
    } else if (that.data.judge == 2) {
      that.setData({
        end_time: that.data.end_times + " " + that.data.end_hour + ":" + that.data.end_mins
      })
      if (that.data.num != 11 || that.data.start_time == '' || that.data.end_time == '' || that.data.ind == -1) {
        that.setData({
          dis: true
        })
      } else {
        that.setData({
          dis: false
        })
      }
    }

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