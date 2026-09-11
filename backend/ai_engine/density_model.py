import numpy as np
import torch
from typing import Dict, Any, List

class CrowdDensityModel:
    """
    AI Computer Vision & Density Estimation Engine
    Uses tensor-based spatial distribution and Fruin's Level of Service model
    to compute localized crowd density maps and Stampede Risk Index (SRI).
    """

    def __init__(self):
        # Determine device (CPU or CUDA if GPU available)
        self.device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')

    def generate_density_heatmap(self, width: int = 64, height: int = 40, centers: List[tuple] = None) -> np.ndarray:
        """
        Generate a 2D density heatmap using PyTorch Gaussian kernels (CSRNet inspired)
        """
        if centers is None:
            # Default density hot-spots: Gate A (x=16, y=8), Arena (x=32, y=20), East Food (x=52, y=21)
            centers = [(16, 8, 3.8), (32, 20, 4.3), (12, 23, 1.1), (52, 21, 2.6), (32, 34, 1.7)]

        x = torch.arange(0, width, dtype=torch.float32, device=self.device)
        y = torch.arange(0, height, dtype=torch.float32, device=self.device)
        grid_y, grid_x = torch.meshgrid(y, x, indexing='ij')

        heatmap = torch.zeros((height, width), dtype=torch.float32, device=self.device)
        sigma = 5.0

        for cx, cy, intensity in centers:
            dist_sq = (grid_x - cx) ** 2 + (grid_y - cy) ** 2
            kernel = intensity * torch.exp(-dist_sq / (2 * (sigma ** 2)))
            heatmap += kernel

        return heatmap.cpu().numpy()

    def calculate_stampede_risk_index(
        self,
        density: float,
        velocity: float,
        turbulence: float,
        inflow_surge_ratio: float = 1.0
    ) -> Dict[str, Any]:
        """
        Calculates the mathematical Stampede Risk Index (SRI: 0 - 100)
        Weights:
          - Spatial Density (p/m²): 40%
          - Directional Turbulence: 25%
          - Flow Stagnation: 20%
          - Inflow Surge Ratio: 15%
        """
        # Density factor (0 at <= 1.0 p/m², 1.0 at >= 5.0 p/m²)
        density_score = float(np.clip((density - 1.0) / 4.0, 0.0, 1.0) * 100)

        # Stagnation factor (low velocity < 0.4 m/s under crowd load triggers shockwaves)
        stagnation_score = float(np.clip((1.2 - velocity) / 1.0, 0.0, 1.0) * 100)

        # Turbulence factor (cross-vector angular variance)
        turbulence_score = float(np.clip(turbulence, 0.0, 1.0) * 100)

        # Inflow surge ratio
        surge_score = float(np.clip((inflow_surge_ratio - 1.0) / 1.5, 0.0, 1.0) * 100)

        raw_sri = (
            0.40 * density_score +
            0.25 * turbulence_score +
            0.20 * stagnation_score +
            0.15 * surge_score
        )
        sri = int(np.clip(np.round(raw_sri), 0, 100))

        if sri >= 80:
            level = "CRITICAL"
            color = "#ef4444"
            status = "CRITICAL STAMPEDE HAZARD"
            recommendation = "IMMEDIATE PROTOCOL: Halt turnstile inflow. Deploy QRF squad. Open Emergency Egress Gate 3 & 4. Broadcast PA evacuation advisory."
        elif sri >= 60:
            level = "HIGH"
            color = "#f97316"
            status = "High Congestion / Choke Risk"
            recommendation = "Throttle turnstile metering by 50%. Activate dynamic wayfinding displays directing crowd towards West corridor."
        elif sri >= 35:
            level = "MODERATE"
            color = "#eab308"
            status = "Moderate Density Surge"
            recommendation = "Stagger escalator intake. Ensure radial corridors remain clear of stationary clusters."
        else:
            level = "LOW"
            color = "#10b981"
            status = "Nominal / Free Flow"
            recommendation = "Standard perimeter surveillance active. Flow velocity within optimal bounds."

        return {
            "sri": sri,
            "level": level,
            "color": color,
            "status": status,
            "density_score": int(density_score),
            "stagnation_score": int(stagnation_score),
            "turbulence_score": int(turbulence_score),
            "surge_score": int(surge_score),
            "recommendation": recommendation
        }

density_engine = CrowdDensityModel()
