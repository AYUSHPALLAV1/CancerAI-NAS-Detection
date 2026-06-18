import { useState } from 'react';
import './Tabs.css';

const Tabs = ({ children }) => {
  const [activeTab, setActiveTab] = useState(0);
  const tabs = Array.isArray(children) ? children : [children];

  return (
    <div className="tabs-wrapper">
      {/* ── Tab bar ── */}
      <div className="tabs-bar">
        <div className="container">
          <div className="tabs-bar-inner">
            {tabs.map((tab, i) => (
              <button
                key={i}
                className={`tab-btn${activeTab === i ? ' active' : ''}`}
                onClick={() => setActiveTab(i)}
              >
                <span className="tab-label">{tab?.props?.title || `Tab ${i + 1}`}</span>
                {activeTab === i && <span className="tab-line" />}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Tab panels ── */}
      <div className="tabs-content">
        {tabs.map((tab, i) => (
          <div
            key={i}
            className={`tab-panel${activeTab === i ? ' active' : ''}`}
          >
            {tab}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Tabs;