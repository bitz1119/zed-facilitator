const express = require("express");
const User = require("../models/User");
const SendMail = require("../service/mail");
const router = express.Router();
const bcrypt = require("bcryptjs");
router.patch('/update/:id',async (req,res)=>{
  try{
    const {token,password}=req.body;
    const user = await User.findById(req.params.id);
    if(!user){
      return res.status(404).json({message:"User not found"});
      }
      console.log(user);
    if(user.Token!=token){
      return res.status(401).json({message:"Invalid token"});
    }
    // console.log("working");
    // user.password=password;
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log(hashedPassword)
    user.password = hashedPassword;
    user.token="";
    await user.save();
    console.log("working")
    return res.status(200).json({message : "password Update"});

  }catch(err){
    res.status(500).send({message: err.message})
  }


})


module.exports = router;

