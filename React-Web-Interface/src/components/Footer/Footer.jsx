import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-glow" />
      <div className="container">
        <div className="footer-content">
          <div className="footer-left">
            <div className="footer-logo-text">🧬 CancerAI NAS</div>
            <p className="footer-desc">
              Advanced Medical AI Research Platform using Neural Architecture Search
              and Explainable Artificial Intelligence for cancer detection.
            </p>
            <div className="footer-tags">
              {['PyTorch 2.0', 'AutoML / NAS', 'Grad-CAM XAI', 'Flask REST API', 'React 19', 'LC25000'].map(t => (
                <span key={t} className="footer-tag">{t}</span>
              ))}
            </div>
          </div>

          <div className="footer-right">
            <div className="footer-metric">
              <span className="fm-value">99.04%</span>
              <span className="fm-label">Validation Accuracy</span>
            </div>
            <div className="footer-metric">
              <span className="fm-value">5</span>
              <span className="fm-label">Cancer Classes</span>
            </div>
            <div className="footer-metric">
              <span className="fm-value">LC25000</span>
              <span className="fm-label">Training Dataset</span>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <span>⚕️ For research and educational purposes only · Not for clinical use</span>
          <span className="footer-credit">Built with PyTorch · AutoML · Grad-CAM XAI · 2025</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;