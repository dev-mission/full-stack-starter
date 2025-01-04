import accepts from 'accepts';
import fastifyStatic from '@fastify/static';
import fs from 'fs';
import { StatusCodes } from 'http-status-codes';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function readIndexFile () {
  const filePath = path.join(__dirname, '../../client/dist/client', 'index.html');
  if (fs.existsSync(filePath)) {
    return fs.readFileSync(filePath, { encoding: 'utf8' });
  }
  return '';
}
const HTML = readIndexFile();

export default async function (fastify, opts) {
  fastify.register(fastifyStatic, {
    root: path.resolve(__dirname, '../../client/dist/client/assets'),
    prefix: '/assets/',
    index: false,
  });

  fastify.get('/*', async function (request, reply) {
    const accept = accepts(request.raw);
    if (accept.types(['html'])) {
      try {
        const { render } = await import('../../client/dist/server/entry-server.js');
        const helmetContext = {};
        const staticContext = { context: { env: {} } };
        Object.keys(process.env).forEach((key) => {
          if (key.startsWith('VITE_')) {
            staticContext.context.env[key] = process.env[key];
          }
        });
        const app = render(request, reply, helmetContext, staticContext);
        if (app) {
          const { helmet } = helmetContext;
          reply.header('Content-Type', 'text/html');
          reply.send(
            HTML.replace(/<title\b[^>]*>(.*?)<\/title>/i, helmet.title.toString())
              .replace('window.STATIC_CONTEXT = {}', `window.STATIC_CONTEXT=${JSON.stringify(staticContext.context)}`)
              .replace('<div id="root"></div>', `<div id="root">${app}</div>`)
          );
        }
      } catch (error) {
        console.error(error);
        reply.code(StatusCodes.INTERNAL_SERVER_ERROR).send();
      }
    } else {
      reply.code(StatusCodes.NOT_ACCEPTABLE).send();
    }
  });
}
