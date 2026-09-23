const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  farmerMobile: { type: String, required: true },
  tokenNumber: { type: String },
  category: { 
    type: String, 
    enum: ['QUEUE', 'PROCUREMENT', 'PAYMENT', 'SYSTEM'], 
    default: 'SYSTEM' 
  },
  title: { type: String, required: true },
  message: { type: String, required: true },
  channel: { type: String, default: 'IN_APP' }, // IN_APP, SMS_SIMULATED, WHATSAPP_SIMULATED
  isRead: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Notification', notificationSchema);
