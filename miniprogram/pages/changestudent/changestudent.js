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
                name:'STEAM科学B班'
                },
                {
                name:'机器人搭建中级班'
                },
                {
                name:'玩转信息技术'
                },
                {
                name:'3D造物'
                },
                {
                name:'航模兴趣班'
                },
                {
                name:'STEAM科学A班'
                },
                {
                name:'科学史话'
                },
                {
                name:'创意编程三年级班'
                },
                {
                name:'PPT小达人'
                },
                {
                name:'人工智能四年级班'
                },
                {
                name:'DIY创意营A班'
                },
                {
                name:'人工智能五年级'
                },
                {
                name:'图形化编程'
                },
                {
                name:'3D打印笔'
                },
                {
                name:'创意编程班四年级'
                },
                {
                name:'DIY创意营B班'
                },
                
              ]
            },
            {
              name: '体育',
              product: [{
                name:'男足兴趣班'
                },
                {
                name:'二年级篮球'
                },
                {
                name:'国际数棋初级班'
                },
                {
                name:'武术散打'
                },
                {
                name:'三年级篮球'
                },
                {
                name:'羽毛球'
                },
                {
                name:'轮滑中级班'
                },
                {
                name:'男足校队'
                },
                {
                name:'四年级篮球'
                },
                {
                name:'国际数棋中级班'
                },
                {
                name:'花样跳绳基础班'
                },
                {
                name:'青少年体适能A班'
                },
                {
                name:'体育身体素质练习'
                },
                {
                name:'跆拳道'
                },
                {
                name:'乒乓球'
                },
                {
                name:'女足基础班'
                },
                {
                name:'轮滑初级班'
                },
                {
                name:'气排球'
                },
                {
                name:'五年级篮球'
                },
                {
                name:'男足提高班'
                },
                {
                name:'体适能训练兴趣班'
                },
                {
                name:'花样跳绳校队'
                },
                {
                name:'青少年体适能'
                },
                {
                name:'体适能训练素质班'
                },
                ]
            },
            {
              name: '艺术',
              product: [{
                name:'创意绘画基础班'
                },
                {
                name:'童声合唱'
                },
                {
                name:'硬笔书法基础B班'
                },
                {
                name:'琵琶'
                },
                {
                name:'银杉合唱团'
                },
                {
                name:'舞蹈团'
                },
                {
                name:'银杉民乐团'
                },
                {
                name:'创意绘画高阶班'
                },
                {
                name:'基础创意绘画'
                },
                {
                name:'创意简笔画'
                },
                {
                name:'硬笔书法基础A班'
                },
                {
                name:'趣味折纸'
                },
                {
                name:'彩铅画'
                },
                {
                name:'基础线描绘画'
                },
                {
                name:'硬笔书法六年级'
                },
                {
                name:'沙画'
                },
                {
                name:'欢乐歌舞班'
                },
                {
                name:'超轻粘土初级班'
                },
                {
                name:'超轻黏土基础班'
                },
                {
                name:'趣味英语歌曲'
                },
                {
                name:'超轻黏土高阶班'
                },
                {
                name:'电脑绘画'
                },
                {
                name:'钢笔淡彩班'
                },
                {
                name:'十二孔陶笛'
                },
                {
                name:'硬笔书法基础'
                },
                {
                name:'创意绘画'
                },
                {
                name:'木片画'
                },
                {
                name:'绘本创作'
                },
                ]
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
    week:['周一','周二','周三','周四','周五'],
    weekId:0,
    date:['选择考勤日期'],
    imgbox: [],//选择图片
    fileIDs: [],//上传云存储后的返回值
    class:[['一年级','二年级','三年级','四年级','五年级','六年级'],['1班','2班','3班','4班','5班','6班','7班','8班','9班','10班','11班','12班']],
    classId:[0,0],
    addstudentname:[],
  },
  


    // 点击下拉显示框
    selectTaps() {
      this.setData({
        shows: !this.data.shows,
      });
    },
 
    bindclassChange:function(e){
      console.log(e.detail)
      this.setData({
        classId: e.detail.value
      })
    },
    bindColumnChange:function(e){
      console.log(e.detail)    
    },
  // 推广类型
  weekTypeChange: function (e) {
    console.log('星期', e.detail.value)
    this.setData({
      weekId: e.detail.value//把当前的触摸的索引给expandTypeID
    })
  },


  bindDateChange: function (e) {
    console.log('签到时间', e.detail.value)
    this.setData({
      date: e.detail.value//把当前的触摸的索引给expandTypeID
    })
  },
  //表单提交时间
  teformSubmit(e) {
    let val = e.detail.value
    let cIndex =this.data.customIndex[2]
    // console.log("课课程",this.data.onlyArray[2][cIndex])
    student.where({
      course:this.data.onlyArray[2][cIndex],
      week:val.week
      })
      .limit(100)
    .orderBy('name', 'desc')
    .get().then(res=>{
      console.log("查询",res.data)
        this.setData({
          list:  res.data
        })
    // console.log("查询成功",res.data)
  })    
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
addstudent(e) {
  let val = e.detail.value
  var datalist=this.data.list
  console.log('form', val.class.substr(3,3)),
  console.log( 'form',val.class.substr(0,3)),
  console.log('form', datalist),
  // console.log("课课程",this.data.onlyArray[2][cIndex])
  student.add({
    data:{
    course:datalist[0].course,
    division:datalist[0].division,
    group:datalist[0].group,
    name:this.data.addstudentname,
    teacher:datalist[0].teacher,
    week:this.data.week[this.data.weekId],
    grade:val.class.substr(0,3),
    class:val.class.substr(3,3),
  },success(res){
    console.log("成功",res);
   },
   fail(res){
     console.log("失败",res);
   }
}) 
},
addname: function(e) {
  this.data.addstudentname = e.detail.value;
},



})