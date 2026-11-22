# EcoVision AI 🌱

**AI-powered waste classification and recycling guidance** — a college mini-project built with React, TypeScript, FastAPI, and PyTorch.

> **Status:** Working local demonstration. Public cloud deployment is not required. The model is experimental and should not be used as the sole basis for real-world waste disposal decisions.

## Overview

EcoVision AI lets users upload an image of a waste item, predicts one of six waste categories, and presents recycling guidance. The interface also stores scan history locally and shows basic scan analytics.

## Features

- **Image classification:** Upload JPG, PNG, or WebP images (up to 10 MB).
- **Six categories:** Cardboard, glass, metal, paper, plastic, and trash/general waste.
- **Prediction details:** Predicted category, model confidence, and per-category scores.
- **Recycling guide:** Category-specific disposal instructions and practical tips.
- **Scan history:** Local browser storage, individual deletion, and clear-history action.
- **Analytics:** Total scans, category distribution, and average model confidence.
- **Responsive UI:** Desktop sidebar and mobile navigation.
- **Uncertainty notices:** The interface reminds users that AI classifications are not independently verified.

## Technology stack

| Layer | Technologies |
| --- | --- |
| Frontend | React, TypeScript, Vite, Tailwind CSS, Motion, Lucide icons |
| Backend | Python 3.12, FastAPI, Uvicorn |
| Machine learning | PyTorch, TorchVision, ResNet18 |
| Model checkpoint | `tonghahaha/trashnet-resnet18` on Hugging Face |
| Storage | Browser `localStorage` for scan history |
| Version control | Git and GitHub |

## Project structure

```text
Eco-visionAI/
├── backend/
│   ├── app/
│   │   ├── main.py              # API routes and app startup
│   │   ├── model.py             # ResNet18 loading and inference
│   │   └── recommendations.py   # Recycling guidance
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/         # Upload, prediction, history, guide, navigation
│   │   ├── services/api.ts     # API client
│   │   ├── utils/scanHistory.ts # Browser history helpers
│   │   └── App.tsx
│   ├── .env.example
│   └── package.json
└── README.md
```

## Requirements

- Python **3.12** (tested with 3.12.16)
- Node.js and npm compatible with the installed Vite version
- Internet access for initial installation and model checkpoint download
- Sufficient memory to load PyTorch and ResNet18

## Run locally

### 1. Clone the repository

```bash
git clone https://github.com/AashrithG-tech/EcoVision-AI.git
cd EcoVision-AI
```

### 2. Start the backend

```bash
cd backend
python3.12 -m venv .venv
source .venv/bin/activate  # macOS/Linux
python -m pip install -r requirements.txt
python -m uvicorn app.main:app --reload
```

On Windows, activate the environment using `.venv\Scripts\activate`.

Backend: `http://127.0.0.1:8000`  
API documentation: `http://127.0.0.1:8000/docs`  
Health check: `http://127.0.0.1:8000/health`

The first launch may download the model checkpoint from Hugging Face. Wait for startup to complete.

### 3. Start the frontend (new terminal)

```bash
cd frontend
npm install
npm run dev
```

Open the URL printed by Vite, typically `http://localhost:5173`.

The frontend uses `VITE_API_BASE_URL` when set and otherwise defaults to `http://127.0.0.1:8000`. To override it, create `frontend/.env.local`:

```dotenv
VITE_API_BASE_URL=http://127.0.0.1:8000
```

Restart the frontend development server after changing environment variables.

## API overview

| Method | Endpoint | Purpose |
| --- | --- | --- |
| GET | `/health` | Backend and model health status |
| POST | `/predict` | Upload image in multipart form field `file` and receive classification and guidance |
| GET | `/recycling-guide` | Retrieve recycling instructions for all six categories |

### Example prediction request

```bash
curl -X POST http://127.0.0.1:8000/predict \
  -F "file=@sample.jpg"
```

The response includes the predicted `category`, `confidence`, all class `predictions`, an `uncertain` flag, and a `recommendation` object.

## Machine-learning approach

EcoVision AI uses a six-class ResNet18 checkpoint trained for TrashNet-style categories. Images are resized to **224 × 224**, converted to tensors, and passed through the network. Softmax outputs are displayed as model confidence scores. The deployed local implementation does **not** apply ImageNet normalization because the selected checkpoint's preprocessing differs from the standard ImageNet pipeline.

**Important:** A high confidence score is not a guarantee that the prediction is correct.

## Evaluation and limitations

In a small, informal evaluation of **12 real-world photographs**, **8 were classified correctly (66.7%)**. This is a limited, non-representative sample, **not** a validated general accuracy estimate. Plastic items were particularly challenging in these tests, and some incorrect predictions were highly confident.

| Category | Correct / tested |
| --- | ---: |
| Cardboard | 2 / 2 |
| Glass | 1 / 2 |
| Metal | 2 / 2 |
| Paper | 1 / 2 |
| Plastic | 0 / 2 |
| Trash | 2 / 2 |
| **Total** | **8 / 12** |

Other limitations:

- Model trained on a limited category set; composite or unusual waste may be misclassified.
- Scan history is saved only in the current browser's local storage, not a shared database.
- Recycling rules vary by location; guidance should be checked against local regulations.
- Production hosting may require more than **512 MB RAM**. A Render deployment attempt exceeded that memory limit during model startup; local execution works.

## Future improvements

- Evaluate on a larger, labeled, real-world dataset.
- Fine-tune with diverse plastic, glass, and paper examples.
- Improve uncertainty calibration and add a manual correction flow.
- Add location-aware recycling rules and optional persistent user accounts.
- Optimize inference for low-memory deployment (for example, ONNX Runtime).

## Demonstration checklist

1. Start the FastAPI backend and verify `/health` reports `model_loaded: true`.
2. Start the Vite frontend.
3. Upload a pre-tested cardboard, glass, or metal image.
4. Show category scores and recycling guidance.
5. Open the recycling guide and scan history.
6. Explain that results are predictions, not guaranteed material identification.

## Repository

https://github.com/AashrithG-tech/EcoVision-AI

## Disclaimer

This project is an educational prototype. Predictions and recycling suggestions should be verified before making real-world disposal decisions.
