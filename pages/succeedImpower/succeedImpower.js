//获取应用实例
const app = getApp()
//引入network
import api from "../../utils/network.js"

/* 裁剪封面，
   src为本地图片路径或临时文件路径，
   imgW为原图宽度，
   imgH为原图高度，
   cb为裁剪成功后的回调函数
*/
// const clipImage = (src, imgW, imgH, cb) => {

//   // ‘canvas’为前面创建的canvas标签的canvas-id属性值
//   let ctx = wx.createCanvasContext('canvas');
//   let canvasW = 640, canvasH = imgH;
//         // 长宽比大于5:4
//   if (imgW / imgH > 5 / 4) { 
//     canvasW = imgH * 5 / 4;
//   }

//   // 将图片绘制到画布
//   ctx.drawImage(src, (imgW - canvasW) / 2, 0, canvasW, canvasH, 0, 0, canvasW, canvasH)
//   // draw()必须要用到，并且需要在绘制成功后导出图片
//   ctx.draw(false, () => {
//     setTimeout(() => {
//       //  导出图片
//       wx.canvasToTempFilePath({
//         width: canvasW,
//         height: canvasH,
//         destWidth: canvasW,
//         destHeight: canvasH,
//         canvasId: 'canvas',
//         fileType: 'jpg',
//         success: (res) => {
//           // res.tempFilePath为导出的图片路径
//           typeof cb == 'function' && cb(res.tempFilePath);
//         }
//       })
//     }, 1000);
//   })
// }
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
            console.log(res)
            // wx.showToast({
            //   title: '111111111111111',
            // })
            that.setData({
              image: res.path,
            })
            // clipImage(res.path, res.width, res.height, (img) => {
            //   console.log(img);  // img为最终裁剪后生成的图片路径，我们可以用来做为转发封面图
            //   that.setData({
            //     images: img
            //   })
            //   console.log(that.data.images)
            // });
          },
          fail: (err) => {
            console.log(err)
          }
        });
      }
    }, app.token)
    // wx.showShareMenu({
    //   withShareTicket: true
    // })
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