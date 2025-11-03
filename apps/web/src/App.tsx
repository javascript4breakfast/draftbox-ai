import { useState, useEffect, useRef } from 'react';
import { defaultTheme, Provider } from '@adobe/react-spectrum';
import { useImageGen, type GenItem } from './hooks/useImageGen';
import Spinner from './components/Spinner';
import ImageHistory from './components/ImageHistory';
import GenerateImagesForm from './components/GenerateImagesForm';
import { useTheme } from './context/ThemeContext';
import NavHeader from './components/NavHeader';
import ErrorBox from './components/ErrorBox';

export default function App() {
  const [prompt, setPrompt] = useState('');
  const [style, setStyle] = useState<string>('photorealistic');
  const [palette, setPalette] = useState<string>('default');
  const [format, setFormat] = useState<'square' | 'landscape' | 'portrait' | 'widescreen'>('square');
  const [count, setCount] = useState<number>(1);
  const [refiningItem, setRefiningItem] = useState<GenItem | null>(null);
  const { loading, error, history, submit, regenerate, refine, updateItemImages } = useImageGen();
  const { theme } = useTheme();
  const previousHistoryLength = useRef(history.length);
  const wasRefining = useRef(false);

  // Reset prompt textarea after successful generation (but not during refinement)
  useEffect(() => {
    // Check if generation just completed successfully and it wasn't a refinement
    if (!loading && !error && history.length > previousHistoryLength.current && !wasRefining.current) {
      setPrompt('');
    }
    // Update refs when history changes
    if (history.length !== previousHistoryLength.current) {
      previousHistoryLength.current = history.length;
      wasRefining.current = false; // Reset flag after history updates
    }
  }, [loading, error, history.length]);

  const onSubmit = (e: React.FormEvent) => {
    if (!prompt.trim()) return;
    e.preventDefault();
    
    // Track if this is a refinement operation
    wasRefining.current = !!refiningItem;
    
    if (refiningItem) {
      refine(refiningItem, {
        prompt,
        style,
        palette,
        format,
        n: count,
      });
      setRefiningItem(null); // Clear refining state
    } else {
      submit({ prompt, style, palette, format, n: count });
    }
  };

  return (
    <Provider theme={defaultTheme} colorScheme={theme}>
       <div className="appWrapper">
        <Spinner size="medium" color="#3b82f6" text="Generating…" loading={loading} />
        <NavHeader />
        <GenerateImagesForm
          prompt={prompt}
          setPrompt={setPrompt}
          style={style}
          setStyle={setStyle}
          palette={palette}
          setPalette={setPalette}
          format={format}
          setFormat={setFormat}
          count={count}
          setCount={setCount}
          loading={loading}
          refiningItem={refiningItem}
          setRefiningItem={setRefiningItem}
          onSubmit={onSubmit}
        />
        <ErrorBox error={error ?? ''} />
        <ImageHistory
          history={history}
          loading={loading}
          regenerate={regenerate}
          updateItemImages={updateItemImages}
          setPrompt={setPrompt}
          setStyle={setStyle}
          setPalette={setPalette}
          setFormat={setFormat}
          setCount={setCount}
          setRefiningItem={setRefiningItem}
          />
      </div>
    </Provider>
  );
}