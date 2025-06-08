const multer = require('multer');
const fs = require('fs');
const path = require('path')

// Storage configuration for Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // In production, use a different directory for storing files (use Render's storage)
    const uploadPath = isProduction ? 'uploads/' : 'uploads/';  // Change if necessary for Render storage location
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    // Create a unique filename using the timestamp and original name
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

// File filter to ensure only images are uploaded
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, JPG, and PNG are allowed.'), false);
  }
};

// Initialize Multer
const upload = multer({ storage, fileFilter });

// To serve static files (like images) from the 'uploads/' directory
const express = require('express');
const app = express();

// In production, serve images via HTTP on Render
const isProduction = process.env.NODE_ENV === "production";

if (isProduction) {
  app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
}

module.exports = upload;


// const multer = require('multer');

// const storage = multer.diskStorage({
//     destination : (req,file,cb) =>{
//     cb(null, 'uploads/');
// },
// filename: (req,file,cb) =>{
//     cb(null, `${Date.now()}-${file.originalname}`);
// }
// });
// const fileFilter = (req,file,cb) =>{
//     const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
//     if (allowedTypes.includes(file.mimetype)) {
//         cb(null, true);
//     } else {
//         cb(new Error('Invalid file type. Only JPEG, JPG and PNG are allowed.'), false);
//     }
// }

// const upload = multer({ storage, fileFilter });

// module.exports = upload;

