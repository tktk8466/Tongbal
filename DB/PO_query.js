const database = require("./Database.js");
const time = require("../views/js/time.js");

module.exports = {
  getPO: async (req, res) => {
    return new Promise(async (resolved, rejected) => {
      // 동기 처리
      try {
        const sql_text_1 = " SELECT * FROM tb_purchase_order WHERE Contractor_ID = (SELECT Company_ID FROM tb_user WHERE tb_user.UUID = ?)"; // 받은 발주서
        const sql_text_2 = " SELECT * FROM tb_purchase_order WHERE OrderComp_ID = (SELECT Company_ID FROM tb_user WHERE tb_user.UUID = ?)"; // 보낸 발주서
        const sql_text_3 = " SELECT * FROM tb_company WHERE UUID = (SELECT Company_ID FROM tb_user WHERE UUID = ?)"; // 내 회사 정보
        const sql_text_4 = " SELECT * FROM tb_company WHERE UUID = ?";
        const sql_text_5 = " SELECT message, sent_at, sent_user_id, sent_user_name, comp_name FROM tb_chatting WHERE TB_CHAT_ROOM_ID = ?";

        console.log(time.timeString() + " getPO :: DB 접속");
        let connection = await database.conn();
        let [Received_Order, fields_1] = await connection.query(sql_text_1, req.session.UUID);
        let [Send_Order, fields_2] = await connection.query(sql_text_2, req.session.UUID);
        let [MyCompanyInfo, fields_3] = await connection.query(sql_text_3, req.session.UUID);

        req.session.R_CompanyInfo = [];
        req.session.R_Chatting = [];
        req.session.S_CompanyInfo = [];
        req.session.S_Chatting = [];

        if (Received_Order != undefined) {
          req.session.Received_Order = Received_Order;

          for (var key in Received_Order) {
            let [R_CompanyInfo, fields_4] = await connection.query(sql_text_4, Received_Order[key]["OrderComp_ID"]); // 보낸 회사 정보
            let [R_Chatting, fields_5] = await connection.query(sql_text_5, Received_Order[key]["TB_CHAT_ROOM_ID"]); // 받은 발주서 채팅 내역
            if (R_CompanyInfo != undefined && R_Chatting != undefined) {
              req.session.R_CompanyInfo.push(R_CompanyInfo[0]);
              req.session.R_Chatting.push(JSON.stringify(R_Chatting));
            } else {
              console.log("getPO :: Query Failed (line 36)");
            }
          }
        } else {
          console.log("getPO :: Query Failed (line 40)");
        }
        if (Send_Order != undefined) {
          req.session.Send_Order = Send_Order;

          for (var key in Send_Order) {
            let [S_CompanyInfo, fields_4] = await connection.query(sql_text_4, Send_Order[key]["Contractor_ID"]); // 받은 회사 정보
            let [S_Chatting, fields_5] = await connection.query(sql_text_5, Send_Order[key]["TB_CHAT_ROOM_ID"]); // 보낸 발주서 채팅 내역
            if (S_CompanyInfo != undefined && S_Chatting != undefined) {
              req.session.S_CompanyInfo.push(S_CompanyInfo[0]);
              req.session.S_Chatting.push(JSON.stringify(S_Chatting));
            } else {
              console.log("getPO :: Query Failed (line 52)");
            }
          }
        } else {
          console.log("getPO :: Query Failed (line 56)");
        }
        if (MyCompanyInfo != undefined) {
          req.session.MyCompanyInfo = MyCompanyInfo;
        } else {
          console.log("getPO :: Query Failed (line 61)");
        }
        req.session.NextQueryTime = time.nextQueryTime(time.getNow());
        req.session.save();
        // console.log(req.session);
        resolved(connection);
      } catch (err) {
        console.log(time.timeString() + " PO_Query.js :: getPO 쿼리 오류 : " + err);
      }
    })
      .then((resolved) => {
        if (resolved != undefined) {
          resolved.release();
          console.log(time.timeString() + " getPO :: DB 접속 종료");
        } else {
          console.log(time.timeString() + " PO_Query :: DB 연결 유실 at getPO()");
        }
      })
      .catch((err) => {
        console.log(time.timeString() + "Error at getPO :: " + err);
      });
  },
};
