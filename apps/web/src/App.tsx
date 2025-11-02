import { useState } from 'react';
import { defaultTheme, Provider, Form, Item, ActionButton, NumberField, TextArea, Picker } from '@adobe/react-spectrum';
import { useImageGen, type GenItem } from './hooks/useImageGen';
import Spinner from './components/Spinner';
import ImageHistory from './components/ImageHistory';

import styles from './app.module.css';

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
  const [style, setStyle] = useState<string>('photorealistic');
  const [palette, setPalette] = useState<string>('default');
  const [format, setFormat] = useState<'square' | 'landscape' | 'portrait' | 'widescreen'>('square');
  const [count, setCount] = useState<number>(1);
  const [refiningItem, setRefiningItem] = useState<GenItem | null>(null);
  const { loading, error, history, submit, regenerate, refine } = useImageGen();
  
  const onSubmit = (e: React.FormEvent) => {
    if (!prompt.trim()) return;
    e.preventDefault();    
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
    <Provider theme={defaultTheme}>
       <div style={{ height: '100vh' }}>
        {loading && <Spinner size="medium" color="#3b82f6" text="Generating…" />}
        <h1>Draftbox AI</h1>

        {refiningItem && (
          <div style={{ 
            padding: '12px', 
            background: '#e3f2fd', 
            border: '1px solid #2196f3', 
            borderRadius: '8px', 
            marginBottom: '16px',
            fontSize: '14px'
          }}>
            <strong>Refining:</strong> You can edit the prompt, style, palette, format, and variations. Original values are pre-filled.
            <button 
              type="button"
              onClick={() => setRefiningItem(null)}
              style={{ 
                marginLeft: '12px', 
                padding: '4px 8px', 
                background: 'white', 
                border: '1px solid #ccc', 
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '12px'
              }}
            >
              Cancel
            </button>
          </div>
        )}

        <Form onSubmit={onSubmit}>
          <TextArea
            label="Describe an image or idea..."
            value={prompt}
            onChange={(value) => setPrompt(value)}
            isDisabled={loading}
          />
          <div className={styles.formControls}>
            <div>
              <Picker label="Style" selectedKey={style} onSelectionChange={(key) => setStyle(key as string)}>
                {STYLE_OPTIONS.map(s => <Item key={s}>{s}</Item>)}
              </Picker>
            </div>

            <div>
              <Picker label="Color palette" selectedKey={palette} onSelectionChange={(key) => setPalette(key as string)}>
                {PALETTE_OPTIONS.map(p => <Item key={p}>{p}</Item>)}
              </Picker>
            </div>

            <div>
              <Picker label="Format" selectedKey={format} onSelectionChange={(key) => setFormat(key as any)}>
                {FORMAT_OPTIONS.map(opt => <Item key={opt.value}>{opt.label}</Item>)}
              </Picker>
            </div>

            <div>
              <NumberField
                isDisabled={loading}
                minValue={1}
                maxValue={4}
                step={1}
                label="Variations"
                value={count}
                onChange={(value) => setCount(value)}
                />
            </div>   
            <div>
              <ActionButton
                type="submit"
                isDisabled={loading || !prompt.trim()}
              >
                {loading ? 'Generating…' : refiningItem ? 'Refine & Generate' : 'Generate'}
              </ActionButton>
            </div>
          </div>
        </Form>

        {error && <p>Error: {error}</p>}

        <ImageHistory
          history={history}
          loading={loading}
          submit={submit}
          regenerate={regenerate}
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