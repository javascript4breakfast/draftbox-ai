export default function Spinner() {
    return (
      <div style={{ display:'inline-block', width:24, height:24, border:'3px solid #ccc', borderTopColor:'transparent', borderRadius:'50%', animation:'spin 0.8s linear infinite' }} />
    );
  }