const express = require("express");
const User = require("../models/User");
const router = express.Router();
const authenticate = require('../middleware/authenticate');
router.post('/marks',authenticate,async(req,res)=>{
  const user = await User.findById(req.user.id);

  if (!user) {
      return res.status(404).send('User not found');
  }
  user.marks=req.body.marks;
  await user.save();
  return res.status(200).json(
    {
      "message": "Marks updated successfully",
    }
  )
})

module.exports = router;
