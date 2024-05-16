//Load modules
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const dotenv = require("dotenv").config();
const sequelize = require("../config/database");

// Assigning variable router to express.Router
const router = express.Router();

// Registration Function
const register = async (req, res) => {
	const { name, email, password } = req.body;
	// Sync the database
	sequelize
		.sync()
		.then(() => {
			// Create a hash of the password
			const hashedPassword = bcrypt.hashSync(password, 10);
			// Add user to database with the hashed password
			User.create({
				name: name,
				email: email,
				password: hashedPassword,
			})
				.then((user) => {
					// Generate a JWT token upon successful user creation
					let token = jwt.sign(
						{ userId: user.id },
						process.env.SECRET_KEY,
						{
							expiresIn: 1 * 24 * 60 * 60 * 1000,
						}
					);
					return res.status(201).send({
						message: "User registration successful!",
						user,
						token,
					});
				})
				.catch((error) => {
					return res.status(409).send({
						message: "User registration failed!",
						error: error.message,
					});
				});
		})
		.catch((error) => {
			return res.status(500).send({
				message:
					"User registration failed due to internal server error!",
				error: error.message,
			});
		});
};

// Login Function
const login = async (req, res) => {
	const { email, password } = req.body;
	sequelize
		.sync()
		.then(() => {
			// Check if user is registered
			User.findOne({ where: { email } })
				.then((user) => {
					// Validate credentials
					const valid = bcrypt.compareSync(password, user.password);
					if (valid) {
						// Generate a JWT token upon validation
						let token = jwt.sign(
							{ userId: user.id },
							process.env.SECRET_KEY,
							{
								expiresIn: 1 * 24 * 60 * 60 * 1000,
							}
						);
						return res.status(200).send({ user, token });
					} else {
						return res.status(401).send("Authentication Failed!");
					}
				})
				.catch((error) => {
					// Return 409 error if user is not registered
					return res.status(409).send({
						message: "User isn't registered!",
						error: error.message,
					});
				});
		})
		.catch((error) => {
			return res.status(500).send({
				message: "Login failed due to internal server error!",
				error: error.message,
			});
		});
};

module.exports = { register, login };
