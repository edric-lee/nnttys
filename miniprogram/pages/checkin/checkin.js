// pages/checkin/checkin.js
// import { cityData } from './city.js'
const app=getApp
const db=wx.cloud.database()
const student=db.collection('class')

Page({


    /**
     * 页面的初始数据
     */

  
  /**
   * 页面的初始数据
   */
  data: {
    customIndex: [0, 0, 0],
      //当前选中数组
      onlyArray: [
        [],
        [],
        []
      ],
      //customArray假设为我们从后台获取到的json数据
      customArray: [{
          name: '特色课程',
          dept: [{
              name: '科技',
              product: [{
                  name: '科学STEAM'
                },
                {
                  name: '编程'
                },
              ]
            },
            {
              name: '艺术',
              product: [{
                name: '合唱团'
              }, {
                name: '画画'
              }]
            },
            {
              name: '体育',
              product: [{
                name: '足球'
              },{
                name: '跳绳'
              }]
            }
          ]
        },
  
        {
          name: '作业辅导',
          dept: [{
              name: '一年级',
              product: [{
                  name: '1班'
                },
                {
                  name: '2班'
                },
              ]
            },
            {
              name: '二年级',
              product: [{
                  name: '1班'
                },
                {
                  name: '2班'
                },
              ]
            },
  
            {
              name: '短视频',
              product: [{
                name: '微视'
              }]
            }
          ]
        },
      ],
  list: [], 
    idx:'',
    sel1:'',
    week:['星期一','星期三','星期四','星期五'],
    weekId:0,
    date:['选择考勤日期'],
    imgbox: [],//选择图片
    fileIDs: [],//上传云存储后的返回值

  },
  
  selectApply:function(e){
    let id = e.target.dataset.id
    console.log(e.target.dataset.id)
     this.setData({
       idx: id
     })
 },

  change: function(res){  
  var num=res.target.dataset.index;
    console.log(num)

    console.log(this.data.list[num].name)
    console.log(this.data.list[num].check)
    if(this.data.list[num].check=='1'){      
      this.data.list[num].check='0'
      this.setData({
        list:this.data.list
      })
      console.log(this.data.list[num].check)
    }
    else{
      this.data.list[num].check='1'
      this.setData({
        list:this.data.list
      })
      console.log(this.data.list[num].check)
    }


  } , 
    // 点击下拉显示框
    selectTaps() {
      this.setData({
        shows: !this.data.shows,
      });
    },
 

  // 推广类型
  weekTypeChange: function (e) {
    console.log('星期', e.detail.value)
    this.setData({
      weekId: e.detail.value//把当前的触摸的索引给expandTypeID
    })
  },
  //表单提交时间
  teformSubmit(e) {
    let val = e.detail.value
    student.where({
      course:this.data.customIndex[2].label,
      week:val.week
      })
    .orderBy('id','asc')
    .get().then(res=>{
      console.log("查询",res.data)
    var datalist=res.data
    for(var j in datalist) {
      res.data[j]['check']="1"
    }
    var listData = res.data
        this.setData({
          list: listData
        })
    // console.log("查询成功",res.data)
  })    
  },
  checkSubmit(e) {
  
  if(e.detail.value.date=='')
  {
    wx.showToast({
      icon: 'none',
      title: '请选择上课时间'
    });
  }
  else if (!this.data.imgbox.length) {
    wx.showToast({
      icon: 'none',
      title: '图片类容为空'
    });
  } 

  else {
      //上传数据到云存储
      wx.showLoading({
        title: '上传中',
      })
  var checkDate=e.detail.value.date
  var datalist=this.data.list
  for(var j in datalist) {
    db.collection('check').add({
      data:{
        id:datalist[j].id,
        class:datalist[j].class,
        name:datalist[j].name,
        grade:datalist[j].grade,
        course:datalist[j].course,
        week:datalist[j].week,
        check:datalist[j].check,
        gdn:datalist[j].grade+datalist[j].class+datalist[j].name,
        date:checkDate,
        subtime:new Date().toLocaleString().replace(/-/g,"/"),
      }
    })
  }
//上传图片到云存储
      let promiseArr = [];
      for (let i = 0; i < this.data.imgbox.length; i++) {
        promiseArr.push(new Promise((reslove, reject) => {
          let item = this.data.imgbox[i];
          let suffix = /\.\w+$/.exec(item)[0];//正则表达式返回文件的扩展名
          wx.cloud.uploadFile({
            cloudPath: "attendance/"+ new Date().getTime() + suffix, // 上传至云端的路径
            filePath: item, // 小程序临时文件路径
            success: res => {
              this.setData({
                fileIDs: this.data.fileIDs.concat(res.fileID)
              });
              console.log(res.fileID)//输出上传后图片的返回地址
              reslove();
              wx.hideLoading();
              wx.showToast({
                title: "上传成功",
              })
            },
            fail: res=>{
              wx.hideLoading();
              wx.showToast({
                title: "上传失败",
              })
            }

          })
        }));
      }
      Promise.all(promiseArr).then(res => {//等数组都做完后做then方法
        console.log("图片上传完成后再执行")
        this.setData({
          imgbox:[]
        })
      })

    }
        // id,class,name,grade,course,week,check,gdn,date,subtime
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  // 上传图片
// 删除照片 &&
imgDelete1: function (e) {
  let that = this;
  let index = e.currentTarget.dataset.deindex;
  let imgbox = this.data.imgbox;
  imgbox.splice(index, 1)
  that.setData({
    imgbox: imgbox
  });
},
// 选择图片 &&&
addPic1: function (e) {
  var imgbox = this.data.imgbox;
  console.log(imgbox)
  var that = this;
  var n = 5;
  if (5 > imgbox.length > 0) {
    n = 5 - imgbox.length;
  } else if (imgbox.length == 5) {
    n = 1;
  }
  wx.chooseImage({
    count: n, // 默认9，设置图片张数
    sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
    sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
    success: function (res) {
      // console.log(res.tempFilePaths)
      // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
      var tempFilePaths = res.tempFilePaths

      if (imgbox.length == 0) {
        imgbox = tempFilePaths
      } else if (5 > imgbox.length) {
        imgbox = imgbox.concat(tempFilePaths);
      }
      that.setData({
        imgbox: imgbox
      });
    }
  })
},

//图片
imgbox: function (e) {
  this.setData({
    imgbox: e.detail.value
  })
},

onLoad: function(options) {
  var data = {
    customArray: this.data.customArray,
    customIndex: this.data.customIndex,
    onlyArray: this.data.onlyArray,
  };
  for (var i = 0; i < data.customArray.length; i++) {
    data.onlyArray[0].push(data.customArray[i].name);
  }
  for (var j = 0; j < data.customArray[data.customIndex[0]].dept.length; j++) {
    data.onlyArray[1].push(data.customArray[data.customIndex[0]].dept[j].name);
  }
  for (var k = 0; k < data.customArray[data.customIndex[0]].dept[data.customIndex[1]].product.length; k++) {
    data.onlyArray[2].push(data.customArray[data.customIndex[0]].dept[data.customIndex[1]].product[k].name);
  }
  this.setData(data);
},
//多列自定义选择器改变value的方法
bindCustomPickerChange: function(e) {
  var customArray = this.data.customArray,
    customIndex = this.data.customIndex,
    onlyArray = this.data.onlyArray;

  console.log('picker发送选择改变，携带值为', e.detail.value);
  //此处e.detail.value为当前选择的列的下标值数组，如[0,1,0]
  
  console.log('picker最终选择值为：', onlyArray[0][customIndex[0]], onlyArray[1][customIndex[1]], onlyArray[2][customIndex[2]]);
  this.setData({
    customIndex: e.detail.value
  })
},

//多列自创选择器换列方法
bindCustomPickerColumnChange: function(e) {
  var customArray = this.data.customArray,
    customIndex = this.data.customIndex,
    onlyArray = this.data.onlyArray;

  customIndex[e.detail.column] = e.detail.value;
  // console.log(onlyArray);

  var searchColumn = () => {
    for (var i = 0; i < customArray.length; i++) {
      var arr1 = [];
      var arr2 = [];
      if (i == customIndex[0]) {
        for (var j = 0; j < customArray[i].dept.length; j++) {
          arr1.push(customArray[i].dept[j].name);
          if (j == customIndex[1]) {
            for (var k = 0; k < customArray[i].dept[j].product.length; k++) {
              arr2.push(customArray[i].dept[j].product[k].name);
            }
            onlyArray[2] = arr2;
          }
        }
        onlyArray[1] = arr1;
      }
    };
  }

  switch (e.detail.column) {
    case 0:
      customIndex[1] = 0;
      customIndex[2] = 0;
      searchColumn();
      break;
    case 1:
      customIndex[2] = 0;
      searchColumn();
      break;
  }
  this.setData({
    onlyArray: onlyArray,
    customIndex: customIndex
  });
},
//多列自定义选择器改变value的方法
bindCustomPickerChange: function(e) {
  var customArray = this.data.customArray,
    customIndex = this.data.customIndex,
    onlyArray = this.data.onlyArray;

  console.log('picker发送选择改变，携带值为', e.detail.value);
  //此处e.detail.value为当前选择的列的下标值数组，如[0,1,0]
  
  console.log('picker最终选择值为：', onlyArray[0][customIndex[0]], onlyArray[1][customIndex[1]], onlyArray[2][customIndex[2]]);
  this.setData({
    customIndex: e.detail.value
  })
},

//多列自创选择器换列方法
bindCustomPickerColumnChange: function(e) {
  var customArray = this.data.customArray,
    customIndex = this.data.customIndex,
    onlyArray = this.data.onlyArray;

  customIndex[e.detail.column] = e.detail.value;
  // console.log(onlyArray);

  var searchColumn = () => {
    for (var i = 0; i < customArray.length; i++) {
      var arr1 = [];
      var arr2 = [];
      if (i == customIndex[0]) {
        for (var j = 0; j < customArray[i].dept.length; j++) {
          arr1.push(customArray[i].dept[j].name);
          if (j == customIndex[1]) {
            for (var k = 0; k < customArray[i].dept[j].product.length; k++) {
              arr2.push(customArray[i].dept[j].product[k].name);
            }
            onlyArray[2] = arr2;
          }
        }
        onlyArray[1] = arr1;
      }
    };
  }

  switch (e.detail.column) {
    case 0:
      customIndex[1] = 0;
      customIndex[2] = 0;
      searchColumn();
      break;
    case 1:
      customIndex[2] = 0;
      searchColumn();
      break;
  }
  this.setData({
    onlyArray: onlyArray,
    customIndex: customIndex
  });
},





})