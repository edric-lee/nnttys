// pages/checkin/checkin.js
// import { cityData } from './city.js'
const app=getApp
const db=wx.cloud.database()
const student=db.collection('class')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    multiArray: [{
      id: 1,
      label: "特色课程",
      children: [{
          id: 2,
          label: "科技",
          children: [{
              id: 3,
              label: "科学STEM",
            },
            {
              id: 4,
              label: "黄埔",
            },
            {
              id: 5,
              label: "徐汇",
            },
          ],
        },
        {
          id: 7,
          label: "艺术",
          children: [{
              id: 8,
              label: "南京",
            },
            {
              id: 9,
              label: "苏州",
            },
            {
              id: 10,
              label: "无锡",
            },
          ],
        },
        {
          id: 12,
          label: "体育",
          children: [{
              id: 13,
              label: "杭州",
            },
            {
              id: 14,
              label: "宁波",
            },
            {
              id: 15,
              label: "嘉兴",
            },
          ],
        },
      ],
    },
    {
      id: 17,
      label: "作业辅导",
      children: [{
          id: 18,
          label: "一年级",
          children: [{
              id: 19,
              label: "西安",
            },
            {
              id: 20,
              label: "延安",
            },
          ],
        },
        {
          id: 21,
          label: "二年级",
          children: [{
              id: 22,
              label: "乌鲁木齐",
            },
            {
              id: 23,
              label: "克拉玛依",
            },
          ],
        },
        {
          id: 21,
          label: "三年级",
          children: [{
              id: 22,
              label: "乌鲁木齐",
            },
            {
              id: 23,
              label: "克拉玛依",
            },
          ],
        },{
          id: 21,
          label: "四年级",
          children: [{
              id: 22,
              label: "乌鲁木齐",
            },
            {
              id: 23,
              label: "克拉玛依",
            },
          ],
        },{
          id: 21,
          label: "五年级",
          children: [{
              id: 22,
              label: "乌鲁木齐",
            },
            {
              id: 23,
              label: "克拉玛依",
            },
          ],
        },{
          id: 21,
          label: "六年级",
          children: [{
              id: 22,
              label: "乌鲁木齐",
            },
            {
              id: 23,
              label: "克拉玛依",
            },
          ],
        },
      ],
    },
  ],
  multiIndex: [0, 0, 0],
  multiIds: [],
  newArr: [],
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
    console.log(this.data.multiIds[2])
    console.log(e.detail.value)
    // let val = e.detail.value

    student.where({
      class:this.data.multiIds[2],
      week:e.detail.value
    })
    .orderBy('id','asc')
    .get().then(res=>{
      // console.log("查询",res.data)
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
bindMultiPickerChange(e) {
  console.log(this.data.multiIds);
},
bindMultiPickerColumnChange(e) {
  let data = {
    newArr: this.data.newArr,
    multiIndex: this.data.multiIndex,
    multiIds: this.data.multiIds,
  };
  data.multiIndex[e.detail.column] = e.detail.value;

  let searchColumn = () => {
    let arr1 = [];
    let arr2 = [];
    this.data.multiArray.map((v, vk) => {
      if (data.multiIndex[0] === vk) {
        data.multiIds[0] = {
          ...v,
        };
        v.children.map((c, ck) => {
          arr1.push(c.label);
          if (data.multiIndex[1] === ck) {
            data.multiIds[1] = {
              ...c,
            };
            c.children.map((t, vt) => {
              arr2.push(t.label);
              if (data.multiIndex[2] === vt) {
                data.multiIds[2] = {
                  ...t,
                };
              }
            });
          }
        });
      }
    });
    data.newArr[1] = arr1;
    data.newArr[2] = arr2;
  };
  switch (e.detail.column) {
    case 0:
      // 每次切换还原初始值
      data.multiIndex[1] = 0;
      data.multiIndex[2] = 0;
      // 执行函数处理
      searchColumn();
      break;
    case 1:
      data.multiIndex[2] = 0;
      searchColumn();
      break;
  }
  this.setData(data);
},

/**
 * 生命周期函数--监听页面加载
 */
onLoad: function (options) {
  let state = {
    arr: [],
    arr1: [],
    arr2: [],
    arr3: [],
    multiIds: []
  }
  this.data.multiArray.map((v, vk) => {
    state.arr1.push(v.label);
    if (this.data.multiIndex[0] === vk) {
      state.multiIds[0] = v;
    }
    if (state.arr2.length <= 0) {
      v.children.map((c, ck) => {
        state.arr2.push(c.label);
        if (this.data.multiIndex[1] === ck) {
          state.multiIds[1] = c;
        }
        if (state.arr3.length <= 0) {
          c.children.map((t, tk) => {
            state.arr3.push(t.label);
            if (this.data.multiIndex[2] === tk) {
              state.multiIds[2] = t;
            }
          });
        }
      });
    }
  });
  state.arr[0] = state.arr1;
  state.arr[1] = state.arr2;
  state.arr[2] = state.arr3;
  this.setData({
    newArr: state.arr,
    multiIds: state.multiIds,
  });
},



})