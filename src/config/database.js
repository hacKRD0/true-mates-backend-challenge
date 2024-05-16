// Database Connection
const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
	`postgres://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`,
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
