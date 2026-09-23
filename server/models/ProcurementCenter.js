const mongoose = require('mongoose');

const slotSchema = new mongoose.Schema({
  slotId: { type: String, required: true },
  timeWindow: { type: String, required: true },
  maxCapacity: { type: Number, default: 20 },
  bookedCount: { type: Number, default: 0 }
});

const procurementCenterSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  district: { type: String, required: true },
  state: { type: String, required: true },
  distanceKm: { type: Number, default: 5.0 },
  dailyCapacityQtl: { type: Number, default: 3000 },
  activeWeighbridges: { type: Number, default: 2 },
  totalWeighbridges: { type: Number, default: 2 },
  avgProcessingTimeMinutes: { type: Number, default: 7 },
  isBufferDepot: { type: Boolean, default: false },
  slots: [slotSchema],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ProcurementCenter', procurementCenterSchema);
