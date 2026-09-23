const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
require('dotenv').config();

const apiRoutes = require('./routes/api');

const app = express();
const server = http.createServer(app);

// Configure Socket.IO for real-time queue synchronization
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// Attach Socket.IO to Express app
app.set('io', io);

// Middleware
app.use(cors());
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`[KisanSetu API] ${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms`);
  });
  next();
});

// API Routes
app.use('/api', apiRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'HEALTHY',
    service: 'KisanSetu Intelligent Procurement Platform',
    version: '2.0.0',
    timestamp: new Date().toISOString()
  });
});

// Root information endpoint
app.get('/', (req, res) => {
  res.json({
    platform: 'KisanSetu - Intelligent Procurement Slot & Real-Time Queue Management System',
    purpose: 'Reducing farmer waiting time through intelligent slot allocation and real-time procurement queue management',
    environment: 'SIH-2026-Prototype-Ready',
    socketIO: 'Active',
    endpoints: {
      centers: '/api/centers',
      recommendation: '/api/recommendation',
      bookings: '/api/bookings',
      notifications: '/api/notifications',
      admin: '/api/admin/overview'
    }
  });
});

// Socket.IO Connection Handler
io.on('connection', (socket) => {
  console.log(`[Socket.IO] Client connected: ${socket.id}`);

  socket.on('join:center', (centerId) => {
    socket.join(centerId);
    console.log(`[Socket.IO] Client ${socket.id} joined center room: ${centerId}`);
  });

  socket.on('disconnect', () => {
    console.log(`[Socket.IO] Client disconnected: ${socket.id}`);
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('[KisanSetu Server Error]', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`--------------------------------------------------`);
  console.log(`KisanSetu Server running on port ${PORT}`);
  console.log(`REST API: http://localhost:${PORT}/api`);
  console.log(`Socket.IO: Enabled`);
  console.log(`--------------------------------------------------`);
});

module.exports = { app, server };
