const express = require('express');
const User = require('../models/User');
const router = express.Router();
const authenticate = require('../middleware/authenticate');

router.post('/mock-test', authenticate, async (req, res) => {
    const { marks } = req.body;
    try {
        const user = await User.findById(req.user.id);
        user.marks = marks;
        user.step = 4;
        await user.save();
        res.status(200).send('Mock test completed');
    } catch (err) {
        res.status(400).send(err.message);
    }
});

module.exports = router;
