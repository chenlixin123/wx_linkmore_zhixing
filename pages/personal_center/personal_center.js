// pages/personal_center.js
const app = getApp()
import api from "../../utils/network.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    mobile:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    that.setData({
      mobile:app.mobile
    })
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
  //绑定手机号
  bind_phone() {
    wx.navigateTo({
      url: '/pages/bindPhone/bind',
    })
  },
     //进入到车牌号管理
     goPlateNumber() {
      wx.navigateTo({
         url: '/pages/plateNumber/plateNumber',
      })
   },
})