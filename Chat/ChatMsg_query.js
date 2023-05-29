const database = require("../DB/Database.js");
const time = require("../views/js/time.js");

module.exports = {
  // 참고용
  //console.log("WebSocket :: type : " + data.type);
  //console.log("WebSocket :: message : " + data.msg);
  //console.log("WebSocket :: uid : " + data.user_id);
  //console.log("WebSocket :: uname : " + data.user_name);
  //console.log("WebSocket :: chatroom : " + data.chat_room_id);

  saveMessage: async (fullMessage) => {
    return new Promise(async (resolved, rejected) => {
      try {
        const data = JSON.parse(fullMessage);

        var sql_text = "INSERT INTO tb_chatting(message, sent_at, sent_user_id, TB_CHAT_ROOM_ID) VALUES(?, NOW(), ?, ?)";

        //console.log(time.timeString() + "ChatMsg :: DB 연결");
        let connection = await database.conn();
        //console.log(time.timeString() + "ChatMsg :: DB 연결...Done");
        //console.log(time.timeString() + "ChatMsg :: DB 쿼리");
        await connection.query(sql_text, [data.msg, data.user_id, data.chat_room_id]);
        resolved(true);
      } catch (err) {
        console.log(time.timeString() + "ChatMsg :: DB err " + err);
      }
    })
      .then(async (resolved) => {
        if (resolved) {
          console.log(time.timeString() + "ChatMsg :: DB INSERT DONE ");
        }
      })
      .catch((err) => {
        console.log(time.timeString() + "ChatMsg :: try catch err :: " + err);
      });
  },
};