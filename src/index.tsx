import { serve } from 'bun';
import index from './index.html';
import { migrate } from './db/db';
import { api } from './api';

await migrate();

const server = serve({
  routes: {
    ...api,
    '/*': index,
  },
  development: process.env.NODE_ENV !== 'production' && {
    hmr: true,
    console: true,
  },
});

console.log(`Server running at ${server.url}`);
