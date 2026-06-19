# Security Policy

## Supported Versions

The following versions of CancerAI-NAS are currently supported with security updates:

| Version | Supported          |
|---------|--------------------|
| 1.x     | ✅ Active           |
| < 1.0   | ❌ Not supported    |

## Reporting a Vulnerability

**Please do NOT report security vulnerabilities through public GitHub issues.**

If you discover a security vulnerability in this project, please follow these steps:

1. **Email** the project maintainer at the GitHub email associated with [@AYUSHPALLAV1](https://github.com/AYUSHPALLAV1).
2. Include a **detailed description** of the vulnerability.
3. Provide **steps to reproduce** the issue.
4. If possible, include a **proof of concept** (PoC).

### Response Timeline

- **Acknowledgment**: Within 48 hours of your report.
- **Status Update**: Within 7 days, we will communicate our assessment.
- **Resolution**: We aim to resolve critical vulnerabilities within 30 days.

## Security Considerations for This Project

### Model File Security
- The `.pth` model file contains serialized PyTorch weights. Only load model files from **trusted sources**.
- We use `weights_only=True` in `torch.load()` to mitigate deserialization attacks.

### Image Upload Security
- The backend validates file extensions and MIME types before processing.
- Uploaded images are processed in-memory and never persisted to disk.
- File size limits should be configured at the reverse-proxy level (e.g., Nginx `client_max_body_size`).

### API Security
- In production, enable authentication on the `/predict` endpoints.
- Set appropriate CORS origins — do not use wildcard `*` in production.
- Rate-limit the prediction endpoints to prevent DoS attacks.

### Dependency Security
- Regularly update dependencies: `pip install --upgrade -r requirements.txt`
- Run `pip audit` periodically to check for known CVEs.

## Acknowledgments

We appreciate responsible disclosure and will credit security researchers in our release notes (unless they prefer to remain anonymous).
