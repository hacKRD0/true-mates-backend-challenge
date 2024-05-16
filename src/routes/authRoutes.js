const express = require("express");
const auth = require("../middleware/auth");
const { register, login } = require("../controllers/userController");

const router = express.Router();

// Test Endpoint
router.get("/test", auth.authenticateToken, (req, res) => {
	res.send({ message: "hello world!" });
});

// Registration Endpoint
router.post("/register", auth.userExists, register);

// Login Endpoint
router.post("/login", login);

module.exports = router;
