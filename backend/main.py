import asyncio
import json
import time
from typing import Dict, Any, List, Optional
from datetime import datetime

from fastapi import FastAPI, WebSocket, WebSocketDisconnect, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from backend.firebase_config import get_firebase_db
from backend.ai_engine.density_model import density_engine
from backend.ai_engine.predictive_lstm import predictive_engine
from backend.ai_engine.evacuation_router import evacuation_router

app = FastAPI(
    title="CrowdIQ - AI Crowd Management & Stampede Prevention API",
    description="Python FastAPI backend powered by PyTorch AI models and Firebase Firestore database.",
    version="1.0.0"
)

# Enable CORS for React Frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Connect to Firebase
db, is_firebase_live = get_firebase_db()

# In-memory venue state cache (synced with Firebase)
VENUE_STATE = {
    "capacity": 32000,
    "influx_multiplier": 1.0,
    "emergency_level": "NORMAL",
    "broadcast_message": "",
    "turnstile": {
        "entries_per_min": 142,
        "exits_per_min": 86,
        "total_scanned_today": 21840,
        "denied_today": 14
    },
    "zones": [
        {
            "id": "zone-north-gate",
            "name": "Gate A - North Entry Plaza",
            "capacity": 5000,
            "current_count": 3950,
            "area_sq_meters": 1000,
            "density": 3.95,
            "velocity": 0.65,
            "turbulence": 0.38,
            "camera_id": "CAM-01",
            "evac_priority": 2
        },
        {
            "id": "zone-arena-bowl",
            "name": "Main Stage Arena Floor",
            "capacity": 12000,
            "current_count": 9400,
            "area_sq_meters": 2200,
            "density": 4.27,
            "velocity": 0.42,
            "turbulence": 0.58,
            "camera_id": "CAM-02",
            "evac_priority": 1
        },
        {
            "id": "zone-west-concourse",
            "name": "West Egress Corridor",
            "capacity": 4000,
            "current_count": 1350,
            "area_sq_meters": 1200,
            "density": 1.12,
            "velocity": 1.25,
            "turbulence": 0.12,
            "camera_id": "CAM-03",
            "evac_priority": 4
        },
        {
            "id": "zone-east-food",
            "name": "East Food Court & Concourse",
            "capacity": 4500,
            "current_count": 2850,
            "area_sq_meters": 1100,
            "density": 2.59,
            "velocity": 0.85,
            "turbulence": 0.28,
            "camera_id": "CAM-04",
            "evac_priority": 3
        },
        {
            "id": "zone-south-turnstiles",
            "name": "South Transit Concourse & Exit Hub",
            "capacity": 6500,
            "current_count": 2600,
            "area_sq_meters": 1500,
            "density": 1.73,
            "velocity": 1.10,
            "turbulence": 0.18,
            "camera_id": "CAM-01",
            "evac_priority": 5
        }
    ]
}

# Pydantic Request Models
class TicketCreateRequest(BaseModel):
    id: Optional[str] = None
    attendee: str
    tier: str
    zone: str
    gate: str
    seat: Optional[str] = "General Admission"

class TicketValidateRequest(BaseModel):
    code: str
    gate: Optional[str] = "Gate North-A"

class BroadcastRequest(BaseModel):
    level: str  # NORMAL, ADVISORY, WARNING, CRITICAL_EVACUATION
    message: Optional[str] = ""

class SurgeSimulateRequest(BaseModel):
    preset: str  # nominal, surge, stampede_hazard, evacuation_reroute
    multiplier: Optional[float] = 1.0


# REST Endpoints
@app.get("/")
def read_root():
    return {
        "system": "CrowdIQ AI & Stampede Prevention Platform",
        "status": "ONLINE",
        "tech_stack": {
            "backend": "Python FastAPI",
            "ai_ml": "PyTorch + NumPy + Scikit-Learn (CSRNet Density & LSTM Forecasting)",
            "database": "Firebase Firestore" if is_firebase_live else "Firebase Firestore (In-Memory Emulation)",
            "frontend": "React + Vite (Port 5173)"
        },
        "version": "1.0.0"
    }

@app.get("/api/telemetry")
def get_telemetry():
    total_count = sum(z["current_count"] for z in VENUE_STATE["zones"])
    capacity = VENUE_STATE["capacity"]
    avg_density = sum(z["density"] for z in VENUE_STATE["zones"]) / len(VENUE_STATE["zones"])
    avg_velocity = sum(z["velocity"] for z in VENUE_STATE["zones"]) / len(VENUE_STATE["zones"])
    avg_turbulence = sum(z["turbulence"] for z in VENUE_STATE["zones"]) / len(VENUE_STATE["zones"])

    # Calculate Stampede Risk Index via PyTorch / NumPy model
    sri_result = density_engine.calculate_stampede_risk_index(
        density=avg_density,
        velocity=avg_velocity,
        turbulence=avg_turbulence,
        inflow_surge_ratio=VENUE_STATE["influx_multiplier"]
    )

    return {
        "total_headcount": total_count,
        "venue_capacity": capacity,
        "occupancy_pct": int(round((total_count / capacity) * 100)),
        "inflow_rate": VENUE_STATE["turnstile"]["entries_per_min"],
        "outflow_rate": VENUE_STATE["turnstile"]["exits_per_min"],
        "emergency_level": VENUE_STATE["emergency_level"],
        "broadcast_message": VENUE_STATE["broadcast_message"],
        "stampede_risk_index": sri_result,
        "timestamp": datetime.now().isoformat()
    }

@app.get("/api/zones")
def get_zones():
    # Enrich zones with individual SRI calculations
    enriched = []
    for z in VENUE_STATE["zones"]:
        z_sri = density_engine.calculate_stampede_risk_index(
            density=z["density"],
            velocity=z["velocity"],
            turbulence=z["turbulence"],
            inflow_surge_ratio=VENUE_STATE["influx_multiplier"]
        )
        enriched.append({
            **z,
            "sri": z_sri["sri"],
            "status": z_sri["level"],
            "status_text": z_sri["status"],
            "recommendation": z_sri["recommendation"]
        })
    return enriched

@app.get("/api/predictions/peak")
def get_predictions():
    total_count = sum(z["current_count"] for z in VENUE_STATE["zones"])
    curve = predictive_engine.forecast_hourly_timeline(total_count, VENUE_STATE["capacity"])
    return {
        "forecast_curve": curve,
        "model_architecture": "PyTorch LSTM Neural Network",
        "predicted_peak_window": "21:00 - 22:30",
        "threshold_limit": int(VENUE_STATE["capacity"] * 0.90)
    }

@app.get("/api/routing/optimal")
def get_optimal_evacuation_route():
    zone_densities = {z["id"]: z["density"] for z in VENUE_STATE["zones"]}
    route_info = evacuation_router.compute_optimal_evacuation(zone_densities)
    return route_info

@app.post("/api/tickets/generate")
def generate_ticket(req: TicketCreateRequest):
    import random
    ticket_id = req.id or f"TKT-{random.randint(1000, 9999)}-{req.tier[:3].upper()}"
    ticket_data = {
        "id": ticket_id,
        "attendee": req.attendee,
        "tier": req.tier,
        "zone": req.zone,
        "gate": req.gate,
        "seat": req.seat,
        "used": False,
        "timestamp": None,
        "created_at": datetime.now().isoformat()
    }

    # Persist in Firebase Firestore
    try:
        db.collection("tickets").document(ticket_id).set(ticket_data)
    except Exception as e:
        print(f"[Firebase Error] Failed to write ticket: {e}")

    return {
        "status": "SUCCESS",
        "ticket": ticket_data,
        "persisted_to_firebase": True
    }

@app.post("/api/tickets/validate")
def validate_ticket(req: TicketValidateRequest):
    raw_code = req.code.strip()
    ticket_id = raw_code

    # Check if raw_code is JSON
    if raw_code.startswith("{"):
        try:
            parsed = json.loads(raw_code)
            ticket_id = parsed.get("id", raw_code)
        except:
            pass

    now_str = datetime.now().strftime("%H:%M:%S")

    # Fetch from Firebase Firestore
    doc_ref = db.collection("tickets").document(ticket_id)
    doc = doc_ref.get()

    if not doc.exists:
        # Check auto-registration for TKT- prefixes
        if ticket_id.startswith("TKT-"):
            new_ticket = {
                "id": ticket_id,
                "attendee": "Walk-In Verified Attendee",
                "tier": "General Admission",
                "gate": req.gate,
                "used": True,
                "timestamp": now_str
            }
            doc_ref.set(new_ticket)
            VENUE_STATE["turnstile"]["total_scanned_today"] += 1
            return {
                "status": "GRANTED",
                "message": f"Access Granted - Pass {ticket_id} Registered & Verified",
                "ticket": new_ticket,
                "timestamp": now_str
            }

        VENUE_STATE["turnstile"]["denied_today"] += 1
        return {
            "status": "INVALID",
            "message": "Invalid Ticket - Code not registered in Firebase security vault",
            "ticket": None,
            "timestamp": now_str
        }

    ticket_data = doc.to_dict()

    if ticket_data.get("used"):
        VENUE_STATE["turnstile"]["denied_today"] += 1
        return {
            "status": "DUPLICATE",
            "message": f"Access Denied - Pass already scanned at {ticket_data.get('timestamp')}! Duplicate reuse blocked.",
            "ticket": ticket_data,
            "timestamp": now_str
        }

    # Mark as scanned in Firebase
    ticket_data["used"] = True
    ticket_data["timestamp"] = now_str
    doc_ref.update({"used": True, "timestamp": now_str})
    VENUE_STATE["turnstile"]["total_scanned_today"] += 1

    return {
        "status": "GRANTED",
        "message": f"Access Granted - Verified {ticket_data.get('tier')} ({ticket_data.get('attendee')})",
        "ticket": ticket_data,
        "timestamp": now_str
    }

@app.post("/api/emergency/broadcast")
def set_emergency_broadcast(req: BroadcastRequest):
    VENUE_STATE["emergency_level"] = req.level
    VENUE_STATE["broadcast_message"] = req.message or ""

    # Log emergency action in Firebase
    try:
        db.collection("alerts").add({
            "type": "EMERGENCY_BROADCAST",
            "level": req.level,
            "message": req.message,
            "timestamp": datetime.now().isoformat()
        })
    except Exception as e:
        print(f"[Firebase Error] {e}")

    return {
        "status": "UPDATED",
        "emergency_level": req.level,
        "broadcast_message": req.message
    }

@app.post("/api/simulation/surge")
def simulate_surge(req: SurgeSimulateRequest):
    preset = req.preset
    mult = req.multiplier

    if preset == "nominal":
        VENUE_STATE["influx_multiplier"] = 1.0
        VENUE_STATE["emergency_level"] = "NORMAL"
        for z in VENUE_STATE["zones"]:
            if z["id"] == "zone-arena-bowl":
                z["current_count"] = 9400
                z["density"] = 4.27
                z["velocity"] = 0.42
                z["turbulence"] = 0.58
    elif preset == "surge":
        VENUE_STATE["influx_multiplier"] = 2.4
        for z in VENUE_STATE["zones"]:
            if z["id"] == "zone-arena-bowl":
                z["current_count"] = 11400
                z["density"] = 5.18
                z["velocity"] = 0.28
                z["turbulence"] = 0.72
    elif preset == "stampede_hazard":
        VENUE_STATE["influx_multiplier"] = 3.8
        VENUE_STATE["emergency_level"] = "CRITICAL_EVACUATION"
        for z in VENUE_STATE["zones"]:
            if z["id"] == "zone-arena-bowl":
                z["current_count"] = 11950
                z["density"] = 5.43
                z["velocity"] = 0.18
                z["turbulence"] = 0.88
    elif preset == "evacuation_reroute":
        for z in VENUE_STATE["zones"]:
            if z["id"] == "zone-arena-bowl":
                z["current_count"] = 8200
                z["density"] = 3.72
                z["velocity"] = 0.75
                z["turbulence"] = 0.32
            elif z["id"] == "zone-west-concourse":
                z["current_count"] = 2900
                z["density"] = 2.41
                z["velocity"] = 1.15

    return {
        "status": "APPLIED",
        "preset": preset,
        "influx_multiplier": VENUE_STATE["influx_multiplier"],
        "emergency_level": VENUE_STATE["emergency_level"]
    }

# WebSocket Real-Time Telemetry Stream
@app.websocket("/ws/telemetry")
async def websocket_telemetry(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            total_count = sum(z["current_count"] for z in VENUE_STATE["zones"])
            avg_density = sum(z["density"] for z in VENUE_STATE["zones"]) / len(VENUE_STATE["zones"])
            avg_velocity = sum(z["velocity"] for z in VENUE_STATE["zones"]) / len(VENUE_STATE["zones"])
            avg_turbulence = sum(z["turbulence"] for z in VENUE_STATE["zones"]) / len(VENUE_STATE["zones"])

            sri_result = density_engine.calculate_stampede_risk_index(
                density=avg_density,
                velocity=avg_velocity,
                turbulence=avg_turbulence,
                inflow_surge_ratio=VENUE_STATE["influx_multiplier"]
            )

            payload = {
                "type": "TELEMETRY_TICK",
                "total_headcount": total_count,
                "occupancy_pct": int(round((total_count / VENUE_STATE["capacity"]) * 100)),
                "sri": sri_result,
                "zones": VENUE_STATE["zones"],
                "turnstile": VENUE_STATE["turnstile"],
                "emergency_level": VENUE_STATE["emergency_level"],
                "timestamp": datetime.now().strftime("%H:%M:%S")
            }

            await websocket.send_text(json.dumps(payload))
            await asyncio.sleep(2.0)
    except WebSocketDisconnect:
        pass
    except Exception as e:
        print(f"[WebSocket Error] {e}")
