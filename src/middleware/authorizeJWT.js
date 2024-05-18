// Middleware function to verify the JWT token
// Load modules
const jwt = require("jsonwebtoken");

const authorizeJWT = async (req, res, next) => {
	// Parsing the request
	const authHeader = req.headers["authorization"];
	const token = authHeader && authHeader.split(" ")[1];

	// Checks if JWT token was sent with the request
	if (!token) return res.status(403).send("Error! Token was not provided.");

	// Verifies the JWT token sent
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
