import express from 'express';
import fs from 'fs';
import { StatusCodes } from 'http-status-codes';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const router = express.Router();

function readIndexFile() {
  const filePath = path.join(__dirname, '../../../viteclient/dist/client', 'index.html');
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
      const { render } = await import('../../../viteclient/dist/server/entry-server.js');
      const helmetContext = {};
      const staticContext = {};
      const app = render(req, res, helmetContext, staticContext);
      if (app) {
        const { helmet } = helmetContext;
        res.send(
          HTML.replace(/<title\b[^>]*>(.*?)<\/title>/i, helmet.title.toString())
            .replace('window.STATIC_CONTEXT={}', `window.STATIC_CONTEXT=${JSON.stringify(staticContext.context)}`)
            .replace('<div id="root"></div>', `<div id="root">${app}</div>`)
        );
      }
    } catch (error) {
      console.log(error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
    }
  } else {
    next();
  }
});

export default router;
