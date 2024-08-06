const express = require('express');
const Question = require('../models/Question');

const router = express.Router();

// Route to create a new question
router.post('/put', async (req, res) => {
  try {
    // Create a new question with the data from the request body
    const ques = await Question.create(req.body);

    // Send the created question back to the client
    res.status(201).json(ques);
  } catch (error) {
    // Handle any errors that occur
    console.error('Error creating question:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;
