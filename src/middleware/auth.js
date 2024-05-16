// Load modules
const express = require("express");
const User = require("../models/user");
const jwt = require("jsonwebtoken");

// Check if user already exists
const userExists = async (req, res, next) => {
	const { name, email, password } = req.body;
	try {
		const user = await User.findOne({ where: { email } });
		// If user exists return 409 error
		if (user) {
			return res.status(409).send("User already exists");
		}
		// Route to next function in router
		next();
	} catch (error) {
		return res.status(500).send({
			message: "User existence check failed due to internal server error",
			error: error.message,
		});
	}
};

const authenticateToken = async (req, res, next) => {
	const authHeader = req.headers["authorization"];
	// console.log(req.headers);
	// console.log(authHeader);
	const token = authHeader && authHeader.split(" ")[1];

	if (!token) return res.status(401).send("Error! Token was not provided.");

	jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
		if (err)
			return res
				.status(403)
				.send({
					message: "JWT token verification failed",
					error: error.message,
				});
		req.user = user;
		// console.log(req.user);
		next();
	});
};

module.exports = { userExists, authenticateToken };
