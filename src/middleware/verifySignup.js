// Middleware function to prevent a duplicate user from being created
// Load modules
const User = require("../models").User;

const checkForDuplicateUsers = async (req, res, next) => {
	const { name, email, password } = req.body;
	User.findOne({ where: { email: email } })
		.then((user) => {
			if (user) {
				res.status(409).send({ error: "User already exists!" });
				return;
			}
			next();
		})
		.catch((error) => {
			console.log(error);
			return res.status(500).send({
				message:
					"User existence check failed due to internal server error!",
				error: error.message,
			});
		});
};

module.exports = checkForDuplicateUsers;
