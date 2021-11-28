var routes = require('./../../routes.js');
var db = require('./../db-connection.js');
const connection = db.connection();

/* Student Register Page */
const registerPage = function(req, res, next) {
  res.sendFile(routes.dirname + "/html/student-registration.html");
};

/* Student onRegister handle */
const onRegister = function(req, res, next) {
  var studentID = req.body.studentID;
  var password = req.body.password;
  var fname = req.body.fname;
  var lname = req.body.lname;
  var course = req.body.course;
  var address = req.body.address;
  var email = req.body.email;
  var pinCode = req.body.pincode;
  connection.query("INSERT INTO Students_Data VALUES ('" + studentID + "','" + fname + "','" + lname + "','" + course + "','" + address + "','" + pinCode + "','" + email + "','" + password + "')", function(error, results, fields) {
    if (error) {
      var errMsg = error.sqlMessage;
      if (errMsg.substring(0, 15) === 'Duplicate entry') {
        res.redirect('/StudentRegister?a=AlreadyRegistered');
      }
    } else {
      res.redirect('/StudentRegister?a=Success');
    }
    res.end();
  });
};

module.exports = {
  registerPage: registerPage,
  onRegister: onRegister
}