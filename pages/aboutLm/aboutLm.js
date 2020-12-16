// pages/aboutLm/aboutLm.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },
  //拨打电话
  call() {
    wx.makePhoneCall({
      phoneNumber: '01085841631' //仅为示例，并非真实的电话号码
    })
    console.log("拨打400电话 ")
  }

})