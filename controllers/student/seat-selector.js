var dbCalls = require('./db-calls.js');

/* Student Seat Select page */
const seatSelectPage = function(req, res, next) {
  const studentID = req.params.studentID;
  const studentName = decodeURIComponent(req.params.studentName);

  dbCalls.updateAndGetSeatsArray().then((result) => {
    res.render("student/seat-selector", { Name: studentID, StudentName: studentName, StudentID: studentID, SeatsArray: result.SeatsArray });
  }).catch((err) => {
    res.redirect('/StudentDashboard/' + studentID);
  });
};

/* Student onSeatSelect handle */
const onSeatSelect = function(req, res, next) {
  const seatNumber = req.body.seatNumber;
  const studentName = req.body.studentName.replace("_", " ");
  const studentID = req.body.studentID;

  dbCalls.setSeat(seatNumber, studentID, studentName).then((result) => {
    if (result.Message === "Seat Assigned") {
      res.redirect("/StudentDashboard/" + studentID);
    }
  }).catch((err) => {
    if (err.Message === "This seat is already Filled") {
      res.redirect("/SelectSeat/" + studentID + "?a=SeatAlreadyFilled");
    } else {
      res.redirect("/SelectSeat/" + studentID + "?a=dbError");
    }
  });
};

module.exports = {
  seatSelectPage: seatSelectPage,
  onSeatSelect: onSeatSelect
}