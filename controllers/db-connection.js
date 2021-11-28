const mysql = require("mysql");

/* SQL Database Credentials */
const connection = mysql.createConnection({
  host: "ulsq0qqx999wqz84.chr7pe7iynqr.eu-west-1.rds.amazonaws.com",
  user: "qvaqge7h8k3y73yb",
  password: "e2exj7jeipje6w89",
  database: "ganmg4v3jducpr0x"
});

exports.connection = function() {
  return connection;
} 
