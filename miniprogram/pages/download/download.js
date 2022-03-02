Page({
  data: {
    fileUrl: ''
  },
  buttonClick() {
    let that = this;
 //读取users表数据
    wx.cloud.callFunction({
      name: "export",
      success(res) {
        console.log("读取成功", res.result.fileID)
        that.getFileUrl(res.result.fileID);
 // that.copyFileUrl()
      },
      fail(res) {
        console.log("读取失败", res)
      }
    })
 // 刷新当前页面
    that.onLoad();
    console.log("页面重载")
  },

 //获取云存储文件下载地址，这个地址有效期一天
  getFileUrl(fileID) {
    let that = this;
    wx.cloud.getTempFileURL({
      fileList: [fileID],
      success: res => {
     // get temp file URL
        console.log("文件下载链接", res.fileList[0].tempFileURL)
        that.setData({
          fileUrl: res.fileList[0].tempFileURL
        })
      },
      fail: err => {
           // handle error
      }
    })
  },
 //复制excel文件下载链接
  copyFileUrl() {
    let that = this
    wx.setClipboardData({
      data: that.data.fileUrl,
      success(res) {
        wx.getClipboardData({
          success(res) {
            console.log("复制成功", res.data) // data
          }
        })
      }
    })
  }
})