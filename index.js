const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const authenticate = require('./middleware/authenticate');
const cors = require('cors')
const cookieParser = require('cookie-parser');

dotenv.config();

const app = express();
const corsOptions = {
    origin: "http://localhost:3000", // replace with your frontend domain
    credentials: true, // allow credentials (cookies) to be sent
  };
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;
console.log(MONGO_URI);

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => logger.info('MongoDB connected'))
    .catch(err => logger.error(err));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

app.get('/',(req, res) => {
    res.send("Welcome to Zed Facilitator");
});
app.get('/check',authenticate,(req,res)=>{
    res.send("Working Cookies");
})

const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

// TBD: add middleware to redirect to steps
const detailsRoutes = require('./routes/details');
app.use('/api/details',authenticate, detailsRoutes);

const personalDetails = require('./routes/personalDetails');
app.use('/api/user',authenticate,personalDetails)


// const trainingRoutes = require('./routes/training');
// app.use('/api/training', trainingRoutes);


// const mocktestRoutes = require('./routes/mocktest');
// app.use('/api/mocktest', mocktestRoutes);


const certificateRoutes = require('./routes/certificate');
const logger = require('./utils/logger');
app.use('/api/certificate', certificateRoutes);



