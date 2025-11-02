import 'dotenv/config';
import { Hono } from 'hono';
import { serve } from '@hono/node-server';
import { cors } from 'hono/cors';
import { GoogleGenAI } from '@google/genai';

// --- env (inline, simple) ---------------------------------------------------
const PORT = Number(process.env.PORT || 3001);
const MOCK = process.env.MOCK === '1';
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';

if (!MOCK && !GEMINI_API_KEY) {
  // fail fast with a clear message
  throw new Error('Missing GEMINI_API_KEY. Create apps/server/.env and set it (or set MOCK=1).');
}

// --- app ---------------------------------------------------------------------
const app = new Hono();

// CORS: wide-open for dev; tighten to your web origin in prod
app.use('*', cors());

// health
app.get('/health', (c) => c.text('ok'));

// hello
app.get('/', (c) => c.text('Hello from Hono 👋'));

// image generation
app.post('/api/generate', async (c) => {
  const body = await c.req.json<{ prompt?: string }>().catch(() => ({ prompt: undefined }));
  const prompt = (body?.prompt || '').trim();

  if (!prompt) return c.json({ error: 'Missing prompt' }, 400);

  // Mock mode: return a placeholder SVG so reviewers can run without a key
  if (MOCK) {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024">
      <rect width="100%" height="100%" fill="#eee"/>
      <text x="50%" y="50%" font-size="28" text-anchor="middle" dominant-baseline="middle">
        MOCK IMAGE: ${prompt.slice(0, 80)}
      </text></svg>`;
    const base64 = Buffer.from(svg, 'utf8').toString('base64');
    return c.json({ dataUrl: `data:image/svg+xml;base64,${base64}` });
  }

  try {
    const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

    // “Nano Banana” model id:
    //   gemini-2.5-flash-image  (image generation)
    const res = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: prompt,
      // Optional:
      // config: { response_modalities: ['Image'], image_config: { aspect_ratio: '1:1' } }
    });

    // extract first image part
    const parts = res?.candidates?.[0]?.content?.parts ?? [];
    const imagePart = parts.find((p: any) => p?.inlineData?.data);

    if (!imagePart) return c.json({ error: 'Model returned no image' }, 502);

    const base64 = imagePart.inlineData.data as string;
    const mime = imagePart.inlineData.mimeType || 'image/png';

    return c.json({ dataUrl: `data:${mime};base64,${base64}` });
  } catch (err) {
    console.error(err);
    return c.json({ error: 'Generation failed' }, 500);
  }
});

// start
serve({ fetch: app.fetch, port: PORT }, ({ port }) => {
  console.log(`✅ Server listening on http://localhost:${port}`);
});