const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    phoneNumber: { type: String, required: true },
    password: { type: String, required: true },
    geeksterPartner : {
        type : String,
        required : false,
    },
    step: { type: Number, default: 1 },
    firstName: { type: String, required: false },
    middleName: { type: String, required: false }, // Middle name is optional
    lastName: { type: String, required: false },
    dob: { type: Date, required: false },
    parentName: { type: String, required: false },
    state: { type: String, required: false },
    district: { type: String, required: false },
    pincode: { type: String, required: false },
    city: { type: String, required: false },
    spokenPrimary: { type: String, required: false },
    writtenPrimary: { type: String, required: false },
    address : {type: String, required: false },
  
        year: { type: String, required: false },
        institution: { type: String, required: false },
        qualification: { type: String, required: false },
   
        documentType: { type: String, required: false },
        documentNumber: { type: String, required: false },
        documentName: { type: String, required: false },
   
        
        designation: { type: String, required: false },
        organizationName: { type: String, required: false },
        roles: { type: String, required: false },
        duration: { type: String, required: false },
    
    details: [
            {
                // document: {
                    name: { type: String },
                    s3Url: { type: String }
                // }
            }
    ],
    trainingCompleted: { type: Boolean, default: false },
    marks: Number,
    certificateURL: String
});

module.exports = mongoose.model('User', userSchema);
