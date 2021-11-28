const mysql = require("mysql");

const connection = mysql.createConnection({
  host: "ulsq0qqx999wqz84.chr7pe7iynqr.eu-west-1.rds.amazonaws.com",
  user: "qvaqge7h8k3y73yb",
  password: "e2exj7jeipje6w89",
  database: "ganmg4v3jducpr0x"
});

const loginFaculty = function(facultyID, password) {
  return new Promise(function(resolve, reject) {
    connection.query("select * from Faculty_Data where FacultyID = ? ", [facultyID], function(error, results, fields) {
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

const getFacultyDashboardData = function(facultyID) {
  return new Promise(function(resolve, reject) {
    connection.query("select * from Faculty_Data where FacultyID = ? ", [facultyID], function(error, results, fields) {
      if (error) {
        reject({ 'Message': 'DB Error' });
      }

      if (results.length > 0) {
        var name = results[0].FirstName + " " + results[0].LastName;
        var query_str2 = "select * from Class";
        connection.query(query_str2, function(err5, rows5, fields5) {
          connection.query("select * from Students_Data", function(err1, rows1, fields1) {
            if (err1) {
              reject({ 'Message': 'DB Error' });
            }
            if (rows1.length > 0) {
              const d = new Date();
              var todayDate = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
              var query_str = "select * from Scheduler where startDate > ?";
              connection.query(query_str, [todayDate], function(err, rows, fields) {
                if (err) {
                  reject({ 'Message': 'DB Error' });;
                }
                if (rows.length === 0) {
                  resolve({ 'Name': name, 'NoOneFilled': true, 'offline': 0, 'online': 0, 'allStudents': rows1, 'allPreference': rows, 'Annoucements': JSON.parse(rows5[0].Annoucements) });
                } else {
                  var offline = 0;
                  var online = 0;
                  for (var i = 0; i < rows.length; i++) {
                    if (rows[i].isOffline) {
                      offline++;
                    } else {
                      online++;
                    }
                  }
                  resolve({ 'Name': name, 'NoOneFilled': false, 'offline': offline, 'online': online, 'allStudents': rows1, 'allPreference': rows, 'Annoucements': JSON.parse(rows5[0].Annoucements) });
                }

              });

            } else {
              resolve({ 'Name': name, 'NoOneFilled': true, 'offline': 0, 'online': 0, 'allStudents': rows1, 'allPreference': [], 'Annoucements': JSON.parse(rows5[0].Annoucements) });
            }
          });
        });
      } else {
        reject({ 'Message': 'Not Registered' });
      }
    });
  });
}

const updateAnnoucement = function(object) {
  return new Promise(function(resolve, reject) {

    var query_str = "select * from Class";
    connection.query(query_str, function(err, rows, fields) {
      if (err) {
        reject({ 'Message': "DB ERROR" });
      }

      var annoucementArray = JSON.parse(rows[0].Annoucements);
      annoucementArray.push(object);

      var query = "UPDATE Class SET Annoucements = ?";
      connection.query(query, [JSON.stringify(annoucementArray)], function(error, rows1, fields1) {
        if (error) {
          reject({ 'Message': "DB ERROR" });
        }
        resolve('Annoucement Made');
      });

    });

  });
}

module.exports = {
  loginFaculty: loginFaculty,
  getFacultyDashboardData: getFacultyDashboardData,
  updateAnnoucement: updateAnnoucement
};