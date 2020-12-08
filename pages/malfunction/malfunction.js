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
    number: 0,
    value: '',
    numbers: 30,
    classe: 'titles_one',
    classee: 'titles_two',
    show: false,
    show1: false,
    val: '',
    title: '',
    stallId: '',
    causeList: [],
    id: '',
    index: '',
    indexs: '11',
    ss: '提交成功，请联系工作人员',
    ff:true,
    loading_display:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this;
    console.log(options)
    that.setData({
      stallName: options.val,
      loading_display:true
    })
    let orderId = options.stallId;
    let causeList = [];
    api.GET({
      url: app.url.long_Feedbacks,
      params: {},
      success(res) {
        console.log(res)
        causeList = res.data.data;
        that.setData({
          causeList: causeList,
          orderId: orderId,
          loading_display:false
        })
      }
    }, app.globalData.token)
    console.log(options.val, options.stallId)
    that.setData({
      title: options.val,
      stallId: options.stallId
    })
  },
  value(e) {
    let that = this
    that.setData({
      value: e.detail.value,
      number: e.detail.value.length
    })
  },
  nei_border(e) {
    this.setData({
      id: e.target.dataset.id,
      index: e.target.dataset.index,
      indexs: e.target.dataset.index,
      val: e.target.dataset.name,
      ff:false
    })
    console.log(e)
  },
  btn() {
    let that = this
    if (that.data.id == "") {
      wx.showToast({
        title: '请选择故障原因',
        icon: 'none'
      })
    } else {
      that.setData({
        ff:true
      })
      if (that.data.id == 102) {
        // console.log('其他')
        if (that.data.value != "") {
          console.log('提交成功')
          console.log(that.data.stallId)
          api.POST({
            url: app.url.long_Feedback,
            params: {
              dictId: that.data.id,
              dictName: that.data.val,
              extra: that.data.value,
              stallId: that.data.stallId
            },
            success(res) {
              console.log(res)
              if (res.data.status == true) {
                if (res.data.data == true) {
                  that.setData({
                    show: true,
                    ss: '提交成功，请联系工作人员',
                  })
                } else {
                  that.setData({
                    show: true,
                    ss: "提交失败，请联系工作人员"
                  })
                }
              } else {
                that.setData({
                  show: true,
                  ss: "提交失败，请联系工作人员"
                })
              }
            }
          }, app.token)
        } else {
          wx.showToast({
            title: '请填写详细描述',
            icon: 'none'
          })
          that.setData({
            ff:false
          })
        }

      } else {
        console.log("别的选项")
        console.log(that.data.stallId)
        api.POST({
          url: app.url.long_Feedback,
          params: {
            dictId: that.data.id,
            dictName: that.data.val,
            extra: that.data.value,
            stallId: that.data.stallId
          },
          success(res) {
            console.log(res)
            if (res.data.status == true) {
              if (res.data.data == true) {
                that.setData({
                  show: true,
                  ss: '提交成功，请联系工作人员',
                  id:''
                })
              } else {
                that.setData({
                  show: true,
                  ss: "提交失败，请联系工作人员",
                  id:''
                })
              }
            } else {
              that.setData({
                show: true,
                ss: "提交失败，请联系工作人员",
              })
            }
          }
        }, app.token)
      }
    }
  },
  que() {
    let that = this
    that.setData({
      show: false,
      value: '',
      indexs: '11',
      number: 0
    })
    wx.navigateBack({
      
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})