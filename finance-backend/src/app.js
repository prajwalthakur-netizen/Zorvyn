const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://finance-app-beta-eosin.vercel.app'
  ],
  credentials: true
}));

app.use(express.json());


app.use('/api/auth',      require('./routes/authRoutes'));
app.use('/api/users',     require('./routes/userRoutes'));
app.use('/api/records',   require('./routes/recordRoutes'));
app.use('/api/analytics', require('./routes/analyticsRoutes'));

module.exports = app;