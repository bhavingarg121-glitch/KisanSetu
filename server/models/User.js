const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  mobile: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { 
    type: String, 
    enum: ['FARMER', 'PROCUREMENT_OFFICER', 'GATE_OPERATOR', 'WEIGHBRIDGE_OPERATOR', 'ADMIN'],
    default: 'FARMER' 
  },
  kisanId: { type: String },
  village: { type: String },
  district: { type: String },
  state: { type: String, default: 'Uttar Pradesh' },
  preferredLanguage: { type: String, default: 'en' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
