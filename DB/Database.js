const mysql = require("mysql2/promise"); // mysql 모듈 로드
const session = require("express-session");
const MySQLStore = require("express-mysql-session")(session);

const time = require("../views/js/time.js");

// MYSQL CONNECTION
const dbConfig = {
  // mysql 접속 설정
  //host: "localhost",
  //port: "3306",
  host: "34.64.226.169",
  port: "3306",
  user: "root",
  password: "Tongbal123!@#",
  database: "tongbal",
  connectionLimit: 100,
  dateStrings: "date",
};

const DB = mysql.createPool(dbConfig);

var sessionStore = new MySQLStore(dbConfig);

module.exports = {
  conn: async () => {
    return new Promise((resolve, reject) => {
      //console.log(time.timeString() + "database :: DB 접속 부여중...");
      try {
        resolve(DB.getConnection());
        //console.log(time.timeString() + "database :: DB 접속 부여중...DONE");
      } catch (err) {
        reject();
        console.log(time.timeString() + "database :: DB 접속 부여중...FAILED");
      }
    });
  },
  sessionStore,
};
