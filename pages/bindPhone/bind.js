//获取应用实例
const app = getApp()
//引入network
import api from "../../utils/network.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    error_text: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
  //跳转手机号登陆注册页面
  goBindPhone() {
    wx.navigateTo({
      url: '/pages/bindPhone/bindPhone',
    })
  },
  //微信快速绑定
  getPhoneNumbers() {
    wx.checkSession({
      success: function (res) {
        console.log(res, "快速绑定")
      },
      fail: function () {}
    })
  },
  //获取用户手机号
  getPhoneNumber: function (e) {
    let that = this
    let iv = e.detail.iv;
    let encryptedData = e.detail.encryptedData;
    console.log(e, "wwwww");
    if (e.detail.errMsg == 'getPhoneNumber:ok') {
      api.POST({
        url: app.url.open_phone,
        params: {
          data: encryptedData,
          iv: iv
        },
        success(res) {
          console.log(res, "获取用户手机号")
          if (!res.data.status) {
            that.setData({
              warnToast: true,
              error_text: res.data.message.content
            });
            setTimeout(() => {
              that.setData({
                hidewarnToast: true
              });
              setTimeout(() => {
                that.setData({
                  warnToast: false,
                  hidewarnToast: false,
                });
                return
              }, 300);
            }, 3000);
          }
          let loginUser = wx.getStorageSync('login-user')
          loginUser.data.mobile = res.data.data;
          try {
            wx.setStorageSync('login-user', {
              data: loginUser.data,
            })
          } catch (e) {}
          let mobile = res.data.data;
          //绑定授权手机号
          api.POST({
            url: app.url.bind_auth_phone + '?mobile=' + mobile,
            params: {},
            success(res) {
              console.log(res, "绑定授权手机号")
              app.newUserFlag = res.data.data.newUserFlag;
              app.globalData = res.data.data;
              if (res.data.status == true) {
                app.login = true
                if (app.newUserFlag == 1) {
                  wx.redirectTo({
                    url: '/pages/plateNumber/addPlate/addPlate',
                  })
                } else if (app.newUserFlag == 0) {
                  api.GET({
                    url: app.url.plate_list,
                    params: {},
                    success: function (res) {
                      console.log("成功", res)
                      if (res.data.data.length == 0) {
                        console.log("没有车牌")
                        wx.redirectTo({
                          url: '/pages/plateNumber/addPlate/addPlate',
                        })
                      } else {
                        app.state = 1;
                        console.log(app.state, "app.state")
                        wx.redirectTo({
                          url: '/pages/index/index',
                        })
                      }
                    },
                    fail: function () {
                      console.log("失败")
                    }
                  }, app.token)
                }
              } else {
                wx.showToast({
                  title: res.data.message.content,
                  icon: "none"
                })
              }
            },
            fail() {
              wx.showToast({
                title: '登录失败',
                icon: 'none'
              })
            }
          }, app.token)
        },
        fail() {

        }
      }, app.token)
    }
  }
})