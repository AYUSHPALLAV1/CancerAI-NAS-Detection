import './Explanation.css';

const steps = [
  {
    num: '01',
    title: 'Architecture Search',
    body: 'NAS automatically explores 15 CNN configurations — varying conv blocks, kernel sizes, filter multipliers, batch norm and dropout — selecting the best by validation accuracy.',
    pos: 'top-left',
  },
  {
    num: '02',
    title: 'Automated Training',
    body: 'Each candidate is trained end-to-end on LC25000 histopathology images. ReduceLROnPlateau adapts the learning rate; the top config is promoted to full 30-epoch training.',
    pos: 'top-right',
  },
  {
    num: '03',
    title: 'Superior Accuracy',
    body: 'The NAS model hits 99.04 % validation accuracy — a +12.9 % lift over manually designed baselines — with a 3.4 % generalisation gap confirming robustness.',
    pos: 'bottom-left',
  },
  {
    num: '04',
    title: 'Grad-CAM Explainability',
    body: 'Every prediction comes with a Grad-CAM heatmap highlighting the tissue regions that drove the decision, generated via hook-free autograd.grad for fast CPU inference.',
    pos: 'bottom-right',
  },
];

const techRows = [
  ['Dataset',    'LC25000 — 25,000 histopathology images, 5 classes'],
  ['Classes',    'Lung Benign · Lung ACA · Lung SCC · Colon Benign · Colon ACA'],
  ['Image size', '128 × 128 px · RGB · normalised'],
  ['Framework',  'PyTorch 2.0 · Custom NAS · Flask REST API'],
  ['XAI method', 'Grad-CAM via torch.autograd.grad (no backward hooks)'],
  ['Accuracy',   '99.04 % validation · 0.056 validation loss'],
];

const Explanation = () => (
  <section className="explanation" id="how-it-works">
    <div className="container">

      {/* ── Section eyebrow ── */}
      <div className="section-eyebrow">
        <span className="badge">How it works</span>
        <div className="eyebrow-line" />
      </div>

      <h2 className="section-heading">THE PIPELINE</h2>

      {/* ── Cardinal layout: 4 cards around central video ── */}
      <div className="pipeline-grid">

        {/* Top-left */}
        <div className="step-card glass-card step-tl">
          <span className="step-num">01</span>
          <h3 className="step-title">Architecture Search</h3>
          <p className="step-body">{steps[0].body}</p>
        </div>

        {/* Top-right */}
        <div className="step-card glass-card step-tr">
          <span className="step-num">02</span>
          <h3 className="step-title">Automated Training</h3>
          <p className="step-body">{steps[1].body}</p>
        </div>

        {/* Central video — spans both rows */}
        <div className="pipeline-video-wrap">
          <video
            className="pipeline-video"
            src="/heart-bg.mp4"
            autoPlay
            loop
            muted
            playsInline
          />
          <div className="pipeline-video-label">AI · NAS · XAI</div>
        </div>

        {/* Bottom-left */}
        <div className="step-card glass-card step-bl">
          <span className="step-num">03</span>
          <h3 className="step-title">Superior Accuracy</h3>
          <p className="step-body">{steps[2].body}</p>
        </div>

        {/* Bottom-right */}
        <div className="step-card glass-card step-br">
          <span className="step-num">04</span>
          <h3 className="step-title">Grad-CAM Explainability</h3>
          <p className="step-body">{steps[3].body}</p>
        </div>

      </div>

      {/* ── Technical specs table ── */}
      <div className="tech-block glass-card">
        <h3 className="tech-heading">Technical Specs</h3>
        <div className="tech-table">
          {techRows.map(([key, val]) => (
            <div key={key} className="tech-row">
              <span className="tech-key">{key}</span>
              <span className="tech-val">{val}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  </section>
);

export default Explanation;