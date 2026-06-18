import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import Results from '../Results/Results';
import './UploadInterface.css';

const API_BASE_URL = 'http://localhost:5000';

const UploadInterface = () => {
  const [uploadedImage, setUploadedImage] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [history, setHistory] = useState([]);
  const [analysisTime, setAnalysisTime] = useState(null);
  const fileInputRef = useRef(null);
  const startTimeRef = useRef(null);

  // Load history from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('cancer_ai_history');
      if (saved) setHistory(JSON.parse(saved));
    } catch { /* ignore */ }
  }, []);

  const saveHistory = (newEntry) => {
    setHistory(prev => {
      const updated = [newEntry, ...prev].slice(0, 10); // keep last 10
      localStorage.setItem('cancer_ai_history', JSON.stringify(updated));
      return updated;
    });
  };

  const handleImageUpload = (file) => {
    if (imagePreviewUrl) URL.revokeObjectURL(imagePreviewUrl);
    const url = URL.createObjectURL(file);
    setUploadedImage(file);
    setImagePreviewUrl(url);
    setResults(null);
    setError(null);
  };

  const handleAnalyze = async () => {
    if (!uploadedImage) return;
    setIsLoading(true);
    setError(null);
    startTimeRef.current = Date.now();

    try {
      const formData = new FormData();
      formData.append('image', uploadedImage);

      const response = await axios.post(`${API_BASE_URL}/predict-with-explanation`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 180000,   // 3 min — CPU inference + Grad-CAM ~20-40s
      });

      if (response.data && response.data.success) {
        const elapsed = ((Date.now() - startTimeRef.current) / 1000).toFixed(1);
        setAnalysisTime(elapsed);
        setResults(response.data);

        // Save to history
        saveHistory({
          id: Date.now(),
          timestamp: new Date().toLocaleString(),
          imageName: uploadedImage.name,
          diagnosis: response.data.diagnosis,
          confidence: response.data.confidence,
          diagnosisType: response.data.diagnosis_type,
          analysisTime: elapsed,
        });
      } else {
        setError(response.data?.error || 'Prediction failed — unexpected server response.');
      }
    } catch (err) {
      console.error('API Error full details:', err);
      const code = err.code || '';
      if (code === 'ECONNREFUSED' || err.message?.includes('Network Error')) {
        setError('⚡ Cannot connect to backend. Make sure Flask server is running on port 5000.');
      } else if (code === 'ECONNABORTED' || code === 'ERR_CANCELED') {
        setError('⏱ Request timed out. The model is taking too long — try again or use a smaller image.');
      } else if (err.response?.data?.error) {
        setError(`Server error: ${err.response.data.error}`);
      } else if (err.response?.status) {
        setError(`Server returned HTTP ${err.response.status}. Check Flask logs for details.`);
      } else {
        setError(`Error: ${err.message || 'Unknown error. Check browser console for details.'}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDragOver = (e) => { e.preventDefault(); setDragOver(true); };
  const handleDragLeave = (e) => { e.preventDefault(); setDragOver(false); };
  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files?.[0]) handleImageUpload(e.dataTransfer.files[0]);
  };
  const handleFileSelect = (e) => {
    if (e.target.files?.[0]) handleImageUpload(e.target.files[0]);
  };

  const handleNewAnalysis = () => {
    if (imagePreviewUrl) URL.revokeObjectURL(imagePreviewUrl);
    setUploadedImage(null);
    setImagePreviewUrl(null);
    setResults(null);
    setError(null);
    setAnalysisTime(null);
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('cancer_ai_history');
  };

  return (
    <section className="upload-section">
      <div className="upload-layout">
        {/* Main content */}
        <div className="upload-main">
          {!results ? (
            <>
              {/* Upload zone */}
              <div className="upload-card">
                <div className="upload-card-header">
                  <h3>🔬 Upload Tissue Image</h3>
                  <span className="upload-card-hint">Drag & drop or click to browse</span>
                </div>

                <div
                  className={`upload-drop-zone ${dragOver ? 'drag-over' : ''} ${uploadedImage ? 'has-image' : ''}`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => !uploadedImage && fileInputRef.current?.click()}
                >
                  {uploadedImage ? (
                    <div className="image-preview-container">
                      <img src={imagePreviewUrl} alt="Preview" className="image-preview" />
                      <div className="image-overlay">
                        <div className="image-info">
                          <div className="image-scan-line" />
                          <span className="image-name">📁 {uploadedImage.name}</span>
                          <span className="image-size">{(uploadedImage.size / 1024).toFixed(1)} KB</span>
                        </div>
                        <button className="change-image-btn" onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}>
                          🔄 Change Image
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="drop-zone-empty">
                      <div className="drop-icon">
                        <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                          <circle cx="24" cy="24" r="22" stroke="url(#ig)" strokeWidth="1.5" strokeDasharray="4 3"/>
                          <path d="M24 14v12m0-12l-5 5m5-5l5 5" stroke="url(#ig2)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M14 36h20" stroke="url(#ig2)" strokeWidth="2" strokeLinecap="round" opacity="0.5"/>
                          <defs>
                            <linearGradient id="ig" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
                              <stop stopColor="#3b82f6"/><stop offset="1" stopColor="#8b5cf6"/>
                            </linearGradient>
                            <linearGradient id="ig2" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
                              <stop stopColor="#06b6d4"/><stop offset="1" stopColor="#3b82f6"/>
                            </linearGradient>
                          </defs>
                        </svg>
                      </div>
                      <p className="drop-title">Drop your histopathology image here</p>
                      <p className="drop-subtitle">Supports JPG · PNG · JPEG · BMP · TIFF</p>
                    </div>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="file-input"
                  />
                </div>

                {error && (
                  <div className="error-alert">
                    <span className="error-icon">⚠️</span>
                    <span>{error}</span>
                  </div>
                )}

                <div className="upload-actions">
                  <button
                    id="analyze-btn"
                    onClick={handleAnalyze}
                    disabled={!uploadedImage || isLoading}
                    className={`analyze-btn ${isLoading ? 'loading' : ''}`}
                  >
                    {isLoading ? (
                      <>
                        <div className="btn-spinner" />
                        <span>Running Neural Analysis… (may take 20–40s on CPU)</span>
                      </>
                    ) : (
                      <>
                        <span>🧠 Analyze with Explainable AI</span>
                      </>
                    )}
                  </button>
                  {uploadedImage && !isLoading && (
                    <button className="clear-btn" onClick={handleNewAnalysis}>✕ Clear</button>
                  )}
                </div>

                {isLoading && (
                  <div className="analysis-progress">
                    <div className="progress-steps">
                      {['Preprocessing image', 'Running CNN inference', 'Generating Grad-CAM', 'Building explanation'].map((step, i) => (
                        <div key={i} className="progress-step" style={{ animationDelay: `${i * 0.8}s` }}>
                          <div className="step-indicator" />
                          <span>{step}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* What to upload info */}
              <div className="info-grid">
                {[
                  { icon: '🫁', label: 'Lung Benign', desc: 'Normal lung tissue', type: 'benign' },
                  { icon: '🔴', label: 'Lung Adenocarcinoma', desc: 'Gland-forming lung cancer', type: 'cancer' },
                  { icon: '⚠️', label: 'Lung SCC', desc: 'Squamous cell carcinoma', type: 'cancer' },
                  { icon: '🟢', label: 'Colon Benign', desc: 'Healthy colon tissue', type: 'benign' },
                  { icon: '🔴', label: 'Colon Adenocarcinoma', desc: 'Malignant colon cancer', type: 'cancer' },
                ].map((item, i) => (
                  <div key={i} className={`info-chip ${item.type}`}>
                    <span className="chip-icon">{item.icon}</span>
                    <div>
                      <div className="chip-label">{item.label}</div>
                      <div className="chip-desc">{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <Results
              results={results}
              isLoading={isLoading}
              onNewAnalysis={handleNewAnalysis}
              analysisTime={analysisTime}
              imageName={uploadedImage?.name}
            />
          )}
        </div>

        {/* History sidebar */}
        <aside className="history-sidebar">
          <div className="history-card">
            <div className="history-header">
              <h3>📋 Analysis History</h3>
              {history.length > 0 && (
                <button className="clear-history-btn" onClick={clearHistory}>Clear</button>
              )}
            </div>

            {history.length === 0 ? (
              <div className="history-empty">
                <div className="history-empty-icon">🔬</div>
                <p>No analyses yet</p>
                <span>Run your first analysis to see history here</span>
              </div>
            ) : (
              <div className="history-list">
                {history.map((item) => (
                  <div key={item.id} className={`history-item ${item.diagnosisType}`}>
                    <div className="history-item-icon">
                      {item.diagnosisType === 'benign' ? '✅' : '⚠️'}
                    </div>
                    <div className="history-item-info">
                      <div className="history-diagnosis">{item.diagnosis}</div>
                      <div className="history-confidence">
                        {(item.confidence * 100).toFixed(1)}% confidence
                      </div>
                      <div className="history-meta">
                        <span className="history-file">📁 {item.imageName?.slice(0, 20)}{item.imageName?.length > 20 ? '…' : ''}</span>
                        <span className="history-time">⏱ {item.analysisTime}s</span>
                      </div>
                      <div className="history-timestamp">{item.timestamp}</div>
                    </div>
                    <div className={`history-badge ${item.diagnosisType}`}>
                      {item.diagnosisType}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Model info footer */}
            <div className="model-info-footer">
              <div className="model-info-row">
                <span className="mi-label">Model</span>
                <span className="mi-val">NAS-Optimized CNN</span>
              </div>
              <div className="model-info-row">
                <span className="mi-label">Accuracy</span>
                <span className="mi-val accent">99.04%</span>
              </div>
              <div className="model-info-row">
                <span className="mi-label">Framework</span>
                <span className="mi-val">PyTorch 2.0</span>
              </div>
              <div className="model-info-row">
                <span className="mi-label">XAI</span>
                <span className="mi-val">Grad-CAM</span>
              </div>
              <div className="model-info-row">
                <span className="mi-label">Dataset</span>
                <span className="mi-val">LC25000</span>
              </div>
            </div>
          </div>
        </aside>
      </div>

      {/* Disclaimer */}
      <div className="disclaimer-banner">
        <span>⚕️</span>
        <span><strong>Medical Disclaimer:</strong> This tool is for research and educational purposes only. It must not replace professional medical diagnosis or clinical decision-making.</span>
      </div>
    </section>
  );
};

export default UploadInterface;