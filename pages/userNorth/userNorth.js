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
      list:[],
      loading:'block'
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
            if (res.data.status == true) {
              let datas = []
              res.data.data.map(res => {
                  if(res.id == 27){
                    datas.push(res)
                    that.setData({
                      list:datas,
                      loading:'none'
                   })
                  }
              })
            } else {
               wx.showModal({
                  title: '提示消息',
                  content: res.data.message.content,
                  showCancel: false,
                  loading:'none'
               })
            }
         },
         fail: function () { }
      }, app.globalData.token)
   },
   //去预约流程
   entry(e){
     console.log(e)
      let item = e.currentTarget.dataset.item;
     let url = e.currentTarget.dataset.url
      if(item == '10'){
        // 跳转常见问题
              wx.navigateTo({
            url: '/pages/questions/questions?id=' + item,
         })
      }else{
        wx.navigateTo({
          url: '/pages/process/process?id=' + item +'&url=' + url,
        })
      }
   }
  
})