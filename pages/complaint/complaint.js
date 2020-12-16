// pages/complaint/complaint.js
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
    descNum: 0,
    btnFlag: true,
    loading_display:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  //输入建议
  inDesc(e) {
    let descNum = e.detail.value.length;
    console.log(descNum)
    let descTxt = e.detail.value;
    if(descNum > 0){
      this.setData({
        descNum: descNum,
        btnFlag: false,
        descTxt: descTxt
      })
    }else{
      this.setData({
        descNum: descNum,
        btnFlag: true,
        descTxt: descTxt
      })
    }
  },
  //提交建议
  switchs() {
    let that = this
    that.setData({
      loading_display:true
    })
    const descTxts = this.data.descTxt; //其他原因的内容
    console.log(descTxts)
    api.POST({
      url: app.url.complaint,
      params: {
        content: descTxts
      },
      success(res) {
        console.log(res)
        if (res.data.data == '保存成功') {
          wx.showToast({
            icon: 'none',
            title: '提交成功',
          })
          setTimeout(() => {
            wx.reLaunch({
              url: '/pages/index/index',
            })
          }, 1000)
        } else {
          wx.showToast({
            title: res.data.message.content,
            icon: 'none',
          })
        }
        that.setData({
          loading_display:false
        })
      },
      fail() {
        that.setData({
          loading_display:false
        })
      }
    }, app.token)
  }
})