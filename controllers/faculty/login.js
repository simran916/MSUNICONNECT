var routes = require('./../../routes.js');
var dbCalls = require('./db-calls.js');

/* Faculty Login Page */
const loginPage = function(req, res, next) {
  res.sendFile(routes.dirname + "/html/faculty-login.html");
};

/* Faculty onLogin handle */
const onLogin = function(req, res, next) {
  var facultyID = req.body.facultyID;
  var password = req.body.password;

  dbCalls.loginFaculty(facultyID, password).then(function(val) {
    if (val.Message === "PasswordIncorrect") {
      res.redirect("/FacultyLogin?a=PasswordIncorrect")
    } else if (val.Message === "NotRegistered") {
      res.redirect("/FacultyLogin?a=NotRegistered");
    } else {
      res.redirect("/FacultyDashboard/" + facultyID);
    }
  }).catch((err) => {
    res.redirect("/FacultyLogin?a=dbError");
  });

};

module.exports = {
  loginPage: loginPage,
  onLogin: onLogin
}