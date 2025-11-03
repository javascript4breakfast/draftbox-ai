import { Button } from "@adobe/react-spectrum";
import { type GenItem } from "../../hooks/useImageGen";
import ImageCard from "../ImageCard";
import styles from './image-history.module.css';

export default function ImageHistory({
    history,
    loading,
    regenerate,
    updateItemImages,
    setPrompt, 
    setStyle, 
    setPalette, 
    setFormat, 
    setCount, 
    setRefiningItem 
  }: { 
    history: GenItem[];
    loading: boolean;
    regenerate: (item: GenItem, n?: number) => Promise<void>;
    updateItemImages: (itemId: string, n?: number) => Promise<void>;
    setPrompt: (prompt: string) => void;
    setStyle: (style: string) => void;
    setPalette: (palette: string) => void;
    setFormat: (format: 'square' | 'landscape' | 'portrait' | 'widescreen') => void;
    setCount: (count: number) => void;
    setRefiningItem: (item: GenItem | null) => void;
  }) {
    return (
      <div className={styles.historyContainer}>
        {history.map(item => (
          <div key={item.id} className={styles.historyItem}>
            <div className={styles.header}>
              <span className={styles.prompt}>Prompt:</span>
              <span className={styles.promptText}>{item.prompt}</span>
              <span className={styles.timestamp}>
                {new Date(item.createdAt).toLocaleTimeString()}
              </span>
            </div>
  
            <div className={styles.metadata}>
              {item.style && <span>Style: <b>{item.style}</b> • </span>}
              {item.palette && item.palette !== 'default' && <span>Palette: <b>{item.palette}</b> • </span>}
              {item.format && <span>Format: <b>{item.format}</b></span>}
            </div>
  
            {/* Variations grid using ImageCard */}
            <div className={styles.imagesGrid}>
              {item.images.map((src, i) => (
                <ImageCard key={i} img={src} caption={`Variation ${i + 1}`} filename={`image-${item.id}-${i + 1}.png`} />
              ))}
            </div>
  
            {/* Actions: Regenerate / Refine / Make 4 variations */}
            <div className={styles.actions}>
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
                onPress={() => updateItemImages(item.id, 4)}
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