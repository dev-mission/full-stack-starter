#!/usr/bin/env node

'use strict';

if (process.argv.length != 6) {
  console.log('Usage: bin/create-admin First Last email@address.com password');
  process.exit(1);
}

import bcrypt from 'bcrypt';
import models from '../models/index.js';

bcrypt.hash(process.argv[5], 10).then((hashedPassword) => {
  models.User.create({
    firstName: process.argv[2],
    lastName: process.argv[3],
    email: process.argv[4],
    hashedPassword: hashedPassword,
    isAdmin: true,
  }).then(() => {
    console.log('Admin user created!');
    models.sequelize.close();
  });
});
