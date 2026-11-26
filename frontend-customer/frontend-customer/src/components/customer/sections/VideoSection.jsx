export default function VideoSection() {
  return (
  <section className="no-top no-bottom section-dark">
    <div className="relative overflow-hidden" style={{ aspectRatio: "21/9" }}>
      <video className="w-100 h-100" autoPlay muted loop playsInline style={{ objectFit: "cover" }}>
        <source src="/images/video-halong.mp4" type="video/mp4" />
      </video>
      <div className="absolute w-100 h-100 top-0 bg-dark hover-op-05"></div>
    </div>
  </section>
  );
}
