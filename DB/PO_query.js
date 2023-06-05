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
        const sql_text_4 = " SELECT * FROM tb_company WHERE UUID = ?"; // 상대방 회사 정보
        const sql_text_5 = " SELECT * FROM tb_chatting WHERE TB_CHAT_ROOM_ID = ?"; // 대화내용
        const sql_text_6 = " SELECT * FROM tb_prd_info WHERE PO_UUID = ?"; // 발주서 제품목록

        console.log(time.timeString() + " getPO :: DB 접속");
        let connection = await database.conn();

        let [Received_Order, fields_1] = await connection.query(sql_text_1, req.session.UUID);
        if (Received_Order != undefined) {
          req.session.Received_Order = Received_Order;
          req.session.R_CompanyInfo = [];
          req.session.R_Chatting = [];
          req.session.R_prd_info = [];

          for (var key in Received_Order) {
            let [R_CompanyInfo, fields_4] = await connection.query(sql_text_4, Received_Order[key]["OrderComp_ID"]); // 보낸 회사 정보
            let [R_Chatting, fields_5] = await connection.query(sql_text_5, Received_Order[key]["TB_CHAT_ROOM_ID"]); // 받은 발주서 채팅 내역
            let [R_prd_info, fields_6] = await connection.query(sql_text_6, Received_Order[key]["UUID"]); // 받은 발주서 제품목록 내역
            if (R_CompanyInfo != undefined && R_Chatting != undefined && R_prd_info != undefined) {
              req.session.R_CompanyInfo.push(R_CompanyInfo[0]);
              req.session.R_Chatting.push(JSON.stringify(R_Chatting));
              req.session.R_prd_info.push(R_prd_info);
            } else {
              console.log("getPO :: Query Failed");
            }
          }
        } else {
          console.log("getPO :: Query Failed");
        }

        let [Send_Order, fields_2] = await connection.query(sql_text_2, req.session.UUID);
        if (Send_Order != undefined) {
          req.session.Send_Order = Send_Order;
          req.session.S_CompanyInfo = [];
          req.session.S_Chatting = [];
          req.session.S_prd_info = [];

          for (var key in Send_Order) {
            let [S_CompanyInfo, fields_4] = await connection.query(sql_text_4, Send_Order[key]["Contractor_ID"]); // 받은 회사 정보
            let [S_Chatting, fields_5] = await connection.query(sql_text_5, Send_Order[key]["TB_CHAT_ROOM_ID"]); // 보낸 발주서 채팅 내역
            let [S_prd_info, fields_6] = await connection.query(sql_text_6, Send_Order[key]["UUID"]); // 받은 발주서 제품목록 내역
            if (S_CompanyInfo != undefined && S_Chatting != undefined && S_prd_info != undefined) {
              req.session.S_CompanyInfo.push(S_CompanyInfo[0]);
              req.session.S_Chatting.push(JSON.stringify(S_Chatting));
              req.session.S_prd_info.push(S_prd_info);
            } else {
              console.log("getPO :: Query Failed");
            }
          }
        } else {
          console.log("getPO :: Query Failed");
        }

        let [MyCompanyInfo, fields_3] = await connection.query(sql_text_3, req.session.UUID);
        if (MyCompanyInfo != undefined) {
          req.session.MyCompanyInfo = MyCompanyInfo;
        } else {
          console.log("getPO :: Query Failed");
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

  savePO_item: async (CP_UUID, PO_UUID, P_Code, P_Name, P_Width, P_Height, P_Unit, P_Quan, P_Price, P_VAT) => {
    return new Promise(async (resolved, rejected) => {
      try {
        const sql_text =
          "INSERT INTO tb_prd_info(Company_UUID, PO_UUID, Product_CODE, Product_NAME, Quantity, Width, Height, unit, Unit_Price, VAT) VALUES (?,?,?,?,?,?,?,?,?,?)";

        let connection = await database.conn();
        await connection.query(sql_text, [CP_UUID, PO_UUID, P_Code, P_Name, P_Quan, P_Width, P_Height, P_Unit, P_Price, P_VAT]);
        resolved(connection);
      } catch (err) {
        console.log(time.timeString() + " PO_Query.js :: savePO_item 쿼리 오류 : " + err);
      }
    })
      .then((resolved) => {
        if (resolved != undefined) {
          resolved.release();
          console.log(time.timeString() + " savePO_item :: DB 접속 종료");
        } else {
          console.log(time.timeString() + " PO_Query :: DB 연결 유실 at savePO_item()");
        }
      })
      .catch((err) => {
        console.log(time.timeString() + " savePO_item :: err ::" + err);
      });
  },

  clearPO_item: async (PO_UUID) => {
    return new Promise(async (resolved, rejected) => {
      try {
        const sql_text = "DELETE FROM tb_prd_info WHERE PO_UUID = ?";
        let connection = await database.conn();
        await connection.query(sql_text, PO_UUID);
        resolved(connection);
      } catch (err) {
        console.log(time.timeString() + " PO_Query.js :: clearPO_item 쿼리 오류 : " + err);
      }
    })
      .then((resolved) => {
        if (resolved != undefined) {
          resolved.release();
          console.log(time.timeString() + " savePO_item :: DB 접속 종료");
        } else {
          console.log(time.timeString() + " PO_Query :: DB 연결 유실 at savePO_item()");
        }
      })
      .catch((err) => {
        console.log(time.timeString() + " clearPO_item :: err ::" + err);
      });
  },

  updatePO_content: async (PO_UUID, content) => {
    return new Promise(async (resolved, rejected) => {
      try {
        const sql_text = "UPDATE tb_purchase_order SET Content = ? WHERE UUID = ?";
        let connection = await database.conn();
        await connection.query(sql_text, [content, PO_UUID]);
        resolved(connection);
      } catch (err) {
        console.log(time.timeString() + " PO_Query.js :: updatePO_content 쿼리 오류 : " + err);
      }
    })
      .then((resolved) => {
        if (resolved != undefined) {
          resolved.release();
          console.log(time.timeString() + " updatePO_content :: DB 접속 종료");
        } else {
          console.log(time.timeString() + " PO_Query :: DB 연결 유실 at updatePO_content()");
        }
      })
      .catch((err) => {
        console.log(time.timeString() + " updatePO_content :: err ::" + err);
      });
  },
};
