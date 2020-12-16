// pages/userNorth/questions/questions.js
const app = getApp()
//引入network
import api from "../../utils/network.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
     list:[]
  },
   /**
   * 生命周期函数--监听页面加载
   */
   onLoad: function (options) {
      const that = this;
      api.GET({
         url: app.url.questions,
         params: {},
         success: function (res) {
            const data = res.data.data;
            console.log(data)
            for(var i=0; i<data.length; i++){
               if(data[i].id == 10 ){
                  that.setData({
                     list: data[i].children
                  })
               }
            }
         },
         fail: function () { }
      }, app.globalData.token)
   },
  //进入问题描述页面
  entry(e){
    
      var url = e.currentTarget.dataset.url;
    console.log(url)
      wx.navigateTo({
         url: "/pages/quesDetail/quesDetail?url=" + url
       
      });
  }
})