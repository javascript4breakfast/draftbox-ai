import 'dotenv/config';
import { Hono } from 'hono';
import { serve } from '@hono/node-server';
import { cors } from 'hono/cors';
import { handleGenerate } from './routes/generate.js';

const PORT = Number(process.env.PORT || 3001);
const MOCK = process.env.MOCK === '1';
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';

if (!MOCK && !GEMINI_API_KEY) {
  throw new Error('Missing GEMINI_API_KEY. Create apps/server/.env and set it (or set MOCK=1).');
}

const app = new Hono();

app.use('*', cors());

app.get('/health', (c) => c.text('ok'));

app.get('/', (c) => c.text('Hello from Hono 👋'));

app.post('/api/generate', handleGenerate);

serve({ fetch: app.fetch, port: PORT }, ({ port }) => {
  console.log(`✅ Server listening on http://localhost:${port}`);
});