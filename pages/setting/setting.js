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
      source: ''
      // version:''
   },


   /**
    * 生命周期函数--监听页面加载
    */

   onLoad: function (options) {
      const that = this;
      wx.getSystemInfo({
         success: function (res) {
            if (res.platform == "ios") {
               that.setData({
                  source: '2'
               })
            }
            if (res.platform == "android") {
               that.setData({
                  source: '2'
               })
            }
         }
      })
      // this.version();
   },
   //关于凌猫
   aboutLm() {
      wx.navigateTo({
         url: '/pages/aboutLm/aboutLm'
      })
   },
   //用户协议
   userAgreement() {
      wx.navigateTo({
         url: '/pages/userAgreement/userAgreement'
      })
   },

   //退出登入
   logout() {
      api.POST({
         url: app.url.loginOut,
         params: {},
         success: function (res) {
            console.log(res.data.status)

            if (res.data.status) {
               console.log("ok")
               wx.removeStorageSync('login-user')
               wx.clearStorageSync();
               app.globalData = '';
               wx.reLaunch({
                  url: '/pages/home/home'
               })
            }
            // else {
            //    app.showModal('请输入昵称');
            // }
         },
         fail: function () { }
      }, app.globalData.token)
   },
   //版本号
   version() {
      const that = this;
      api.GET({
         url: app.url.version + '?source=' + that.data.source,
         params: {},
         success: function (res) {
            that.setData({
               version: res.data.data.version
            })
         },
         fail: function () { }
      }, app.globalData.token)
   }
})