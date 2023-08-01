const mysql = require("mysql2/promise"); // mysql 모듈 로드
const session = require("express-session");
const MySQLStore = require("express-mysql-session")(session);

const time = require("../views/js/time.js");

// MYSQL CONNECTION
const dbConfig = {
  // mysql 접속 설정
  host: "",
  port: "",
  user: "",
  password: "",
  database: "",
  connectionLimit: 100,
  dateStrings: "date",
};

const DB = mysql.createPool(dbConfig);

var sessionStore = new MySQLStore(dbConfig);

module.exports = {
  conn: async () => {
    return new Promise((resolve, reject) => {
      try {
        resolve(DB.getConnection());
      } catch (err) {
        reject();
        console.log(time.timeString() + "database :: DB 접속 부여중...FAILED");
      }
    });
  },
  sessionStore,
};
