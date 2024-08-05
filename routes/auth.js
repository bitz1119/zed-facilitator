const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const router = express.Router();
const logger = require("../utils/logger");

router.post("/signup", async (req, res) => {
  try {
    // add checks for mobile number and email
    const { email, phoneNumber, password } = req.body;
    if (await User.findOne({ email }))
      return res.status(400).send("Email already exists");
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ email, phoneNumber, password: hashedPassword });
    await user.save();
    res.status(201).send("User registered");
  } catch (err) {
    res.status(400).send(err.message);
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).send("User not found");
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).send("Invalid credentials");
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "10h",
    });
    console.log(token)
    res.cookie("AccessToken", token, {
      maxAge: 1000 * 60 * 15, // would expire after 15 minutes
      httpOnly: true, // The cookie only accessible by the web server
    //   signed: true, // Indicates if the cookie should be signed
    });
    res.json({ token });
  } catch (err) {
    logger.error(err);
    res.status(400).send(err.message);
  }
});

module.exports = router;
