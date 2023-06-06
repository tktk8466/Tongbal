const database = require("../DB/Database.js");
const time = require("../views/js/time.js");

module.exports = {
  // 참고용
  //console.log("WebSocket :: type : " + data.type);
  //console.log("WebSocket :: message : " + data.msg);
  //console.log("WebSocket :: uid : " + data.user_id);
  //console.log("WebSocket :: uname : " + data.user_name);
  //console.log("WebSocket :: compname : " + data.comp_name);
  //console.log("WebSocket :: chatroom : " + data.chat_room_id);

  saveMessage: async (fullMessage) => {
    return new Promise(async (resolved, rejected) => {
      try {
        const data = JSON.parse(fullMessage);

        var sql_text =
          "INSERT INTO tb_chatting(message, sent_at, sent_user_id, sent_user_name, comp_name, TB_CHAT_ROOM_ID) VALUES(?, NOW(), ?, ?, ?, ?)";

        let connection = await database.conn();
        await connection.query(sql_text, [data.msg, data.user_id, data.user_name, data.comp_name, data.chat_room_id]);
        resolved(true);
      } catch (err) {
        console.log(time.timeString() + "ChatMsg :: DB err " + err);
      }
    })
      .then(async (resolved) => {
        if (resolved) {
        }
      })
      .catch((err) => {
        console.log(time.timeString() + "ChatMsg :: try catch err :: " + err);
      });
  },
};
