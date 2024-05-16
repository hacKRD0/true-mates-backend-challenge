// Post model
const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const User = require("./user");

// Define the post schema
const Post = sequelize.define("Post", {
	description: DataTypes.TEXT,
	photoUrl: DataTypes.STRING,
});

// Create a one-to-many relation between user and posts
Post.belongsTo(User);
User.hasMany(Post);

// sequelize
// 	.sync({ force: true })
// 	.then(() => {
// 		console.log("Posts table created successfully!");
// 	})
// 	.catch((error) => {
// 		console.error("Unable to create table : ", error);
// 	});

module.exports = Post;
