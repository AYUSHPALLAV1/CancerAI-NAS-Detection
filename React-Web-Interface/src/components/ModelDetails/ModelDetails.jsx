import './ModelDetails.css';

const archParams = [
  { label: 'Conv Blocks',     value: '4' },
  { label: 'Filter Mult.',    value: '4×' },
  { label: 'Kernel Sizes',    value: '[3, 3, 5, 3]' },
  { label: 'Batch Norm',      value: 'Disabled' },
  { label: 'Conv Dropout',    value: '0.1' },
  { label: 'Dense Units',     value: '[256, 128]' },
  { label: 'Dense Dropout',   value: '0.5' },
  { label: 'Learning Rate',   value: '0.0001' },
  { label: 'Optimizer',       value: 'Adam + Weight Decay' },
  { label: 'Loss',            value: 'Cross Entropy' },
  { label: 'Batch Size',      value: '32' },
];

const metrics = [
  { value: '99.04%', label: 'Validation Accuracy' },
  { value: '0.056',  label: 'Validation Loss' },
  { value: '3.4%',   label: 'Generalisation Gap' },
  { value: '+12.9%', label: 'vs. Manual Baseline' },
];

const phases = [
  {
    phase: 'Phase 01',
    title: 'NAS Search',
    items: ['15 architectures evaluated', '15 epochs each', 'Ranked by val. accuracy', 'Best config promoted'],
  },
  {
    phase: 'Phase 02',
    title: 'Full Training',
    items: ['30 epochs on best config', 'ReduceLROnPlateau scheduler', 'Model checkpointing', '99.04 % final accuracy'],
  },
];

const ModelDetails = () => (
  <section className="model-details">
    <div className="container">

      {/* ── Eyebrow ── */}
      <div className="section-eyebrow">
        <span className="badge">Architecture</span>
        <div className="eyebrow-line" />
      </div>

      <h2 className="section-heading">THE MODEL</h2>

      {/* ── Main grid: arch params + metrics ── */}
      <div className="md-top-grid">

        {/* Arch params */}
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

        {/* Metrics */}
        <div className="md-right">
          <div className="metrics-grid">
            {metrics.map(({ value, label }) => (
              <div key={label} className="metric-card glass-card">
                <span className="mc-val">{value}</span>
                <span className="mc-lbl">{label}</span>
              </div>
            ))}
          </div>

          {/* Training phases */}
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

      </div>
    </div>
  </section>
);

export default ModelDetails;