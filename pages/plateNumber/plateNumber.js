// pages/plateNumber/plateNumber.js
const app = getApp()
import api from "../../utils/network.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    plateList: [], //车牌列表
    shows1: false,
    names: '',
    battery: '',
    gatewayStatus: '',
    data: [],
    shows2: false,
    nums: '',
    id: '',
    //本地经纬度
    location: {
      longitude: "116.41361",
      latitude: "39.91106"
    },
    context: '确定删除车牌号',
    hidden: 'none',
    shows3: false,
    plateid: '',
    loading: 'block'
  },
  onLoad: function (options) {
    let self = this;
    api.GET({
      url: app.url.plate_list, //车牌列表
      params: {},
      success(res) {
        let plateList = res.data.data;
        self.setData({
          plateList: plateList,
          data: res.data.data,
          loading: 'none'
        })
      },
      fail() {

      },
      complete() {

      }
    }, app.globalData.token)
  },

  xiao() {
    this.setData({
      shows1: false,
      shows2: false,
      shows3: false
    })
  },

  //跳转正在使用的车位
  sheng() {
    let that = this
    that.setData({
      shows1: false
    })
    let longitude = that.data.location.longitude;
    let latitude = that.data.location.latitude;
    api.POST({
      url: app.url.long_carList, //查看长租用户车位列表
      params: {
        latitude: latitude,
        longitude: longitude
      },
      success(res) {
        console.log(res, "changzudexinxi", res.data.message)
        res.data.data.res.map((res) => {
          that.setData({
            preName: res.preName
          })
          let datas = res.stalls
          datas.map((reson) => {
            console.log(reson)
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
            title: res.data.data.message.content,
            icon: 'none'
          }),
          self.setData({
            loading: 'none'
          })
      }
    }, app.token)
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
  //添加车牌
  goAddPlate() {
    if (this.data.plateList.length == 3) {
      wx.showToast({
        title: '您已经添加三个车牌号，如果您需要添加新的车牌号，请先删除一个不常用的车牌！',
        icon: 'none'
      })
    } else {
      wx.redirectTo({
        url: '/pages/plateNumber/addPlate/addPlate?type=0'
      })
    }
  },
  qu() {
    this.setData({
      hidden: 'none'
    })
  },
  que() {

  },
  //删除车牌
  delPlate(e) {
    let self = this;
    let ss = []
    self.data.data.map((res) => {
      console.log(res)
      if (res.vehMark == e.target.dataset.platenumber && res.rentPlateFlag == true) {
        ss.push(res.vehMark)
      }
    })
    console.log(ss[0])
    console.log(e.target.dataset.platenumber)
    let oo = wx.getStorageSync('oo')
    console.log(oo)
    let preName = wx.getStorageSync('preName')
    let stallName = wx.getStorageSync('stallName')
    if (e.target.dataset.platenumber == ss[0]) {
      let num = e.currentTarget.dataset.platenumber;
      let plateid = e.currentTarget.dataset.plateid;
      self.setData({
        context: '确定删除车牌号[' + num + ']' + '?\r\n删除后将失去固定车位地锁使用权限',
        shows3: true,
        plateid: plateid
      })
    } else {
      let num = e.currentTarget.dataset.platenumber;
      let plateid = e.currentTarget.dataset.plateid;
      self.setData({
        context: '确定删除车牌号[' + num + ']' + '?',
        shows3: true,
        plateid: plateid
      })
    }
  },
  dels() {
    let self = this
    self.setData({
      shows3: false
    })
    api.DELETE({
      url: app.url.del_plate + '?id=' + self.data.plateid,
      params: {},
      success(res) {
        console.log(res);
        if (res.data.status == true) {
          wx.showToast({
            title: '删除成功',
            icon: 'none'
          })
          self.onLoad()
        } else {
          wx.showToast({
            title: res.data.message.content,
            icon: 'none'
          })
        }
      },
      fail() {
        wx.showToast({
          title: '删除失败',
          icon: 'none'
        })
      },
      complete() {

      }
    }, app.globalData.token)
  }
})