const express = require("express");
const router = express.Router();
const { registerUser, checkUserExists, getUserByEmail } = require("../controller/userController");

router.post("/register", registerUser);
router.post("/checkUserExists", checkUserExists);
router.get("/users", getUserByEmail);

module.exports = router;
