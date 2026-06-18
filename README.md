# 🧬 CancerAI-NAS-Detection

<div align="center">

![Python](https://img.shields.io/badge/Python-3.13-blue?logo=python)
![PyTorch](https://img.shields.io/badge/PyTorch-2.0-orange?logo=pytorch)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![Flask](https://img.shields.io/badge/Flask-REST_API-black?logo=flask)
![Accuracy](https://img.shields.io/badge/Accuracy-99.04%25-brightgreen)
![License](https://img.shields.io/badge/License-MIT-blue)

**Advanced Cancer Detection using Neural Architecture Search (AutoML) + Explainable AI**

*Detects lung and colon cancer from histopathology images with 99.04% validation accuracy*

[🚀 Live Demo Setup](#-quick-start) · [📊 Model Details](#-model-architecture) · [🧠 XAI Features](#-explainable-ai-grad-cam)

</div>

---

## 🎯 Project Overview

This project implements a **state-of-the-art cancer detection pipeline** that combines:

- **AutoML / Neural Architecture Search (NAS)** — automatically discovers the optimal CNN architecture from a 15-configuration search space
- **Deep Learning (PyTorch CNN)** — custom 4-block convolutional network optimized by NAS
- **Grad-CAM Explainable AI** — visual attention heatmaps showing exactly which tissue regions drove the prediction
- **Premium React UI** — real-time analysis with confidence rings, history panel, and interactive results

### 🩺 Supported Cancer Classes

| Class | Type | Description |
|-------|------|-------------|
| `Lung Benign` | ✅ Normal | Healthy lung tissue |
| `Lung Adenocarcinoma` | ⚠️ Cancer | Gland-forming lung cancer |
| `Lung Squamous Cell Carcinoma` | ⚠️ Cancer | SCC lung cancer |
| `Colon Benign` | ✅ Normal | Healthy colon tissue |
| `Colon Adenocarcinoma` | ⚠️ Cancer | Malignant colon cancer |

---

## ✨ Key Features

- 🎯 **99.04% Validation Accuracy** on LC25000 histopathology dataset
- 🧠 **AutoML / NAS** — searches 15 architecture configurations automatically
- 🔬 **Grad-CAM Heatmaps** — visual explanation of model decisions (hook-free `autograd.grad` implementation)
- 📋 **Analysis History** — last 10 predictions stored in localStorage
- 🌡️ **Confidence Ring** — animated SVG confidence visualization
- ⚠️ **Low-confidence Alerts** — warns when model certainty is below 60%
- 🎨 **Premium Dark UI** — glassmorphism design with micro-animations
- 🔄 **Live API Health Check** — real-time backend status in header
- 📱 **Responsive Design** — works on all screen sizes

---

## 🏗️ Architecture

```
CancerAI-NAS-Detection/
├── Model_training/
│   ├── train_automl_pytorch/
│   │   └── new_train_nas.py       ← AutoML NAS training script
│   └── Data/
│       └── samples/               ← Demo images (25 synthetic H&E images)
├── React-Web-Interface/
│   ├── backend/
│   │   └── app.py                 ← Flask REST API + Grad-CAM
│   └── src/
│       ├── components/
│       │   ├── Header/            ← Live API health check + stats
│       │   ├── UploadInterface/   ← Drag-drop + history sidebar
│       │   ├── Results/           ← Confidence ring + diagnosis card
│       │   ├── ExplanationView/   ← Grad-CAM heatmap + key factors
│       │   ├── Tabs/              ← Animated tab navigation
│       │   ├── TestTab/           ← Hero section + stats
│       │   └── Footer/            ← Tech stack + metrics
│       └── index.css              ← Premium dark design system
├── get_demo_images.py             ← Synthetic H&E demo image generator
└── README.md
```

---

## 🧠 Model Architecture

The NAS process searches over these hyperparameters:

| Parameter | Search Space |
|-----------|-------------|
| Conv blocks | 2–5 |
| Filter multiplier | 2, 4, 6 |
| Kernel sizes | [3,3,3], [3,3,5,3], [3,5,3,5,3] |
| Batch normalization | True / False |
| Conv dropout | 0.1, 0.2 |
| Dense units | [256,128], [512,256,128] |
| Dense dropout | 0.3, 0.5 |

**Best found architecture:**
- 4 convolutional blocks, filter multiplier 4
- Kernel sizes: [3, 3, 5, 3]
- Dense layers: [256, 128]
- Dropout: conv=0.1, dense=0.5

---

## 🔬 Explainable AI — Grad-CAM

This implementation uses a **hook-free Grad-CAM** approach:

```python
# Uses torch.autograd.grad instead of backward hooks
# Avoids inplace-ReLU conflicts that break register_backward_hook
grads = torch.autograd.grad(
    outputs=score,
    inputs=self.activations,
    retain_graph=False,
    create_graph=False,
)[0]
weights = grads.mean(dim=(2, 3), keepdim=True)
cam = torch.relu((weights * self.activations).sum(dim=1).squeeze())
```

**Result:** Attention heatmaps in ~5s on CPU (vs. 90s+ with standard backward hooks).

---

## 🚀 Quick Start

### Prerequisites
- Python 3.10+
- Node.js 18+
- ~500MB disk space (for PyTorch)

### 1. Clone
```bash
git clone https://github.com/AYUSHPALLAV1/CancerAI-NAS-Detection.git
cd CancerAI-NAS-Detection
```

### 2. Backend Setup
```bash
cd React-Web-Interface/backend
pip install flask flask-cors torch torchvision pillow opencv-python numpy
# Download the pre-trained model (see note below)
python app.py
```

> **Note:** The pre-trained model file (`lung_colon_cancer_nas_model_*.pth`, ~96MB) is not included in this repo due to GitHub's file size limit. Train it yourself with `Model_training/train_automl_pytorch/new_train_nas.py` after downloading the LC25000 dataset from [Kaggle](https://www.kaggle.com/datasets/andrewmvd/lung-and-colon-cancer-histopathological-images).

### 3. Frontend Setup
```bash
cd React-Web-Interface
npm install
npm run dev
```

### 4. Open
```
Frontend: http://localhost:5173
Backend:  http://localhost:5000
```

### 5. Generate Demo Images (optional)
```bash
python get_demo_images.py
# Creates 25 synthetic H&E tissue images (5 per class) for testing
```

---

## 📊 Performance Results

| Metric | Value |
|--------|-------|
| Validation Accuracy | **99.04%** |
| Test Accuracy | 98.8% |
| Training Dataset | LC25000 (25,000 images) |
| Image Size | 128 × 128 px |
| Inference Time (CPU) | ~5–6s |
| Grad-CAM Generation | included in inference |
| NAS Search Configs | 15 |

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **ML Framework** | PyTorch 2.0 |
| **AutoML/NAS** | Custom Python search |
| **XAI** | Grad-CAM (`autograd.grad`) |
| **Backend API** | Flask + Flask-CORS |
| **Frontend** | React 19 + Vite 7 |
| **HTTP Client** | Axios |
| **Styling** | Vanilla CSS (glassmorphism) |
| **Fonts** | Inter + JetBrains Mono |

---

## ⚕️ Medical Disclaimer

> This tool is for **research and educational purposes only**. It must not replace professional medical diagnosis, clinical decision-making, or pathologist review. Always consult qualified medical professionals for diagnostic decisions.

---

## 📄 License

MIT License — see [LICENSE](LICENSE) for details.

---

<div align="center">
Built with ❤️ using PyTorch · AutoML · Grad-CAM XAI · React
</div>
