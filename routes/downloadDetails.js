const express = require('express');
const User = require('../models/User');
const router = express.Router();
const xl = require('excel4node');
const path = require('path');

router.post('/alluser', async (req, res) => {
  const { password } = req.body;
  console.log(password);
  
  // Check the password
  if (password !== 'DELHI12') {
    return res.status(401).send('Unauthorized: Incorrect password');
  }

  try {
    const users = await User.find({}).select("-password");

    if (!users || users.length === 0) {
      return res.status(404).send('No users found');
    }

    const wb = new xl.Workbook();
    const ws = wb.addWorksheet('Users');

    const headingColumnNames = [
      "email", "phoneNumber", "geeksterPartner", "step", "photo", "idproof",
      "workExp", "marksheet", "firstName", "middleName", "lastName", "dob",
      "parentName", "state", "district", "pincode", "city", "spokenPrimary",
      "writtenPrimary", "address", "EqYear", "SqYear", "institution", 
      "qualification", "documentType", "documentNumber", "documentName",
      "designation", "organizationName", "roles", "duration", 
      "trainingCompleted", "marks", "certificateURL"
    ];

    // Writing the header row
    headingColumnNames.forEach((heading, index) => {
      ws.cell(1, index + 1).string(heading);
    });

    // Writing user data rows
    users.forEach((user, rowIndex) => {
      headingColumnNames.forEach((columnName, colIndex) => {
        let cellValue = '';

        if (columnName === 'photo' || columnName === 'idproof' || columnName === 'workExp' || columnName === 'marksheet') {
          // Handling the details array, assuming it corresponds to these columns
          if (user.details && user.details.length > 0) {
            const detailIndexMap = {
              'photo': 0,
              'idproof': 1,
              'marksheet': 2,  // Updated mapping for marksheet
              'workExp': 3     // Updated mapping for workExp
            };
            const detailIndex = detailIndexMap[columnName];
            cellValue = user.details[detailIndex] ? user.details[detailIndex].s3Url : '';
          }
        } else {
          // For all other fields
          cellValue = user[columnName] ? user[columnName].toString() : '';
        }

        ws.cell(rowIndex + 2, colIndex + 1).string(cellValue);
      });
    });

    // Save the Excel file to the server
    const fileName = 'users_data.xlsx';
    const filePath = path.join(__dirname, fileName);
    console.log('Excel file generated at:', filePath);

    wb.write(filePath, (err) => {
      if (err) {
        return res.status(500).send('Error generating Excel file');
      }

      // Set headers to prompt download
      res.download(filePath, fileName, (downloadErr) => {
        if (downloadErr) {
          return res.status(500).send('Error downloading file');
        }

        // Remove the file after it has been downloaded
        fs.unlinkSync(filePath);
      });
    });
  } catch (error) {
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;
