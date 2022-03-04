const cloud = require('wx-server-sdk')
//这里最好也初始化一下你的云开发环境
cloud.init({
  env: "nnttys-8ghq25o9550460d0"
})
//操作excel用的类库
const xlsx = require('node-xlsx');

// 云函数入口函数
exports.main = async(event, context) => {
  try {
    let getdata = await cloud.database().collection('check').get();
    let userdata = getdata.data;
    //1,定义excel表格名
    let dataCVS = 'test.xlsx'
    //2，定义存储数据的
    let alldata = [];
    let row = ['id', 'class', 'name', 'grade', 'course', 'week', 'check', 'gdn', 'date', 'subtime']; //表属性
    alldata.push(row);
    // class,name,grade,course,week,check,gdn,date,subtime
    for (let key in userdata) {
      let arr = [];
      arr.push(userdata[key].id);
      arr.push(userdata[key].class);
      arr.push(userdata[key].name);
      arr.push(userdata[key].grade);
      arr.push(userdata[key].course);
      arr.push(userdata[key].week);
      arr.push(userdata[key].check);
      arr.push(userdata[key].gdn);
      arr.push(userdata[key].date);
      arr.push(userdata[key].subtime);

      alldata.push(arr)
    }
    //3，把数据保存到excel里
    var buffer = await xlsx.build([{
      name: "mySheetName",
      data: alldata
    }]);
    //4，把excel文件保存到云存储里
    return await cloud.uploadFile({
      cloudPath: dataCVS,
      fileContent: buffer, //excel二进制文件
    })

  } catch (e) {
    console.error(e)
    return e
  }
}