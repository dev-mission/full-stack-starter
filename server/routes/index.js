import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

import apiRoutes from './api/index.js';
import clientRoutes from './client/index.js';

const router = express.Router();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// configure serving up a built client app assets
router.use(express.static(path.join(__dirname, '../../client/dist/client'), { index: false }));

// configure serving any static file in public folder
router.use(express.static(path.join(__dirname, '../public')));

// serve some paths from other nested routers
router.use('/api', apiRoutes);

// serve up the client app for all other routes, per SPA client-side routing
router.get('/*', clientRoutes);

export default router;
