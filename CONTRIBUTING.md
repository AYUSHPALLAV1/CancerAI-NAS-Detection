# Contributing to CancerAI-NAS Detection

Thank you for your interest in contributing! 🎉  
This guide will walk you through everything you need to get started.

---

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Development Workflow](#development-workflow)
- [Running Tests](#running-tests)
- [Submitting a Pull Request](#submitting-a-pull-request)
- [Coding Style](#coding-style)

---

## Code of Conduct

Please be respectful, inclusive, and constructive. We follow the  
[Contributor Covenant](https://www.contributor-covenant.org/version/2/1/code_of_conduct/) as our standard.

---

## Getting Started

### Prerequisites

| Tool | Version |
|------|---------|
| Python | ≥ 3.9 |
| Node.js | ≥ 18 |
| Git | ≥ 2.40 |

### Setup

```bash
# 1. Fork the repo on GitHub, then clone your fork:
git clone https://github.com/<your-username>/CancerAI-NAS-Detection.git
cd CancerAI-NAS-Detection

# 2. Add the upstream remote:
git remote add upstream https://github.com/AYUSHPALLAV1/CancerAI-NAS-Detection.git

# 3. Create and activate a Python virtual environment:
python -m venv .venv
# Windows
.venv\Scripts\activate
# macOS / Linux
source .venv/bin/activate

# 4. Install Python dependencies:
pip install -r requirements.txt

# 5. Install React frontend dependencies:
cd React-Web-Interface
npm install
cd ..
```

---

## Project Structure

```
CancerAI-NAS/
├── Model_training/           # PyTorch NAS training scripts
│   └── train_automl_pytorch/
│       └── new_train_nas.py
├── React-Web-Interface/      # Vite + React frontend
│   ├── backend/              # Flask REST API
│   │   └── app.py
│   └── src/
│       └── components/       # React components
├── utils/                    # Shared preprocessing utilities
│   ├── __init__.py
│   └── preprocessing.py
├── tests/                    # Pytest test suite
│   └── test_preprocessing.py
├── .github/
│   └── ISSUE_TEMPLATE/       # GitHub issue templates
├── requirements.txt          # Python dependencies
├── CONTRIBUTORS.md
├── CONTRIBUTING.md           # ← You are here
└── SECURITY.md
```

---

## Development Workflow

```bash
# 1. Sync your fork with upstream before starting work:
git fetch upstream
git checkout main
git merge upstream/main

# 2. Create a feature branch:
git checkout -b feat/your-feature-name

# 3. Make your changes, commit with Conventional Commits:
git commit -m "feat: add LIME explainability support"

# 4. Push to your fork:
git push origin feat/your-feature-name

# 5. Open a Pull Request from GitHub's UI.
```

---

## Running Tests

```bash
# Run the full test suite:
pytest tests/ -v

# Run with coverage report:
pytest tests/ --cov=utils --cov-report=term-missing

# Run just the preprocessing tests:
pytest tests/test_preprocessing.py -v
```

> ✅ All tests must pass before a PR can be merged.

---

## Submitting a Pull Request

1. Ensure your branch is up-to-date with `upstream/main`.
2. Add / update tests for any code you change.
3. Fill in the PR template completely.
4. Reference the issue it resolves (`Closes #123`).
5. Request a review from `@AYUSHPALLAV1`.

---

## Coding Style

### Python
- Follow **PEP 8** (enforced via `flake8`).
- Format with **Black** (`black .`).
- Write Google-style docstrings for all public functions.
- Target ≥ 80% test coverage for new modules.

### JavaScript / React
- Use **ES2020+** syntax.
- Prefer functional components with hooks.
- Keep components small and single-responsibility.

### Commit Messages (Conventional Commits)

```
<type>(<scope>): <short summary>

Types: feat | fix | docs | test | refactor | build | ci | chore
```

Examples:
```
feat(backend): add batch prediction endpoint
fix(preprocessing): handle RGBA images correctly
docs(readme): add GPU installation instructions
test(preprocessing): cover edge cases for denormalize()
```

---

Thank you for contributing to cancer detection research! 🧬
