/*jshint esversion: 6 */
const mysql = require("mysql");
const bodyParser = require('body-parser');
const express = require("express");
const urlHelper = require("./routes.js");
const app = express();

app.use(express.static("public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

/* SQL database Connection */
const connection = mysql.createConnection({
  host: "ulsq0qqx999wqz84.chr7pe7iynqr.eu-west-1.rds.amazonaws.com",
  user: "qvaqge7h8k3y73yb",
  password: "e2exj7jeipje6w89",
  database: "ganmg4v3jducpr0x"
});

connection.connect(function(error) {
  if (error) throw error
  else console.log("connected to the database successfully!")
});

urlHelper.setRequestUrl(app);

app.listen(process.env.PORT || 3000, function() {
  console.log("Server started on port 3000");
});
