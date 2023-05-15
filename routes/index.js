const express = require("express");
const router = express.Router();
const path = require("path");
const time = require("../views/js/time.js");
const db_query = require("../DB/login_out_query.js");
const po_query = require("../DB/PO_query.js");

// Bootstrap
router.use(
  "/bootstrap",
  express.static(path.join(__dirname, "../node_modules/bootstrap/dist"))
);
// For Jquery
router.use(
  "/node_modules",
  express.static(path.join(__dirname, "../node_modules"))
);
// static routers
// 로그인 전 메인

router.get("/", async (req, res) => {
  console.log(time.timeString() + " get'/' :: 로그인 세션 체크중...");
  var NextPage = req.query.NextPage;
  if (req.session.isLogin == true) {
    // 로그인 세션 있을 때

    console.log(time.timeString() + "Next Page :" + NextPage);
    if (NextPage == "PO_R") {
      try {
        if (
          req.session.LastQueryTime == undefined &&
          req.session.CurrQueryTime == undefined
        ) {
          console.log(time.timeString() + " post'PO_R' getPO ");
          await po_query.getPO(req, res);
        } else {
          console.log(
            time.timeString() +
              "Already Queried at " +
              req.session.LastQueryTime
          );
        }
        res.render("../views/Purchase_Order_Received.ejs", {
          req,
          pass: true,
        });
      } catch (err) {
        console.log(
          time.timeString() + " Error at NextPage =='PO_R' :: " + err
        );
      }
    }
    console.log(time.timeString() + " get'/' :: 로그인 세션 있음");
    if (
      req.session.LastQueryTime == undefined &&
      req.session.CurrQueryTime == undefined
    ) {
      await po_query.getPO(req, res);

      console.log(time.timeString() + " get'/' :: getPO 이후 세션 ");
      console.log(req.session);
      res.render("../views/main_login.ejs", { req, pass: true });
    } else {
      console.log(
        time.timeString() + "Already Queried at " + req.session.LastQueryTime
      );
      res.render("../views/main_login.ejs", { req, pass: true });
    }
  } else {
    // 로그인 세션 없을 때
    res.render(path.join(__dirname, "../views/main.ejs"));
    console.log(time.timeString() + " get'/' :: 로그인 세션 없음");
  }
});

router.post("/", async (req, res) => {
  try {
    var NextPage = req.body.NextPage;
    console.log(time.timeString() + " post'/' :: " + NextPage);

    if (NextPage == "Login") {
      res.render("../views/login.ejs", {
        pass: "attempt",
      });
      console.log(time.timeString() + " post'/' :: 로그인 시도");
      //
    } else if (NextPage == "Login_attempt") {
      console.log(time.timeString() + " else if Login_attempt ");
      let ID = req.body.userID;
      let PW = req.body.userPW;
      try {
        if (await db_query.login(req, res, ID, PW)) {
          console.log(
            time.timeString() +
              " post'Login_attempt' :: 로그인 성공, PO_S 쿼리 시작"
          );
          await po_query.getPO(req, res);
          res.render("../views/login.ejs", { req, pass: true });
        } else {
          console.log(
            time.timeString() +
              " post'Login_attempt' :: 로그인 실패, 페이지 다시 RENDER"
          );
          res.render("../views/login.ejs", {
            pass: false,
          });
        }
      } catch (err) {
        console.log(
          time.timeString() + " Error at NextPage =='Login' :: " + err
        );
      }
      //
    } else if (NextPage == "Main") {
      res.render("../views/main_login.ejs", { req });
      //
    } else if (NextPage == "PO_M") {
      console.log(time.timeString() + " else if PO_M ");
      if (req.session.isLogin != true) {
        // 로그인 세션 없을 때
        res.render("../views/login.ejs", {
          pass: "NONE",
        });
        console.log(
          time.timeString() + " post'/' :: 로그인 세션 없음, 로그인 페이지 연계"
        );
      } else {
        res.render("../views/Purchase_Order_M.ejs");
      }
    } else if (NextPage == "PO_R") {
      console.log(time.timeString() + " else if PO_R ");
      if (req.session.isLogin != true) {
        // 로그인 세션 없을 때
        res.render("../views/login.ejs", {
          pass: "NONE",
        });
        console.log(
          time.timeString() + " post'/' :: 로그인 세션 없음, 로그인 페이지 연계"
        );
      } else {
        try {
          if (
            req.session.LastQueryTime == undefined &&
            req.session.CurrQueryTime == undefined
          ) {
            console.log(time.timeString() + " post'PO_R' getPO ");
            await po_query.getPO(req, res);
          } else {
            console.log(
              time.timeString() +
                "Already Queried at " +
                req.session.LastQueryTime
            );
          }
          res.locals.Received_Order = req.session.Received_Order;
          res.render("../views/Purchase_Order_Received.ejs", {
            req,
            pass: true,
          });
        } catch (err) {
          console.log(
            time.timeString() + " Error at NextPage =='PO_R' :: " + err
          );
        }
      }
    } else if (NextPage == "PO_S") {
      console.log(time.timeString() + " else if PO_S ");
      if (req.session.isLogin != true) {
        // 로그인 세션 없을 때
        res.render("../views/login.ejs", {
          pass: "NONE",
        });
        console.log(
          time.timeString() + " post'/' :: 로그인 세션 없음, 로그인 페이지 연계"
        );
      } else {
        res.render("../views/Purchase_Order_Sent.ejs");
      }
    }
  } catch (err) {
    console.log(err);
  }
});

// 로그아웃
router.get("/logout", (req, res) => {
  try {
    db_query.logout(req, res);
  } catch (err) {
    console.log(err);
  }
});

router.get("/PO_edit", (req, res) => {
  res.render(path.join(__dirname, "../views/Purchase_Order_edit.ejs"));
});

/*
// 로그인 페이지
router.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "../views/login.html"));
});

// 로그인 시도
router.post("/login", async (req, res) => {
  console.log(time.timeString() + " else if Login_attempt ");
  let ID = req.body.userID;
  let PW = req.body.userPW;
  try {
    if (await db_query.login(req, res, ID, PW)) {
      console.log(
        time.timeString() +
          " post'Login_attempt' :: 로그인 성공, PO_S 쿼리 시작"
      );
      await po_query.getPO(req, res);
      //res.redirect("/");
      res.render("../views/main_login.ejs", { req, pass: true });
    } else {
      console.log(
        time.timeString() +
          " post'Login_attempt' :: 로그인 실패, 페이지 다시 RENDER"
      );
      res.render(path.join(__dirname, "../views/login.ejs"), {
        pass: false,
      });
    }
  } catch (err) {
    console.log(time.timeString() + " Error at NextPage =='Login' :: " + err);
  }
});


// 발주서 작성
router.get("/PO_M", (req, res) => {
  // 세션 체크 후 리다이렉션
  if (req.session.isLogin) {
    // 로그인 세션 있을 때
    res.render(path.join(__dirname, "../views/Purchase_Order_M.ejs"));
  } else {
    // 로그인 세션 없을 때
    res.render(path.join(__dirname, "../views/login.ejs"));
  }
});

//받은 발주서
router.get("/PO_R", (req, res) => {
  // 세션 체크 후 리다이렉션
  if (req.session.isLogin == true) {
    //po_query.getPO(req, res);
    res.render(path.join(__dirname, "../views/Purchase_Order_Received.ejs"), {
      req,
    });
    // 쿼리
    // 로그인 세션 있을 때
  } else {
    // 로그인 세션 없을 때
    res.sendFile(path.join(__dirname, "../views/login.ejs"));
  }
});

// 보낸 발주서
router.get("/PO_S", (req, res) => {
  // 세션 체크 후 리다이렉션
  if (req.session.isLogin) {
    // 로그인 세션 있을 때
    res.render(path.join(__dirname, "../views/Purchase_Order.ejs"));
  } else {
    // 로그인 세션 없을 때
    res.sendFile(path.join(__dirname, "../views/login.ejs"));
  }
});

// 마이페이지
router.get("/MYPAGE", (req, res) => {
  if (req.session.isLogin) {
    res.render(path.join(__dirname, "../views/MyPage.ejs"));
  } else {
    res.sendFile(path.join(__dirname, "../views/login.ejs"));
  }
});
*/

module.exports = router;
