const express = require("express");
const router = express.Router();
const path = require("path");
const time = require("../views/js/time.js");
const db_query = require("../DB/login_out_query.js");
const po_query = require("../DB/PO_query.js");
const chat_query = require("../Chat/ChatMsg_query.js");

// Bootstrap
router.use("/bootstrap", express.static(path.join(__dirname, "../node_modules/bootstrap/dist")));
// For Jquery
router.use("/node_modules", express.static(path.join(__dirname, "../node_modules")));
// static routers
// 로그인 전 메인

router.get("/", async (req, res) => {
  try {
    var Page = req.query.Page;
    if (req.session.isLogin == true) {
      if (Page == "PO_M") {
        if (req.session.isLogin != true) {
          // 로그인 세션 없을 때
          res.render("../views/login.ejs", {
            pass: "NONE",
          });
        } else {
          res.render("../views/Purchase_Order_M.ejs");
        }
      } else if (Page == "PO_R") {
        if (req.session.isLogin != true) {
          // 로그인 세션 없을 때
          res.render("../views/login.ejs", {
            pass: "NONE",
          });
        } else {
          try {
            if (req.session.NextQueryTime == undefined || req.session.NextQueryTime <= time.getNow().toISOString()) {
              await po_query.getPO(req, res);
              res.render("../views/Purchase_Order_Received.ejs", {
                req,
                pass: true,
              });
            } else {
              console.log(time.timeString() + "Next Query will execute at " + req.session.NextQueryTime);
              res.render("../views/Purchase_Order_Received.ejs", {
                req,
                pass: true,
              });
            }
          } catch (err) {
            console.log(time.timeString() + " Error at Page =='PO_R' :: " + err);
          }
        }
      } else if (Page == "PO_S") {
        if (req.session.isLogin != true) {
          // 로그인 세션 없을 때
          res.render("../views/login.ejs", {
            pass: "NONE",
          });
        } else {
          try {
            if (req.session.NextQueryTime == undefined || req.session.NextQueryTime <= time.getNow().toISOString()) {
              await po_query.getPO(req, res);
              res.render("../views/Purchase_Order_Send.ejs", {
                req,
                pass: true,
              });
            } else {
              console.log(time.timeString() + "Next Query will execute at " + req.session.NextQueryTime);
              res.render("../views/Purchase_Order_Send.ejs", {
                req,
                pass: true,
              });
            }
          } catch (err) {
            console.log(time.timeString() + " Error at Page =='PO_S' :: " + err);
          }
        }
      } else {
        // 로그인 세션 있음, 메인 연결
        if (req.session.NextQueryTime == undefined || req.session.NextQueryTime <= time.getNow().toISOString()) {
          await po_query.getPO(req, res);
          //console.log(req.session);
          res.render("../views/main_login.ejs", { req, pass: true });
        } else {
          console.log(time.timeString() + "Already Queried at " + req.session.LastQueryTime);
          res.render("../views/main_login.ejs", { req, pass: true });
        }
      }
    } else {
      // 로그인 세션 없을 때
      res.render("../views/main.ejs");
    }
  } catch (err) {
    console.log(err);
  }
});

router.post("/", async (req, res) => {
  try {
    var Page = req.body.Page;

    if (Page == "Login") {
      res.render("../views/login.ejs", {
        pass: "attempt",
      });
      //
    } else if (Page == "Login_attempt") {
      let ID = req.body.userID;
      let PW = req.body.userPW;
      try {
        if (await db_query.login(req, res, ID, PW)) {
          await po_query.getPO(req, res);
          res.render("../views/login.ejs", { req, pass: true });
        } else {
          res.render("../views/login.ejs", {
            pass: false,
          });
        }
      } catch (err) {
        console.log(time.timeString() + " Error at Page =='Login' :: " + err);
      }
      //
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
  try {
    if (req.session.isLogin != true) {
      // 로그인 세션 없을 때
      res.render("../views/main.ejs");
    } else {
      var type = req.query.type;
      var key = req.query.key;
      res.render("../views/Purchase_Order_edit.ejs", { req, type, key });
    }
  } catch (err) {
    console.log(err);
  }
});

router.get("/Bill", (req, res) => {
  res.render("../views/Page_Bills.ejs");
});

router.get("/Tax", (req, res) => {
  res.render("../views/Page_Tax_Bill.ejs");
});

router.get("/Trading", (req, res) => {
  res.render("../views/Page_Trading_statement.ejs");
});

router.get("/Serach", (req, res) => {
  res.render("../views/Find_CP.ejs");
});

// 마이페이지
router.get("/MYPAGE", (req, res) => {
  if (req.session.isLogin == true) {
    res.render("../views/MyPage.ejs", {
      req,
      pass: true,
    });
  } else {
    // 로그인 세션 없을 때
    res.render("../views/login.ejs", { pass: "NONE" });
    console.log(time.timeString() + " get'/' :: 로그인 세션 없음, 로그인 페이지 연계");
  }
});

module.exports = router;
