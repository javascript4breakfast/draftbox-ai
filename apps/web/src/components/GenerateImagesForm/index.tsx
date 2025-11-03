import { Form, Item, ActionButton, NumberField, TextArea, Picker } from '@adobe/react-spectrum';
import { type GenItem } from '../../hooks/useImageGen';
import { STYLE_OPTIONS, PALETTE_OPTIONS, FORMAT_OPTIONS } from '../../constants/imageOptions';
import styles from './generate-images-form.module.css';

export default function GenerateImagesForm({
    onSubmit,
    refiningItem,
    setRefiningItem,
    prompt,
    setPrompt,
    style,
    setStyle,
    palette,
    setPalette,
    format,
    setFormat,
    count,
    setCount,
    loading,
  }: {
    onSubmit: (e: React.FormEvent) => void;
    refiningItem: GenItem | null;
    setRefiningItem: (item: GenItem | null) => void;
    prompt: string;
    setPrompt: (prompt: string) => void;
    style: string;
    setStyle: (style: string) => void;
    palette: string;
    setPalette: (palette: string) => void;
    format: 'square' | 'landscape' | 'portrait' | 'widescreen';
    setFormat: (format: 'square' | 'landscape' | 'portrait' | 'widescreen') => void;
    count: number;
    setCount: (count: number) => void;
    loading: boolean;
  }) {
  
    return (
        <div className={styles.formContainer}>
            {refiningItem && (
                <div className={styles.refiningItem}>
                    <div>
                        <strong>Refining:</strong> You can edit the prompt, style, palette, format, and variations. Original values are pre-filled.
                    </div>
                    <div>
                        <ActionButton onPress={() => setRefiningItem(null)}>
                            Cancel
                        </ActionButton>
                    </div>
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
        </div>
    );
  }