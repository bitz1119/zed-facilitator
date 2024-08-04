const express = require('express');
const User = require('../models/User');
const router = express.Router();

router.post('/complete-training', async (req, res) => {
    try {
        
        const user = await User.findById(req.user.id);
        user.trainingCompleted = true;
        user.step = 3;
        await user.save();
        res.status(200).send('Training completed');
    } catch (err) {
        res.status(400).send(err.message);
    }
});

module.exports = router;
