'use strict';

if (process.argv.length != 6) {
  console.log("Usage: node bin/create-admin.js First Last email@address.com password");
  return;
}

const bcrypt = require('bcrypt');
const models = require('../models');

bcrypt.hash(process.argv[5], 10).then(hashedPassword => {
  models.User.create({
    firstName: process.argv[2],
    lastName: process.argv[3],
    email: process.argv[4],
    hashedPassword: hashedPassword,
    isAdmin: true
  }).then(user => {
    console.log('Admin user created!');
  });
});
