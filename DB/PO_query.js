const database = require("./Database.js");
const time = require("../views/js/time.js");

module.exports = {
  getPO: async (req, res) => {
    return new Promise(async (resolved, rejected) => {
      // 동기 처리
      try {
        const sql_text_1 = " SELECT * FROM tb_purchase_order WHERE Contractor_ID = ? ORDER BY Order_Date DESC"; // 받은 발주서
        const sql_text_2 = " SELECT * FROM tb_purchase_order WHERE OrderComp_ID = ? ORDER BY Order_Date DESC"; // 보낸 발주서
        const sql_text_3 = " SELECT * FROM tb_company WHERE UUID = ?"; // 내 회사 정보
        const sql_text_4 = " SELECT * FROM tb_company WHERE UUID = ?"; // 상대방 회사 정보
        const sql_text_5 = " SELECT * FROM tb_chatting WHERE TB_CHAT_ROOM_ID = ? ORDER BY id ASC"; // 대화내용
        const sql_text_6 = " SELECT * FROM tb_prd_info WHERE PO_UUID = ?"; // 발주서 제품 목록
        const sql_text_7 = " SELECT * FROM tb_attachment WHERE PO_UUID = ?"; // 발주서 파일 목록

        let connection = await database.conn();

        let [Received_Order, fields_1] = await connection.query(sql_text_1, req.session.Comp_UUID);
        if (Received_Order != undefined) {
          req.session.Received_Order = Received_Order;
          req.session.R_CompanyInfo = [];
          req.session.R_Chatting = [];
          req.session.R_prd_info = [];
          req.session.R_file_list = [];

          for (var key in Received_Order) {
            let [R_CompanyInfo, fields_4] = await connection.query(sql_text_4, Received_Order[key]["OrderComp_ID"]); // 보낸 회사 정보
            let [R_Chatting, fields_5] = await connection.query(sql_text_5, Received_Order[key]["TB_CHAT_ROOM_ID"]); // 받은 발주서 채팅 내역
            let [R_prd_info, fields_6] = await connection.query(sql_text_6, Received_Order[key]["UUID"]); // 받은 발주서 제품목록 내역
            let [R_file_list, fields_7] = await connection.query(sql_text_7, Received_Order[key]["UUID"]); // 받은 발주서 제품목록 내역

            if (R_CompanyInfo != undefined && R_Chatting != undefined && R_prd_info != undefined && R_file_list != undefined) {
              req.session.R_CompanyInfo.push(R_CompanyInfo[0]);
              req.session.R_Chatting.push(JSON.stringify(R_Chatting));
              req.session.R_prd_info.push(R_prd_info);
              req.session.R_file_list.push(R_file_list);
            } else {
              console.log("getPO :: Query Failed");
            }
          }
        } else {
          console.log("getPO :: Query Failed");
        }

        let [Send_Order, fields_2] = await connection.query(sql_text_2, req.session.Comp_UUID);
        if (Send_Order != undefined) {
          req.session.Send_Order = Send_Order;
          req.session.S_CompanyInfo = [];
          req.session.S_Chatting = [];
          req.session.S_prd_info = [];
          req.session.S_file_list = [];

          for (var key in Send_Order) {
            let [S_CompanyInfo, fields_4] = await connection.query(sql_text_4, Send_Order[key]["Contractor_ID"]); // 받은 회사 정보
            let [S_Chatting, fields_5] = await connection.query(sql_text_5, Send_Order[key]["TB_CHAT_ROOM_ID"]); // 보낸 발주서 채팅 내역
            let [S_prd_info, fields_6] = await connection.query(sql_text_6, Send_Order[key]["UUID"]); // 받은 발주서 제품목록 내역
            let [S_file_list, fields_7] = await connection.query(sql_text_7, Send_Order[key]["UUID"]); // 보낸 발주서 제품목록 내역

            if (S_CompanyInfo != undefined && S_Chatting != undefined && S_prd_info != undefined && S_file_list != undefined) {
              req.session.S_CompanyInfo.push(S_CompanyInfo[0]);
              req.session.S_Chatting.push(JSON.stringify(S_Chatting));
              req.session.S_prd_info.push(S_prd_info);
              req.session.S_file_list.push(S_file_list);
            } else {
              console.log("getPO :: Query Failed");
            }
          }
        } else {
          console.log("getPO :: Query Failed");
        }

        let [MyCompanyInfo, fields_3] = await connection.query(sql_text_3, req.session.Comp_UUID);
        if (MyCompanyInfo != undefined) {
          req.session.MyCompanyInfo = MyCompanyInfo;
        } else {
          console.log("getPO :: Query Failed");
        }

        req.session.NextQueryTime = time.nextQueryTime(time.getNow());
        req.session.save();

        resolved(connection);
      } catch (err) {
        console.log(time.timeString() + " PO_Query.js :: getPO 쿼리 오류 : " + err);
      }
    })
      .then((resolved) => {
        if (resolved != undefined) {
          resolved.release();
        } else {
          console.log(time.timeString() + " PO_Query :: DB 연결 유실 at getPO()");
        }
      })
      .catch((err) => {
        console.log(time.timeString() + "Error at getPO :: " + err);
      });
  },

  savePO: async (PO_UUID, title_PO, Content, DeliveryDate, B_NUM, B_NUM2, Chat_Room_ID) => {
    return new Promise(async (resolved, rejected) => {
      try {
        const sql_text =
          "INSERT INTO tb_purchase_order(UUID, Title, Content, Order_Date, Delivery_Date, OrderComp_ID, Contractor_ID, TB_CHAT_ROOM_ID) VALUES (?, ?, ?, now(), ?, (SELECT UUID FROM tb_company WHERE Business_NUM = ?),(SELECT UUID FROM tb_company WHERE Business_NUM = ?),?)";

        let connection = await database.conn();
        await connection.query(sql_text, [PO_UUID, title_PO, Content, DeliveryDate, B_NUM, B_NUM2, Chat_Room_ID]);
        resolved(connection);
      } catch (err) {
        console.log(time.timeString() + " PO_Query.js :: savePO 쿼리 오류 : " + err);
      }
    })
      .then((resolved) => {
        if (resolved != undefined) {
          resolved.release();
        } else {
          console.log(time.timeString() + " PO_Query :: DB 연결 유실 at savePO()");
        }
      })
      .catch((err) => {
        console.log(time.timeString() + " savePO :: err ::" + err);
      });
  },

  savePO_item: async (PO_UUID, P_Code, P_Name, P_Width, P_Height, P_Unit, P_Quan, P_Price, P_VAT) => {
    return new Promise(async (resolved, rejected) => {
      try {
        const sql_text =
          "INSERT INTO tb_prd_info(PO_UUID, Product_CODE, Product_NAME, Quantity, Width, Height, unit, Unit_Price, VAT) VALUES (?,?,?,?,?,?,?,?,?)";

        let connection = await database.conn();
        await connection.query(sql_text, [PO_UUID, P_Code, P_Name, P_Quan, P_Width, P_Height, P_Unit, P_Price, P_VAT]);
        resolved(connection);
      } catch (err) {
        console.log(time.timeString() + " PO_Query.js :: savePO_item 쿼리 오류 : " + err);
      }
    })
      .then((resolved) => {
        if (resolved != undefined) {
          resolved.release();
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
        } else {
          console.log(time.timeString() + " PO_Query :: DB 연결 유실 at savePO_item()");
        }
      })
      .catch((err) => {
        console.log(time.timeString() + " clearPO_item :: err ::" + err);
      });
  },

  updatePO_content: async (PO_UUID, content, DeliveryDate) => {
    return new Promise(async (resolved, rejected) => {
      try {
        const sql_text = "UPDATE tb_purchase_order SET Content = ?, Delivery_Date = ? WHERE UUID = ?";
        let connection = await database.conn();
        await connection.query(sql_text, [content, DeliveryDate, PO_UUID]);
        resolved(connection);
      } catch (err) {
        console.log(time.timeString() + " PO_Query.js :: updatePO_content 쿼리 오류 : " + err);
      }
    })
      .then((resolved) => {
        if (resolved != undefined) {
          resolved.release();
        } else {
          console.log(time.timeString() + " PO_Query :: DB 연결 유실 at updatePO_content()");
        }
      })
      .catch((err) => {
        console.log(time.timeString() + " updatePO_content :: err ::" + err);
      });
  },

  UPLOAD_FILE: async (f_array) => {
    return new Promise(async (resolved, rejected) => {
      try {
        const sql_text = "INSERT INTO tb_attachment(UUID, File_Name, File_Path, PO_UUID) VALUES (?, ?, ?, ?)";
        let connection = await database.conn();
        for (var len in f_array) {
          var data = JSON.parse(f_array[len]);
          await connection.query(sql_text, [data.UUID, data.f_name, data.f_path, data.PO_UUID]);
        }

        resolved(connection);
      } catch (err) {
        console.log(time.timeString() + " PO_Query.js :: UPLOAD_FILE 쿼리 오류 : " + err);
      }
    })
      .then((resolved) => {
        if (resolved != undefined) {
          resolved.release();
        } else {
          console.log(time.timeString() + " PO_Query.js :: DB 연결 유실 at UPLOAD_FILE()");
        }
      })
      .catch((err) => {
        console.log(time.timeString() + " UPLOAD_FILE:: err ::" + err);
      });
  },
  DELETE_FILE: async (f_name, f_path) => {
    return new Promise(async (resolved, rejected) => {
      try {
        const sql_text = "DELETE FROM tb_attachment WHERE File_Name = ? or File_Path = ?";
        let connection = await database.conn();
        await connection.query(sql_text, [f_name, f_path]);
        console.log("DB DELETED");
        resolved(connection);
      } catch (err) {
        console.log(time.timeString() + " PO_Query.js :: getCompInfo 쿼리 오류 : " + err);
      }
    })
      .then((resolved) => {
        if (resolved != undefined) {
          resolved.release();
        } else {
          console.log(time.timeString() + " PO_Query.js :: DB 연결 유실 at getCompInfo()");
        }
      })
      .catch((err) => {
        console.log(time.timeString() + " getCompInfo:: err ::" + err);
      });
  },
  getCompInfo: async (req, res) => {
    return new Promise(async (resolved, rejected) => {
      try {
        const sql_text = "SELECT * FROM tb_company ORDER BY Comp_NAME";
        let connection = await database.conn();
        let [results, fields] = await connection.query(sql_text);
        if (results != undefined) {
          res.render("../views/Find_CP.ejs", { req, results, pass: true });
        }

        resolved(connection);
      } catch (err) {
        console.log(time.timeString() + " PO_Query.js :: getCompInfo 쿼리 오류 : " + err);
      }
    })
      .then((resolved) => {
        if (resolved != undefined) {
          resolved.release();
        } else {
          console.log(time.timeString() + " PO_Query.js :: DB 연결 유실 at getCompInfo()");
        }
      })
      .catch((err) => {
        console.log(time.timeString() + " getCompInfo:: err ::" + err);
      });
  },
};
