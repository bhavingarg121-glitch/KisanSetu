# ONE PAGE REPORT (OPR)

## Project Title
**CrowdPulse: AI-Powered Crowd Management and Safety System**

---

## Introduction
**CrowdPulse** is a smart crowd management system designed to monitor, analyse and manage large gatherings in real time. The system helps authorities and event organizers identify crowded areas, monitor crowd density and receive alerts when a particular zone approaches or exceeds its safe capacity. It can also analyse previous crowd data to predict possible overcrowding and recommend safer routes or alternative entry and exit points. The system can be used in places such as festivals, railway stations, stadiums, colleges, exhibitions and other public events.

---

## Problem Statement
Managing large crowds manually can be difficult, especially during peak hours and emergency situations. Authorities may not be able to identify overcrowded areas quickly, which can lead to congestion, delays and safety risks (including crowd crushes and stampedes). Therefore, there is a critical need for an automated system that provides real-time crowd telemetry, detects high-density choke points, and helps authorities take timely preventive actions before risks escalate.

---

## Objectives
* **Real-Time Density Monitoring:** To monitor crowd density across different spatial zones continuously.
* **Risk Identification:** To pinpoint overcrowded, high-risk bottlenecks and choke points early.
* **Automated Early Warnings:** To generate instant visual and acoustic alerts when crowd capacity reaches critical thresholds.
* **Flow & Turnstile Tracking:** To monitor directional entry and exit movements in real time.
* **AI/ML Influx Prediction:** To forecast possible crowd surges using historical data, schedules, and time-series AI models.
* **Smart Dynamic Wayfinding:** To suggest alternative routes and less-crowded egress gates dynamically.
* **Centralized Operations Dashboard:** To provide security personnel and authorities with a unified command and monitoring interface.

---

## Proposed System
The proposed system consists of an **Admin/Security Command Dashboard** and an **Attendee/Visitor Mobile Interface**. Crowd information is ingested through CCTV camera feeds, IoT entry counters, or simulated high-density sensory data. The backend processes the incoming telemetry, calculates density per square meter ($p/m^2$) and the **Stampede Risk Index (SRI)**, and displays zone status dynamically as **Safe (Green)**, **Moderate (Yellow)**, or **Critical (Red)**. When a zone exceeds safe thresholds, the system automatically triggers alerts, dynamic rerouting arrows, and public address broadcasts. AI/ML models analyse historical data to predict peak crowd hours and assist authorities with preventative crowd dissipation.

---

## Key Features
* **Real-Time Crowd Monitoring:** Live headcount, net inflow/outflow velocity, and overall venue occupancy.
* **Zone-Wise Density Visualization:** Interactive 2D spatial heatmap with radial density gradients and flow vectors.
* **Entry & Exit Tracking:** Cryptographic QR digital pass issuance and security turnstile check-in validation with anti-passback defense.
* **Overcrowding & Stampede Alerts:** Multi-tier alert escalation (`LOW`, `MODERATE`, `HIGH`, `CRITICAL`).
* **AI-Based Crowd Prediction:** PyTorch neural time-series forecasting projecting future peak crowd windows.
* **Smart Route / Exit Recommendation:** Dijkstra graph-based dynamic rerouting directing attendees away from congested corridors.
* **Emergency Management & Broadcast:** Web Audio procedural emergency siren klaxon (440Hz–720Hz) and automated PA voice broadcast.
* **Admin & Security Dashboard:** Multi-role access control for Incident Commanders, Field Security Guards, Venue Executives, and Visitors.
* **Chaos Simulation Sandbox:** Interactive controls to simulate surges and stress-test automated dissipation protocols.
* **IoT & Hardware Integration (Optional):** Interfaces for ESP32 microcontrollers, ultrasonic turnstile sensors, and camera edge nodes.

---

## Technology Stack
* **Frontend:** HTML5, Vanilla CSS Design System, JavaScript, **React 19 + Vite**
* **Backend:** **Python FastAPI**, Uvicorn ASGI Server
* **Database:** **Supabase (PostgreSQL)** & **Firebase Firestore** (with zero-config in-memory emulator fallback)
* **AI / ML:** **Python PyTorch**, NumPy, Scikit-Learn (CSRNet Density Estimation, Optical Flow, and LSTM Forecaster)
* **Hardware (Optional):** ESP32, IR / Ultrasonic counters, RTSP CCTV camera streams
* **Deployment:** Cloud-based deployment / local command center edge node

---

## Target Users
* Event and concert organizers
* Police and municipal security personnel
* Stadium and sports arena management
* Religious pilgrimage and festival committees
* Railway and metro transit authorities
* University campus and exhibition administrators
* Event attendees and general public

---

## Expected Outcome
**CrowdPulse** provides a centralized, intelligent platform for monitoring and managing mass crowd movement. It empowers authorities to detect overcrowding at an early stage, receive automated alerts, and make informed dispatch and wayfinding decisions. The system significantly improves crowd flow velocity, reduces congestion bottlenecks, and prevents catastrophic stampede-like emergencies during high-density public gatherings.

---

## Conclusion
CrowdPulse combines real-time vision telemetry, spatial data analytics, AI-based predictive modeling, and modern access control to deliver a proactive, reliable approach to crowd management. The platform is adaptable for diverse public venues and scalable from single-gate auditoriums to massive multi-zone stadiums, establishing a modern standard for public safety.
