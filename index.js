const express = require('express');
const mongoose = require('mongoose');
// const authenticate = require('../middleware/authenticate');
const dotenv = require('dotenv');
const authenticate = require('./middleware/authenticate');

dotenv.config();

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error(err));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

app.get('/',(req, res) => {
    res.send("Welcome to Zed Facilitator");
});

const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

// TBD: add middleware to redirect to steps
const detailsRoutes = require('./routes/details');
app.use('/api/details',authenticate, detailsRoutes);


// const trainingRoutes = require('./routes/training');
// app.use('/api/training', trainingRoutes);


// const mocktestRoutes = require('./routes/mocktest');
// app.use('/api/mocktest', mocktestRoutes);


const certificateRoutes = require('./routes/certificate');
app.use('/api/certificate', certificateRoutes);



