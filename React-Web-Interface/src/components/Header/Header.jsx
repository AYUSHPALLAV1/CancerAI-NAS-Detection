import { useState, useEffect } from 'react';
import './Header.css';

const Header = () => {
  const [apiStatus, setApiStatus] = useState('checking');

  useEffect(() => {
    const checkHealth = async () => {
      try {
        const res = await fetch('http://localhost:5000/health');
        const data = await res.json();
        setApiStatus(data.model_loaded ? 'online' : 'degraded');
      } catch {
        setApiStatus('offline');
      }
    };
    checkHealth();
    const interval = setInterval(checkHealth, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="header">
      {/* Animated scan line */}
      <div className="header-scan-line" />

      <div className="header-content container">
        {/* Left: Logo & Title */}
        <div className="header-left">
          <div className="header-logo">
            <div className="logo-ring">
              <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="20" cy="20" r="18" stroke="url(#g1)" strokeWidth="2"/>
                <path d="M12 20h4l3-6 4 12 3-6h4" stroke="url(#g2)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <defs>
                  <linearGradient id="g1" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#3b82f6"/><stop offset="1" stopColor="#8b5cf6"/>
                  </linearGradient>
                  <linearGradient id="g2" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#06b6d4"/><stop offset="1" stopColor="#3b82f6"/>
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>

          <div className="header-title-group">
            <div className="header-label">🧬 Medical AI Research Platform</div>
            <h1 className="header-title">
              Cancer<span className="gradient-text"> AI</span> Detection
              <span className="header-title-sub"> with AutoML & NAS</span>
            </h1>
            <p className="header-subtitle">
              Neural Architecture Search · Grad-CAM XAI · PyTorch · 99.04% Accuracy
            </p>
          </div>
        </div>

        {/* Right: Stats & Status */}
        <div className="header-right">
          <div className="header-stats">
            <div className="stat-chip">
              <span className="stat-value">99.04%</span>
              <span className="stat-label">Accuracy</span>
            </div>
            <div className="stat-chip">
              <span className="stat-value">5</span>
              <span className="stat-label">Classes</span>
            </div>
            <div className="stat-chip">
              <span className="stat-value">NAS</span>
              <span className="stat-label">AutoML</span>
            </div>
          </div>

          <div className={`api-status-badge status-${apiStatus}`}>
            <span className="status-dot" />
            <span className="status-text">
              {apiStatus === 'checking' && 'Connecting…'}
              {apiStatus === 'online'   && 'API Online'}
              {apiStatus === 'degraded' && 'Degraded'}
              {apiStatus === 'offline'  && 'API Offline'}
            </span>
          </div>
        </div>
      </div>

      {/* Bottom gradient line */}
      <div className="header-border-glow" />
    </header>
  );
};

export default Header;