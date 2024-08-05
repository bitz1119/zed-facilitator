const express = require('express');
const router = express.Router();
const fs = require('fs');
const multer = require('multer');
const AWS = require('aws-sdk');
const User = require('../models/User'); // Adjust the path as necessary
const authenticate = require('../middleware/authenticate'); // Adjust the path as necessary


router.post('/d', async (req, res) => {
  
  const user = await User.findById(req.user.id);

  if (!user) {
      return res.status(404).send('User not found');
  }
  return res.send(user);
}
)

