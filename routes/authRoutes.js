const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../model/user");
const dotenv = require("dotenv");

dotenv.config();
const router = express.Router();

// Test Endpoint
router.get("/test", (req, res) => {
	res.send({ message: "hello world!" });
});

// Registration Endpoint
router.post("/register", async (req, res) => {
	const { name, email, password } = req.body;
	try {
		const hashedPassword = await bcrypt.hash(password, 12);
		console.log(hashedPassword);
		const user = await User.create({
			name: name,
			email: email,
			password: hashedPassword,
		});
		res.status(201).send(user);
	} catch (error) {
		res.status(500).send(error.message);
	}
});

// Login Endpoint
router.post("/login", async (req, res) => {
	const { email, password } = req.body;
	try {
		const user = await User.findOne({ where: { email } });
		const promise = await bcrypt.compare(password, user.password);
		if (!user) {
			return res.status(404).send("User does not exist");
		}
		if (!promise) {
			return res.status(401).send("Invalid Credentials");
		}
		const token = jwt.sign({ userId: user.id }, process.env.SECRET_KEY, {
			expiresIn: "1h",
		});
		res.send({ user, token });
	} catch (error) {
		res.status(500).send(error.message);
	}
});

module.exports = router;
