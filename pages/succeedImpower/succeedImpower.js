//获取应用实例
const app = getApp()
//引入network
import api from "../../utils/network.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    carname:'', //车场名称
    name:'', //车位名称
    start_time:'', //开始时间
    endtime:'', //结束时间
    mobile:'', //电话号
    relationName:'', //关系名称
    username:'' ,//被授权人
    stallId:'',//车位ID
    describe:'',//分享的描述
    image:'',//分享的图片路径
    images:'',
    title:'',//分享的标题
    skip:'',//跳转第几页
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
        console.log(options)
        let that = this
    api.POST({
      url: app.url.stall + '?stallIds=' + that.data.stallId + '&mobile=' + that.data.mobile,
      success(res) {
        console.log(res)
        that.setData({
          describe: res.data.data.describe,
          image: res.data.data.image,
          title: res.data.data.describe
        })
        console.log(that.data.describe, that.data.image, that.data.title)
        wx.getImageInfo({
          src: that.data.image,  // 这里填写网络图片路径 
          success: (res) => {
            // 这个是我封装的裁剪图片方法（下面将会说到）
            that.setData({
              image: res.path,
            })
          },
          fail: (err) => {
            console.log(err)
          }
        });
      }
    }, app.token)
        that.setData({
          carname: options.carname,
          name: options.name,
          start_time: options.start_time,
          endtime: options.endtime,
          mobile: options.mobile,
          relationName: options.relationName,
          username: options.username,
          stallId: options.stallId,
          skip: options.skip
        })
  },
// 分享
  // ss(){
  //   let that = this
  //   console.log('分享')

  // },
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
    let that = this
      return {
        title: that.data.title,
        imageUrl: that.data.image,//自定义图片路径，可以是本地文件路径、代码包文件路径或者网络图片路径。支持PNG及JPG。显示图片长宽比是 5:4。
        path: '/pages/home/home?sharetype=1&id=666&name=焦汉斌',
        success: function (res) {
          console.log(res)
        },
      }
  },
})