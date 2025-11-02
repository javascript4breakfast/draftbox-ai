import { Button } from "@adobe/react-spectrum";
import { type GenItem } from "../../hooks/useImageGen";
import { type GeneratePayload } from "../../lib/api";
import ImageCard from "../ImageCard";

export default function ImageHistory({
    history,
    loading,
    submit,
    regenerate,
    setPrompt, 
    setStyle, 
    setPalette, 
    setFormat, 
    setCount, 
    setRefiningItem 
  }: { 
    history: GenItem[];
    loading: boolean;
    submit: (payload: GeneratePayload) => Promise<void>;
    regenerate: (item: GenItem, n?: number) => Promise<void>;
    setPrompt: (prompt: string) => void;
    setStyle: (style: string) => void;
    setPalette: (palette: string) => void;
    setFormat: (format: 'square' | 'landscape' | 'portrait' | 'widescreen') => void;
    setCount: (count: number) => void;
    setRefiningItem: (item: GenItem | null) => void;
  }) {
    return (
      <div style={{ marginTop:24, display:'grid', gap:16 }}>
        {history.map(item => (
          <div key={item.id} style={{ border:'1px solid #eee', borderRadius:12, padding:12 }}>
            <div style={{ display:'flex', gap:8, alignItems:'baseline', flexWrap:'wrap' }}>
              <strong style={{ fontSize:14 }}>Prompt:</strong>
              <span style={{ color:'#333' }}>{item.prompt}</span>
              <span style={{ color:'#777', marginLeft:'auto', fontSize:12 }}>
                {new Date(item.createdAt).toLocaleTimeString()}
              </span>
            </div>
  
            <div style={{ color:'#666', fontSize:12, marginTop:6 }}>
              {item.style && <span>Style: <b>{item.style}</b> • </span>}
              {item.palette && item.palette !== 'default' && <span>Palette: <b>{item.palette}</b> • </span>}
              {item.format && <span>Format: <b>{item.format}</b></span>}
            </div>
  
            {/* Variations grid using ImageCard */}
            <div style={{ borderRadius: 12, display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(200px, 1fr))', gap:12, marginTop:12 }}>
              {item.images.map((src, i) => (
                <ImageCard key={i} img={src} caption={`Variation ${i + 1}`} filename={`image-${item.id}-${i + 1}.png`} />
              ))}
            </div>
  
            {/* Actions: Regenerate / Refine / Make 4 variations */}
            <div style={{ display:'flex', gap:8, marginTop:12, flexWrap:'wrap' }}>
              <Button
                variant="accent"
                onPress={() => regenerate(item, item.images.length || 1)}
                isDisabled={loading}
              >
                Regenerate ({item.images.length || 1})
              </Button>
  
              <Button
                variant="accent"
                style="outline"
                onPress={() => {
                  // Pre-fill all form fields with the item's values for refinement
                  setPrompt(item.prompt);
                  setStyle(item.style || 'photorealistic');
                  setPalette(item.palette || 'default');
                  setFormat(item.format || 'square');
                  setCount(1); // Default to 1 for refinement
                  setRefiningItem(item); // Track which item we're refining
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                  // Focus the textarea so user can immediately start editing
                  setTimeout(() => {
                    const textarea = document.querySelector('textarea');
                    textarea?.focus();
                    textarea?.select();
                  }, 100);
                }}
                isDisabled={loading}
              >
                Refine
              </Button>
  
              <Button
                variant="secondary"
                style="outline"
                onPress={() => submit({
                  prompt: item.prompt,
                  style: item.style,
                  palette: item.palette,
                  format: item.format,
                  n: 4
                })}
                isDisabled={loading}
              >
                Make 4 variations
              </Button>
            </div>
          </div>
        ))}
      </div>
    );
  }