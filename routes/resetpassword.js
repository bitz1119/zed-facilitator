const express = require("express");
const User = require("../models/User");
const SendMail = require("../service/mail");
const router = express.Router();

function generateToken(){
  return Math.random().toString(36).substr(2, 10);
}


router.post('/reset',async(req,res)=>{
  try{
    const user = await User.findOne({email:req.body.email})
    if(!user){
      return res.status(404).json({message:"User not found"})
    }
    const token = generateToken();
    user.Token = token;
    await user.save(); // Save the token to the database

    // Send the reset email
    await SendMail({
      from: 'anuj@geekster.in',
      to: user.email,
      subject: 'Password Reset Request',
      text: `You requested a password reset. Please use the following token to reset your password: ${token}`,
      html: `<p>You requested a password reset. Please use the following token to reset your password: <strong>${token}</strong></p>`
    });

    res.status(200).json({ message: `Reset email sent for user ${user._id}` });
      

  }catch(err){
    res.status(500).send({message: err.message})
  }
}
)





module.exports = router;

