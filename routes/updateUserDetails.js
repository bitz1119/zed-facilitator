const express = require('express');
const router = express.Router();
const fs = require('fs');
const multer = require('multer');
const AWS = require('aws-sdk');
const User = require('../models/User');
const authenticate = require('../middleware/authenticate');

// Multer setup for file uploads
const upload = multer({ dest: 'uploads/' });

// AWS S3 setup
const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION
});

// Function to delete a file from S3
const deleteFromS3 = async (s3Url) => {
    const params = {
        Bucket: process.env.S3_BUCKET,
        Key: s3Url.split('.com/')[1] // Extract key from S3 URL
    };

    await s3.deleteObject(params).promise();
};

// Function to upload a file to S3
const uploadToS3 = async (document, user) => {
    const fileContent = fs.readFileSync(document.path);
    const params = {
        Bucket: process.env.S3_BUCKET,
        Key: `${user.email}_${user._id}/documents/${document.originalname}`,
        Body: fileContent,
    };

    const data = await s3.upload(params).promise();

    // Delete the file from the local system after uploading
    fs.unlinkSync(document.path);

    return data.Location; // S3 file URL
};

// PATCH route to update user details and handle file uploads
// router.patch('/details', authenticate, upload.fields([
//     { name: 'photo' },
//     { name: 'idproof' },
//     { name: 'workExp' },
//     { name: 'marksheet' }
// ]), async (req, res) => {
//     const updates = req.body;
//     const files = req.files;

//     try {
//         const user = await User.findById(req.user.id);
//         if (!user) {
//             return res.status(404).send('User not found');
//         }

//         // Update user details dynamically
//         Object.keys(updates).forEach((key) => {
//             if (user[key] !== undefined) {
//                 user[key] = updates[key];
//             }
//         });

//         const details = user.details || []; // Initialize details if not present

//         // Process and upload files
//         for (let key in files) {
//             // console.log(key,73)
//             if (files[key] && files[key][0]) {
//                 const document = files[key][0];

//                 // Check if the user already has a document of this type
//                 const existingDetailIndex = details.findIndex(detail => detail.name === document.originalname);
//                 console.log(details[existingDetailIndex])
//                 if (existingDetailIndex !== -1) {
//                     // Delete the existing document from S3
//                     await deleteFromS3(details[existingDetailIndex].s3Url);
//                     // Remove the existing document detail
//                     details.splice(existingDetailIndex, 1);
//                 }

//                 // Upload the new document to S3
//                 const s3Url = await uploadToS3(document, user);
//                 // console.log(document);
//                 // Add the new document details
//                 details.push({
//                     name: document.fieldname,
//                     s3Url: s3Url
//                 });
//             }
//         }

//         user.details = details; // Update user details with new files info
//         await user.save();

//         res.status(200).send('Details updated');
//     } catch (err) {
//         console.error('An error occurred', err);
//         res.status(500).send('Server error');
//     }
// });


router.patch('/details', authenticate, upload.fields([
    { name: 'photo' },
    { name: 'idproof' },
    { name: 'workExp' },
    { name: 'marksheet' }
]), async (req, res) => {
    const updates = req.body;
    const files = req.files;

    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).send('User not found');
        }

        // Update user details dynamically
        Object.keys(updates).forEach((key) => {
            if (user[key] !== undefined) {
                user[key] = updates[key];
            }
        });

        let details = user.details || []; // Initialize details if not present

        // Process and upload files
        for (let key in files) {
            if (files[key] && files[key][0]) {
                const document = files[key][0];

                // Handle each document type separately
                const existingDetailIndex = details.findIndex(detail => detail.name === document.fieldname);

                if (existingDetailIndex !== -1) {
                    // Delete the existing document from S3
                    await deleteFromS3(details[existingDetailIndex].s3Url);
                    // Remove the existing document detail
                    details.splice(existingDetailIndex, 1);
                }

                // Upload the new document to S3
                const s3Url = await uploadToS3(document, user);
                // Add the new document details
                details.push({
                    name: document.fieldname,
                    s3Url: s3Url
                });
            }
        }

        user.details = details; // Update user details with new files info
        await user.save();

        res.status(200).send('Details updated');
    } catch (err) {
        console.error('An error occurred', err);
        res.status(500).send('Server error');
    }
});

module.exports = router;