
const app = getApp();
// console.log(app)
var requestHandler = {
  url: '',
  params: {},
  success: function(res) {
    // success
  },
  fail: function() {
    // fail  
  },
  complete: function() {
    //complete
  }
}
//GET请求  
function GET(requestHandler, headers) {
  request('GET', requestHandler, headers)
  // console.log(headers)
}
//POST请求
function POST(requestHandler, headers) {
  request('POST', requestHandler, headers)
}
//PUT请求
function PUT(requestHandler, headers) {
  request('PUT', requestHandler, headers)
}
//DELETE请求
function DELETE(requestHandler, headers) {
  request('DELETE', requestHandler, headers)
}
let questFlag = false;

function request(method, requestHandler, headers) {
  var params = requestHandler.params;
  var API_URL = requestHandler.url;
  app.requestTask = wx.request({
    url: API_URL,
    data: params,
    method: method, // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT  appointmentappointment
    header: {
      "Content-Type": "application/json",
      "Accept": "application/json",
      "X-Access-Auth-Token": headers ? headers : "",
      "os": "0"
    },
    success: function(res) {
      requestHandler.success && requestHandler.success(res);
      // console.log(res);
      if (res.data.status == false && res.data.message.code == 404) {
        wx.showToast({
          title: '该服务未在线',
          icon: 'none'
        })
      } else if (res.data.status == false && res.data.message.code == 500) {
        wx.showToast({
          title: '服务异常',
          icon: 'none'
        })
        // console.log('服务异常了‘’‘’‘’‘’‘’‘’‘’‘’‘’‘’‘’‘’‘')
      }
      // if (res.data.status == false && res.data.message.code == 9002000) {
      //     wx.login({
      //       success: res => {
      //         console.log(res)
      //         app.code = res.code;
      //         wx.request({
      //           url: app.url.vx_login,
      //           data: {
      //             code: res.code,
      //             alias:'1001'
      //           },
      //           method: "GET",
      //           header: {
      //             "Content-Type": "application/json",
      //             "Accept": "application/json",
      //             "X-Access-Auth-Token": "",
      //             "os": "0"
      //           },
      //           success: function (res) {
      //             console.log(res)
      //             app.globalData = res.data.data;
      //             app.token = res.data.data.token;
      //           },
      //           complete() {
      //             if (questFlag == false) {
      //               request(method, requestHandler, app.token);
      //               questFlag = true;
      //             }
      //           }
      //         })
      //       }
      //     })
      // }

    },
    fail: function() {
      requestHandler.fail && requestHandler.fail()
    },
    complete: function() {
      requestHandler.complete && requestHandler.complete();
      wx.getNetworkType({
        success: function(res) {
          // console.log(res)
          if (res.networkType == 'none') {
            wx.showToast({
              title: '请检查网络并重试',
              icon: 'none'
            })
          }
        },
      })
    }
  })
}
Changeurl()
function Changeurl(test) {
  // https://api.linkmoretech.cn/api 线上
  // http://test-api.linkmoretech.cn/api  测试
  let domin = 'http://test-api.linkmoretech.cn/api'; 
  app.url = {
    ress: ".net",
    //出口
    exit: domin + '/prefecture/app/prefectures/v2.0/entrance-list',
    //刷新
    refresh: domin + '/prefecture/app/prefectures/v2.0/free/list',
    //城市列表
    city_list: domin + '/common/app/citys/v2.0/list',
    //车区列表
    car_list: domin + '/prefecture/app/prefectures/v2.0/map/list',
    //车区详情
    car_detiles: domin + '/prefecture/app/prefectures/v2.0/detail',
    //小程序登陆
    vx_login: domin + '/account/app/mini/v3.0/login',
    //发送验证码
    send_code: domin + '/account/app/mini/v2.0/sms',
    //解密手机号
    open_phone: domin + '/account/app/mini/v2.0/decrypt/mobile',
    //绑定授权手机号
    bind_auth_phone: domin + '/account/app/mini/v2.0/bind',
    //绑定普通手机号
    bind_phone: domin + '/account/app/mini/v2.0/bind',
    //车区计费详情
    price_desc: domin + '/prefecture/app/prefectures/v2.0/strategy',
    //品牌车区计费
    brand_price_desc: domin + '/enterprise/app/brand-pre/v2.0/strategy',
    //车牌列表
    plate_list: domin + '/account/app/plate-numbers/v2.0/list',
    //新增车牌
    add_plate: domin + '/account/app/plate-numbers/v2.0/save',
    //删除车牌
    del_plate: domin + '/account/app/plate-numbers/v2.0/delete',
    //预约车位
    create: domin + '/order/app/order/v2.0/create',
    //品牌预约
    brand_create: domin + '/order/app/order/v2.0/brand-create',
    //切换车位
    switchs: domin + '/order/app/order/v2.0/switch',
    //当前订单
    current: domin + '/order/app/order/v2.0/current',
    //订单详情
    detail: domin + '/order/app/order/v2.0/detail',
    //取消订单
    cancel: domin + '/order/app/order/v2.0/cancel',
    //降下地锁
    down_lock: domin + '/order/app/order/v2.0/down',
    //降锁回调
    lock_result: domin + '/order/app/order/v2.0/down/result',
    //用户已完成订单列表
    by_list: domin + '/order/app/order/v2.0/list',
    //切换车位
    by_switch: domin + '/order/app/order/v2.0/switch',
    //切换车位回调
    switch_result: domin + '/order/app/order/v2.0/switch/result',
    //生成订单
    create_bill: domin + '/order/app/pay/v2.0/checkout',
    //确认支付
    pay_true: domin + '/order/app/pay/v2.0/confirm',
    //校验支付
    pay_check: domin + '/order/app/pay/v2.0/verify',
    //账户下停车券
    car_ticket: domin + '/coupon/app/coupons/v2.0/usable',
    //支付可用停车券
    pay_ticket: domin + '/coupon/app/coupons/v2.0/payment',
    //查询降锁异常原因
    cause_list: domin + '/common/app/dicts/v2.0/cause/switch',
    //投诉建议
    complaint: domin + '/account/app/feedback/v2.0/save',
    //常见问题
    questions: domin + '/account/app/user-guide/list',
    //开屏广告
    brandFlag: domin + '/enterprise/app/brands/v2.0/brand-ad',
    //品牌空闲车位数刷新
    refreshBrand: domin + '/enterprise/app/brand-pre/v2.0/free/list',
    //品牌车区信息
    brandMapList: domin + '/enterprise/app/brand-pre/v2.0/map/list',
    //品牌车区刷新
    brandFresh: domin + '/enterprise/app/brand-pre/v2.0/free/list',
    //品牌车区广告详情
    brandPre: domin + '/enterprise/app/brands/v2.0/brand-pre-ad',
    //消息列表
    message: domin + '/account/app/notice/list',
    //重置账户名称
    restName: domin + '/account/app/users/v2.0/realname',
    //重置昵称
    restNickname: domin + '/account/app/users/v2.0/nickname',
    //车辆品牌
    carBrand: domin + '/common/app/vehicle-brands/v2.0/list',
    //消息阅读
    read: domin + '/account/app/notice/read',
    //消息是否已阅
    updateRead: domin + '/account/app/notice/update-read',
    //退出登入
    loginOut: domin + '/account/app/auth/v2.0/logout',
    //版本号
    version: domin + '/common/app/versions/v2.0/current',
    //获取空闲车位列表
    stallList: domin + '/prefecture/app/prefectures/v2.0/stall-list',
    //选择车位预约下单
    Create_Submit: domin + '/order/app/order/v2.1/create',
    //是否为长租用户
    owner: domin + '/enterprise/app/owner-stall/v2.0/owner',
    //获取长租车位列表
    OwnerStall_list: domin + "/enterprise/app/owner-stall/v2.0/list",
    //长租用户操作车位锁
    control: domin + "/enterprise/app/owner-stall/v2.0/control",
    //查看操作结果
    watch: domin + "/enterprise/app/owner-stall/v2.0/watch",
    //车区分组计费
    group_strategy: domin + "/prefecture/app/prefectures/v2.0/group_strategy",
    //用户操作车位锁
    controls: domin + "/prefecture/app/stall/v2.0/control",
    //扫码降锁下单后操作车位锁
    down_control: domin + "/prefecture/app/stall/v2.0/down-control",
    //降下地锁预约下单
    creates: domin + "/order/app/order/v2.2/create",
    //当前车牌是否可预约
    check_plate: domin + "/prefecture/app/prefectures/v2.0/check-plate",
    //查询用户详情
    choose_user: domin + "/account/app/users/v2.0/detail",
    //修改车辆品牌信息
    vehicle: domin + "/account/app/users/v2.0/vehicle",
    //查询用户是否有长租车位（新）
    choose_carModule: domin + "/enterprise/app/user-rent-stall/v2.0/owner",
    //获取长租用户车位列表(新)
    // long_carList: domin + "/enterprise/app/user-rent-stall/v2.0/list",
    //长租用户操作车位锁（新）
    long_control: domin + "/enterprise/app/user-rent-stall/v2.0/control",
    //查询当前是否有使用长租车位(新)
    long_current: domin + "/enterprise/app/user-rent-stall/v2.0/current",
    //故障车位上报
    long_Feedback: domin + "/account/app/fault-stall/feedback/v2.0/save",
    //获取长租用户降锁失败原因
    long_Feedbacks: domin + "/common/app/dicts/v2.0/cause/fault",
    //用户操作降锁
    control_down: domin + "/order/app/order/v2.0/control-down",
    //切换车位
    switchTab: domin + "/order/app/order/v2.1/switch",
    //切换用户性别
    sex: domin + "/account/app/users/v2.0/sex",
    // 长租车位列表
    long_carList2: domin + "/enterprise/app/user-rent-stall/v2.0.2/list",
    // long_carLists: domin + "/enterprise/app/user-rent-stall/v2.0.1/list",
    //长租用户操作车位锁
    long_controls: domin + "/enterprise/app/user-rent-stall/v2.0/control-auth",
    //首页是否显示授权
    show_impower: domin + "/enterprise/app/user-rent-stall/v2.0/auth-flag",
    //停车记录
    record: domin + "/enterprise/app/user-rent-stall/v2.0/parking-record",
    //授权人授权记录列表
    user_impower: domin + "/enterprise/app/auth-record/v2.0/list",
    //查询用户可授权的车位
    sure: domin + "/enterprise/app/user-rent-stall/v2.0/auth-stall",
    //亲属关系
    friends: domin + "/common/app/dicts/v2.0/relation/code",
    //新增授权接口
    newImpower: domin + "/enterprise/app/auth-record/v2.0/save",
    //修改授权接口
    update: domin + "/enterprise/app/auth-record/v2.0/update",
    //取消授权接口
    cancels: domin + "/enterprise/app/auth-record/v2.0/cancel",
    //分享车位接口
    stall: domin + "/enterprise/app/auth-record/v2.0/share-stall",
  }
}
function Time(number){
  let date = new Date(number)
  let Y = date.getFullYear();
  let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
  let D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
  let h = date.getHours() < 10 ? '0' + date.getHours() : date.getHours();
  let m = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()

  return Y + '-' + M + '-' + D + ' ' + h + ':' + m
}
function Times(number){
  let date = new Date(number)
  let Y = date.getFullYear();
  let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
  let D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
  let h = date.getHours() < 10 ? '0' + date.getHours() : date.getHours();
  let m = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()

  return Y + '-' + M + '-' + D 
}
module.exports = {
  GET: GET,
  POST: POST,
  PUT: PUT,
  DELETE: DELETE,
  Changeurl: Changeurl,
  Time:Time,
  Times:Times
}