const express = require('express');
const User = require('../models/User');
const router = express.Router();
const authenticate = require('../middleware/authenticate');
const multer = require('multer');
const fs = require('fs');
const s3 = require('../utils/s3Client');
const logger = require('../utils/logger');



router.post('/personaldetails', authenticate, async (req, res) => {
  const {
      firstName,
      middleName,
      lastName,
      mobileNumber,
      dateOfBirth,
      fatherMotherName,
      state,
      district,
      pincode,
      city,
      spokenLanguage,
      writtenLanguage,
      educationalQualifications,
      workExperience,
      idProofDetails,
      qualification
  } = req.body;

  if (!firstName || !lastName || !mobileNumber || !dateOfBirth || !fatherMotherName || !state || !district || !pincode || !city || !spokenLanguage || !writtenLanguage || !qualification) {
      return res.status(400).send('Missing required fields');
  }

  try {
      const user = await User.findById(req.user.id);
      console.log(user);

      if (!user) {
          return res.status(404).send('User not found');
      }

      // Additional validation checks
      if (!/^\d{10}$/.test(mobileNumber)) {
          return res.status(400).send('Invalid mobile number');
      }

      if (!/^\d{6}$/.test(pincode)) {
          return res.status(400).send('Invalid pincode');
      }
      console.log(educationalQualifications);
      // Parse JSON fields
      // let parsedEducationalQualifications, parsedWorkExperience, parsedIdProofDetails;
      // try {
      //     parsedEducationalQualifications = JSON.parse(educationalQualifications);
      //     parsedWorkExperience = JSON.parse(workExperience);
      //     parsedIdProofDetails = JSON.parse(idProofDetails);
      //     console.log("working");
      // } catch (err) {
      //     return res.status(400).send('Invalid JSON format for educationalQualifications, workExperience, or idProofDetails');
      // }

      // Validate parsed fields
      if (!Array.isArray(educationalQualifications) || !educationalQualifications.length) {
          return res.status(400).send('Invalid educational qualifications');
      }

      if (!Array.isArray(workExperience) || !workExperience.length) {
          return res.status(400).send('Invalid work experience');
      }

      if (!idProofDetails || !idProofDetails.documentType || !idProofDetails.documentNumber || !idProofDetails.nameAsPerDocument) {
          return res.status(400).send('Invalid ID proof details');
      }

      // Update user details
      user.details = {
          firstName,
          middleName,
          lastName,
          mobileNumber,
          dateOfBirth,
          fatherMotherName,
          state,
          district,
          pincode,
          city,
          spokenLanguage,
          writtenLanguage,
          educationalQualifications: educationalQualifications,
          workExperience: workExperience,
          idProofDetails: idProofDetails,
          qualification
      };
      user.step = 2;
      await user.save();

      res.status(200).send('Details updated');
  } catch (err) {
      console.error('An error occurred', err);
      res.status(500).send('Server error');
  }
});

module.exports = router;

