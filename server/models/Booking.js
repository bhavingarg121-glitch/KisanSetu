const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  tokenNumber: { type: String, required: true, unique: true },
  farmerName: { type: String, required: true },
  farmerMobile: { type: String, required: true },
  kisanId: { type: String, required: true },
  village: { type: String, required: true },
  district: { type: String, required: true },
  state: { type: String, default: 'Uttar Pradesh' },
  
  centerId: { type: String, required: true },
  centerName: { type: String, required: true },
  slotId: { type: String, required: true },
  slotDate: { type: String, required: true },
  slotWindow: { type: String, required: true },
  
  commodity: { type: String, required: true },
  mspRate: { type: Number, required: true },
  maxAllowedMoisture: { type: Number, default: 12.0 },
  estimatedQuantityQtl: { type: Number, required: true },
  
  vehicleType: { type: String, required: true },
  vehicleRegistration: { type: String, required: true },
  
  status: { 
    type: String, 
    enum: [
      'BOOKED', 
      'CHECKED_IN', 
      'WAITING_IN_QUEUE', 
      'QUALITY_CHECK', 
      'QUALITY_PASSED', 
      'QUALITY_FAILED', 
      'WEIGHING', 
      'PROCUREMENT_COMPLETED', 
      'PAYMENT_INITIATED', 
      'PAYMENT_COMPLETED', 
      'CANCELLED'
    ],
    default: 'BOOKED'
  },
  
  // Quality Check
  moisturePercentage: { type: Number },
  qcInspector: { type: String },
  qcTimestamp: { type: Date },
  
  // Weighment
  grossWeightQtl: { type: Number },
  tareWeightQtl: { type: Number },
  netWeightQtl: { type: Number },
  totalMspPayout: { type: Number },
  weighbridgeOperator: { type: String },
  weighmentTimestamp: { type: Date },
  
  // Payment
  paymentReference: { type: String },
  paymentCompletedAt: { type: Date },
  
  createdAt: { type: Date, default: Date.now },
  checkedInAt: { type: Date }
});

module.exports = mongoose.model('Booking', bookingSchema);
