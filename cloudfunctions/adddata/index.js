// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()

// 云函数入口函数
exports.main = async(event, context) => {
  db.collection('info').add({
  data:event.add_data
}).then(res=>{
  console.log("添加成功",res);
}).catch(err=>{
  console.log(err);
})
}
