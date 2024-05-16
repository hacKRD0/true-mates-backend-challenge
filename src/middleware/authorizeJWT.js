// Load modules
// const express = require("express");
// const User = require("../models/user");
const jwt = require("jsonwebtoken");

const authorizeJWT = async (req, res, next) => {
	const authHeader = req.headers["authorization"];
	const token = authHeader && authHeader.split(" ")[1];

	if (!token) return res.status(403).send("Error! Token was not provided.");

	jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
		if (err)
			return res.status(401).send({
				message: "Unauthorized access!",
				error: error.message,
			});
		// Add user data to the req body
		req.user = user;
		next();
	});
};

module.exports = authorizeJWT;
