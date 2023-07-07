import express from 'express';
import fs from 'fs';
import { StatusCodes } from 'http-status-codes';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const router = express.Router();

function readIndexFile() {
  const filePath = path.join(__dirname, '../../../client/dist/client', 'index.html');
  if (fs.existsSync(filePath)) {
    return fs.readFileSync(filePath, { encoding: 'utf8' });
  }
  return '';
}
const HTML = readIndexFile();

// serve up the client app for all other routes, per SPA client-side routing
router.get('/*', async (req, res, next) => {
  if (req.accepts('html')) {
    try {
      const { render } = await import('../../../client/dist/server/entry-server.js');
      const helmetContext = {};
      const staticContext = { context: { env: {} } };
      Object.keys(process.env).forEach((key) => {
        if (key.startsWith('VITE_')) {
          staticContext.context.env[key] = process.env[key];
        }
      });
      const app = render(req, res, helmetContext, staticContext);
      if (app) {
        const { helmet } = helmetContext;
        res.send(
          HTML.replace(/<title\b[^>]*>(.*?)<\/title>/i, helmet.title.toString())
            .replace('window.STATIC_CONTEXT = {}', `window.STATIC_CONTEXT=${JSON.stringify(staticContext.context)}`)
            .replace('<div id="root"></div>', `<div id="root">${app}</div>`)
        );
      }
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
    }
  } else {
    next();
  }
});

export default router;
