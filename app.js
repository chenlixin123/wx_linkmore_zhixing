//app.js
//引入network
App({
  onLaunch: function () {
    let self = this;
  },
  globalData: {},
  log: true,
  loadingText: "加载中请稍候",
  code: null,
  token: null,
  pay: true,
  newUserFlag: "",
  state: "",
  cityId: "",
  prefectureId: "",
  preId: "", //carList
  num: '',
  distance: "", //carList，
  userName: '', //账户名称
  userNames: '', //昵称
  shows: false,
  low: 0,
  mobile: '',
  nickname: '',
  username: '',
  login: false,
  condition:'',
  conditionId:'',
  temp:'',
  pm25:'',
  limit:'',
  tips:'',
  time:'',
  /**
   * 本地服务器
   */

  /**
   * loading加载
   */
  showLoading: function () {
    wx.showLoading({
      title: '数据加载中...',
      mask: true
    });
  },
  /**
   * 提示消息
   */
  showModal: function (content) {
    // 显示模态弹窗
    wx.showModal({
      title: '提示消息',
      content: content,
      showCancel: false
    });
  },
  // onHide:function(){
  //   wx.showModal({
  //     title: '提示消息',
  //     content: content,
  //     showCancel: false
  //   });
  // }
})