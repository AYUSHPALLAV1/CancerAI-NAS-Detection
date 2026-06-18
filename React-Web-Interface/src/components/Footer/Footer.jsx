import './Footer.css';

const Footer = () => (
  <footer className="footer">
    <div className="container footer-inner">

      {/* ── Left ── */}
      <div className="footer-left">
        <div className="footer-logo">CANCERⒶI</div>
        <p className="footer-tagline">
          Medical AI Research · For educational purposes only
        </p>
      </div>

      {/* ── Centre tags ── */}
      <div className="footer-tags">
        {['PyTorch 2.0', 'AutoML / NAS', 'Grad-CAM XAI', 'Flask', 'React 19', 'LC25000'].map(t => (
          <span key={t} className="footer-tag">{t}</span>
        ))}
      </div>

      {/* ── Right ── */}
      <div className="footer-right">
        <span className="footer-acc">99.04%</span>
        <span className="footer-acc-lbl">Validation Accuracy</span>
      </div>

    </div>

    {/* ── Bottom bar ── */}
    <div className="footer-bottom">
      <div className="container footer-bottom-inner">
        <span>⚕ Not for clinical use · Research only</span>
        <span>Built with PyTorch · AutoML · Grad-CAM XAI · 2025</span>
      </div>
    </div>
  </footer>
);

export default Footer;