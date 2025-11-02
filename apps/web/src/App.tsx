import { useState } from 'react';
import { useImageGen } from './hooks/useImageGen';
import Spinner from './components/Spinner';
import ImageCard from './components/ImageCard';

export default function App() {
  const [prompt, setPrompt] = useState('');
  const { img, loading, error, submit } = useImageGen();

  const onSubmit = (e: React.FormEvent) => {
    if (!prompt.trim()) return;
    e.preventDefault();
    submit(prompt);
  };

  return (
    <div>
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
          <button
            type="submit"
            disabled={loading || !prompt.trim()}
          >
            {loading ? 'Generating…' : 'Generate'}
          </button>

          {loading && <Spinner />}
        </div>
      </form>

      {error && <p>Error: {error}</p>}
      <ImageCard img={img} />
    </div>
  );
}