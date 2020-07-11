require('dotenv').config();

const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieSession = require('cookie-session');
const logger = require('morgan');
const expressLayouts = require('express-ejs-layouts');
const flash = require('connect-flash');
const passport = require('passport');
const fileUpload = require('express-fileupload');
const i18n = require('i18n');
const bodyParser = require('body-parser');

const helpers = require('./routes/helpers');
const routes = require('./routes');

const app = express();

/// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(expressLayouts);
/// router logging output
app.use(logger('dev'));
/// multipart file upload support (when not uploading direct to S3)
app.use(fileUpload({
  useTempFiles: !process.env.AWS_S3_BUCKET
}));
/// configure allowed file upload types and max file size
app.use(bodyParser.raw({type: [
  'image/*'
], limit: '10mb'}));
/// support json content body
app.use(express.json());
/// support standard form urlencoded body
app.use(express.urlencoded({ extended: false }));
/// support forwarded headers from intermediate proxies
app.set('trust proxy', 1);
/// set up session handling in cookies
app.use(cookieSession({
  secret: process.env.SESSION_SECRET,
  secure: process.env.NODE_ENV == 'production'
}));
/// support session flash messages displayed on next request
app.use(flash());
/// use passport for authentication
app.use(passport.initialize());
app.use(passport.session());
/// support internationalization of strings
i18n.configure({
  locales: ['en'],
  directory: path.join(__dirname, 'locales')
});
app.use(i18n.init);
/// add in our custom static file upload helpers
app.use(helpers.assetHelpers);
/// set up local variables commonly used in all requests
app.use(function(req, res, next) {
  /// set any flash messages in the session from a previous request
  res.locals.flash = req.flash();
  /// set the current logged in user, if any
  res.locals.currentUser = req.user;
  next();
});

/// load in all the configured routes in /routes/index.js
app.use(routes);

/// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

/// error handler
app.use(function(err, req, res, next) {
  /// set locals, only providing error in development
  res.locals.currentUser = null;
  res.locals.flash = {};
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.locals.title = "Error!";

  /// render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
