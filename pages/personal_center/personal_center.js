// pages/personal_center.js
const app = getApp()
import api from "../../utils/network.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    mobile: '',
    username: '',
    input_value: '',
    input_true: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    that.setData({
      mobile: app.mobile,
      username: app.nickname ? app.nickname : '未设置'
    })
    // api.GET({
    //   url:app.url.choose_user,
    //   success(res){
    //     console.log(res)
    //     if(res.data.data){
    //       that.setData({
    //         mobile: res.data.data.mobile,
    //         username: res.data.data.nickname ? res.data.data.nickname : '未设置'
    //       })
    //     }else{
    //       that.setData({
    //         username: '未设置'
    //       })
    //     }
    //   }
    // },app.token)
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  //设置用户名
  setname() {
    if(app.login == false){
      wx.navigateTo({
        url: '/pages/bindPhone/bind',
      })
      return
    }
    let that = this
    that.setData({
      input_true: true,
      input_value: that.data.username == '未设置' ? '' : that.data.username
    })
    // console.log(that.data.username)
  },
  //输入框输入事件
  input_bind(e) {
    let that = this
    that.setData({
      input_value: e.detail.value
    })
  },
  //确定修改
  name_ok() {
    let that = this
    api.PUT({
      url: app.url.restNickname,
      params: {
        nickname: that.data.input_value
      },
      success(res) {
        console.log(res)
        if (res.data.status == true) {
          wx.showToast({
            title: '修改成功',
            icon:'none'
          })
          that.setData({
            input_true: false,
            username: that.data.input_value
          })
        }else{
          wx.showToast({
            title: res.data.message.content,
            icon:'none'
          })
        }
      }
    }, app.token)
  },
  //取消修改
  name_cancel() {
    let that = this
    that.setData({
      input_true: false
    })
  },
  //绑定手机号
  bind_phone() {
    wx.navigateTo({
      url: '/pages/bindPhone/bind',
    })
  },
  //进入到车牌号管理
  goPlateNumber() {
    if(app.login == false){
      wx.navigateTo({
        url: '/pages/bindPhone/bind',
      })
      return
    }
    wx.navigateTo({
      url: '/pages/plateNumber/plateNumber',
    })
  },
  //进入设置页
  setting() {
    wx.navigateTo({
      url: '../setting/setting',
    })
  },
  //关于凌猫
  aboutLm() {
    wx.navigateTo({
      url: '/pages/aboutLm/aboutLm'
    })
  },
  //拨打电话
  call() {
    wx.makePhoneCall({
      phoneNumber: '01085841631' //仅为示例，并非真实的电话号码
    })
    console.log("拨打400电话 ")
  },
  //用户指南
  goNorth() {
    wx.navigateTo({
      url: '/pages/userNorth/userNorth',
    })
  },
  //投诉建议
  complaint() {
    if(app.login == false){
      wx.navigateTo({
        url: '/pages/bindPhone/bind',
      })
      return
    }
    wx.navigateTo({
      url: '/pages/complaint/complaint',
    })
  }
})