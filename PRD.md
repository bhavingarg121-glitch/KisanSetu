# PRODUCT REQUIREMENTS DOCUMENT (PRD)

## Project Name
**CrowdIQ**

### Product Title
**CrowdIQ: AI-Powered Crowd Management and Safety System**

### Document Type
Product Requirements Document (PRD)

---

# 1. Product Overview

CrowdIQ is a smart crowd management platform designed to help authorities, event organizers and security personnel monitor and manage crowds in real time.

The system provides information about crowd density, zone capacity, entry and exit movement, active alerts and predicted crowd conditions. It aims to help authorities identify potentially dangerous overcrowding situations early and take preventive action.

The platform can be used for festivals, stadiums, railway stations, exhibitions, college events, public gatherings and other high-footfall locations.

---

# 2. Problem Statement

Large gatherings can experience sudden increases in crowd density. Manual monitoring makes it difficult to continuously observe multiple locations and identify dangerous crowd conditions early.

Existing manual methods may result in:

* Delayed detection of overcrowding.
* Poor visibility of crowd distribution.
* Difficulty in managing multiple entry and exit points.
* Long queues and congestion.
* Delayed communication during emergencies.
* Difficulty predicting future crowd conditions.

CrowdIQ aims to provide a centralized system that gives authorities real-time information and actionable recommendations.

---

# 3. Product Goal

The primary goal of CrowdIQ is:

> **To monitor crowd conditions in real time, identify potential overcrowding, predict crowd growth and help authorities take timely safety actions.**

---

# 4. Target Users

## Primary Users

### 1. Event Organizers
Use the system to monitor crowd conditions and manage event zones.

### 2. Security Personnel
Use the dashboard to identify crowded areas and respond to alerts.

### 3. Administrators
Manage users, events, zones, capacity limits and system settings.

## Secondary Users

### 4. Visitors
View crowd conditions, recommended gates/routes and emergency announcements.

---

# 5. User Personas

### Persona 1 — Event Administrator
**Goal:** Keep the event safe and manage crowd movement.

**Needs:**
* Overall crowd overview.
* Zone-wise crowd information.
* Alerts.
* Reports.
* Crowd prediction.

### Persona 2 — Security Staff
**Goal:** Quickly identify where intervention is required.

**Needs:**
* Live alerts.
* Critical zones.
* Gate status.
* Recommended actions.

### Persona 3 — Visitor
**Goal:** Avoid crowded areas and reach the destination safely.

**Needs:**
* Crowd status.
* Less crowded gate.
* Recommended route.
* Emergency announcements.

---

# 6. Core Product Features

## Feature 1 — User Authentication
Users can log into the system.

**Requirements:**
* Login.
* Logout.
* Role-based access.
* Admin/security/visitor roles.

---

## Feature 2 — Event Management
Admin can create and manage events.

**Requirements:**
* Create event.
* Event name.
* Date and time.
* Location.
* Number of zones.
* Event status.

---

## Feature 3 — Zone Management
Admin can define different zones within an event location.

**Requirements:**
* Add zone.
* Edit zone.
* Delete zone.
* Set maximum capacity.
* Set warning threshold.
* Set critical threshold.

Example:

**Zone A**
* Capacity → 1000
* Warning → 750
* Critical → 900

---

# 7. Crowd Monitoring

The system displays the current crowd level of every zone.

Example:

```text
Zone A → 500 / 1000 → SAFE 🟢

Zone B → 800 / 1000 → MODERATE 🟡

Zone C → 950 / 1000 → CRITICAL 🔴
```

**Requirements:**
* Current crowd count.
* Maximum capacity.
* Occupancy percentage.
* Crowd status.
* Last updated time.

---

# 8. Crowd Density Visualization

The dashboard visually represents crowd density.

### Status Tiers:
* 🟢 **Safe:** Within standard fluid movement limits (< 2.0 p/m²).
* 🟡 **Moderate:** Approaching cautionary density (2.0 – 3.9 p/m²).
* 🔴 **Critical:** Hazardously crowded (≥ 4.0 p/m²).

The system uses an interactive spatial canvas map and zone layout to make crowded areas easy to identify at a glance.

---

# 9. Entry and Exit Tracking

The system tracks people entering and leaving zones.

### Formula:
$$\text{Current Crowd} = \text{Previous Crowd} + \text{Entries} - \text{Exits}$$

Example:
* Previous crowd = 500
* Entries = 100
* Exits = 50
* Current crowd = **550**

---

# 10. Real-Time Alert System

The system automatically generates alerts when crowd density reaches predefined thresholds.

Example:
> 🚨 **CRITICAL ALERT**  
> Zone B has reached 92% capacity.

Alert levels:
* Information
* Warning
* Critical
* Emergency

Security personnel can view, acknowledge, and dispatch teams to active alerts.

---

# 11. Crowd Prediction

CrowdIQ uses historical crowd telemetry and time-series AI to predict future crowd surges.

Example:
```text
Current Crowd: 780
Predicted Crowd in 30 min: 940
Risk: HIGH
```

The prediction system considers:
* Current crowd count.
* Historical crowd influx.
* Entry rate (`pax/min`).
* Exit rate (`pax/min`).
* Time of day.
* Event schedule milestones.

---

# 12. Smart Route Recommendation

If a particular zone or gate becomes overcrowded, the system recommends an alternative.

Example:
```text
Gate A → 🔴 High Crowd (18 min wait)
Gate B → 🟡 Moderate (8 min wait)
Gate C → 🟢 Low Crowd (<3 min wait)

Recommended → Gate C
```

The objective is to distribute crowd density evenly across all egress corridors.

---

# 13. Visitor Interface

Visitors have a simplified, mobile-first companion interface.

Visitors can view:
* Current venue crowd status.
* Gate crowd levels.
* Recommended entrance.
* Recommended exit / safe route.
* Emergency announcements.
* Important safety information.

*Note:* The visitor interface does not expose sensitive administrative or security controls.

---

# 14. Emergency Management

Administrators can issue emergency announcements and trigger safety protocols.

Example:
> 🚨 **Emergency at Gate A. Please move calmly towards Gate C.**

The system displays:
* Emergency message marquee.
* Safe exits.
* Emergency route directions.
* Medical assistance points.
* Synthesized PA voice instructions & klaxon siren.

---

# 15. Analytics Dashboard

Administrators can view historical and live crowd intelligence.

### Analytics include:
* Total visitors today.
* Peak crowd count.
* Peak time window.
* Most crowded zone.
* Average occupancy percentage.
* Number of generated alerts.
* Entry/exit velocity trends.
* Time-series crowd curve graphs.

---

# 16. AI/ML Requirements

The AI component must:
1. Receive historical and real-time crowd telemetry.
2. Identify crowd movement patterns and turbulence.
3. Estimate future crowd density curves.
4. Identify potential overcrowding bottlenecks.
5. Generate a normalized risk level (Stampede Risk Index).

Example:
```text
Zone: Main Gate
Current Crowd: 1,200
Capacity: 1,500
Predicted Crowd: 1,450 in 20 minutes
Risk Level: HIGH
```

---

# 17. Optional IoT Integration

The system supports integration with physical hardware sensors:
* ESP32 microcontrollers.
* IR beam-break sensors.
* Ultrasonic distance counters.

### Data Flow:
$$\text{Person} \longrightarrow \text{Sensor} \longrightarrow \text{ESP32} \longrightarrow \text{FastAPI Backend} \longrightarrow \text{Database} \longrightarrow \text{CrowdIQ Dashboard}$$

*IoT integration is supported as an extensible module; the core software functions with simulated or computer-vision camera inputs.*

---

# 18. Functional Requirements

The system must:
* Allow users to log in with role-based authentication.
* Support Admin, Security Staff, Venue Director, and Visitor roles.
* Allow admins to create and manage events.
* Allow admins to create, edit, and delete zones.
* Store and enforce zone capacity limits.
* Record live crowd counts.
* Track directional entry and exit velocities.
* Display real-time crowd density on interactive heatmaps.
* Generate automated overcrowding alerts.
* Store historical telemetry data.
* Display analytics dashboards and reports.
* Provide predictive crowd forecasts.
* Recommend alternative safe routes and gates.
* Display emergency announcements and acoustic sirens.

---

# 19. Non-Functional Requirements

### Performance
Dashboard data must update with minimal delay ($< 50\text{ ms}$ latency via WebSockets).

### Usability
The interface must be intuitive for security personnel to operate under high-stress conditions.

### Security
Only authorized users may access administrative features; pass validation must prevent duplicate reuse.

### Scalability
The platform must support multiple venues, events, and spatial sectors simultaneously.

### Reliability
Crowd records, turnstile scans, and alerts must be stored reliably with local offline emulation support.

### Responsiveness
The interface must render seamlessly across desktop, tablet, and mobile displays.

---

# 20. Technology Requirements

* **Frontend:** React 19 / HTML, CSS and JavaScript + Vite
* **Backend:** Python FastAPI & Uvicorn ASGI server
* **Database:** Supabase PostgreSQL / Firebase Firestore
* **AI/ML:** Python, PyTorch, Pandas, NumPy and Scikit-learn
* **Optional Hardware:** ESP32 + IR / ultrasonic sensors
* **Development:** VS Code + Git + GitHub (`sanchitamoundekar13/CrowdIQ`)

---

# 21. MVP — Minimum Viable Product

The first working version contains the core essential features:
* ✅ User login & role switcher
* ✅ Admin command dashboard
* ✅ Zone management & threshold configuration
* ✅ Live crowd count & occupancy percentage
* ✅ Green / Yellow / Red density status
* ✅ Real-time alert generation & acknowledgment
* ✅ Entry / exit turnstile tracking
* ✅ Basic analytics & historical trends

*For the MVP, crowd data is simulated realistically through the interactive Chaos Sandbox.*

---

# 22. Phase 2 Features (Current)

* ✅ PyTorch LSTM crowd prediction.
* ✅ Dijkstra dynamic smart route recommendation.
* ✅ Mobile visitor companion interface.
* ✅ Multi-channel emergency notifications (Siren + Speech PA).
* ✅ Advanced telemetry analytics.

---

# 23. Phase 3 Features (Advanced)

* ESP32 physical sensor integration.
* Automatic CCTV camera people counting with YOLO.
* Drone aerial monitoring.
* Native iOS/Android mobile apps.
* Smart-city municipal traffic integration.

---

# 24. Success Criteria

The project is considered successful if:
1. Admin can log into the system with role-based access.
2. Admin can create and manage zones and capacity limits.
3. Live crowd count can be accurately tracked.
4. Dashboard correctly displays Green / Yellow / Red crowd status.
5. System automatically generates alerts when thresholds are crossed.
6. Entry and exit rates correctly update net crowd counts.
7. Historical data is rendered through analytics charts.
8. AI module provides predictive crowd surge curves.
9. Users and visitors can identify less crowded routes.
10. The system provides actionable intelligence for crowd safety decisions.

---

# 25. User Flows

### Admin Flow
```text
Login
  ↓
Dashboard
  ↓
Create Event / Zones
  ↓
Set Capacity & Thresholds
  ↓
Monitor Real-Time Crowd
  ↓
Receive Alert
  ↓
Analyse Situation via CCTV / Heatmap
  ↓
Dispatch Security / Trigger Emergency Reroute
```

### Visitor Flow
```text
Open CrowdIQ Companion
      ↓
View Live Crowd Status
      ↓
Check Gate Queue Levels
      ↓
Get Recommended Safe Route
      ↓
Reach Destination Safely
```

---

# 26. Product Limitations
* The software prototype uses synthetic and simulated camera telemetry for initial demonstration without requiring physical hardware deployment.
* AI forecast accuracy depends on the availability of historical crowd telemetry.
* The system provides actionable recommendations to personnel but does not physically lock emergency doors in the software prototype.

---

# 27. Future Scope
* CCTV edge neural inferencing with YOLOv11 on embedded devices.
* Aerial drone swarm surveillance.
* GPS-guided safe evacuation wayfinding for attendees.
* Integration with emergency medical services (EMS) and municipal police radio.

---

# 28. Final Product Vision

CrowdIQ moves crowd management from **reactive policing to proactive crowd safety**:

$$\textbf{Monitor} \longrightarrow \textbf{Detect} \longrightarrow \textbf{Predict} \longrightarrow \textbf{Alert} \longrightarrow \textbf{Recommend} \longrightarrow \textbf{Act}$$
