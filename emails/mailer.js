'use strict';

const Email = require('email-templates');

let transport;

if (process.env.SMTP_ENABLED === 'true') {
  if (process.env.MAILGUN_SMTP_SERVER) {
    process.env.SMTP_HOST = process.env.MAILGUN_SMTP_SERVER;
    process.env.SMTP_PORT = process.env.MAILGUN_SMTP_PORT;
    process.env.SMTP_USERNAME = process.env.MAILGUN_SMTP_LOGIN;
    process.env.SMTP_PASSWORD = process.env.MAILGUN_SMTP_PASSWORD;
  }
  transport = {
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: process.env.SMTP_PORT === 465,
    auth: {
      user: process.env.SMTP_USERNAME,
      pass: process.env.SMTP_PASSWORD
    }
  };
} else {
  transport = {
    jsonTransport: true
  };
}

const email = new Email({
  message: {
    from: `${process.env.REACT_APP_SITE_TITLE} <${process.env.SMTP_FROM_EMAIL_ADDRESS}>`
  },
  send: true,
  transport,
  views: {
    options: {
      extension: 'ejs'
    }
  },
  juice: true,
  juiceResources: {
    preserveImportant: true,
    webResources: {
      relativeTo: __dirname
    }
  }
});

module.exports = email;
