// Database Connection
const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
	"postgres://krd:1234@localhost:5432/truemates",
	{
		dialect: "postgres",
		logging: false,
	}
);

sequelize
	.authenticate()
	.then(() => {
		console.log("Connection has been established successfully.");
		sequelize.sync(); // This line will synchronize all models with the database
	})
	.catch((err) => {
		console.error("Unable to connect to the database:", err);
	});

module.exports = sequelize;
