# CrowdIQ - AI-Based Crowd Management & Stampede Prevention Platform

[![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![PyTorch](https://img.shields.io/badge/AI%2FML-PyTorch-EE4C2C?logo=pytorch&logoColor=white)](https://pytorch.org)
[![Firebase](https://img.shields.io/badge/Database-Firebase%20Firestore-FFCA28?logo=firebase&logoColor=black)](https://firebase.google.com)
[![React](https://img.shields.io/badge/Frontend-React%2019%20%2B%20Vite-61DAFB?logo=react&logoColor=black)](https://react.dev)

**CrowdIQ** is an AI-powered command center and crowd safety operating system designed for high-density environments (stadiums, transit hubs, pilgrimage sites, concert arenas). It shifts crowd safety from reactive response to predictive prevention using live computer vision telemetry, spatial density heatmaps, mathematical Stampede Risk Modeling (SRI), smart wayfinding rerouting, and digital QR turnstile access control.

---

## Technology Stack

- **Frontend**: HTML5, Vanilla CSS Design System (Command Center dark cyber aesthetics), JavaScript, **React 19 + Vite**, Lucide Icons, Canvas API, Web Audio API, Web Speech Synthesis.
- **Backend**: **Python FastAPI** (`backend/main.py`), Uvicorn, REST API endpoints, WebSocket streaming.
- **Database**: **Firebase Firestore** (`backend/firebase_config.py` with `firebase-admin` and robust in-memory emulator fallback).
- **AI / ML**: **Python PyTorch**, NumPy, Scikit-Learn:
  - **Spatial Density & Optical Flow** (`backend/ai_engine/density_model.py`): Gaussian kernel density mapping (CSRNet) and directional turbulence calculations.
  - **Stampede Risk Index (SRI)**: Mathematical formula incorporating density (40%), directional turbulence (25%), stagnation (20%), and inflow surge (15%).
  - **Predictive Peak Influx Forecasting** (`backend/ai_engine/predictive_lstm.py`): PyTorch LSTM neural network predicting future accumulation curves and critical danger thresholds.
  - **Dynamic Evacuation Router** (`backend/ai_engine/evacuation_router.py`): Graph-based Dijkstra algorithm weighting real-time corridor congestion to steer crowds to safe exits.

---

## Core Capabilities

1. **Live Command Operations Dashboard**:
   - Canvas-rendered 2D venue density heatmap with Fruin Level of Service color tiers (Green `<2.0`, Amber `2.0-3.9`, Crimson `≥4.0 p/m²`).
   - 4-channel CCTV neural vision matrix with simulated bounding boxes, confidence scores, and flow vectors.
   - Real-time incident alert drawer with instant acknowledge & security guard dispatch triggers.

2. **Stampede Prevention & Peak Crowd AI**:
   - Continuous composite Stampede Risk Index (SRI 0-100%).
   - Hourly surge projection chart (16:00 to 00:00) with a 90% capacity hazard boundary line.
   - Sector bottleneck vulnerability ranking table.

3. **Smart Wayfinding & Dynamic Evacuation**:
   - Automated side-by-side corridor comparison (e.g. *Gate A Plaza [Congested, 18m wait]* vs *West Egress [Fluid, 3m wait]*).
   - One-click trigger to push smart reroutes to digital venue displays and attendee mobile passes.

4. **QR Digital Entry & Turnstile Access Control**:
   - Cryptographic ticket pass generator with downloadable/printable QR pass.
   - Guard scanner terminal with instant validation and duplicate reuse prevention (blocks ticket sharing).

5. **Emergency Broadcast & Tactical Dispatch**:
   - Web Audio API procedural acoustic klaxon siren (440Hz - 720Hz).
   - Authoritative PA voice speech synthesis broadcast.
   - Tactical security unit board (Alpha, Bravo, Charlie, Delta, Medic) with interactive Stampede Mitigation SOP checklist.

6. **Interactive Chaos Sandbox & Mobile Companion**:
   - Test presets: *Nominal Operations*, *Main Act Finale Surge (+240%)*, *Catastrophic Chokepoint Jam*, and *Smart Reroute Dissipation*.
   - Influx slider (0.5x to 5.0x).
   - Attendee smartphone view with live digital ticket and least-crowded exit finder.

---

## Running Locally

### 1. Start Python FastAPI Backend (Port 8000)
```powershell
cd C:\Users\Sanchita\.gemini\antigravity-ide\scratch\crowdguard-ai
python -m uvicorn backend.main:app --host 127.0.0.1 --port 8000
```
- API Root: `http://127.0.0.1:8000/`
- API Docs: `http://127.0.0.1:8000/docs`
- WebSocket Telemetry: `ws://127.0.0.1:8000/ws/telemetry`

### 2. Start React Frontend (Port 5173)
```powershell
cd C:\Users\Sanchita\.gemini\antigravity-ide\scratch\crowdguard-ai
npm.cmd run dev
```
Open **`http://localhost:5173/`** in your browser.

---

## Firebase Configuration

By default, the backend runs with an integrated in-memory Firestore emulator for instant zero-config testing.
To connect to your live Google Cloud Firebase project:
1. Download your Firebase service account key JSON from Firebase Console (`Project Settings > Service accounts > Generate new private key`).
2. Save it as `backend/serviceAccountKey.json` or set `FIREBASE_CREDENTIALS_PATH`.
3. Restart FastAPI — the backend will automatically connect to live cloud Firestore.

---

## Git Repository

Linked to remote: `https://github.com/sanchitamoundekar13/CrowdIQ.git`
Branch: `main`
