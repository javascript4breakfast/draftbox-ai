export type GeneratePayload = {
    prompt: string;
    style?: string;
    palette?: string;
    format?: 'square' | 'landscape' | 'portrait' | 'widescreen';
    n?: number;
  };
  export type GenerateResponse = { dataUrls?: string[]; dataUrl?: string; error?: string };
  
  export async function generateImage(payload: GeneratePayload): Promise<GenerateResponse> {
    console.log('[api] Sending payload:', { ...payload, prompt: payload.prompt?.slice(0, 50) + '...' });
    const res = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = (await res.json().catch(() => ({}))) as GenerateResponse;
  
    if (!res.ok) return { error: data?.error || `Request failed (${res.status})` };
  
    console.log('[api] Received response:', { count: data.dataUrls?.length || 0, hasError: !!data.error });
  
    // Normalize: always prefer array
    if (!data.dataUrls && data.dataUrl) data.dataUrls = [data.dataUrl];
    return data;
  }