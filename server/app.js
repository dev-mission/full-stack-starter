import 'dotenv/config';
import createError from 'http-errors';
import express from 'express';
import path from 'path';
import cookieSession from 'cookie-session';
import logger from 'morgan';
import passport from 'passport';
import fileUpload from 'express-fileupload';
import i18n from 'i18n';
import { StatusCodes } from 'http-status-codes';
import { fileURLToPath } from 'url';

import routes from './routes/index.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

/// router logging output
if (process.env.NODE_ENV !== 'test') {
  app.use(logger('dev'));
}
/// multipart file upload support (when not uploading direct to S3)
app.use(
  fileUpload({
    useTempFiles: !process.env.AWS_S3_BUCKET,
  }),
);
/// configure allowed file upload types and max file size
app.use(express.raw({ type: ['image/*'], limit: '10mb' }));
/// support json content body
app.use(express.json());
/// support standard form urlencoded body
app.use(express.urlencoded({ extended: false }));
/// support forwarded headers from intermediate proxies
app.set('trust proxy', 1);
/// set up session handling in cookies
app.use(
  cookieSession({
    secret: process.env.SESSION_SECRET,
    secure: process.env.NODE_ENV === 'production',
  }),
);
/// use passport for authentication
app.use(passport.initialize());
app.use(passport.session());
/// support internationalization of strings
i18n.configure({
  locales: ['en'],
  directory: path.join(__dirname, 'locales'),
});
app.use(i18n.init);
/// set up local variables commonly used in all requests
app.use((req, res, next) => {
  /// set the current logged in user, if any
  res.locals.currentUser = req.user;
  next();
});

/// load in all the configured routes in /routes/index.js
app.use(routes);

/// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

/// error handler
app.use((err, req, res) => {
  /// render the error
  res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(err);
});

export default app;
