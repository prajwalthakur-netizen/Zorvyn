const express = require('express');
const cors = require('cors');

const app = express();

const corsOptions = {
  origin: [
    'http://localhost:3000',
    'https://zorvyn-olive-phi.vercel.app'
  ],
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

app.use(cors(corsOptions));

app.use(express.json());

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/records', require('./routes/recordRoutes'));
app.use('/api/analytics', require('./routes/analyticsRoutes'));

module.exports = app;