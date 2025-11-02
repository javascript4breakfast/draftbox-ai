type Props = { img: string | null };

export default function ImageCard({ img }: Props) {
  if (!img) return null;
  return (
    <div>
      <img src={img} alt="Generated" style={{ maxWidth: '100%', borderRadius: 8, display: 'block' }} />
      <a href={img} download="generated.png" style={{ display: 'inline-block', marginTop: 8 }}>
        Download
      </a>
    </div>
  );
}