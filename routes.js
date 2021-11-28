exports.setRequestUrl = function(app) {

  var home = require('./controllers/home.js');

  var studentLogin = require('./controllers/student/login.js');
  var studentRegister = require('./controllers/student/register.js');
  var studentDashboard = require('./controllers/student/dashboard.js');
  var studentSeatSelector = require('./controllers/student/seat-selector.js');

  var facultyLogin = require('./controllers/faculty/login.js');
  var facultyRegister = require('./controllers/faculty/register.js');
  var facultyDashboard = require('./controllers/faculty/dashboard.js');

  /* Home pages routes */
  app.get('/', home.intro);
  app.get('/welcome', home.portal);

  /* Student's portal routes */
  app.get('/StudentLogin', studentLogin.loginPage);
  app.post('/StudentLoginForm', studentLogin.onLogin);
  app.get('/StudentRegister', studentRegister.registerPage);
  app.post('/RegisterStudent', studentRegister.onRegister);
  app.get('/StudentDashboard/:studentID', studentDashboard.dashboard);
  app.post('/WillingnessForm', studentDashboard.onSubmitWillingness);
  app.get('/SelectSeat/:studentID/:studentName', studentSeatSelector.seatSelectPage);
  app.post('/SelectSeat', studentSeatSelector.onSeatSelect);

  /* Faculty's portal routes */
  app.get('/FacultyLogin', facultyLogin.loginPage);
  app.post('/FacultyLoginForm', facultyLogin.onLogin);
  app.get('/FacultyRegister', facultyRegister.registerPage);
  app.post('/RegisterFaculty', facultyRegister.onRegister);
  app.get('/FacultyDashboard/:facultyID', facultyDashboard.dashboard);
  app.post('/MakeAnnoucement', facultyDashboard.onAnnouce);

};

/* Website's path */
exports.dirname = __dirname;