// User model
const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const User = sequelize.define("User", {
	name: { type: DataTypes.STRING, allowNull: false },
	email: {
		type: DataTypes.STRING,
		unique: true,
		isEmail: true,
		allowNull: false,
	},
	password: { type: DataTypes.STRING, allowNull: false },
});

// sequelize
// 	.sync({ force: true })
// 	.then(() => {
// 		console.log("Users table created successfully!");
// 	})
// 	.catch((error) => {
// 		console.error("Unable to create table : ", error);
// 	});

module.exports = User;
