const database = require("./Database.js");
const time = require("../views/js/time.js");

module.exports = {
  getPO: async (req, res) => {
    return new Promise(async (resolved, rejected) => {
      // 동기 처리
      try {
        const sql_text_1 = " SELECT * FROM tb_purchase_order WHERE Contractor_ID = (SELECT Company_ID FROM tb_user WHERE tb_user.UUID = ?)";

        const sql_text_2 = " SELECT * FROM tb_company WHERE UUID = (SELECT Company_ID FROM tb_user WHERE UUID = ?)";

        const sql_text_3 = " SELECT * FROM tb_company WHERE UUID = ?";

        console.log(time.timeString() + " getPO :: DB 연결");
        let connection = await database.conn();
        console.log(time.timeString() + " getPO :: DB 연결...Done");

        console.log(time.timeString() + " getPO :: DB 쿼리...(1)");
        let [Received_Order, fields_1] = await connection.query(sql_text_1, req.session.UUID);
        console.log(time.timeString() + " getPO :: DB 쿼리...(2)");
        let [MyCompanyInfo, fields_2] = await connection.query(sql_text_2, req.session.UUID);

        //console.log(time.timeString() + " getPO :: DB 쿼리...(3)");
        req.session.CompanyInfo = [];
        for (var key in Received_Order) {
          console.log(time.timeString() + " getPO :: DB 쿼리...(3), UUID " + key);
          let [CompanyInfo, fields_3] = await connection.query(sql_text_3, Received_Order[key]["OrderComp_ID"]);
          //console.log(CompanyInfo[0]);
          if (CompanyInfo != undefined) {
            req.session.CompanyInfo.push(CompanyInfo[0]);
          } else {
            console.log("getPO :: Query Failed (line 32)");
          }
        }
        req.session.save();

        console.log(time.timeString() + " getPO :: DB 쿼리...Done");

        if (Received_Order != undefined && MyCompanyInfo != undefined) {
          for (var key in Received_Order) {
            Received_Order[key]["FirstOrder_Date"];
            Received_Order[key]["Order_Date"];
            Received_Order[key]["Delivery_Date"];
          }
          req.session.Received_Order = Received_Order;
          req.session.MyCompanyInfo = MyCompanyInfo;
          req.session.NextQueryTime = time.nextQueryTime(time.getNow());
          req.session.save();
          resolved(connection);
        } else {
          console.log("getPO :: Query Failed (line 46)");
          rejected("Query Failed");
        }
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

  getCompanyInfo: async (UUID) => {
    // 동기 처리
    return new Promise(async (resolved, rejected) => {
      try {
        // 쿼리
        const sql_text_1 = " SELECT * FROM tb_company WHERE UUID = ?";

        console.log(time.timeString() + " getCompanyInfo :: DB 연결");
        let connection = await database.conn();
        console.log(time.timeString() + " getCompanyInfo :: DB 연결...Done");

        console.log(time.timeString() + " getCompanyInfo :: DB 쿼리...(1)");
        let [CompanyInfo, fields_1] = await connection.query(sql_text_1, UUID);
        console.log(time.timeString() + " getCompanyInfo :: DB 쿼리...Done");

        if (CompanyInfo != undefined) {
          resolved([connection, CompanyInfo]);
        } else {
          console.log("getCompanyInfo :: Query Failed (21)");
          rejected("Query Failed");
        }
      } catch (err) {
        console.log(time.timeString() + " PO_Query.js :: getCompanyInfo 쿼리 오류 : " + err);
      }
    })
      .then((resolved) => {
        if (resolved[0] != undefined) {
          resolved[0].release();
          return resolved[1];
        } else {
          console.log(time.timeString() + " PO_Query :: DB 연결 유실 at getCompanyInfo()");
        }
      })
      .catch((err) => {
        console.log(time.timeString() + "Error at getCompanyInfo() :: " + err);
      });
  },
};
