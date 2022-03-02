// pages/checkin/checkin.js
const app=getApp
const db=wx.cloud.database()
const student=db.collection('class')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    
    class:[['一年级','二年级','三年级','四年级','五年级','六年级'],['1班','2班','3班','4班','5班','6班','7班','8班','9班','10班','11班','12班']],
    classId:[0,0],

  
    idx:'',
    applyList:[
      {Item_id: "10", Item_Name: "特殊课程"},
      {Item_id: "11", Item_Name: "作业辅导"},
    ],
    sel1:'',
    course:['科学STEAM','简笔画'],
    courseId:0,
    week:['星期一','星期三','星期四','星期五'],
    weekId:0,
    date:[],
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
 

  /**
   * 生命周期函数--监听页面加载
   */

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
    // console.log('form=>',e)
    let val = e.detail.value
    // console.log('form', val.class.substr(3,3))

    student.where({
      grade:val.class.substr(0,3),
      class:val.class.substr(3,3),
      week:val.week 
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
        subtime:new Date().toLocaleString()
      }
    })
  }

        // id,class,name,grade,course,week,check,gdn,date,subtime
},
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

  }
  
})