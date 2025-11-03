import { Well } from "@adobe/react-spectrum";
import styles from './image-card.module.css';

type Props = {
    img: string | null;
    caption?: string;
    filename?: string;
  };
  
export default function ImageCard({ img, caption, filename = "generated.png" }: Props) {
    if (!img) return null;
    return (
        <Well className={styles.card}>
            <img
                src={img}
                alt={caption || "Generated"}
                className={styles.image}
            />
            {caption && (
                <figcaption className={styles.caption}>
                {caption}
                </figcaption>
            )}
            <a href={img} download={filename} className={styles.downloadLink}>
                Download
            </a>
        </Well>
    );
}