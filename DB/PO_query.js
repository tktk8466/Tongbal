const database = require("./Database.js");
const time = require("../views/js/time.js");

module.exports = {
  getPO: async (req, res) => {
    return new Promise(async (resolved, rejected) => {
      // 비동기 처리
      try {
        const sql_text_1 =
          " SELECT Title, Content, FirstOrder_date, Order_date, Delivery_date, \
    (SELECT Comp_NAME FROM tb_company WHERE UUID = tb_purchase_order.OrderComp_ID) as Order_Company, \
    (SELECT Comp_NAME FROM tb_company WHERE UUID = tb_purchase_order.Contractor_ID) as Contractor \
    FROM tb_purchase_order WHERE OrderComp_ID = (SELECT Company_ID FROM tb_user WHERE tb_user.UUID = ?);";

        const sql_text_2 =
          " SELECT * FROM tb_company WHERE UUID = (SELECT Company_ID FROM tb_user WHERE UUID = ?)";

        console.log(time.timeString() + " PO_Query :: DB 연결");
        let connection = await database.conn();
        console.log(time.timeString() + " PO_Query :: DB 연결...Done");

        console.log(time.timeString() + " PO_Query :: DB 쿼리...(1)");
        const [Received_Order, fields_1] = await connection.query(
          sql_text_1,
          req.session.UUID
        );
        console.log(time.timeString() + " PO_Query :: DB 쿼리...(2)");
        const [MyCompanyInfo, fields_2] = await connection.query(
          sql_text_2,
          req.session.UUID
        );
        console.log(time.timeString() + " PO_Query :: DB 쿼리...Done");

        if (Received_Order != undefined && MyCompanyInfo != undefined) {
          req.session.Received_Order = Received_Order;
          req.session.Received_Order[0]["FirstOrder_date"].toLocaleDateString();
          req.session.MyCompanyInfo = MyCompanyInfo;
          req.session.LastQueryTime = req.session.CurrQueryTime;
          req.session.CurrQueryTime = time.timeString();
          req.session.save();
          // console.log(time.timeString() + "PO_Query :: 쿼리 후 세션 : ");
          // console.log(req.session);
          resolved(connection);
        } else {
          console.log("DB_PO_Query :: Query Failed (21)");
          rejected("Query Failed");
        }
      } catch (err) {
        console.log(
          time.timeString() + " PO_Query.js :: getPO 쿼리 오류 : " + err
        );
      }
      // 필요시 사용,
    })
      .then((resolved) => {
        if (resolved != undefined) {
          resolved.release();
        } else {
          console.log(time.timeString() + " PO_Query :: DB 유실");
        }
      })
      .catch((err) => {
        console.log(time.timeString() + "Error at getPO :: " + err);
      });
  },
};
