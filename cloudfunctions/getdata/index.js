// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()
// 云函数入口函数
//查询
exports.main = async (event, context) => {
    return await db.collection('class').where({
      data:{
      couser:couser,
      week:week,}}
    ).get()
}
