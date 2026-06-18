import UploadInterface from '../UploadInterface/UploadInterface';
import './TestTab.css';

const TestTab = () => {
  return (
    <div className="test-tab">
      <div className="test-tab-hero">
        <div className="container">
          <div className="test-hero-content">
            <div className="test-hero-left">
              <div className="test-hero-badge">🔬 Live AI Model</div>
              <h2 className="test-hero-title">Cancer Detection<br/><span className="gradient-text">Analysis Interface</span></h2>
              <p className="test-hero-desc">
                Upload histopathological tissue images and get instant AI-powered analysis using our
                NAS-optimized CNN with Grad-CAM explainability.
              </p>
            </div>
            <div className="test-hero-stats">
              {[
                { icon: '🎯', value: '99.04%', label: 'Validation Accuracy' },
                { icon: '⚡', value: '<2s',    label: 'Analysis Time' },
                { icon: '🧬', value: '5',      label: 'Cancer Classes' },
                { icon: '🧠', value: 'NAS',    label: 'Architecture' },
              ].map((s, i) => (
                <div key={i} className="hero-stat-card">
                  <span className="hero-stat-icon">{s.icon}</span>
                  <span className="hero-stat-value">{s.value}</span>
                  <span className="hero-stat-label">{s.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <UploadInterface />
    </div>
  );
};

export default TestTab;