let fs = require('fs');
let express = require('express');
let session = require('express-session');
let path = require('path');
let favicon = require('serve-favicon');
let logger = require('morgan');
let passport = require('passport');
let cookieParser = require('cookie-parser');
let bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
//let index = require('./routes/index');
//let users = require('./routes/users');
let flash = require('connect-flash');

let app = express();
app.disable('x-powered-by');
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(flash());
//app.use('/', index);

app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session());
app.use(fileUpload());

app.use(session({
	key:'sesscookiename',
	secret: 'keyboard catSDSDD',
	resave: false,
	cookie:{_expires : 60000000},
	saveUninitialized: false,
}));


fs.readdirSync(__dirname + '/controllers').forEach(function (file) {
	if(file.substr(-3) == '.js') {
		let route = require(__dirname + '/controllers/' + file);
		route.controller(app);
	}
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  let err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
