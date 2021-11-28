var routes = require('./../routes.js');

/* Intro Page */
const intro = function(req, res, next) {
  res.sendFile(routes.dirname + "/html/introduction.html");
};

/* Portal Home page */
const portal = function(req, res, next) {
  res.sendFile(routes.dirname + "/html/welcome.html");
};

module.exports = {
  intro: intro,
  portal: portal
}