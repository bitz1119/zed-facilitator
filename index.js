const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const authenticate = require('./middleware/authenticate')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser');
dotenv.config()
const app = express()
app.use(express.urlencoded({ extended: true }));


// const corsOptions = {
//     origin: "http://localhost:3000", // replace with your frontend domain
//     credentials: true, // allow credentials (cookies) to be sent
//     withCredentials: true
// };
app.use(cors())
app.use(cookieParser())
app.use(express.json())

const PORT = process.env.PORT || 3000
const MONGO_URI = process.env.MONGO_URI
console.log(MONGO_URI)

mongoose
    .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => logger.info('MongoDB connected'))
    .catch((err) => logger.error(err))

app.get('/', (req, res) => {
    res.send('Welcome to Zed Facilitator')
})
app.get('/check', authenticate, (req, res) => {
    res.send('Working Cookies')
})

const authRoutes = require('./routes/auth')
app.use('/api/auth', authRoutes)

// TBD: add middleware to redirect to steps
const detailsRoutes = require('./routes/details')
app.use('/api/details', authenticate, detailsRoutes)

const personalDetails = require('./routes/personalDetails')
app.use('/api/user', authenticate, personalDetails)

// const trainingRoutes = require('./routes/training');
// app.use('/api/training', trainingRoutes);

// const getUserInfo = require('./routes/getUserInfo');
// app.use('/api/info',authenticate,getUserInfo);
const getUserInfo = require('./routes/getUserInfo')
app.use('/api/info', authenticate, getUserInfo)

const certificateRoutes = require('./routes/certificate')
const logger = require('./utils/logger')
app.use('/api/certificate', certificateRoutes)

const QuestionRoutes = require('./routes/question')
app.use('/api/questions', QuestionRoutes)

const GetQuestionRoutes = require('./routes/getQuestion')
app.use('/api/questions', GetQuestionRoutes)

const MarksRoutes = require('./routes/marks')
app.use('/api/questions', MarksRoutes)


const UpdateDetails = require('./routes/updateUserDetails')
app.use('/api/update', UpdateDetails)

const ResetPasword = require('./routes/resetpassword')
app.use('/api/password', ResetPasword)

const updatePassword = require('./routes/updatepassword')
app.use('/api/password', updatePassword)

app.set('view engine', 'ejs');

app.get('/send-email-view', (req, res) => {
    res.render('sendEmail');
});
const AllUser = require('./routes/downloadDetails')
app.use('/api/download',AllUser)

app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
