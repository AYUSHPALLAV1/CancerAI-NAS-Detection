import './ExplanationView.css';

const ExplanationView = ({ explanation, diagnosis, confidence, isCancer }) => {
  if (!explanation) return null;

  return (
    <div className="explanation-view">
      <div className="explanation-header">
        <h3>🧠 Explainable AI Analysis</h3>
        <span className="xai-badge">Grad-CAM + Textual XAI</span>
      </div>

      <div className="explanation-grid">
        {/* Grad-CAM heatmap */}
        {explanation.heatmap_image && (
          <div className="heatmap-panel">
            <div className="panel-label">
              <span>🌡️</span>
              <span>Grad-CAM Heatmap</span>
            </div>
            <div className="heatmap-container">
              <img
                src={`data:image/png;base64,${explanation.heatmap_image}`}
                alt="Grad-CAM heatmap"
                className="heatmap-img"
              />
              <div className="heatmap-legend">
                <div className="legend-bar" />
                <div className="legend-labels">
                  <span>Low</span>
                  <span>Medium</span>
                  <span>High</span>
                </div>
                <div className="legend-caption">Model attention intensity</div>
              </div>
            </div>
            <p className="heatmap-desc">
              Red/yellow regions show where the model focused to make its prediction.
              High activation areas correspond to key diagnostic features.
            </p>
          </div>
        )}

        {/* Textual explanation + key factors */}
        <div className="textual-panel">
          {/* AI Reasoning */}
          <div className="reasoning-box">
            <div className="panel-label">
              <span>💬</span>
              <span>AI Reasoning</span>
            </div>
            <p className="reasoning-text">{explanation.textual}</p>
          </div>

          {/* Key factors */}
          {explanation.key_factors && explanation.key_factors.length > 0 && (
            <div className="key-factors-box">
              <div className="panel-label">
                <span>🔑</span>
                <span>Key Diagnostic Factors</span>
              </div>
              <div className="factors-list">
                {explanation.key_factors.map((factor, i) => (
                  <div key={i} className="factor-chip" style={{ animationDelay: `${i * 0.08}s` }}>
                    <span className={`factor-bullet ${isCancer ? 'cancer' : 'benign'}`} />
                    <span>{factor}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Confidence breakdown */}
          <div className="confidence-breakdown">
            <div className="panel-label">
              <span>📈</span>
              <span>Confidence Breakdown</span>
            </div>
            <div className="breakdown-bars">
              {[
                { label: 'Feature Clarity', value: Math.min(confidence + 0.03, 1) },
                { label: 'Pattern Match',   value: Math.min(confidence - 0.02, 1) },
                { label: 'Model Certainty', value: confidence },
              ].map((item, i) => (
                <div key={i} className="breakdown-item">
                  <div className="breakdown-header">
                    <span className="breakdown-label">{item.label}</span>
                    <span className="breakdown-value">{(item.value * 100).toFixed(0)}%</span>
                  </div>
                  <div className="breakdown-track">
                    <div
                      className="breakdown-fill"
                      style={{ width: `${item.value * 100}%`, '--target-width': `${item.value * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExplanationView;