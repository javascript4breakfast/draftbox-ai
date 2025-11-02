export type GeneratePayload = { prompt: string };
export type GenerateResponse = { dataUrl?: string; error?: string };

export async function generateImage(prompt: string): Promise<GenerateResponse> {
  const res = await fetch('/api/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt } as GeneratePayload),
  });

  // Try to parse JSON even on non-200 to show server error text
  const data = (await res.json().catch(() => ({}))) as GenerateResponse;

  if (!res.ok) {
    return { error: data?.error || `Request failed (${res.status})` };
  }
  return data;
}