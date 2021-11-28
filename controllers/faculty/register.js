var routes = require('./../../routes.js');
var db = require('./../db-connection.js');
const connection = db.connection();

/* Faculty Register Page */
const registerPage = function(req, res, next) {
  res.sendFile(routes.dirname + "/html/faculty-registration.html");
};

/* Faculty onRegister handle */
const onRegister = function(req, res, next) {
  var facultyID = req.body.facultyID;
  var password = req.body.password;
  var fname = req.body.fname;
  var lname = req.body.lname;
  var department = req.body.course;
  var address = req.body.address;
  var email = req.body.email;
  var pinCode = req.body.pincode;

  connection.query("INSERT INTO Faculty_Data VALUES ('" + facultyID + "','" + fname + "','" + lname + "','" + department + "','" + address + "','" + pinCode + "','" + email + "','" + password + "')", function(error, results, fields) {
    if (error) {
      var errMsg = error.sqlMessage;
      if (errMsg.substring(0, 15) === 'Duplicate entry') {
        res.redirect('/FacultyRegister?a=AlreadyRegistered');
      }
    } else {
      res.redirect('/FacultyRegister?a=Success');
    }
    res.end();
  });
};

module.exports = {
  registerPage: registerPage,
  onRegister: onRegister
}