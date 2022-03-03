// pages/home/home.js
const db = wx.cloud.database()
const userInfo = db.collection('userInfo')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    openid:"",
    //判断小程序的API，回调，参数，组件等是否在当前版本可用。
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    isHide: false,
  }, 

  // travel: function () {
  //   wx.navigateTo({
  //     url: '../checkin/checkin'
  //   })
  // },
  account: function () {
    wx.navigateTo({
      url: '../checkin/checkin'
    })
  },
  // process: function () {
  //   wx.navigateTo({
  //     url: '../process/process'
  //   })
  // },
  // invoice:function(){
  //   wx.navigateTo({
  //     url: '../invoice/invoice'
  //   })
  // },
  // tool: function () {
  //   wx.navigateTo({
  //     url: '../tool/tool'
  //   })
  // },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.getSystemInfo({
      success: res => {
        //导航高度
        this.setData({
          winH:res.windowHeight
        })

        
      }, fail(err) {
        console.log(err);
      }
    })
    // this.setData({
    //   winH: app.globalData.windowHeight
    // });
    var that = this;
    // 查看是否授权
    wx.getSetting({
      success: function (res) {
        if (res.authSetting['scope.userInfo']) {
          wx.cloud.callFunction({
            name: 'getOpenid',
            complete: res => {
              that.setData({
                openid: res.result.openid
              })
              wx.setStorageSync("openid", res.result.openid);
             
            }
          })
        } else {
          // 用户没有授权
          // 改变 isHide 的值，显示授权页面
          that.setData({
            isHide: true
          });
        }
      }
    });
  },
  bindGetUserInfo: function (e) {
    if (e.detail.userInfo) {
      wx.cloud.callFunction({
        name: 'getOpenid',
        complete: res => {
          this.setData({
            openid: res.result.openid
          })
          wx.setStorageSync("openid", res.result.openid);
          console.log(res.result.openid)
          console.log(e.detail.userInfo)
          // var countNum=userInfo.where({
          //   _openid: res.result.openId
          // }).count().then(res=>{
          //   console.log(countNum)
          // });
          //console.log(res.result)
          userInfo.where({
            _openid: res.result.openid
          }).count().then(res => {
            if (res.total == 0) {
              userInfo.add({
                data: e.detail.userInfo
              }).then(res => {
                console.log(res)
              }).catch(err => {
                console.error(err)
              })
            }
          })
        }
      })
      //用户按了允许授权按钮
      var that = this;
      // 获取到用户的信息了，打印到控制台上看下
      // console.log("用户的信息如下：");
      // console.log(e.detail.userInfo);
      //授权成功后,通过改变 isHide 的值，让实现页面显示出来，把授权页面隐藏起来
      that.setData({
        isHide: false
      });
    } else {
      //用户按了拒绝按钮
      wx.showModal({
        title: '警告',
        content: '您点击了拒绝授权，将无法进入小程序，请授权之后再进入!!!',
        showCancel: false,
        confirmText: '返回授权',
        success: function (res) {
          // 用户没有授权成功，不需要改变 isHide 的值
          if (res.confirm) {
            console.log('用户点击了“返回授权”');
          }
        }
      });
    }
  }
})