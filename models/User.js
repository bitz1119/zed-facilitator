const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    phoneNumber: { type: String, required: true },
    password: { type: String, required: true },
    zedPartner : {
        type : String,
        required : false,
    },
    step: { type: Number, default: 1 },
    firstName: { type: String, required: false },
    middleName: { type: String, required: false }, // Middle name is optional
    lastName: { type: String, required: false },
    dateOfBirth: { type: Date, required: false },
    fatherMotherName: { type: String, required: false },
    state: { type: String, required: false },
    district: { type: String, required: false },
    pincode: { type: String, required: false },
    city: { type: String, required: false },
    spokenLanguage: { type: String, required: false },
    writtenLanguage: { type: String, required: false },
    educationalQualifications: [{
        year: { type: String, required: false },
        institution: { type: String, required: false },
        qualification: { type: String, required: false }
    }],
    idProofDetails: {
        documentType: { type: String, required: false },
        documentNumber: { type: String, required: false },
        nameAsPerDocument: { type: String, required: false }
    },
    workExperience: [{
        typeOfExperience: { type: String, required: false },
        trainingCertificationName: { type: String, required: false },
        organizationName: { type: String, required: false },
        rolesResponsibilities: { type: String, required: false },
        duration: { type: String, required: false }
    }],
    details: {
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
