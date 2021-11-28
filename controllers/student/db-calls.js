const mysql = require("mysql");

const connection = mysql.createConnection({
  host: "ulsq0qqx999wqz84.chr7pe7iynqr.eu-west-1.rds.amazonaws.com",
  user: "qvaqge7h8k3y73yb",
  password: "e2exj7jeipje6w89",
  database: "ganmg4v3jducpr0x"
});

const loginStudent = function(studentID, password) {
  return new Promise(function(resolve, reject) {
    connection.query("select * from Students_Data where StudentID = ? ", [studentID], function(error, results, fields) {
      if (error) {
        reject({ 'Message': 'DB Error' })
      }
      if (results.length > 0) {
        if (results[0].LoginPassword !== password) {
          resolve({ 'Message': "PasswordIncorrect" });
        } else {
          resolve({ 'Message': "Login Success" });
        }
      } else {
        resolve({ 'Message': "NotRegistered" });
      }
    });
  });
}

const getStudentDashboardData = function(studentID) {
  return new Promise(function(resolve, reject) {
    connection.query("select * from Students_Data where StudentID = ? ", [studentID], function(error, results, fields) {
      if (error) {
        reject('DB ERROR');
      }
      if (results.length > 0) {
        updateAndGetSeatsArray().then((result6) => {
          var name = results[0].FirstName + " " + results[0].LastName;
          const d = new Date();
          var todayDate = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
          connection.query("select * from Scheduler where StudentID = ? and startDate > ?", [studentID, todayDate], function(err1, rows1, fields1) {
            if (err1) {
              reject('DB ERROR');
            }
            var query_str = "select * from Class";
            connection.query(query_str, function(err, rows, fields) {
              if (rows1.length === 0) {
                resolve({ 'AlreadyFilled': false, 'Registered': true, 'name': name, SeatsLeft: rows[0].SeatsLeft, 'StudentID': results[0].StudentID, 'Annoucements': JSON.parse(rows[0].Annoucements) });
              } else {
                resolve({ 'AlreadyFilled': true, 'SeatNumber': rows1[0].SeatNumber, 'isOffline': rows1[0].isOffline, 'Registered': true, 'name': name, 'StudentID': results[0].StudentID, 'Annoucements': JSON.parse(rows[0].Annoucements) });
              }
            });
          });
        });
      } else {
        resolve({ 'AlreadyFilled': false, 'Registered': false });
      }
    });
  });
}

const insertIntoScheduler = function(studentID, isOffline, studentName, seatNumber, vaccinationStatus) {
  return new Promise(function(resolve, reject) {
    var d = new Date();
    d.setDate(d.getDate() + (((1 + 7 - d.getDay()) % 7) || 7));
    var date = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();

    connection.query("select * from Scheduler where StudentID = ?", [studentID], function(err1, rows1, fields1) {
      if (rows1.length === 0) {
        connection.query("INSERT INTO Scheduler VALUES ('" + studentID + "'," + isOffline + "," + seatNumber + ",'" + studentName + "','" + vaccinationStatus + "','" + date + "')", function(error, results, fields) {
          if (error) {
            reject("DB Error");
          }
          resolve("Student Registered");
        });
      } else {
        connection.query("UPDATE Scheduler SET isOffline = ?, SeatNumber = ?, VaccinationStatus = ?, startDate = ? where StudentID = ?", [isOffline, seatNumber, vaccinationStatus, date, studentID], function(error, results, fields) {
          if (error) {
            reject("DB Error");
          }
          resolve("Student Registered");
        });
      }
    });
  });
}

const updateAndGetSeatsArray = function(studentID) {
  return new Promise(function(resolve, reject) {
    const d = new Date();
    var todayDate = '' + d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate() + '';
    connection.query("select * from Scheduler where startDate <= ? and isOffline = ?", [todayDate, 1], function(err1, rows1, fields1) {
      if (rows1.length === 0) {
        var query_str = "select * from Class";
        connection.query(query_str, function(err, rows, fields) {
          if (err) {
            reject("DB ERROR");
          }
          resolve({ 'SeatsArray': JSON.parse(rows[0].SeatArray) });
        });
      } else {

        var query_str = "select * from Class";
        connection.query(query_str, function(err2, rows2, fields2) {
          if (err2) {
            reject("DB ERROR");
          }
          var currArr = JSON.parse(rows2[0].SeatArray);
          var updatedArr = JSON.parse(rows2[0].SeatArray);
          var totalSeats = updatedArr.length;


          for (var i = 0; i < rows1.length; i++) {
            updatedArr[totalSeats - rows1[i].SeatNumber] = 0;
          }

          var emptySeats = 0;
          for (var i = 0; i < updatedArr.length; i++) {
            if (updatedArr[i] === 0) {
              emptySeats++;
            }
          }

          connection.query("UPDATE Class SET SeatArray = ?,SeatsLeft = ?", [JSON.stringify(updatedArr), emptySeats], function(err3, rows3, fields3) {
            if (err3) {
              reject("DB ERROR");
            }
            resolve({ 'SeatsArray': updatedArr });
          });

        });
      }
    });
  });
}

const setSeat = function(seatNumber, studentID, studentName) {
  return new Promise(function(resolve, reject) {
    var query_str = "select * from Class";
    connection.query(query_str, function(err, rows, fields) {
      if (err) {
        reject({ 'Message': "DB ERROR" });
      }

      var seatArray = JSON.parse(rows[0].SeatArray);
      var currSeatsLeft = rows[0].SeatsLeft;

      if (seatArray[18 - seatNumber] === 0) {
        seatArray[18 - seatNumber] = 1;
        var newArray = JSON.stringify(seatArray);
        var query = "UPDATE Class SET SeatArray = ?, SeatsLeft = ?";
        connection.query(query, [newArray, currSeatsLeft - 1], function(error, rows1, fields1) {
          if (error) {
            reject({ 'Message': "DB ERROR" });
          }
          insertIntoScheduler(studentID, true, studentName, seatNumber, 'Fully Vaccinated').then(function(val) {
            resolve({ 'Message': "Seat Assigned" });
          }).catch((err) => {
            reject({ 'Message': "DB ERROR" });
          });
        });
      } else {
        reject({ 'Message': "This seat is already Filled" });
      }

    });
  });
}

module.exports = {
  loginStudent: loginStudent,
  getStudentDashboardData: getStudentDashboardData,
  insertIntoScheduler: insertIntoScheduler,
  updateAndGetSeatsArray: updateAndGetSeatsArray,
  setSeat: setSeat
};