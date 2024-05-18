// Middleware function to prevent a duplicate user from being created
// Load modules
const User = require("../models").User;

// Check if user already exists
const checkForDuplicateUsers = async (req, res, next) => {
	const { name, email, password } = req.body;
	User.findOne({ where: { email } })
		.then((user) => {
			if (user) {
				response.status(409).send({ error: "User already exists!" });
				return;
			}
			next();
		})
		.catch((error) => {
			return res.status(500).send({
				message:
					"User existence check failed due to internal server error!",
				error: error.message,
			});
		});
};

module.exports = checkForDuplicateUsers;
