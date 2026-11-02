const express = require('express');
const feedbackRoutes = require('./routes/feedbackRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

app.use(express.json());
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Student Feedback Management API is running',
    endpoints: {
      health: 'GET /health',
      feedback: 'POST, GET /api/feedback',
      updateStatus: 'PATCH /api/feedback/:id',
    },
  });
});
app.get('/health', (req, res) => res.status(200).json({ status: 'ok' }));
app.use('/api/feedback', feedbackRoutes);
app.use((req, res) => res.status(404).json({ error: 'Route not found' }));
app.use(errorHandler);

module.exports = app;
