import './ModelDetails.css';

const archParams = [
  { label: 'Conv Blocks',   value: '4' },
  { label: 'Filter Mult.', value: '4×' },
  { label: 'Kernel Sizes', value: '[3, 3, 5, 3]' },
  { label: 'Batch Norm',   value: 'Disabled' },
  { label: 'Conv Dropout', value: '0.1' },
  { label: 'Dense Units',  value: '[256, 128]' },
  { label: 'Dense Dropout',value: '0.5' },
  { label: 'Learning Rate',value: '0.0001' },
  { label: 'Optimizer',    value: 'Adam + WD' },
  { label: 'Loss',         value: 'Cross Entropy' },
  { label: 'Batch Size',   value: '32' },
];

const metrics = [
  { value: '99.04%', label: 'Val. Accuracy' },
  { value: '0.056',  label: 'Val. Loss' },
  { value: '3.4%',   label: 'Gen. Gap' },
  { value: '+12.9%', label: 'vs. Baseline' },
];

const phases = [
  {
    phase: 'Phase 01',
    title: 'NAS Search',
    items: ['15 architectures', '15 epochs each', 'Ranked by accuracy', 'Best promoted'],
  },
  {
    phase: 'Phase 02',
    title: 'Full Training',
    items: ['30 epochs', 'ReduceLROnPlateau', 'Checkpointing', '99.04% final'],
  },
];

const ModelDetails = () => (
  <section className="model-details">

    {/* ── Full-section looping background video ── */}
    <video
      className="md-bg-video"
      src="/astronaut-bg.mp4"
      autoPlay
      loop
      muted
      playsInline
    />
    {/* Gradient overlays so cards are readable against the video */}
    <div className="md-bg-overlay" />

    <div className="container md-layout">

      {/* ══ LEFT COLUMN — Arch params + Phase cards ══ */}
      <div className="md-col md-col-left">

        {/* Eyebrow */}
        <div className="section-eyebrow" style={{ marginBottom: '12px' }}>
          <span className="badge">Architecture</span>
          <div className="eyebrow-line" />
        </div>
        <h2 className="section-heading" style={{ marginBottom: '24px' }}>THE MODEL</h2>

        {/* Arch params card */}
        <div className="glass-card arch-card">
          <h3 className="card-label">NAS-Optimised Config</h3>
          <div className="arch-params">
            {archParams.map(({ label, value }) => (
              <div key={label} className="arch-row">
                <span className="arch-key">{label}</span>
                <span className="arch-val">{value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Phase cards */}
        <div className="phases-row">
          {phases.map(({ phase, title, items }) => (
            <div key={phase} className="phase-card glass-card">
              <span className="phase-tag badge">{phase}</span>
              <h4 className="phase-title">{title}</h4>
              <ul className="phase-list">
                {items.map(it => <li key={it}>{it}</li>)}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* ══ CENTRE — intentionally empty: astronaut lives here ══ */}
      <div className="md-col-center" aria-hidden="true" />

      {/* ══ RIGHT COLUMN — 4 metric cards ══ */}
      <div className="md-col md-col-right">
        <div className="metrics-grid">
          {metrics.map(({ value, label }) => (
            <div key={label} className="metric-card glass-card">
              <span className="mc-val">{value}</span>
              <span className="mc-lbl">{label}</span>
            </div>
          ))}
        </div>

        {/* Flavour text */}
        <div className="glass-card md-note-card">
          <p className="md-note">
            NAS automatically explored 15 CNN configurations across conv
            blocks, kernel sizes, filter multipliers, batch norm and dropout
            — selecting the best by validation accuracy. The winning config
            was promoted to 30-epoch full training, achieving
            99.04&thinsp;% accuracy with a 3.4&thinsp;% generalisation gap.
          </p>
        </div>
      </div>

    </div>
  </section>
);

export default ModelDetails;