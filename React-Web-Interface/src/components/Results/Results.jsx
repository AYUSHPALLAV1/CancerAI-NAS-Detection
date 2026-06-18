import ExplanationView from '../ExplanationView/ExplanationView';
import './Results.css';

const Results = ({ results, isLoading, onNewAnalysis, analysisTime, imageName }) => {
  if (!results && !isLoading) return null;

  if (isLoading) {
    return (
      <div className="results-loading">
        <div className="loading-orb">
          <div className="loading-ring ring-1" />
          <div className="loading-ring ring-2" />
          <div className="loading-ring ring-3" />
          <span className="loading-core">🧠</span>
        </div>
        <h3>Neural Analysis in Progress</h3>
        <p>NAS-optimized CNN is classifying your tissue sample…</p>
        <p className="loading-sub">Generating Grad-CAM visualization and explanations</p>
      </div>
    );
  }

  const { predictions, confidence, diagnosis, diagnosis_type, explanation } = results;
  const isCancer = diagnosis_type !== 'benign';
  const confidencePct = (confidence * 100).toFixed(2);

  const confidenceLevel =
    confidence > 0.9 ? { label: 'Very High', color: '#10b981', bg: 'rgba(16,185,129,0.15)' } :
    confidence > 0.7 ? { label: 'High',      color: '#3b82f6', bg: 'rgba(59,130,246,0.15)'  } :
    confidence > 0.5 ? { label: 'Medium',    color: '#eab308', bg: 'rgba(234,179,8,0.15)'   } :
                       { label: 'Low',       color: '#ef4444', bg: 'rgba(239,68,68,0.15)'   };

  return (
    <div className="results-container">
      {/* Top bar */}
      <div className="results-topbar">
        <div className="results-meta">
          <span className="results-label">🔬 Analysis Complete</span>
          {analysisTime && <span className="results-time">⏱ {analysisTime}s</span>}
          {imageName && <span className="results-file">📁 {imageName}</span>}
        </div>
        <button onClick={onNewAnalysis} className="new-analysis-btn">
          ← New Analysis
        </button>
      </div>

      {/* Primary diagnosis card */}
      <div className={`diagnosis-card ${isCancer ? 'cancer' : 'benign'}`}>
        <div className="diagnosis-left">
          <div className="diagnosis-icon-ring">
            <span>{isCancer ? '⚠️' : '✅'}</span>
          </div>
          <div>
            <div className="diagnosis-label">Primary Diagnosis</div>
            <div className="diagnosis-name">{diagnosis}</div>
            <div className={`diagnosis-type-badge ${isCancer ? 'cancer' : 'benign'}`}>
              {isCancer ? '🔴 Cancerous Tissue' : '🟢 Benign Tissue'}
            </div>
          </div>
        </div>

        <div className="diagnosis-right">
          <div className="confidence-ring-container">
            <svg viewBox="0 0 80 80" className="confidence-ring-svg">
              <circle cx="40" cy="40" r="34" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="6"/>
              <circle
                cx="40" cy="40" r="34" fill="none"
                stroke={isCancer ? '#ef4444' : '#10b981'}
                strokeWidth="6"
                strokeLinecap="round"
                strokeDasharray={`${confidence * 213.6} 213.6`}
                strokeDashoffset="53.4"
                style={{ filter: `drop-shadow(0 0 6px ${isCancer ? '#ef4444' : '#10b981'})` }}
              />
            </svg>
            <div className="confidence-ring-text">
              <span className="conf-value">{confidencePct}%</span>
              <span className="conf-label">confidence</span>
            </div>
          </div>
          <div className="confidence-level-badge" style={{ background: confidenceLevel.bg, color: confidenceLevel.color }}>
            {confidenceLevel.label} Confidence
          </div>
        </div>
      </div>

      {/* Alert for low confidence */}
      {confidence < 0.6 && (
        <div className="confidence-alert">
          <span>⚠️</span>
          <div>
            <strong>Low Confidence Warning:</strong> The model is not highly confident in this prediction.
            Consider re-uploading a higher-quality tissue image or consulting additional diagnostic methods.
          </div>
        </div>
      )}

      {/* Probability bars */}
      <div className="probabilities-card">
        <h3>📊 Class Probability Distribution</h3>
        <div className="probability-list">
          {predictions.map((pred, index) => {
            const pct = pred.probability * 100;
            const isTop = index === 0;
            return (
              <div key={index} className={`prob-item ${isTop ? 'top' : ''}`}>
                <div className="prob-header">
                  <span className="prob-class">{pred.class}</span>
                  <span className="prob-pct">{pred.percentage}</span>
                </div>
                <div className="prob-track">
                  <div
                    className={`prob-fill ${isTop ? 'fill-top' : ''}`}
                    style={{ width: `${pct}%`, '--target-width': `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Explanation */}
      <ExplanationView
        explanation={explanation}
        diagnosis={diagnosis}
        confidence={confidence}
        isCancer={isCancer}
      />

      {/* Model badge */}
      <div className="results-model-badge">
        <span>🤖</span>
        <span>NAS-Optimized CNN — PyTorch 2.0 — 99.04% Validation Accuracy — LC25000 Dataset — Grad-CAM XAI</span>
      </div>

      <div className="results-actions">
        <button onClick={onNewAnalysis} className="new-analysis-btn-large">
          🔬 Analyze Another Image
        </button>
      </div>
    </div>
  );
};

export default Results;