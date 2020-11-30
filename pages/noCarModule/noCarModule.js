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
      show:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  btn(){
      // console.log('11111111111111')
      let that = this
      api.GET({
        url: app.url.plate_list,
        success(res) {
          console.log(res)
          if(res.data.data.length >= 3){
              that.setData({
                show:true
              })
          }else{
            wx.redirectTo({
              url: '/pages/plateNumber/addPlate/addPlate?num=1',
            })
          }
        }
      },app.token)
  },
  btns(){
    let that = this
    that.setData({
      show: false
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

  }
})