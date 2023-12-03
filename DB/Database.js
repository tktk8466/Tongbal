const mysql = require("mysql2/promise"); // mysql 모듈 로드
const session = require("express-session");
const MySQLStore = require("express-mysql-session")(session);
const time = require("../views/js/time.js");
const fs = require("fs");

// MySQL 로그인 정보 파일 읽기
const dbConfig = JSON.parse(fs.readFileSync("DB_data.json", "utf8"));
console.log(dbConfig);

// MYSQL CONNECTION
const DB = mysql.createPool(dbConfig);

var sessionStore = new MySQLStore(dbConfig);

module.exports = {
  conn: async () => {
    return new Promise((resolve, reject) => {
      str = time.timeString() + "database :: DB 접속 부여중...";
      try {
        resolve(DB.getConnection());
        console.log(str + "DONE");
      } catch (err) {
        reject();
        console.log(str + "FAILED");
        console.error(err);
      }
    });
  },
  sessionStore,
};
