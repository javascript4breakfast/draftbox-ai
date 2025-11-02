import { useState } from 'react';
import { useImageGen } from './hooks/useImageGen';
import Spinner from './components/Spinner';
import ImageCard from './components/ImageCard';

const STYLE_OPTIONS = [
  'photorealistic', 'anime', 'watercolor', 'low-poly', 'isometric', 'pixel art', '3D render', 'oil painting'
];

const PALETTE_OPTIONS = [
  'default', 'pastel', 'neon', 'monochrome', 'earth tones', 'duotone', 'vibrant'
];

const FORMAT_OPTIONS = [
  { label: 'Square (1:1)', value: 'square' as const },
  { label: 'Landscape (4:3)', value: 'landscape' as const },
  { label: 'Portrait (3:4)', value: 'portrait' as const },
  { label: 'Widescreen (16:9)', value: 'widescreen' as const },
];

export default function App() {
  const [prompt, setPrompt] = useState('');
  const { img, loading, error, submit } = useImageGen();
  const [style, setStyle] = useState<string>('photorealistic');
  const [palette, setPalette] = useState<string>('default');
  const [format, setFormat] = useState<'square' | 'landscape' | 'portrait' | 'widescreen'>('square');

  const onSubmit = (e: React.FormEvent) => {
    if (!prompt.trim()) return;
    e.preventDefault();
    submit(prompt);
  };

  return (
    <div>
      {loading && <Spinner size="medium" color="#3b82f6" text="Generating…" />}
      <h1>Draftbox AI</h1>
      <p>Describe an image and I’ll ask the server to generate it.</p>

      <form onSubmit={onSubmit}>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          rows={4}
          placeholder="Describe the image you want…"
        />
        <div>
          <label>
            <span style={{ fontSize: 12, color:'#666' }}>Style</span>
            <select value={style} onChange={(e) => setStyle(e.target.value)}>
              {STYLE_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </label>

          <label>
            <span>Color palette</span>
            <select value={palette} onChange={(e) => setPalette(e.target.value)}>
              {PALETTE_OPTIONS.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </label>

          <label>
            <span>Format</span>
            <select value={format} onChange={(e) => setFormat(e.target.value as any)}>
              {FORMAT_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
            </select>
          </label>
        </div>
        <div>
          <button
            type="submit"
            disabled={loading || !prompt.trim()}
          >
            {loading ? 'Generating…' : 'Generate'}
          </button>
        </div>
      </form>

      {error && <p>Error: {error}</p>}
      <ImageCard img={img} />
    </div>
  );
}