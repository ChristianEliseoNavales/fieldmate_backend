const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db'); // Import the database connection function
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

connectDB(); // Connect to MongoDB

// Middleware
app.use(cors());
app.use(express.json()); // To parse JSON request bodies

// Routes
const journalRoutes = require('./routes/journalRoutes');
const userRoutes = require("./routes/userRoutes");

app.use('/api/journal', journalRoutes);
app.use('/api/users', userRoutes);
app.use("/api", userRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
