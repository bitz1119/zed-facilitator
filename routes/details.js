const express = require('express');
const User = require('../models/User');
const router = express.Router();
const authenticate = require('../middleware/authenticate');
const multer = require('multer');
const fs = require('fs');
const s3 = require('../utils/s3Client');
const logger = require('../utils/logger');

// Set up multer for file uploads
const upload = multer({ dest: 'uploads/' });

router.post('/details', authenticate, upload.single('document'), async (req, res) => {
    const { name, fathersName, qualification } = req.body;
    const document = req.file;
    const user = await User.findById(req.user.id);

    if (!document) {
        return res.status(400).send('Document file is required');
    }

    if (!user) {
        return res.status(404).send('User not found');
    }

    try {
        // Read file content
        const fileContent = fs.readFileSync(document.path);

        // Setting up S3 upload parameters
        const params = {
            Bucket: process.env.S3_BUCKET,
            Key: `${user.email}_${user._id}/documents/${document.filename}`, // File name you want to save as in S3
            Body: fileContent
        };
        // Uploading files to the bucket
        const data = await s3.upload(params).promise();

        // Delete the file from the local system
        fs.unlinkSync(document.path);

        user.details = {
            name,
            fathersName,
            qualification,
            document: {
                name: document.originalname,
                s3Url: data.Location
            }
        };
        user.step = 2;
        await user.save();

        res.status(200).send('Details updated');
    } catch (err) {
        logger.error('An error occurred', err);
        res.status(400).send(err.message);
    }
});

module.exports = router;



//TBD : complete profile needed here
