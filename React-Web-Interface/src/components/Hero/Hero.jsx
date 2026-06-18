import './Hero.css';

const Hero = () => (
  <section className="hero">

    {/* ── Video background (right-biased, looping) ── */}
    <video
      className="hero-video"
      src="/hero-bg.mp4"
      autoPlay
      loop
      muted
      playsInline
    />

    {/* ── Gradient overlay so text stays readable ── */}
    <div className="hero-overlay" />

    {/* ── Dashed circle decoration ── */}
    <div className="hero-circle-deco" aria-hidden="true" />

    {/* ── Content — left side ── */}
    <div className="container hero-layout">
      <div className="hero-left">

        <span className="badge hero-badge">↳ Medical · AutoML · NAS</span>

        <h1 className="hero-headline">
          BUILT TO<br />
          <span className="hero-headline-em">DETECT</span><br />
          CANCER.
        </h1>

        <p className="hero-sub">
          NAS-optimised CNN trained on 25,000 histopathology images —
          5 cancer types, 99.04 % accuracy, Grad-CAM explainability.
        </p>

        <a href="#how-it-works" className="btn-dark" style={{ marginTop: '28px' }}>
          How it works <span className="arrow">↗</span>
        </a>

      </div>
    </div>

  </section>
);

export default Hero;