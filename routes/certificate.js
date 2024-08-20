const express = require('express');
const multer = require('multer');
const mime = require('mime-types'); 
const fs = require('fs');
const User = require('../models/User');
const router = express.Router();
const authenticate = require('../middleware/authenticate');
const s3 = require('../utils/s3Client');
const logger = require('../utils/logger');

const upload = multer({ dest: 'uploads/' });

router.post('/upload-certificate', authenticate, upload.single('certificate'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).send('No file uploaded');
        }

        const file = req.file;
        const user = await User.findById(req.user.id);
        
        if (!user) {
            return res.status(404).send('User not found');
        }

        logger.info(file);
        const fileContent = fs.readFileSync(file.path);
        console.log(fileContent)
        const originalName1 = file.originalname
        const uploadParams = {
            Bucket: process.env.S3_BUCKET,
            Key: `${user.email}_${user._id}/certificates/${originalName1}`,
            Body: fileContent,
            ContentType: mime.lookup(file.originalname),
            ContentDisposition: 'inline',

        };

        s3.upload(uploadParams, async (err, data) => {
            try {
                if (err) {
                    logger.error('Error uploading to S3', err);
                    return res.status(500).send('Error uploading file');
                }

                user.certificateURL = data.Location;
                user.step = 5;
                await user.save();

                // Remove the file after upload to S3
                fs.unlink(file.path, (unlinkErr) => {
                    if (unlinkErr) {
                        logger.warn('Error deleting local file', unlinkErr);
                    }
                });

                res.status(200).send('Certificate uploaded successfully');
            } catch (saveError) {
                logger.error('Error saving user data', saveError);
                res.status(500).send('Internal server error');
            }
        });
    } catch (error) {
        logger.error('Internal server error', error);
        res.status(500).send('Internal server error');
    }
});

module.exports = router;
