const express = require('express');
const router = express.Router();
const fs = require('fs');
const multer = require('multer');
const AWS = require('aws-sdk');
const User = require('../models/User'); // Adjust the path as necessary
const authenticate = require('../middleware/authenticate'); // Adjust the path as necessary

// Multer setup
// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, 'uploads/');
//     },
//     filename: function (req, file, cb) {
//         cb(null, file.originalname);
//     }
// });

// const upload = multer({ storage: storage });
const upload = multer({ dest: 'uploads/' });

// AWS S3 setup
const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

router.post('/details', authenticate, upload.fields([{ name: 'photo' }, { name: 'idproof' }, { name: 'workExp' }, { name: 'marksheet' }]), async (req, res) => {
    const files = req.files;
    const user = await User.findById(req.user.id);

    if (!user) {
        return res.status(404).send('User not found');
    }

    try {
        const details = [];

        for (let key in files) {
            if (files[key] && files[key][0]) {
                const document = files[key][0];

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
                // console.log(data);  

                // Delete the file from the local system
                fs.unlinkSync(document.path);

                details.push({
                    name: document.originalname,
                    s3Url: data.Location
                });
                
            }
        }
        console.log(details);
        // Update user details
        user.details=details;
        user.step = 3;
        await user.save();
        res.status(200).send('Details updated');
    } catch (err) {
        console.error('An error occurred', err);
        res.status(500).send('Server error');
    }
});

module.exports = router;
