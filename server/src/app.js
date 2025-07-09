const express = require('express');
const cors = require('cors');
const sequelize = require('./config/db');
const loggerMiddleware = require('./middleware/loggerMiddleware');

const resumeRoutes = require('./routes/resumeRoutes');
const jobRoutes = require('./routes/jobRoutes');
const authRoutes = require('./routes/authRoutes');
const aiRoutes = require('./routes/aiRoutes');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(loggerMiddleware);

app.use('/api/auth', authRoutes);
app.use('/api/user', resumeRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/user', aiRoutes);

sequelize.sync().then(() => {
  console.log('✅ Database connected successfully');
});

module.exports = app;
