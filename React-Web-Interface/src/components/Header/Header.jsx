import { useState, useEffect } from 'react';
import './Header.css';

const Header = () => {
  const [apiStatus, setApiStatus] = useState('checking');
  const [scrolled, setScrolled]   = useState(false);

  useEffect(() => {
    const checkHealth = async () => {
      try {
        const res  = await fetch('http://localhost:5000/health');
        const data = await res.json();
        setApiStatus(data.model_loaded ? 'online' : 'degraded');
      } catch {
        setApiStatus('offline');
      }
    };
    checkHealth();
    const iv = setInterval(checkHealth, 30000);

    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll);

    return () => { clearInterval(iv); window.removeEventListener('scroll', onScroll); };
  }, []);

  const statusLabel = {
    checking: 'Connecting',
    online:   'Model Online',
    degraded: 'Degraded',
    offline:  'Offline',
  }[apiStatus];

  return (
    <header className={`header${scrolled ? ' scrolled' : ''}`}>
      <div className="header-inner container">

        {/* ── Logo ── */}
        <div className="header-logo">
          <svg className="logo-icon" viewBox="0 0 36 36" fill="none">
            <circle cx="18" cy="18" r="16" stroke="#111214" strokeWidth="1.5"/>
            <path d="M10 18h4l3-5 4 10 3-5h3" stroke="#111214" strokeWidth="1.5"
                  strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span className="logo-text">CANCERⒶI</span>
        </div>

        {/* ── Centre nav tags ── */}
        <nav className="header-nav">
          <span className="nav-tag">NAS · AutoML</span>
          <span className="nav-divider">+</span>
          <span className="nav-tag">Grad-CAM XAI</span>
          <span className="nav-divider">+</span>
          <span className="nav-tag">PyTorch</span>
        </nav>

        {/* ── Right ── */}
        <div className="header-right">
          <div className={`status-pill status-${apiStatus}`}>
            <span className="status-dot" />
            <span>{statusLabel}</span>
          </div>
          <div className="accuracy-chip">
            <span className="acc-val">99.04%</span>
            <span className="acc-lbl">ACC</span>
          </div>
        </div>

      </div>
    </header>
  );
};

export default Header;