import { useState } from 'react';
import './Tabs.css';

const Tabs = ({ children }) => {
  const [activeTab, setActiveTab] = useState(0);

  const tabs = Array.isArray(children) ? children : [children];

  const tabIcons = ['🧠', '🔬', '📊'];

  return (
    <div className="tabs-wrapper">
      <div className="tabs-nav">
        <div className="container">
          <div className="tabs-nav-inner">
            {tabs.map((tab, index) => (
              <button
                key={index}
                className={`tab-btn ${activeTab === index ? 'active' : ''}`}
                onClick={() => setActiveTab(index)}
              >
                <span className="tab-icon">{tabIcons[index]}</span>
                <span className="tab-label">{tab?.props?.title || `Tab ${index + 1}`}</span>
                {activeTab === index && <span className="tab-active-indicator" />}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="tabs-content">
        {tabs.map((tab, index) => (
          <div
            key={index}
            className={`tab-panel ${activeTab === index ? 'active' : ''}`}
          >
            {tab}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Tabs;