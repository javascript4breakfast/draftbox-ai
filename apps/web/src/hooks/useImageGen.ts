import { useState } from 'react';
import { generateImage } from '../lib/api';

export function useImageGen() {
  const [img, setImg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (prompt: string) => {
    setLoading(true);
    setError(null);
    setImg(null);
    try {
      const { dataUrl, error } = await generateImage(prompt);
      if (error) throw new Error(error);
      setImg(dataUrl ?? null);
    } catch (e: any) {
      setError(e?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return { img, loading, error, submit };
}