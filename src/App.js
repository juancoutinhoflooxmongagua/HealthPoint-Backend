require('dotenv').config();

const express = require('express');
const app = express();
const cors = require('cors');

app.use(express.json());
app.use(cors({ origin: '*' }));

const userRoutes = require('../routes/userRoutes');
const authRoutes = require('../routes/authRoutes');
const jobRoutes = require('../routes/jobRouter');
const hospitalRoutes = require('../routes/hospitalRoutes');
const LeaderboardRoutes = require('../routes/LeaderboardRoutes')
const StaticsRoutes = require('../routes/StatisticsRoutes')
const PatientsRoutes = require('../routes/patientRoutes')
const notifyRoute = require('../routes/notifyRoute')

app.use('/', userRoutes);
app.use('/jobs', jobRoutes);
app.use('/auth', authRoutes);
app.use('/hospital', hospitalRoutes);
app.use('/stats', StaticsRoutes)
app.use('/leaderboard', LeaderboardRoutes)
app.use('/patients', PatientsRoutes)
app.use('/notifications', notifyRoute)

module.exports = app;
