const express = require('express');
const {protect } = require('../middleware/authMiddleware');
const {
    registerUser,
    loginUser,
    getUserInfo,
} = require('../controllers/authController');
const upload = require("../middleware/uploadMiddleware");

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/getUser', protect, getUserInfo);
// router.post("/upload-image", upload.single("image"), (req, res) => {
// if (!req.file) {
//         return res.status(400).json({ message: "No file uploaded" });
//     }
//     // const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
//     // res.status(200).json({ imageUrl });
//     const imageUrl = `${process.env.RENDER_DOMAIN}/uploads/${req.file.filename}`;
//     res.status(200).json({ imageUrl });
// });
// router.post("/upload-image", upload.single("image"), (req, res) => {
//   if (!req.file || !req.file.path) {
//     return res.status(400).json({ message: "Image upload failed" });
//   }

//   const imageUrl = req.file.path; 
//   res.status(200).json({ imageUrl });
// });
router.post("/upload-image", protect, upload.single("image"), async (req, res) => {
  if (!req.file || !req.file.path) {
    return res.status(400).json({ message: "Image upload failed" });
  }

  const imageUrl = req.file.path;

  try {
    const user = await require("../models/User").findByIdAndUpdate(
      req.user.id,
      { profileImageURL: imageUrl },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "Profile picture updated successfully",
      profileImageURL: user.profileImageURL,
    });
  } catch (err) {
    console.error("Error updating user:", err);
    res.status(500).json({ message: "Server error" });
  }
});


module.exports = router;