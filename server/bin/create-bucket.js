#!/usr/bin/env node

'use strict';

if (process.argv.length != 3) {
  console.log('Usage: bin/create-bucket bucketname');
  process.exit(1);
}

import 'dotenv/config';
import s3 from '../lib/s3.js';

s3.createBucket(process.argv[2]).then(console.log).catch(console.error);
