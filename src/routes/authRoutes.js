// Load modules
const express = require("express");
const authorizeJWT = require("../middleware/authorizeJWT");
const checkForDuplicateUsers = require("../middleware/verifySignup");
const authController = require("../controllers").auth;

const router = express.Router();

// Test Endpoint
router.get("/test", authorizeJWT, (req, res) => {
	res.send({ message: "hello world!" });
});

// Registration Endpoint
router.post("/register", checkForDuplicateUsers, authController.register);

// Login Endpoint
router.post("/login", authController.login);

module.exports = router;
