//Load modules
const database = require("../models");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sequelize = require("../config/database");
const User = database.User;
require("dotenv").config();

// Registration Function
const register = async (req, res) => {
	const { name, email, password } = req.body;
	// Sync the database
	// Add user to database with the hashed password
	User.create({
		name: name,
		email: email,
		password: bcrypt.hashSync(password, 10),
	})
		.then((user) => {
			return res.status(201).send({
				message: "User registration successful!",
				user,
			});
		})
		.catch((error) => {
			return res.status(409).send({
				message: "User registration failed!",
				error: error.message,
			});
		});
};

// Login Function
const login = async (req, res) => {
	const { email, password } = req.body;
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
				return res.status(401).send("Invalid Credentials!");
			}
		})
		.catch((error) => {
			// Return 409 error if user is not registered
			return res.status(409).send({
				message: "User isn't registered!",
				error: error.message,
			});
		});
};

module.exports = { register, login };
