const express = require("express");
const router = express.Router();
const path = require("path");
const time = require("../views/js/time.js");
const mysql = require("mysql2/promise"); // mysql 모듈 로드
const DB = require("../DB/Database.js");
const fs = require("fs");
const db_query = require("../DB/login_out_query.js");
const po_query = require("../DB/PO_query.js");
const { v4 } = require("uuid");
const uuid = () => {
  const tokens = v4().split("-");
  return tokens[2] + tokens[1] + tokens[0] + tokens[3] + tokens[4];
};

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
          if (req.query.rows != undefined) {
            const rows = req.query.rows.split(",");
            res.render("../views/Purchase_Order_M.ejs", { req, rows, PO_UUID: uuid(), pass: true });
          } else {
            await po_query.getCompInfo(req, res);
          }
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
              //console.log(time.timeString() + "Next Query will execute at " + req.session.NextQueryTime);
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
          //console.log(time.timeString() + "Already Queried at " + req.session.LastQueryTime);
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
      const ID = req.body.userID;
      const PW = req.body.userPW;
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

router.post("/PO_items_save", async (req, res) => {
  try {
    let DeliveryDate = req.body.DeliveryDate; // 납기일 수정

    let count = req.body.count;
    let PO_UUID = req.body.po_uuid;
    let Content = req.body.Content;
    let P_Code = req.body.P_Code;
    let P_Name = req.body.P_Name;
    let P_Width = req.body.P_Width;
    let P_Height = req.body.P_Height;
    let P_Unit = req.body.P_Unit;
    let P_Quan = req.body.P_Quan;
    let P_Price = req.body.P_Price;
    let P_VAT = req.body.P_VAT;

    await po_query.updatePO_content(PO_UUID, Content, DeliveryDate);
    await po_query.clearPO_item(PO_UUID);
    if (count != 0) {
      for (var i = 0; i < count; i++) {
        if (count == 1) {
          await po_query.savePO_item(PO_UUID, P_Code, P_Name, P_Width, P_Height, P_Unit, P_Quan, P_Price, P_VAT);
        } else {
          await po_query.savePO_item(PO_UUID, P_Code[i], P_Name[i], P_Width[i], P_Height[i], P_Unit[i], P_Quan[i], P_Price[i], P_VAT[i]);
        }
      }
    }
    await po_query.getPO(req, res);
    //res.redirect(req.get("referer"));
    res.send("<script>window.close();</script >");
  } catch (err) {
    console.log(err);
  }
});

router.post("/PO_save", async (req, res) => {
  // 작성된 발주서 저장
  try {
    let PO_UUID = req.body.po_uuid; // PO_UUID 직접 생성
    console.log("UUID : " + PO_UUID);
    let title = req.body.title_PO;
    let Content = req.body.Content;
    let Business_NUM = req.body.Business_NUM; // 내 회사 이름
    let Business_NUM2 = req.body.Business_NUM2; // 상대 회사 이름
    let DeliveryDate = req.body.DeliveryDate; // 납기일 수정

    // Business_NUM으로 "SELECT UUID FROM tb_company WHERE Business_NUM = ?" 에 넣어서 서브쿼리로 사용
    let Chat_Room_Id = uuid(); // Chat_Room_Id 직접 생성

    await po_query.savePO(PO_UUID, title, Content, DeliveryDate, Business_NUM, Business_NUM2, Chat_Room_Id);

    // tb_prd_info 삽입
    let count = req.body.count;
    console.log("count : " + count);
    let P_Code = req.body.P_Code;
    let P_Name = req.body.P_Name;
    let P_Width = req.body.P_Width;
    let P_Height = req.body.P_Height;
    let P_Unit = req.body.P_Unit;
    let P_Quan = req.body.P_Quan;
    let P_Price = req.body.P_Price;
    let P_VAT = req.body.P_VAT;

    if (count != 0) {
      for (var i = 0; i < count; i++) {
        if (count == 1) {
          await po_query.savePO_item(PO_UUID, P_Code, P_Name, P_Width, P_Height, P_Unit, P_Quan, P_Price, P_VAT);
        } else {
          await po_query.savePO_item(PO_UUID, P_Code[i], P_Name[i], P_Width[i], P_Height[i], P_Unit[i], P_Quan[i], P_Price[i], P_VAT[i]);
        }
      }
    }

    await po_query.getPO(req, res);
    res.render("../views/main_login.ejs", { req, pass: true });
  } catch (err) {
    console.log(err);
  }
});

router.get("/Bill", (req, res) => {
  if (req.session.isLogin != true) {
    // 로그인 세션 없을 때
    res.render("../views/login.ejs", {
      pass: "NONE",
    });
  } else {
    res.render("../views/Page_Bills.ejs", { pass: true });
  }
});

router.get("/Tax", (req, res) => {
  if (req.session.isLogin != true) {
    // 로그인 세션 없을 때
    res.render("../views/login.ejs", {
      pass: "NONE",
    });
  } else {
    res.render("../views/Page_Tax_Bill.ejs", { pass: true });
  }
});

router.get("/Trading", (req, res) => {
  if (req.session.isLogin != true) {
    // 로그인 세션 없을 때
    res.render("../views/login.ejs", {
      pass: "NONE",
    });
  } else {
    res.render("../views/Page_Trading_statement.ejs", { pass: true });
  }
});

router.get("/Serach", async (req, res) => {
  if (req.session.isLogin != true) {
    // 로그인 세션 없을 때
    res.render("../views/login.ejs", {
      pass: "NONE",
    });
  } else {
    await po_query.getCompInfo(req);
    res.render("../views/Find_CP.ejs", { req, pass: true });
  }
});

// 마이페이지
router.get("/MYPAGE", (req, res) => {
  if (req.session.isLogin != true) {
    // 로그인 세션 없을 때
    res.render("../views/login.ejs", { pass: "NONE" });
  } else {
    res.render("../views/MyPage.ejs", {
      req,
      pass: true,
    });
  }
});

// 파일 업로드 처리를 위한 multer 미들웨어
const multer = require("multer");
const Database = require("../DB/Database.js");

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "./uploads");
  },
  filename: (req, file, callback) => {
    req.files.originalname = Buffer.from(file.originalname, "latin1").toString("utf-8");
    req.files.filename = uuid();
    callback(null, req.files.filename);
  },
});

const upload = multer({ storage: storage });

// 파일 업로드 라우팅
router.post("/uploads", upload.array("filearray"), async (req, res, next) => {
  try {
    let PO_UUID = req.body.PO_UUID;
    let f_array = new Array();

    for (var i = 0; i < req.files.length; i++) {
      f_array[i] = JSON.stringify({
        UUID: uuid(),
        f_name: req.files[i].originalname,
        f_path: req.path + "/" + req.files[i].filename,
        PO_UUID: PO_UUID,
      });
    }
    await po_query.UPLOAD_FILE(f_array);

    res.send("<script>window.close();</script >");
  } catch (err) {
    console.log(err);
  }
});

// 파일 다운로드 라우팅
router.post("/downloads", async (req, res) => {
  try {
    let f_name = req.body.f_name;
    let f_path = req.body.f_path;

    // ./uploads :: app.js에 static 선언 되어있으므로
    res.status(200).download(path.join("." + f_path), f_name, (err) => {
      if (err) {
        res.status(400).json({ error: "다운로드 실패", message: "파일을 찾을 수 없습니다. 관리자에게 문의하세요." });
        console.log("파일 다운로드 " + err);
      }

      //res.send("<script>alert('파일을 찾을 수 없습니다. 관리자에게 문의하세요.'); window.history.back();</script >");
    });
  } catch (err) {
    console.log(err);
  }
});

// 파일 삭제 라우팅
router.post("/delete", async (req, res) => {
  try {
    let f_name = req.body.f_name;
    let f_path = path.join("." + req.body.f_path);

    await po_query.DELETE_FILE(f_name, f_path);
    fs.unlink(f_path, function (err) {
      if (err) {
        console.log("Error : ", err);
      }
    });
    res.send("<script>window.history.back();</script >");
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
