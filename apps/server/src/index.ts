import { Hono } from 'hono';
import { serve } from '@hono/node-server';

const app = new Hono();

app.get('/', (c) => {
  return c.text('Hello from Draftbox AI');
});

serve({
  fetch: app.fetch,
  port: 3001,
});

console.log('✅ Hono server running at http://localhost:3001');