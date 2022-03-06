// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()
// 云函数入口函数
//查询"附近拼单"
exports.main = async (event, context) => {
  try {
    //order
      return await db.collection('class').where({
      //下面这3行，为筛选条件
      course:course,
      week:week

    }).get({
      success: function (res) {
        return res
      }
    });
  } catch (e) {
    console.error(e);
  }
}