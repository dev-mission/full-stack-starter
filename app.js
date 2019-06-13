require('dotenv').config();
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieSession = require('cookie-session');
var logger = require('morgan');
var expressLayouts = require('express-ejs-layouts');
var flash = require('connect-flash');
var passport = require('passport');
var fileUpload = require('express-fileupload');
var i18n = require('i18n');

var interceptors = require('./routes/interceptors');
var indexRouter = require('./routes/index');
var loginRouter = require('./routes/login');
var adminRouter = require('./routes/admin');
var apiRouter = require('./routes/api');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(expressLayouts);
app.use(logger('dev'));
app.use(fileUpload({
  useTempFiles: !process.env.AWS_S3_BUCKET
}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.set('trust proxy', 1);
app.use(cookieSession({
  secret: process.env.SESSION_SECRET,
  secure: process.env.NODE_ENV == 'production'
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(path.join(__dirname, 'public')));
app.use('/client', express.static(path.join(__dirname, 'dist')));
app.use('/libraries/bootstrap', express.static(path.join(__dirname, 'node_modules/bootstrap/dist')));
app.use('/libraries/cleave', express.static(path.join(__dirname, 'node_modules/cleave.js/dist')));
app.use('/libraries/fontawesome', express.static(path.join(__dirname, 'node_modules/@fortawesome/fontawesome-free')));
app.use('/libraries/jquery', express.static(path.join(__dirname, 'node_modules/jquery/dist')));

i18n.configure({
  locales: ['en'],
  directory: path.join(__dirname, 'locales')
});

app.use(i18n.init);
app.use(function(req, res, next) {
  res.locals.flash = req.flash();
  res.locals.currentUser = req.user;
  next();
});

app.use('/', indexRouter);
app.use('/login', loginRouter);
app.use('/admin', interceptors.requireLogin);
app.use('/admin', adminRouter);
app.use('/api', interceptors.requireLogin);
app.use('/api', apiRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.currentUser = null;
  res.locals.flash = {};
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.locals.title = "Error!";

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
