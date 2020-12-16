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
      url:''
   },

   /**
   * 生命周期函数--监听页面加载
   */
   onLoad: function (options) {
     console.log(options)
      let that = this; 
      let url = options.url;
      that.setData({
        url:url
      })
   }
})