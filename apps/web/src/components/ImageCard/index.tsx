import { Well } from "@adobe/react-spectrum";
type Props = {
    img: string | null;
    caption?: string;
    filename?: string;
  };
  
export default function ImageCard({ img, caption, filename = "generated.png" }: Props) {
    if (!img) return null;
    return (
        <Well>
            <img
                src={img}
                alt={caption || "Generated"}
                style={{ width: "100%", borderRadius: 8 }}
            />
            {caption && (
                <figcaption style={{ fontSize: 12, color: "#666", marginTop: 4 }}>
                {caption}
                </figcaption>
            )}
            <a href={img} download={filename}>
                Download
            </a>
        </Well>
    );
}