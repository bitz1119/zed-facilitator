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
      dob,
      parentName,
      state,
      district,
      pincode,
      city,
      address,
      spokenPrimary,
      writtenPrimary,
      qualificationYear ,
      institution,
      qualification,
      documentType,
      documentNumber,
      documentName,
          organizationName,
          roles,
          duration,
          designation ,
          geeksterPartner,
          EqYear,
          SqYear
  } = req.body;



  try {
      const user = await User.findById(req.user.id);
      console.log(user);

      if (!user) {
          return res.status(404).send('User not found');
      }

      
      // Update user details
      user.firstName = firstName || user.firstName;
      user.middleName = middleName || user.middleName;
      user.lastName = lastName || user.lastName;
      user.dob = dob || user.dob;
      user.parentName = parentName || user.parentName;
      user.state = state || user.state;
      user.district = district || user.district;
      user.pincode = pincode || user.pincode;
      user.city = city || user.city;
      user.address = address || user.address;
      user.spokenPrimary = spokenPrimary || user.spokenPrimary;
      user.writtenPrimary = writtenPrimary || user.writtenPrimary;
      user.year = qualificationYear || user.year;
      user.institution = institution || user.institution;
      user.qualification = qualification || user.qualification;
      user.documentType = documentType || user.documentType;
      user.documentNumber = documentNumber || user.documentNumber;
      user.documentName = documentName || user.documentName;
      user.organizationName = organizationName || user.organizationName;
      user.roles = roles || user.roles;
      user.duration = duration || user.duration;
      user.designation = designation || user.designation;
      user.geeksterPartner = geeksterPartner || user.geeksterPartner;
      user.EqYear =    user.EqYear    || EqYear ;
      user.SqYear = user.SqYear || EqYear ;

      user.step = 2;
      await user.save();

      res.status(200).send('Details updated');
  } catch (err) {
      console.error('An error occurred', err);
      res.status(500).send('Server error');
  }
});

module.exports = router;

