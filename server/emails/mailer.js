import crypto from 'crypto';
import Email from 'email-templates';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

let transport;

if (process.env.SMTP_ENABLED === 'true') {
  if (process.env.MAILGUN_SMTP_SERVER) {
    process.env.SMTP_HOST = process.env.MAILGUN_SMTP_SERVER;
    process.env.SMTP_PORT = process.env.MAILGUN_SMTP_PORT;
    process.env.SMTP_USERNAME = process.env.MAILGUN_SMTP_LOGIN;
    process.env.SMTP_PASSWORD = process.env.MAILGUN_SMTP_PASSWORD;
  } else if (process.env.AWS_SES_REGION) {
    process.env.SMTP_HOST = `email-smtp.${process.env.AWS_SES_REGION}.amazonaws.com`;
    process.env.SMTP_PORT = 587;
    process.env.SMTP_USERNAME = process.env.AWS_SES_ACCESS_KEY_ID;
    // convert secret access key to SMTP password
    // based on pseudocode at: https://docs.aws.amazon.com/ses/latest/dg/smtp-credentials.html#smtp-credentials-convert
    const date = '11111111';
    const service = 'ses';
    const terminal = 'aws4_request';
    const message = 'SendRawEmail';
    const version = 4;
    let signature;
    signature = crypto.createHmac('sha256', `AWS4${process.env.AWS_SES_SECRET_ACCESS_KEY}`, { encoding: 'utf8' }).update(date).digest();
    signature = crypto.createHmac('sha256', signature).update(process.env.AWS_SES_REGION).digest();
    signature = crypto.createHmac('sha256', signature).update(service).digest();
    signature = crypto.createHmac('sha256', signature).update(terminal).digest();
    signature = crypto.createHmac('sha256', signature).update(message).digest();
    signature = Buffer.concat([new Uint8Array([version]), signature]);
    process.env.SMTP_PASSWORD = signature.toString('base64');
  }
  transport = {
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: process.env.SMTP_PORT === 465,
    auth: {
      user: process.env.SMTP_USERNAME,
      pass: process.env.SMTP_PASSWORD,
    },
  };
} else {
  transport = {
    jsonTransport: true,
  };
}

if (process.env.NODE_ENV === 'test') {
  // eslint-disable-next-line global-require, import/no-extraneous-dependencies
  transport = (await import('nodemailer-mock')).default.createTransport(transport);
}

const email = new Email({
  message: {
    from: `${process.env.VITE_SITE_TITLE} <${process.env.SMTP_FROM_EMAIL_ADDRESS}>`,
  },
  send: true,
  transport,
  views: {
    root: path.resolve(__dirname),
    options: {
      extension: 'ejs',
    },
  },
  juice: true,
  juiceResources: {
    preserveImportant: true,
    webResources: {
      relativeTo: __dirname,
    },
  },
});

export default email;
