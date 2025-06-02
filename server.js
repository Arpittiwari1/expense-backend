require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const incomeRoutes = require("./routes/incomeRoutes");
const expenseRoutes = require("./routes/expenseRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const upload = require("./middleware/upload"); // Importing the multer upload middleware

const app = express();

// CORS configuration
app.use(
    cors({
        origin: process.env.CLIENT_URL || "*",  // Ensure CLIENT_URL is set correctly
        methods: ["GET", "POST", "PUT", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorization"],
    })
);

// Middleware
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));  // Serve uploaded files

// Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/income", incomeRoutes);
app.use("/api/v1/expense", expenseRoutes);
app.use("/api/v1/dashboard", dashboardRoutes);

// Image upload route
app.post("/upload", upload.single("image"), (req, res) => {
    if (!req.file) {
        return res.status(400).send("No file uploaded");
    }

    // Construct the URL of the uploaded image
    const imageUrl = `${process.env.API_URL}/uploads/${req.file.filename}`;

    // Respond with the image URL
    res.json({ imageUrl });
});

// Ping route to check server health
app.get('/ping', (req, res) => {
    res.send('Server is alive');
});

// Connect to database
connectDB();

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


// require("dotenv").config();
// const express = require("express");
// const cors = require("cors");
// const path = require("path");
// const connectDB = require("./config/db")
// const authRoutes = require("./routes/authRoutes")
// const incomeRoutes = require("./routes/incomeRoutes")
// const expenseRoutes = require("./routes/expenseRoutes")
// const dashboardRoutes = require("./routes/dashboardRoutes")


// const app = express();

// app.use(
//     cors({
//         origin: process.env.CLIENT_URL || "*",
//         methods: ["GET", "POST", "PUT", "DELETE"],
//         allowedHeaders: ["Content-Type", "Authorization"],
//     })
// );

// app.use(express.json());
// app.get('/ping', (req, res) => {
//   res.send('Server is alive');
// });

// connectDB();

// app.use("/api/v1/auth", authRoutes);
// app.use("/api/v1/income", incomeRoutes);
// app.use("/api/v1/expense", expenseRoutes);
// app.use("/api/v1/dashboard",dashboardRoutes);
// app.use("/uploads",express.static(path.join(__dirname, "uploads")));

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//     console.log(`Server is running on port ${PORT}`);
//   });
