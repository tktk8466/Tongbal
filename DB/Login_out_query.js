const database = require("./Database.js");
const time = require("../views/js/time.js");

module.exports = {
  // 로그인 프로세스
  login: async (req, res, ID, PW) => {
    // id와 pw가 입력되었는지 확인
    return new Promise(async (resolved, rejected) => {
      try {
        if (ID && PW) {
          var sql_text =
            "SELECT UserID, UserName, Job_Position, Email, Company_ID, (SELECT Comp_NAME FROM tb_company WHERE UUID = Company_ID) as Comp_NAME FROM tb_user WHERE BINARY(UserID) = ? AND BINARY(Passwd) = ?;";

          let connection = await database.conn();

          let [rows, fields] = await connection.query(sql_text, [ID, PW]);

          if (rows.length > 0) {
            req.session.UserID = rows[0]["UserID"];
            req.session.UserName = rows[0]["UserName"];
            req.session.JobPosition = rows[0]["Job_Position"];
            req.session.Email = rows[0]["Email"];
            req.session.Comp_NAME = rows[0]["Comp_NAME"];
            req.session.Comp_UUID = rows[0]["Company_ID"];

            req.session.isLogin = true;
            req.session.save();
            //console.log(time.timeString() + "auth :: 유저 " + ID + " 가 로그인 성공함, 세션 저장함");
            resolved(connection);
          } else {
            console.log(time.timeString() + "[4] auth :: DB 쿼리 실패");
            console.log("누군가가 아이디 또는 비밀번호를 틀렸음.");
            rejected("Query Failed");
          }
        } else {
          console.log("누군가가 아이디 또는 비밀번호를 입력하지 않고 로그인 시도를 함.");
        }
      } catch (err) {
        // await function들 에 대한 error catch
        console.log(time.timeString() + "[5] auth :: err " + err);
      }
    }) // 쿼리작업
      .then(async (resolved) => {
        // 쿼리작업 이후
        if (resolved != undefined) {
          resolved.release();
          return true;
        } else {
          console.log(time.timeString() + "[5] auth :: DB 연결 유실");
        }
      })
      .catch((err) => {
        // Promise에 대한 error catch
        console.log(time.timeString() + " login Promise err ::" + err);
        return false;
      });
  },
  // 로그아웃
  logout: async (req, res) => {
    if (req.session.UserID) {
      //세션정보가 존재하는 경우
      // 세션 파괴
      console.log(time.timeString() + "auth :: " + req.session.UserID + "가 로그아웃 함");
      req.session.destroy(function (err) {
        if (err) console.log(err);
        else {
          res.redirect("/");
        }
      });
    } else {
      res.redirect("/");
    }
  },
};
