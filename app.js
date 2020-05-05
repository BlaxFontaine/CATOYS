var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var cors = require('cors');

var app = express();

app.use(cors());

const PORT = process.env.PORT || 5000;

// mongodb connection
mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/catoys", { useNewUrlParser: true, useUnifiedTopology: true });
var db = mongoose.connection;

//mongo error
db.on('error', console.error.bind(console, 'connection error:'));

// use sessions
app.use(session({
  secret: 'for cat lovers',
  resave: true,
  saveUninitialized: false,
  store: new MongoStore({
    mongooseConnection: db
  })
}));

// make userID available in templates
app.use(function (req, res, next) {
  res.locals.currentUser = req.session.userId;
  next();
})

// parse incoming requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// view engine setup
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

// include routes
var routes = require('./routes/index');
app.use('/', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('File Not Found');
  err.status = 404;
  next(err);
});

// error handler
// define as the last app.use callback
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

// listen on port 4242
app.listen(PORT, function () {
  console.log(`Express app listening on port ${PORT}`);
});
