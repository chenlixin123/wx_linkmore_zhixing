// pages/bindPhone/bindPhone.js
//获取应用实例
const app = getApp()
//引入network
import api from "../../utils/network.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    readFlag: false, //是否已读
    btnDesc: "获取验证码",
    codeBtn: true, //获取验证码按钮flag
    resetFlag: "none", //清空手机号flag
    second: 60,
    subFlag: false //确定按钮flag
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
    console.log(app.token)
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
  //是否已读
  readFlag() {
    this.setData({
      readFlag: !this.data.readFlag,
      subFlag: !this.data.subFlag,
    })
    if (this.data.subFlag == true) {
      this.setData({
        backs: "background: #e7e7e7 !important;"
      })
    } else {
      this.setData({
        backs: "background: #f66913 !important;"
      })
    }
  },
  //输入手机号
  inPhone(e) {
    console.log(e.detail.value)
    this.setData({
      userPhone: e.detail.value,
    })
    let myreg = /^[1][3,4,5,7,8][0-9]{9}$/;
    if (e.detail.value != "" && myreg.test(e.detail.value)) {
      console.log('11111111')
      this.setData({
        resetFlag: "block", //清楚已输入手机号和获取验证码的flag,
        back: "background: #f66913 !important;",
        codeBtn: false
      })
    } else {
      console.log('22222222222')
      this.setData({
        resetFlag: "none", //清楚已输入手机号和获取验证码的flag,
        codeBtn: true
      })
      if (this.data.second == 60) {
        this.setData({
          back: "background: #e7e7e7 !important;",
        })
      }
    }
  },
  //用户验证码
  userCodes(e) {
    // if (this.data.readFlag == false){
    //   this.setData({
    //     subFlag: false
    //   })
    // }
  },
  inCodes(e) {
    console.log(e)
    if (e.detail.value != "" && this.data.readFlag == false && e.detail.cursor == 4) {
      this.setData({
        subFlag: false,
        backs: "background: #f66913 !important;", //按钮可以点击时的样式
        userCode: e.detail.value
      })
    } else {
      this.setData({
        subFlag: true,
        backs: "background: #e7e7e7 !important;", //按钮不可以点击时的样式
        userCode: e.detail.value
      })
    }
  },
  //获取验证码
  getCode() {
    let self = this;
    self.setData({
      codeBtn: true
    })
    if (self.data.second == 1) {
      self.setData({
        second: 60
      })
    }
    let codeTime = null;
    codeTime = setInterval(function () {
      if (self.data.second == 1) {
        clearInterval(codeTime);
        self.setData({
          btnDesc: "重发验证码",
          codeBtn: false
        })
      } else {
        self.data.second--;
        let btnDesc = self.data.second + "s";
        self.setData({
          btnDesc: btnDesc,
          //resetFlag: "none",//清楚已输入手机号和获取验证码的flag,
        })
      }
    }, 1000)
    api.GET({
      url: app.url.send_code + '?mobile=' + self.data.userPhone,
      success: function (res) {
        console.log(res)
        if (res.data.status == true) {
          wx.showToast({
            title: '短信发送成功',
          })
        } else {
          wx.showToast({
            title: '短信发送失败',
            icon: 'none'
          })
        }

      },
      fail: function () {
        wx.showToast({
          title: '短信发送失败',
        })
      }
    }, app.token)
  },
  //清空已输入手机号
  resetPhone() {
    if (this.data.second != 60) {
      console.log("清空已输入手机号");
      this.setData({
        back: "background: #f66913 !important",
      })
    } else {
      this.setData({
        back: "background: #e7e7e7",
      })
    }
    this.setData({
      userPhone: "",
      resetFlag: "none", //清楚已输入手机号和获取验证码的flag,
      codeBtn: true
    })
  },
  userCode() {},
  //点击确定
  bindPhone() {
    let self = this;
    if (!self.data.userPhone) {
      wx.showModal({
        title: '提示消息',
        content: '请填写手机号',
        showCancel: false
      })
      return
    }
    if (!self.data.userCode) {
      wx.showModal({
        title: '提示消息',
        content: '请填写验证码',
        showCancel: false
      })
      return
    }
    let userCode = this.data.userCode;
    let userPhone = this.data.userPhone;
    api.PUT({
      url: app.url.bind_phone,
      params: {
        code: userCode,
        mobile: userPhone
      },
      success: function (res) {
        console.log(res)
        if (res.data.status == true) {
          let globalData = res.data.data;
          wx.setStorage({
            key: 'codeMsgs',
            data: res.data.data,
          })
          app.globalData = res.data.data;
          self.setData({
            globalData: globalData
          })
          console.log(app.globalData);
          //操作成功进入首页
          wx.reLaunch({
            url: '/pages/index/index',
          })
        } else {
          wx.showModal({
            title: '提示消息',
            content: res.data.message.content,
            showCancel: false
          })
        }
      },
      fail: function () {

      }
    }, app.token)
  },
  //跳转约车条款页面
  goClause() {
    wx.navigateTo({
      url: '/pages/carClause/carClause',
    })
  }

})