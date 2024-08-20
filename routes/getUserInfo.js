const express = require('express');

const User = require('../models/User'); // Adjust the path as necessary
const router = express.Router();


router.get('/user', async (req, res) => {
  
  const user = await User.findById(req.user.id).select("-password");

  if (!user) {
      return res.status(404).send('User not found');
  }
  return res.status(200).json(user);
}
)
module.exports=router;

