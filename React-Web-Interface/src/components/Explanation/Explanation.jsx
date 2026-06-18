import './Explanation.css';

const steps = [
  {
    num: '01',
    title: 'Architecture Search',
    body: 'NAS automatically explores 15 CNN configurations — varying conv blocks, kernel sizes, filter multipliers, batch norm, and dropout — selecting the best by validation accuracy.',
  },
  {
    num: '02',
    title: 'Automated Training',
    body: 'Each candidate is trained end-to-end on LC25000 histopathology images. ReduceLROnPlateau adapts the learning rate; the top configuration is promoted to full 30-epoch training.',
  },
  {
    num: '03',
    title: 'Superior Accuracy',
    body: 'The NAS model hits 99.04 % validation accuracy — a +12.9 % lift over manually designed baselines — with a 3.4 % generalisation gap confirming robustness.',
  },
  {
    num: '04',
    title: 'Grad-CAM Explainability',
    body: 'Every prediction comes with a heatmap highlighting the tissue regions that drove the decision, generated via a hook-free autograd.grad implementation for fast CPU inference.',
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

      {/* ── Section label ── */}
      <div className="section-eyebrow">
        <span className="badge">How it works</span>
        <div className="eyebrow-line" />
      </div>

      {/* ── Big heading ── */}
      <h2 className="section-heading">THE PIPELINE</h2>

      {/* ── Step cards ── */}
      <div className="steps-grid">
        {steps.map(({ num, title, body }) => (
          <div key={num} className="step-card glass-card">
            <span className="step-num">{num}</span>
            <h3 className="step-title">{title}</h3>
            <p className="step-body">{body}</p>
          </div>
        ))}
      </div>

      {/* ── Technical details table ── */}
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