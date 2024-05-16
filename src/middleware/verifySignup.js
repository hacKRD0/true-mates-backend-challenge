// const express = require("express");
const User = require("../models/user");

// Check if user already exists
const checkForDuplicateUsers = async (req, res, next) => {
	const { name, email, password } = req.body;
	try {
		const user = await User.findOne({ where: { email } });
		// If user exists return 409 error
		if (user) {
			return res.status(409).send("User already exists!");
		}
		// Route to next function in router
		next();
	} catch (error) {
		return res.status(500).send({
			message:
				"User existence check failed due to internal server error!",
			error: error.message,
		});
	}
};

module.exports = checkForDuplicateUsers;
