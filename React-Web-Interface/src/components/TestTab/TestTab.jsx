import UploadInterface from '../UploadInterface/UploadInterface';
import './TestTab.css';

const TestTab = () => (
  <div className="test-tab">

    {/* ── Compact hero banner ── */}
    <div className="test-banner">
      <div className="test-banner-watermark" aria-hidden="true">TEST</div>
      <div className="container test-banner-inner">
        <div className="test-banner-left">
          <span className="badge">↳ Live Inference</span>
          <h2 className="test-banner-title">
            ANALYSE<br />
            <span className="test-title-stroke">TISSUE</span>
          </h2>
          <p className="test-banner-sub">
            Upload histopathology images — get AI diagnosis + Grad-CAM heatmap in ~5 s.
          </p>
        </div>
        <div className="test-banner-chips">
          {[
            { val: '99.04%', lbl: 'Accuracy' },
            { val: '5',      lbl: 'Classes'  },
            { val: '~5s',    lbl: 'CPU Time' },
            { val: 'XAI',    lbl: 'Grad-CAM' },
          ].map(({ val, lbl }) => (
            <div key={lbl} className="test-chip glass-card">
              <span className="tc-val">{val}</span>
              <span className="tc-lbl">{lbl}</span>
            </div>
          ))}
        </div>
      </div>
    </div>

    {/* ── Upload interface ── */}
    <UploadInterface />
  </div>
);

export default TestTab;