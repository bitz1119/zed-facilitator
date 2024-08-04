const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    phoneNumber: { type: String, required: true },
    password: { type: String, required: true },
    step: { type: Number, default: 1 },
    details: {
        name: String,
        fathersName: String,
        qualification: String,
        document: {
            name: {type: String},
            s3Url: {type: String}        
        }
    },
    trainingCompleted: { type: Boolean, default: false },
    marks: Number,
    certificateURL: String
});

module.exports = mongoose.model('User', userSchema);
