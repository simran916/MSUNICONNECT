var dbCalls = require('./db-calls.js');

/* Faculty Dashboard */
const dashboard = function(req, res, next) {
  const facultyID = req.params.facultyID;

  dbCalls.getFacultyDashboardData(facultyID).then(function(val) {
    res.render("faculty/faculty-dashboard", { Name: val.Name, FacultyID: facultyID, AllStudents: val.allStudents, NoOneFilled: val.NoOneFilled, Offline: val.offline, Online: val.online, AllPreference: val.allPreference, Annoucements: val.Annoucements });
  }).catch((err) => {
    if (err.Message === 'Not Registered') {
      res.redirect("/FacultyLogin?a=NotRegistered");
    } else {
      res.redirect("/FacultyLogin?a=dbError");
    }
  });
};

/* Faculty onAnnouce handle */
const onAnnouce = function(req, res, next) {
  const facultyName = req.body.facultyName.replace("_", " ");
  const message = req.body.message;
  const facultyID = req.body.facultyID;

  var d = new Date();
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  var date = (monthNames[d.getMonth()]) + " " + d.getDate();
  var object = {
    'Name': facultyName,
    'date': date,
    'message': message
  };

  dbCalls.updateAnnoucement(object).then((result) => {
    if (result === "Annoucement Made") {
      res.redirect("/FacultyDashboard/" + facultyID + "?a=Annoucement");
    }
  }).catch((err) => {
    res.redirect("/handleAnnouce/" + facultyID);
  });
};


module.exports = {
  dashboard: dashboard,
  onAnnouce: onAnnouce
}