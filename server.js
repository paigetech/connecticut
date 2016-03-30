// set up ======================================================================
var express  = require('express');
var app      = express(); 								// create our app w/ express
var mongoose = require('mongoose'); 					// mongoose for mongodb
var database = require('./config/database'); 			// load the database config
var cookieParser = require('cookie-parser');
var morgan   = require('morgan');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var passport = require('passport');
var flash = require('connect-flash');
var session = require('express-session');
var port = process.env.PORT || 3000 // setting up the port
var twilio = require('twilio');
client = twilio('AC5906f34bfa5adebfb9768750c5f7c781', '2c867137a0651e2054f349be82bed12e');



//socket
var server = require('http').Server(app);
var io = require('socket.io')(server);

var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

io.on('connection', function(socket){
  console.log("wooo");
  socket.on('chat message', function(msg){
    io.emit('chat message', msg);
    console.log("Message: " + msg);
  });
});

// configuration ===============================================================
mongoose.connect(database.url); 	// connect to mongoDB database on modulus.io

app.use(express.static(__dirname + '/public'));
app.use(morgan('dev')); // log every request to the console
app.use(bodyParser.urlencoded({'extended':'true'})); // parse application/x-www-form-urlencoded
app.use(bodyParser.json()); // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(methodOverride('X-HTTP-Method-Override')); // override with the X-HTTP-Method-Override header in the request
app.use(cookieParser()); // read cookies (needed for auth)
app.use(session({
  secret : 'paperlamp',
  name: 'dragonmagic',
  proxy: true,
  resave: true,
  saveUninitialized: true
})); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

require('./config/passport')(passport); // pass passport for configuration

// routes
require('./app/routes.js')(app, passport);

// use express routing for pages refresh
app.get('/*', function(req, res, next) {
  // Just send the index.html for other files to support HTML5Mode
  res.sendFile('/public/index.html', { root: __dirname });
});
//allow CORS
app.all('*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-type,Accept,X-Access-Token,X-key');
  if (req.method == 'OPTIONS') {
    res.status(200).end();
  } else {
    next();
  }
});

http.listen(3000, function(){
    console.log('listening on *:3000');
});

// listen (start app with node server.js) ======================================
//app.listen(port);
console.log("App listening on port " + port);
