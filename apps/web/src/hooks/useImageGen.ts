import { useState } from 'react';
import { generateImage, type GeneratePayload } from '../lib/api';

export type GenItem = {
  id: string;
  prompt: string;
  style?: string;
  palette?: string;
  format?: 'square' | 'landscape' | 'portrait' | 'widescreen';
  images: string[];        // variations returned from one request
  createdAt: number;
};

function uid() {
  return Math.random().toString(36).slice(2, 10);
}

/**
 * Manages image generation calls, loading/error state, and a history
 * of generations (each entry may contain multiple variations).
 *
 * Server is expected to return: { dataUrls?: string[], error?: string }
 * and supports payload: { prompt, style?, palette?, format?, n? } with n ∈ [1..4].
 */
export function useImageGen() {
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState<string | null>(null);
  const [history, setHistory] = useState<GenItem[]>([]);

  const submit = async (payload: GeneratePayload) => {
    setLoading(true);
    setError(null);
    try {
      const { dataUrls, error } = await generateImage(payload);
      if (error) throw new Error(error);

      const images = dataUrls ?? [];
      const item: GenItem = {
        id: uid(),
        prompt: payload.prompt,
        style: payload.style,
        palette: payload.palette,
        format: payload.format,
        images,
        createdAt: Date.now()
      };

      console.log('generateImage() ~>', { count: (dataUrls ?? []).length, first: dataUrls?.[0]?.slice?.(0, 32) });
      setHistory((h) => [item, ...h]);

    } catch (e: any) {
      setError(e?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  /** Re-run the exact same prompt/options from a previous item. */
  const regenerate = async (item: GenItem, n: number = Math.max(1, item.images.length || 1)) => {
    return submit({
      prompt: item.prompt,
      style: item.style,
      palette: item.palette,
      format: item.format,
      n: Math.min(4, Math.max(1, n)), // clamp to [1..4]
    });
  };

  /** Run with edited options, using provided values or falling back to item's original values. */
  const refine = async (
    item: GenItem,
    options: {
      prompt?: string;
      style?: string;
      palette?: string;
      format?: 'square' | 'landscape' | 'portrait' | 'widescreen';
      n?: number;
    }
  ) => {
    return submit({
      prompt: options.prompt ?? item.prompt,
      style: options.style ?? item.style,
      palette: options.palette ?? item.palette,
      format: options.format ?? item.format,
      n: Math.min(4, Math.max(1, options.n ?? 1)),
    });
  };

  /** Update an existing item's images with new variations, keeping the same item ID. */
  const updateItemImages = async (itemId: string, n: number = 4) => {
    const item = history.find(i => i.id === itemId);
    if (!item) return;

    setLoading(true);
    setError(null);
    try {
      const payload: GeneratePayload = {
        prompt: item.prompt,
        style: item.style,
        palette: item.palette,
        format: item.format,
        n: Math.min(4, Math.max(1, n)),
      };

      const { dataUrls, error } = await generateImage(payload);
      if (error) throw new Error(error);

      const images = dataUrls ?? [];
      setHistory((h) =>
        h.map((i) => (i.id === itemId ? { ...i, images } : i))
      );
    } catch (e: any) {
      setError(e?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, history, submit, regenerate, refine, updateItemImages };
}