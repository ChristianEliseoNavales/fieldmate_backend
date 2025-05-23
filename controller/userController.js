const User = require("../models/userSchema");

const registerUser = async (req, res) => {
  try {
    const {
      uid,
      firstName,
      lastName,
      email,
      role,
      supervisorNumber,
      company,
      arrangement,
    } = req.body;

    const newUser = new User({
      uid,
      firstName,
      lastName,
      email,
      role,
      supervisorNumber,
      company,
      arrangement,
    });

    await newUser.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Failed to register user", error });
  }
};

const checkUserExists = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (user) {
      console.log("User found:", user);
      res.json({
        exists: true,
        user: {
          email: user.email,
          role: user.role,
          firstName: user.firstName,
          lastName: user.lastName,
        },
      });
    } else {
      res.json({ exists: false });
    }
  } catch (error) {
    console.error("Error checking user:", error);
    res.status(500).json({ error: "Server error" });
  }
};

const getUserByEmail = async (req, res) => {
  const { email } = req.query;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json({
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      company: user.company,
      role: user.role, 
    });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};


module.exports = {
  registerUser, 
  getUserByEmail,
  checkUserExists,
};