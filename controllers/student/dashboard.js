var dbCalls = require('./db-calls.js');

/* Student Dashboard  */
const dashboard = function(req, res, next) {
  const studentID = req.params.studentID;

  dbCalls.getStudentDashboardData(studentID).then(function(val) {
    if (val.AlreadyFilled) {
      res.render("student/student-dashboard", { Name: val.name, StudentID: val.StudentID, AlreadyFilled: true, SeatsLeft: "AlreadyFilled", SeatNumber: val.SeatNumber, isOffline: val.isOffline, Annoucements: val.Annoucements });
    } else {
      if (val.Registered) {
        res.render("student/student-dashboard", { Name: val.name, StudentID: val.StudentID, AlreadyFilled: false, SeatsLeft: val.SeatsLeft, SeatNumber: null, isOffline: null, Annoucements: val.Annoucements });
      } else {
        res.redirect("/StudentLogin?a=NotRegistered");
      }
    }
  }).catch((err) => { res.redirect("/StudentLogin?a=dbError"); });
};

/* Student onSubmit Willingness form */
const onSubmitWillingness = function(req, res, next) {
  var studentID = req.body.studentID;
  var status = req.body.status;
  var studentName = req.body.studentName.replace("_", " ");
  var vaccinationStatus = req.body['vaccination-status'];

  if (status === "Online") {
    if (vaccinationStatus === "Vaccinated") {
      vaccinationStatus = "Dose 1";
    }

    dbCalls.insertIntoScheduler(studentID, false, studentName, null, vaccinationStatus).then(function(val) {
      res.redirect('/StudentDashboard/' + studentID);
    }).catch((err) => {
      console.log(err);
      res.redirect('/StudentDashboard/' + studentID);
    });

  } else {
    res.redirect('/SelectSeat/' + studentID + '/' + studentName);
  }
};

module.exports = {
  dashboard: dashboard,
  onSubmitWillingness: onSubmitWillingness
}