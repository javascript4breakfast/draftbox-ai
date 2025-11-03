import type { Context } from 'hono';
import { GoogleGenAI } from '@google/genai';

export type GenBody = {
  prompt?: string;
  style?: string;
  palette?: string;
  format?: 'square' | 'landscape' | 'portrait' | 'widescreen';
  n?: number;
};

const FORMAT_TO_RATIO: Record<string, string> = {
  square: '1:1',
  landscape: '4:3',
  portrait: '3:4',
  widescreen: '16:9'
};

export async function handleGenerate(c: Context) {
  const body = await c.req.json<GenBody>().catch(() => ({} as GenBody));
  const basePrompt = (body?.prompt || '').trim();
  if (!basePrompt) return c.json({ error: 'Missing prompt' }, 400);

  const style = (body?.style || '').trim();
  const palette = (body?.palette || '').trim();
  const format = (body?.format || 'square');
  const n = Math.max(1, Math.min(4, Number(body?.n ?? 1)));
  console.log(`[server] Received request: n=${body?.n}, parsed n=${n}`);

  const finalPrompt = [
    basePrompt,
    style ? `Style: ${style}.` : '',
    palette && palette !== 'default' ? `Color palette: ${palette}.` : '',
  ].filter(Boolean).join(' ');

  // Get environment variables from context or env
  const MOCK = process.env.MOCK === '1';
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';

  // ---- MOCK path: guaranteed array of data URLs ----
  if (MOCK) {
    const items = Array.from({ length: n }).map((_, i) => {
      const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024">
        <rect width="100%" height="100%" fill="#eee"/>
        <text x="50%" y="50%" font-size="24" text-anchor="middle" dominant-baseline="middle">
          MOCK ${i + 1}/${n}: ${finalPrompt.slice(0, 80)} • ${FORMAT_TO_RATIO[format] || '1:1'}
        </text></svg>`;
      const b64 = Buffer.from(svg, 'utf8').toString('base64');
      return `data:image/svg+xml;base64,${b64}`;
    });
    return c.json({ dataUrls: items });
  }

  // ---- Real call ----
  try {
    const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

    const results: string[] = [];
    console.log(`[server] Starting generation loop: n=${n}`);
    for (let i = 0; i < n; i++) {
      console.log(`[server] Generating image ${i + 1}/${n}`);
      const res = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: finalPrompt,
        config: {
          responseModalities: ['Image'],
          imageConfig: { aspectRatio: FORMAT_TO_RATIO[format] ?? '1:1' },
        },
      });

      const parts = res?.candidates?.[0]?.content?.parts ?? [];
      const imagePart = parts.find((p: any) => p?.inlineData?.data);
      if (!imagePart) {
        console.log(`[server] Warning: No image part found for iteration ${i + 1}`);
        continue;
      }

      const base64 = imagePart.inlineData.data as string;
      const mime = imagePart.inlineData.mimeType || 'image/png';
      results.push(`data:${mime};base64,${base64}`);
      console.log(`[server] Successfully added image ${i + 1}, total results: ${results.length}`);
    }

    console.log(`[server] Generation complete: ${results.length} images generated (requested ${n})`);
    if (!results.length) return c.json({ error: 'Model returned no image' }, 502);
    return c.json({ dataUrls: results });
  } catch (err) {
    console.error('[generate] error:', err);
    return c.json({ error: 'Generation failed' }, 500);
  }
}

