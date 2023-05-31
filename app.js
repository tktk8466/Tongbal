const express = require("express");
const express_session = require("express-session");
const database = require("./DB/Database.js");
const time = require("./views/js/time.js");
const indexRouter = require("./routes/index.js");
const app = express();
const WebSocketServer = require("./Chat/WebSocket_Module.js");

//---------------세션 미들웨어----------------------
//app.use(cookieparser);
app.use(
  express_session({
    secret: "awkfdsdnrqwrhfhwekykuyrsefq",
    resave: false,
    saveUninitialized: true,
    store: database.sessionStore,
    cookie: { maxAge: 3.6e6 * 1 }, // 1시간 유효
  })
);
// body-parser를 이용해 application/x-www-form-urlencoded 파싱
app.use(express.urlencoded({ extended: true }));
// body-parser를 이용해 application/json 파싱
app.use(express.json());

//-----------------라우팅-------------------------
app.use("/image", express.static("./views/image"));
app.use("/css", express.static("./views/css"));
app.use("/js", express.static("./views/js"));
app.use("/node_modules", express.static("./node_modules"));
app.use("/", indexRouter);
app.use((req, res, next) => {
  res.status(404).send("Error 404 :: Page Not Found");
});
app.use((err, req, res, next) => {
  console.log(time.timeString() + "res error :: " + err);
});

//------------------웹소켓----------------------------

const wss = new WebSocketServer(8080);
wss.start();

//------------------서버 포트설정----------------------------
app.set("view engine", "ejs");
app.set("port", process.env.PORT || 50001);
app.listen(app.get("port"), () => {
  console.log(app.get("port"), "번 포트에서 대기 중");
});
