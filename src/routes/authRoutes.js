const express = require("express");
const authorizeJWT = require("../middleware/authorizeJWT");
const checkForDuplicateUsers = require("../middleware/verifySignup");
const { register, login } = require("../controllers/userController");

const router = express.Router();

// Test Endpoint
router.get("/test", authorizeJWT, (req, res) => {
	res.send({ message: "hello world!" });
});

// Registration Endpoint
router.post("/register", checkForDuplicateUsers, register);

// Login Endpoint
router.post("/login", login);

module.exports = router;
