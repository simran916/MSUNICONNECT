var routes = require('./../../routes.js');
var dbCalls = require('./db-calls.js');

/* Student Login Page */
const loginPage = function(req, res, next) {
  res.sendFile(routes.dirname + "/html/student-login.html");
};

/* Student onLogin handle */
const onLogin = function(req, res, next) {
  var studentID = req.body.studentID;
  var password = req.body.password;

  dbCalls.loginStudent(studentID, password).then(function(val) {
    if (val.Message === "PasswordIncorrect") {
      res.redirect("/StudentLogin?a=PasswordIncorrect")
    } else if (val.Message === "NotRegistered") {
      res.redirect("/StudentLogin?a=NotRegistered");
    } else {
      res.redirect("/StudentDashboard/" + studentID);
    }
  }).catch((err) => {
    res.redirect("/StudentLogin?a=dbError");
  });

};

module.exports = {
  loginPage: loginPage,
  onLogin: onLogin
}