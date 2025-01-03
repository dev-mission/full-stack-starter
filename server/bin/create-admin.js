#!/usr/bin/env node

import '../config.js';
import prisma from '#prisma/client.js';
import User from '#models/user.js';

if (process.argv.length !== 6) {
  console.log('Usage: bin/create-admin.js First Last email@address.com password');
  process.exit(1);
}

const data = {
  firstName: process.argv[2],
  lastName: process.argv[3],
  email: process.argv[4],
  isAdmin: true,
};
const user = new User(data);
await user.setPassword(process.argv[5]);
await prisma.user.create({ data });
console.log('Done!');
